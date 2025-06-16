import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalDonations: 0,
    pendingApplications: 0,
    approvedApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://mds-backend-zlp1.onrender.com/api/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics');
        toast.error('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="dashboard-container">
      <Navbar2 />
      
      <div className="page-header">
        <h1>Medicine Distribution Dashboard</h1>
        <p>Real-time overview of medicine donations and distribution activities</p>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading dashboard statistics...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h3>Failed to Load Data</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card medicines">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21l5-5"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalMedicines}</div>
                  <div className="stat-label">Total Medicines Available</div>
                  <div className="stat-description">Active medicine inventory</div>
                </div>
              </div>

              <div className="stat-card applications">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalDonations}</div>
                  <div className="stat-label">Total Applications</div>
                  <div className="stat-description">All submitted requests</div>
                </div>
              </div>

              <div className="stat-card pending">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.pendingApplications}</div>
                  <div className="stat-label">Pending Applications</div>
                  <div className="stat-description">Awaiting approval</div>
                </div>
              </div>

              <div className="stat-card approved">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.approvedApplications}</div>
                  <div className="stat-label">Approved Applications</div>
                  <div className="stat-description">Successfully processed</div>
                </div>
              </div>
            </div>

            <div className="dashboard-insights">
              <div className="insights-card">
                <h3>System Overview</h3>
                <div className="insight-grid">
                  <div className="insight-item">
                    <div className="insight-label">Approval Rate</div>
                    <div className="insight-value">
                      {stats.totalDonations > 0 
                        ? Math.round((stats.approvedApplications / stats.totalDonations) * 100) 
                        : 0}%
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-label">Processing Queue</div>
                    <div className="insight-value">{stats.pendingApplications} items</div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-label">System Status</div>
                    <div className="insight-value status-active">Active</div>
                  </div>
                </div>
              </div>

              <div className="quick-actions-card">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary" onClick={() => window.location.href = '/PendingDonations'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    Review Pending Application
                  </button>
                  <button className="action-btn secondary" onClick={() => window.location.href = '/application'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Review Pending Application
                  </button>
                  <button className="action-btn tertiary" onClick={handleRefresh}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23,4 23,10 17,10"/>
                      <polyline points="1,20 1,14 7,14"/>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 14"/>
                    </svg>
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
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

export default Dashboard;