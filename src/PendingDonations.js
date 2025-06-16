import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './PendingDonations.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PendingDonations = () => {
  const [pendingDonations, setPendingDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingDonations();
  }, []);

  const fetchPendingDonations = async () => {
    try {
      const response = await axios.get('https://mds-backend-zlp1.onrender.com/api/pending-donations');
      setPendingDonations(response.data);
      setFilteredDonations(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await axios.put(`https://mds-backend-zlp1.onrender.com/api/pending-donations/${id}/approve`);
      const updated = pendingDonations.filter(d => d.id !== id);
      setPendingDonations(updated);
      setFilteredDonations(updated);
      toast.success('Donation approved and added to stock!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Approval failed", err);
      toast.error('Failed to approve donation. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setProcessingId(null);
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = pendingDonations.filter(
      (donation) =>
        donation.name.toLowerCase().includes(value) ||
        donation.address.toLowerCase().includes(value) ||
        donation.manufacturer.toLowerCase().includes(value)
    );
    setFilteredDonations(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="pending-donations-container">
      <Navbar2 />

      {/* Page Header */}
      <div className="page-header">
        <h1>Pending Donations</h1>
        <p>Review and approve medicine donations from contributors</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Stats Section */}
        <div className="content-header">
          <div className="search-section">
            <div className="search-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by medicine name, manufacturer, or address..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-number">{pendingDonations.length}</div>
              <div className="stat-label">Total Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{filteredDonations.length}</div>
              <div className="stat-label">Filtered Results</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="content-body">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading donations...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Error Loading Data</h3>
              <p>Failed to fetch donations: {error.message}</p>
              <button onClick={fetchPendingDonations} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14L21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12L21 14L19 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14L3 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12L3 14L5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No Donations Found</h3>
              <p>
                {searchTerm 
                  ? `No donations match your search for "${searchTerm}"`
                  : "There are no pending donations at the moment."
                }
              </p>
            </div>
          ) : (
            <div className="donations-grid">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="donation-card">
                  <div className="card-header">
                    <h3 className="medicine-name">{donation.name}</h3>
                    <div className="quantity-badge">
                      {donation.quantity} units
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Manufacturer:</span>
                      <span className="value">{donation.manufacturer}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Expiry Date:</span>
                      <span className="value expiry-date">{formatDate(donation.expiryDate)}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Description:</span>
                      <span className="value description">{donation.description}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Donor Address:</span>
                      <span className="value address">{donation.address}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(donation.id)}
                      disabled={processingId === donation.id}
                    >
                      {processingId === donation.id ? (
                        <>
                          <div className="button-spinner"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Mark as Collected
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Footer */}
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

export default PendingDonations;