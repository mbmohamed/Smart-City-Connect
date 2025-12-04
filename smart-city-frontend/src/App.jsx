import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import MobilityHub from './pages/MobilityHub';
import AirQualityMonitor from './pages/AirQualityMonitor';
import EmergencyCenter from './pages/EmergencyCenter';
import ChatBot from './components/ChatBot';

import { ApolloProvider } from '@apollo/client';
import client from './services/citizenService';
import CitizenEngagement from './pages/CitizenEngagement';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-bg-dark text-text-primary font-sans">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mobility" element={<MobilityHub />} />
              <Route path="/air-quality" element={<AirQualityMonitor />} />
              <Route path="/emergency" element={<EmergencyCenter />} />
              <Route path="/citizen" element={<CitizenEngagement />} />
            </Routes>
          </div>
          <ChatBot />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

