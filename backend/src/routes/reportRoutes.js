// backend/src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, requireRole(['admin', 'super_admin', 'student']), reportController.generateReport);
router.get('/', verifyToken, requireRole(['admin', 'super_admin', 'student']), reportController.getAllReports);
router.get('/certificate/:file', reportController.downloadCertificate);
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), reportController.deleteReport);


module.exports = router;
