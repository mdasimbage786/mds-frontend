import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './Medicines.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Medicines1 = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');


  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://mds-backend-zlp1.onrender.com/api/medicines');
        setMedicines(response.data);
        setFilteredMedicines(response.data);
      } catch (error) {
        setError(error);
        toast.error('Failed to load medicines. Please refresh the page.');
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    let filtered = medicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'expiring-soon') {
        const today = new Date();
        const expiry = new Date(medicine.expiryDate);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return matchesSearch && diffDays <= 90;
      }
      return matchesSearch;
    });

    // Sort medicines
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      return 0;
    });

    setFilteredMedicines(filtered);
  }, [medicines, searchTerm, filterBy, sortBy]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return { class: 'expiry-critical', text: 'Expires Soon' };
    if (diffDays < 90) return { class: 'expiry-warning', text: 'Expiring' };
    return { class: 'expiry-safe', text: 'Good' };
  };

  return (
    <div className="medicines-container">
      <Navbar2 />
      

      <div className="page-header">
        <h1>Available Medicines</h1>
        <p>Browse through our collection of donated medicines and find what you need</p>
      </div>

      <div className="medicines-wrapper">
        <div className="medicines-content">
          {/* Search and Filter Section */}
          <div className="filter-card">
            <div className="filter-section">
              <h3>Search & Filter</h3>
              
              <div className="filter-group">
                <label htmlFor="search">Search Medicines</label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, manufacturer, or description..."
                  disabled={loading}
                />
              </div>

              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="filterBy">Filter By</label>
                  <select
                    id="filterBy"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    disabled={loading}
                  >
                    <option value="all">All Medicines</option>
                    <option value="expiring-soon">Expiring Soon</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="sortBy">Sort By</label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    disabled={loading}
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="expiry">Expiry Date</option>
                    <option value="quantity">Quantity</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Medicines Grid */}
          <div className="medicines-grid">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <span>Loading medicines...</span>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-message">
                  <h3>Error Loading Medicines</h3>
                  <p>{error.message}</p>
                  <button 
                    className="retry-btn"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="results-info">
                  <span>{filteredMedicines.length} medicines found</span>
                </div>
                
                {filteredMedicines.length > 0 ? (
                  <div className="medicine-cards">
                    {filteredMedicines.map((medicine) => {
                      const expiryStatus = getExpiryStatus(medicine.expiryDate);
                      return (
                        <div key={medicine.id} className="medicine-card">
                          <div className="card-header">
                            <h3 className="medicine-name">{medicine.name}</h3>
                            <div className={`expiry-badge ${expiryStatus.class}`}>
                              {expiryStatus.text}
                            </div>
                          </div>
                          
                          <div className="card-content">
                            <div className="medicine-info">
                              <div className="info-item">
                                <span className="label">Manufacturer:</span>
                                <span className="value">{medicine.manufacturer}</span>
                              </div>
                              
                              <div className="info-item">
                                <span className="label">Expiry Date:</span>
                                <span className="value">{formatDate(medicine.expiryDate)}</span>
                              </div>
                              
                              <div className="info-item">
                                <span className="label">Quantity:</span>
                                <span className="value">{medicine.quantity} units</span>
                              </div>
                              
                              <div className="info-item">
                                <span className="label">Location:</span>
                                <span className="value">{medicine.address}</span>
                              </div>
                            </div>
                            
                            <div className="medicine-description">
                              <span className="label">Description:</span>
                              <p>{medicine.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-results">
                    <div className="no-results-content">
                      <h3>No medicines found</h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="info-card">
          <h3>Medicine Guidelines</h3>
          <ul>
            <li>All medicines are donated by verified sources</li>
            <li>Check expiry dates before requesting</li>
            <li>Valid prescription may be required</li>
            <li>Requests are processed within 24-48 hours</li>
            <li>Collection through partner NGOs only</li>
          </ul>
          
          <div className="contact-info">
            <h4>Need Help?</h4>
            <p>📞 +91 9686117020</p>
            <p>📧 support@gmail.com</p>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-number">{medicines.length}</span>
              <span className="stat-label">Total Medicines</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{medicines.filter(m => {
                const today = new Date();
                const expiry = new Date(m.expiryDate);
                const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                return diffDays <= 90;
              }).length}</span>
              <span className="stat-label">Expiring Soon</span>
            </div>
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
            <p>📧 <a href="mailto:support@gmail.com">support@gmail.com</a></p>
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

export default Medicines1;