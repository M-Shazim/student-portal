// backend/src/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true
  },
  senderModel: {
    type: String,
    enum: ['Admin', 'Student'],
    required: true
  },
  message: { type: String, required: true },
  isGroup: { type: Boolean, default: false }, // true for group chat
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: function () {
      return !this.isGroup;
    }
  },
  recipientModel: {
  type: String,
  enum: ['Admin', 'Student']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
