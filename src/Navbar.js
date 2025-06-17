import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import BrandSwitcher from './BrandSwitcher';
import './Navbar.css';

// Medicare Navbar
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
        <BrandSwitcher currentBrand="medicare" />

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
          <li>
            <Link 
              to="/aboutus1" 
              className={isActiveLink('/aboutus1') ? 'active' : ''}
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
          <li>
            <Link 
               to="/aboutus1" 
               className={isActiveLink('/aboutus1') ? 'active' : ''}
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

export default Navbar;