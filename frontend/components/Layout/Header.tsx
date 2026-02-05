'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '../UI/ThemeToggle';
import { User, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user info from wherever it's stored in your app
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Decode JWT token to get user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const userData = JSON.parse(jsonPayload);

        // Create a mock user object based on token data
        setUser({
          name: userData.name || 'User',
          email: userData.email || userData.sub || 'email@example.com',
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <motion.header
      className="glass-card backdrop-blur-xl shadow-lg border-b border-glass dark:border-glass-dark"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg glass hover:bg-glass dark:hover:bg-glass-dark transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Right side - User info and controls */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-full glass hover:bg-glass dark:hover:bg-glass-dark transition-colors relative">
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="bg-gradient-purple-pink p-1 rounded-full">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || 'Not logged in'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;