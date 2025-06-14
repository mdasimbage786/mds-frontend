import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileIcon.css';

const ProfileIcon = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const toggleMenu = () => setShowMenu(prev => !prev);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate('/Login');
    } else {
      navigate('/Login');
    }
    setShowMenu(false);
  };

  return (
    <div className="profile-container">
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="Profile"
        className="profile-icon"
        onClick={toggleMenu}
      />
      {showMenu && (
        <div className="dropdown-menu">
          <button onClick={handleAuth}>{isLoggedIn ? 'Logout' : 'Login'}</button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
