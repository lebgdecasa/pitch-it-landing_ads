# back/main/api.py
import asyncio
import traceback
import types
import uuid
import json
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from typing_extensions import TypedDict
import back.main.analysis_worker as analysis_worker # Import the refactored worker function
from back.actions.chat_with_persona import get_persona_response
from back.actions.llm_checks import check_pitch_dimensions_with_llm, DimensionInfo
import back.main.database as db
import logging as log

db.init_db()

app = FastAPI()

#  --- Configuration CORS ---
origins = [
    "http://localhost:3000", # Autoriser le frontend Next.js (port par défaut)
    # Ajoutez d'autres origines si nécessaire (ex: URL de déploiement)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Les origines autorisées
    allow_credentials=True,    # Autoriser les cookies si besoin
    allow_methods=["*"],       # Autoriser toutes les méthodes (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],       # Autoriser tous les en-têtes
)
# --- Fin Configuration CORS ---
# --- State Management (In-memory) ---
# !!! Warning: This is simple in-memory storage. For production, consider Redis or a database.
# It will be lost if the server restarts. Not suitable for concurrent runs without modification
# if worker script writes to shared files like 'personas.json' without task_id scoping.
tasks: Dict[str, Dict[str, Any]] = {}

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        # Store connections per task_id
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, task_id: str):
        if task_id not in self.active_connections:
            self.active_connections[task_id] = []
        self.active_connections[task_id].append(websocket)
        print(f"WebSocket connected for task {task_id}. Total connections: {len(self.active_connections[task_id])}")


    def disconnect(self, websocket: WebSocket, task_id: str):
        if task_id in self.active_connections:
            if websocket in self.active_connections[task_id]:
                 self.active_connections[task_id].remove(websocket)
                 print(f"WebSocket disconnected for task {task_id}. Remaining connections: {len(self.active_connections[task_id])}")
                 # Clean up if no connections left for this task_id
                 if not self.active_connections[task_id]:
                     del self.active_connections[task_id]
                     print(f"Removed task_id {task_id} from active connections.")


    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """ Sends a message to a specific websocket connection. """
        await websocket.send_json(message)

    async def broadcast(self, message: dict, task_id: str):
        """ Broadcasts a message to all connected clients for a specific task_id. """
        if task_id in self.active_connections:
            disconnected_sockets = []
            for connection in self.active_connections[task_id]:
                try:
                    await connection.send_json(message)
                except WebSocketDisconnect:
                    disconnected_sockets.append(connection)
                    print(f"Broadcast failed for a disconnected socket on task {task_id}.")
                except Exception as e: # Catch broader exceptions during send
                    print(f"Error sending message to a socket for task {task_id}: {e}")
                    disconnected_sockets.append(connection) # Consider it disconnected

            # Clean up disconnected sockets found during broadcast
            for socket in disconnected_sockets:
                 if socket in self.active_connections.get(task_id, []):
                    self.active_connections[task_id].remove(socket)
                    print(f"Cleaned up disconnected socket during broadcast for task {task_id}.")
            if task_id in self.active_connections and not self.active_connections[task_id]:
                 del self.active_connections[task_id]
                 print(f"Removed task_id {task_id} from active connections after broadcast cleanup.")


manager = ConnectionManager()

# --- Define a type for the detailed persona info (optional but good practice) ---
class PersonaCardDetails(TypedDict):
    name: str
    education: str
    hobbies: str
    job: str
    salary_range: str
    why_important: str
    needs: str
    relationship_channels: str
    # Add other fields if included in create_personas.py

class DetailedPersonaInfo(TypedDict):
    name: str
    prompt: str
    card_details: PersonaCardDetails
