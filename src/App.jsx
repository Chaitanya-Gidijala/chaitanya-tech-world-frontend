import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@/context/ThemeContext';
import AppRoutes from '@/routes/AppRoutes';
import { initGA, logPageView } from '@/utils/analytics';

const queryClient = new QueryClient();

/**
 * AppContent
 * Consumes the Router context and coordinates scroll-reset + analytics.
 */
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Keep in-page anchor navigation (e.g. #section links) working.
    if (!location.hash) window.scrollTo(0, 0);
    logPageView(location.pathname + location.search);
  }, [location]);

  return <AppRoutes />;
}

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
