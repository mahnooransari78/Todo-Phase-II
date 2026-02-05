'use client';

import React, { useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { ChatState, Message } from '../../types/chat';
import apiClient from '../../lib/api';

interface ChatWindowProps {
  chatState: ChatState;
  dispatch: React.Dispatch<any>;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatState,
  dispatch,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Check authentication before sending
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'You are not logged in. Please log in to use the chatbot.'
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    // Add user message to state
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId: chatState.conversationId || '',
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.sendChatMessage({
        userId: userId,
        conversationId: chatState.conversationId || undefined,
        message: inputValue,
      });

      // Update conversation ID if new
      if (response.data.conversationId && !chatState.conversationId) {
        dispatch({ type: 'SET_CONVERSATION_ID', payload: response.data.conversationId });
      }

      // Add assistant response to state
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        conversationId: response.data.conversationId,
        sender: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        toolCalls: response.data.toolCalls ? JSON.stringify(response.data.toolCalls) : undefined,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });

      // Check if it's an authentication error
      if (error.response?.status === 401) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Session expired. Please log in again to continue using the chatbot.'
        });
        // Clear auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userId');
        // Redirect to login after a delay so user can see the error
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'An error occurred while sending the message'
        });
      }
    }

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] flex flex-col bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold">AI Todo Assistant</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {chatState.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {chatState.isLoading && (
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-100 rounded-full p-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            </div>
            <span className="text-sm text-gray-500">AI is thinking...</span>
          </div>
        )}

        {chatState.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong>Error:</strong> {chatState.error}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <InputArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
          disabled={chatState.isLoading}
        />
      </div>
    </div>
  );
};