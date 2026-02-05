from typing import Optional
from sqlmodel import Session, select
from uuid import UUID
from ..models.conversation import Conversation, ConversationCreate
from datetime import datetime
import uuid


class ConversationService:
    """
    Service class for managing conversation lifecycle.
    """

    def create_conversation(self, session: Session, user_id: str, title: Optional[str] = None) -> Conversation:
        """
        Create a new conversation for the given user.
        """
        conversation = Conversation(
            user_id=user_id,
            title=title
        )

        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        return conversation

    def get_conversation_by_id(self, session: Session, conversation_id: UUID) -> Optional[Conversation]:
        """
        Retrieve a conversation by its ID.
        """
        statement = select(Conversation).where(Conversation.id == conversation_id)
        return session.exec(statement).first()

    def get_conversation_for_user(self, session: Session, conversation_id: UUID, user_id: str) -> Optional[Conversation]:
        """
        Retrieve a conversation by its ID for a specific user (ensures user isolation).
        """
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        return session.exec(statement).first()

    def update_conversation_timestamp(self, session: Session, conversation: Conversation) -> Conversation:
        """
        Update the updated_at timestamp of a conversation.
        """
        conversation.updated_at = datetime.utcnow()
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        return conversation