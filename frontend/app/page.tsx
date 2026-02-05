'use client';

import React from 'react';
import Link from 'next/link';
import GlassCard from '../components/UI/GlassCard';
import GradientButton from '../components/UI/GradientButton';
import { motion } from 'framer-motion';
// min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
export default function HomePage() {
  return (
    <div>
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-3xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Todo App
          </motion.h1>
        </div>
      </header>

      <main className="py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-6 sm:px-0">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Welcome to your Premium Todo App
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                A secure, full-featured todo application with authentication and task management.
                Experience the future of productivity with our glassmorphism design.
              </p>

              <div className="flex justify-center space-x-4 flex-wrap gap-4">
                <Link href="/login">
                  <GradientButton variant="primary" size="lg">
                    Login
                  </GradientButton>
                </Link>

                <Link href="/register">
                  <GradientButton variant="secondary" size="lg">
                    Register
                  </GradientButton>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="mt-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Features</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Secure user authentication with JWT tokens</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Create, read, update, and delete tasks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Organize tasks by priority and status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Due date tracking with reminders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Premium glassmorphism design for enhanced experience</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
// export default function Page() {
//   return (
//     <div className="text-3xl font-bold text-purple-500">
//       Tailwind Working
//     </div>
//   );
// }