# --- Callback Functions for Worker ---
async def update_task_status(task_id: str, status: Optional[str] = None, data_key: Optional[str] = None, data_value: Any = None):
    """ Callback to update task state and notify clients via WebSocket. """
    if task_id not in tasks:
        print(f"Error: Task {task_id} not found for status update.")
        project_data = db.get_project(task_id)
        if project_data:
            tasks[task_id] = {
                "status": project_data["status"],
                "product_description": project_data["product_description"],
                "task_dir": project_data["task_dir"],
                # Initialize other keys likely needed by WS or other endpoints
                "logs": [],
                "final_analysis": None, # Load on demand or during connect
                "persona_details": None, # Load on demand or during connect
                "selected_persona_index": None, # Load on demand or during connect
                "chat_history_serializable": [], # Load on demand or during connect
                "error": project_data.get("error_message")
            }
            print(f"Loaded task {task_id} state from DB into memory cache.")
        else:
            print(f"Error: Task {task_id} not found in memory or DB for status update.")
            return

    updated = False
    message = {"type": "status_update", "task_id": task_id}
    db_update_kwargs = {}

    if status:
        tasks[task_id]["status"] = status
        message["status"] = status
        db_update_kwargs["status"] = status
        updated = True
        print(f"Task {task_id} status updated to: {status}")

    if data_key:
        tasks[task_id][data_key] = data_value
        if data_key == "final_analysis":
            # Save analysis to file and store path in DB
            analysis_path = os.path.join(tasks[task_id]['task_dir'], f"analysis_final_{task_id}.md")
            try:
                with open(analysis_path, "w", encoding="utf-8") as f:
                    f.write(data_value)
                db_update_kwargs["final_analysis_path"] = analysis_path
                print(f"Saved final analysis to {analysis_path}")
            except Exception as e:
                print(f"Error saving final analysis file for {task_id}: {e}")
        elif data_key == "persona_details":
             # Save persona details to file and store path in DB
             persona_path = os.path.join(tasks[task_id]['task_dir'], f"persona_details_{task_id}.json")
             try:
                 with open(persona_path, "w", encoding="utf-8") as f:
                     json.dump(data_value, f, indent=2)
                 db_update_kwargs["persona_details_path"] = persona_path
                 print(f"Saved persona details to {persona_path}")
             except Exception as e:
                 print(f"Error saving persona details file for {task_id}: {e}")
        elif data_key == "error":
            db_update_kwargs["error_message"] = data_value

        if data_key not in ["final_analysis", "persona_details", "logs"]: # Avoid broadcasting large data automatically
             message[data_key] = data_value
        updated = True
        print(f"Task {task_id} data updated: {data_key}")

    if db_update_kwargs:
         db.update_project_status(task_id, **db_update_kwargs)

    if status == "final_analysis_ready":
        message["signal"] = "phase_3_ready"
        print(f"Task {task_id}: Signaling Phase 3 readiness.")


    if status == "personas_ready":
        # Send the FULL persona details (for cards) to the client immediately when ready
        if "persona_details" in tasks[task_id] and tasks[task_id]["persona_details"]:
             # The persona_details key now holds List[DetailedPersonaInfo]
             persona_data_for_client = tasks[task_id]["persona_details"]
             message["signal"] = "phase_4_ready"
             message["personaData"] = persona_data_for_client # Send the list of detailed objects
             print(f"Task {task_id}: Signaling Phase 4 readiness with detailed persona data.")
        else:
            project_data = db.get_project(task_id)
            if project_data and project_data.get("persona_details_path"):
                loaded_personas = db.load_data_from_file(project_data["persona_details_path"])
                if loaded_personas:
                    tasks[task_id]["persona_details"] = loaded_personas # Cache it
                    message["signal"] = "phase_4_ready"
                    message["personaData"] = loaded_personas
                    print(f"Task {task_id}: Loaded and signaling Phase 4 readiness.")
                else:
                     print(f"Warning: Task {task_id} personas ready, path exists but failed to load details from {project_data['persona_details_path']}.")
            else:
                print(f"Warning: Task {task_id} personas ready, but details not found in state or DB path.")


    if updated:
        await manager.broadcast(message, task_id)



async def log_to_websocket(task_id: str, log_message: str):
    """ Callback to send log messages via WebSocket. """
    if task_id not in tasks:
        print(f"Error: Task {task_id} not found for logging.")
        return

    # Append log to state (optional, can get large)
    # tasks[task_id]["logs"].append(log_message)

    print(f"Task {task_id} Log: {log_message}")
    await manager.broadcast({"type": "log", "task_id": task_id, "message": log_message}, task_id)


# --- Pydantic Models ---
class StartAnalysisRequest(BaseModel):
    product_description: str

class StartAnalysisResponse(BaseModel):
    task_id: str

class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    # Add other relevant fields you might want to expose in a status check
    error: Optional[str] = None
    final_analysis_ready: bool = False
    personas_ready: bool = False

