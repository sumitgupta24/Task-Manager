import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/helpers';
import { X, Plus, Trash2 } from 'lucide-react';
import formatDateForInput from '../utils/dateFormatter';

export default function TaskModal({ task, isOpen, onClose, onSave, onAddNote, onDeleteNote }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
  });
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Todo',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? formatDateForInput(task.dueDate) : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        dueDate: '',
      });
    }
    setNoteText('');
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText);
      setNoteText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title..."
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task description..."
                rows="3"
                className="input-field resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Notes Section */}
          {task && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Notes
              </h3>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  className="input-field flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNote();
                    }
                  }}
                />
                <button
                  onClick={handleAddNote}
                  className="btn-primary px-4"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {task.notes && task.notes.length > 0 ? (
                  task.notes.map((note, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-gray-800 dark:text-gray-200">{note.text}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(note.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteNote(note._id)}
                        className="p-1 hover:bg-red-500 hover:text-white rounded transition ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No notes yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
