import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import LandingFooter from '@/components/layout/LandingFooter';
import useVisitorTracker from '@/hooks/useVisitorTracker';

/**
 * layouts/MainLayout.jsx
 *
 * The default shell for public-facing pages.
 * Wraps children with the global AppHeader and LandingFooter.
 * Conditionally hides them on standalone application routes.
 * Also fires the visitor tracker on every page change.
 *
 * Props:
 *   - theme        {string}   Current theme ('light' | 'dark')
 *   - onToggleTheme {Function} Toggle callback
 *   - children     {ReactNode}
 */
const MainLayout = ({ theme, onToggleTheme, children }) => {
  const location = useLocation();
  
  const isStandaloneApp = 
    location.pathname.startsWith('/job-portal/admin') || 
    location.pathname.startsWith('/AdminPortal') ||
    location.pathname.startsWith('/chaitanya-tech-world') ||
    location.pathname.startsWith('/lms');

  // Track every public page visit with full metadata
  useVisitorTracker();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isStandaloneApp && <AppHeader theme={theme} onToggleTheme={onToggleTheme} />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children || <Outlet />}
      </main>
      {!isStandaloneApp && <LandingFooter />}
    </div>
  );
};

export default MainLayout;

