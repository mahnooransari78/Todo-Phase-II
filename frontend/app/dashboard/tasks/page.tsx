'use client';

import React, { useState } from 'react';
import TaskList from '../../../components/Task/TaskList';
import TaskStats from '../../../components/Task/TaskStats';
import { TaskCreate } from '../../../types/task';
import apiClient from '../../../lib/api';
import GlassCard from '../../../components/UI/GlassCard';
import GradientButton from '../../../components/UI/GradientButton';
import AddTaskModal from '../../../components/Task/AddTaskModal';
import FAB from '../../../components/UI/FAB';
import { Plus, Calendar, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TasksPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTask = async (taskData: TaskCreate) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.createTask(taskData);
      setShowModal(false);
      // Refresh the task list by triggering the TaskList component to reload
      // We'll let the TaskList component handle its own state update
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const [tasks, setTasks] = useState<any[]>([]);

  const handleTasksChange = (newTasks: any[]) => {
    setTasks(newTasks);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-purple-pink p-2 rounded-lg mr-4">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">
              My Tasks
            </h1>
          </div>

          <GradientButton
            variant="primary"
            size="md"
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Task
          </GradientButton>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="glass rounded-lg p-4 border border-red-200 dark:border-red-900 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm text-red-600 dark:text-red-300">{error}</div>
        </motion.div>
      )}

      {/* Task Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TaskStats tasks={tasks} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="p-8 text-center cursor-pointer hover-glass transition-all" onClick={() => setShowModal(true)}>
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-purple-pink p-3 rounded-full">
              <Plus className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Add your first task</h3>
          <p className="text-gray-600 dark:text-gray-400">Click here or use the + button to create a new task</p>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center mb-6">
          <div className="bg-gradient-indigo-purple p-2 rounded-lg mr-3">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Task List</h2>
        </div>
        <TaskList onTasksChange={handleTasksChange} />
      </motion.div>

      {/* Floating Action Button */}
      <FAB onClick={() => setShowModal(true)} />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTask}
        loading={loading}
      />
    </div>
  );
}