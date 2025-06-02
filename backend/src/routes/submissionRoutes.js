// backend/src/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, requireRole(['admin', 'super_admin', 'student']), submissionController.submitTask);
// router.get('/', verifyToken, requireRole(['admin', 'super_admin', 'student']), submissionController.getStudentSubmissions);
router.get('/', verifyToken, requireRole(['admin', 'super_admin', 'student']), submissionController.getSubmissions);

router.put('/:id/review', verifyToken, requireRole(['admin', 'super_admin']), submissionController.reviewSubmission);


module.exports = router;
