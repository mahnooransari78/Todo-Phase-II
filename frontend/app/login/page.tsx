'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LoginForm from '../../components/Auth/LoginForm';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login
    window.location.href = '/dashboard/tasks';
  };

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              register for a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mt-8 bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
        </div>
      </div>
    </div>
  );
}