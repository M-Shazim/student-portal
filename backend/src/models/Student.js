// backend/src/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  semester: { type: String, required: true }, // e.g. "Fall 2025"
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  portfolio: {
    github: { type: String },
    linkedin: { type: String },
    isPublic: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
