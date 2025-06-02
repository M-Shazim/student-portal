import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin.js';

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

const hashed = await bcrypt.hash('admin123', 10);

const admin = await Admin.create({
  name: 'Admin User',
  email: 'admin@example.com',
  password: hashed
});

console.log('✅ Admin created:', admin.email);
process.exit();
