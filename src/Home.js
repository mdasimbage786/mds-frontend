import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';

const Home = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('ngoToken');
    navigate('/');
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* 👤 Profile Icon with Dropdown */}
      <div className="profile-menu">
        <div
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title="Profile"
        >
          👤
        </div>
        {dropdownOpen && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <header className="home-header">
        <h1>Welcome To Medicine Donation System</h1>
        <br />
        <div className="home-description">
          <div className="image-container">
            <img src="med1.jpeg" alt="Description" className="description-image" />
            <div className="button-container">
              <Link to="/donate" className="donate-button">Donate</Link>
              <Link to="/apply" className="apply-button">Apply</Link>
            </div>
          </div>
          <p>
            Donate unused or surplus medicines to help those in need access essential healthcare.
            Your contributions can make a significant difference in improving their quality of life.
          </p>
        </div>
      </header>

      {/* 📞 Help Section */}
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

export default Home;
