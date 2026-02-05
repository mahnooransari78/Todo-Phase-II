from sqlmodel import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from ..models.task import Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority


class TaskService:
    """
    Service class for managing tasks with user isolation and proper error handling.
    This version is designed to be compatible with MCP tools for the AI agent.
    """

    def __init__(self, session: Session):
        self.session = session

    def create_task(self, title: str, description: Optional[str] = None,
                   completed: bool = False, user_id: str = None) -> Task:
        """
        Create a new task for a user.

        Args:
            title: Task title/description
            description: Detailed task description (optional)
            completed: Whether the task is completed (default: False)
            user_id: ID of the user creating the task

        Returns:
            Created Task object
        """
        task_create = TaskCreate(
            title=title,
            description=description
        )

        # Determine the status based on completion
        status_val = TaskStatus.COMPLETED if completed else TaskStatus.TODO

        db_task = Task(
            title=task_create.title,
            description=task_create.description,
            status=status_val,
            priority=TaskPriority.MEDIUM,  # Default priority
            user_id=UUID(user_id) if isinstance(user_id, str) else user_id
        )

        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)

        return db_task

    def get_task_by_id(self, task_id: str, user_id: str) -> Task:
        """
        Get a specific task by ID for a user.

        Args:
            task_id: ID of the task to retrieve
            user_id: ID of the user requesting the task

        Returns:
            Task object

        Raises:
            HTTPException: If task not found or user not authorized
        """
        # Convert string ID to UUID if needed
        try:
            uuid_task_id = UUID(task_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID format"
            )

        task = self.session.get(Task, uuid_task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if str(task.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this task"
            )
        return task

    def get_tasks_by_user(self, user_id: str, status_filter: Optional[str] = None,
                         priority: Optional[str] = None, limit: int = 20,
                         offset: int = 0) -> List[Task]:
        """
        Get tasks for a specific user with optional filters.

        Args:
            user_id: ID of the user whose tasks to retrieve
            status_filter: Optional status filter (TODO, IN_PROGRESS, COMPLETED)
            priority: Optional priority filter (LOW, MEDIUM, HIGH)
            limit: Maximum number of tasks to return
            offset: Offset for pagination

        Returns:
            List of Task objects
        """
        from sqlmodel import select

        query = select(Task).where(Task.user_id == UUID(user_id))

        if status_filter:
            try:
                task_status = TaskStatus(status_filter.lower().replace(' ', '-'))
                query = query.where(Task.status == task_status)
            except ValueError:
                pass  # Ignore invalid status filter
        if priority:
            try:
                task_priority = TaskPriority(priority.lower())
                query = query.where(Task.priority == task_priority)
            except ValueError:
                pass  # Ignore invalid priority filter

        query = query.offset(offset).limit(limit)
        return self.session.exec(query).all()

    def update_task(self, task_id: str, title: Optional[str] = None,
                   description: Optional[str] = None, completed: Optional[bool] = None,
                   user_id: str = None) -> Task:
        """
        Update a specific task for a user.

        Args:
            task_id: ID of the task to update
            title: New title (optional)
            description: New description (optional)
            completed: New completion status (optional)
            user_id: ID of the user updating the task

        Returns:
            Updated Task object
        """
        # Convert string ID to UUID if needed
        try:
            uuid_task_id = UUID(task_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID format"
            )

        db_task = self.session.get(Task, uuid_task_id)

        if not db_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        if str(db_task.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this task"
            )

        # Update task fields if provided
        if title is not None:
            db_task.title = title
        if description is not None:
            db_task.description = description
        if completed is not None:
            db_task.status = TaskStatus.COMPLETED if completed else TaskStatus.TODO

        db_task.updated_at = datetime.utcnow()
        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)

        return db_task

    def delete_task(self, task_id: str, user_id: str) -> bool:
        """
        Delete a specific task for a user.

        Args:
            task_id: ID of the task to delete
            user_id: ID of the user deleting the task

        Returns:
            True if deletion was successful

        Raises:
            HTTPException: If task not found or user not authorized
        """
        # Convert string ID to UUID if needed
        try:
            uuid_task_id = UUID(task_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID format"
            )

        task = self.session.get(Task, uuid_task_id)

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        if str(task.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this task"
            )

        self.session.delete(task)
        self.session.commit()
        return True

    def find_task_by_title(self, title: str, user_id: str) -> Optional[Task]:
        """
        Find a task by its title for a specific user.

        Args:
            title: Title of the task to find
            user_id: ID of the user who owns the task

        Returns:
            Task object if found, None otherwise
        """
        from sqlmodel import select
        from uuid import UUID

        # Convert user_id to UUID, handling potential string input
        try:
            user_uuid = UUID(user_id) if not isinstance(user_id, UUID) else user_id
        except ValueError:
            # If user_id is not a valid UUID, return None
            return None

        # Normalize the search title by removing common Hindi/Urdu/English words that
        # might be in the user's request but not in the actual task title
        import re

        # First, try exact partial matching as before
        from sqlalchemy import func
        query = select(Task).where(
            Task.user_id == user_uuid,
            func.lower(Task.title).like(f'%{title.lower()}%')  # Case-insensitive partial match
        )

        tasks = self.session.exec(query).all()

        # If we found exact matches, return the first one
        if tasks:
            return tasks[0]

        # If no exact matches, try more sophisticated matching
        # Remove common filler words from the search term and try again
        original_search_terms = [title]

        # Add variations by removing common words
        # Remove common Hindi/Urdu/English words that might be in user requests
        common_words = ["the", "a", "an", "task", "please", "to", "and", "or", "but", "is", "are", "was", "were", "will", "would", "could", "should", "have", "has", "had", "do", "does", "did", "wala", "wale", "wali", "ka", "ki", "ko", "ne", "hi", "hai", "hain", "kr", "karna", "karo", "kar", "karne", "liye", "krna", "krdo", "kardo", "delet", "delete", "remove", "complete", "done", "finish", "update", "change", "edit"]

        # Create a cleaned version of the title by removing common words
        cleaned_title = title.lower().strip()
        for word in common_words:
            # Replace whole words only (not parts of other words)
            cleaned_title = re.sub(r'\b' + re.escape(word) + r'\b', '', cleaned_title, flags=re.IGNORECASE)
            # Clean up extra spaces
            cleaned_title = re.sub(r'\s+', ' ', cleaned_title).strip()

        if cleaned_title and cleaned_title != title.lower():
            original_search_terms.append(cleaned_title)

            # Try with the cleaned title
            query = select(Task).where(
                Task.user_id == user_uuid,
                func.lower(Task.title).like(f'%{cleaned_title}%')  # Case-insensitive partial match
            )

            tasks = self.session.exec(query).all()
            if tasks:
                return tasks[0]

        # If still no match, try individual words from the title as separate search terms
        if ' ' in title:
            words = [word.strip() for word in title.split() if len(word.strip()) > 1]
            for word in words:
                if word.lower() not in common_words:
                    query = select(Task).where(
                        Task.user_id == user_uuid,
                        func.lower(Task.title).like(f'%{word.lower()}%')
                    )

                    tasks = self.session.exec(query).all()
                    if tasks:
                        return tasks[0]

        # If multiple tasks match, return the first one
        # In a more sophisticated implementation, you might want to handle this differently
        return tasks[0] if tasks else None