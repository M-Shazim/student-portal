// backend/src/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // fallback if no file
  document: { type: String }, // optional: stores filename or cloud URL
  assignedToSemester: { type: String, required: true }, // e.g. "Fall 2025"
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  isExpired: { type: Boolean, default: false } // auto-set via backend cron or task checker
});

module.exports = mongoose.model('Task', taskSchema);
