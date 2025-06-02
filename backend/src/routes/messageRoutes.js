// backend/src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/private/:recipientId', verifyToken, messageController.getPrivateChat);
router.get('/group', verifyToken, messageController.getGroupChat);

module.exports = router;
