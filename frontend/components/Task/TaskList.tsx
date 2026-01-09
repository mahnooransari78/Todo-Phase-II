'use client';

import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { TaskRead, TaskCreate, TaskUpdate } from '../../types/task';
import apiClient from '../../lib/api';

interface TaskListProps {
  userId?: string;
  onTaskUpdate?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskUpdate }) => {
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await apiClient.getTasks();

      // Check if response has the expected structure
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);

      // Check if it's a timeout error
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Request timed out. The server may be slow to respond or not running. Please check if the backend server is running on http://localhost:8000.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (err.response?.status === 404) {
        setError('Backend API not found. Please check if the server is running on the correct port (usually http://localhost:8000).');
      } else if (err.response?.status === 500) {
        setError('Internal server error. Please check the backend server logs.');
      } else {
        setError(`Failed to fetch tasks: ${err.message || 'Network error'}. Please ensure the backend server is running.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await apiClient.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      if (onTaskUpdate) onTaskUpdate();
    } catch (err: any) {
      console.error('Error deleting task:', err);

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Delete request timed out. Please ensure the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        setError('Failed to delete task');
      }
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      // Find the task in the list
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      // Update the task status to completed
      const updatedTask = {
        ...taskToUpdate,
        status: 'completed'
      };

      await apiClient.updateTask(taskId, { status: 'completed' });
      // Update the task in the local state
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      ));
      if (onTaskUpdate) onTaskUpdate();
    } catch (err: any) {
      console.error('Error completing task:', err);

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Complete request timed out. Please ensure the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        setError('Failed to complete task');
      }
    }
  };

  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);

  const handleEditTask = (task: TaskRead) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (taskData: TaskCreate | TaskUpdate) => {
    if (!editingTask) return;

    try {
      await apiClient.updateTask(editingTask.id, taskData);
      setEditingTask(null);

      // Refresh the task list
      fetchTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (err: any) {
      console.error('Error updating task:', err);

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Update request timed out. Please ensure the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        setError('Failed to update task');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center py-4">No tasks found. Create your first task!</div>;
  }

  return (
    <div className="space-y-4">
      {editingTask ? (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Task</h2>
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={handleCancelEdit}
            isEditing={true}
          />
        </div>
      ) : null}
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;