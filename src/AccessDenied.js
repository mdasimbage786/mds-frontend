// src/AccessDenied.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-wrapper">
      <div className="access-denied-card">
        <h1>🚫 Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <div className="access-denied-buttons">
          <button onClick={() => navigate('/')} className="btn btn-secondary1">Go to Home</button>
          <button onClick={() => {
            localStorage.clear();
            navigate('/login');
          }} className="btn btn-primary1">Login Again</button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
