# back/actions/scrape_and_filter_posts.py
import praw
import os
import requests
import json
import random
import time
from dotenv import load_dotenv
from back.actions.gemini_api import generate
import os

# Load environment variables from the .env file in the project root
# Get the project root directory (3 levels up from this file)
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(project_root, '.env')
load_dotenv(env_path)
api_key = os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")
reddit = praw.Reddit(
    client_id="ivjgOjD6WCmaxNuK61E81w",
    client_secret="syrgn5BfXNHZdFn3m2f6w58i_m7Tbw",
    user_agent="Pitch !t",
)

def analyze_with_llm(prompt):
    """
    Uses LM Studio to analyze a prompt.
    """
    model_name = "gemma-3-4b-it@q4_k_m"
    try:
        system_prompt = """You are a helpful AI assistant. Provide concise and accurate answers."""
        headers = {"Content-Type": "application/json"}
        payload = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 8000,
            "stop": ["\n\n"],
            "model": model_name
        }
        response = requests.post(api_key + "/v1/chat/completions", headers=headers, json=payload, verify=False)
        response.raise_for_status()
        response_json = response.json()

        if "choices" not in response_json or not response_json["choices"]:
            print("Invalid response from LM Studio: missing 'choices'")
            return None

        return response_json['choices'][0]['message']['content'].strip()

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with LLM: {e}")
        return None
    except (KeyError, IndexError) as e:
        print(f"Error processing LLM response: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def generate_broad_keywords(product_description):
    """
    Generates broad keywords for initial subreddit search.
    """
    print(f"[LOG] Product Description passed to generate_broad_keywords: {product_description}")
    prompt = f"""
    Given the following product description, respond with only a comma-separated list of broad keywords that might match relevant Reddit subreddits.
    We intend to use these subreddits to explore user interest, gather feedback, and potentially market this product. Do not include any other text, introductions, or explanations, only a list of comma-separated keywords.
    Product Description:
    {product_description}
    Broad Keywords:
    """
    keywords_str = generate(prompt)
    if keywords_str:
        # remove extra whitespace and possible leading/trailing punctuation
        raw_keywords = [k.strip().strip('.') for k in keywords_str.split(',')]
        # remove duplicates and empty items
        unique_keywords = list({kw for kw in raw_keywords if kw})
        print(f"[LOG] Keywords generated: {unique_keywords}")
        return unique_keywords
    print("[LOG] No keywords generated.")
    return []

def search_subreddits(keywords, subreddits_per_keyword=10):
    """
    Searches for subreddits across multiple keywords,
    returning up to subreddits_per_keyword for each keyword.
    """
    subreddits = []
    for keyword in keywords:
        print(f"keyword is = {keyword}")
        count_for_keyword = 0
        try:
            for subreddit in reddit.subreddits.search(keyword):
                if subreddit not in subreddits:
                    subreddits.append(subreddit)
                    print(f"subreddits are: {subreddit}")
                    count_for_keyword += 1
                if count_for_keyword >= subreddits_per_keyword:
                    break
        except Exception as e:
            print(f'''Error searching subreddits for keyword '{keyword}': {e}''')
        time.sleep(random.choice([4, 5]))
    return subreddits

def filter_subreddits_with_llm(subreddits, product_description, specific_keywords):
    """
    Filters subreddits using the LLM and specific keywords.
    """
    relevant_subreddits = []
    specific_keywords_str = ", ".join(specific_keywords)
    for subreddit in subreddits:
        try:
            prompt = f"""You are tasked with determining the relevance of a Reddit subreddit to a specific product.
Consider the product description and specific keywords.
Respond ONLY with 'Relevant' or 'Irrelevant' (no explanation, no extra text, just one word).
If you understand, reply with only one word: Relevant or Irrelevant.

Product Description:
{product_description}

Specific Keywords:
{specific_keywords_str}

Subreddit Information:
Name: {subreddit.display_name}
Description: {subreddit.public_description}
Subscribers: {subreddit.subscribers}
Is NSFW?: {subreddit.over18}

Relevance (Relevant/Irrelevant):"""
            print(f"[LOG] LLM Query (filter_subreddits_with_llm):\n{prompt}\n---")
            relevance = generate(prompt)
            print(f"[LOG] LLM Raw Response: {relevance}\n===")
            # Parse response: only accept if first word is 'relevant' (case-insensitive, ignore extra text)
            if relevance:
                first_word = relevance.strip().split()[0].lower()
                if first_word == "relevant":
                    relevant_subreddits.append(subreddit)
        except Exception as e:
            print(f"Error in filter_subreddits_with_llm for {subreddit.display_name}: {e}")
            continue
    return relevant_subreddits

def scrape_subreddit(subreddit, num_posts=0, task_dir="."):
    """
    Scrapes the top 'num_posts' submissions from the subreddit,
    capturing each post's title, selftext, score, and top 5 comments.
    Saves the results to a JSON file named after the subreddit.
    """

    scraped_folder = os.path.join(task_dir, "scraped_subreddits")
    folder = "scraped_subreddits"
    os.makedirs(scraped_folder, exist_ok=True)
    top_posts = []

    try:
        # Pull the top posts
        for submission in subreddit.top(limit=num_posts):
            # Sort comments by confidence (so the first 5 we collect will be the top ones)
            submission.comment_sort = "confidence"
            submission.comments.replace_more(limit=0)

            # Collect the top 5 comments
            top_comments = []
            for i, comment in enumerate(submission.comments):
                if i >= 5:
                    break
                top_comments.append(comment.body if hasattr(comment, "body") else "")

            # Attach the comments to submission for later use
            submission.top_comments = top_comments
            top_posts.append(submission)

    except Exception as e:
        print(f"Error scraping subreddit {subreddit.display_name}: {e}")

    # Build a JSON-friendly structure
    data = {
        "subreddit_name": subreddit.display_name,
        "posts": []
    }

    for post in top_posts:
        data["posts"].append({
            "title": post.title,
            "selftext": post.selftext,
            "score": post.score,     # <-- include the post score
            "top_comments": getattr(post, 'top_comments', [])
        })

    # Save to a JSON file named after the subreddit
    filename = os.path.join(scraped_folder, f"{subreddit.display_name}.json")
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {filename}")
    except Exception as e:
        print(f"Error writing JSON file for {subreddit.display_name}: {e}")

    return top_posts

def filter_scraped_posts_with_llm(
    task_dir=".",
    product_description="",
    api_key=""
):
    """
    Reads each JSON file in `folder`, filters posts with the LLM,
    and saves all relevant posts (with subreddit, title, selftext, comments)
    into one combined JSON file called `filtered_posts.json` (by default).
    """
    # Ensure we have a place to store final results
    filtered_posts = []
    input_folder = os.path.join(task_dir, "scraped_subreddits")
    output_filename = os.path.join(task_dir, "filtered_posts.json")

    if not os.path.isdir(input_folder):
        print(f"Warning: Scraped subreddits folder not found at {input_folder}. Skipping filtering.")
        # Save an empty file to prevent errors downstream
        try:
            with open(output_filename, "w", encoding="utf-8") as out:
                json.dump({"filtered_posts": []}, out, indent=2)
            print(f"Created empty filtered posts file at {output_filename}")
        except Exception as e:
            print(f"Error writing empty filtered posts file: {e}")
        return []

    # Iterate over each JSON file in the folder
    for file in os.listdir(input_folder):
        if file.endswith(".json"):
            path = os.path.join(input_folder, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    subreddit_data = json.load(f)

                subreddit_name = subreddit_data.get("subreddit_name", "Unknown")
                posts = subreddit_data.get("posts", [])

                for post in posts:
                # Build your prompt for each post
                    prompt = f"""Determine if this Reddit post is relevant to the following product description.
                                Respond with 'Relevant' or 'Irrelevant'.

                                Product Description:
                                {product_description}

                                Subreddit: {subreddit_name}
                                Post Title: {post.get("title", "")}
                                Post Text: {post.get("selftext", "")}
                                Top Comments: {post.get("top_comments", [])}
                                Score: {post.get('score')},

                                Relevance (Relevant/Irrelevant):"""

                relevance = generate(prompt)
                if relevance and relevance.strip().lower() == "relevant":
                    # If relevant, store in final combined list
                    filtered_posts.append({
                        "subreddit":  subreddit_name,
                        "title":      post.get("title", ""),
                        "selftext":   post.get("selftext", ""),
                        "top_comments": post.get("top_comments", [])
                    })
            except json.JSONDecodeError:
                print(f"Warning: Skipping invalid JSON file {path}")
            except Exception as e:
                 print(f"Error processing file {path}: {e}")


    # Write all filtered posts to the task-specific output JSON
    try:
        with open(output_filename, "w", encoding="utf-8") as out:
            json.dump({"filtered_posts": filtered_posts}, out, indent=2)
        print(f"All filtered posts saved to {output_filename}")
    except Exception as e:
        print(f"Error writing filtered posts file: {e}")
    return filtered_posts

# def send_report_and_filtered_posts_with_gemini(
#     report_file="report.md",
#     filtered_posts_file="filtered_posts.json",
#     user_prompt="Give me an analysis of these findings.",
# ):
#     """
#     Reads a markdown report and a JSON file of filtered Reddit posts, then
#     sends them (plus a user prompt) to the LLM for analysis.
#     """
#     # 1. Read the markdown report
#     try:
#         with open(report_file, "r", encoding="utf-8") as rf:
#             report_content = rf.read()
#     except Exception as e:
#         print(f"Error reading {report_file}: {e}")
#         return None

#     # 2. Read the filtered JSON file
#     try:
#         with open(filtered_posts_file, "r", encoding="utf-8") as ff:
#             filtered_data = json.load(ff)
#     except Exception as e:
#         print(f"Error reading {filtered_posts_file}: {e}")
#         return None

#     # 3. Build a single prompt
#     prompt = f"""You are given:
#     1. A markdown report.
#     2. A list of filtered Reddit posts.
#     3. A user prompt requesting additional analysis.
#     \n\n--- START OF MARKDOWN REPORT ---
#     \n{report_content}\n
#     --- END OF MARKDOWN REPORT ---
#     \n\n--- START OF FILTERED POSTS ---
#     \n{json.dumps(filtered_data, indent=2)}\n
#     --- END OF FILTERED POSTS ---
#     \n\nUSER PROMPT:\n{user_prompt}\n\n
#     Please provide your best possible response."""

#     # 4. Call the LLM
#     response = generate(prompt)
#     return response
