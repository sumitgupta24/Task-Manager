import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getTaskActivity,
  getTaskAnalytics,
  getOverdueTasks,
  addTaskNote,
  deleteTaskNote,
} from '../controllers/taskController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Analytics routes
router.get('/analytics', getTaskAnalytics);
router.get('/overdue', getOverdueTasks);

// Task CRUD routes
router.get('/', getTasks);
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required'),
  ],
  createTask
);

router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Task status routes
router.patch('/:id/complete', completeTask);
router.get('/:id/activity', getTaskActivity);

// Task notes routes
router.post('/:id/notes', addTaskNote);
router.delete('/:id/notes/:noteId', deleteTaskNote);

export default router;
