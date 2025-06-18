import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider'; // 👈 Import your ThemeProvider
import Home from './Home';
import Home1 from './Home1';
import Apply from './Apply';
import Donate from './Donate';
import Medicines from './Medicines';
import Medicines1 from './Medicines1';
import Medicines2 from './Medicines2';
import Application from './Application';
import Application1 from './Application1';
import Dashboard from './Dashboard';
import PendingDonations from './PendingDonations';
import PendingDonations1 from './PendingDonations1';
import Login from './Login';
import Register from './Register';
import AboutUs from './AboutUs';
import AboutUs1 from './AboutUs1';
import AboutUs2 from './AboutUs2';
import './PageTransition.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="fade-transition">
      <Routes location={location} key={location.pathname}>
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Home1 />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/application" element={<Application />} />
        <Route path="/application1" element={<Application1 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pendingdonations" element={<PendingDonations />} />
        <Route path="/pendingdonations1" element={<PendingDonations1 />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines2" element={<Medicines2 />} />
        <Route path="/medicines1" element={<Medicines1 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/aboutus1" element={<AboutUs1 />} />
        <Route path="/aboutus2" element={<AboutUs2 />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider> {/* 👈 Wrap everything with ThemeProvider */}
      <Router>
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;