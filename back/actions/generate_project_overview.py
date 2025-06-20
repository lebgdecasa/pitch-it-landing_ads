import base64
import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(project_root, '.env')
load_dotenv(env_path)


def create_overview_prompt(key_trends, description, final_analysis):
    return f"""
You are a business analyst helping founders summarize their venture ideas.

You will receive:
- A **product description** describing what the product is or does
- A **key trends** section summarizing market dynamics, behaviors, or macro shifts
- A **final analysis** section containing deeper insights, goals, pain points, or opportunities

Based on these, output a JSON object with the following keys:

- "Problem": A concise description of the core pain point being solved
- "Solution": How the product solves the problem
- "Competition": Existing tools, services, or market alternatives
- "Target_Market": Who this product is for (user personas, segments, or industries)
- "Business_Model": How the business intends to make money
- "Marketing_Strategy": How the product will reach its market
- "Unique_selling_point": What makes this product stand out compared to others

Only respond with a JSON object. Do not add any extra explanation.

---
**Key Trends:**
{key_trends}

**Product Description:**
{description}

**Final Analysis:**
{final_analysis}
"""

def generate_project_overview(prompt):
    client = genai.Client(
        api_key=os.environ.get("NEXT_PUBLIC_GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0.6,
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type = genai.types.Type.OBJECT,
            required = ["Problem", "Solution", "Competition", "Target_Market", "Business_Model", "Marketing_Strategy", "Unique_selling_point"],
            properties = {
                "Problem": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "Solution": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "Competition": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "Target_Market": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "Business_Model": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "Marketing_Strategy": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
                "Unique_selling_point": genai.types.Schema(
                    type = genai.types.Type.STRING,
                ),
            },
        ),
    )
    response_text = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        response_text += chunk.text

    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        # Fallback to raw string if the model returns malformed JSON
        return response_text

if __name__ == "__main__":
    generate_project_overview()
