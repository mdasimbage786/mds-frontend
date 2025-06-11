import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './Medicines.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PendingDonations = () => {
  const [pendingDonations, setPendingDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingDonations();
  }, []);

  const fetchPendingDonations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/pending-donations');
      setPendingDonations(response.data);
      setFilteredDonations(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/pending-donations/${id}/approve`);
      const updated = pendingDonations.filter(d => d.id !== id);
      setPendingDonations(updated);
      setFilteredDonations(updated);
      toast.success('Donation approved and added to stock!');
    } catch (err) {
      console.error("Approval failed", err);
      toast.error('Failed to approve donation.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('ngoToken');
    navigate('/');
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = pendingDonations.filter(
      (donation) =>
        donation.name.toLowerCase().includes(value) ||
        donation.address.toLowerCase().includes(value)
    );
    setFilteredDonations(filtered);
  };

  return (
    <div className="apply-container">
      <Navbar2 />
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
      <h2>Pending Donations</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching data: {error.message}</p>
      ) : filteredDonations.length === 0 ? (
        <p>No pending donations.</p>
      ) : (
        <div className="medicine-list">
          {filteredDonations.map((donation) => (
            <div key={donation.id} className="medicine-item">
              <h3>{donation.name}</h3>
              <p><strong>Manufacturer:</strong> {donation.manufacturer}</p>
              <p><strong>Expiry Date:</strong> {donation.expiryDate}</p>
              <p><strong>Description:</strong> {donation.description}</p>
              <p><strong>Quantity:</strong> {donation.quantity}</p>
              <p><strong>Address:</strong> {donation.address}</p>
              <button className="approve-btn" onClick={() => handleApprove(donation.id)}>Collected</button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />

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

export default PendingDonations;
