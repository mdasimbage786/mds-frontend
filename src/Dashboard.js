import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    availableMedicines: 0,
    totalMedicineQuantity: 0,
    pendingDonations: 0,
    pendingDistributions: 0,
    approvedApplications: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data
        const [medicinesRes, pendingDonationsRes, applicationsRes] = await Promise.all([
          axios.get('https://mds-backend-zlp1.onrender.com/api/medicines'),
          axios.get('https://mds-backend-zlp1.onrender.com/api/pending-donations'),
          axios.get('https://mds-backend-zlp1.onrender.com/api/applications')
        ]);
        
        const medicines = medicinesRes.data;
        const pendingDonations = pendingDonationsRes.data;
        const applications = applicationsRes.data;
        
        // Calculate statistics
        const availableMedicines = medicines.length;
        const totalMedicineQuantity = medicines.reduce((sum, med) => sum + (med.quantity || 0), 0);
        const pendingDonationsCount = pendingDonations.length;
        const totalApplications = applications.length;
        
        // Count pending distributions (applications that haven't been distributed)
        const pendingDistributions = applications.filter(app => 
          app.status !== 'distributed' && app.status !== 'rejected'
        ).length;
        
        // Calculate approved applications (total - pending distributions)
        const approvedApplications = totalApplications - pendingDistributions;
        
        setStats({
          availableMedicines,
          totalMedicineQuantity,
          pendingDonations: pendingDonationsCount,
          pendingDistributions,
          approvedApplications: Math.max(0, approvedApplications), // Ensure non-negative
          totalApplications
        });
        
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
                  <div className="stat-number">{stats.availableMedicines}</div>
                  <div className="stat-label">Available Medicine Types</div>
                  <div className="stat-description">Total quantity: {stats.totalMedicineQuantity}</div>
                </div>
              </div>

              <div className="stat-card donations">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stats.pendingDonations}</div>
                  <div className="stat-label">Pending Donations</div>
                  <div className="stat-description">Awaiting collection</div>
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
                  <div className="stat-number">{stats.pendingDistributions}</div>
                  <div className="stat-label">Pending Distributions</div>
                  <div className="stat-description">Awaiting physical delivery</div>
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
                  <div className="stat-label">Completed Distributions</div>
                  <div className="stat-description">Successfully distributed</div>
                </div>
              </div>
            </div>

            <div className="dashboard-insights">
              <div className="insights-card">
                <h3>System Overview</h3>
                <div className="insight-grid">
                  <div className="insight-item">
                    <div className="insight-label">Distribution Rate</div>
                    <div className="insight-value">
                      {stats.totalApplications > 0 
                        ? Math.round((stats.approvedApplications / stats.totalApplications) * 100) 
                        : 0}%
                    </div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-label">Processing Queue</div>
                    <div className="insight-value">{stats.pendingDistributions} items</div>
                  </div>
                  <div className="insight-item">
                    <div className="insight-label">Total Applications</div>
                    <div className="insight-value">{stats.totalApplications}</div>
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
                    Review Pending Donations ({stats.pendingDonations})
                  </button>
                  <button className="action-btn secondary" onClick={() => window.location.href = '/application'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    Process Distribution Requests ({stats.pendingDistributions})
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
