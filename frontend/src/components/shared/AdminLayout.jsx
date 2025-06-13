import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <header
        style={{
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Admin Panel</h2>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...navLinkStyle,
                backgroundColor: isActive ? '#334155' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

const navLinks = [
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/tasks', label: 'Tasks' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/blogs', label: 'Blogs' },
];

const navLinkStyle = {
  color: '#e2e8f0',
  textDecoration: 'none',
  fontWeight: '500',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  display: 'inline-block',
};

