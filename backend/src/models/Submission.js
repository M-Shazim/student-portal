// backend/src/models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  githubLink: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  reviewStatus: {
    type: String,
    enum: ['Pending', 'Satisfied', 'Unsatisfied', 'Try Again'],
    default: 'Pending'
  },
  feedback: { type: String } // optional comments by admin
});

module.exports = mongoose.model('Submission', submissionSchema);
