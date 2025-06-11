import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      role === 'user'
        ? 'http://localhost:8080/api/users/login'
        : 'http://localhost:8080/api/ngos/login';

    const payload = {
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;

      if (data) {
        localStorage.setItem(
          role === 'user' ? 'userToken' : 'ngoToken',
          data.token || 'mock-token'
        );
        if (role === 'ngo') {
        navigate('/PendingDonations');
      } else {
        navigate('/Home');
      }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="auth-container">
      <h2 color="Dark Blue">Login</h2>

      <div className="form-group">
  <label>Login as:</label>
  <select value={role} onChange={(e) => setRole(e.target.value)}>
    <option value="user">User</option>
    <option value="ngo">NGO</option>
  </select>
</div>


      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>

      <footer className="home-footer">
        <p>
          📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a> | 
          📞 <a href="tel:+919686117020">+91 9686117020</a> | 
          🔗 <a href="https://www.linkedin.com/in/mohammedasim-bage-4290b22a9" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
          📸 <a href="https://www.instagram.com/mdasimb_18" target="_blank" rel="noopener noreferrer">Instagram</a>
        </p>
      </footer>
    </div>
  );
};

export default Login;