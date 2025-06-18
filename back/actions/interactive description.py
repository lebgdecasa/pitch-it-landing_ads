#interactive description.py
import os
import json
from typing import List, Dict
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables from the .env file in the project root
# Get the project root directory (3 levels up from this file)
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(project_root, '.env')
load_dotenv(env_path)

class QuestionField:
    def __init__(self, question_id: str, question_text: str):
        self.question_id = question_id
        self.question_text = question_text

def compare_with_llm(user_description: str, question_fields: List[QuestionField]) -> Dict[str, bool]:
    """
    Calls the Gemini API to check which of the three questions are 'answered'
    or 'not answered' based on the user's description. Returns a dictionary
    question_id -> bool indicating if the question appears addressed.

    Expects exactly three questions in `question_fields`.
    """

    # --- 1) Build a carefully structured prompt ---
    # We tell the LLM exactly what "answered" or "not answered" should mean,
    # and how to respond with JSON. The prompt below is quite explicit:
    prompt_str = f"""
You are a strict JSON checker. You have these three questions:
1) {question_fields[0].question_text}
2) {question_fields[1].question_text}
3) {question_fields[2].question_text}

User description:
\"\"\"{user_description}\"\"\"

Rules for deciding if a question is answered:
- If the user description contains enough relevant information to reasonably answer the question, then mark it as "answered".
- Otherwise, mark it as "not answered".

Rules for output:
- Return ONLY valid JSON matching the exact format below.
- Do NOT include any other commentary or keys.

Required JSON format (use either "answered" or "not answered"):
{{
  "Question 1": "answered or not answered",
  "Question 2": "answered or not answered",
  "Question 3": "answered or not answered"
}}

IMPORTANT:
- Use the EXACT strings "answered" or "not answered" (lowercase, spelled exactly).
- Do NOT add any explanation or additional text outside the JSON.
"""

    # --- 2) Initialize the Gemini client ---
    client = genai.Client(
        api_key=os.environ.get("NEXT_PUBLIC_GEMINI_API_KEY"),
    )

    # --- 3) Prepare the request content ---
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt_str),
            ],
        ),
    ]

    # --- 4) Define the JSON schema. We require three properties with
    #        the exact keys "Question 1", "Question 2", "Question 3". ---
    generate_content_config = types.GenerateContentConfig(
        temperature=0,
        response_mime_type="application/json",
        response_schema=types.Schema(
            type=types.Type.OBJECT,
            required=["Question 1", "Question 2", "Question 3"],
            properties={
                "Question 1": types.Schema(type=types.Type.STRING),
                "Question 2": types.Schema(type=types.Type.STRING),
                "Question 3": types.Schema(type=types.Type.STRING),
            },
        ),
    )

    # --- 5) Collect the streamed response into a single string ---
    response_str = ""
    for chunk in client.models.generate_content_stream(
        model="gemini-2.0-flash",
        contents=contents,
        config=generate_content_config,
    ):
        response_str += chunk.text

    # --- 6) Parse the JSON. If it fails, default to all False. ---
    try:
        data = json.loads(response_str)
    except json.JSONDecodeError:
        print("Error: Gemini response is not valid JSON. Defaulting to all 'False'.")
        return {
            question_fields[0].question_id: False,
            question_fields[1].question_id: False,
            question_fields[2].question_id: False,
        }

    # --- 7) Convert "answered" or "not answered" to booleans. ---
    def is_answered(label: str) -> bool:
        return label.strip().lower() == "answered"

    gemini_result_map = {
        "Question 1": data.get("Question 1", "").strip().lower(),
        "Question 2": data.get("Question 2", "").strip().lower(),
        "Question 3": data.get("Question 3", "").strip().lower(),
    }

    results = {
        question_fields[0].question_id: is_answered(gemini_result_map["Question 1"]),
        question_fields[1].question_id: is_answered(gemini_result_map["Question 2"]),
        question_fields[2].question_id: is_answered(gemini_result_map["Question 3"]),
    }

    return results

if __name__ == "__main__":
    # Example usage:
    fields_to_check = [
        QuestionField("proj_type", "Is it a physical product, software, or service?"),
        QuestionField("problem_statement", "What problem are you solving?"),
        QuestionField("target_market", "Which customers / market are you targeting?"),
    ]

    user_input = """

    """

    status = compare_with_llm(user_input, fields_to_check)
    print("LLM-based check ->", status)