class FinalAnalysisResponse(BaseModel):
    task_id: str
    final_analysis: str # Assuming it's a string (Markdown)

class SelectPersonaRequest(BaseModel):
    choice: int # Expecting 1, 2, 3, or 4

class SelectPersonaResponse(BaseModel):
    message: str
    selected_persona_name: str

class CheckDescriptionRequest(BaseModel):
    description: str
    # Send the dimensions from the frontend so backend knows what to check
    dimensions: List[DimensionInfo]

class CheckDescriptionResponse(BaseModel):
    coverage: Dict[str, bool] # Maps dimension_id to boolean status

class ProjectListItem(BaseModel):
    task_id: str
    product_description: str
    status: str
    creation_timestamp: str
    last_updated_timestamp: str

class ProjectListResponse(BaseModel):
    projects: List[ProjectListItem]

class ProjectDetailResponse(BaseModel):
    task_id: str
    product_description: str
    status: str
    creation_timestamp: str
    last_updated_timestamp: str
    task_dir: str
    error_message: Optional[str] = None
    final_analysis_ready: bool = False
    personas_ready: bool = False
    # Optionally include analysis/persona data if requested/ready
    final_analysis: Optional[str] = None
    persona_details: Optional[List[DetailedPersonaInfo]] = None
    selected_persona_info: Optional[Dict[str, Any]] = None # Store {choice: X, name: Y}
    chat_history: Optional[List[Dict[str, Any]]] = None

# --- API Endpoints ---

@app.get("/projects", response_model=ProjectListResponse)
async def list_all_projects():
    """Lists all tracked projects from the database."""
    projects_data = db.list_projects()
    return ProjectListResponse(projects=projects_data)

@app.get("/projects/{task_id}", response_model=ProjectDetailResponse)
async def get_project_details(task_id: str = Path(...)):
    """Retrieves detailed information for a specific project."""
    project_data = db.get_project(task_id)
    if not project_data:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check readiness flags based on status and file existence from DB
    final_analysis_ready = bool(project_data.get("final_analysis_path")) and project_data["status"] in ["final_analysis_ready", "personas_ready", "completed", "failed"]
    personas_ready = bool(project_data.get("persona_details_path")) and project_data["status"] in ["personas_ready", "completed", "failed"]

    # Try to load final analysis and persona details if paths exist
    final_analysis_content = db.load_data_from_file(project_data.get("final_analysis_path"))
    persona_details_content = db.load_data_from_file(project_data.get("persona_details_path"))

    # Load selected persona info and chat history from in-memory cache if available
    # (These are harder to persist reliably without more complex DB structure or file handling)
    task_cache = tasks.get(task_id, {})
    selected_persona_info = None
    selected_idx = task_cache.get("selected_persona_index")
    if selected_idx is not None and persona_details_content and selected_idx < len(persona_details_content):
         selected_persona_info = {
              "choice": selected_idx + 1,
              "name": persona_details_content[selected_idx].get("name", "Unknown")
         }
    chat_history = task_cache.get("chat_history_serializable")


    return ProjectDetailResponse(
        task_id=project_data["task_id"],
        product_description=project_data["product_description"],
        status=project_data["status"],
        creation_timestamp=project_data["creation_timestamp"],
        last_updated_timestamp=project_data["last_updated_timestamp"],
        task_dir=project_data["task_dir"],
        error_message=project_data.get("error_message"),
        final_analysis_ready=final_analysis_ready,
        personas_ready=personas_ready,
        final_analysis=final_analysis_content if isinstance(final_analysis_content, str) else None,
        persona_details=persona_details_content if isinstance(persona_details_content, list) else None,
        selected_persona_info=selected_persona_info,
        chat_history=chat_history
    )

@app.post("/check_description_completeness", response_model=CheckDescriptionResponse)
async def check_description_completeness(request: CheckDescriptionRequest):
    """
    Analyzes a project description against key dimensions using an LLM.
    """
    if not request.description or not request.dimensions:
        raise HTTPException(status_code=400, detail="Description and dimensions are required.")

    try:
        # Run the LLM check (this is synchronous for now, consider background task if slow)
        # Note: Ensure the function is accessible here (imported or defined above)
        coverage_results = check_pitch_dimensions_with_llm(
            user_description=request.description,
            dimensions=request.dimensions
        )
        return CheckDescriptionResponse(coverage=coverage_results)
    except Exception as e:
        # Log the exception details on the server
        print(f"ERROR during description check: {e}\n{traceback.format_exc()}") # Or use proper logging
        raise HTTPException(status_code=500, detail=f"Failed to analyze description: {e}")

