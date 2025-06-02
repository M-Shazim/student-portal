// backend/utils/expireTasks.js
const mongoose = require('mongoose');
const Task = require('../models/Task');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const now = new Date();
  await Task.updateMany({ deadline: { $lt: now }, isExpired: false }, { isExpired: true });
  console.log('Expired tasks marked.');
  mongoose.disconnect();
});
