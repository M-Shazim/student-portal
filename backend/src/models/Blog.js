// backend/src/models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // can be HTML or rich text
  categories: [{ type: String }], // max 3–4 per post
  image: { type: String }, // optional: URL or filename
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Blog', blogSchema);
