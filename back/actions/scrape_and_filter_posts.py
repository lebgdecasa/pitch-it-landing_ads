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

#TO-DO: Add a function to generate specific keywords from the product description, and modify the subreddits_per_keyword parameter
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
    Filters subreddits using the LLM and specific keywords in a single batch API call.
    """
    if not subreddits:
        return []

    relevant_subreddits = []
    specific_keywords_str = ", ".join(specific_keywords)

    # Create a formatted list of all subreddits for batch processing
    subreddit_list = []
    for i, subreddit in enumerate(subreddits, 1):
        subreddit_info = f"{i}. {subreddit.display_name} - Description: {subreddit.public_description or 'No description'} - Subscribers: {subreddit.subscribers} - NSFW: {subreddit.over18}"
        subreddit_list.append(subreddit_info)

    subreddits_text = "\n".join(subreddit_list)

    prompt = f"""You are tasked with filtering Reddit subreddits based on their relevance to a specific product.

Product Description:
{product_description}

Specific Keywords:
{specific_keywords_str}

Here is the list of subreddits to evaluate:
{subreddits_text}

Instructions:
- Analyze each subreddit's name, description, and context
- Determine which subreddits are relevant to the product description and keywords
- Respond ONLY with a comma-separated list of the EXACT subreddit names that are relevant
- Do not include numbers, explanations, or any other text
- If no subreddits are relevant, respond with "NONE"

Example response format: subredditname1, subredditname2, subredditname3

Relevant subreddits:"""

    try:
        print(f"[LOG] LLM Batch Query (filter_subreddits_with_llm):\n{prompt}\n---")
        relevance_response = generate(prompt)
        print(f"[LOG] LLM Raw Response: {relevance_response}\n===")

        if relevance_response and relevance_response.strip().upper() != "NONE":
            # Parse the comma-separated response
            relevant_names = [name.strip() for name in relevance_response.split(',')]
            relevant_names = [name for name in relevant_names if name]  # Remove empty strings

            # Match the returned names with the original subreddit objects
            for subreddit in subreddits:
                if subreddit.display_name in relevant_names:
                    relevant_subreddits.append(subreddit)

            print(f"[LOG] Found {len(relevant_subreddits)} relevant subreddits out of {len(subreddits)} total")

    except Exception as e:
        print(f"Error in batch filter_subreddits_with_llm: {e}")
        # Fallback: return empty list instead of crashing
        return []

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
    posts_per_batch=40
):
    """
    Reads each JSON file in `folder`, filters posts with the LLM using chunked batch processing,
    and saves all relevant posts (with subreddit, title, selftext, comments)
    into one combined JSON file called `filtered_posts.json` (by default).

    Args:
        posts_per_batch: Number of posts to process in each batch (default: 40)
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

    # Collect all posts from all subreddits for batch processing
    all_posts = []
    post_counter = 0

    for file in os.listdir(input_folder):
        if file.endswith(".json"):
            path = os.path.join(input_folder, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    subreddit_data = json.load(f)

                subreddit_name = subreddit_data.get("subreddit_name", "Unknown")
                posts = subreddit_data.get("posts", [])

                for post in posts:
                    post_counter += 1
                    all_posts.append({
                        "id": post_counter,
                        "subreddit": subreddit_name,
                        "title": post.get("title", ""),
                        "selftext": post.get("selftext", ""),
                        "top_comments": post.get("top_comments", []),
                        "score": post.get("score", 0)
                    })

            except json.JSONDecodeError:
                print(f"Warning: Skipping invalid JSON file {path}")
            except Exception as e:
                print(f"Error processing file {path}: {e}")

    if not all_posts:
        print("No posts found to filter.")
        try:
            with open(output_filename, "w", encoding="utf-8") as out:
                json.dump({"filtered_posts": []}, out, indent=2)
        except Exception as e:
            print(f"Error writing empty filtered posts file: {e}")
        return []

    # Split posts into chunks for batch processing
    def chunk_posts(posts, chunk_size):
        """Split posts into chunks of specified size."""
        for i in range(0, len(posts), chunk_size):
            yield posts[i:i + chunk_size]

    post_chunks = list(chunk_posts(all_posts, posts_per_batch))
    total_chunks = len(post_chunks)

    print(f"[LOG] Processing {len(all_posts)} posts in {total_chunks} batches of {posts_per_batch} posts each")

    # Process each chunk
    for chunk_idx, chunk in enumerate(post_chunks, 1):
        print(f"[LOG] Processing batch {chunk_idx}/{total_chunks} ({len(chunk)} posts)")

        # Create batch prompt for this chunk (preserve full content)
        posts_text = []
        for post in chunk:
            post_summary = f"{post['id']}. [{post['subreddit']}] Title: {post['title']}"

            if post['selftext'].strip():
                post_summary += f"\nText: {post['selftext']}"

            if post['top_comments']:
                comments_str = "\n".join([f"- {comment}" for comment in post['top_comments'][:5]])
                post_summary += f"\nTop Comments:\n{comments_str}"
            else:
                post_summary += f"\nComments: No comments"

            post_summary += f"\nScore: {post['score']}\n"
            posts_text.append(post_summary)

        batch_posts_text = "\n---\n".join(posts_text)

        prompt = f"""You are tasked with filtering Reddit posts based on their relevance to a specific product description.

Product Description:
{product_description}

--------
Below is a batch of Reddit posts from various subreddits. Each post has an ID number at the beginning and is separated by "---".

Posts to evaluate:
{batch_posts_text}

--------
Instructions:
- Analyze each post's title, content, comments, and context thoroughly
- Determine which posts are relevant to the product description
- Consider posts relevant if they discuss related problems, solutions, user needs, or market segments
- Respond ONLY with a comma-separated list of the ID numbers of relevant posts
- Do not include explanations, post titles, or any other text
- If no posts in this batch are relevant, respond with "NONE"

Example response format: 1, 5, 12, 23

Relevant post IDs:"""

        try:
            print(f"[LOG] LLM Batch Query for chunk {chunk_idx} (IDs {chunk[0]['id']}-{chunk[-1]['id']})")
            relevance_response = generate(prompt)
            print(f"[LOG] LLM Raw Response for chunk {chunk_idx}: {relevance_response}")

            if relevance_response and relevance_response.strip().upper() != "NONE":
                # Parse the comma-separated response of IDs
                try:
                    relevant_ids = [int(id_str.strip()) for id_str in relevance_response.split(',') if id_str.strip().isdigit()]

                    # Match the returned IDs with the original posts in this chunk
                    chunk_filtered = 0
                    for post in chunk:
                        if post["id"] in relevant_ids:
                            filtered_posts.append({
                                "subreddit": post["subreddit"],
                                "title": post["title"],
                                "selftext": post["selftext"],
                                "top_comments": post["top_comments"]
                            })
                            chunk_filtered += 1

                    print(f"[LOG] Found {chunk_filtered} relevant posts in chunk {chunk_idx}")

                except ValueError as e:
                    print(f"Error parsing LLM response IDs for chunk {chunk_idx}: {e}")
                    print(f"Raw response was: {relevance_response}")
            else:
                print(f"[LOG] No relevant posts found in chunk {chunk_idx}")

        except Exception as e:
            print(f"Error processing chunk {chunk_idx}: {e}")
            # Continue with next chunk rather than crashing
            continue

        # Small delay between API calls to be respectful
        if chunk_idx < total_chunks:
            time.sleep(1)

    print(f"[LOG] Total relevant posts found: {len(filtered_posts)} out of {len(all_posts)} total posts")

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
