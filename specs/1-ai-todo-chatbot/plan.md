# Implementation Plan: AI-powered Todo Chatbot

**Branch**: `1-ai-todo-chatbot` | **Date**: 2026-01-16 | **Spec**: [link to spec](../specs/1-ai-todo-chatbot/spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of an AI-powered chatbot that allows users to manage their todos using natural language. The system will integrate a floating chat interface into the existing Next.js application, connect to a Cohere-powered AI agent via OpenAI Agents SDK, and utilize MCP tools to perform todo operations while maintaining strict user data isolation.

## Technical Context

**Language/Version**: Python 3.11, TypeScript/JavaScript, Next.js 16+
**Primary Dependencies**: FastAPI, SQLModel, Cohere API, OpenAI Agents SDK, MCP SDK, Better Auth, Tailwind CSS
**Storage**: Neon Serverless PostgreSQL (existing + new tables)
**Testing**: pytest (backend), Jest/Vitest (frontend)
**Target Platform**: Web application (Next.js frontend + FastAPI backend)
**Project Type**: Web (frontend + backend)
**Performance Goals**: 95% of chatbot responses under 3 seconds, minimal impact (<10%) on existing page load times
**Constraints**: Must not modify existing todo schema, maintain user data isolation, follow existing authentication patterns
**Scale/Scope**: Individual user conversations, limited by Cohere API rate limits

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-Driven Development: Following approved specification from `/specs/1-ai-todo-chatbot/spec.md`
- ✅ Agentic Implementation: Plan respects Claude Code as implementation agent
- ✅ Security by Design: Will implement JWT validation and user data isolation
- ✅ Architectural Discipline: Respecting monorepo structure with separate frontend/backend
- ✅ Technology Constraints: Using specified technologies (Next.js 16+, FastAPI, SQLModel, etc.)
- ✅ User Identity & Data Isolation: Ensuring user-owned tasks remain isolated through JWT validation

## Project Structure

### Documentation (this feature)

```text
specs/1-ai-todo-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── conversation.py        # New: Conversation entity
│   │   ├── message.py             # New: Message entity
│   │   └── task.py                # Existing: Task entity (unchanged)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── chat_service.py        # New: Handles chat interactions
│   │   ├── conversation_service.py # New: Manages conversation lifecycle
│   │   └── task_service.py         # Existing: Task operations (utilized by MCP)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── chat.py                # New: Chat API endpoints
│   │   └── tasks.py               # Existing: Task endpoints (unchanged)
│   ├── agents/
│   │   ├── __init__.py
│   │   └── todo_agent.py          # New: AI agent for todo operations
│   └── mcp_servers/
│       ├── __init__.py
│       └── todo_mcp_server.py     # New: MCP server for todo tools
├── main.py
└── requirements.txt

frontend/
├── app/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── Chat/
│   │   ├── ChatBot.tsx            # New: Floating chatbot component
│   │   ├── ChatWindow.tsx         # New: Chat interface window
│   │   ├── MessageBubble.tsx      # New: Individual message display
│   │   └── InputArea.tsx          # New: Message input area
│   └── UI/
│       └── FloatingButton.tsx     # New: Button to open chat window
├── lib/
│   ├── api.ts                     # Existing: API client (updated for chat)
│   └── auth.ts                    # Existing: Authentication utilities
└── types/
    └── chat.ts                    # New: Chat-related TypeScript types
```

**Structure Decision**: Web application with separate frontend (Next.js) and backend (FastAPI) following the existing project architecture. New chatbot functionality will be integrated without modifying existing structures.

## Phase 0: Architecture Integration Plan

### 1. How the chatbot integrates into the existing Next.js 16 app
- Create a global floating chatbot component that can be imported into the main layout
- Integrate the chatbot at the root layout level to ensure availability across all pages
- Use Next.js 16 App Router features to manage the chatbot state consistently

### 2. Floating chatbot strategy (global component vs layout injection)
- Implement as a global component in the root layout to ensure accessibility across all pages
- Use React Context to manage chatbot state (open/closed, conversation history)
- Position the chatbot in the bottom-right corner using Tailwind CSS positioning classes

### 3. API communication flow
- Establish communication between frontend chat component and backend chat endpoint
- Implement proper authentication flow to pass JWT tokens with each chat request
- Design error handling for network issues and API failures

## Phase 1: Frontend Plan

### 1. Custom chat UI with Tailwind (glassmorphism)
- Create a glassmorphism design using Tailwind CSS with backdrop blur effects
- Implement a floating chat window with smooth open/close animations
- Design message bubbles with different styling for user vs assistant messages

### 2. Message flow (user → assistant)
- Implement real-time message display as they are sent/received
- Add loading indicators during AI processing
- Handle message history persistence within the session

### 3. Loading, error, and empty states
- Show loading spinner while waiting for AI response
- Display appropriate error messages for failed requests
- Handle initial empty state when no messages exist

### 4. Accessibility considerations
- Ensure proper ARIA labels for screen readers
- Implement keyboard navigation for chat interface
- Maintain color contrast ratios for readability

## Phase 2: Backend Plan

### 1. Stateless chat endpoint design
- Create POST endpoint at `/api/{user_id}/chat` following the specification
- Accept optional conversation_id and required message parameters
- Return conversation_id, assistant response, and tool calls as specified

### 2. Conversation lifecycle handling
- Generate new conversation_id if none provided in request
- Associate conversations with authenticated user
- Track conversation state for context preservation

### 3. Message persistence strategy
- Store user and assistant messages in the messages table
- Link messages to their respective conversations
- Include metadata such as sender type and timestamp

## Phase 3: AI Agent Plan

### 1. Agent setup using OpenAI Agents SDK
- Initialize OpenAI Agent with Cohere as the underlying LLM
- Configure the agent with proper system instructions for todo management
- Set up API keys and authentication for Cohere service

### 2. Intent detection strategy
- Train the agent to recognize common todo-related intents (add, list, complete, delete, update)
- Implement natural language understanding for varied user expressions
- Handle ambiguous requests by asking for clarification

### 3. Tool invocation rules
- Map detected intents to appropriate MCP tools
- Validate tool parameters before execution
- Format tool responses appropriately for user consumption

## Phase 4: MCP Server Plan

### 1. MCP server responsibilities
- Implement MCP server that exposes todo-related tools
- Handle tool registration and validation
- Manage authentication and user permission checks

### 2. Tool registration and validation
- Register the five required tools: add_task, list_tasks, complete_task, delete_task, update_task
- Validate input parameters for each tool
- Ensure proper error handling for invalid inputs

### 3. How MCP tools interact with existing Task DB
- Use existing task_service to perform database operations
- Apply user ownership validation to prevent unauthorized access
- Maintain consistency with existing data models and relationships

## Phase 5: Database Plan

### 1. New tables creation strategy
- Create conversations table with fields: id, user_id, created_at, updated_at
- Create messages table with fields: id, conversation_id, sender (user/assistant), content, timestamp, tool_calls
- Establish proper foreign key relationships

### 2. Relationships with existing task records
- Link conversations to users using existing user identification
- Reuse existing tasks table without modifications as specified
- Maintain referential integrity between new and existing tables

### 3. Data retention considerations
- Implement conversation cleanup strategy if needed
- Plan for message archival or deletion policies
- Consider performance implications of growing message history

## Phase 6: Security & Auth Plan

### 1. User isolation
- Verify JWT token authenticity on each chat request
- Ensure users can only access their own conversations
- Validate user ownership of tasks before performing operations

### 2. Token usage
- Extract user identity from JWT claims
- Pass user context to all downstream services
- Implement proper token refresh mechanisms if needed

### 3. Preventing cross-user task access
- Validate user_id in URL path matches JWT token
- Check task ownership before allowing modifications
- Log security-relevant events for audit purposes

## Phase 7: Error Handling & Edge Cases

### 1. Task not found
- Implement proper error responses when requested tasks don't exist
- Provide helpful feedback to users when tasks are missing
- Log these events for debugging purposes

### 2. Ambiguous user requests
- Design the AI agent to ask clarifying questions
- Implement disambiguation flows for unclear requests
- Provide suggestions when user intent is uncertain

### 3. Model or tool failures
- Implement fallback responses for AI model failures
- Handle MCP tool execution errors gracefully
- Provide meaningful error messages to users

## Phase 8: Testing Strategy

### 1. Manual test flows
- Test each user story from the specification manually
- Verify all acceptance scenarios work as expected
- Validate edge cases behave appropriately

### 2. API-level validation
- Create automated tests for the chat API endpoint
- Verify authentication and authorization work correctly
- Test error conditions and edge cases programmatically

### 3. Chat behavior verification
- Test natural language processing accuracy
- Verify tool invocation works correctly
- Confirm conversation state management functions properly

## Phase 9: Deployment & Environment Plan

### 1. Environment variables
- Add COHERE_API_KEY for AI service access
- Ensure BETTER_AUTH_SECRET is configured for JWT validation
- Plan for any additional configuration needed for production

### 2. Local vs production behavior
- Implement proper configuration separation
- Ensure local development environment mirrors production
- Plan for different behavior in staging vs production

### 3. Safe rollout without downtime
- Deploy new API endpoints without affecting existing functionality
- Gradually enable the frontend chatbot component
- Plan rollback procedures if issues arise

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |