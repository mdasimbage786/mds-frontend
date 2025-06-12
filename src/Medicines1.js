import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './Medicines.css';
import { useNavigate } from 'react-router-dom';

const Medicines1 = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('https://mds-backend-zlp1.onrender.com/api/medicines');
        setMedicines(response.data);
        setFilteredMedicines(response.data);
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(value) ||
        med.address.toLowerCase().includes(value)
    );
    setFilteredMedicines(filtered);
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

      <Navbar2 />
      <h2>Available Medicines</h2>

      {/* ✅ Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by medicine name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading medicines: {error.message}</div>
      ) : (
        <div className="medicine-list">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine) => (
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
            <div>No medicines found.</div>
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

export default Medicines1;