@app.post("/start_analysis", response_model=StartAnalysisResponse, status_code=202)
async def start_analysis(request: StartAnalysisRequest, background_tasks: BackgroundTasks):
    """
    Phase 1: Receives product description, starts the analysis job in the background,
    and returns a unique task ID.
    """
    task_id = str(uuid.uuid4())

    try:
        db.add_project(task_id, request.product_description)
    except Exception as e:
         # Log the error details
         print(f"CRITICAL: Failed to add project {task_id} to database. Aborting start. Error: {e}")
         # Provide a meaningful error response to the client
         raise HTTPException(status_code=500, detail=f"Failed to initiate analysis task due to database error: {e}")

    tasks[task_id] = {
        "status": "pending",
        "product_description": request.product_description,
        "task_dir": db.get_project(task_id)['task_dir'],
        "logs": [],
        "final_analysis": None,
        "persona_details": None,
        "selected_persona_index": None,
        "chat_history_serializable": [],
        "error": None
    }
    print(f"Starting analysis task {task_id} for: {request.product_description[:50]}...")

    try:
        # Get the currently running event loop in the main thread
        loop = asyncio.get_running_loop()
    except RuntimeError:
         # Fallback if not running in an asyncio context (less likely with FastAPI)
         # Or handle this scenario as needed, potentially raising an error
         # For simplicity, let's re-raise or handle appropriately
         print("Error: Could not get running event loop. Ensure FastAPI is running correctly.")
         raise HTTPException(status_code=500, detail="Server configuration error: Cannot access event loop.")

    # Add the analysis job to background tasks, passing the loop
    background_tasks.add_task(
        analysis_worker.run_analysis_job,
        product_description=request.product_description,
        task_id=task_id,
        update_status_callback=update_task_status,
        log_callback=log_to_websocket,
        loop=loop
    )

    return StartAnalysisResponse(task_id=task_id)

