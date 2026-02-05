// Types for the AI-powered Todo Chatbot

export interface Conversation {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolCalls?: string; // Serialized tool calls made by the AI agent
  toolResponses?: string; // Responses from executed tools
  error?: string; // Error message if the message processing failed
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  toolCalls: ToolCall[];
  timestamp: string;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ChatState {
  conversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}