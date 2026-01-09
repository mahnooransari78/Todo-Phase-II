'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRead } from '../types/user';

interface AuthContextType {
  user: UserRead | null;
  login: (userData: { user: UserRead; token: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, you would verify the token and fetch user data
      // For now, we'll just check if the token exists
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: { user: UserRead; token: string }) => {
    const { user: userDataObj, token } = userData;
    localStorage.setItem('auth_token', token);
    setUser(userDataObj);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};