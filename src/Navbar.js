import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './Navbar.css';

const Navbar = () => {
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
    // Remove body scroll lock when route changes
    document.body.classList.remove('mobile-menu-open');
  }, [location]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    // Prevent body scroll when mobile menu is open
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Handle mobile menu link click
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Handle click outside mobile menu
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
        {/* Brand/Logo */}
        <Link to="/Home" className="navbar-brand">
          <div className="brand-icon">M</div>
          <span>MediCare</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="desktop-menu">
          <li>
            <Link 
              to="/Home" 
              className={isActiveLink('/Home') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/medicines" 
              className={isActiveLink('/medicines') ? 'active' : ''}
            >
              Medicines
            </Link>
          </li>
          <li>
            <Link 
              to="/donate" 
              className={isActiveLink('/donate') ? 'active' : ''}
            >
              Donate
            </Link>
          </li>
          <li>
            <Link 
              to="/apply" 
              className={isActiveLink('/apply') ? 'active' : ''}
            >
              Apply
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
              to="/Home" 
              className={isActiveLink('/Home') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/medicines" 
              className={isActiveLink('/medicines') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Medicines
            </Link>
          </li>
          <li>
            <Link 
              to="/donate" 
              className={isActiveLink('/donate') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Donate
            </Link>
          </li>
          <li>
            <Link 
              to="/apply" 
              className={isActiveLink('/apply') ? 'active' : ''}
              onClick={handleMobileLinkClick}
            >
              Apply
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;