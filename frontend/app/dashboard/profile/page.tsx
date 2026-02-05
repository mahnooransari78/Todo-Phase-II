'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../../../components/UI/GlassCard';
import GradientButton from '../../../components/UI/GradientButton';
import { User, Mail, Calendar, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

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
    return (
      <div className="flex justify-center items-center min-h-96">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-red-500 dark:text-red-400 text-lg">You are not logged in.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Information Card */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-purple-pink p-3 rounded-full mr-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Profile Information</h2>
          </div>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {user.name || 'Not provided'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {user.email || 'N/A'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Account created
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                {user.emailVerified ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                Email verified
              </dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.emailVerified
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}>
                  {user.emailVerified ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" /> Not verified
                    </>
                  )}
                </span>
              </dd>
            </div>
          </dl>
        </GlassCard>

        {/* Account Actions Card */}
        <GlassCard className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-indigo-purple p-3 rounded-full mr-4">
              <LogOut className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Account Actions</h2>
          </div>

          <div className="flex justify-end">
            <GradientButton
              variant="secondary"
              size="md"
              onClick={handleSignOut}
              icon={<LogOut className="h-4 w-4" />}
            >
              Sign Out
            </GradientButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}