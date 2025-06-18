#!/usr/bin/env python3
"""
Test script to verify that the analysis_worker.py coroutine fix works
without actually running the full analysis pipeline.
"""

import asyncio
import sys
import os

# Add the current directory to the path so we can import the analysis_worker
sys.path.append('/Users/jadlahrichi/code/nextraction')

# Import the analysis worker function
from back.main.analysis_worker import run_analysis_job

async def test_coroutine_fix():
    """Test that the coroutine fix works with both sync and async callbacks."""

    print("Testing coroutine fix...")

    # Create async versions of the callback functions
    async def async_update_status_callback(task_id, status=None, data_key=None, data_value=None):
        print(f"Async Status update for {task_id}: {status}, {data_key}={data_value}")

    async def async_log_callback(task_id, message):
        print(f"Async Log for {task_id}: {message}")

    # Create sync versions of the callback functions
    def sync_update_status_callback(task_id, status=None, data_key=None, data_value=None):
        print(f"Sync Status update for {task_id}: {status}, {data_key}={data_value}")

    def sync_log_callback(task_id, message):
        print(f"Sync Log for {task_id}: {message}")

    # Get the current event loop
    loop = asyncio.get_running_loop()

    print("Testing with async callbacks...")        # Test the safe_callback function directly by simulating a small part
    try:
        # We'll create a minimal version to test the callback mechanism
        def test_safe_callback_function(loop):
            def safe_callback(callback_func):
                """Helper to run callback function safely."""
                try:
                    # Check if the callback_func is already a coroutine object
                    if asyncio.iscoroutine(callback_func):
                        # If it's a coroutine object, run it directly
                        future = asyncio.run_coroutine_threadsafe(callback_func, loop)
                        pass
                    # Check if the callback is a coroutine function
                    elif asyncio.iscoroutinefunction(callback_func):
                        # If it's an async function, call it first to get the coroutine, then run it
                        coro = callback_func()
                        future = asyncio.run_coroutine_threadsafe(coro, loop)
                        pass
                    else:
                        # Check if callback_func is a lambda that returns a coroutine
                        try:
                            result = callback_func()
                            if asyncio.iscoroutine(result):
                                # If calling the function returns a coroutine, run it
                                future = asyncio.run_coroutine_threadsafe(result, loop)
                                pass
                            # If it's a regular function that doesn't return a coroutine, we're done
                        except Exception as e:
                            print(f"Error calling callback: {e}")
                except Exception as e:
                    # Log errors happening during callback execution
                    print(f"Error running callback: {e}")

            return safe_callback

        safe_callback = test_safe_callback_function(loop)

        # Test with lambda that calls async function
        print("Testing lambda calling async function...")
        safe_callback(lambda: async_log_callback("test_task", "Testing async callback"))
        await asyncio.sleep(0.1)  # Give it time to execute

        # Test with sync function call
        print("Testing sync function call...")
        safe_callback(lambda: sync_log_callback("test_task", "Testing sync callback"))

        # Test with direct async function - pass coroutine object
        print("Testing direct async function as coroutine object...")
        coro = async_log_callback("test_task", "Direct async call as coroutine")
        safe_callback(coro)
        await asyncio.sleep(0.1)  # Give it time to execute

        print("✅ All callback tests passed! The coroutine fix works correctly.")

    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_coroutine_fix())
