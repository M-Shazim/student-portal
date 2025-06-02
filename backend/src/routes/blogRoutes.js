// backend/src/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Public
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Admin-only
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), blogController.createBlog);
router.put('/:id', verifyToken,requireRole(['admin', 'super_admin']), blogController.updateBlog);
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), blogController.deleteBlog);

module.exports = router;
