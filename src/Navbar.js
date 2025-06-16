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
      </div>
    </nav>
  );
};

export default Navbar;