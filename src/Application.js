import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar2 from './Navbar2';
import './Medicines.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/applications');
      setApplications(response.data);
      setFilteredApps(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/applications/${id}`);
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      setFilteredApps(updated);
      toast.success('Application marked as distributed!');
    } catch (err) {
      console.error("Delete failed", err);
      toast.error('Failed to delete application.');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = applications.filter(
      (app) =>
        app.name.toLowerCase().includes(value) ||
        app.address.toLowerCase().includes(value)
    );
    setFilteredApps(filtered);
  };

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error loading applications: {error.message}</div>;

  return (
    <div className="apply-container">
      <Navbar2 />
      <h2>Medicine Applications</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="medicine-list">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div key={app.id} className="medicine-item">
              <h3>{app.selectedMedicine}</h3>
              <p><strong>Quantity:</strong> {app.quantity}</p>
              <p><strong>NGO:</strong> {app.ngo}</p>
              <p><strong>Name:</strong> {app.name}</p>
              <p><strong>Mobile:</strong> {app.mobile}</p>
              <p><strong>Address:</strong> {app.address}</p>
              <button className="delete-btn" onClick={() => handleDelete(app.id)}>Distributed</button>
            </div>
          ))
        ) : (
          <div>No applications found.</div>
        )}
      </div>
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

export default Applications;
