import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { debounce } from '../utils/helpers';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [pagination, setPagination] = useState({});

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    document.title = 'Tasks | TaskFlow';
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(
    async (newPage = 1) => {
      try {
        setLoading(true);
        const params = {
          page: newPage,
          limit: 10,
        };

        if (search) params.search = search;
        if (status) params.status = status;
        if (priority) params.priority = priority;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        const response = await api.get('/tasks', { params });
        setTasks(response.data.data.tasks);
        setPagination(response.data.data.pagination);
        setPage(newPage);

        // Update URL params
        const newParams = new URLSearchParams();
        if (search) newParams.set('search', search);
        if (status) newParams.set('status', status);
        if (priority) newParams.set('priority', priority);
        if (sortBy) newParams.set('sortBy', sortBy);
        if (sortOrder !== 'asc') newParams.set('sortOrder', sortOrder);
        if (newPage > 1) newParams.set('page', newPage);
        setSearchParams(newParams);
      } catch (error) {
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    },
    [search, status, priority, sortBy, sortOrder, setSearchParams]
  );

  // Debounced search
  const debouncedFetch = useCallback(
    debounce(() => {
      fetchTasks(1);
    }, 300),
    [fetchTasks]
  );

  useEffect(() => {
    fetchTasks(1);
  }, []);

  useEffect(() => {
    debouncedFetch();
  }, [search, status, priority, sortBy, sortOrder, debouncedFetch]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    try {
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask._id}`, formData);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', formData);
        toast.success('Task created successfully');
      }
      setIsModalOpen(false);
      fetchTasks(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (task) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${task._id}`);
        toast.success('Task deleted successfully');
        fetchTasks(page);
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      await api.patch(`/tasks/${task._id}/complete`);
      toast.success('Task marked as complete');
      fetchTasks(page);
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  const handleAddNote = async (text) => {
    try {
      await api.post(`/tasks/${selectedTask._id}/notes`, { text });
      toast.success('Note added successfully');
      const response = await api.get(`/tasks/${selectedTask._id}/activity`);
      const updatedTask = await api.get(`/tasks`);
      const updated = updatedTask.data.data.tasks.find((t) => t._id === selectedTask._id);
      if (updated) {
        setSelectedTask(updated);
      }
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/tasks/${selectedTask._id}/notes/${noteId}`);
      toast.success('Note deleted successfully');
      const updatedTask = await api.get(`/tasks`);
      const updated = updatedTask.data.data.tasks.find((t) => t._id === selectedTask._id);
      if (updated) {
        setSelectedTask(updated);
      }
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setSortBy('');
    setSortOrder('asc');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <button onClick={handleCreateTask} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={20} />
            New Task
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-field"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="">Sort By</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created Date</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(search || status || priority || sortBy) && (
            <button
              onClick={clearFilters}
              className="w-full md:w-auto flex items-center gap-2 btn-secondary justify-center"
            >
              <X size={18} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-64"></div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No tasks found</p>
            <button
              onClick={handleCreateTask}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create your first task
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onComplete={handleCompleteTask}
                  onViewDetails={handleEditTask}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => fetchTasks(page - 1)}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => fetchTasks(page + 1)}
                  disabled={page === pagination.pages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}
