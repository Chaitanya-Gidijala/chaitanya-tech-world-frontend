import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import SiteLayout from '@/layouts/SiteLayout';
import RouteFallback from './RouteFallback';

// Route-level code splitting: each page ships in its own chunk.
const HomePage = lazy(() => import('@/features/home/HomePage'));
const ContactPage = lazy(() => import('@/pages/common/ContactPage'));
const PortfolioPage = lazy(() => import('@/features/portfolio-v2/PortfolioPage'));
const PromptsApp = lazy(() => import('@/features/prompts-gallery/PromptsApp'));
const RoadmapHomePage = lazy(() => import('@/features/roadmap/RoadmapHomePage'));
const RoadmapPage = lazy(() => import('@/features/roadmap/RoadmapPage'));
const ClaudeCertificationsPage = lazy(() => import('@/features/roadmap/ClaudeCertificationsPage'));
const ClaudeCertPage = lazy(() => import('@/features/roadmap/ClaudeCertPage'));
const TraceflowApp = lazy(() => import('@/apps/traceflow/App'));
const DailyChallengePage = lazy(() => import('@/features/daily-challenge/DailyChallengePage'));
const ProgressPage = lazy(() => import('@/features/engagement/pages/ProgressPage'));
const AdminApp = lazy(() => import('@/apps/admin/AdminApp'));

/*
 * Disabled feature routes (kept for reference — re-enable by importing and adding a <Route>):
 *   /support-me, /our-services, /services/*, /ai-resume-builder/*, /job-portal/*,
 *   /AdminPortal/*, /admin/images, /admin-prompts, /login, /signup,
 *   /oauth2/callback, /profile, /tutorial/:courseId/:topicId?
 */

const AppRoutes = () => (
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
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
