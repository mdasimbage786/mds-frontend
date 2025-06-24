// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider'; // 👈 Theme provider

// Pages
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

// 👇 ProtectedRoute defined inside App.js
// inside App.js
import AccessDenied from './AccessDenied'; // 👈 import the component

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return children;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="fade-transition">
      <Routes location={location} key={location.pathname}>
        {/* Guest Routes */}
        <Route path="/Home1" element={<Home1 />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/medicines2" element={<Medicines2 />} />
        <Route path="/pendingdonations1" element={<PendingDonations1 />} />
        <Route path="/application1" element={<Application1 />} />
        <Route path="/aboutus" element={<AboutUs />} />

        {/* User Routes */}
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/apply" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Apply />
          </ProtectedRoute>
        } />
        <Route path="/donate" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Donate />
          </ProtectedRoute>
        } />
        <Route path="/medicines" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Medicines />
          </ProtectedRoute>
        } />
        <Route path="/aboutus1" element={
          <ProtectedRoute allowedRoles={['user']}>
            <AboutUs1 />
          </ProtectedRoute>
        } />

        {/* NGO Routes */}
        <Route path="/medicines1" element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <Medicines1 />
          </ProtectedRoute>
        } />
        <Route path="/pendingdonations" element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <PendingDonations />
          </ProtectedRoute>
        } />
        <Route path="/application" element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <Application />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/aboutus2" element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <AboutUs2 />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
