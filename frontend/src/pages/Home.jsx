import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';

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
    <div className="home-container" style={{width: '100%', minHeight: '100vh'}}>
      {/* Header Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our Training Portal</h1>
          <p className="hero-subtitle">Empowering students through innovative education and comprehensive training programs</p>
          
          {/* Navigation Cards */}
          <div className="login-cards">
            <Link to="/login-student" className="login-card student-card">
              <div className="card-icon">🎓</div>
              <h3>Student Portal</h3>
              <p>Access your courses, assignments, and progress</p>
              <span className="card-arrow">→</span>
            </Link>
            
            <Link to="/login-admin" className="login-card admin-card">
              <div className="card-icon">⚙️</div>
              <h3>Admin Portal</h3>
              <p>Manage students, courses, and system settings</p>
              <span className="card-arrow">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* About Section */}
        <section className="content-section about-section">
          <div className="section-header">
            <h2>About Our Institution</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-content">
            <p className="about-text">{info.about || "We are committed to providing excellence in education and training."}</p>
          </div>
        </section>

        {/* Services Section */}
        <section className="content-section services-section">
          <div className="section-header">
            <h2>Our Services</h2>
            <div className="section-divider"></div>
          </div>
          <div className="services-grid">
            {info.services?.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">📚</div>
                <h4>{service}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Top Students Section */}
        <section className="content-section students-section">
          <div className="section-header">
            <h2>Top Performing Students</h2>
            <div className="section-divider"></div>
          </div>
          <div className="students-grid">
            {info.topStudents?.map((student) => (
              <div key={student._id} className="student-card">
                <div className="student-avatar">
                  <span>{student.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <div className="student-links">
                    <a 
                      href={student.portfolio.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="portfolio-link github"
                    >
                      GitHub
                    </a>
                    <a 
                      href={student.portfolio.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="portfolio-link linkedin"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section className="content-section blog-section">
          <div className="section-header">
            <h2>Latest from Our Blog</h2>
            <div className="section-divider"></div>
          </div>
          <div className="blog-grid">
            {(Array.isArray(blogs) ? blogs : []).map(blog => (
              <article key={blog._id} className="blog-card">
                <div className="blog-header">
                  <h3>{blog.title}</h3>
                  <div className="blog-categories">
                    {blog.categories.map((category, index) => (
                      <span key={index} className="category-tag">{category}</span>
                    ))}
                  </div>
                </div>
                <p className="blog-excerpt">{blog.content.slice(0, 120)}...</p>
                <div className="blog-footer">
                  <span className="read-more">Read More →</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Training Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}