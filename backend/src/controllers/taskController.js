// backend/src/controllers/taskController.js
const Task = require('../models/Task');

// Create a task (admin)
exports.createTask = async (req, res) => {
  const { title, description, document, assignedToSemester, deadline } = req.body;
  try {
    const task = await Task.create({ title, description, document, assignedToSemester, deadline });
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Get all tasks (admin)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Get tasks by semester (student)
exports.getTasksBySemester = async (req, res) => {
  const semester = req.query.semester;
  try {
    const tasks = await Task.find({ assignedToSemester: semester });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};


// Update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task updated', task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};

