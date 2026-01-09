from sqlmodel import Session, select
from fastapi import HTTPException, status
from datetime import datetime
from uuid import UUID
from typing import List, Optional

from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
from ..schemas.task import TaskStatus, TaskPriority


class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_create: TaskCreate, user_id: UUID) -> Task:
        """Create a new task for a user"""
        db_task = Task(
            **task_create.dict(),
            user_id=user_id
        )
        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)
        return db_task

    def get_task_by_id(self, task_id: UUID, user_id: UUID) -> Task:
        """Get a specific task by ID for a user"""
        task = self.session.get(Task, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        if task.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this task"
            )
        return task

    def get_tasks_by_user(
        self,
        user_id: UUID,
        status_filter: Optional[TaskStatus] = None,
        priority: Optional[TaskPriority] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Task]:
        """Get tasks for a specific user with optional filters"""
        query = select(Task).where(Task.user_id == user_id)

        if status_filter:
            query = query.where(Task.status == status_filter)
        if priority:
            query = query.where(Task.priority == priority)

        query = query.offset(offset).limit(limit)
        return self.session.exec(query).all()

    def update_task(self, task_id: UUID, task_update: TaskUpdate, user_id: UUID) -> Task:
        """Update a specific task for a user"""
        db_task = self.session.get(Task, task_id)

        if not db_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        if db_task.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this task"
            )

        # Update task fields
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)

        db_task.updated_at = datetime.utcnow()
        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)

        return db_task

    def delete_task(self, task_id: UUID, user_id: UUID) -> bool:
        """Delete a specific task for a user"""
        task = self.session.get(Task, task_id)

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        if task.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this task"
            )

        self.session.delete(task)
        self.session.commit()
        return True

    def get_total_tasks_count(
        self,
        user_id: UUID,
        status_filter: Optional[TaskStatus] = None,
        priority: Optional[TaskPriority] = None
    ) -> int:
        """Get total count of tasks for a user with optional filters"""
        query = select(Task).where(Task.user_id == user_id)

        if status_filter:
            query = query.where(Task.status == status_filter)
        if priority:
            query = query.where(Task.priority == priority)

        return len(self.session.exec(query).all())