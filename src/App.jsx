import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@/context/ThemeContext';
import AppRoutes from '@/routes/AppRoutes';
import { initGA, logPageView } from '@/utils/analytics';
import AchievementToaster from '@/features/engagement/components/AchievementToaster';
import { trackPage } from '@/features/monitoring/tracker';

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
    // Admin pages are private: no analytics, no monitoring of the admin's own browsing.
    if (!location.pathname.startsWith('/admin')) logPageView(location.pathname + location.search);
    trackPage(location.pathname);
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
        <AchievementToaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
