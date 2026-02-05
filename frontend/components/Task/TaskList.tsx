'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { TaskRead, TaskCreate, TaskUpdate } from '../../types/task';
import apiClient from '../../lib/api';
import GlassCard from '../UI/GlassCard';
import LoadingSkeleton from '../UI/LoadingSkeleton';

interface TaskListProps {
  userId?: string;
  onTaskUpdate?: () => void;
  onTasksChange?: (tasks: any[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskUpdate, onTasksChange }) => {
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [groupBy, setGroupBy] = useState<string>('none'); // none, status, date
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  useEffect(() => {
    // Apply filtering and sorting
    let result = [...tasks];

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at || b.due_date || 0).getTime() -
                 new Date(a.created_at || a.due_date || 0).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] -
                 priorityOrder[a.priority as keyof typeof priorityOrder];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, statusFilter, priorityFilter, searchTerm, sortBy, groupBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      // Attempt to fetch tasks with retry logic
      let response;
      let retries = 3;
      let lastError = null;

      while (retries > 0) {
        try {
          response = await apiClient.getTasks();
          break; // Success, exit the loop
        } catch (error: any) {
          lastError = error;
          console.warn(`Failed to fetch tasks, ${retries - 1} retries left:`, error.message);

          // Only retry on network errors, not on 4xx/5xx responses
          if (error.code === 'ECONNABORTED' ||
              error.code === 'ENOTFOUND' ||
              error.message?.includes('timeout') ||
              error.message?.includes('Network Error')) {
            retries--;
            if (retries > 0) {
              // Wait 1 second before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } else {
            // Don't retry on 4xx/5xx responses
            throw error;
          }
        }
      }

      // Check if response has the expected structure
      // The backend returns TaskListResponse with tasks, total, limit, offset
      if (response && response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else if (response && response.data && Array.isArray(response.data)) {
        // Fallback: if response.data is directly an array of tasks
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);

      // Check if it's a timeout error
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Request timed out. The server may be slow to respond or not running. Please check if the backend server is running on http://localhost:8000.');
      } else if (err.code === 'ENOTFOUND') {
        setError('Cannot connect to the server. Please check if the backend server is running on http://localhost:8000.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        // Redirect to login using Next.js router instead of window.location
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
      // Attempt to delete task with retry logic
      let retries = 3;

      while (retries > 0) {
        try {
          await apiClient.deleteTask(taskId);
          break; // Success, exit the loop
        } catch (error: any) {
          // Only retry on network errors, not on 4xx/5xx responses
          if ((error.code === 'ECONNABORTED' ||
               error.code === 'ENOTFOUND' ||
               error.message?.includes('timeout') ||
               error.message?.includes('Network Error')) && retries > 1) {
            retries--;
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            // Don't retry on 4xx/5xx responses or on the last attempt
            throw error;
          }
        }
      }

      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      if (onTaskUpdate) onTaskUpdate();
    } catch (err: any) {
      console.error('Error deleting task:', err);

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Delete request timed out. Please ensure the backend server is running.');
      } else if (err.code === 'ENOTFOUND') {
        setError('Cannot connect to the server. Please check if the backend server is running.');
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

      // Attempt to update task with retry logic
      let retries = 3;

      while (retries > 0) {
        try {
          await apiClient.updateTask(taskId, { status: 'completed' });
          break; // Success, exit the loop
        } catch (error: any) {
          // Only retry on network errors, not on 4xx/5xx responses
          if ((error.code === 'ECONNABORTED' ||
               error.code === 'ENOTFOUND' ||
               error.message?.includes('timeout') ||
               error.message?.includes('Network Error')) && retries > 1) {
            retries--;
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            // Don't retry on 4xx/5xx responses or on the last attempt
            throw error;
          }
        }
      }

      // Update the task in the local state
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      );
      setTasks(updatedTasks);
      if (onTaskUpdate) onTaskUpdate();
    } catch (err: any) {
      console.error('Error completing task:', err);

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Complete request timed out. Please ensure the backend server is running.');
      } else if (err.code === 'ENOTFOUND') {
        setError('Cannot connect to the server. Please check if the backend server is running.');
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
      // Attempt to update task with retry logic
      let retries = 3;

      while (retries > 0) {
        try {
          await apiClient.updateTask(editingTask.id, taskData);
          break; // Success, exit the loop
        } catch (error: any) {
          // Only retry on network errors, not on 4xx/5xx responses
          if ((error.code === 'ECONNABORTED' ||
               error.code === 'ENOTFOUND' ||
               error.message?.includes('timeout') ||
               error.message?.includes('Network Error')) && retries > 1) {
            retries--;
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            // Don't retry on 4xx/5xx responses or on the last attempt
            throw error;
          }
        }
      }

      setEditingTask(null);

      // Refresh the task list
      fetchTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (err: any) {
      console.error('Error updating task:', err);

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Update request timed out. Please ensure the backend server is running.');
      } else if (err.code === 'ENOTFOUND') {
        setError('Cannot connect to the server. Please check if the backend server is running.');
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

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]); // Deselect all
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id)); // Select all visible tasks
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;

