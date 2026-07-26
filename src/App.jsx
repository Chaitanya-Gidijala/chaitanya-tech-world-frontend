import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useTheme } from '@/hooks/useTheme';
import AppRoutes from '@/routes/AppRoutes';
import { initGA, logPageView } from '@/utils/analytics';
import '@/styles/global.css';

const queryClient = new QueryClient();

/**
 * AppContent
 * Consumes the Router context and coordinates theme + scroll-reset.
 */
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Scroll to top and log page view on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    logPageView(location.pathname + location.search);
  }, [location]);

  return <AppRoutes theme={theme} toggleTheme={toggleTheme} />;
}

/**
 * App
 * Root component — provides QueryClient context.
 */
function App() {
  // Initialize Google Analytics once when the app starts
  useEffect(() => {
    initGA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;