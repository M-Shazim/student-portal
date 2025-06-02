// backend/src/app.js (or index.js)
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// import dotenv from 'dotenv';
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const Message = require('./models/Message');


console.log('JWT_SECRET:', process.env.JWT_SECRET);

// After dotenv.config()
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blogs', blogRoutes);

const publicRoutes = require('./routes/publicRoutes');
app.use('/api/public', publicRoutes);


const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', ({ userId }) => {
    socket.join(userId);
  });

socket.on('send_message', async (data) => {
  console.log('send_message data:', data);
  const { senderId, senderModel, recipientId, message, isGroup } = data;

  // Check if recipientId is defined when isGroup is false
  if (!isGroup && !recipientId) {
    console.error('recipientId is missing for private message');
    return;
  }

  try {
    const newMessage = await Message.create({
      sender: senderId,
      senderModel,
      recipient: isGroup ? null : recipientId,
      message,
      isGroup
    });
  
    if (isGroup) {
      io.emit('receive_group_message', newMessage);
    } else {
      io.to(recipientId).emit('receive_private_message', newMessage);
    }
  } catch (error) {
    console.error('Error saving message:', error);
  }
});

});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
