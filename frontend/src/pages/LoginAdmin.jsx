import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../axios';
import './LoginAdmin.css';

export default function LoginAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/admin-login', form);
      login({ token: res.data.token, user: res.data.admin, role: 'admin' });
      navigate('/admin/students');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-icon">⚙️</div>
            <h1>Admin Portal</h1>
            <p>Manage your institution with powerful administrative tools</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Student Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Analytics & Reports</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎓</span>
                <span>Course Administration</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📝</span>
                <span>Content Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-container">
            {/* Header */}
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your administrator account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`login-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="form-footer">
              <Link to="/" className="back-link">
                ← Back to Home
              </Link>
              <Link to="/login-student" className="switch-link">
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}