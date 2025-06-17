import React, { useState, useEffect, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import './BrandSwitcher.css';

const BrandSwitcher = ({ currentBrand }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Brand configurations
  const brands = {
    medicare: {
      icon: 'M',
      name: 'MediCare',
      color: '#667eea',
      redirectPath: '/login'
    },
    guest: {
      icon: 'G',
      name: 'Guest Panel',
      color: '#10b981',
      redirectPath: '/'
    },
    admin: {
      icon: 'A',
      name: 'Admin Panel',
      color: '#f59e0b',
      redirectPath: '/Login'
    }
  };

  const currentBrandData = brands[currentBrand];
  const otherBrands = Object.entries(brands).filter(([key]) => key !== currentBrand);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrandClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBrandSwitch = (brandKey) => {
    setIsDropdownOpen(false);
    navigate(brands[brandKey].redirectPath);
  };

  return (
    <div className="brand-switcher" ref={dropdownRef}>
      <div className="navbar-brand" onClick={handleBrandClick}>
        <div 
          className="brand-icon" 
          style={{ background: `linear-gradient(135deg, ${currentBrandData.color}, ${currentBrandData.color}dd)` }}
        >
          {currentBrandData.icon}
        </div>
        <span>{currentBrandData.name}</span>
        <div className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="brand-dropdown">
          <div className="dropdown-header">Switch to:</div>
          {otherBrands.map(([brandKey, brandData]) => (
            <div
              key={brandKey}
              className="dropdown-item"
              onClick={() => handleBrandSwitch(brandKey)}
            >
              <div 
                className="dropdown-brand-icon"
                style={{ background: `linear-gradient(135deg, ${brandData.color}, ${brandData.color}dd)` }}
              >
                {brandData.icon}
              </div>
              <span>{brandData.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandSwitcher;