// backend/src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, requireRole(['admin', 'super_admin']), taskController.createTask);
router.get('/', verifyToken, requireRole(['admin', 'super_admin']), taskController.getAllTasks);
router.get('/by-semester', verifyToken, requireRole(['admin', 'super_admin', 'student']), taskController.getTasksBySemester);

router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), taskController.updateTask);
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), taskController.deleteTask);


module.exports = router;
