'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import GradientButton from '../UI/GradientButton';
import { X, Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
  loading?: boolean;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setApiError(null);

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    if (description.trim().length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || null,
      status: 'to-do'
    };

    try {
      await onSubmit(taskData);
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (error: any) {
      console.error('Error submitting task:', error);
      // Handle API error
      if (error.response?.data?.detail) {
        setApiError(error.response.data.detail);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred while creating the task.');
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Task
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-glass dark:hover:bg-glass-dark transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {apiError && (
                  <motion.div
                    className="glass rounded-lg p-4 border border-red-200 dark:border-red-900 mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="text-sm text-red-600 dark:text-red-300">{apiError}</div>
                  </motion.div>
                )}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        // Clear error when user starts typing
                        if (errors.title) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.title;
                            return newErrors;
                          });
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 ${
                        errors.title
                          ? 'bg-red-500/10 border border-red-500'
                          : 'bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark focus:border-transparent'
                      }`}
                      placeholder="Enter task title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        // Clear error when user starts typing
                        if (errors.description) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.description;
                            return newErrors;
                          });
                        }
                      }}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 ${
                        errors.description
                          ? 'bg-red-500/10 border border-red-500'
                          : 'bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark focus:border-transparent'
                      }`}
                      placeholder="Enter task description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full px-3 py-2 bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 bg-glass dark:bg-glass-dark border border-glass dark:border-glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <GradientButton
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleClose}
                  >
                    Cancel
                  </GradientButton>
                  <GradientButton
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={<Plus className="h-4 w-4" />}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Task'}
                  </GradientButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;