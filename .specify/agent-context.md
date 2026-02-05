# Todo Full-Stack Web Application Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-16

## Active Technologies

- Frontend: Next.js 16+, TypeScript, Tailwind CSS
- Backend: Python FastAPI, SQLModel ORM
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth
- AI/ML: Cohere API, OpenAI Agents SDK
- Tooling: Official MCP SDK
- Testing: pytest (backend), Jest/Vitest (frontend)

## Project Structure

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

## Commands

### Backend Development
```bash
# Start backend server
cd backend
poetry run uvicorn src.main:app --reload --port 8000

# Run backend tests
poetry run pytest
```

### Frontend Development
```bash
# Start frontend server
cd frontend
npm run dev

# Run frontend tests
npm run test
```

### Environment Variables
```bash
# Backend
COHERE_API_KEY="your-cohere-api-key"
BETTER_AUTH_SECRET="your-better-auth-secret"
```

## Code Style

### Python
- Follow PEP 8 guidelines
- Use type hints for all function parameters and return values
- Use SQLModel for database interactions
- Follow FastAPI best practices for route definitions

### TypeScript/JavaScript
- Use TypeScript for all new components
- Follow Next.js 16+ patterns with App Router
- Use Tailwind CSS utility classes for styling
- Implement proper error boundaries

### Database
- Use SQLModel for all database models
- Follow existing naming conventions
- Maintain user data isolation in all queries

## Recent Changes

- **AI-powered Todo Chatbot**: Added floating chatbot interface with AI-powered natural language processing for todo management. Implemented MCP server with tools for add_task, list_tasks, complete_task, delete_task, and update_task operations. Added Conversation and Message entities to track chat history while reusing existing Task entities.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->