import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | TaskFlow';
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/tasks/analytics');
        setAnalytics(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="container text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const COLORS = {
    'Todo': '#9ca3af',
    'In Progress': '#4F46E5',
    'Done': '#10b981',
    'Low': '#10b981',
    'Medium': '#f59e0b',
    'High': '#ef4444',
  };

  const statusData = analytics.byStatus.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const priorityData = analytics.byPriority.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Tasks */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analytics.total}</p>
              </div>
              <Zap className="text-indigo-600 dark:text-indigo-400" size={32} />
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analytics.completed}</p>
              </div>
              <CheckCircle2 className="text-green-600 dark:text-green-500" size={32} />
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analytics.pending}</p>
              </div>
              <Clock className="text-yellow-600 dark:text-yellow-500" size={32} />
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overdue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analytics.overdue}</p>
              </div>
              <AlertCircle className="text-red-600 dark:text-red-500" size={32} />
            </div>
          </div>

          {/* Completion Percentage */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completion</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {analytics.completionPercentage}%
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {analytics.completionPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks by Status */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tasks by Status</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#9ca3af'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No data available</p>
            )}
          </div>

          {/* Tasks by Priority */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tasks by Priority</h2>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#4F46E5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
