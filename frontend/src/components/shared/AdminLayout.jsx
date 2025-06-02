import { Link, Outlet } from 'react-router-dom';
// import './adminLayout.css'; // optional styles

export default function AdminLayout() {
  return (
    <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: '220px',
          background: '#2c3e50',
          color: '#fff',
          padding: '1rem',
        }}
      >
        <h2 style={{ marginBottom: '2rem' }}>Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/admin/students" style={{ color: '#ecf0f1' }}>Students</Link>
          <Link to="/admin/tasks" style={{ color: '#ecf0f1' }}>Tasks</Link>
          <Link to="/admin/reports" style={{ color: '#ecf0f1' }}>Reports</Link>
          <Link to="/admin/messages" style={{ color: '#ecf0f1' }}>Messages</Link>
          <Link to="/admin/blogs" style={{ color: '#ecf0f1' }}>Blogs</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
