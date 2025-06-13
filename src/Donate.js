import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Donate1.css';

const Donate = () => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    expiryDate: '',
    description: '',
    quantity: 0,
    address: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format expiry date
      const formattedData = {
        ...formData,
        expiryDate: formatDate(formData.expiryDate),
      };

      // Post to pending donations instead of medicines
      const response = await axios.post('https://mds-backend-zlp1.onrender.com/api/pending-donations', formattedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Donation in Process..');
        setFormData({
          name: '',
          manufacturer: '',
          expiryDate: '',
          description: '',
          quantity: 0,
          address: '',
        });
      } else {
        toast.error('Failed to submit donation.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Submission failed.');
    }
  };

  return (
    <div className="donate-container">
      <Navbar />
      <h2>Donate Medicine</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Medicine Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="manufacturer">Manufacturer:</label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Donate</button>
        </form>
      </div>
      <ToastContainer />

      <footer className="home-footer">
        <p>
          📧 <a href="mailto:asimbage0786@gmail.com" color='black'>support@gmail.com</a> | 
          📞 <a href="tel:+919686117020" color='black'>+91 9686117020</a> | 
          🔗 <a href="https://www.linkedin.com/in/mohammedasim-bage-4290b22a9" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
          📸 <a href="https://www.instagram.com/mdasimb_18" target="_blank" rel="noopener noreferrer">Instagram</a>
        </p>
      </footer>
    </div>
  );
};

export default Donate;
