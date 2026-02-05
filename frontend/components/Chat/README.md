# AI-Powered Todo Chatbot

The AI-powered Todo Chatbot allows users to manage their todos using natural language commands. The chatbot is accessible from any page in the application via the floating chat button in the bottom-right corner.

## Features

- **Natural Language Processing**: Interact with your todo list using everyday language
- **Floating Interface**: Accessible from any page with a single click
- **Persistent Conversations**: Maintains context across multiple interactions
- **Glassmorphism Design**: Modern UI with blur effects and transparency

## Supported Commands

- **Add Tasks**: "Add a task to buy groceries" or "Create a task to call mom"
- **List Tasks**: "Show me my tasks" or "What do I have to do?"
- **Complete Tasks**: "Complete the grocery task" or "Mark task as done"
- **Delete Tasks**: "Delete the meeting task" or "Remove that task"
- **Update Tasks**: "Change the title of the task" or "Update that task"

## Architecture

- **Frontend**: React components with Tailwind CSS styling
- **Backend**: FastAPI endpoints with Cohere-powered AI agent
- **Database**: SQLModel entities for conversation and message storage
- **Authentication**: JWT-based user isolation

## Components

- `ChatBot.tsx`: Main chatbot component that manages visibility
- `ChatWindow.tsx`: The chat interface window
- `MessageBubble.tsx`: Individual message display component
- `InputArea.tsx`: Message input area with send button
- `ChatContext.tsx`: State management for chat functionality