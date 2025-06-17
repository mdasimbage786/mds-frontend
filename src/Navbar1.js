import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import BrandSwitcher from './BrandSwitcher';
import './Navbar.css';

// Guest Panel Navbar
const Navbar1 = () => {
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
    document.body.classList.remove('mobile-menu-open');
  }, [location]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar')) {
        setIsMobileMenuOpen(false);
        document.body.classList.remove('mobile-menu-open');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Switcher */}
        <BrandSwitcher currentBrand="guest" />

        {/* Desktop Navigation */}
        <ul className="desktop-menu">
          <li>
            <Link 
              to="/Home1" 
              className={isActiveLink('/Home1') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/medicines2" 
              className={isActiveLink('/medicines2') ? 'active' : ''}
            >
              Medicines
            </Link>
          </li>
          <li>
            <Link 
              to="/PendingDonations1" 
              className={isActiveLink('/PendingDonations1') ? 'active' : ''}
            >
              Donations
            </Link>
          </li>
          <li>
            <Link 
              to="/application1" 
              className={isActiveLink('/application1') ? 'active' : ''}
            >
              Applications
            </Link>
          </li>
          <li>
            <Link 
              to="/aboutus" 
              className={isActiveLink('/aboutus') ? 'active' : ''}
            >
              About Us
            </Link>
          </li>
        </ul>

        {/* Profile and Mobile Toggle */}
        <div className="navbar-profile">
          <ProfileIcon />
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link 
              to="/Home1" 
              className={isActiveLink('/Home1') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/medicines2" 
              className={isActiveLink('/medicines2') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Medicines
            </Link>
          </li>
          <li>
            <Link 
              to="/PendingDonations1" 
              className={isActiveLink('/PendingDonations1') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Donations
            </Link>
          </li>
          <li>
            <Link 
              to="/application1" 
              className={isActiveLink('/application1') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Applications
            </Link>
          </li>
          <li>
            <Link 
              to="/application1" 
              className={isActiveLink('/application1') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar1;