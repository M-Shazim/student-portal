// backend/src/controllers/submissionController.js
const Submission = require('../models/Submission');

// Submit a task (student)
exports.submitTask = async (req, res) => {
  const { taskId, githubLink } = req.body;
  try {
    // Prevent duplicate submissions
    const exists = await Submission.findOne({ student: req.user.id, task: taskId });
    if (exists) return res.status(400).json({ message: 'Already submitted' });

    const submission = await Submission.create({
      student: req.user.id,
      task: taskId,
      githubLink
    });
    res.status(201).json({ message: 'Submission created', submission });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting task', error: err.message });
  }
};

// backend/src/controllers/submissionController.js
exports.getSubmissions = async (req, res) => {
  try {
    let submissions;

    // If admin, return all submissions, optionally filtered by taskId
    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      const filter = {};
      if (req.query.taskId) {
        filter.task = req.query.taskId;
      }
      submissions = await Submission.find(filter)
        .populate('task')
        .populate('student', '-password'); // exclude sensitive info
    } else {
      // If student, return only their submissions
      submissions = await Submission.find({ student: req.user.id })
        .populate('task');
    }

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions', error: err.message });
  }
};


// Get student's own submissions
exports.getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate('task');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

// Review a student submission
exports.reviewSubmission = async (req, res) => {
  const { id } = req.params;
  const { reviewStatus, feedback } = req.body;
  try {
    const updated = await Submission.findByIdAndUpdate(
      id,
      { reviewStatus, feedback },
      { new: true }
    );
    res.json({ message: 'Review updated', submission: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error reviewing submission' });
  }
};

