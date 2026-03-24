import mongoose from 'mongoose';

const taskActivitySchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['created', 'updated', 'status_changed', 'priority_changed', 'deleted'],
      required: true,
    },
    changedFields: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

taskActivitySchema.index({ task: 1 });
taskActivitySchema.index({ user: 1 });

export default mongoose.model('TaskActivity', taskActivitySchema);
