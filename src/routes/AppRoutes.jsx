import { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary';

import SiteLayout from '@/layouts/SiteLayout';
import RouteFallback from './RouteFallback';

// Route-level code splitting: each page ships in its own chunk.
const HomePage = lazyWithRetry(() => import('@/features/home/HomePage'));
const ContactPage = lazyWithRetry(() => import('@/pages/common/ContactPage'));
const PortfolioPage = lazyWithRetry(() => import('@/features/portfolio-v2/PortfolioPage'));
const PromptsApp = lazyWithRetry(() => import('@/features/prompts-gallery/PromptsApp'));
const RoadmapHomePage = lazyWithRetry(() => import('@/features/roadmap/RoadmapHomePage'));
const RoadmapPage = lazyWithRetry(() => import('@/features/roadmap/RoadmapPage'));
const ClaudeCertificationsPage = lazyWithRetry(() => import('@/features/roadmap/ClaudeCertificationsPage'));
const ClaudeCertPage = lazyWithRetry(() => import('@/features/roadmap/ClaudeCertPage'));
const TraceflowApp = lazyWithRetry(() => import('@/apps/traceflow/App'));
const DailyChallengePage = lazyWithRetry(() => import('@/features/daily-challenge/DailyChallengePage'));
const ProgressPage = lazyWithRetry(() => import('@/features/engagement/pages/ProgressPage'));
const AdminApp = lazyWithRetry(() => import('@/apps/admin/AdminApp'));
const LeaderboardPage = lazyWithRetry(() => import('@/features/growth/LeaderboardPage'));
const CertificatePage = lazyWithRetry(() => import('@/features/growth/CertificatePage'));
const NewsletterPage = lazyWithRetry(() => import('@/features/growth/NewsletterPage'));
const DailyArchivePage = lazyWithRetry(() => import('@/features/daily-challenge/DailyArchivePage'));
const PracticePuzzlePage = lazyWithRetry(() => import('@/features/daily-challenge/DailyChallengePage').then((m) => ({ default: m.PracticePuzzlePage })));
const OAuthCallbackPage = lazyWithRetry(() => import('@/features/account/OAuthCallbackPage'));

/*
 * Disabled feature routes (kept for reference — re-enable by importing and adding a <Route>):
 *   /support-me, /our-services, /services/*, /ai-resume-builder/*, /job-portal/*,
 *   /AdminPortal/*, /admin/images, /admin-prompts, /login, /signup,
 *   /oauth2/callback, /profile, /tutorial/:courseId/:topicId?
 */

const AppRoutes = () => {
  const { pathname } = useLocation();
  return (
  <RouteErrorBoundary resetKey={pathname}>
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* ── Standalone (own chrome) ── */}
      {/* /portfolio is intentionally not linked from any navigation yet. */}
      <Route path="/portfolio" element={<PortfolioPage />} />
      {/* Admin dashboard — own chrome, reached only by typing /admin/login. */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* ── Site pages (SiteHeader + SiteFooter) ── */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/roadmap" element={<RoadmapHomePage />} />
        <Route path="/roadmap/certifications/claude" element={<ClaudeCertificationsPage />} />
        <Route path="/roadmap/certifications/:certName" element={<ClaudeCertPage />} />
        <Route path="/roadmap/:tech" element={<RoadmapPage />} />
        <Route path="/prompts/*" element={<PromptsApp />} />
        <Route path="/traceflow/*" element={<TraceflowApp />} />
        <Route path="/daily" element={<DailyChallengePage />} />
        <Route path="/daily/archive" element={<DailyArchivePage />} />
        <Route path="/daily/practice/:n" element={<PracticePuzzlePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/certificate/:code" element={<CertificatePage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Routes>
  </Suspense>
  </RouteErrorBoundary>
  );
};

export default AppRoutes;
