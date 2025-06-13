import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Apply from './Apply';
import Donate from './Donate';
import Medicines from './Medicines';
import Medicines1 from './Medicines1';
import Application from './Application';
import Dashboard from './Dashboard';
import PendingDonations from './PendingDonations';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/application" element={<Application />} />
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/pendingdonations" element={<PendingDonations />}/>
        <Route path="/medicines" element={<Medicines/>}/>
         <Route path="/medicines1" element={<Medicines1/>}/>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;