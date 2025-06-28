import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BrandSwitcher = ({ currentBrand }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Brand configurations
  const brands = {
    medicare: {
      icon: 'M',
      name: 'MediCare',
      color: '#667eea',
      redirectPath: '/login',
      homeRoute: '/Home', // Route when logged in as user
      requiredRole: 'user'
    },
    guest: {
      icon: 'G',
      name: 'Guest Panel',
      color: '#10b981',
      redirectPath: '/',
      homeRoute: '/',
      requiredRole: null // No login required
    },
    admin: {
      icon: 'A',
      name: 'Admin Panel',
      color: '#f59e0b',
      redirectPath: '/Login',
      homeRoute: '/medicines1', // Route when logged in as ngo
      requiredRole: 'ngo'
    }
  };

  const currentBrandData = brands[currentBrand];
  const otherBrands = Object.entries(brands).filter(([key]) => {
    if (currentBrand === 'guest') return key !== 'guest';
    return key !== currentBrand && key !== 'guest';
  });

  // Function to check if user is logged in and get their role
  const getUserLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    return {
      isLoggedIn: isLoggedIn && token,
      role: userRole
    };
  };

  // Function to determine redirect path based on login status
  const getRedirectPath = (targetBrand) => {
    const { isLoggedIn, role } = getUserLoginStatus();
    const brandConfig = brands[targetBrand];
    
    // If no login required (guest panel)
    if (!brandConfig.requiredRole) {
      return brandConfig.redirectPath;
    }
    
    // If user is logged in with the correct role for the target brand
    if (isLoggedIn && role === brandConfig.requiredRole) {
      return brandConfig.homeRoute;
    }
    
    // If user is logged in but with wrong role, or not logged in, go to login
    return brandConfig.redirectPath;
  };

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
    const redirectPath = getRedirectPath(brandKey);
    navigate(redirectPath);
  };

  const getBrandIconStyle = (color, size = 'normal') => {
    const sizes = {
      normal: { width: '32px', height: '32px', fontSize: '1.1rem' },
      mobile: { width: '44px', height: '44px', fontSize: '1.4rem' },
      large: { width: '48px', height: '48px', fontSize: '1.6rem' }
    };
    
    const currentSize = sizes[size];
    
    return {
      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      backgroundColor: color,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      border: 'none',
      outline: 'none',
      borderRadius: '8px',
      minWidth: currentSize.width,
      width: currentSize.width,
      height: currentSize.height,
      fontSize: currentSize.fontSize,
      lineHeight: '1'
    };
  };

  // Function to get dropdown item display text with login status indicator
  const getDropdownItemText = (brandKey, brandData) => {
    if (isMobile) return null;
    
    const { isLoggedIn, role } = getUserLoginStatus();
    const brandConfig = brands[brandKey];
    
    let statusText = '';
    if (brandConfig.requiredRole) {
      if (isLoggedIn && role === brandConfig.requiredRole) {
        statusText = ' ✓';
      }
    }
    
    return `${brandData.name}${statusText}`;
  };

  return (
    <div style={styles.brandSwitcher} ref={dropdownRef}>
      <div style={styles.navbarBrand} onClick={handleBrandClick}>
        <div style={getBrandIconStyle(currentBrandData.color, isMobile ? 'mobile' : 'normal')}>
          {currentBrandData.icon}
        </div>
        {!isMobile && <span style={styles.brandName}>{currentBrandData.name}</span>}
        <div style={{
          ...styles.dropdownArrow,
          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {isDropdownOpen && (
        <div style={{
          ...styles.brandDropdown,
          ...(isMobile ? styles.brandDropdownMobile : {})
        }}>
          {!isMobile && <div style={styles.dropdownHeader}>Switch to:</div>}
          {otherBrands.map(([brandKey, brandData]) => {
            const { isLoggedIn, role } = getUserLoginStatus();
            const brandConfig = brands[brandKey];
            const canDirectAccess = !brandConfig.requiredRole || (isLoggedIn && role === brandConfig.requiredRole);
            
            return (
              <div
                key={brandKey}
                style={{
                  ...styles.dropdownItem,
                  ...(isMobile ? styles.dropdownItemMobile : {}),
                  ...(canDirectAccess ? styles.dropdownItemAccessible : {})
                }}
                onClick={() => handleBrandSwitch(brandKey)}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    const bgColor = canDirectAccess 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))';
                    e.target.style.background = bgColor;
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
                title={canDirectAccess ? 'Direct access available' : 'Login required'}
              >
                <div style={getBrandIconStyle(brandData.color, isMobile ? 'large' : 'normal')}>
                  {brandData.icon}
                </div>
                {!isMobile && (
                  <span style={styles.dropdownText}>
                    {getDropdownItemText(brandKey, brandData)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  brandSwitcher: {
    position: 'relative'
  },
  navbarBrand: {
    cursor: 'pointer',
    position: 'relative',
    paddingRight: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  brandName: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#374151'
  },
  dropdownArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '8px',
    transition: 'transform 0.3s ease',
    color: '#6b7280'
  },
  brandDropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    minWidth: '200px',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    padding: '8px',
    marginTop: '8px',
    zIndex: 1001,
    animation: 'dropdownSlideIn 0.3s ease'
  },
  brandDropdownMobile: {
    right: '0',
    left: 'auto',
    minWidth: '80px',
    maxWidth: '120px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    padding: '12px 8px'
  },
  dropdownHeader: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontWeight: '500',
    padding: '8px 12px 4px',
    borderBottom: '1px solid rgba(107, 114, 128, 0.1)',
    marginBottom: '4px'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#374151',
    fontWeight: '500'
  },
  dropdownItemMobile: {
    padding: '12px 8px',
    gap: '0',
    justifyContent: 'center',
    minHeight: '60px'
  },
  dropdownItemAccessible: {
    borderLeft: '3px solid #10b981'
  },
  dropdownText: {
    fontSize: '0.9rem',
    fontWeight: '500'
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes dropdownSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .brand-switcher-mobile .dropdown-item:active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)) !important;
      transform: scale(0.95) !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default BrandSwitcher;
