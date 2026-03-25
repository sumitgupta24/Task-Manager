import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('dark') === 'true');

  const toggleTheme = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    localStorage.setItem('dark', newDarkState);

    if (newDarkState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'SG';
    const parts = name.split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  };

  const initials = getInitials(user?.name || 'Sumit Gupta');

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-bold">
              ✓
            </span>
            TaskFlow
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm"
            >
              Tasks
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm"
            >
              Analytics
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-semibold text-sm">
                  {initials}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{user?.name || 'Sumit Gupta'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 btn-danger px-3 py-2 text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {isOpen ? (
                <X size={24} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link
              to="/"
              className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Tasks
            </Link>
            <Link
              to="/dashboard"
              className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Analytics
            </Link>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-semibold">
                  {initials}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{user?.name || 'Sumit Gupta'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 btn-danger"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
