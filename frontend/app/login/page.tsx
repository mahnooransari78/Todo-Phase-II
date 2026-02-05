'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LoginForm from '../../components/Auth/LoginForm';
import GlassCard from '../../components/UI/GlassCard';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login
    router.push('/dashboard/tasks');
  };

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.h2
            className="text-3xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Sign in to your account
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            >
              register for a new account
            </Link>
          </motion.p>
        </div>

        {error && (
          <motion.div
            className="glass rounded-lg p-4 border border-red-200 dark:border-red-900"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-red-600 dark:text-red-300">{error}</div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard className="p-6 sm:p-8">
            <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}