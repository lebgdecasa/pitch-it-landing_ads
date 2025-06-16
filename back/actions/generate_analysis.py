# back/actions/generate_analysis.py

from back.actions.gemini_api import generate
import json
import os

def send_report_and_filtered_posts_with_gemini(
    report_content,
    filtered_posts_file,
    user_prompt="Give me an analysis of these findings.",
):
    """
    Reads a markdown report and a JSON file of filtered Reddit posts, then
    sends them (plus a user prompt) to the LLM for analysis.
    """
    # 2. Read the filtered JSON file
    try:
        # Ensure the file exists before trying to open it
        if not os.path.exists(filtered_posts_file):
             print(f"Error: Filtered posts file not found at {filtered_posts_file}")
             # Decide how to handle: return None, raise error, or return default analysis?
             # Returning None is often safest for the pipeline.
             return None
        with open(filtered_posts_file, "r", encoding="utf-8") as ff:
            filtered_data = json.load(ff)
            # Extract the list from the structure saved by filter_scraped_posts_with_llm
            filtered_posts_list = filtered_data.get("filtered_posts", [])
    except json.JSONDecodeError:
         print(f"Error: Invalid JSON in {filtered_posts_file}")
         return None
    except Exception as e:
        print(f"Error reading {filtered_posts_file}: {e}")
        return None

    # 3. Build a single prompt
    prompt = f"""You are given:
    1. A markdown report.
    2. A list of filtered Reddit posts.
    3. A user prompt requesting additional analysis.
    \n\n--- START OF MARKDOWN REPORT ---
    \n{report_content}\n
    --- END OF MARKDOWN REPORT ---
    \n\n--- START OF FILTERED POSTS ---
    \n{json.dumps(filtered_posts_list, indent=2)}\n
    --- END OF FILTERED POSTS ---
    \n\nUSER PROMPT:\n{user_prompt}\n\n
    Please provide your best possible response."""

    # 4. Call the LLM
    response = generate(prompt)
    return response
