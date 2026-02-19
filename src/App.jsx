import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AppHeader from './components/AppHeader';
import { getInitialTheme, THEME_KEY } from './config/theme';
import './styles/global.css';

import PhotoEditorApp from './apps/photo-editor/PhotoEditorApp';
import SplitExpensesApp from './apps/split-expenses/SplitExpensesApp';
import TimeZoneApp from './apps/time-zone-converter/TimeZoneApp';
import TripPlannerApp from './apps/trip-planner/TripPlannerApp';
import HabitApp from './apps/habit-productivity/HabitApp';
import JobPortalApp from './apps/job-portal/JobPortalApp';
import LandingFooter from './components/LandingFooter';

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
          <Route path="/split-expenses/*" element={<SplitExpensesApp />} />
          <Route path="/time-zone-converter/*" element={<TimeZoneApp />} />
          <Route path="/trip-planner/*" element={<TripPlannerApp />} />
          <Route path="/habit-productivity/*" element={<HabitApp />} />
          <Route path="/job-portal/*" element={<JobPortalApp />} />
        </Routes>
      </main>

      {/* Global Footer */}
      {!isAdminDashboard && <LandingFooter />}
    </div>
  );
}

export default App;

