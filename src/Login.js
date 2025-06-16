import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    const endpoint = role === 'user'
      ? 'https://mds-backend-zlp1.onrender.com/api/users/login'
      : 'https://mds-backend-zlp1.onrender.com/api/ngos/login';

    setLoading(true);

    try {
      const res = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const token = res.data?.token || 'mock-token';
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', role);

        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate(role === 'ngo' ? '/medicines1' : '/Home');
        }, 1000);
      } else {
        toast.error('Invalid login credentials.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-content">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your account to continue</p>
            </div>

            <div className="role-selector-container">
              <label className="role-label">Login as:</label>
              <div className="role-tabs">
                <button
                  type="button"
                  className={`role-tab ${role === 'user' ? 'active' : ''}`}
                  onClick={() => setRole('user')}
                >
                  👤 User
                </button>
                <button
                  type="button"
                  className={`role-tab ${role === 'ngo' ? 'active' : ''}`}
                  onClick={() => setRole('ngo')}
                >
                  🏢 NGO
                </button>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account? 
                <Link to="/register" className="auth-link">Create one here</Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <h3>Medicine Distribution System</h3>
            <p>Connecting people with essential medicines through trusted NGO partners. Join our platform to make healthcare accessible for everyone.</p>
            
            <div className="features">
              <div className="feature">
                <span className="feature-icon">🏥</span>
                <span>Access Essential Medicines</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🤝</span>
                <span>Trusted NGO Network</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Quick Application Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="professional-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a></p>
            <p>📞 <a href="tel:+919686117020">+91 9686117020</a></p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <p>🔗 <a href="https://www.linkedin.com/in/mohammedasim-bage-4290b22a9" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
            <p>📸 <a href="https://www.instagram.com/mdasimb_18" target="_blank" rel="noopener noreferrer">Instagram</a></p>
          </div>
          <div className="footer-section">
            <h4>Medicine Distribution System</h4>
            <p>Connecting people with essential medicines through trusted NGO partners</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Medicine Distribution System. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Login;