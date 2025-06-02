// backend/src/models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  name: { type: String }
});

module.exports = mongoose.model('Admin', adminSchema);
