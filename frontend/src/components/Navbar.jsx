import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Moon, Sun, LogOut, CheckCircle2 } from 'lucide-react';

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

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <CheckCircle2 size={28} />
            TaskManager
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Tasks
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Analytics
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 btn-danger px-3 py-2 text-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/"
              className="block text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Tasks
            </Link>
            <Link
              to="/dashboard"
              className="block text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="block text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Analytics
            </Link>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">{user?.name}</p>
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
