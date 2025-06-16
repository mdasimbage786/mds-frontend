import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ngoId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Common validations
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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.contactNumber || !mobileRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // User-specific validations
    if (userType === 'user') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    } else {
      if (!formData.ngoId.trim()) newErrors.ngoId = 'NGO ID is required';
      if (!formData.name.trim()) newErrors.name = 'NGO name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData({
      ...formData,
      firstName: '',
      lastName: '',
      ngoId: '',
      name: '',
    });
    setErrors({});
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

    setLoading(true);

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
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-content register-content">
          <div className="auth-card register-card">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Join our platform to access essential medicines</p>
            </div>

            <div className="role-selector-container">
              <label className="role-label">Register as:</label>
              <div className="role-tabs">
                <button
                  type="button"
                  className={`role-tab ${userType === 'user' ? 'active' : ''}`}
                  onClick={() => handleUserTypeChange('user')}
                >
                  👤 User
                </button>
                <button
                  type="button"
                  className={`role-tab ${userType === 'ngo' ? 'active' : ''}`}
                  onClick={() => handleUserTypeChange('ngo')}
                >
                  🏢 NGO
                </button>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Personal/Organization Information */}
              <div className="form-section">
                <h3>{userType === 'user' ? 'Personal Information' : 'Organization Information'}</h3>
                
                {userType === 'user' ? (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">
                        First Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? 'error' : ''}
                        placeholder="Enter your first name"
                        disabled={loading}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">
                        Last Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? 'error' : ''}
                        placeholder="Enter your last name"
                        disabled={loading}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>
                ) : (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="ngoId">
                        NGO ID <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="ngoId"
                        name="ngoId"
                        value={formData.ngoId}
                        onChange={handleChange}
                        className={errors.ngoId ? 'error' : ''}
                        placeholder="Enter NGO registration ID"
                        disabled={loading}
                      />
                      {errors.ngoId && <span className="error-text">{errors.ngoId}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">
                        NGO Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Enter NGO name"
                        disabled={loading}
                      />
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Information */}
              <div className="form-section">
                <h3>Account Information</h3>
                
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

                <div className="form-row">
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
                      placeholder="Create a password"
                      disabled={loading}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? 'error' : ''}
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="form-section">
                <h3>Contact Information</h3>
                
                <div className="form-group">
                  <label htmlFor="contactNumber">
                    Mobile Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={errors.contactNumber ? 'error' : ''}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    disabled={loading}
                  />
                  {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address">
                    Complete Address <span className="required">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Enter your complete address with pincode"
                    rows="3"
                    disabled={loading}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account? 
                <Link to="/" className="auth-link">Sign in here</Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <h3>Join Our Community</h3>
            <p>Be part of a platform that makes healthcare accessible. Whether you're seeking medicines or an NGO wanting to help, we're here to connect you.</p>
            
            <div className="features">
              <div className="feature">
                <span className="feature-icon">✨</span>
                <span>Easy Registration Process</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📞</span>
                <span>24/7 Support</span>
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

export default Register;