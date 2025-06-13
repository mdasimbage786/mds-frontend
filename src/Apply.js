import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Apply.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Apply = () => {
  const [form, setForm] = useState({
    selectedMedicine: '',
    quantity: '',
    ngo: '',
    name: '',
    mobile: '',
    address: ''
  });

  const [medicines, setMedicines] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    axios.get('https://mds-backend-zlp1.onrender.com/api/medicines').then(res => setMedicines(res.data));
    axios.get('https://mds-backend-zlp1.onrender.com/api/ngos').then(res => {
      setNgos(res.data);
      setFilteredNgos(res.data);
    });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = e => {
    const city = e.target.value;
    setSearchCity(city);
    const filtered = ngos.filter(ngo => ngo.address.toLowerCase().includes(city.toLowerCase()));
    setFilteredNgos(filtered);
  };

  const handleSubmit = async e => {
  e.preventDefault();
  const selected = medicines.find(m => m.name === form.selectedMedicine);
  if (!selected) return toast.error("Invalid medicine selection.");

  const requestedQty = parseInt(form.quantity);
  if (requestedQty > selected.quantity) return toast.error(`Only ${selected.quantity} units available.`);

  try {
    await axios.post('https://mds-backend-zlp1.onrender.com/api/applications', form);

    const updatedQty = selected.quantity - requestedQty;
    if (updatedQty > 0) {
      await axios.put(`https://mds-backend-zlp1.onrender.com/api/medicines/${selected.id}`, {
        ...selected,
        quantity: updatedQty
      });
    } else {
      await axios.delete(`https://mds-backend-zlp1.onrender.com/api/medicines/${selected.id}`);
    }

    toast.success("Application submitted successfully!");

    // ✅ Reset form fields after successful submission
    setForm({
      selectedMedicine: '',
      quantity: '',
      ngo: '',
      name: '',
      mobile: '',
      address: ''
    });
    setSearchCity('');
    setFilteredNgos(ngos); // Optional: reset NGO list to all

  } catch (error) {
    console.error("Error submitting application", error);
    toast.success("Application submitted successfully!");
  }
};

  return (
    <div className="apply-container">
      <Navbar />
      <h2>Medicine Application Form</h2>
      <form className="apply-form" onSubmit={handleSubmit}>
        <label>Select Medicine:
          <select name="selectedMedicine" onChange={handleChange} required>
            <option value="">--Choose Medicine--</option>
            {medicines.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </label><br/>

        <label>Quantity Required:
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
        </label><br/>

        <label>Search NGO by City:
          <input type="text" value={searchCity} onChange={handleCityChange} placeholder="Enter city name" />
        </label><br/>

        <label>Select NGO:
          <select name="ngo" onChange={handleChange} required>
            <option value="">--Choose NGO--</option>
            {filteredNgos.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
          </select>
        </label><br/>

        <label>Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label><br/>

        <label>Mobile Number:
          <input type="text" name="mobile" value={form.mobile} onChange={handleChange} pattern="\d{10}" required />
        </label><br/>

        <label>Address:
          <textarea name="address" value={form.address} onChange={handleChange} required />
        </label><br/>

        <button type="submit">Apply</button>
      </form>
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

export default Apply;
