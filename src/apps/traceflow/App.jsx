import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Catalogue from './pages/Catalogue.jsx';
import AlgorithmDetail from './pages/AlgorithmDetail.jsx';
import Visualizer from './pages/Visualizer.jsx';
import Footer from './components/Footer.jsx';

// Core Styles — tokens first, then base
import './styles/tokens.css';
import './styles/base.css';

export default function TraceflowApp() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div data-tf="true" data-tf-theme={theme}>
      <Routes>
        {/* Full-screen Visualizer */}
        <Route path="/visualizer/:slug" element={<Visualizer theme={theme} toggleTheme={toggleTheme} />} />

        {/* Standard Pages */}
        <Route
          path="/*"
          element={
            <div className="tf-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar theme={theme} toggleTheme={toggleTheme} />
              <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogue" element={<Catalogue />} />
                  <Route path="/algorithm/:slug" element={<AlgorithmDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </div>
  );
}
