import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Apply1.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Apply = () => {
  const [form, setForm] = useState({
    selectedMedicine: '',
    quantity: '',
    ngo: '',
    name: '',
    mobile: '',
    address: ''
  });

  const [medicines, setMedicines] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medicinesRes, ngosRes] = await Promise.all([
          axios.get('https://mds-backend-zlp1.onrender.com/api/medicines'),
          axios.get('https://mds-backend-zlp1.onrender.com/api/ngos')
        ]);
        
        setMedicines(medicinesRes.data);
        setNgos(ngosRes.data);
        setFilteredNgos(ngosRes.data);
      } catch (error) {
        toast.error('Failed to load data. Please refresh the page.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!form.selectedMedicine) newErrors.selectedMedicine = 'Please select a medicine';
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = 'Please enter a valid quantity';
    if (!form.ngo) newErrors.ngo = 'Please select an NGO';
    if (!form.name.trim()) newErrors.name = 'Name is required';
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!form.mobile || !mobileRegex.test(form.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!form.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSearchCity(city);
    
    if (city.trim() === '') {
      setFilteredNgos(ngos);
    } else {
      const filtered = ngos.filter(ngo => 
        ngo.address.toLowerCase().includes(city.toLowerCase()) ||
        ngo.name.toLowerCase().includes(city.toLowerCase())
      );
      setFilteredNgos(filtered);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error('Please fill all required fields correctly');
    return;
  }

  const selected = medicines.find(m => m.name === form.selectedMedicine);
  if (!selected) {
    toast.error("Invalid medicine selection.");
    return;
  }

  const requestedQty = parseInt(form.quantity);
  if (requestedQty > selected.quantity) {
    toast.error(`Only ${selected.quantity} units available for ${selected.name}.`);
    return;
  }

  setLoading(true);

  try {
    // Submit application
    console.log('Submitting application...', form);
    const response = await axios.post('https://mds-backend-zlp1.onrender.com/api/applications', form);
    
    console.log('Application response:', response);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    // Check if submission was successful
    if (response.status === 201 || response.status === 200) {
      const applicationData = response.data;
      
      // Check if verification code exists in response
      if (!applicationData.verificationCode) {
        console.error('No verification code in response:', applicationData);
        toast.error("Application submitted but verification code not received. Please contact support.");
        return;
      }

      // Set verification code and show success screen
      setVerificationCode(applicationData.verificationCode);
      setShowCode(true);

      // Update medicine quantity
      try {
        const updatedQty = selected.quantity - requestedQty;
        console.log(`Updating medicine quantity: ${selected.quantity} - ${requestedQty} = ${updatedQty}`);
        
        if (updatedQty > 0) {
          const updateResponse = await axios.put(`https://mds-backend-zlp1.onrender.com/api/medicines/${selected.id}`, {
            ...selected,
            quantity: updatedQty
          });
          console.log('Medicine update response:', updateResponse);
        } else {
          const deleteResponse = await axios.delete(`https://mds-backend-zlp1.onrender.com/api/medicines/${selected.id}`);
          console.log('Medicine delete response:', deleteResponse);
        }

        // Update local state to reflect changes
        setMedicines(prevMedicines => 
          prevMedicines.map(med => 
            med.id === selected.id 
              ? (updatedQty > 0 ? { ...med, quantity: updatedQty } : null)
              : med
          ).filter(Boolean) // Remove null entries (deleted medicines)
        );

      } catch (medicineUpdateError) {
        console.error("Error updating medicine quantity:", medicineUpdateError);
        // Don't show error to user as application was submitted successfully
        // Just log for debugging
      }

      // Show success message
      toast.success("Application submitted successfully! Please save your verification code.");

      // Reset form
      setForm({
        selectedMedicine: '',
        quantity: '',
        ngo: '',
        name: '',
        mobile: '',
        address: ''
      });
      setSearchCity('');
      setFilteredNgos(ngos);
      setErrors({});

    } else {
      // Unexpected status code
      console.error("Unexpected response status:", response.status);
      toast.error("Unexpected response. Please try again.");
    }

  } catch (error) {
    console.error("Error submitting application:", error);
    
    // More detailed error handling
    if (error.response) {
      // Server responded with error status
      console.error("Server error response:", error.response.data);
      console.error("Server error status:", error.response.status);
      
      if (error.response.status === 400) {
        toast.error("Invalid application data. Please check your inputs.");
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(`Server error: ${error.response.status}. Please try again.`);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.request);
      toast.error("Network error. Please check your connection and try again.");
    } else {
      // Other error
      console.error("Unknown error:", error.message);
      toast.error("An unexpected error occurred. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(verificationCode);
    toast.success('Verification code copied to clipboard!');
  };

  const handleNewApplication = () => {
    setShowCode(false);
    setVerificationCode(null);
  };

  const selectedMedicine = medicines.find(m => m.name === form.selectedMedicine);

  if (showCode) {
    return (
      <div className="apply-container">
        <Navbar />
        
        <div className="verification-success">
          <div className="success-card">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h2>Application Submitted Successfully!</h2>
            <p>Your medicine application has been submitted for review. Please save the verification code below.</p>
            
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
                <li>NGO will need this code to mark your application as distributed</li>
                <li>This code cannot be retrieved later</li>
                <li>You will be contacted for pickup arrangement</li>
                <li>Applications are processed within 24-48 hours</li>
              </ul>
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={handleNewApplication}
                className="new-donation-btn"
              >
                Apply for Another Medicine
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
      </div>
    );
  }

  return (
    <div className="apply-container">
      <Navbar />
      
      <div className="page-header">
        <h1>Medicine Application Form</h1>
        <p>Apply for essential medicines through our trusted NGO partners</p>
      </div>

      <div className="form-wrapper">
        <div className="form-card">
          <form className="apply-form" onSubmit={handleSubmit}>
            
            {/* Medicine Selection */}
            <div className="form-section">
              <h3>Medicine Information</h3>
              
              <div className="form-group">
                <label htmlFor="selectedMedicine">
                  Select Medicine <span className="required">*</span>
                </label>
                <select 
                  id="selectedMedicine"
                  name="selectedMedicine" 
                  value={form.selectedMedicine}
                  onChange={handleChange} 
                  className={errors.selectedMedicine ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Choose a medicine</option>
                  {medicines.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name} (Available: {m.quantity} units)
                    </option>
                  ))}
                </select>
                {errors.selectedMedicine && <span className="error-text">{errors.selectedMedicine}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity Required <span className="required">*</span>
                </label>
                <input 
                  type="number" 
                  id="quantity"
                  name="quantity" 
                  value={form.quantity} 
                  onChange={handleChange}
                  className={errors.quantity ? 'error' : ''}
                  min="1"
                  max={selectedMedicine?.quantity || 999}
                  disabled={loading}
                  placeholder="Enter quantity needed"
                />
                {selectedMedicine && (
                  <span className="helper-text">
                    Available: {selectedMedicine.quantity} units
                  </span>
                )}
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>
            </div>

            {/* NGO Selection */}
            <div className="form-section">
              <h3>NGO Selection</h3>
              
              <div className="form-group">
                <label htmlFor="searchCity">Search NGO by City/Name</label>
                <input 
                  type="text" 
                  id="searchCity"
                  value={searchCity} 
                  onChange={handleCityChange}
                  placeholder="Enter city name or NGO name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ngo">
                  Select NGO <span className="required">*</span>
                </label>
                <select 
                  id="ngo"
                  name="ngo" 
                  value={form.ngo}
                  onChange={handleChange}
                  className={errors.ngo ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Choose an NGO</option>
                  {filteredNgos.map(n => (
                    <option key={n.id} value={n.name}>
                      {n.name} - {n.address}
                    </option>
                  ))}
                </select>
                {errors.ngo && <span className="error-text">{errors.ngo}</span>}
                {filteredNgos.length === 0 && searchCity && (
                  <span className="helper-text">No NGOs found in this location</span>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  disabled={loading}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="mobile">
                  Mobile Number <span className="required">*</span>
                </label>
                <input 
                  type="tel" 
                  id="mobile"
                  name="mobile" 
                  value={form.mobile} 
                  onChange={handleChange}
                  className={errors.mobile ? 'error' : ''}
                  disabled={loading}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                />
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Complete Address <span className="required">*</span>
                </label>
                <textarea 
                  id="address"
                  name="address" 
                  value={form.address} 
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  disabled={loading}
                  rows="4"
                  placeholder="Enter your complete address with pincode"
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
                'Submit Application'
              )}
            </button>
          </form>
        </div>

        <div className="info-card">
          <h3>Application Guidelines</h3>
          <ul>
            <li>Ensure all information provided is accurate</li>
            <li>Valid prescription may be required for certain medicines</li>
            <li>Applications are processed within 24-48 hours</li>
            <li>You will be contacted for verification</li>
            <li>Medicines are distributed through partner NGOs</li>
            <li>Save your verification code for pickup confirmation</li>
          </ul>
          
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
            <p>Connecting people with essential medicines through trusted NGO partners</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Medicine Distribution System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Apply;
