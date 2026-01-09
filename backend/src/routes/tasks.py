from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from typing import Annotated, Optional
from datetime import datetime
from uuid import UUID
import jwt

from ..database.session import get_session
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
from ..schemas.task import TaskRead, TaskListResponse, TaskDeleteResponse
from ..utils.auth import decode_access_token

router = APIRouter()
security = HTTPBearer()



def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: Session = Depends(get_session)
) -> User:
    """Get current user from JWT token"""
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

    user = session.get(User, UUID(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user


@router.get("/", response_model=TaskListResponse)
def get_tasks(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session),
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get current user's tasks with optional filtering"""
    query = select(Task).where(Task.user_id == current_user.id)

    if status_filter:
        query = query.where(Task.status == status_filter)
    if priority:
        query = query.where(Task.priority == priority)

    # Count total for pagination
    total_query = select(Task).where(Task.user_id == current_user.id)
    if status_filter:
        total_query = total_query.where(Task.status == status_filter)
    if priority:
        total_query = total_query.where(Task.priority == priority)
    total = len(session.exec(total_query).all())

    # Apply pagination
    query = query.offset(offset).limit(limit)
    tasks = session.exec(query).all()

    task_reads = [TaskRead.from_orm(task) for task in tasks]

    return TaskListResponse(
        tasks=task_reads,
        total=total,
        limit=limit,
        offset=offset
    )


@router.post("/", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """Create a new task for the current user"""
    db_task = Task(
        **task.dict(),
        user_id=current_user.id
    )
    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return TaskRead.from_orm(db_task)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """Get a specific task belonging to the current user"""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return TaskRead.from_orm(task)


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """Update an existing task belonging to the current user"""
    db_task = session.get(Task, task_id)

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if db_task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    # Update task fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return TaskRead.from_orm(db_task)


@router.delete("/{task_id}", response_model=TaskDeleteResponse)
def delete_task(
    task_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """Delete a specific task belonging to the current user"""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    session.delete(task)
    session.commit()

    return TaskDeleteResponse(
        success=True,
        message="Task deleted successfully"
    )