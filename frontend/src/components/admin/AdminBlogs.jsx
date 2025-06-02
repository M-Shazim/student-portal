import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../axios'; 

import { useAuth } from '../../context/AuthContext';

export default function AdminBlogs() {
  const { auth } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', categories: '', image: '', isPublished: true });

const fetchBlogs = async () => {
  const res = await api.get('/blogs', {
    headers: { Authorization: `Bearer ${auth.token}` },
  });
  setBlogs(res.data);
};


  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      categories: form.categories.split(',').map((cat) => cat.trim()),
    };
await api.post('/blogs', payload, {
  headers: { Authorization: `Bearer ${auth.token}` },
});

    setForm({ title: '', content: '', categories: '', image: '', isPublished: true });
    fetchBlogs();
  };

  const handleDelete = async (id) => {
await api.delete(`/blogs/${id}`, {
  headers: { Authorization: `Bearer ${auth.token}` },
});

    fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2>Blog Management</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
        <h3>Create Blog</h3>
        <input type="text" placeholder="Title" required value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <br />
        <textarea placeholder="Content" value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <br />
        <input type="text" placeholder="Categories (comma separated)" value={form.categories}
          onChange={(e) => setForm({ ...form, categories: e.target.value })} />
        <br />
        <input type="text" placeholder="Image URL (optional)" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <br />
        <label>
          Published:
          <input type="checkbox" checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
        </label>
        <br />
        <button type="submit">Publish</button>
      </form>

      <h3>All Blogs</h3>
      <ul>
{Array.isArray(blogs) && blogs.length > 0 ? (
  blogs.map((b) => (
    <li key={b._id}>
      <strong>{b.title}</strong> — {Array.isArray(b.categories) ? b.categories.join(', ') : ''} — {b.isPublished ? '✅' : '❌'}
      <br />
      <button onClick={() => handleDelete(b._id)}>Delete</button>
    </li>
  ))
) : (
  <li>No blogs found</li>
)}

      </ul>
    </div>
  );
}
