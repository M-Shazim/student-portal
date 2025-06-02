// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/student-login
router.post('/student-login', authController.studentLogin);

// POST /api/auth/admin-login
router.post('/admin-login', authController.adminLogin);

module.exports = router;
