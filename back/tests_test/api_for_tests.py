# back/tests_test/api_for_tests.py
import asyncio
import traceback
import types
import uuid
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from typing_extensions import TypedDict
import tests_test.analysis_worker_for_tests # Import the refactored worker function
from actions.chat_with_persona import get_persona_response
from actions.llm_checks import check_pitch_dimensions_with_llm, DimensionInfo

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
        await websocket.accept()
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
        return

    updated = False
    message = {"type": "status_update", "task_id": task_id}

    if status:
        tasks[task_id]["status"] = status
        message["status"] = status
        updated = True
        print(f"Task {task_id} status updated to: {status}")

    if data_key:
        tasks[task_id][data_key] = data_value
        # Only send large data like final_analysis or persona_details on specific signals/requests, not every update.
        if data_key not in ["final_analysis", "persona_details", "logs"]: # Avoid broadcasting large data automatically
             message[data_key] = data_value
        updated = True
        print(f"Task {task_id} data updated: {data_key}")


    # Specific signals for frontend based on status changes
    if status == "final_analysis_ready":
        message["signal"] = "phase_3_ready" # Tell frontend to fetch analysis
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
            print(f"Warning: Task {task_id} personas ready, but details not found in state.")

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

# --- API Endpoints ---

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
    tasks[task_id] = {
        "status": "pending",
        "product_description": request.product_description,
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
        tests_test.analysis_worker_for_tests.run_analysis_job,
        product_description=request.product_description,
        task_id=task_id,
        update_status_callback=update_task_status,
        log_callback=log_to_websocket,
        loop=loop
    )

    return StartAnalysisResponse(task_id=task_id)

@app.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str = Path(...)):
    """
    Phase 2: WebSocket endpoint for clients to subscribe to task updates.
    """
    if task_id not in tasks:
        print(f"WebSocket connection attempt for unknown task_id: {task_id}")
        await websocket.accept()
        await websocket.send_json({"type": "error", "message": "Task ID not found"})
        await websocket.close()
        return

    await manager.connect(websocket, task_id)
    print(f"WebSocket client connected for task: {task_id}")
    initial_status_sent = False
    try:
        if not initial_status_sent:
            current_task = tasks.get(task_id, {})
            chat_history_for_client = current_task.get("chat_history_serializable", [])
            persona_data_for_client = None
            personas_are_ready = current_task.get("status") in ["personas_ready", "completed", "persona_selected"] # Adjusted status check

            if personas_are_ready and current_task.get("persona_details"):
                 persona_data_for_client = current_task["persona_details"]

            initial_status = {
                "type": "initial_status",
                "task_id": task_id,
                "status": current_task.get("status", "unknown"),
                "final_analysis_ready": current_task.get("status") in ["final_analysis_ready", "personas_ready", "completed", "persona_selected", "failed"], # Adjusted status check
                "personas_ready": personas_are_ready,
                "personaData": persona_data_for_client, # Send full data if ready
                "selectedPersonaInfo": None, # Send selected info if already selected
                "chat_history": chat_history_for_client,
                "backendError": current_task.get("error") # Send backend error if any
            }
            # Add selected persona info if already selected
            selected_idx = current_task.get("selected_persona_index")
            if selected_idx is not None and persona_data_for_client and selected_idx < len(persona_data_for_client):
                 initial_status["selectedPersonaInfo"] = {
                      "choice": selected_idx + 1,
                      "name": persona_data_for_client[selected_idx].get("name", "Unknown")
                 }


            await manager.send_personal_message(initial_status, websocket)
            initial_status_sent = True

        # Keep the connection alive, listening for client messages (if any)
        # In this design, the server primarily pushes data.
        while True:
            try:
                data = await websocket.receive_json()
                print(f"Received WS data for task {task_id}: {data}")

                if data.get("type") == "chat_message":
                    user_message = data.get("message")
                    if not user_message or not isinstance(user_message, str):
                        # ... (envoyer erreur format invalide) ...
                        continue

                    task_state = tasks.get(task_id)
                    if not task_state:
                         # ... (envoyer erreur task state inconnu) ...
                         continue

                    selected_index = task_state.get("selected_persona_index")
                    persona_details_list = task_state.get("persona_details")

                    if selected_index is None or not persona_details_list or not isinstance(persona_details_list, list) or selected_index >= len(persona_details_list):
                        await manager.send_personal_message({"type": "error", "task_id": task_id, "message": "Persona not selected or details invalid."}, websocket)
                        continue

                    # Get the correct prompt from the detailed list
                    system_prompt = persona_details_list[selected_index].get("prompt")
                    if not system_prompt:
                         await manager.send_personal_message({"type": "error", "task_id": task_id, "message": "Selected persona prompt not found."}, websocket)
                         continue

                    history_serializable = task_state.get("chat_history_serializable", [])
                    history_genai_format = [types.Content(**msg) for msg in history_serializable]

                    try:
                         ai_response = get_persona_response(
                             system_instruction=system_prompt,
                             history=history_genai_format,
                             user_message=user_message
                         )

                         # Update history
                         history_serializable.append({"role": "user", "parts": [{"text": user_message}]})
                         history_serializable.append({"role": "model", "parts": [{"text": ai_response}]})
                         task_state["chat_history_serializable"] = history_serializable[-50:]

                         # Send response
                         await manager.send_personal_message(
                             {"type": "persona_response", "task_id": task_id, "message": ai_response}, websocket
                         )
                    except Exception as chat_err:
                          print(f"Error getting persona response: {chat_err}")
                          await manager.send_personal_message({"type": "error", "task_id": task_id, "message": f"Error generating response: {chat_err}"}, websocket)
                    # --- End Chat Message Handling ---
                else:
                     print(f"Received unhandled WS message type for task {task_id}: {data.get('type')}")

            except WebSocketDisconnect:
                print(f"Client for task {task_id} initiated disconnect.")
                break
            except json.JSONDecodeError:
                 print(f"Received invalid JSON via WebSocket for task {task_id}")
                 # Maybe send an error back?
                 await manager.send_personal_message({"type": "error", "task_id": task_id, "message": "Invalid JSON received."}, websocket)
            except Exception as loop_error:
                 print(f"Error in WebSocket receive loop for task {task_id}: {loop_error}")
                 # Try sending an error if the socket is still open-ish
                 try:
                      await manager.send_personal_message({"type": "error", "task_id": task_id, "message": f"Server loop error: {loop_error}"}, websocket)
                 except:
                      pass # Ignore if sending fails
                 break # Exit loop on other errors too

    except Exception as e:
        print(f"WebSocket error for task {task_id} (outside receive loop): {e}")
    finally:
         manager.disconnect(websocket, task_id)
         print(f"WebSocket connection closed handler finished for task: {task_id}")


