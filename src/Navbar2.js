import React from 'react';
import { Link } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './Navbar.css';

const Navbar2 = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/medicines1">Medicines</Link></li>
        <li><Link to="/PendingDonations">Donations</Link></li>
        <li><Link to="/application">Applications</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
      <ProfileIcon/>
    </nav>
  );
};

export default Navbar2; // ✅ Correct export
