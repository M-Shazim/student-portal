// backend/src/controllers/blogController.js
const Blog = require('../models/Blog');

// Create blog post
exports.createBlog = async (req, res) => {
  const { title, content, categories, image, isPublished } = req.body;
  try {
    const blog = await Blog.create({ title, content, categories, image,  isPublished });
    res.status(201).json({ message: 'Blog created', blog });
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog', error: err.message });
  }
};

// Get all published blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || !blog.isPublished) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Blog updated', blog: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};
