'use client';

import React, { useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import { FloatingButton } from '../UI/FloatingButton';
import { useChat } from './ChatContext';

export const ChatBot: React.FC = () => {
  const { chatState, dispatch } = useChat();

  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT_WINDOW' });
  };

  const closeChat = () => {
    dispatch({ type: 'TOGGLE_CHAT_WINDOW', payload: false });
  };

  return (
    <>
      <FloatingButton onClick={toggleChat} />
      {chatState.isOpen && (
        <ChatWindow
          chatState={chatState}
          dispatch={dispatch}
          onClose={closeChat}
        />
      )}
    </>
  );
};