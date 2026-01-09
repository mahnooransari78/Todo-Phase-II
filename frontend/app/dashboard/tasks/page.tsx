'use client';

import React, { useState } from 'react';
import TaskList from '../../../components/Task/TaskList';
import TaskForm from '../../../components/Task/TaskForm';
import { TaskCreate, TaskUpdate } from '../../../types/task';
import apiClient from '../../../lib/api';

export default function TasksPage() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTask = async (taskData: TaskCreate | TaskUpdate) => {
    try {
      // When creating a task, we need to ensure required fields are present
      if (!taskData.title) {
        throw new Error('Title is required for creating a task');
      }

      await apiClient.createTask(taskData as TaskCreate);
      setShowForm(false);
      // Refresh the task list
      window.location.reload();
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h2>
          <TaskForm onSubmit={handleCreateTask} onCancel={handleCancel} />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-white shadow rounded-lg p-6 text-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 mb-6"
        >
          + Add your first task
        </button>
      )}

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Task List</h2>
        <TaskList />
      </div>
    </div>
  );
}