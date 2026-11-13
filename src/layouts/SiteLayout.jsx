import { Outlet, useMatch } from 'react-router-dom';
import { useSpotlight } from '@/design-system';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import useVisitorTracker from '@/hooks/useVisitorTracker';

/**
 * layouts/SiteLayout.jsx
 *
 * Shell for every page built on the CTW design system:
 * skip link → SiteHeader → page (<Outlet/>) → SiteFooter.
 *
 * Full-screen tools (the Traceflow visualiser) render without site chrome.
 */
export default function SiteLayout() {
  useVisitorTracker();
  useSpotlight();
  const isFullscreenTool = useMatch('/traceflow/visualizer/*');

  if (isFullscreenTool) return <Outlet />;

  return (
    <div className="ds-page">
      <a href="#main" className="ds-skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
