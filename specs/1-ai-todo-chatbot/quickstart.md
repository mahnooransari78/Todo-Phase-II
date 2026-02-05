# Quickstart Guide: AI-powered Todo Chatbot

**Feature**: AI-powered Todo Chatbot
**Date**: 2026-01-16
**Author**: Claude

## Overview

This guide provides a quick introduction to developing and testing the AI-powered Todo Chatbot feature. It covers the essential setup steps and development workflow.

## Prerequisites

- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- Poetry (for Python dependency management)
- Access to Cohere API (free tier sufficient)
- Existing project dependencies installed

## Environment Setup

### 1. Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
poetry install

# Set required environment variables
export COHERE_API_KEY="your-cohere-api-key"
export BETTER_AUTH_SECRET="your-better-auth-secret"
```

### 2. Frontend Configuration

```bash
# Navigate to frontend directory
cd frontend

# Install JavaScript dependencies
npm install
```

## Key Development Commands

### Backend Development

```bash
# Start backend development server
cd backend
poetry run uvicorn src.main:app --reload --port 8000

# Run backend tests
poetry run pytest
```

### Frontend Development

```bash
# Start frontend development server
cd frontend
npm run dev

# Run frontend tests
npm run test
```

## Key Files to Modify

### Backend Files
- `src/models/conversation.py` - Conversation entity model
- `src/models/message.py` - Message entity model
- `src/services/chat_service.py` - Core chat functionality
- `src/routes/chat.py` - Chat API endpoints
- `src/agents/todo_agent.py` - AI agent logic
- `src/mcp_servers/todo_mcp_server.py` - MCP tools implementation

### Frontend Files
- `components/Chat/ChatBot.tsx` - Main chatbot component
- `components/Chat/ChatWindow.tsx` - Chat interface window
- `components/Chat/MessageBubble.tsx` - Message display component
- `components/Chat/InputArea.tsx` - Message input area
- `types/chat.ts` - Chat-related TypeScript types

## API Endpoints

### Chat Endpoint
- `POST /api/{user_id}/chat` - Send message to chatbot
- Request body: `{ "conversation_id": "uuid", "message": "user message" }`
- Response: `{ "conversation_id": "uuid", "response": "assistant response", "tool_calls": [...] }`

## Testing the Feature

### 1. Manual Testing
1. Start both frontend and backend servers
2. Log in to the application
3. Click the floating chatbot button in the bottom-right corner
4. Send a message like "Add a task to buy groceries"
5. Verify the task is created in the todo list

### 2. API Testing
```bash
# Test the chat endpoint directly
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "List my tasks"}'
```

## Common Development Tasks

### Adding New MCP Tools
1. Define the new tool function in `todo_mcp_server.py`
2. Register the tool with the MCP server
3. Update the AI agent to recognize the new tool

### Modifying Chat UI
1. Update components in `components/Chat/`
2. Adjust Tailwind CSS classes for glassmorphism effect
3. Test responsiveness across different screen sizes

### Extending AI Capabilities
1. Update the system prompt in `todo_agent.py`
2. Add new intent detection patterns
3. Connect new capabilities to existing MCP tools

## Troubleshooting

### Chatbot Not Responding
- Verify Cohere API key is correctly set
- Check that the MCP server is running and registered
- Look at backend logs for error messages

### Authentication Issues
- Confirm JWT token is being passed correctly
- Verify user_id in URL matches the authenticated user
- Check Better Auth configuration

### Database Issues
- Ensure new migration has been applied
- Verify foreign key relationships are correct
- Check that user isolation is properly implemented