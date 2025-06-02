import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ Make sure react-router-dom is set up
import './Home.css'; // ✅ import your CSS file

export default function Home() {
  const [info, setInfo] = useState({});
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/public/institute-info')
      .then(res => setInfo(res.data))
      .catch(() => setInfo({}));

    axios.get('/api/blogs')
      .then(res => {
        setBlogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setBlogs([]));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Our Training Portal</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/login-student" style={{ marginRight: '1rem' }}>Student Login</Link>
        <Link to="/login-admin" style={{ marginRight: '1rem' }}>Admin Login</Link>
      </nav>

      <section>
        <h2>About Us</h2>
        <p>{info.about}</p>
      </section>

      <section>
        <h3>Our Services</h3>
        <ul>
          {info.services?.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section>
        <h3>Top Students</h3>
        <ul>
          {info.topStudents?.map((s) => (
            <li key={s._id}>
              {s.name} — 
              <a href={s.portfolio.github} target="_blank" rel="noopener noreferrer"> GitHub</a> | 
              <a href={s.portfolio.linkedin} target="_blank" rel="noopener noreferrer"> LinkedIn</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Our Blog</h3>
        <ul>
          {(Array.isArray(blogs) ? blogs : []).map(b => (
            <li key={b._id}>
              <strong>{b.title}</strong>: {b.categories.join(', ')}
              <p>{b.content.slice(0, 100)}...</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
