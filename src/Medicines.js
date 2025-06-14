import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Medicines.css';
import { useNavigate } from 'react-router-dom';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('https://mds-backend-zlp1.onrender.com/api/medicines');
        setMedicines(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('ngoToken');
    navigate('/');
  };

  return (
    <div className="apply-container">
      
      {/* ✅ Profile Icon and Dropdown */}
      <div className="profile-menu">
  <div
    className="profile-icon"
    onClick={() => setShowDropdown(!showDropdown)}
    title="Profile"
  >
    👤
  </div>
  {showDropdown && (
    <div className="dropdown">
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
</div>

<Navbar />
      <h2>Available Medicines</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading medicines: {error.message}</div>
      ) : (
        <div className="medicine-list">
          {medicines.length > 0 ? (
            medicines.map((medicine) => (
              <div key={medicine.id} className="medicine-item">
                <h3>{medicine.name}</h3>
                <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
                <p><strong>Expiry Date:</strong> {medicine.expiryDate}</p>
                <p><strong>Description:</strong> {medicine.description}</p>
                <p><strong>Quantity:</strong> {medicine.quantity}</p>
                <p><strong>Address:</strong> {medicine.address}</p>
              </div>
            ))
          ) : (
            <div>No medicines available.</div>
          )}
        </div>
      )}

       <footer className="home-footer">
        <p>
          📧 <a href="mailto:asimbage0786@gmail.com">support@gmail.com</a> | 
          📞 <a href="tel:+919686117020">+91 9686117020</a> | 
          🔗 <a href="https://www.linkedin.com/in/mohammedasim-bage-4290b22a9" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
          📸 <a href="https://www.instagram.com/mdasimb_18" target="_blank" rel="noopener noreferrer">Instagram</a>
        </p>
      </footer>
    </div>
  );
};

export default Medicines;
