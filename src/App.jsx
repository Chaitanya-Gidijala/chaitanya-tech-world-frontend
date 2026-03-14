import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AppHeader from './components/AppHeader';
import { getInitialTheme, THEME_KEY } from './config/theme';
import './styles/global.css';

import PhotoEditorApp from './apps/photo-editor/PhotoEditorApp';
import JobPortalApp from './apps/job-portal/JobPortalApp';
import AIResumeBuilderApp from './apps/ai-resume-builder/AIResumeBuilderApp';
import LandingFooter from './components/LandingFooter';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isLanding = location.pathname === '/';
  const isAdminDashboard = location.pathname === '/job-portal/admin/dashboard';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Header */}
      {!isAdminDashboard && <AppHeader theme={theme} onToggleTheme={toggleTheme} />}

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/photo-editor/*" element={<PhotoEditorApp />} />
          <Route path="/job-portal/*" element={<JobPortalApp />} />
          <Route path="/ai-resume-builder/*" element={<AIResumeBuilderApp />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer */}
      {!isAdminDashboard && <LandingFooter />}
    </div>
  );
}

export default App;

