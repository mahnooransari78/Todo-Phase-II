import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { ChatProvider } from '../components/Chat/ChatContext';
import TailwindBackground from '../components/Background/TailwindBackground';
import ThemeToggle from '../components/UI/ThemeToggle';
import { ChatBot } from '../components/Chat/ChatBot';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App - Task Management',
  description: 'A secure, full-featured todo application with authentication and task management',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-gray-100 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ChatProvider>
            <TailwindBackground />
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            {children}
            <ChatBot />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}