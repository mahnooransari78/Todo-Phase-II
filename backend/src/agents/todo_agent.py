import asyncio
import os
import json
import logging
import concurrent.futures
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
from openai import OpenAI

# We no longer use MCPClient as tool calls are handled by the chat service
# The agent just returns the tool calls for the chat service to execute

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenRouter Client
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    logger.warning("OPENROUTER_API_KEY environment variable is not set!")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

MODEL = "xiaomi/mimo-v2-flash"          # Updated to paid model slug

# The AI agent now returns tool calls for the chat service to handle directly
# No longer connects to an MCP server

# Tools that the AI can call - these will be handled by the chat service
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Add a new task to the user's todo list.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Task title"},
                    "description": {"type": "string", "description": "Optional description", "nullable": True},
                    "completed": {"type": "boolean", "description": "Initial completion status", "default": False},
                    "user_id": {"type": "string", "description": "User ID"}
                },
                "required": ["title", "user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "Get list of user's tasks with optional filters.",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "status_filter": {"type": "string", "nullable": True},
                    "priority": {"type": "string", "nullable": True},
                    "limit": {"type": "integer", "default": 20},
                    "offset": {"type": "integer", "default": 0}
                },
                "required": ["user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as completed.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string", "description": "Task ID (optional)"},
                    "title": {"type": "string", "description": "Task title (optional, use if task_id not known)"},
                    "user_id": {"type": "string"}
                },
                "required": ["user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string", "description": "Task ID (optional)"},
                    "title": {"type": "string", "description": "Task title (optional, use if task_id not known)"},
                    "user_id": {"type": "string"}
                },
                "required": ["user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update an existing task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string", "description": "Task ID (optional)"},
                    "title": {"type": "string", "description": "Task title (optional, use if task_id not known)"},
                    "user_id": {"type": "string"},
                    "title_new": {"type": "string", "nullable": True, "description": "New title for the task"},
                    "description": {"type": "string", "nullable": True},
                    "completed": {"type": "boolean", "nullable": True}
                },
                "required": ["user_id"]
            }
        }
    },
]

SYSTEM_PROMPT = SYSTEM_PROMPT = """
You are a helpful todo list assistant. Always respond in friendly Urdu + English mix.

Available tools:
- add_task: only when user wants to CREATE a new task
- list_tasks: show user's tasks
- complete_task: mark task as done
- delete_task: remove a task
- update_task: change task details

VERY IMPORTANT RULES FOR TITLE EXTRACTION:

When user wants to delete, complete or update a task, you MUST extract ONLY the real task name/title.

Examples of CORRECT extraction:
User: "delete the task gym"                  → title = "gym"
User: "gym wala task delete kar do"          → title = "gym"
User: "delete task title name is practical"  → title = "practical"
User: "class wala task hatao please"         → title = "class"
User: "delete the task named study math"     → title = "study math"
User: "task delete karo jo title hai gym"    → title = "gym"

WRONG extractions (never do this):
× title = "the"
× title = "task"
× title = "wala"
× title = "name is gym"
× title = "delete the task gym"

NEVER include words like: the, a, ek, wala, wali, ka, ki, ko, hai, hain, kar, karo, karna, kar do, please, named, title, name

If the title is unclear, ask the user instead of guessing.

For delete_task / complete_task / update_task:
• Prefer to use "title" argument over "task_id" when you don't have ID
• Extract the shortest meaningful phrase that is most likely the task title

Always include user_id in tool calls.
"""