    // Confirmation dialog would go here in a real app
    for (const taskId of selectedTasks) {
      try {
        // Attempt to delete task with retry logic
        let retries = 3;

        while (retries > 0) {
          try {
            await apiClient.deleteTask(taskId);
            break; // Success, exit the loop
          } catch (error: any) {
            // Only retry on network errors, not on 4xx/5xx responses
            if ((error.code === 'ECONNABORTED' ||
                 error.code === 'ENOTFOUND' ||
                 error.message?.includes('timeout') ||
                 error.message?.includes('Network Error')) && retries > 1) {
              retries--;
              // Wait 1 second before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              // Don't retry on 4xx/5xx responses or on the last attempt
              throw error;
            }
          }
        }
      } catch (err) {
        console.error(`Error deleting task ${taskId}:`, err);
      }
    }

    // Refresh tasks
    fetchTasks();
    setSelectedTasks([]); // Clear selections
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return;

    for (const taskId of selectedTasks) {
      try {
        // Attempt to update task with retry logic
        let retries = 3;

        while (retries > 0) {
          try {
            await apiClient.updateTask(taskId, { status: 'completed' });
            break; // Success, exit the loop
          } catch (error: any) {
            // Only retry on network errors, not on 4xx/5xx responses
            if ((error.code === 'ECONNABORTED' ||
                 error.code === 'ENOTFOUND' ||
                 error.message?.includes('timeout') ||
                 error.message?.includes('Network Error')) && retries > 1) {
              retries--;
              // Wait 1 second before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              // Don't retry on 4xx/5xx responses or on the last attempt
              throw error;
            }
          }
        }
      } catch (err) {
        console.error(`Error completing task ${taskId}:`, err);
      }
    }

    // Refresh tasks
    fetchTasks();
    setSelectedTasks([]); // Clear selections
    if (onTaskUpdate) onTaskUpdate();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <GlassCard className="p-4">
          <div className="flex space-x-4">
            <LoadingSkeleton type="text" className="w-1/4 h-8" />
            <LoadingSkeleton type="text" className="w-1/4 h-8" />
            <LoadingSkeleton type="text" className="w-1/4 h-8" />
            <LoadingSkeleton type="text" className="w-1/4 h-8" />
          </div>
        </GlassCard>
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} type="card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-6 text-center">
        <div className="text-red-500">Error: {error}</div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Statuses</option>
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Group By */}
          <div>
            <label htmlFor="groupBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Group By
            </label>
            <select
              id="groupBy"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-3 py-2 bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="none">None</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Editing Task Form */}
      {editingTask && (
        <GlassCard className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Task</h2>
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={handleCancelEdit}
            isEditing={true}
          />
        </GlassCard>
      )}

      {/* Bulk Operations Bar */}
      {selectedTasks.length > 0 && (
        <GlassCard className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">
              {selectedTasks.length} of {filteredTasks.length} selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm bg-glass dark:bg-glass-dark hover:bg-glass-light dark:hover:bg-glass-dark px-3 py-1 rounded-lg transition-colors"
            >
              {selectedTasks.length === filteredTasks.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleBulkComplete}
              className="px-3 py-1 bg-gradient-indigo-purple text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Mark Complete
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-gradient-purple-pink text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Delete Selected
            </button>
          </div>
        </GlassCard>
      )}

      {/* Task Count */}
      <div className="text-gray-700 dark:text-gray-300">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No tasks found. Try changing your filters.</p>
        </GlassCard>
      ) : groupBy !== 'none' ? (
        // Grouped view
        (() => {
          // Group tasks based on groupBy value
          const groupedTasks: Record<string, TaskRead[]> = {};

          filteredTasks.forEach(task => {
            let key = '';
            switch (groupBy) {
              case 'status':
                key = task.status;
                break;
              case 'priority':
                key = task.priority;
                break;
              default:
                key = 'ungrouped';
            }

            if (!groupedTasks[key]) {
              groupedTasks[key] = [];
            }
            groupedTasks[key].push(task);
          });

          // Define display names for groups
          const getGroupDisplayName = (key: string) => {
            if (groupBy === 'status') {
              const statusNames: Record<string, string> = {
                'to-do': 'To Do',
                'in-progress': 'In Progress',
                'completed': 'Completed'
              };
              return statusNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
            } else if (groupBy === 'priority') {
              const priorityNames: Record<string, string> = {
                'low': 'Low Priority',
                'medium': 'Medium Priority',
                'high': 'High Priority'
              };
              return priorityNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
            }
            return key;
          };

          return (
            <div className="space-y-6">
              {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => (
                <div key={groupKey} className="space-y-4">
                  <GlassCard className="p-3">
                    <h3 className="font-semibold text-lg bg-gradient-purple-pink bg-clip-text text-transparent">
                      {getGroupDisplayName(groupKey)} ({groupTasks.length})
                    </h3>
                  </GlassCard>
                  <AnimatePresence>
                    <div className="space-y-4 pl-2">
                      {groupTasks.map(task => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onComplete={handleCompleteTask}
                            isSelected={selectedTasks.includes(task.id)}
                            onSelect={handleTaskSelect}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          );
        })()
      ) : (
        // Flat view
        <AnimatePresence>
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TaskCard
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onComplete={handleCompleteTask}
                  isSelected={selectedTasks.includes(task.id)}
                  onSelect={handleTaskSelect}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TaskList;