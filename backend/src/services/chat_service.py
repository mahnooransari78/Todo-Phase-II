import json
import logging
from typing import Dict, Any, List, Optional
from sqlmodel import Session
from uuid import UUID
from datetime import datetime

logger = logging.getLogger(__name__)
from ..models.conversation import Conversation
from ..models.message import Message
from ..services.conversation_service import ConversationService
from ..services.message_service import MessageService
from ..services.task_service import TaskService
from ..agents.todo_agent import get_todo_agent


class ChatService:
    """
    Service class for handling chat interactions and coordinating between
    the AI agent, conversation management, and task operations.
    """

    def __init__(self):
        self.conversation_service = ConversationService()
        self.message_service = MessageService()
        self.task_service_class = TaskService  # Store the TaskService class
        self.agent = get_todo_agent()

    def process_chat_message(self, session: Session, user_id: str, message_content: str,
                           conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a chat message from a user and return a response.

        Args:
            session: Database session
            user_id: ID of the user sending the message
            message_content: The message content
            conversation_id: Optional existing conversation ID

        Returns:
            Dictionary containing the response and any tool calls
        """
        # Get or create conversation
        if conversation_id:
            # Validate that the conversation belongs to the user
            conv_uuid = UUID(conversation_id)
            conversation = self.conversation_service.get_conversation_for_user(session, conv_uuid, user_id)

            if not conversation:
                raise ValueError("Conversation not found or does not belong to user")
        else:
            # Create new conversation
            conversation = self.conversation_service.create_conversation(
                session, user_id, title=message_content[:50] if len(message_content) > 50 else message_content
            )

        # Save the user's message
        user_message = self.message_service.create_message(
            session,
            conversation.id,
            "user",
            message_content
        )

        # Get conversation history for context
        conversation_history = self.message_service.get_messages_for_conversation(session, conversation.id)

        # Process the message with the AI agent
        # Note: The agent may be asynchronous, so we need to handle it properly
        agent_response = self.agent.process_message(
            message_content,
            user_id,
            [{"role": msg.sender, "content": msg.content} for msg in conversation_history]
        )

        # Execute any tool calls directly using the task service
        # This ensures tasks are properly saved to the main database
        # Also modify the response if list_tasks was called to include actual task data
        list_tasks_called = False
        if agent_response.get("tool_calls"):
            # Create a task service instance for this session
            task_service = self.task_service_class(session)

            for tool_call in agent_response["tool_calls"]:
                tool_name = tool_call["name"]
                arguments = tool_call.get("arguments", {})

                # Add user_id to arguments if not present
                if "user_id" not in arguments:
                    arguments["user_id"] = user_id

                try:
                    if tool_name == "add_task":
                        # Execute add_task directly
                        task_service.create_task(
                            title=arguments.get("title", ""),
                            description=arguments.get("description"),
                            completed=arguments.get("completed", False),
                            user_id=user_id
                        )

                    elif tool_name == "list_tasks":
                        # Execute list_tasks to get actual tasks and update the response
                        list_tasks_called = True
                        status_filter = arguments.get("status_filter")
                        priority = arguments.get("priority")
                        limit = arguments.get("limit", 20)
                        offset = arguments.get("offset", 0)

                        tasks = task_service.get_tasks_by_user(
                            user_id=user_id,
                            status_filter=status_filter,
                            priority=priority,
                            limit=limit,
                            offset=offset
                        )

                        # Format tasks for display in the response
                        if tasks:
                            task_list_text = "\n".join([
                                f"- {task.title}" + (f" (Completed)" if task.status.value == "completed" else "")
                                for task in tasks
                            ])
                            # Modify the agent response to include actual task list
                            agent_response["response"] = f"Yeh aapke current tasks hain:\n{task_list_text}\n\nKoi aur task?"
                        else:
                            agent_response["response"] = "Aapke paas abhi koi tasks nahi hain.\n\nKoi task add karna chahte hain?"

                    elif tool_name == "complete_task":
                        # Execute complete_task directly
                        task_id = arguments.get("task_id", "")

                        logger.info(f"Processing complete_task call for user {user_id}, arguments: {arguments}")
                        logger.info(f"Original message: {message_content}")

                        # If no task_id provided but there's a title, try to find the task by title
                        if not task_id and arguments.get("title"):
                            logger.info(f"Attempting to find task by title: '{arguments['title']}'")
                            found_task = task_service.find_task_by_title(arguments["title"], user_id)
                            if found_task:
                                task_id = str(found_task.id)
                                logger.info(f"Found task by title '{arguments['title']}': {task_id}")
                            else:
                                logger.info(f"No task found by title '{arguments['title']}'")

                        # If we still don't have a task_id, try to extract it from the original message
                        if not task_id:
                            # Look for potential task titles in the original message
                            import re

                            # Extract potential task name from user message with more sophisticated cleaning
                            potential_titles = [
                                message_content.replace("complete", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                message_content.replace("complete task", "").strip().strip('"').strip("'"),
                                message_content.replace("complete the task", "").strip().strip('"').strip("'"),
                                message_content.replace("finish", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                message_content.replace("finish task", "").strip().strip('"').strip("'"),
                                message_content.replace("finish the task", "").strip().strip('"').strip("'"),
                                message_content.replace("mark as done", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                # Just the raw message cleaned of common command words
                                re.sub(r'(complete|finish|mark as done|task|please|can you|could you|want to|need to|going to|the)', '', message_content, flags=re.IGNORECASE).strip()
                            ]

                            logger.info(f"Attempting to find task using message-derived titles: {potential_titles}")

                            for title in potential_titles:
                                if title and len(title.strip()) > 1:  # Only try if title is meaningful
                                    logger.info(f"Trying to find task with derived title: '{title}'")
                                    found_task = task_service.find_task_by_title(title, user_id)
                                    if found_task:
                                        task_id = str(found_task.id)
                                        logger.info(f"Found task by derived title '{title}': {task_id}")
                                        break

                                if task_id:
                                    break

                        logger.info(f"Final task_id for completion: {task_id}")

                        if task_id:
                            task_service.update_task(
                                task_id=task_id,
                                completed=True,
                                user_id=user_id
                            )
                            logger.info(f"Successfully completed task {task_id} for user {user_id}")
                        else:
                            logger.warning(f"Could not find task to complete for user {user_id}. Arguments: {arguments}")
                            # Let's also try a broader search as a last resort
                            all_user_tasks = task_service.get_tasks_by_user(user_id=user_id)
                            logger.info(f"User has {len(all_user_tasks)} total tasks, none matched the request")
                            # List all tasks for debugging
                            for task in all_user_tasks:
                                logger.info(f"Available task: ID={task.id}, Title='{task.title}'")

                    elif tool_name == "delete_task":
                        # Execute delete_task directly
                        task_id = arguments.get("task_id", "")

                        logger.info(f"Processing delete_task call for user {user_id}, arguments: {arguments}")
                        logger.info(f"Original message: {message_content}")

                        # If no task_id provided but there's a title, try to find the task by title
                        if not task_id and arguments.get("title"):
                            logger.info(f"Attempting to find task by title: '{arguments['title']}'")
                            found_task = task_service.find_task_by_title(arguments["title"], user_id)
                            if found_task:
                                task_id = str(found_task.id)
                                logger.info(f"Found task by title '{arguments['title']}': {task_id}")
                            else:
                                logger.info(f"No task found by title '{arguments['title']}'")

                        # If we still don't have a task_id, try to extract it from the original message
                        if not task_id:
                            # Look for potential task titles in the original message
                            import re

                            # Extract potential task name from user message with more sophisticated cleaning
                            potential_titles = [
                                message_content.replace("delete", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                message_content.replace("delete task", "").strip().strip('"').strip("'"),
                                message_content.replace("delete the task", "").strip().strip('"').strip("'"),
                                message_content.replace("remove", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                message_content.replace("remove task", "").strip().strip('"').strip("'"),
                                message_content.replace("remove the task", "").strip().strip('"').strip("'"),
                                # Just the raw message cleaned of common command words
                                re.sub(r'(delete|remove|the|task|please|can you|could you|want to|need to|going to)', '', message_content, flags=re.IGNORECASE).strip()
                            ]

                            logger.info(f"Attempting to find task using message-derived titles: {potential_titles}")

                            for title in potential_titles:
                                if title and len(title.strip()) > 1:  # Only try if title is meaningful
                                    logger.info(f"Trying to find task with derived title: '{title}'")
                                    found_task = task_service.find_task_by_title(title, user_id)
                                    if found_task:
                                        task_id = str(found_task.id)
                                        logger.info(f"Found task by derived title '{title}': {task_id}")
                                        break

                                if task_id:
                                    break

                        logger.info(f"Final task_id for deletion: {task_id}")

                        if task_id:
                            task_service.delete_task(
                                task_id=task_id,
                                user_id=user_id
                            )
                            logger.info(f"Successfully deleted task {task_id} for user {user_id}")
                        else:
                            logger.warning(f"Could not find task to delete for user {user_id}. Arguments: {arguments}")
                            # Let's also try a broader search as a last resort
                            all_user_tasks = task_service.get_tasks_by_user(user_id=user_id)
                            logger.info(f"User has {len(all_user_tasks)} total tasks, none matched the request")
                            # List all tasks for debugging
                            for task in all_user_tasks:
                                logger.info(f"Available task: ID={task.id}, Title='{task.title}'")

                    elif tool_name == "update_task":
                        # Execute update_task directly
                        task_id = arguments.get("task_id", "")

                        # If no task_id provided but there's a title, try to find the task by title
                        if not task_id and arguments.get("title"):
                            found_task = task_service.find_task_by_title(arguments["title"], user_id)
                            if found_task:
                                task_id = str(found_task.id)

                        # If we still don't have a task_id, try to extract it from the original message
                        if not task_id:
                            # Look for potential task titles in the original message
                            import re

                            # Extract potential task name from user message with more sophisticated cleaning
                            potential_titles = [
                                message_content.replace("update", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                message_content.replace("update task", "").strip().strip('"').strip("'"),
                                message_content.replace("update the task", "").strip().strip('"').strip("'"),
                                message_content.replace("change", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                message_content.replace("change task", "").strip().strip('"').strip("'"),
                                message_content.replace("change the task", "").strip().strip('"').strip("'"),
                                message_content.replace("modify", "").replace("task", "").replace("please", "").replace("can you", "").replace("could you", "").strip(),
                                # Just the raw message cleaned of common command words
                                re.sub(r'(update|change|modify|task|please|can you|could you|want to|need to|going to|the)', '', message_content, flags=re.IGNORECASE).strip()
                            ]

                            for title in potential_titles:
                                if title and len(title.strip()) > 1:  # Only try if title is meaningful
                                    found_task = task_service.find_task_by_title(title, user_id)
                                    if found_task:
                                        task_id = str(found_task.id)
                                        break

                                if task_id:
                                    break

                        # Use the new title if provided (to avoid overwriting with the old title)
                        title_to_update = arguments.get("title_new") or arguments.get("title")

                        if task_id:
                            task_service.update_task(
                                task_id=task_id,
                                title=title_to_update,
                                description=arguments.get("description"),
                                completed=arguments.get("completed"),
                                user_id=user_id
                            )
                        else:
                            logger.warning(f"Could not find task to update for user {user_id}. Arguments: {arguments}")
                            # List all tasks for debugging
                            all_user_tasks = task_service.get_tasks_by_user(user_id=user_id)
                            logger.info(f"Available tasks for user: {[task.title for task in all_user_tasks]}")

                except Exception as e:
                    # Log the error but continue processing
                    print(f"Error executing tool {tool_name}: {str(e)}")

        # Save the assistant's response
        tool_calls_str = None
        if agent_response.get("tool_calls"):
            try:
                tool_calls_str = json.dumps(agent_response["tool_calls"])
            except (TypeError, ValueError):
                # Fallback to string conversion if JSON serialization fails
                tool_calls_str = str(agent_response["tool_calls"])

        assistant_message = self.message_service.create_message(
            session,
            conversation.id,
            "assistant",
            agent_response["response"],
            tool_calls=tool_calls_str
        )

        # Update conversation timestamp
        self.conversation_service.update_conversation_timestamp(session, conversation)

        # Return the response
        return {
            "conversation_id": str(conversation.id),
            "response": agent_response["response"],
            "tool_calls": agent_response["tool_calls"],
            "timestamp": datetime.utcnow().isoformat()
        }

    def execute_tool_calls(self, session: Session, user_id: str, tool_calls: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Execute the tool calls returned by the AI agent.

        Args:
            session: Database session
            user_id: ID of the user initiating the calls
            tool_calls: List of tool calls to execute

        Returns:
            List of results from executing the tool calls
        """
        task_service = TaskService(session)
        results = []

        for tool_call in tool_calls:
            tool_name = tool_call["name"]
            arguments = tool_call["arguments"]

            try:
                if tool_name == "add_task":
                    result = task_service.create_task(
                        title=arguments["title"],
                        description=arguments.get("description"),
                        completed=arguments.get("completed", False),
                        user_id=user_id
                    )
                    results.append({
                        "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                        "result": {"success": True, "task_id": str(result.id), "message": f"Task '{result.title}' created successfully"}
                    })

                elif tool_name == "list_tasks":
                    status_filter = arguments.get("status_filter")
                    priority = arguments.get("priority")
                    limit = arguments.get("limit", 20)
                    offset = arguments.get("offset", 0)

                    tasks = task_service.get_tasks_by_user(
                        user_id=user_id,
                        status_filter=status_filter,
                        priority=priority,
                        limit=limit,
                        offset=offset
                    )
                    results.append({
                        "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                        "result": {"success": True, "tasks": [{"id": str(t.id), "title": t.title, "completed": t.status.value == "completed"} for t in tasks]}
                    })

                elif tool_name == "complete_task":
                    task_id = arguments.get("task_id", "")

                    # If no task_id provided but there's a title, try to find the task by title
                    if not task_id and arguments.get("title"):
                        found_task = task_service.find_task_by_title(arguments["title"], user_id)
                        if found_task:
                            task_id = str(found_task.id)

                    if task_id:
                        result = task_service.update_task(
                            task_id=task_id,
                            completed=True,
                            user_id=user_id
                        )
                        results.append({
                            "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                            "result": {"success": True, "task_id": task_id, "message": f"Task '{result.title}' marked as completed"}
                        })
                    else:
                        results.append({
                            "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                            "result": {"success": False, "error": "Task not found"}
                        })

                elif tool_name == "delete_task":
                    logger.info(f"Executing delete_task tool call, arguments: {arguments}")

                    task_id = arguments.get("task_id", "")

                    # If no task_id provided but there's a title, try to find the task by title
                    if not task_id and arguments.get("title"):
                        logger.info(f"Attempting to find task by title: '{arguments['title']}'")
                        found_task = task_service.find_task_by_title(arguments["title"], user_id)
                        if found_task:
                            task_id = str(found_task.id)
                            logger.info(f"Found task by title '{arguments['title']}': {task_id}")
                        else:
                            logger.info(f"No task found by title '{arguments['title']}'")

                    # If we still don't have a task_id and we have access to the original message, try to extract it
                    # Note: In this context, we don't have the original message, so we rely on the AI to pass the title correctly
                    # But we can still try additional cleanup if the title exists
                    if not task_id and arguments.get("title"):
                        # Additional cleaning of the title
                        import re
                        title = arguments["title"]

                        # Clean up common command words that might have been left in the title
                        cleaned_title = re.sub(r'(delete|remove|the|task|please|can you|could you|want to|need to|going to)', '', title, flags=re.IGNORECASE).strip()

                        if cleaned_title and cleaned_title != title:
                            logger.info(f"Trying to find task with cleaned title: '{cleaned_title}'")
                            found_task = task_service.find_task_by_title(cleaned_title, user_id)
                            if found_task:
                                task_id = str(found_task.id)
                                logger.info(f"Found task by cleaned title '{cleaned_title}': {task_id}")

                    logger.info(f"Final task_id for deletion: {task_id}")

                    if task_id:
                        success = task_service.delete_task(task_id, user_id)
                        results.append({
                            "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                            "result": {"success": success, "task_id": task_id, "message": "Task deleted successfully" if success else "Failed to delete task"}
                        })
                        if success:
                            logger.info(f"Successfully deleted task {task_id} for user {user_id}")
                        else:
                            logger.warning(f"Failed to delete task {task_id} for user {user_id}")
                    else:
                        logger.warning(f"Could not find task to delete for user {user_id}. Arguments: {arguments}")
                        # Get all user tasks to provide more detailed feedback
                        all_user_tasks = task_service.get_tasks_by_user(user_id=user_id)
                        logger.info(f"User has {len(all_user_tasks)} total tasks: {[task.title for task in all_user_tasks]}")
                        results.append({
                            "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                            "result": {"success": False, "error": f"Task not found. User has {len(all_user_tasks)} tasks: {[task.title for task in all_user_tasks][:5]}"}  # Show first 5 task titles
                        })

                elif tool_name == "update_task":
                    logger.info(f"Executing update_task tool call, arguments: {arguments}")

                    task_id = arguments.get("task_id", "")

                    # If no task_id provided but there's a title, try to find the task by title
                    if not task_id and arguments.get("title"):
                        logger.info(f"Attempting to find task by title: '{arguments['title']}'")
                        found_task = task_service.find_task_by_title(arguments["title"], user_id)
                        if found_task:
                            task_id = str(found_task.id)
                            logger.info(f"Found task by title '{arguments['title']}': {task_id}")
                        else:
                            logger.info(f"No task found by title '{arguments['title']}'")

                    # Use the new title if provided (to avoid overwriting with the old title)
                    title = arguments.get("title_new") or arguments.get("title")
                    description = arguments.get("description")
                    completed = arguments.get("completed")

                    logger.info(f"Final task_id for update: {task_id}")

                    if task_id:
                        result = task_service.update_task(
                            task_id=task_id,
                            title=title,
                            description=description,
                            completed=completed,
                            user_id=user_id
                        )
                        results.append({
                            "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                            "result": {"success": True, "task_id": task_id, "message": "Task updated successfully"}
                        })
                        logger.info(f"Successfully updated task {task_id} for user {user_id}")
                    else:
                        logger.warning(f"Could not find task to update for user {user_id}. Arguments: {arguments}")
                        results.append({
                            "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                            "result": {"success": False, "error": "Task not found"}
                        })

                else:
                    results.append({
                        "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                        "result": {"success": False, "error": f"Unknown tool: {tool_name}"}
                    })

            except Exception as e:
                results.append({
                    "tool_call_id": tool_call.get("id") if "id" in tool_call else None,
                    "result": {"success": False, "error": str(e)}
                })

        return results
    
    