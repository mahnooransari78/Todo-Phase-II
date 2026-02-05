# Data Model: AI-powered Todo Chatbot

**Feature**: AI-powered Todo Chatbot
**Date**: 2026-01-16
**Author**: Claude

## Overview

This document defines the data models for the AI-powered Todo Chatbot feature. It extends the existing todo application with new entities for managing conversations and messages while reusing existing task entities.

## Entity: Conversation

Represents a single conversation session between a user and the AI chatbot.

**Fields:**
- `id`: UUID (Primary Key) - Unique identifier for the conversation
- `user_id`: String - Reference to the authenticated user (matches existing user identification)
- `created_at`: DateTime - Timestamp when conversation was initiated
- `updated_at`: DateTime - Timestamp when conversation was last updated
- `title`: String (Optional) - Auto-generated title based on first message or topic

**Validation Rules:**
- `user_id` must reference a valid user in the system
- `created_at` is set on creation and never modified
- `updated_at` is updated whenever a new message is added to the conversation

**State Transitions:**
- Created when first message is sent to the chatbot
- Updated when new messages are added
- Remains active until user chooses to archive/delete

## Entity: Message

Represents an individual message within a conversation, either from the user or the assistant.

**Fields:**
- `id`: UUID (Primary Key) - Unique identifier for the message
- `conversation_id`: UUID (Foreign Key) - Reference to the parent conversation
- `sender`: Enum ['user', 'assistant'] - Indicates the source of the message
- `content`: Text - The actual message content
- `timestamp`: DateTime - When the message was created
- `tool_calls`: JSON (Optional) - Serialized tool calls made by the AI agent
- `tool_responses`: JSON (Optional) - Responses from executed tools
- `error`: Text (Optional) - Error message if the message processing failed

**Validation Rules:**
- `conversation_id` must reference a valid conversation
- `sender` must be either 'user' or 'assistant'
- `content` must not be empty
- `timestamp` is set on creation and never modified
- `tool_calls` must be valid JSON if present

**State Transitions:**
- Created when a message is sent or received
- Error state when processing fails

## Entity: Task (Existing - Unchanged)

Represents a todo item managed by the existing system, accessed through MCP tools without modification.

**Fields:**
- `id`: UUID (Primary Key) - Unique identifier for the task
- `user_id`: String - Reference to the owner user
- `title`: String - Task title/description
- `description`: Text (Optional) - Detailed task description
- `completed`: Boolean - Whether the task is completed
- `created_at`: DateTime - When task was created
- `updated_at`: DateTime - When task was last updated

**Validation Rules:**
- All existing validation rules remain unchanged
- User isolation must be maintained (users can only access their own tasks)

## Relationships

```
User (existing) ||--o{ Conversation : creates
Conversation ||--o{ Message : contains
Message }o--|| Conversation : belongs_to
```

## Data Integrity Constraints

1. **Referential Integrity**: Foreign key constraints ensure conversation_id in messages references a valid conversation
2. **User Isolation**: All operations must verify that users can only access their own conversations and related messages
3. **Cascade Deletes**: When a conversation is deleted, all related messages should be deleted
4. **Data Consistency**: Message timestamps should always be within the conversation's creation and update range

## Indexes

1. `conversations.user_id` - For efficient user-specific queries
2. `conversations.updated_at` - For ordering conversations by recency
3. `messages.conversation_id` - For efficient retrieval of messages in a conversation
4. `messages.timestamp` - For ordering messages chronologically within conversations