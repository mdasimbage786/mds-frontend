import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './Applications.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://mds-backend-zlp1.onrender.com/api/applications');
      setApplications(response.data);
      setFilteredApps(response.data);
    } catch (error) {
      setError(error);
      toast.error('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async (id) => {
    if (!window.confirm('Are you sure you want to mark this application as distributed?')) {
      return;
    }

    try {
      setProcessingId(id);
      await axios.delete(`https://mds-backend-zlp1.onrender.com/api/applications/${id}`);
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      setFilteredApps(updated);
      toast.success('Application marked as distributed successfully!');
    } catch (err) {
      console.error("Distribution marking failed", err);
      toast.error('Failed to mark application as distributed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value, 'all');
  };

  const applyFilters = (search, status) => {
    let filtered = applications;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(search) ||
          app.address.toLowerCase().includes(search) ||
          app.selectedMedicine.toLowerCase().includes(search) ||
          app.ngo.toLowerCase().includes(search) ||
          app.mobile.includes(search)
      );
    }

    setFilteredApps(filtered);
  };

  const getApplicationStats = () => {
    return {
      total: applications.length,
      pending: applications.length
    };
  };

  const stats = getApplicationStats();

  return (
    <div className="applications-container">
      <Navbar2 />
      

      {/* Page Header */}
      <div className="page-header">
        <h1>Medicine Applications</h1>
        <p>Manage and track medicine distribution applications</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending Distribution</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="applications-card">
          {/* Search and Filters */}
          <div className="controls-section">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search by name, medicine, NGO, mobile, or address..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
          </div>

          {/* Applications List */}
          <div className="applications-content">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading applications...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Error Loading Applications</h3>
                <p>{error.message}</p>
                <button onClick={fetchApplications} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No Applications Found</h3>
                <p>
                  {searchTerm 
                    ? "No applications match your search criteria." 
                    : "No medicine applications have been received yet."
                  }
                </p>
              </div>
            ) : (
              <div className="applications-grid">
                {filteredApps.map((app) => (
                  <div key={app.id} className="application-card">
                    <div className="card-header">
                      <h3 className="medicine-name">{app.selectedMedicine}</h3>
                      <div className="quantity-badge">
                        Qty: {app.quantity}
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="info-row">
                        <span className="info-label">👤 Applicant:</span>
                        <span className="info-value">{app.name}</span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">📱 Mobile:</span>
                        <span className="info-value">
                          <a href={`tel:${app.mobile}`} className="phone-link">
                            {app.mobile}
                          </a>
                        </span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">🏥 NGO:</span>
                        <span className="info-value">{app.ngo}</span>
                      </div>
                      
                      <div className="info-row address-row">
                        <span className="info-label">📍 Address:</span>
                        <span className="info-value address-text">{app.address}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <button 
                        className="distribute-btn"
                        onClick={() => handleDistribute(app.id)}
                        disabled={processingId === app.id}
                      >
                        {processingId === app.id ? (
                          <>
                            <span className="btn-spinner"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            ✅ Mark as Distributed
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

        {/* Info Panel */}
        <div className="info-panel">
          <div className="panel-card">
            <h3>Distribution Guidelines</h3>
            <ul className="guidelines-list">
              <li>Verify applicant identity before distribution</li>
              <li>Check medicine expiry dates</li>
              <li>Confirm pickup location with NGO</li>
              <li>Document distribution for records</li>
              <li>Mark as distributed after handover</li>
            </ul>
          </div>

          <div className="panel-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button 
                className="action-btn refresh-btn"
                onClick={fetchApplications}
                disabled={loading}
              >
                🔄 Refresh List
              </button>
            </div>
          </div>

          <div className="panel-card contact-card">
            <h3>Need Help?</h3>
            <div className="contact-info">
              <p>📞 <a href="tel:+919686117020">+91 9686117020</a></p>
              <p>📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a></p>
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

      {/* Professional Footer */}
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
            <p>Efficiently managing medicine distribution through trusted NGO partners</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Medicine Distribution System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Applications;