@app.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str = Path(...)):
    log.info(f"WebSocket endpoint entered for task: {task_id}") # Log entry

    project_data = db.get_project(task_id)
    if not project_data:
        log.warning(f"WebSocket connection attempt for unknown task_id: {task_id}")
        try:
            await websocket.accept()
            await websocket.send_json({"type": "error", "message": "Task ID not found"})
        except Exception: pass # Ignore errors if accept fails or send fails
        finally:
             try: await websocket.close()
             except Exception: pass
        log.info(f"Closed WebSocket for unknown task: {task_id}")
        return

    # Ensure task data is in the memory cache
    log.info(f"Checking memory cache for task: {task_id}")
    if task_id not in tasks:
        log.info(f"Task {task_id} not in memory cache, loading from DB...")
        # --- Load data from DB ---
        try:
            final_analysis_content = db.load_data_from_file(project_data.get("final_analysis_path"))
            persona_details_content = db.load_data_from_file(project_data.get("persona_details_path"))
            # Persist chat history and selected persona is complex, load as empty/None for now
            tasks[task_id] = {
                "status": project_data["status"],
                "product_description": project_data["product_description"],
                "task_dir": project_data["task_dir"],
                "logs": [],
                "final_analysis": final_analysis_content,
                "persona_details": persona_details_content,
                "selected_persona_index": None,
                "chat_history_serializable": [],
                "error": project_data.get("error_message")
            }
            log.info(f"Loaded state for task {task_id} into cache.")
        except Exception as e:
            log.error(f"Failed to load task {task_id} state from DB/files: {e}", exc_info=True)
            # Decide how to handle - maybe close connection?
            await websocket.accept()
            await websocket.send_json({"type": "error", "message": "Failed to load task state on server."})
            await websocket.close()
            log.info(f"Closed WebSocket due to state loading error for task: {task_id}")
            return
    else:
        log.info(f"Task {task_id} already in memory cache.")

    # --- Accept and Connect ---
    try:
        await websocket.accept()
        log.info(f"WebSocket accepted for task: {task_id}")
        await manager.connect(websocket, task_id) # manager.connect logs its own success
    except Exception as e:
        log.error(f"Error during WebSocket accept/connect for task {task_id}: {e}", exc_info=True)
        # Connection likely failed, so can't send error message reliably. Just return.
        try:
            await websocket.close(code=1011)
        except Exception:
            pass # Ignore if close fails
        return

    initial_status_sent = False
    try:
        # --- Send Initial Status ---
        log.info(f"Preparing initial_status for task: {task_id}")
        current_task_cache = tasks[task_id]
        # Recalculate readiness based on potentially loaded data
        final_analysis_ready = bool(current_task_cache.get("final_analysis"))
        personas_ready = bool(current_task_cache.get("persona_details"))
        persona_data_for_client = current_task_cache.get("persona_details")
        selected_persona_info = None
        selected_idx = current_task_cache.get("selected_persona_index")
        if selected_idx is not None and persona_data_for_client and selected_idx < len(persona_data_for_client):
             selected_persona_info = {
                  "choice": selected_idx + 1,
                  "name": persona_data_for_client[selected_idx].get("name", "Unknown")
             }
        chat_history_for_client = current_task_cache.get("chat_history_serializable", [])

        initial_status = {
            "type": "initial_status",
            "task_id": task_id,
            "status": current_task_cache.get("status", "unknown"),
            "final_analysis_ready": final_analysis_ready,
            "personas_ready": personas_ready,
            "personaData": persona_data_for_client,
            "selectedPersonaInfo": selected_persona_info,
            "chat_history": chat_history_for_client,
            "backendError": current_task_cache.get("error")
        }
        log.info(f"Sending initial_status for task {task_id}: { {k: v[:50] + '...' if isinstance(v, str) and len(v) > 50 else k == 'personaData' and v is not None or k == 'chat_history' and v or k not in ['personaData', 'chat_history'] for k, v in initial_status.items()} }") # Log summarized status

        await manager.send_personal_message(initial_status, websocket)
        initial_status_sent = True
        log.info(f"Successfully sent initial_status for task: {task_id}")
        # --- End Initial Status ---

        # --- Enter Receive Loop ---
        log.info(f"Entering receive loop for task: {task_id}")
        while True:
            try:
                data = await websocket.receive_json()
                log.info(f"Received WS data for task {task_id}: {data}")

                # --- Chat Message Handling ---
                if data.get("type") == "chat_message":
                    # ... (keep existing chat handling logic here) ...
                    # Add logging within this block too if chat fails later
                    log.info(f"Processing chat_message for task: {task_id}")
                    # ... try/except around get_persona_response ...
                    # ... log success/failure of sending persona_response ...
                    pass # Placeholder for existing logic
                else:
                     log.warning(f"Received unhandled WS message type for task {task_id}: {data.get('type')}")

            except WebSocketDisconnect:
                log.info(f"WebSocketDisconnect received in loop for task {task_id}.")
                break # Exit loop cleanly on disconnect
            except json.JSONDecodeError:
                 log.warning(f"Received invalid JSON via WebSocket for task {task_id}")
                 try:
                    await manager.send_personal_message({"type": "error", "task_id": task_id, "message": "Invalid JSON received."}, websocket)
                 except: pass # Ignore if send fails
            except Exception as loop_error:
                 log.error(f"Error in WebSocket receive loop for task {task_id}: {loop_error}", exc_info=True)
                 try:
                      await manager.send_personal_message({"type": "error", "task_id": task_id, "message": f"Server loop error: {loop_error}"}, websocket)
                 except: pass
                 break # Exit loop on other errors too
        # --- End Receive Loop ---
        log.info(f"Exited receive loop for task: {task_id}")

    except Exception as e:
        # Catch errors happening after connection accept but before/during loop
        log.error(f"Error in WebSocket handler for task {task_id} (outside loop): {e}", exc_info=True)
        # Attempt to inform client if possible, though connection might be dead
        if initial_status_sent: # Only try sending if initial status likely succeeded
            try:
                 await manager.send_personal_message({"type": "error", "task_id": task_id, "message": f"Server WebSocket error: {e}"}, websocket)
            except: pass
    finally:
         log.info(f"Executing finally block for WebSocket task: {task_id}")
         manager.disconnect(websocket, task_id)
         log.info(f"WebSocket connection closed handler finished for task: {task_id}")


