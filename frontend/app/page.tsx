'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to your Todo App</h2>
              <p className="text-gray-600 mb-6">
                A secure, full-featured todo application with authentication and task management.
              </p>

              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Secure user authentication</span>
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
                  <span>Due date tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Responsive design for all devices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}