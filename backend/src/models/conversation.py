from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
import uuid
from typing import TYPE_CHECKING

# To prevent circular import issues
if TYPE_CHECKING:
    from .message import Message


class ConversationBase(SQLModel):
    user_id: str = Field(index=True)  # Reference to the authenticated user
    title: str | None = Field(default=None)  # Auto-generated title based on first message or topic


class Conversation(ConversationBase, table=True):
    """
    Represents a single conversation session between a user and the AI chatbot.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to messages
    messages: list["Message"] = Relationship(back_populates="conversation")


class ConversationCreate(ConversationBase):
    """Schema for creating a new conversation"""
    pass


class ConversationRead(ConversationBase):
    """Schema for reading conversation data"""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime