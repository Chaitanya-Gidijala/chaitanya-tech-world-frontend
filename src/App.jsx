import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useTheme } from '@/hooks/useTheme';
import AppRoutes from '@/routes/AppRoutes';
import '@/styles/global.css';

const queryClient = new QueryClient();

/**
 * AppContent
 * Consumes the Router context and coordinates theme + scroll-reset.
 */
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <AppRoutes theme={theme} toggleTheme={toggleTheme} />;
}

/**
 * App
 * Root component — provides QueryClient context.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;