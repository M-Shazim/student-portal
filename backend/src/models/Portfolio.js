// backend/src/models/Portfolio.js
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
  github: { type: String },
  linkedin: { type: String },
  isPublic: { type: Boolean, default: false },
  approvedByAdmin: { type: Boolean, default: false },
  approvedAt: { type: Date }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
