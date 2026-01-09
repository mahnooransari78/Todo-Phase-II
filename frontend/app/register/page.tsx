'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RegisterForm from '../../components/Auth/RegisterForm';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSuccess = () => {
    // Redirect to dashboard after successful registration
    window.location.href = '/dashboard/tasks';
  };

  const handleRegisterError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mt-8 bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <RegisterForm onSuccess={handleRegisterSuccess} onError={handleRegisterError} />
        </div>
      </div>
    </div>
  );
}