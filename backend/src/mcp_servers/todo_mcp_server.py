from mcp.server import Server
from mcp.types import TextContent, Tool, ToolResult
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
import json
from uuid import UUID
from sqlmodel import Session
from ..database import engine
from ..services.task_service import TaskService


# Create the MCP server instance
server = Server("todo-mcp-server")


class AddTaskParams(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    user_id: str


@server.handler.tool("add_task")
def add_task(params: AddTaskParams):
    """
    Add a new task to the user's todo list.
    """
    # Create a session and TaskService instance to execute the operation
    session = Session(engine)
    try:
        task_service = TaskService(session)
        task = task_service.create_task(
            title=params.title,
            description=params.description,
            completed=params.completed,
            user_id=params.user_id
        )

        result = {
            "success": True,
            "task_id": str(task.id),
            "message": f"Task '{task.title}' added successfully"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    except Exception as e:
        result = {
            "success": False,
            "error": str(e),
            "message": f"Failed to add task: {str(e)}"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    finally:
        session.close()


class ListTasksParams(BaseModel):
    user_id: str
    status_filter: Optional[str] = None
    priority: Optional[str] = None
    limit: int = 20
    offset: int = 0


@server.handler.tool("list_tasks")
def list_tasks(params: ListTasksParams):
    """
    List tasks for the user with optional filters.
    """
    # Create a session and TaskService instance to execute the operation
    session = Session(engine)
    try:
        task_service = TaskService(session)
        tasks = task_service.get_tasks_by_user(
            user_id=params.user_id,
            status_filter=params.status_filter,
            priority=params.priority,
            limit=params.limit,
            offset=params.offset
        )

        task_list = []
        for task in tasks:
            task_list.append({
                "id": str(task.id),
                "title": task.title,
                "description": task.description,
                "status": task.status.value,
                "priority": task.priority.value,
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "completed": task.status.value == "completed"
            })

        result = {
            "success": True,
            "tasks": task_list,
            "total_count": len(task_list)
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    except Exception as e:
        result = {
            "success": False,
            "error": str(e),
            "message": f"Failed to list tasks: {str(e)}"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    finally:
        session.close()


class CompleteTaskParams(BaseModel):
    task_id: str
    user_id: str


@server.handler.tool("complete_task")
def complete_task(params: CompleteTaskParams):
    """
    Mark a task as completed.
    """
    # Create a session and TaskService instance to execute the operation
    session = Session(engine)
    try:
        task_service = TaskService(session)
        task = task_service.update_task(
            task_id=params.task_id,
            completed=True,
            user_id=params.user_id
        )

        result = {
            "success": True,
            "task_id": params.task_id,
            "message": f"Task '{task.title}' marked as completed"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    except Exception as e:
        result = {
            "success": False,
            "error": str(e),
            "message": f"Failed to complete task: {str(e)}"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    finally:
        session.close()


class DeleteTaskParams(BaseModel):
    task_id: str
    user_id: str


@server.handler.tool("delete_task")
def delete_task(params: DeleteTaskParams):
    """
    Delete a task from the user's list.
    """
    # Create a session and TaskService instance to execute the operation
    session = Session(engine)
    try:
        task_service = TaskService(session)
        success = task_service.delete_task(
            task_id=params.task_id,
            user_id=params.user_id
        )

        result = {
            "success": success,
            "task_id": params.task_id,
            "message": f"Task {params.task_id} deleted successfully" if success else "Failed to delete task"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    except Exception as e:
        result = {
            "success": False,
            "error": str(e),
            "message": f"Failed to delete task: {str(e)}"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    finally:
        session.close()


class UpdateTaskParams(BaseModel):
    task_id: str
    user_id: str
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


@server.handler.tool("update_task")
def update_task(params: UpdateTaskParams):
    """
    Update an existing task.
    """
    # Create a session and TaskService instance to execute the operation
    session = Session(engine)
    try:
        task_service = TaskService(session)
        task = task_service.update_task(
            task_id=params.task_id,
            title=params.title,
            description=params.description,
            completed=params.completed,
            user_id=params.user_id
        )

        result = {
            "success": True,
            "task_id": params.task_id,
            "message": f"Task '{task.title}' updated successfully"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    except Exception as e:
        result = {
            "success": False,
            "error": str(e),
            "message": f"Failed to update task: {str(e)}"
        }
        return ToolResult(content=[TextContent(type="text", text=json.dumps(result))])
    finally:
        session.close()


# This would be called to start the server
async def run_server():
    async with server.serve():
        await asyncio.Future()  # Run forever