@app.get("/analysis/{task_id}", response_model=FinalAnalysisResponse)
async def get_final_analysis(task_id: str):
    """
    Phase 3: Retrieves the final analysis content once it's ready.
    """
    project_data = db.get_project(task_id)
    if not project_data:
        raise HTTPException(status_code=404, detail="Task ID not found")

    analysis_path = project_data.get("final_analysis_path")
    analysis_content = db.load_data_from_file(analysis_path)

    if analysis_content and isinstance(analysis_content, str):
         # Check status consistency (optional but good)
        if project_data["status"] in ["final_analysis_ready", "personas_ready", "completed", "failed"]:
            return FinalAnalysisResponse(
                task_id=task_id,
                final_analysis=analysis_content
            )
        else:
            # File exists but status doesn't match? Log inconsistency.
             print(f"Warning: Analysis file exists for task {task_id} but status is {project_data['status']}")
             raise HTTPException(status_code=409, detail="Final analysis file found but task status indicates it might not be finalized.")

    elif project_data["status"] == "failed":
         raise HTTPException(status_code=400, detail=f"Task failed: {project_data.get('error_message', 'Unknown error')}")
    else:
        # Analysis not ready yet or file missing
        raise HTTPException(status_code=409, detail="Final analysis is not yet available or file is missing for this task.")

@app.post("/select_persona/{task_id}", response_model=SelectPersonaResponse)
async def select_persona(task_id: str, request: SelectPersonaRequest):
    """
    Phase 4: Receives the user's chosen persona index (1-based) and confirms.
    """
    if task_id not in tasks:
        await update_task_status(task_id)
        if task_id not in tasks:
            raise HTTPException(status_code=404, detail="Task ID not found or couldn't be loaded.")

    task = tasks[task_id]

    if not task.get("persona_details"):
        project_data = db.get_project(task_id)
        if project_data and project_data.get("persona_details_path"):
             loaded_personas = db.load_data_from_file(project_data.get("persona_details_path"))
             if loaded_personas:
                 task["persona_details"] = loaded_personas
             else:
                 raise HTTPException(status_code=500, detail="Persona details file found but failed to load.")
        else:
            raise HTTPException(status_code=409, detail="Personas details are not available yet for selection.")

    # persona_details now holds List[DetailedPersonaInfo]
    persona_details_list = task.get("persona_details")

    current_status = task.get("status")
    if not current_status:
        project_data = db.get_project(task_id)
        current_status = project_data.get("status") if project_data else "unknown"

    if current_status not in ["personas_ready", "completed", "persona_selected"]:
         raise HTTPException(status_code=409, detail="Personas are not ready for selection yet according to status.")


    num_personas = len(persona_details_list)
    choice_index = request.choice - 1 # Convert 1-based choice to 0-based index

    if 0 <= choice_index < num_personas:
        # Extract name from the detailed structure
        selected_name = persona_details_list[choice_index].get("name", "Unknown Persona")
        # selected_prompt = persona_details_list[choice_index].get("prompt") # Still available if needed

        # Store the selection index
        task["selected_persona_index"] = choice_index
        task["status"] = "persona_selected" # Update status
        task["chat_history_serializable"] = [] # Reset chat history on new selection

        db.update_project_status(task_id, status="persona_selected")

        print(f"Task {task_id}: User selected persona index {choice_index} ({selected_name})")

        # Notify via WebSocket
        await manager.broadcast({
            "type": "persona_selected",
            "task_id": task_id,
            "choice": request.choice, # Send back 1-based choice
            "name": selected_name
        }, task_id)

        # Reset chat history for the newly selected persona
        await manager.broadcast({
            "type": "reset_chat",
            "task_id": task_id,
        }, task_id)


        return SelectPersonaResponse(
            message=f"Persona {request.choice} ({selected_name}) selected successfully.",
            selected_persona_name=selected_name
            #selected_persona_index=choice_index # Return 0-based index confirmed
        )
    else:
        raise HTTPException(status_code=400, detail=f"Invalid persona choice. Please choose between 1 and {num_personas}.")



