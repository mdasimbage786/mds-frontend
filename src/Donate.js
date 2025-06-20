// Donate.js - Updated with Verification Code
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Donate.css'; // Updated CSS file

const Donate = () => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    expiryDate: '',
    description: '',
    quantity: 0,
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState(null);
  const [showCode, setShowCode] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Medicine name is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Please enter a valid quantity';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Check if expiry date is in the future
    if (formData.expiryDate) {
      const today = new Date();
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const formattedData = {
        ...formData,
        expiryDate: formatDate(formData.expiryDate),
      };

      const response = await axios.post('https://mds-backend-zlp1.onrender.com/api/pending-donations', formattedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201 || response.status === 200) {
        // Extract verification code from response
        const donationData = response.data;
        setVerificationCode(donationData.verificationCode);
        setShowCode(true);
        
        toast.success('Donation submitted successfully! Please save your verification code.');
        
        // Reset form
        setFormData({
          name: '',
          manufacturer: '',
          expiryDate: '',
          description: '',
          quantity: 0,
          address: '',
        });
        setErrors({});
      } else {
        toast.error('Failed to submit donation.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(verificationCode);
    toast.success('Verification code copied to clipboard!');
  };

  const handleNewDonation = () => {
    setShowCode(false);
    setVerificationCode(null);
  };

  if (showCode) {
    return (
      <div className="donate-container">
        <Navbar />
        
        <div className="verification-success">
          <div className="success-card">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h2>Donation Submitted Successfully!</h2>
            <p>Your medicine donation has been submitted for review. Please save the verification code below.</p>
            
            <div className="verification-code-display">
              <label>Your Verification Code:</label>
              <div className="code-container">
                <span className="verification-code">{verificationCode}</span>
                <button 
                  onClick={copyCodeToClipboard}
                  className="copy-btn"
                  title="Copy to clipboard"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8M16 4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4M16 4C16 5.10457 15.1046 6 14 6H10C8.89543 6 8 5.10457 8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="important-note">
              <h4>⚠️ Important:</h4>
              <ul>
                <li>Save this verification code safely</li>
                <li>NGO will need this code to mark your donation as collected</li>
                <li>This code cannot be retrieved later</li>
                <li>You will be contacted for pickup arrangement</li>
              </ul>
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={handleNewDonation}
                className="new-donation-btn"
              >
                Make Another Donation
              </button>
            </div>
          </div>
        </div>

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
  }

  return (
    <div className="donate-container">
      <Navbar />
      
      <div className="page-header">
        <h1>Donate Medicine</h1>
        <p>Help those in need by donating essential medicines</p>
      </div>

      <div className="form-wrapper">
        <div className="form-card">
          <form className="donate-form" onSubmit={handleSubmit}>
            
            {/* Medicine Information */}
            <div className="form-section">
              <h3>Medicine Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">
                  Medicine Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  disabled={loading}
                  placeholder="Enter medicine name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="manufacturer">
                  Manufacturer <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className={errors.manufacturer ? 'error' : ''}
                  disabled={loading}
                  placeholder="Enter manufacturer name"
                />
                {errors.manufacturer && <span className="error-text">{errors.manufacturer}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">
                  Expiry Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={errors.expiryDate ? 'error' : ''}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                <span className="helper-text">Only medicines with future expiry dates are accepted</span>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={errors.description ? 'error' : ''}
                  disabled={loading}
                  rows="4"
                  placeholder="Describe the medicine, its uses, dosage form, etc."
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={errors.quantity ? 'error' : ''}
                  disabled={loading}
                  min="1"
                  placeholder="Enter quantity (tablets, bottles, strips, etc.)"
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>
            </div>

            {/* Donor Information */}
            <div className="form-section">
              <h3>Pickup Information</h3>
              
              <div className="form-group">
                <label htmlFor="address">
                  Complete Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  disabled={loading}
                  rows="4"
                  placeholder="Enter your complete address with pincode for medicine pickup"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Submit Donation'
              )}
            </button>
          </form>
        </div>

        <div className="info-card">
          <h3>Donation Guidelines</h3>
          <ul>
            <li>Only donate medicines that are not expired</li>
            <li>Ensure medicines are in original packaging</li>
            <li>Check that medicines were stored properly</li>
            <li>Include complete medicine information</li>
            <li>Our team will verify before distribution</li>
          </ul>
          
          <div className="donation-process">
            <h4>How it Works</h4>
            <div className="process-step">
              <span className="step-number">1</span>
              <span className="step-text">Submit donation form</span>
            </div>
            <div className="process-step">
              <span className="step-number">2</span>
              <span className="step-text">Get verification code</span>
            </div>
            <div className="process-step">
              <span className="step-number">3</span>
              <span className="step-text">NGO contacts for pickup</span>
            </div>
            <div className="process-step">
              <span className="step-number">4</span>
              <span className="step-text">NGO verifies with your code</span>
            </div>
            <div className="process-step">
              <span className="step-number">5</span>
              <span className="step-text">Medicines reach those in need</span>
            </div>
          </div>
          
          <div className="contact-info">
            <h4>Need Help?</h4>
            <p>📞 <a href="tel:+919686117020">+91 9686117020</a></p>
            <p>📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a></p>
          </div>
        </div>
      </div>

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
            <p>Connecting generous donors with those who need essential medicines</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Medicine Distribution System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Donate;