// backend/src/controllers/messageController.js
const Message = require('../models/Message');

exports.getPrivateChat = async (req, res) => {
  console.log('Authenticated User:', req.user);

  const { recipientId } = req.params;

  try {
    const messages = await Message.find({
  $or: [
    { sender: req.user.id, recipient: recipientId },
    { sender: recipientId, recipient: req.user.id }
  ]
})
.sort({ createdAt: 1 })
.populate('sender', 'name email')       // dynamic ref works here automatically
.populate('recipient', 'name email');   // dynamic ref works here automatically

    // Mongoose will use recipientModel automatically

    // Debug log to verify populated sender objects
    messages.forEach(msg => {
      console.log("Sender:", msg.sender);
      console.log("Recipient:", msg.recipient);
    });

    console.log('Recipient ID:', recipientId);
    res.json(messages);
  } catch (err) {
    console.error('Chat fetch error:', err);
    res.status(500).json({ message: 'Error fetching private chat', error: err.message });
  }
};


exports.getGroupChat = async (req, res) => {
  try {
    const messages = await Message.find({ isGroup: true }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group chat', error: err.message });
  }
};
