const bcrypt = require('bcryptjs');
const { Admin } = require('../models');

const seedInitialAdmin = async () => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      // Create initial super admin
      const initialAdmin = new Admin({
        email: process.env.INITIAL_ADMIN_EMAIL || 'admin@codecamp.com',
        password: process.env.INITIAL_ADMIN_PASSWORD || 'admin123',
        name: 'Super Administrator',
        role: 'super_admin',
        permissions: {
          canManageStudents: true,
          canManageTasks: true,
          canManageBlogs: true,
          canGenerateReports: true,
          canManageAdmins: true
        }
      });

      await initialAdmin.save();
      console.log('Initial admin user created successfully');
      console.log(`Email: ${initialAdmin.email}`);
      console.log('Password: Check your environment variables or use default');
    } else {
      console.log('Admin users already exist. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding initial admin:', error);
  }
};

// Sample categories for students
const sampleCategories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'UI/UX Design',
  'Digital Marketing',
  'Cybersecurity'
];

module.exports = {
  seedInitialAdmin,
  sampleCategories
};