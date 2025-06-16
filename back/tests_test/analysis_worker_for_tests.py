# tests_test/analysis_worker_for_tests.py
import actions.scrape_and_filter_posts
import actions.generate_analysis
import actions.call_deep_research_api
import actions.generate_personas_json
import actions.gemini_api
import time
import actions.create_personas
import asyncio
import traceback
import os

BASE_DATA_DIR = "task_data"

# Define the main analysis function
def run_analysis_job(product_description: str, task_id: str, update_status_callback, log_callback, loop: asyncio.AbstractEventLoop):
    """
    Runs the full analysis pipeline as a background job.

    Args:
        product_description: The product description input by the user.
        task_id: The unique ID for this task.
        update_status_callback: A function to call to update the task's overall status and data.
                                 Expected signature: update_status_callback(task_id, status=None, data_key=None, data_value=None)
        log_callback: A function to call to send log messages.
                      Expected signature: log_callback(task_id, message)
    """
    final_analysis_result = None
    persona_details = None

    task_dir = os.path.join(BASE_DATA_DIR, task_id)
    try:
        os.makedirs(task_dir, exist_ok=True)
        # Create subdirectory for scraped posts as well
        os.makedirs(os.path.join(task_dir, "scraped_subreddits"), exist_ok=True)
        print(f"Ensured task directory exists: {task_dir}")
    except OSError as e:
        # Handle potential error during directory creation
        error_message = f"CRITICAL ERROR: Could not create task directory {task_dir}. Error: {e}"
        print(error_message)
        safe_callback(log_callback(task_id, error_message))
        safe_callback(update_status_callback(task_id, status="failed", data_key="error", data_value=error_message))
        return # Stop execution if directory cannot be created

    def safe_callback(coro):
        """Helper to run callback coroutine thread-safely and log result/error."""
        future = asyncio.run_coroutine_threadsafe(coro, loop)
        try:
            # Optional: Wait briefly for the result or log if needed,
            # but be careful not to block the worker thread for too long.
            # result = future.result(timeout=5) # Example: wait up to 5 seconds
            # print(f"Callback {coro.__name__} completed with result: {result}") # For debugging
             pass # Fire-and-forget for now is often sufficient for logs/status
        except Exception as e:
            # Log errors happening *during* the callback execution in the main thread
            print(f"Error running callback {coro.__name__} for task {task_id} in event loop: {e}")

    try:
        ## Create a deepresearch (Key Trends) ##
        time.sleep(5)
        safe_callback(log_callback(task_id, "Starting Key Trends Analysis..."))
        safe_callback(update_status_callback(task_id, status="running_key_trends"))

        key_trend_prompt_generator = f'''
        I need you to adapt the following generic prompt to the project description. Do not output anything else but the modified prompt.
        You must not add anything else to the adapted prompt.
        Here is the original prompt:
        ---
        [Project Name] is a [concise description of the concept or product], not yet launched.
        Please conduct a broad netnography analysis by exploring social media, online forums, subreddits, blogs, and other relevant digital channels to identify emerging trends, user sentiments, pain points, and competitive benchmarks in the [project’s] domain.
        The goal is to understand current market conditions, uncover user expectations, and gather insights from diverse demographics and regions so that [Project Name] can effectively refine its value proposition and strategy before launch.
        As part of this study, please discover and examine any existing platforms or solutions that may be considered competitors, and provide a synthesized report on how [Project Name] can uniquely position itself based on your findings.
        ---
        here is the project description:
        ---
        {product_description}
        ---

        Remember, you must only output the modified prompt.
        '''

        print(f"TASK {task_id}: ----> BEFORE gemini_api.generate <----")
        key_trend_prompt = actions.gemini_api.generate(key_trend_prompt_generator)
        print(f"TASK {task_id}: ----> AFTER gemini_api.generate <----")

        print(f"TASK {task_id}: ----> BEFORE call_deep_research_api.run_research_api <----")
        report = actions.call_deep_research_api.run_research_api(key_trend_prompt, 6, 4)
        print(f"TASK {task_id}: ----> AFTER call_deep_research_api.run_research_api <----")

        safe_callback(log_callback(task_id, "Key Trends Analysis complete."))

        ## Generate Keywords ##
        safe_callback(log_callback(task_id, "Starting keywords generation..."))
        safe_callback(update_status_callback(task_id, status="generating_keywords"))
        query = actions.scrape_and_filter_posts.generate_broad_keywords(product_description, lmstudio_api_url="http://127.0.0.1:6942")
        log_callback(task_id, f"Generated keywords: {query}")

        ## Find subreddits based on keywords ##
        safe_callback(log_callback(task_id, "Finding subreddits..."))
        safe_callback(update_status_callback(task_id, status="finding_subreddits"))
        # found_subreddits = scrape_and_filter_posts.search_subreddits(query)
        # safe_callback(log_callback(task_id, f"Found {len(found_subreddits)} potential subreddits."))

        ## Filtering Found subreddits ##
        safe_callback(log_callback(task_id, "Filtering subreddits..."))
        safe_callback(update_status_callback(task_id, status="filtering_subreddits"))
        # filtered = scrape_and_filter_posts.filter_subreddits_with_llm(found_subreddits, product_description, query, "http://127.0.0.1:6942")
        # safe_callback(log_callback(task_id, f"Filtered subreddits: {[sub.display_name for sub in filtered]}"))

        ## Scrape the subreddits ##
        safe_callback(log_callback(task_id, "Starting Scraping..."))
        safe_callback(update_status_callback(task_id, status="scraping_subreddits"))
        # for i, sub in enumerate(31):
        #     safe_callback(log_callback(task_id, f"Scraping subreddit {sub.display_name} ({i+1}/31)..."))
        #     # scrape_and_filter_posts.scrape_subreddit(sub, num_posts=10)
        #     # time.sleep(random.choice([2, 4]))
        safe_callback(log_callback(task_id, "Scraping done!"))

        ## Filter the scraped posts ##
        safe_callback(update_status_callback(task_id, status="filtering_posts"))
        # scrape_and_filter_posts.filter_scraped_posts_with_llm(product_description=product_description, lmstudio_api_url="http://127.0.0.1:6942")
        safe_callback(log_callback(task_id, "All Irrelevant posts have been removed."))

        ## Analysis ##
        safe_callback(log_callback(task_id, "🔍 Starting Prompt 1 (Jobs to Be Done)..."))
        safe_callback(update_status_callback(task_id, status="analyzing_jtbd"))
        jtbd_prompt = f"""You are a netnographic researcher studying user discussions. Here is data containing subreddit posts, comments, and scores, as well as a report. Your task is to discover the primary ‘Jobs to Be Done’ that emerge from this data.
            Here are specific trigger questions to consider:
            1. What is one thing your customer couldn't live without accomplishing? What stepping stones help your customer achieve this key job?
            2. In which different contexts do these users operate, and how do their goals or activities change with these contexts?
            3. Do they collaborate with others? Which social or interactive tasks do they need to accomplish?
            4. Which tasks or functional problems are these users trying to solve in their work or personal life?
            5. Are there potential problems they have that they might not even be aware of?
            6. Which emotional needs do they seem to be pursuing? Are there certain jobs that would give them a sense of self-satisfaction or personal identity?
            7. How do they want to be perceived by others, and how can they accomplish that image?
            8. How do they want to feel, and how can they achieve that feeling?
            9. As users interact with a product/service over its entire lifespan, do additional supporting jobs or role changes appear?
                Use these questions as a framework to:
                - Identify explicit or implicit ‘jobs’ users discuss.
                - Describe whether each job is mainly functional, social, or emotional.
                - Back up your findings with specific references or patterns in the data.
                """
        jtbd = actions.generate_analysis.send_report_and_filtered_posts_with_gemini(
                report_content= report,
                filtered_posts_file="filtered_posts.json",
                user_prompt=jtbd_prompt,
            )
        if jtbd is not None:
            # No need to save to file here unless you specifically want it
            # with open("analysis_JTBD.md", "w", encoding="utf-8") as md_file:
            #     md_file.write(jtbd)
            safe_callback(log_callback(task_id, "JTBD Analysis complete."))
        else:
            safe_callback(log_callback(task_id, "LLM returned no response for JTBD."))
            # Potentially raise an error or handle this case

        safe_callback(log_callback(task_id, "🔍 Starting Prompt 2 (Pains)..."))
        safe_callback(update_status_callback(task_id, status="analyzing_pains"))
        pains_prompt = """You are a netnographic researcher studying user discussions from Reddit. Here is data containing subreddit posts, comments, and scores, as well as a report. Your task is to discover the primary ‘Pains’ that emerge from this data.
            Here are specific trigger questions to consider:
            1. How do these users define ‘too costly’? Is it time, money, effort, or something else?
            2. Which frustrations, annoyances, or headaches do they mention?
            3. Which current solutions or value propositions do they find underperforming or missing features?
            4. What are the main difficulties and challenges they encounter? Are they struggling with complexity or lacking knowledge?
            5. Are they worried about negative social consequences, like a loss of face, trust, or status?
            6. Which risks do they fear, whether financial, social, or technical? What could go wrong?
            7. What’s keeping them up at night—major concerns or lingering problems?
            8. Which common mistakes or “user errors” do they run into?
            9. What barriers are preventing them from adopting a certain product or service?
            Use these questions as a framework to:
            - Identify explicit or implicit pains or frustrations.
            - Note underlying causes and potential severity of each pain.
            - Reference any direct quotes or repeated themes from the subreddit data.
            """
        pains = actions.generate_analysis.send_report_and_filtered_posts_with_gemini(
                report_content=report,
                filtered_posts_file="filtered_posts.json",
                user_prompt=pains_prompt,
            )
        if pains is not None:
            safe_callback(log_callback(task_id, "Pains Analysis complete."))
        else:
            safe_callback(log_callback(task_id, "LLM returned no response for Pains."))
            # Handle error

        safe_callback(log_callback(task_id, "🔍 Starting Prompt 3 (Gains)..."))
        safe_callback(update_status_callback(task_id, status="analyzing_gains"))
        gains_prompt = """You are a netnographic researcher studying user discussions from Reddit. Below is data containing subreddit posts, comments, and scores, as well as a report. Your task is to discover the primary ‘Gains’ that emerge from this data.
            Here are specific trigger questions to consider:
            1. What savings (time, money, effort) would make users especially happy?
            2. What quality levels do they expect? What do they wish there was more or less of?
            3. Which aspects of existing solutions do they enjoy or find delightful? Are there standout features?
            4. What would make their jobs or life easier—lower learning curve, cost reduction, better support?
            5. What positive social consequences do they seek (e.g., recognition, status, influence)?
            6. Which features or improvements do they appear to want the most?
            7. What do users dream about? Are there big aspirations or “nice surprises” they mention?
            8. How do they measure success or failure? Which metrics do they care about?
            9. What would increase their likelihood of adopting a new solution? Is cost or risk reduction important?
            Use these questions as a framework to:
            - Identify explicit or implicit desires, benefits, or positive outcomes that users seek.
            - Consider how relevant each gain is to users’ real-world context.
            - Reference direct statements or recurring points from the subreddit data."""
        gains = actions.generate_analysis.send_report_and_filtered_posts_with_gemini(
                report_content= report,
                filtered_posts_file="filtered_posts.json",
                user_prompt=gains_prompt,
            )
        if gains is not None:
            safe_callback(log_callback(task_id, "Gains Analysis complete."))
        else:
            safe_callback(log_callback(task_id, "LLM returned no response for Gains."))
            # Handle error

        safe_callback(log_callback(task_id, "🔍 Starting Prompt 4 (Recap)..."))
        safe_callback(update_status_callback(task_id, status="analyzing_recap"))
        recap_prompt = f"""You are a netnographic researcher. After identifying the Jobs, Pains, and Gains, please rank them as follows:
            1. List each Job from the data, giving it an Importance score from ‘insignificant’ to ‘important.
            2. List each Pain, giving it a Severity score from ‘moderate’ to ‘extreme.
            3. List each Gain, giving it a Relevance score from ‘nice to have’ to ‘essential.’
            Use the analyses you find below.
            Consider user sentiments, frequency of mentions, or any other contextual factors to justify each ranking.
            Analysis_1: {jtbd}
            Analysis_2: {pains}
            Analysis_3: {gains}
            """
        recap_analysis = actions.gemini_api.generate(recap_prompt)
        if recap_analysis is not None:
            safe_callback(log_callback(task_id, "Recap Analysis complete."))
        else:
            safe_callback(log_callback(task_id, "LLM returned no response for Recap."))
            # Handle error

        safe_callback(log_callback(task_id, "🔍 Starting Prompt 5 (Final Analysis)..."))
        safe_callback(update_status_callback(task_id, status="analyzing_final"))
        final_analysis_prompt = f"""You are a netnographic researcher. Below are four sets of analyses from the same Reddit data:
        **1. Jobs to Be Done** (Analysis 1)
        **2. Pains** (Analysis 2)
        **3. Gains** (Analysis 3)
        **4. Rankings** (Analysis 4)

        Synthesize these into one cohesive report, structured strictly in Markdown format suitable for direct rendering.

        Your report structure MUST follow these sections exactly:
        1. **Introduction**: Brief overview of the purpose of this netnographic research.
        2. **Jobs to Be Done**: Summarize the findings from Analysis 1.
        3. **Pains**: Summarize the main points from Analysis 2.
        4. **Gains**: Summarize the main points from Analysis 3.
        5. **Rankings**: Incorporate and discuss the Importance/Severity/Relevance scores from Analysis 4.
        6. **Conclusions & Recommendations**: Based on all analyses, provide final remarks or suggestions.

        Analysis_1: {jtbd}
        Analysis_2: {pains}
        Analysis_3: {gains}
        Analysis_4: {recap_analysis}

        **IMPORTANT INSTRUCTIONS:**
        - Your entire response MUST consist **only** of the raw Markdown report content itself.
        - **DO NOT** include any introductory text, preamble, explanation, or any other text before the report starts (e.g., absolutely do not start with "Okay, here is the report...").
        - **DO NOT** wrap the final report content in markdown code fences (like ``` or ```markdown). The output should be pure markdown text, not a markdown code block.
        - The response MUST start directly with the first line of the markdown report (e.g., the first character should be `#` for the main title).
        """

        final_analysis_result = actions.gemini_api.generate(final_analysis_prompt) # Assign to variable

        if final_analysis_result is not None:
            # Save the result to the task state
            safe_callback(update_status_callback(task_id, data_key="final_analysis", data_value=final_analysis_result))
            safe_callback(update_status_callback(task_id, status="final_analysis_ready")) # Signal Phase 3 readiness
            safe_callback(log_callback(task_id, "Final Analysis complete. Ready for Phase 3."))
            # Optional: Save to file if needed for debugging/persistence
            # with open(f"analysis_final_{task_id}.md", "w", encoding="utf-8") as md_file:
            #     md_file.write(final_analysis_result)
        else:
            safe_callback(log_callback(task_id, "LLM returned no response for Final Analysis."))
            safe_callback(update_status_callback(task_id, status="failed", data_key="error", data_value="Final Analysis generation failed"))
            return # Stop execution if final analysis failed

        safe_callback(log_callback(task_id, "Generating personas..."))
        safe_callback(update_status_callback(task_id, status="generating_personas"))
        number = 4
        # Assuming generate_personas_json creates 'personas.json' which we need to read
        generated_persona_data = actions.generate_personas_json.generate_personas(
            product_description, final_analysis_result, number
        )

        if not generated_persona_data:
             safe_callback(log_callback(task_id, "Persona generation failed or returned empty list."))
             safe_callback(update_status_callback(task_id, status="failed", data_key="error", data_value="Persona generation failed"))
             return # Stop if persona generation fails

        safe_callback(log_callback(task_id, f"Generated {len(generated_persona_data)} personas structure in memory."))

        # Call the modified function to create prompts and extract card details
        detailed_persona_info = actions.create_personas.generate_persona_prompts_and_details(
            persona_data_list=generated_persona_data,
            product_description=product_description
        )

        if not detailed_persona_info:
             safe_callback(log_callback(task_id, "Persona prompt/details generation failed."))
             safe_callback(update_status_callback(task_id, status="failed", data_key="error", data_value="Persona prompt/details generation failed"))
             return # Stop if this step fails

        # Store the detailed info (name, prompt, card_details)
        # This structure is now richer than just names/prompts
        safe_callback(update_status_callback(task_id, data_key="persona_details", data_value=detailed_persona_info))
        safe_callback(update_status_callback(task_id, status="personas_ready")) # Signal Phase 4 readiness
        persona_names_for_log = [p.get('name', 'Unknown') for p in detailed_persona_info]
        safe_callback(log_callback(task_id, f"Personas ready with details: {persona_names_for_log}"))

        # --- End of Background Task ---
        safe_callback(log_callback(task_id, "Analysis pipeline completed. Waiting for persona selection."))
        safe_callback(update_status_callback(task_id, status="completed")) # Or 'personas_ready' if 'completed' implies chat done


    except Exception as e:
        # ... (Existing error handling remains the same) ...
        error_message = f"CRITICAL ERROR in run_analysis_job task {task_id}: {str(e)}\n{traceback.format_exc()}"
        print(error_message)
        safe_callback(log_callback(task_id, f"A critical error occurred in the background task: {str(e)}"))
        safe_callback(update_status_callback(task_id, status="failed", data_key="error", data_value=error_message))
# Note: The chat_with_persona part is removed from this worker function.
# It needs to be triggered by the '/select_persona' endpoint after the user makes a choice.
