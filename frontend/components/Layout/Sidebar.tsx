'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Calendar, User, LogOut, Moon, Sun } from 'lucide-react';
import ThemeToggle from '../UI/ThemeToggle';
import { useTheme } from 'next-themes';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse }) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      toggleCollapse();
    }
  }, [pathname, toggleCollapse]);

  const navItems = [
    { href: '/' as const, label: 'Home', icon: Home },
    { href: '/dashboard/tasks' as const, label: 'Tasks', icon: Calendar },
    { href: '/dashboard/profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-lg glass-card"
        onClick={toggleCollapse}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isCollapsed ? 'Open menu' : 'Close menu'}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(!isCollapsed || window.innerWidth < 768) && (
          <motion.aside
            className={`fixed md:relative z-40 h-screen md:h-auto top-0 left-0 w-64 bg-gradient-to-b from-transparent to-transparent ${
              isCollapsed ? 'hidden md:block' : 'block'
            }`}
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="glass-card h-full flex flex-col backdrop-blur-xl shadow-2xl border-r border-glass dark:border-glass-dark">
              {/* Logo/Brand */}
              <div className="p-5 border-b border-glass dark:border-glass-dark">
                <h1 className="text-xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
                  Todo App
                </h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <motion.li key={item.href} whileHover={{ x: 5 }} className="w-full">
                        <Link href={item.href}>
                          <motion.div
                            className={`flex items-center p-3 rounded-lg transition-all ${
                              isActive
                                ? 'bg-gradient-purple-pink text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-glass dark:hover:bg-glass-dark'
                            }`}
                            animate={{
                              paddingLeft: isActive ? '1.25rem' : '1rem',
                            }}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                          </motion.div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom section */}
              <div className="p-3 border-t border-glass dark:border-glass-dark space-y-3">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-glass dark:bg-glass-dark">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Theme</span>
                  <ThemeToggle />
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center p-3 text-red-600 dark:text-red-400 rounded-lg hover:bg-glass dark:hover:bg-glass-dark transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;