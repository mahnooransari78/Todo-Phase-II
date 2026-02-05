# Tasks: AI-powered Todo Chatbot

**Feature**: AI-powered Todo Chatbot
**Date**: 2026-01-16
**Author**: Claude

## Overview

Implementation of an AI-powered chatbot that allows users to manage their todos using natural language. The system will integrate a floating chat interface into the existing Next.js application, connect to a Cohere-powered AI agent via OpenAI Agents SDK, and utilize MCP tools to perform todo operations while maintaining strict user data isolation.

## Dependencies

- User Story 2 (Persistent Conversation Context) depends on User Story 1 (Natural Language Todo Management)
- User Story 3 (Cross-Page Accessibility) can be developed in parallel with other user stories
- All user stories depend on foundational backend services (models, services, API endpoints)

## Parallel Execution Examples

- Frontend components can be developed in parallel with backend API development
- MCP server implementation can be developed alongside the AI agent
- Database migrations can be implemented early and used by all other tasks

## Implementation Strategy

- MVP: Implement User Story 1 (Natural Language Todo Management) with minimal UI
- Incremental delivery: Add conversation persistence (US2) and floating UI (US3) in subsequent phases
- Focus on core functionality first before advanced features

---

## Phase 1: Setup

- [X] T001 Add required dependencies to backend (Cohere, OpenAI Agents SDK, MCP SDK) in backend/requirements.txt
- [X] T002 Add required dependencies to frontend (if any) in frontend/package.json
- [X] T003 Create directory structure for new components per implementation plan in backend/src/models, backend/src/services, backend/src/routes, backend/src/agents, backend/src/mcp_servers, frontend/components/Chat, frontend/types
- [X] T004 Update environment configuration to include COHERE_API_KEY in backend/.env.example

## Phase 2: Foundational

- [X] T005 Create Conversation model in backend/src/models/conversation.py
- [X] T006 Create Message model in backend/src/models/message.py
- [X] T007 Create database migration for new tables in backend/migrations/
- [X] T008 Implement ConversationService in backend/src/services/conversation_service.py
- [X] T009 Implement MessageService in backend/src/services/message_service.py
- [X] T010 Update existing TaskService to be compatible with MCP tools in backend/src/services/task_service.py
- [X] T011 Create chat API endpoint skeleton in backend/src/routes/chat.py
- [X] T012 Create chat-related TypeScript types in frontend/types/chat.ts

## Phase 3: User Story 1 - Natural Language Todo Management (Priority: P1)

**Goal**: Enable users to interact with an AI chatbot using natural language to manage their todos, so that they can quickly add, update, complete, or delete tasks without navigating through UI elements.

**Independent Test**: The system can accept natural language inputs like "Add a task to buy groceries" and successfully create a new todo, delivering immediate value to users without requiring UI navigation.

- [X] T013 [US1] Implement basic chat endpoint POST /api/{user_id}/chat in backend/src/routes/chat.py
- [X] T014 [US1] Add authentication validation to chat endpoint in backend/src/routes/chat.py
- [X] T015 [US1] Implement conversation creation/retrieval logic in backend/src/services/chat_service.py
- [X] T016 [US1] Implement message saving logic in backend/src/services/chat_service.py
- [X] T017 [US1] Create TodoMCP server with add_task tool in backend/src/mcp_servers/todo_mcp_server.py
- [X] T018 [US1] Create TodoMCP server with list_tasks tool in backend/src/mcp_servers/todo_mcp_server.py
- [X] T019 [US1] Create TodoMCP server with complete_task tool in backend/src/mcp_servers/todo_mcp_server.py
- [X] T020 [US1] Create TodoMCP server with delete_task tool in backend/src/mcp_servers/todo_mcp_server.py
- [X] T021 [US1] Create TodoMCP server with update_task tool in backend/src/mcp_servers/todo_mcp_server.py
- [X] T022 [US1] Implement basic TodoAgent with OpenAI Agents SDK in backend/src/agents/todo_agent.py
- [X] T023 [US1] Connect agent to MCP server in backend/src/agents/todo_agent.py
- [X] T024 [US1] Implement basic chat UI component in frontend/components/Chat/ChatBot.tsx
- [X] T025 [US1] Implement message display component in frontend/components/Chat/MessageBubble.tsx
- [X] T026 [US1] Implement message input area in frontend/components/Chat/InputArea.tsx
- [X] T027 [US1] Connect frontend to chat API in frontend/lib/api.ts
- [X] T028 [US1] Test acceptance scenario 1: "Add a task to buy groceries" creates new todo and displays confirmation

## Phase 4: User Story 2 - Persistent Conversation Context (Priority: P2)

**Goal**: Enable the AI chatbot to maintain context across multiple interactions, so that users can have a natural flowing conversation about their tasks.

**Independent Test**: The system remembers previous interactions in the same conversation session, allowing for contextual references like "update that task" referring to a task mentioned in a previous message.

- [X] T029 [US2] Enhance conversation state management in backend/src/services/conversation_service.py
- [X] T030 [US2] Update chat service to maintain conversation context in backend/src/services/chat_service.py
- [X] T031 [US2] Enhance TodoAgent to utilize conversation history in backend/src/agents/todo_agent.py
- [X] T032 [US2] Implement message history loading in backend/src/services/chat_service.py
- [X] T033 [US2] Update frontend to maintain conversation state between messages in frontend/components/Chat/ChatBot.tsx
- [X] T034 [US2] Test acceptance scenario 2: "update that task" references task from previous message

## Phase 5: User Story 3 - Cross-Page Accessibility (Priority: P3)

**Goal**: Make the AI chatbot accessible from any page in the application, so that users can manage their todos without interrupting their current workflow.

**Independent Test**: The floating chatbot widget is accessible from any page in the application, allowing users to manage tasks without leaving their current context.

- [X] T035 [US3] Create floating chat button component in frontend/components/UI/FloatingButton.tsx
- [X] T036 [US3] Implement glassmorphism chat window UI in frontend/components/Chat/ChatWindow.tsx
- [X] T037 [US3] Add floating chatbot to root layout in frontend/app/layout.tsx
- [X] T038 [US3] Implement smooth open/close animations for chat window
- [X] T039 [US3] Add position controls for bottom-right placement in Tailwind CSS
- [X] T040 [US3] Test acceptance scenario 3: Chatbot accessible from any page with click on floating icon

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T041 Implement error handling for AI model failures in backend/src/agents/todo_agent.py
- [X] T042 Add loading states and spinners to frontend components
- [X] T043 Implement proper error messages for failed requests in frontend
- [X] T044 Add accessibility features (ARIA labels, keyboard navigation) to chat components
- [X] T045 Add logging for security events and debugging in backend
- [X] T046 Implement rate limiting for chat API endpoint in backend/src/routes/chat.py
- [X] T047 Add tests for chat functionality in backend/tests/
- [X] T048 Add tests for chat UI components in frontend/tests/
- [X] T049 Update documentation with usage instructions
- [X] T050 Perform end-to-end testing of all user stories