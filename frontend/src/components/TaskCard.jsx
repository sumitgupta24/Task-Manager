import React, { useState, useEffect } from 'react';
import { getPriorityColor, getStatusColor, formatDate, isOverdue, isDueToday } from '../utils/helpers';
import { Trash2, Edit, Check, Clock, AlertCircle, FileText } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onComplete, onViewDetails }) {
  const isOverdueTask = isOverdue(task.dueDate, task.status);
  const isDueTodayTask = isDueToday(task.dueDate);

  return (
    <div className={`card border-l-4 ${
      isOverdueTask ? 'border-red-500' : task.priority === 'High' ? 'border-orange-500' : 'border-indigo-500'
    } hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{task.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{task.description}</p>
        </div>
        <button
          onClick={() => onViewDetails(task)}
          className="flex-shrink-0 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition p-1"
          title="View details"
        >
          <FileText size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        {isOverdueTask && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 flex items-center gap-1">
            <AlertCircle size={14} />
            Overdue
          </span>
        )}
        {isDueTodayTask && !isOverdueTask && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 flex items-center gap-1">
            <Clock size={14} />
            Due Today
          </span>
        )}
      </div>

      {task.dueDate && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Due: {formatDate(task.dueDate)}
        </p>
      )}

      <div className="flex gap-2">
        {task.status !== 'Done' && (
          <button
            onClick={() => onComplete(task)}
            className="flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition text-sm font-medium"
            title="Mark as complete"
          >
            <Check size={16} />
            <span className="hidden sm:inline">Complete</span>
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          className="flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg transition text-sm font-medium"
          title="Edit task"
        >
          <Edit size={16} />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button
          onClick={() => onDelete(task)}
          className="flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition text-sm font-medium"
          title="Delete task"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}
