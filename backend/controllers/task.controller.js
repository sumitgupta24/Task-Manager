import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Task from '../models/task.model.js';
import TaskActivity from '../models/taskActivity.model.js';

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, sortOrder = 'asc', page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { user: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Build sort object
    let sortObj = {};
    if (sortBy) {
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortObj['createdAt'] = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch tasks
    const tasks = await Task.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id,
    });

    // Log activity
    await TaskActivity.create({
      task: task._id,
      user: req.user.id,
      action: 'created',
      changedFields: { title, status, priority },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;
    const changedFields = {};

    if (title !== undefined && title !== task.title) changedFields.title = title;
    if (description !== undefined && description !== task.description) changedFields.description = description;
    if (status !== undefined && status !== task.status) changedFields.status = status;
    if (priority !== undefined && priority !== task.priority) changedFields.priority = priority;
    if (dueDate !== undefined && new Date(dueDate).toString() !== new Date(task.dueDate).toString()) changedFields.dueDate = dueDate;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Log activity only if fields changed
    if (Object.keys(changedFields).length > 0) {
      await TaskActivity.create({
        task: task._id,
        user: req.user.id,
        action: 'updated',
        changedFields,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Log activity
    await TaskActivity.create({
      task: req.params.id,
      user: req.user.id,
      action: 'deleted',
      changedFields: { title: task.title },
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    const oldStatus = task.status;
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'Done' },
      { new: true }
    );

    // Log activity
    await TaskActivity.create({
      task: task._id,
      user: req.user.id,
      action: 'status_changed',
      changedFields: { status: `${oldStatus} -> Done` },
    });

    res.status(200).json({
      success: true,
      message: 'Task marked as complete',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify task ownership
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task',
      });
    }

    const activities = await TaskActivity.find({ task: id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Task activity retrieved successfully',
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get total tasks
    const total = await Task.countDocuments({ user: userId });

    // Get tasks by status
    const byStatus = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get tasks by priority
    const byPriority = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Get overdue tasks
    const now = new Date();
    const overdue = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: now },
      status: { $ne: 'Done' },
    });

    // Get due today tasks
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dueToday = await Task.countDocuments({
      user: userId,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'Done' },
    });

    // Calculate completion percentage
    const completed = await Task.countDocuments({
      user: userId,
      status: 'Done',
    });

    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data: {
        total,
        completed,
        pending: total - completed,
        completionPercentage,
        overdue,
        dueToday,
        byStatus,
        byPriority,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOverdueTasks = async (req, res, next) => {
  try {
    const now = new Date();
    const tasks = await Task.find({
      user: req.user.id,
      dueDate: { $lt: now },
      status: { $ne: 'Done' },
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      message: 'Overdue tasks retrieved successfully',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const addTaskNote = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Note text is required',
      });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this task',
      });
    }

    task.notes.push({ text, createdAt: new Date() });
    task = await task.save();

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskNote = async (req, res, next) => {
  try {
    const { id, noteId } = req.params;

    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete notes from this task',
      });
    }

    task.notes = task.notes.filter((note) => note._id.toString() !== noteId);
    task = await task.save();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
