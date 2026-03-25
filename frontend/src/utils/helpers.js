export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isOverdue = (dueDate, status) => {
  if (status === 'Done' || !dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const isDueToday = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  return (
    due.getDate() === today.getDate() &&
    due.getMonth() === today.getMonth() &&
    due.getFullYear() === today.getFullYear()
  );
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
    case 'Medium':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100';
    case 'Low':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Done':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
    case 'In Progress':
      return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100';
    case 'Todo':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100';
  }
};
