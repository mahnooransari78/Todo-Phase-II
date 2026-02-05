from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import Optional
from sqlmodel import Session
from ..database.session import get_session
from ..services.chat_service import ChatService
from ..utils.security import get_current_user
from pydantic import BaseModel


router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str


@router.post("/{user_id}")
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Main chat endpoint that processes user messages and returns AI responses.
    Validates that the user_id in the path matches the authenticated user.
    """
    # Verify that the user_id in the path matches the authenticated user
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's resources"
        )

    # Create chat service instance
    chat_service = ChatService()

    # Process the chat message
    result = chat_service.process_chat_message(
        session=session,
        user_id=user_id,
        message_content=request.message,
        conversation_id=request.conversation_id
    )

    return result