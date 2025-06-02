// backend/src/routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/institute-info', async (req, res) => {
  // Replace with your actual content
  res.json({
    about: 'We are a tech-focused training institute.',
    services: ['Internship', 'Workshops', 'Certifications'],
    topStudents: await Student.find({}).limit(3).select('name portfolio.github portfolio.linkedin')
  });
});

module.exports = router;
