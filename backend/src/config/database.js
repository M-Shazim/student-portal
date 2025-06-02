const mongoose = require('mongoose');

// Database connection configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Additional options for production
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // bufferCommands: false, // Disable mongoose buffering
      // bufferMaxEntries: 0 // Disable mongoose buffering
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up indexes for better performance
    await setupIndexes();
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Setup database indexes for optimal performance
const setupIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Students collection indexes
    await db.collection('students').createIndexes([
      { key: { studentId: 1 }, unique: true },
      { key: { email: 1 }, unique: true, sparse: true },
      { key: { category: 1 } },
      { key: { isActive: 1 } },
      { key: { createdAt: -1 } }
    ]);

    // Tasks collection indexes
    await db.collection('tasks').createIndexes([
      { key: { assignedTo: 1 } },
      { key: { assignedToCategory: 1 } },
      { key: { dueDate: 1 } },
      { key: { isActive: 1 } },
      { key: { createdAt: -1 } },
      { key: { assignedTo: 1, dueDate: 1 } } // Compound index for student task queries
    ]);

    // Submissions collection indexes
    await db.collection('submissions').createIndexes([
      { key: { student: 1, task: 1 }, unique: true },
      { key: { task: 1 } },
      { key: { student: 1 } },
      { key: { status: 1 } },
      { key: { submittedAt: -1 } },
      { key: { reviewedAt: -1 } }
    ]);

    // Messages collection indexes
    await db.collection('messages').createIndexes([
      { key: { student: 1, createdAt: -1 } },
      { key: { isRead: 1 } },
      { key: { createdAt: -1 } }
    ]);

    // Blogs collection indexes
    await db.collection('blogs').createIndexes([
      { key: { isPublished: 1, createdAt: -1 } },
      { key: { categories: 1 } },
      { key: { title: 'text', content: 'text' } } // Text search index
    ]);

    // Reports collection indexes
    await db.collection('reports').createIndexes([
      { key: { student: 1 }, unique: true },
      { key: { grade: 1 } },
      { key: { issuedAt: -1 } }
    ]);

    // Portfolios collection indexes
    await db.collection('portfolios').createIndexes([
      { key: { student: 1 }, unique: true },
      { key: { isPublic: 1, category: 1 } },
      { key: { 'performanceMetrics.ranking': 1 } },
      { key: { publishedAt: -1 } },
      { key: { tags: 1 } }
    ]);

    // Admins collection indexes
    await db.collection('admins').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { isActive: 1 } }
    ]);

    console.log('Database indexes created successfully');
    
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;