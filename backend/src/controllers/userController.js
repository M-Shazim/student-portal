// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');

const getAdminUser = asyncHandler(async (req, res) => {
  const adminId = process.env.ADMIN_ID;

  if (!adminId) {
    res.status(500);
    throw new Error('ADMIN_ID not set in environment variables');
  }

  res.json({ _id: adminId });
});
