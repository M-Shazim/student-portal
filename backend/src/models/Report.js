// backend/src/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: String, required: true }, // e.g., "Web Development Internship"
  totalTasks: { type: Number, required: true },
  completedTasks: { type: Number, required: true },
  grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: true },
  performanceRemarks: { type: String },
  certificateUrl: { type: String }, // URL to generated PDF (local or cloud)
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
