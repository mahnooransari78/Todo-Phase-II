import React from 'react';
import { TaskRead } from '../../types/task';
import GlassCard from '../UI/GlassCard';

interface TaskStatsProps {
  tasks: TaskRead[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'to-do').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    return new Date(task.due_date) < new Date() && task.status !== 'completed';
  }).length;

  // Calculate percentages
  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-purple-500">{totalTasks}</div>
        <div className="text-gray-600 dark:text-gray-300">Total Tasks</div>
      </GlassCard>

      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
        <div className="text-gray-600 dark:text-gray-300">Completed</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {completedPercentage}% done
        </div>
      </GlassCard>

      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-yellow-500">{todoTasks}</div>
        <div className="text-gray-600 dark:text-gray-300">To Do</div>
      </GlassCard>

      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-blue-500">{inProgressTasks}</div>
        <div className="text-gray-600 dark:text-gray-300">In Progress</div>
      </GlassCard>

      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-red-500">{highPriorityTasks}</div>
        <div className="text-gray-600 dark:text-gray-300">High Priority</div>
      </GlassCard>

      <GlassCard className="p-4 text-center">
        <div className="text-2xl font-bold text-orange-500">{overdueTasks}</div>
        <div className="text-gray-600 dark:text-gray-300">Overdue</div>
      </GlassCard>
    </div>
  );
};

export default TaskStats;