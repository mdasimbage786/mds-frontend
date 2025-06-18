import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider'; // Import the theme hook
import './ProfileIcon.css';
import './global-theme.css'; // Import the global theme CSS

const ProfileIcon = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    name: '', // For NGO
    email: '',
    contactNumber: '',
    address: '',
    ngoId: '' // For NGO
  });
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Use the global theme
  const { theme, changeTheme } = useTheme(); // Removed unused 'themes'
  
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const iconRef = useRef(null);
  const profileModalRef = useRef(null);
  const settingsModalRef = useRef(null);
  const editProfileModalRef = useRef(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role') || 'user';
    
    setIsLoggedIn(loggedIn);
    setUserRole(role);
    
    if (loggedIn) {
      // Load user details from localStorage or fetch from API
      const savedUserDetails = localStorage.getItem('userDetails');
      if (savedUserDetails) {
        const userData = JSON.parse(savedUserDetails);
        setUserDetails(userData);
        setEditFormData(userData);
      } else {
        // Fetch user details from your Spring Boot backend
        fetchUserDetails();
      }
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token) return;
      
      const endpoint = role === 'user' 
        ? 'https://mds-backend-zlp1.onrender.com/api/users/profile'
        : 'https://mds-backend-zlp1.onrender.com/api/ngos/profile';
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        setUserDetails(userData);
        setEditFormData(userData);
        localStorage.setItem('userDetails', JSON.stringify(userData));
      } else {
        console.error('Failed to fetch user details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token) return;
      
      const endpoint = role === 'user' 
        ? 'https://mds-backend-zlp1.onrender.com/api/users/profile'
        : 'https://mds-backend-zlp1.onrender.com/api/ngos/profile';
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserDetails(userData);
        setEditFormData(userData);
        localStorage.setItem('userDetails', JSON.stringify(userData));
        setShowEditProfile(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        !iconRef.current?.contains(event.target)
      ) {
        setShowMenu(false);
      }
      
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
      
      if (
        settingsModalRef.current &&
        !settingsModalRef.current.contains(event.target)
      ) {
        setShowSettings(false);
      }

      if (
        editProfileModalRef.current &&
        !editProfileModalRef.current.contains(event.target)
      ) {
        setShowEditProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setShowMenu(prev => !prev);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
      setUserDetails({});
      setUserRole('');
      navigate('/Login');
    } else {
      navigate('/Login');
    }
    setShowMenu(false);
  };

  const handleProfile = () => {
    setShowProfile(true);
    setShowMenu(false);
  };

  const handleSettings = () => {
    setShowSettings(true);
    setShowMenu(false);
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme); // Use the global theme changer
  };

  const handleEditProfile = () => {
    setShowProfile(false);
    setShowEditProfile(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    updateUserProfile(editFormData);
  };

  // Get user initials for display
  const getUserInitials = () => {
    if (userRole === 'user') {
      const firstName = userDetails.firstName || '';
      const lastName = userDetails.lastName || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else {
      const name = userDetails.name || '';
      return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
  };

  const getDisplayName = () => {
    if (userRole === 'user') {
      return `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'User';
    } else {
      return userDetails.name || 'NGO';
    }
  };

  const ProfileModal = () => (
    <div className="theme-modal-overlay" style={{ display: showProfile ? 'flex' : 'none' }}>
      <div ref={profileModalRef} className="theme-modal-content theme-card profile-modal">
        <div className="modal-header">
          <h2 className="theme-text-primary">My Profile</h2>
          <button className="modal-close theme-btn-secondary" onClick={() => setShowProfile(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="profile-avatar-large">
            {getUserInitials()}
          </div>
          <div className="profile-details">
            {userRole === 'user' ? (
              <>
                <div className="detail-row">
                  <label className="theme-text-secondary">First Name:</label>
                  <span className="theme-text-primary">{userDetails.firstName || 'Not available'}</span>
                </div>
                <div className="detail-row">
                  <label className="theme-text-secondary">Last Name:</label>
                  <span className="theme-text-primary">{userDetails.lastName || 'Not available'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="detail-row">
                  <label className="theme-text-secondary">NGO Name:</label>
                  <span className="theme-text-primary">{userDetails.name || 'Not available'}</span>
                </div>
                <div className="detail-row">
                  <label className="theme-text-secondary">NGO ID:</label>
                  <span className="theme-text-primary">{userDetails.ngoId || 'Not available'}</span>
                </div>
              </>
            )}
            <div className="detail-row">
              <label className="theme-text-secondary">Email:</label>
              <span className="theme-text-primary">{userDetails.email || 'Not available'}</span>
            </div>
            <div className="detail-row">
              <label className="theme-text-secondary">Contact Number:</label>
              <span className="theme-text-primary">{userDetails.contactNumber || 'Not available'}</span>
            </div>
            <div className="detail-row">
              <label className="theme-text-secondary">Address:</label>
              <span className="theme-text-primary">{userDetails.address || 'Not available'}</span>
            </div>
            <div className="detail-row">
              <label className="theme-text-secondary">Role:</label>
              <span className="role-badge theme-accent">{userRole.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="theme-btn theme-btn-secondary" onClick={() => setShowProfile(false)}>Close</button>
          <button className="theme-btn theme-btn-primary" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );

  const EditProfileModal = () => (
    <div className="theme-modal-overlay" style={{ display: showEditProfile ? 'flex' : 'none' }}>
      <div ref={editProfileModalRef} className="theme-modal-content theme-card edit-profile-modal">
        <div className="modal-header">
          <h2 className="theme-text-primary">Edit Profile</h2>
          <button className="modal-close theme-btn-secondary" onClick={() => setShowEditProfile(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="edit-form">
            {userRole === 'user' ? (
              <>
                <div className="form-group">
                  <label className="theme-text-secondary">First Name</label>
                  <input
                    type="text"
                    className="theme-input"
                    value={editFormData.firstName || ''}
                    onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label className="theme-text-secondary">Last Name</label>
                  <input
                    type="text"
                    className="theme-input"
                    value={editFormData.lastName || ''}
                    onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="theme-text-secondary">NGO Name</label>
                <input
                  type="text"
                  className="theme-input"
                  value={editFormData.name || ''}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  placeholder="Enter NGO name"
                />
              </div>
            )}
            <div className="form-group">
              <label className="theme-text-secondary">Email</label>
              <input
                type="email"
                className="theme-input"
                value={editFormData.email || ''}
                onChange={(e) => handleEditFormChange('email', e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label className="theme-text-secondary">Contact Number</label>
              <input
                type="tel"
                className="theme-input"
                value={editFormData.contactNumber || ''}
                onChange={(e) => handleEditFormChange('contactNumber', e.target.value)}
                placeholder="Enter contact number"
              />
            </div>
            <div className="form-group">
              <label className="theme-text-secondary">Address</label>
              <textarea
                className="theme-input"
                value={editFormData.address || ''}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
                placeholder="Enter address"
                rows="3"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="theme-btn theme-btn-secondary" onClick={() => setShowEditProfile(false)}>Cancel</button>
          <button 
            className="theme-btn theme-btn-primary" 
            onClick={handleSaveProfile}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

  const SettingsModal = () => (
    <div className="theme-modal-overlay" style={{ display: showSettings ? 'flex' : 'none' }}>
      <div ref={settingsModalRef} className="theme-modal-content theme-card settings-modal">
        <div className="modal-header">
          <h2 className="theme-text-primary">Settings</h2>
          <button className="modal-close theme-btn-secondary" onClick={() => setShowSettings(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="settings-section">
            <h3 className="theme-text-primary">Appearance</h3>
            <div className="setting-item">
              <label className="theme-text-secondary">Theme:</label>
              <div className="theme-options">
                <button 
                  className={`theme-btn ${theme === 'light' ? 'theme-btn-primary' : 'theme-btn-secondary'}`}
                  onClick={() => handleThemeChange('light')}
                >
                  ☀️ Light
                </button>
                <button 
                  className={`theme-btn ${theme === 'dark' ? 'theme-btn-primary' : 'theme-btn-secondary'}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  🌙 Dark
                </button>
                <button 
                  className={`theme-btn ${theme === 'auto' ? 'theme-btn-primary' : 'theme-btn-secondary'}`}
                  onClick={() => handleThemeChange('auto')}
                >
                  🔄 Auto
                </button>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3 className="theme-text-primary">Profile</h3>
            <div className="setting-item">
              <button className="theme-btn theme-btn-secondary" onClick={handleEditProfile}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="settings-section">
            <h3 className="theme-text-primary">Notifications</h3>
            <div className="setting-item">
              <label className="checkbox-label theme-text-primary">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Email notifications
              </label>
            </div>
            <div className="setting-item">
              <label className="checkbox-label theme-text-primary">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                SMS notifications
              </label>
            </div>
          </div>
          
          <div className="settings-section">
            <h3 className="theme-text-primary">Privacy</h3>
            <div className="setting-item">
              <label className="checkbox-label theme-text-primary">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Make profile visible to NGOs
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="theme-btn theme-btn-secondary" onClick={() => setShowSettings(false)}>Close</button>
          <button className="theme-btn theme-btn-primary" onClick={() => {
            setShowSettings(false);
            alert('Settings saved successfully!');
          }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="profile-container theme-surface">
        {/* Display username next to profile icon */}
        {isLoggedIn && (
          <span className="profile-username theme-text-primary">{getDisplayName()}</span>
        )}
        
        <div 
          ref={iconRef}
          className={`profile-icon ${showMenu ? 'active' : ''}`}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu();
            }
          }}
          aria-label="Profile menu"
        >
          {isLoggedIn ? (
            <span className="profile-initials">{getUserInitials()}</span>
          ) : (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
                fill="currentColor"
              />
              <path 
                d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" 
                fill="currentColor"
              />
            </svg>
          )}
          <div className="profile-status-dot"></div>
        </div>

        {showMenu && (
          <div ref={menuRef} className={`dropdown-menu theme-card ${showMenu ? 'show' : ''}`}>
            <div className="menu-header">
              <div className="user-info">
                <div className="user-avatar">
                  {isLoggedIn ? getUserInitials() : '?'}
                </div>
                <div className="user-details">
                  <span className="user-name theme-text-primary">{isLoggedIn ? getDisplayName() : 'Guest'}</span>
                  <span className="user-status theme-text-secondary">{isLoggedIn ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            
            <div className="menu-divider theme-border"></div>
            
            <div className="menu-items">
              {isLoggedIn && (
                <>
                  <button className="menu-item theme-text-primary" onClick={handleProfile}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                    </svg>
                    <span>My Profile</span>
                  </button>
                  
                  <button className="menu-item" onClick={handleSettings}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" fill="currentColor"/>
                    </svg>
                    <span>Settings</span>
                  </button>
                  
                  <div className="menu-divider"></div>
                </>
              )}
              
              <button className={`menu-item ${isLoggedIn ? 'logout' : 'login'}`} onClick={handleAuth}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  {isLoggedIn ? (
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
                <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProfileModal />
      <EditProfileModal/>
      <SettingsModal />
    </>
  );
};

export default ProfileIcon;