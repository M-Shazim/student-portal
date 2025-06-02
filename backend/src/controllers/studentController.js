// backend/src/controllers/studentController.js
const Student = require('../models/Student');
const bcrypt = require('bcrypt');

// const csv = require('csv-parser');
// const fs = require('fs');

exports.bulkUploadStudents = async (req, res) => {
  const filePath = req.file.path;
  const students = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      students.push(row);
    })
    .on('end', async () => {
      try {
        for (let entry of students) {
          const { name, email, password, semester, github, linkedin } = entry;
          const hashed = await bcrypt.hash(password, 10);
          await Student.create({
            name,
            email,
            password: hashed,
            semester,
            portfolio: {
              github,
              linkedin,
              isPublic: false
            }
          });
        }
        res.status(201).json({ message: 'Students uploaded successfully', count: students.length });
      } catch (err) {
        res.status(500).json({ message: 'Bulk upload failed', error: err.message });
      }
    });
};


// Create a new student manually
exports.createStudent = async (req, res) => {
  const { name, email, password, semester, github, linkedin } = req.body;

  console.log('Creating student with:', req.body); // 🔍 log incoming data

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const studentId = `SID${Date.now()}`;

    const student = new Student({
      studentId, 
      name,
      email,
      password: hashed,
      semester,
      portfolio: {
        github,
        linkedin,
        isPublic: false,
      }
    });

    await student.save();

    res.status(201).json({ message: 'Student created', student });
  } catch (err) {
    console.error('❌ Error in createStudent:', err); // Full stack trace
    res.status(500).json({ message: 'Error creating student', error: err.message });
  }
};


// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    console.log('Fetched students:', students); // debug log
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};


// Update student info

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  try {
    if (updateData.password) {
      // Hash the new password before updating
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const student = await Student.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Student updated', student });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Error updating student' });
  }
};


// Delete student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student' });
  }
};

const csv = require('csv-parser');
const fs = require('fs');

exports.bulkUploadStudents = async (req, res) => {
  const filePath = req.file.path;
  const students = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      students.push(row);
    })
    .on('end', async () => {
      try {
        for (let entry of students) {
          const { name, email, password, semester, github, linkedin } = entry;
          const hashed = await bcrypt.hash(password, 10);
          await Student.create({
            name,
            email,
            password: hashed,
            semester,
            portfolio: {
              github,
              linkedin,
              isPublic: false
            }
          });
        }
        res.status(201).json({ message: 'Students uploaded successfully', count: students.length });
      } catch (err) {
        res.status(500).json({ message: 'Bulk upload failed', error: err.message });
      }
    });
};

