'use client';

import React, { useState } from 'react';
import { UserLogin } from '../../types/user';
import apiClient from '../../lib/api';

interface LoginFormProps {
  onSuccess?: (userData: any) => void;
  onError?: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<UserLogin>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.login(formData);
      const { user, token } = response.data;

      // Store token and user ID in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('userId', user.id); // Store user ID for chat API calls

      // Call success callback if provided
      if (onSuccess) {
        onSuccess({ user, token });
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle different types of errors
      let errorMessage = 'Login failed';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and ensure the backend server is running.';
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        // Network error - server might be down or unreachable
        errorMessage = 'Network error: Unable to reach the server. Please ensure the backend server is running and accessible.';
      } else if (error.response) {
        // Server responded with error status
        if (error.response.status === 502) {
          errorMessage = 'Server temporarily unavailable. Please check if the backend server is running.';
        } else if (error.response.status === 503) {
          errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else {
          errorMessage = error.response.data?.detail || `Login failed: ${error.response.status} ${error.response.statusText}`;
        }
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred during login.';
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border text-gray-700 border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;