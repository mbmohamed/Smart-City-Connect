import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import MobilityHub from './pages/MobilityHub';
import AirQualityMonitor from './pages/AirQualityMonitor';
import EmergencyCenter from './pages/EmergencyCenter';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mobility" element={<MobilityHub />} />
            <Route path="/air-quality" element={<AirQualityMonitor />} />
            <Route path="/emergency" element={<EmergencyCenter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
