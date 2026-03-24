import React, { useState, useEffect } from 'react';
import { getPriorityColor, getStatusColor, formatDate, isOverdue, isDueToday } from '../utils/helpers';
import { Trash2, Edit, Check, Clock, AlertCircle, FileText } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onComplete, onViewDetails }) {
  const isOverdueTask = isOverdue(task.dueDate, task.status);
  const isDueTodayTask = isDueToday(task.dueDate);

  return (
    <div className={`card border-l-4 ${
      isOverdueTask ? 'border-red-500' : task.priority === 'High' ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{task.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{task.description}</p>
        </div>
        <button
          onClick={() => onViewDetails(task)}
          className="ml-4 text-gray-500 hover:text-blue-600 transition"
        >
          <FileText size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        {isOverdueTask && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="inline mr-1" size={14} />
            Overdue
          </span>
        )}
        {isDueTodayTask && !isOverdueTask && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="inline mr-1" size={14} />
            Due Today
          </span>
        )}
      </div>

      {task.dueDate && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Due: {formatDate(task.dueDate)}
        </p>
      )}

      <div className="flex gap-2">
        {task.status !== 'Done' && (
          <button
            onClick={() => onComplete(task)}
            className="flex items-center gap-1 flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm"
          >
            <Check size={16} />
            Complete
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm"
        >
          <Edit className="inline mr-1" size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm"
        >
          <Trash2 className="inline mr-1" size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
