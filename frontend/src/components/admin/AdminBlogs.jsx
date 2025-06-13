import { useEffect, useState } from 'react';
import api from '../../axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminBlogs() {
  const { auth } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    categories: '',
    image: '',
    isPublished: true,
  });

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

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: 'sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      color: '#1e293b',
    },
    card: {
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      marginBottom: '2rem',
    },
    label: {
      display: 'block',
      marginTop: '1rem',
      marginBottom: '0.5rem',
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      minHeight: '100px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    button: {
      marginTop: '1.5rem',
      backgroundColor: '#10b981',
      color: '#fff',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
    },
    blogItem: {
      border: '1px solid #e5e7eb',
      padding: '1rem',
      borderRadius: '10px',
      marginBottom: '1rem',
      backgroundColor: '#fff',
    },
    blogTitle: {
      fontWeight: '600',
      fontSize: '1.1rem',
      color: '#111827',
    },
    blogMeta: {
      fontSize: '0.9rem',
      color: '#4b5563',
    },
    deleteBtn: {
      marginTop: '0.75rem',
      backgroundColor: '#ef4444',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Blog Management</h2>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '1rem' }}>Create Blog</h3>
        <form onSubmit={handleCreate}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            placeholder="Title"
            required
            style={styles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label style={styles.label}>Content</label>
          <textarea
            placeholder="Content"
            style={styles.textarea}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <label style={styles.label}>Categories (comma separated)</label>
          <input
            type="text"
            placeholder="Categories"
            style={styles.input}
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
          />

          <label style={styles.label}>Image URL (optional)</label>
          <input
            type="text"
            placeholder="Image URL"
            style={styles.input}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            <label>Published</label>
          </div>

          <button type="submit" style={styles.button}>Publish</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '1rem' }}>All Blogs</h3>
        {Array.isArray(blogs) && blogs.length > 0 ? (
          blogs.map((b) => (
            <div key={b._id} style={styles.blogItem}>
              <div style={styles.blogTitle}>{b.title}</div>
              <div style={styles.blogMeta}>
                Categories: {Array.isArray(b.categories) ? b.categories.join(', ') : 'None'}<br />
                Status: {b.isPublished ? '✅ Published' : '❌ Unpublished'}
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(b._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </div>
  );
}
