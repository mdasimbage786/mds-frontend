import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import CSS for styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/Home">Home</Link></li>
        <li><Link to="/medicines">Medicines</Link></li>
        <li><Link to="/donate">Donate</Link></li>
        <li><Link to="/apply">Apply</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
