# back/main/database.py
import sqlite3
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from typing_extensions import TypedDict
import json

# Define the database file path (relative to the project root or an absolute path)
# Place it alongside the task_data directory for organization
DATABASE_FILE = "project_tracker.db"
BASE_DATA_DIR = "task_data" # Ensure this matches analysis_worker.py

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE_FILE)
    # Use Row factory for dictionary-like access to rows
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema if it doesn't exist."""
    if os.path.exists(DATABASE_FILE):
        print("Database already exists.")
        # You might want to add checks here to ensure the schema is up-to-date
        # For simplicity, we assume if the file exists, the schema is okay.
        # In production, use migration tools (like Alembic).
    else:
        print("Initializing new database...")
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                CREATE TABLE projects (
                    task_id TEXT PRIMARY KEY,
                    product_description TEXT NOT NULL,
                    status TEXT NOT NULL,
                    creation_timestamp TEXT NOT NULL,
                    last_updated_timestamp TEXT NOT NULL,
                    task_dir TEXT NOT NULL,
                    error_message TEXT,
                    final_analysis_path TEXT,
                    persona_details_path TEXT
                )
            """)
            conn.commit()
            print("Database initialized successfully.")
        except sqlite3.Error as e:
            print(f"Database initialization failed: {e}")
        finally:
            conn.close()

def add_project(task_id: str, product_description: str, initial_status: str = "pending"):
    """Adds a new project/task to the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.utcnow().isoformat()
    task_dir = os.path.join(BASE_DATA_DIR, task_id)
    try:
        cursor.execute("""
            INSERT INTO projects (
                task_id, product_description, status, creation_timestamp,
                last_updated_timestamp, task_dir
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (task_id, product_description, initial_status, now_iso, now_iso, task_dir))
        conn.commit()
        print(f"Project added to DB: {task_id}")
    except sqlite3.Error as e:
        print(f"Failed to add project {task_id} to DB: {e}")
    finally:
        conn.close()

def update_project_status(task_id: str, status: Optional[str] = None, error_message: Optional[str] = None, final_analysis_path: Optional[str] = None, persona_details_path: Optional[str] = None):
    """Updates the status and other fields of an existing project."""
    conn = get_db_connection()
    cursor = conn.cursor()
    updates = []
    params = []
    now_iso = datetime.utcnow().isoformat()

    updates.append("last_updated_timestamp = ?")
    params.append(now_iso)

    if status:
        updates.append("status = ?")
        params.append(status)
    if error_message is not None: # Allow clearing the error
        updates.append("error_message = ?")
        params.append(error_message)
    if final_analysis_path:
        updates.append("final_analysis_path = ?")
        params.append(final_analysis_path)
    if persona_details_path:
        updates.append("persona_details_path = ?")
        params.append(persona_details_path)

    if not updates:
        print(f"No updates provided for project {task_id}")
        conn.close()
        return

    sql = f"UPDATE projects SET {', '.join(updates)} WHERE task_id = ?"
    params.append(task_id)

    try:
        cursor.execute(sql, tuple(params))
        conn.commit()
        print(f"Project status updated in DB for: {task_id}")
    except sqlite3.Error as e:
        print(f"Failed to update project {task_id} in DB: {e}")
    finally:
        conn.close()

def get_project(task_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a single project's details from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM projects WHERE task_id = ?", (task_id,))
        project_row = cursor.fetchone()
        return dict(project_row) if project_row else None
    except sqlite3.Error as e:
        print(f"Failed to get project {task_id} from DB: {e}")
        return None
    finally:
        conn.close()

def list_projects() -> List[Dict[str, Any]]:
    """Retrieves a list of all projects from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    projects = []
    try:
        cursor.execute("SELECT task_id, product_description, status, creation_timestamp, last_updated_timestamp FROM projects ORDER BY creation_timestamp DESC")
        rows = cursor.fetchall()
        projects = [dict(row) for row in rows]
    except sqlite3.Error as e:
        print(f"Failed to list projects from DB: {e}")
    finally:
        conn.close()
    return projects

# --- Optional: Function to load data from file ---
def load_data_from_file(file_path: Optional[str]) -> Optional[Any]:
    """Safely loads data from a JSON or reads text from a Markdown file."""
    if not file_path or not os.path.exists(file_path):
        return None
    try:
        if file_path.lower().endswith(".json"):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        elif file_path.lower().endswith(".md"):
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            print(f"Unsupported file type for loading: {file_path}")
            return None
    except Exception as e:
        print(f"Error loading data from file {file_path}: {e}")
        return None
