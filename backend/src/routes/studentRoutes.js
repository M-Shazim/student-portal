// backend/src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const studentController = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


const upload = multer({ storage: storage });

router.post('/bulk-upload', upload.single('file'), studentController.bulkUploadStudents);


// Admin-only access
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), studentController.createStudent);
router.get('/', verifyToken, requireRole(['admin', 'super_admin']), studentController.getAllStudents);
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), studentController.updateStudent);
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), studentController.deleteStudent);

const csvUpload = require('../middlewares/uploadMiddleware');
router.post(
  '/upload',
  verifyToken,
  requireRole('admin'),
  csvUpload.single('file'),
  studentController.bulkUploadStudents
);


module.exports = router;