async def run_todo_agent(
    user_message: str,
    user_id: str,
    conversation_history: Optional[List[Dict]] = None
) -> Dict[str, Any]:
    """
    Process user message using LLM + MCP tools.
    Returns: {'response': str, 'tool_results': list or dict}
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Optional: conversation history add karo (DB se laa sakte ho)
    if conversation_history:
        # Ensure all messages have valid roles for the AI model
        for msg in conversation_history:
            # The message from chat service should have 'role' and 'content' fields
            # Validate and normalize the role to ensure it's supported
            role = msg.get("role", "user") if isinstance(msg, dict) else getattr(msg, 'role', 'user')

            # Validate role is one of the allowed values
            if role not in ["user", "assistant", "system"]:
                role = "user"  # Default to user if invalid role

            content = msg.get("content", "") if isinstance(msg, dict) else getattr(msg, 'content', '')

            messages.append({
                "role": role,
                "content": content
            })

    # User message + current context
    messages.append({"role": "user", "content": user_message})

    # Check if API key is available before making the call
    if not os.getenv("OPENROUTER_API_KEY"):
        # Use fallback logic immediately if no API key
        raise Exception("OPENROUTER_API_KEY not set")

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            temperature=0.7,
            max_tokens=600,
        )

        choice = response.choices[0]
        message = choice.message

        # Agar koi tool call nahi to direct response
        if not hasattr(message, "tool_calls") or not message.tool_calls:
            return {
                "response": message.content or "Kuch samajh nahi aaya, thoda detail batao 😊",
                "tool_results": None
            }

        # Store original tool calls for returning to the caller
        original_tool_calls = []
        if hasattr(message, "tool_calls") and message.tool_calls:
            for tool_call in message.tool_calls:
                # Parse the original arguments
                args = json.loads(tool_call.function.arguments)

                # Apply the same validation and fallback logic as before
                func_name = tool_call.function.name
                if func_name == "add_task":
                    if "title" not in args or not args["title"].strip():
                        # Try to extract title from the original user message
                        import re
                        potential_title = user_message.strip()
                        for phrase in ["add ", "karo", "kar do", "kar", "please", "krdo", "kr"]:
                            potential_title = potential_title.replace(phrase, "").strip()

                        if potential_title:
                            args["title"] = potential_title[:100]  # Limit length
                elif func_name in ["complete_task", "delete_task", "update_task"]:
                    # If no task_id is provided, try to extract the task title from the user message to help the chat service
                    if "task_id" not in args or not args["task_id"]:
                        import re

                        # Look for a task title in the user message
                        # Common patterns: "complete task 'buy milk'", "delete 'grocery shopping'"
                        title_patterns = [
                            r"[Cc]omplete [Tt]ask ['\"]([^'\"]+)['\"]",
                            r"[Dd]elete [Tt]ask ['\"]([^'\"]+)['\"]",
                            r"[Uu]pdate [Tt]ask ['\"]([^'\"]+)['\"]",
                            r"[Cc]omplete ['\"]([^'\"]+)['\"]",
                            r"[Dd]elete ['\"]([^'\"]+)['\"]",
                            r"[Uu]pdate ['\"]([^'\"]+)['\"]",
                            r"[Cc]omplete (.+?)(?:\s|$)",
                            r"[Dd]elete (.+?)(?:\s|$)",
                            r"[Uu]pdate (.+?)(?:\s|$)",
                        ]

                        task_title = None
                        for pattern in title_patterns:
                            match = re.search(pattern, user_message)
                            if match:
                                task_title = match.group(1).strip()
                                break

                        if not task_title:
                            # Extract the main content from user message as potential task title
                            task_title = user_message.replace("complete", "").replace("delete", "").replace("update", "").replace("task", "").strip()

                        # Clean up the extracted title to remove common filler words
                        if task_title:
                            original_cleaned = task_title.lower().strip()

                            # Remove common Hindi/Urdu filler words that might interfere with matching
                            fillers = ["wala", "wale", "wali", "ka", "ki", "ko", "ne", "hi", "hai", "hain", "kr", "karna", "karo", "kar", "karne", "liye", "krna", "krdo", "kardo"]

                            # First, remove fillers that are separate words (surrounded by spaces or at start/end)
                            cleaned_title = original_cleaned
                            for filler in fillers:
                                # Replace " filler " with " "
                                cleaned_title = cleaned_title.replace(" " + filler + " ", " ")
                                # Remove filler at the beginning followed by space
                                if cleaned_title.startswith(filler + " "):
                                    cleaned_title = cleaned_title[len(filler + " "):]
                                # Remove filler at the end preceded by space
                                if cleaned_title.endswith(" " + filler):
                                    cleaned_title = cleaned_title[:-len(" " + filler)]
                                # Replace multiple spaces with single space
                                while "  " in cleaned_title:
                                    cleaned_title = cleaned_title.replace("  ", " ")

                            # Clean up extra spaces and strip
                            cleaned_title = cleaned_title.strip()

                            # Use the cleaned title if it's more meaningful than the original
                            if len(cleaned_title.strip()) >= 2:  # At least 2 characters for meaningful match
                                task_title = cleaned_title.strip()

                            # Add the extracted title to args to help the chat service find the task
                            args["title"] = task_title

                # Add user_id to args for consistency
                args["user_id"] = user_id

                original_tool_calls.append({
                    "name": func_name,
                    "arguments": args,
                    "id": tool_call.id if hasattr(tool_call, 'id') else None
                })

        # Prepare tool calls for the chat service to handle
        # The actual execution will be done by the chat service using the task service
        tool_results = []

        # Process any tool calls from the AI model response
        if hasattr(message, "tool_calls") and message.tool_calls:
            for tool_call in message.tool_calls:
                func_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                try:
                    # Validate required arguments for different tool types
                    if func_name == "add_task":
                        if "title" not in args or not args["title"].strip():
                            # Try to extract title from the original user message
                            # This handles cases where AI doesn't properly extract the title
                            import re
                            # Extract the main content from the user message as a potential title
                            # This is a fallback to help when AI doesn't extract the title properly
                            potential_title = user_message.strip()
                            # Remove common phrases like "add", "karo", "kar", etc. to get cleaner title
                            for phrase in ["add ", "karo", "kar do", "kar", "please", "krdo", "kr"]:
                                potential_title = potential_title.replace(phrase, "").strip()

                            if potential_title:
                                args["title"] = potential_title[:100]  # Limit length
                            else:
                                raise ValueError(f"Cannot add task without a title. User said: '{user_message}'")

                    # For task operations that require ID but user refers by title
                    elif func_name in ["complete_task", "delete_task", "update_task"]:
                        # If no task_id is provided, try to extract the task title from the user message to help the chat service
                        if "task_id" not in args or not args["task_id"]:
                            import re

                            # Look for a task title in the user message
                            # Common patterns: "complete task 'buy milk'", "delete 'grocery shopping'"
                            title_patterns = [
                                r"[Cc]omplete [Tt]ask ['\"]([^'\"]+)['\"]",
                                r"[Dd]elete [Tt]ask ['\"]([^'\"]+)['\"]",
                                r"[Uu]pdate [Tt]ask ['\"]([^'\"]+)['\"]",
                                r"[Cc]omplete ['\"]([^'\"]+)['\"]",
                                r"[Dd]elete ['\"]([^'\"]+)['\"]",
                                r"[Uu]pdate ['\"]([^'\"]+)['\"]",
                                r"[Cc]omplete (.+?)(?:\s|$)",
                                r"[Dd]elete (.+?)(?:\s|$)",
                                r"[Uu]pdate (.+?)(?:\s|$)",
                            ]

                            task_title = None
                            for pattern in title_patterns:
                                match = re.search(pattern, user_message)
                                if match:
                                    task_title = match.group(1).strip()
                                    break

                            if not task_title:
                                # Extract the main content from user message as potential task title
                                task_title = user_message.replace("complete", "").replace("delete", "").replace("update", "").replace("task", "").strip()

                            if task_title:
                                # Add the extracted title to args to help the chat service find the task
                                args["title"] = task_title
                                logger.info(f"Extracted task title '{task_title}' for {func_name} from user message: {user_message}")
                            else:
                                logger.info(f"No task title found for {func_name} in user message: {user_message}")

                        # For update_task, handle the case where user wants to update the title
                        if func_name == "update_task":
                            # Check if the user wants to update the title
                            # Look for patterns like "update task 'old title' to 'new title'"
                            update_title_patterns = [
                                r"[Uu]pdate [Tt]ask ['\"][^'\"]+['\"] to ['\"](.+?)['\"]",
                                r"[Cc]hange [Tt]itle to ['\"](.+?)['\"]",
                                r"[Nn]ew [Tt]itle ['\"](.+?)['\"]",
                            ]

                            new_title = None
                            for pattern in update_title_patterns:
                                match = re.search(pattern, user_message)
                                if match:
                                    new_title = match.group(1).strip()
                                    break

                            if new_title:
                                # Use title_new to avoid conflict with the old title
                                args["title_new"] = new_title

                    # Security: user_id har call mein force kar do
                    args["user_id"] = user_id

                    # Add to results - the actual execution will be handled by chat service
                    tool_results.append({
                        "tool": func_name,
                        "success": True,
                        "message": f"{func_name} prepared for execution by chat service",
                        "data": args
                    })

                except ValueError as e:
                    logger.error(f"Validation error for {func_name}: {e}")
                    tool_results.append({
                        "tool": func_name,
                        "success": False,
                        "message": f"Validation error: {str(e)}",
                        "data": args
                    })
                except Exception as e:
                    logger.error(f"Error preparing {func_name}: {e}")
                    tool_results.append({
                        "tool": func_name,
                        "success": False,
                        "message": f"Error: {str(e)}",
                        "data": args
                    })

        # Final response banao
        if tool_results:
            # Build response based on tool results
            successful_results = []
            error_results = []

            for result in tool_results:
                if result["success"]:
                    # Include actual data in the response when possible
                    if result["tool"] == "list_tasks" and "data" in result and "tasks" in result["data"]:
                        # Format the task list nicely for the user
                        tasks = result["data"]["tasks"]
                        if tasks:
                            task_list = "\n".join([f"- {task['title']}" + (f" (Completed)" if task["completed"] else "") for task in tasks])
                            successful_results.append(f"Yeh aapke current tasks hain:\n{task_list}")
                        else:
                            successful_results.append("Aapke paas abhi koi tasks nahi hain.")
                    elif result["tool"] in ["add_task", "complete_task", "delete_task", "update_task"]:
                        # For task modification operations, use the message
                        successful_results.append(result["message"])
                    else:
                        # For other successful operations, use the message
                        successful_results.append(result["message"])
                else:
                    error_results.append(result["message"])

            # Combine all successful results
            if successful_results:
                final_reply = "\n\n".join(successful_results)
                if error_results:
                    final_reply += f"\n\nErrors: {'; '.join(error_results)}"
            elif error_results:
                final_reply = "Kuch error aa gaya: " + "; ".join(error_results)
            else:
                final_reply = "Operation completed but no specific results to show."

            final_reply += "\n\nKoi aur task?"
        else:
            final_reply = "Done! Kuch aur batao 😄"

        return {
            "response": final_reply,
            "tool_results": tool_results,
            "original_tool_calls": original_tool_calls  # Return original tool calls
        }

    except Exception as e:
        logger.error(f"Agent error: {e}")

        # For certain types of requests, especially task operations, try to parse manually
        import re

        # Check what type of operation the user wants to perform
        lower_msg = user_message.lower().strip()

        # Handle delete task request first (before add task to prevent misinterpretation)
        if any(keyword in lower_msg for keyword in ["delete", "remove", "hatado", "hatao", "nikalo", "del"]):
            # Try to extract task title from the user message
            # Look for patterns like "delete task 'buy groceries'" or "delete 'buy groceries'"
            title_patterns = [
                r"[Dd]elete [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Rr]emove [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Dd]elete ['\"]([^'\"]+)['\"]",
                r"[Rr]emove ['\"]([^'\"]+)['\"]",
                r"[Dd]elete (.+?)(?:\s|$)",
                r"[Rr]emove (.+?)(?:\s|$)",
                r"[Hh]atado (.+?)(?:\s|$)",
                r"[Hh]atao (.+?)(?:\s|$)",
                r"[Nn]ikalo (.+?)(?:\s|$)",
            ]

            task_title = None
            for pattern in title_patterns:
                match = re.search(pattern, user_message)
                if match:
                    task_title = match.group(1).strip()
                    break

            if not task_title:
                # Extract the main content from user message as potential task title
                task_title = user_message.replace("delete", "").replace("remove", "").replace("hatado", "").replace("hatao", "").replace("nikalo", "").replace("task", "").strip()

            # Clean up the extracted title to remove common filler words
            if task_title:
                original_cleaned = task_title.lower().strip()

                # Remove common Hindi/Urdu filler words that might interfere with matching
                fillers = ["wala", "wale", "wali", "ka", "ki", "ko", "ne", "hi", "hai", "hain", "kr", "karna", "karo", "kar", "karne", "liye", "krna", "krdo", "kardo"]

                # First, remove fillers that are separate words (surrounded by spaces or at start/end)
                cleaned_title = original_cleaned
                for filler in fillers:
                    # Replace " filler " with " "
                    cleaned_title = cleaned_title.replace(" " + filler + " ", " ")
                    # Remove filler at the beginning followed by space
                    if cleaned_title.startswith(filler + " "):
                        cleaned_title = cleaned_title[len(filler + " "):]
                    # Remove filler at the end preceded by space
                    if cleaned_title.endswith(" " + filler):
                        cleaned_title = cleaned_title[:-len(" " + filler)]
                    # Replace multiple spaces with single space
                    while "  " in cleaned_title:
                        cleaned_title = cleaned_title.replace("  ", " ")

                # Clean up extra spaces and strip
                cleaned_title = cleaned_title.strip()

                # Use the cleaned title if it's more meaningful than the original
                if len(cleaned_title.strip()) >= 2:  # At least 2 characters for meaningful match
                    task_title = cleaned_title.strip()

            # Return a response indicating the task would be deleted
            if task_title:
                return {
                    "response": f"Main samajh gaya ki aap '{task_title}' task delete karna chahte hain. Due to system timeout, task will be deleted separately.",
                    "tool_results": [{"tool": "delete_task", "success": True, "message": f"Task '{task_title}' ready to be deleted", "data": {"title": task_title, "user_id": user_id}}],
                    "original_tool_calls": [{
                        "name": "delete_task",
                        "arguments": {"title": task_title, "user_id": user_id},
                        "id": None
                    }]
                }

        # Handle complete task request
        elif any(keyword in lower_msg for keyword in ["complete", "done", "finish", "poora", "khatam", "completed"]):
            # Try to extract task title from the user message
            title_patterns = [
                r"[Cc]omplete [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Dd]one [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Ff]inish [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Cc]omplete ['\"]([^'\"]+)['\"]",
                r"[Dd]one ['\"]([^'\"]+)['\"]",
                r"[Ff]inish ['\"]([^'\"]+)['\"]",
                r"[Cc]omplete (.+?)(?:\s|$)",
                r"[Dd]one (.+?)(?:\s|$)",
                r"[Ff]inish (.+?)(?:\s|$)",
                r"[Pp]oora (.+?)(?:\s|$)",
                r"[Kk]hatam (.+?)(?:\s|$)",
            ]

            task_title = None
            for pattern in title_patterns:
                match = re.search(pattern, user_message)
                if match:
                    task_title = match.group(1).strip()
                    break

            if not task_title:
                # Extract the main content from user message as potential task title
                task_title = user_message.replace("complete", "").replace("done", "").replace("finish", "").replace("poora", "").replace("khatam", "").replace("task", "").strip()

            # Clean up the extracted title to remove common filler words
            if task_title:
                original_cleaned = task_title.lower().strip()

                # Remove common Hindi/Urdu filler words that might interfere with matching
                fillers = ["wala", "wale", "wali", "ka", "ki", "ko", "ne", "hi", "hai", "hain", "kr", "karna", "karo", "kar", "karne", "liye", "krna", "krdo", "kardo"]

                # First, remove fillers that are separate words (surrounded by spaces or at start/end)
                cleaned_title = original_cleaned
                for filler in fillers:
                    # Replace " filler " with " "
                    cleaned_title = cleaned_title.replace(" " + filler + " ", " ")
                    # Remove filler at the beginning followed by space
                    if cleaned_title.startswith(filler + " "):
                        cleaned_title = cleaned_title[len(filler + " "):]
                    # Remove filler at the end preceded by space
                    if cleaned_title.endswith(" " + filler):
                        cleaned_title = cleaned_title[:-len(" " + filler)]
                    # Replace multiple spaces with single space
                    while "  " in cleaned_title:
                        cleaned_title = cleaned_title.replace("  ", " ")

                # Clean up extra spaces and strip
                cleaned_title = cleaned_title.strip()

                # Use the cleaned title if it's more meaningful than the original
                if len(cleaned_title.strip()) >= 2:  # At least 2 characters for meaningful match
                    task_title = cleaned_title.strip()

            # Return a response indicating the task would be completed
            if task_title:
                return {
                    "response": f"Main samajh gaya ki aap '{task_title}' task complete karna chahte hain. Due to system timeout, task will be marked as completed separately.",
                    "tool_results": [{"tool": "complete_task", "success": True, "message": f"Task '{task_title}' ready to be completed", "data": {"title": task_title, "user_id": user_id}}],
                    "original_tool_calls": [{
                        "name": "complete_task",
                        "arguments": {"title": task_title, "user_id": user_id},
                        "id": None
                    }]
                }

        # Handle update task request
        elif any(keyword in lower_msg for keyword in ["update", "change", "modify", "badlo", "edit"]):
            # Try to extract task title from the user message
            title_patterns = [
                r"[Uu]pdate [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Cc]hange [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Mm]odify [Tt]ask ['\"]([^'\"]+)['\"]",
                r"[Uu]pdate ['\"]([^'\"]+)['\"]",
                r"[Cc]hange ['\"]([^'\"]+)['\"]",
                r"[Mm]odify ['\"]([^'\"]+)['\"]",
                r"[Uu]pdate (.+?)(?:\s|$)",
                r"[Cc]hange (.+?)(?:\s|$)",
                r"[Mm]odify (.+?)(?:\s|$)",
                r"[Bb]adlo (.+?)(?:\s|$)",
                r"[Ee]dit (.+?)(?:\s|$)",
            ]

            task_title = None
            for pattern in title_patterns:
                match = re.search(pattern, user_message)
                if match:
                    task_title = match.group(1).strip()
                    break

            if not task_title:
                # Extract the main content from user message as potential task title
                task_title = user_message.replace("update", "").replace("change", "").replace("modify", "").replace("badlo", "").replace("edit", "").replace("task", "").strip()

            # Clean up the extracted title to remove common filler words
            if task_title:
                original_cleaned = task_title.lower().strip()

                # Remove common Hindi/Urdu filler words that might interfere with matching
                fillers = ["wala", "wale", "wali", "ka", "ki", "ko", "ne", "hi", "hai", "hain", "kr", "karna", "karo", "kar", "karne", "liye", "krna", "krdo", "kardo"]

                # First, remove fillers that are separate words (surrounded by spaces or at start/end)
                cleaned_title = original_cleaned
                for filler in fillers:
                    # Replace " filler " with " "
                    cleaned_title = cleaned_title.replace(" " + filler + " ", " ")
                    # Remove filler at the beginning followed by space
                    if cleaned_title.startswith(filler + " "):
                        cleaned_title = cleaned_title[len(filler + " "):]
                    # Remove filler at the end preceded by space
                    if cleaned_title.endswith(" " + filler):
                        cleaned_title = cleaned_title[:-len(" " + filler)]
                    # Replace multiple spaces with single space
                    while "  " in cleaned_title:
                        cleaned_title = cleaned_title.replace("  ", " ")

                # Clean up extra spaces and strip
                cleaned_title = cleaned_title.strip()

                # Use the cleaned title if it's more meaningful than the original
                if len(cleaned_title.strip()) >= 2:  # At least 2 characters for meaningful match
                    task_title = cleaned_title.strip()

            # Return a response indicating the task would be updated
            if task_title:
                return {
                    "response": f"Main samajh gaya ki aap '{task_title}' task update karna chahte hain. Due to system timeout, task will be updated separately.",
                    "tool_results": [{"tool": "update_task", "success": True, "message": f"Task '{task_title}' ready to be updated", "data": {"title": task_title, "user_id": user_id}}],
                    "original_tool_calls": [{
                        "name": "update_task",
                        "arguments": {"title": task_title, "user_id": user_id},
                        "id": None
                    }]
                }

        # Handle add task request (after other operations to prevent misinterpretation)
        elif any(keyword in lower_msg for keyword in ["add", "task", "karo", "kar do", "create"]):
            # Try to extract task information from the user message
            # Look for patterns like "add task title is X and description is Y"
            title_match = re.search(r"title\s+(?:hai|is)\s+([^,\.]+)", user_message, re.IGNORECASE)
            desc_match = re.search(r"description\s+(?:hai|is)\s+([^,\.]+)", user_message, re.IGNORECASE)

            title = ""
            description = ""

            if title_match:
                title = title_match.group(1).strip()
            else:
                # Fallback: extract the main content after "add task"
                parts = re.split(r"(?:title|description)\s+(?:hai|is)", user_message, maxsplit=1, flags=re.IGNORECASE)
                if len(parts) > 1:
                    title = parts[0].replace("add task", "").replace("add", "").strip()
                else:
                    title = user_message.replace("add task", "").replace("add", "").strip()

            if desc_match:
                description = desc_match.group(1).strip()

            # Return a response indicating the task would be added
            if title:
                return {
                    "response": f"Main samajh gaya ki aap '{title}' task add karna chahte hain. Due to system timeout, task will be added separately.",
                    "tool_results": [{"tool": "add_task", "success": True, "message": f"Task '{title}' ready to be added", "data": {"title": title, "description": description}}],
                    "original_tool_calls": [{
                        "name": "add_task",
                        "arguments": {"title": title, "description": description, "user_id": user_id},
                        "id": None
                    }]
                }

        return {
            "response": "Oops! Server side kuch gadbad ho gayi... thodi der baad try karna 😓",
            "tool_results": None,
            "original_tool_calls": []
        }


# Optional: sync version agar ChatService sync hai
def run_todo_agent_sync(*args, **kwargs):
    import asyncio
    import threading

    # Create a new thread to run the async function safely
    def run_in_thread():
        return asyncio.run(run_todo_agent(*args, **kwargs))

    # Run the async function in a separate thread
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(run_in_thread)
        return future.result()


# The function that ChatService expects to import
def get_todo_agent():
    """
    Returns an instance of the TodoAgent that can process messages.
    """
    class TodoAgent:
        def process_message(self, message: str, user_id: str, conversation_history: Optional[List[Dict]] = None) -> Dict[str, Any]:
            """
            Process a user message and return a response with potential tool calls.
            """
            # Convert sync call to async
            result = run_todo_agent_sync(message, user_id, conversation_history)

            # Convert result format to match expected interface
            # Use the original tool calls from the AI model response when available
            # Otherwise fall back to the results-based tool calls
            tool_calls = result.get("original_tool_calls", [])

            # If no original tool calls were preserved, create from results as fallback
            if not tool_calls and result.get("tool_results"):
                for tool_result in result["tool_results"]:
                    tool_calls.append({
                        "name": tool_result["tool"],
                        "arguments": tool_result.get("data", {}),
                        "id": None
                    })

            return {
                "response": result["response"],
                "tool_calls": tool_calls
            }

    return TodoAgent()