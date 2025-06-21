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
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(verificationCode);
    toast.success('Verification code copied to clipboard!');
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
      const response = await axios.post('https://mds-backend-zlp1.onrender.com/api/applications', form);

      const updatedQty = selected.quantity - requestedQty;
      if (updatedQty > 0) {
        await axios.put(`https://mds-backend-zlp1.onrender.com/api/medicines/${selected.id}`, {
          ...selected,
          quantity: updatedQty
        });
      } else {
        await axios.delete(`https://mds-backend-zlp1.onrender.com/api/medicines/${selected.id}`);
      }

      // Set verification code and show modal
      setVerificationCode(response.data.verificationCode);
      setShowVerificationModal(true);

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

    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMedicine = medicines.find(m => m.name === form.selectedMedicine);

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
            <li>You will receive a verification code after submission</li>
            <li>Present the verification code during medicine pickup</li>
            <li>Medicines are distributed through partner NGOs</li>
          </ul>
          
          <div className="contact-info">
            <h4>Need Help?</h4>
            <p>📞 <a href="tel:+919686117020">+91 9686117020</a></p>
            <p>📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a></p>
          </div>
        </div>
      </div>

      {/* Verification Code Modal */}
      {showVerificationModal && (
        <div className="modal-overlay">
          <div className="verification-modal">
            <div className="modal-header">
              <h2>✅ Application Submitted Successfully!</h2>
            </div>
            <div className="modal-body">
              <p>Your application has been submitted successfully. Please save your verification code:</p>
              <div className="verification-code-display">
                <span className="verification-code">{verificationCode}</span>
                <button onClick={copyVerificationCode} className="copy-btn">📋 Copy</button>
              </div>
              <div className="modal-info">
                <p><strong>Important:</strong></p>
                <ul>
                  <li>Save this verification code safely</li>
                  <li>You'll need this code during medicine pickup</li>
                  <li>NGO will verify this code before distribution</li>
                  <li>We will contact you within 24-48 hours</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowVerificationModal(false)} 
                className="modal-close-btn"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

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

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .verification-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header h2 {
          color: #22c55e;
          margin: 0 0 20px 0;
          text-align: center;
        }

        .verification-code-display {
          background: #f0f9ff;
          border: 2px solid #0ea5e9;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0;
        }

        .verification-code {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #0ea5e9;
          letter-spacing: 2px;
        }

        .copy-btn {
          background: #0ea5e9;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: #0284c7;
        }

        .modal-info {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }

        .modal-info ul {
          margin: 10px 0 0 0;
          padding-left: 20px;
        }

        .modal-info li {
          margin: 5px 0;
          color: #92400e;
        }

        .modal-close-btn {
          background: #22c55e;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          transition: background 0.2s;
        }

        .modal-close-btn:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
};

export default Apply;