@app.get("/task_status/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: str):
    """ Endpoint to poll task status (alternative or supplement to WebSocket). """
    project_data = db.get_project(task_id)
    if not project_data:
        raise HTTPException(status_code=404, detail="Task ID not found")

    final_analysis_ready = bool(project_data.get("final_analysis_path")) and project_data["status"] in ["final_analysis_ready", "personas_ready", "completed", "failed"]
    personas_ready = bool(project_data.get("persona_details_path")) and project_data["status"] in ["personas_ready", "completed", "failed"]

    return TaskStatusResponse(
        task_id=task_id,
        status=project_data.get("status", "unknown"),
        error=project_data.get("error_message"),
        final_analysis_ready=final_analysis_ready,
        personas_ready=personas_ready
    )


# --- Simple HTML page for testing WebSocket --- (Optional)
# Remove or replace with your actual frontend
@app.get("/")
async def get():
    # A basic HTML page to test the WebSocket connection
    # Replace YOUR_TASK_ID with an actual ID after starting a task
    return HTMLResponse("""
    <!DOCTYPE html>
    <html>
        <head>
            <title>WebSocket Test</title>
        </head>
        <body>
            <h1>WebSocket Test</h1>
            <label for="taskId">Task ID:</label>
            <input type="text" id="taskId" value="YOUR_TASK_ID"><br>
            <button onclick="connectWs()">Connect</button>
            <button onclick="disconnectWs()" disabled>Disconnect</button>
            <button onclick="getAnalysis()" disabled>Get Analysis (Phase 3)</button>
             <form id="personaForm" style="display: none;">
                <label>Select Persona:</label><br>
                <div id="personaChoices"></div>
                <input type="number" id="personaChoiceInput" min="1" required>
                <button type="submit">Submit Choice (Phase 4)</button>
            </form>
            <h2>Messages:</h2>
            <ul id='messages'>
            </ul>
            <h2>Analysis Result:</h2>
            <pre id="analysisResult" style="border: 1px solid #ccc; padding: 10px; min-height: 50px;"></pre>
            <script>
                var ws = null;
                var currentTaskId = null;

                function connectWs() {
                    currentTaskId = document.getElementById("taskId").value;
                    if (!currentTaskId) {
                        alert("Please enter a Task ID");
                        return;
                    }
                    var wsUrl = `ws://${window.location.host}/ws/${currentTaskId}`;
                    ws = new WebSocket(wsUrl);
                    ws.onopen = function(event) {
                        addMessage("WebSocket Connected");
                        document.querySelector("button[onclick='connectWs()']").disabled = true;
                        document.querySelector("button[onclick='disconnectWs()']").disabled = false;
                        document.querySelector("button[onclick='getAnalysis()']").disabled = false; // Enable analysis button
                    };
                    ws.onmessage = function(event) {
                        var data = JSON.parse(event.data);
                        addMessage(JSON.stringify(data));

                        // Handle specific signals/updates
                        if (data.type === 'log') {
                            console.log("Log:", data.message);
                        } else if (data.type === 'status_update') {
                            console.log("Status:", data.status);
                            if(data.signal === 'phase_3_ready') {
                                addMessage("<strong>Signal Received: Final Analysis is ready! (Phase 3)</strong> You can now click 'Get Analysis'.");
                                document.getElementById("analysisResult").textContent = "Ready to fetch...";
                            }
                            if (data.signal === 'phase_4_ready' && data.persona_names) {
                                addMessage(`<strong>Signal Received: Personas are ready! (Phase 4)</strong> Choose one: ${data.persona_names.join(', ')}`);
                                displayPersonaChoices(data.persona_names);
                            }
                        } else if (data.type === 'initial_status') {
                             addMessage(`Initial Status: ${data.status}`);
                             if (data.final_analysis_ready) {
                                 addMessage("Analysis was already ready on connect.");
                                 document.getElementById("analysisResult").textContent = "Ready to fetch...";
                             }
                             if (data.personas_ready && data.persona_names) {
                                addMessage(`Personas were already ready on connect: ${data.persona_names.join(', ')}`);
                                displayPersonaChoices(data.persona_names);
                            }
                        } else if (data.type === 'persona_selected') {
                            addMessage(`<strong>Server Confirmed: Persona ${data.choice} (${data.name}) selected.</strong>`);
                            document.getElementById("personaForm").style.display = 'none';
                        } else if (data.type === 'error') {
                            addMessage(`<strong>Error from server: ${data.message}</strong>`);
                            disconnectWs(); // Disconnect on task error
                        }
                    };
                    ws.onerror = function(event) {
                        addMessage("WebSocket Error");
                        console.error("WebSocket Error: ", event);
                         document.querySelector("button[onclick='connectWs()']").disabled = false;
                         document.querySelector("button[onclick='disconnectWs()']").disabled = true;
                         document.querySelector("button[onclick='getAnalysis()']").disabled = true;
                         document.getElementById("personaForm").style.display = 'none';
                    };
                    ws.onclose = function(event) {
                        addMessage("WebSocket Disconnected");
                        ws = null;
                        currentTaskId = null;
                         document.querySelector("button[onclick='connectWs()']").disabled = false;
                         document.querySelector("button[onclick='disconnectWs()']").disabled = true;
                         document.querySelector("button[onclick='getAnalysis()']").disabled = true;
                         document.getElementById("personaForm").style.display = 'none';
                    };
                }

                function disconnectWs() {
                    if (ws) {
                        ws.close();
                    }
                }

                 function addMessage(message) {
                    var messages = document.getElementById('messages');
                    var messageItem = document.createElement('li');
                    messageItem.innerHTML = message; // Use innerHTML to render strong tags
                    messages.appendChild(messageItem);
                }

                async function getAnalysis() {
                     if (!currentTaskId) {
                        alert("Not connected to a task.");
                        return;
                    }
                    document.getElementById("analysisResult").textContent = "Fetching...";
                    try {
                        const response = await fetch(`/analysis/${currentTaskId}`);
                        if (response.ok) {
                            const data = await response.json();
                            document.getElementById("analysisResult").textContent = data.final_analysis;
                             addMessage("Phase 3: Successfully fetched analysis.");
                        } else {
                             const errorData = await response.json();
                             document.getElementById("analysisResult").textContent = `Error ${response.status}: ${errorData.detail}`;
                             addMessage(`Phase 3: Failed to fetch analysis - ${errorData.detail}`);
                        }
                    } catch (error) {
                         document.getElementById("analysisResult").textContent = `Workspace error: ${error}`;
                         addMessage(`Phase 3: Network error during fetch - ${error}`);
                    }
                }

                function displayPersonaChoices(names) {
                    const choicesDiv = document.getElementById("personaChoices");
                    choicesDiv.innerHTML = ''; // Clear previous choices
                    names.forEach((name, index) => {
                         const label = document.createElement('label');
                         label.innerHTML = `<input type="radio" name="persona" value="${index + 1}" required> ${index + 1}: ${name}<br>`;
                         choicesDiv.appendChild(label);
                    });
                     // Make sure the input field for direct number entry is also handled or removed if using radio buttons
                    document.getElementById("personaForm").style.display = 'block';

                }

                 // Handle Phase 4 form submission
                document.getElementById("personaForm").addEventListener('submit', async function(event) {
                    event.preventDefault(); // Prevent default form submission
                    if (!currentTaskId) {
                        alert("Not connected to a task.");
                        return;
                    }

                    // Get choice from radio buttons OR the number input
                    let choice = null;
                    const selectedRadio = document.querySelector('input[name="persona"]:checked');
                    if (selectedRadio) {
                        choice = parseInt(selectedRadio.value);
                    } else {
                        // Fallback or alternative: use the number input field
                         choice = parseInt(document.getElementById("personaChoiceInput").value);
                    }


                    if (!choice || isNaN(choice)) {
                        alert("Please select a persona or enter a valid number.");
                        return;
                    }

                    addMessage(`Phase 4: Sending choice ${choice}...`);

                    try {
                        const response = await fetch(`/select_persona/${currentTaskId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ choice: choice }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            addMessage(`Phase 4: Success - ${data.message} (${data.selected_persona_name})`);
                            // Optionally hide form again
                            // document.getElementById("personaForm").style.display = 'none';
                        } else {
                            const errorData = await response.json();
                            addMessage(`Phase 4: Failed to select persona - ${errorData.detail}`);
                        }
                    } catch (error) {
                        addMessage(`Phase 4: Network error during selection - ${error}`);
                    }
                });

            </script>
        </body>
    </html>
    """)

# --- Run the app (for development) ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
