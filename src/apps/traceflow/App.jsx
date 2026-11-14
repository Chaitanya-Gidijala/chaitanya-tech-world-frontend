import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import Home from './pages/Home.jsx';
import Catalogue from './pages/Catalogue.jsx';
import AlgorithmDetail from './pages/AlgorithmDetail.jsx';
import Visualizer from './pages/Visualizer.jsx';
import Compare from './pages/Compare.jsx';

// Core styles — tokens (aliases of the CTW design system) first, then base.
import './styles/tokens.css';
import './styles/base.css';

/**
 * TraceflowApp — mounted at /traceflow/* inside the shared SiteLayout, so it uses
 * the same SiteHeader and SiteFooter as the rest of the site. The visualiser is
 * a full-screen workspace and renders without site chrome (see SiteLayout).
 */
export default function TraceflowApp() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div data-tf="true" data-tf-theme={theme}>
      <Routes>
        <Route path="/visualizer/:slug" element={<Visualizer theme={theme} toggleTheme={toggleTheme} />} />
        <Route
          path="/*"
          element={
            <div className="tf-page tf-shell">
              <div className="tf-shell__main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogue" element={<Catalogue />} />
                  <Route path="/algorithm/:slug" element={<AlgorithmDetail />} />
                  <Route path="/compare/:pair" element={<Compare />} />
                  <Route path="*" element={<Navigate to="/traceflow" replace />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
