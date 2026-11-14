import { Suspense } from 'react';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminShell, { RequireAdmin } from './components/AdminShell';
import LoginPage from './pages/LoginPage';
import { SkeletonRows } from './components/ui';
import './admin.css';

const OverviewPage = lazyWithRetry(() => import('./pages/OverviewPage'));
const LivePage = lazyWithRetry(() => import('./pages/LivePage'));
const LogsPage = lazyWithRetry(() => import('./pages/LogsPage'));
const HealthPage = lazyWithRetry(() => import('./pages/HealthPage'));
const InquiriesPage = lazyWithRetry(() => import('./pages/InquiriesPage'));
const UsersPage = lazyWithRetry(() => import('./pages/UsersPage'));
const PromptsPage = lazyWithRetry(() => import('./pages/PromptsPage'));

const page = (Component) => (
  <Suspense
    fallback={
      <div className="ad-page">
        <SkeletonRows rows={8} />
      </div>
    }
  >
    <Component />
  </Suspense>
);

/**
 * Admin app — mounted at /admin/* with its own chrome (no site header/footer).
 * Not linked from anywhere on the public site; /admin/login is reached by URL.
 */
export default function AdminApp() {
  return (
    <div className="ad-root">
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <RequireAdmin>
              <AdminShell />
            </RequireAdmin>
          }
        >
          <Route index element={page(OverviewPage)} />
          <Route path="live" element={page(LivePage)} />
          <Route path="logs" element={page(LogsPage)} />
          <Route path="health" element={page(HealthPage)} />
          <Route path="inquiries" element={page(InquiriesPage)} />
          <Route path="users" element={page(UsersPage)} />
          <Route path="prompts" element={page(PromptsPage)} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
