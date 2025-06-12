import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Register = () => {
  const [userType, setUserType] = useState('user'); // default is user
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ngoId: '',
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
  });

  const navigate = useNavigate();

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    // Clear user-specific or NGO-specific fields on switch
    setFormData({
      ...formData,
      firstName: '',
      lastName: '',
      ngoId: '',
      name: '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {};
      let url = '';

      if (userType === 'user') {
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          contactNumber: formData.contactNumber,
          address: formData.address,
        };
        url = 'https://mds-backend-zlp1.onrender.com/api/users/register';
      } else {
        payload = {
          ngoId: formData.ngoId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contactNumber: formData.contactNumber,
          address: formData.address,
        };
        url = 'https://mds-backend-zlp1.onrender.com/api/ngos/register';
      }

      const response = await axios.post(url, payload);

      if (response.data) {
        alert('Registration successful! Please login.');
        navigate('/');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error during registration. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2 color="Dark Blue">Registration</h2>

      {/* User Type Selector */}
      <div className="form-group">
        <label>User Type:</label>
        <select value={userType} onChange={handleUserTypeChange}>
          <option value="user">User</option>
          <option value="ngo">NGO</option>
        </select>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Conditionally Render User or NGO Fields */}
        {userType === 'user' ? (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ngoId">NGO ID:</label>
                <input
                  type="text"
                  id="ngoId"
                  name="ngoId"
                  value={formData.ngoId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">NGO Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Common Fields for both */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Mobile Number:</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            pattern="\d{10}"
            title="Mobile number must be 10 digits"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login here</Link>.
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

export default Register;