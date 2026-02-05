
from typing import List, Optional
from sqlmodel import Session, select
from uuid import UUID
from datetime import datetime
import json
from ..models.message import Message, MessageCreate
from ..models.conversation import Conversation


class MessageService:
    """
    Service class for managing messages within conversations.
    """

    def create_message(self, session: Session, conversation_id: UUID, sender: str, content: str,
                      tool_calls: Optional[str] = None, tool_responses: Optional[str] = None,
                      error: Optional[str] = None) -> Message:
        """
        Create a new message in a conversation.
        """
        message_data = MessageCreate(
            conversation_id=conversation_id,
            sender=sender,
            content=content,
            tool_calls=tool_calls,
            tool_responses=tool_responses,
            error=error
        )

        message = Message(
            conversation_id=message_data.conversation_id,
            sender=message_data.sender,
            content=message_data.content,
            tool_calls=message_data.tool_calls,
            tool_responses=message_data.tool_responses,
            error=message_data.error
        )

        session.add(message)
        session.commit()
        session.refresh(message)
        return message

    def get_messages_for_conversation(self, session: Session, conversation_id: UUID) -> List[Message]:
        """
        Retrieve all messages for a specific conversation, ordered by timestamp.
        """
        statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.timestamp)
        return session.exec(statement).all()

    def get_message_by_id(self, session: Session, message_id: UUID) -> Optional[Message]:
        """
        Retrieve a message by its ID.
        """
        statement = select(Message).where(Message.id == message_id)
        return session.exec(statement).first()

    def get_recent_messages(self, session: Session, conversation_id: UUID, limit: int = 10) -> List[Message]:
        """
        Retrieve the most recent messages for a conversation.
        """
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp.desc())
            .limit(limit)
        )
        messages = session.exec(statement).all()
        # Reverse the list to return in chronological order
        return list(reversed(messages))