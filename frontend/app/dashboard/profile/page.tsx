'use client';

import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from wherever it's stored in your app
    // Since you're using JWT tokens, you might need to decode the token or make an API call
    const fetchUserInfo = async () => {
      try {
        // You'd make an API call to your backend to get user info
        // For now, let's simulate getting user info from localStorage or similar
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, you would decode the JWT or make an API call
          // For now, let's just parse a mock user
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
              name: userData.name || 'Unknown User',
              email: userData.email || userData.sub || 'No email',
              createdAt: userData.iat ? new Date(userData.iat * 1000).toISOString() : new Date().toISOString(),
              emailVerified: true
            });
          } catch (error) {
            console.error('Error decoding token:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-600">You are not logged in.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Account created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email verified</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.emailVerified ? 'Verified' : 'Not verified'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Logout Button */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Account Actions</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <button
            onClick={handleSignOut}
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}