@app.get("/analysis/{task_id}", response_model=FinalAnalysisResponse)
async def get_final_analysis(task_id: str):
    """
    Phase 3: Retrieves the final analysis content once it's ready.
    """
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task ID not found")

    task = tasks[task_id]
    # Check if the final analysis is available
    # Status should be 'final_analysis_ready' or later ('personas_ready', 'completed')
    if task.get("final_analysis") and task.get("status") in ["final_analysis_ready", "personas_ready", "completed", "failed"]: # Allow fetch even if personas failed later
        return FinalAnalysisResponse(
            task_id=task_id,
            final_analysis=task["final_analysis"]
        )
    elif task.get("status") == "failed":
         raise HTTPException(status_code=400, detail=f"Task failed: {task.get('error', 'Unknown error')}")
    else:
        # Analysis not ready yet
        raise HTTPException(status_code=409, detail="Final analysis is not yet available for this task.")


@app.post("/select_persona/{task_id}", response_model=SelectPersonaResponse)
async def select_persona(task_id: str, request: SelectPersonaRequest):
    """
    Phase 4: Receives the user's chosen persona index (1-based) and confirms.
    """
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task ID not found")

    task = tasks[task_id]

    # Allow selection if personas are ready OR if already completed/selected (idempotency)
    if task.get("status") not in ["personas_ready", "completed", "persona_selected"]:
         raise HTTPException(status_code=409, detail="Personas are not ready for selection yet.")

    # persona_details now holds List[DetailedPersonaInfo]
    persona_details_list = task.get("persona_details")
    if not persona_details_list or not isinstance(persona_details_list, list):
        raise HTTPException(status_code=500, detail="Persona details are missing or invalid for this task.")

    num_personas = len(persona_details_list)
    choice_index = request.choice - 1 # Convert 1-based choice to 0-based index

    if 0 <= choice_index < num_personas:
        # Extract name from the detailed structure
        selected_name = persona_details_list[choice_index].get("name", "Unknown Persona")
        # selected_prompt = persona_details_list[choice_index].get("prompt") # Still available if needed

        # Store the selection index
        tasks[task_id]["selected_persona_index"] = choice_index
        tasks[task_id]["status"] = "persona_selected" # Update status
        tasks[task_id]["chat_history_serializable"] = [] # Reset chat history on new selection

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
            selected_persona_name=selected_name,
            selected_persona_index=choice_index # Return 0-based index confirmed
        )
    else:
        raise HTTPException(status_code=400, detail=f"Invalid persona choice. Please choose between 1 and {num_personas}.")



@app.get("/task_status/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: str):
    """ Endpoint to poll task status (alternative or supplement to WebSocket). """
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task ID not found")
    task = tasks[task_id]
    return TaskStatusResponse(
        task_id=task_id,
        status=task.get("status", "unknown"),
        error=task.get("error"),
        final_analysis_ready=bool(task.get("final_analysis")) and task.get("status") in ["final_analysis_ready", "personas_ready", "completed", "failed"],
        personas_ready=bool(task.get("persona_details")) and task.get("status") in ["personas_ready", "completed", "failed"]
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
