import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Optional: for styles
import Navbar2 from './Navbar2'; // or Navbar if you prefer

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalDonations: 0,
    pendingApplications: 0,
    approvedApplications: 0
  });

  useEffect(() => {
    fetch('https://mds-backend-zlp1.onrender.com/api/dashboard/stats')
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching dashboard stats:', error));
  }, []);

  return (
    <div className="dashboard">
         <Navbar2 />
      <h1>Medicine Donation Dashboard</h1>
      <div className="card-container">
        <div className="card">
          <h2>{stats.totalMedicines}</h2>
          <p>Total Medicines</p>
        </div>
        <div className="card">
          <h2>{stats.totalDonations}</h2>
          <p>Total Applications</p>
        </div>
        <div className="card">
          <h2>{stats.pendingApplications}</h2>
          <p>Pending Applications</p>
        </div>
        <div className="card">
          <h2>{stats.approvedApplications}</h2>
          <p>Approved Applications</p>
        </div>
      </div>
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

export default Dashboard;
