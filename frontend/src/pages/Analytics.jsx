import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container text-center py-12">
          <p className="text-gray-500">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const COLORS = {
    'Todo': '#9ca3af',
    'In Progress': '#3b82f6',
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

  const completionData = [
    {
      name: 'Completed',
      value: analytics.completed,
      percentage: analytics.completionPercentage,
    },
    {
      name: 'Pending',
      value: analytics.pending,
      percentage: 100 - analytics.completionPercentage,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">Analytics</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-blue-600">{analytics.total}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{analytics.completed}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{analytics.pending}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Completion Rate</p>
            <p className="text-3xl font-bold text-purple-600">{analytics.completionPercentage}%</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Status Distribution</h2>
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
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>

          {/* Priority Distribution */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Priority Distribution</h2>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No data available</p>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Completion Status */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Completion Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percentage }) => `${name}: ${value} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Table */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{analytics.total}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Completed Tasks</span>
                <span className="text-2xl font-bold text-green-600">{analytics.completed}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Pending Tasks</span>
                <span className="text-2xl font-bold text-yellow-600">{analytics.pending}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Overdue Tasks</span>
                <span className="text-2xl font-bold text-red-600">{analytics.overdue}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                <span className="text-2xl font-bold text-blue-600">{analytics.completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
