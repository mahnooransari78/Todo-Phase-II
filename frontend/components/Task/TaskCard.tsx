'use client';

import React from 'react';
import { TaskRead } from '../../types/task';

interface TaskCardProps {
  task: TaskRead;
  onEdit?: (task: TaskRead) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onComplete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-do':
        return 'bg-gray-200';
      case 'in-progress':
        return 'bg-yellow-200';
      case 'completed':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-600 text-lg">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ')}
        </span>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div>
          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
          </span>
          {task.due_date && (
            <p className="text-sm text-gray-500 mt-1">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          {!task.status || task.status !== 'completed' ? (
            <button
              onClick={() => onComplete && onComplete(task.id)}
              className="text-green-600 hover:text-green-800"
              aria-label="Complete task"
            >
              ✓
            </button>
          ) : null}

          <button
            onClick={() => onEdit && onEdit(task)}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit task"
          >
            ✏️
          </button>

          <button
            onClick={() => onDelete && onDelete(task.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;