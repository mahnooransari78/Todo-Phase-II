from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
import uuid
from typing import Optional, TYPE_CHECKING

# To prevent circular import issues
if TYPE_CHECKING:
    from .conversation import Conversation


class MessageBase(SQLModel):
    conversation_id: uuid.UUID = Field(foreign_key="conversation.id", index=True)
    sender: str = Field(regex="^(user|assistant)$")  # Indicates the source of the message
    content: str = Field(min_length=1)  # The actual message content
    tool_calls: Optional[str] = Field(default=None)  # Serialized tool calls made by the AI agent
    tool_responses: Optional[str] = Field(default=None)  # Responses from executed tools
    error: Optional[str] = Field(default=None)  # Error message if the message processing failed


class Message(MessageBase, table=True):
    """
    Represents an individual message within a conversation, either from the user or the assistant.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")


class MessageCreate(MessageBase):
    """Schema for creating a new message"""
    pass


class MessageRead(MessageBase):
    """Schema for reading message data"""
    id: uuid.UUID
    timestamp: datetime