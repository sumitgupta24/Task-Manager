import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Built by <span className="font-semibold text-gray-900 dark:text-white">Sumit Gupta</span> · {currentYear}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            TaskFlow — Task Management System
          </div>
        </div>
      </div>
    </footer>
  );
}
