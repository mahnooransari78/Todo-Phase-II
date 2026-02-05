'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TaskRead } from '../../types/task';
import GlassCard from '../UI/GlassCard';
import { Check, Edit3, Trash2, Clock, Flag, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: TaskRead;
  onEdit?: (task: TaskRead) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onComplete, isSelected = false, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-do':
        return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-400 to-indigo-400';
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-emerald-400';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-500 dark:text-green-400';
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'high':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Flag className="h-4 w-4 text-red-500 dark:text-red-400" />;
      case 'medium':
        return <Flag className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
      case 'low':
        return <Flag className="h-4 w-4 text-green-500 dark:text-green-400" />;
      default:
        return <Flag className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      tabIndex={0}
      onKeyDown={(e) => {
        // Keyboard navigation for task actions
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onComplete) onComplete(task.id);
        }
      }}
    >
      <GlassCard
        className={`p-5 transition-all hover-glass ${task.status === 'completed' ? 'opacity-70' : ''} ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
        tabIndex={-1}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <button
              onClick={() => onSelect && onSelect(task.id)}
              className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isSelected
                  ? 'bg-gradient-purple-pink border-transparent'
                  : 'border-gray-400 dark:border-gray-500 bg-glass dark:bg-glass-dark'
              }`}
              aria-label={isSelected ? "Deselect task" : "Select task"}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect && onSelect(task.id);
                }
              }}
            >
              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg truncate">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
          <div className={`glass px-3 py-1 rounded-full text-white text-xs font-medium ml-3 flex-shrink-0 ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-glass dark:border-glass-dark">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="mr-2 glass p-1.5 rounded-md">
                {getPriorityIcon(task.priority)}
              </div>
              <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
              </span>
            </div>

            {task.due_date && (
              <div className="flex items-center glass p-2 rounded-md">
                <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {!task.status || task.status !== 'completed' ? (
              <button
                onClick={() => onComplete && onComplete(task.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onComplete) onComplete(task.id);
                  }
                }}
                className="p-2 rounded-full bg-gradient-purple-pink hover:opacity-90 text-white transition-all glass hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Complete task"
                tabIndex={0}
              >
                <Check className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => onComplete && onComplete(task.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onComplete) onComplete(task.id);
                  }
                }}
                className="p-2 rounded-full bg-gradient-indigo-purple hover:opacity-90 text-white transition-all glass hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Reopen task"
                tabIndex={0}
              >
                <Circle className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => onEdit && onEdit(task)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onEdit) onEdit(task);
                }
              }}
              className="p-2 rounded-full glass hover:bg-glass-light dark:hover:bg-glass-dark hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Edit task"
              tabIndex={0}
            >
              <Edit3 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={() => onDelete && onDelete(task.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onDelete) onDelete(task.id);
                }
              }}
              className="p-2 rounded-full glass hover:bg-glass-light dark:hover:bg-glass-dark hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Delete task"
              tabIndex={0}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default TaskCard;