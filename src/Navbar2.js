import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './Navbar.css'; // Using the same CSS file

const Navbar2 = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand/Logo - Admin Panel */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">A</div>
          <span>Admin Panel</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="desktop-menu">
          <li>
            <Link 
              to="/medicines1" 
              className={isActiveLink('/medicines1') ? 'active' : ''}
            >
              Medicines
            </Link>
          </li>
          <li>
            <Link 
              to="/PendingDonations" 
              className={isActiveLink('/PendingDonations') ? 'active' : ''}
            >
              Donations
            </Link>
          </li>
          <li>
            <Link 
              to="/application" 
              className={isActiveLink('/application') ? 'active' : ''}
            >
              Applications
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className={isActiveLink('/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Profile and Mobile Toggle */}
        <div className="navbar-profile">
          <ProfileIcon />
          <div 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleMobileMenu();
              }
            }}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link 
              to="/medicines1" 
              className={isActiveLink('/medicines1') ? 'active' : ''}
            >
              Medicines
            </Link>
          </li>
          <li>
            <Link 
              to="/PendingDonations" 
              className={isActiveLink('/PendingDonations') ? 'active' : ''}
            >
              Donations
            </Link>
          </li>
          <li>
            <Link 
              to="/application" 
              className={isActiveLink('/application') ? 'active' : ''}
            >
              Applications
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className={isActiveLink('/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar2;