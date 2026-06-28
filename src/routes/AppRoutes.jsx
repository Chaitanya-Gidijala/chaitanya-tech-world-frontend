import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

import LandingPage from '@/pages/common/LandingPage';
import ContactPage from '@/pages/common/ContactPage';
import SupportPage from '@/pages/common/SupportPage';
import NotFound from '@/pages/NotFound';

import OurServicesApp from '@/features/our-services';
import JobPortalApp from '@/features/job-portal';
import ResultsPage from '@/features/job-portal/components/prep/ResultsPage';
import AIResumeBuilderApp from '@/features/ai-resume-builder';
import LoginPage from '@/features/auth/Login';
import SignupPage from '@/features/auth/Signup';
import ProfilePage from '@/features/auth/Profile';
import OAuth2Callback from '@/features/auth/OAuth2Callback';
import OurServices from '@/features/our-services/OurServices';
import AdminPortalApp from '@/features/admin-portal';
import { isAuthenticated } from '@/features/job-portal/services/authService';

import PromptsApp from '@/features/prompts-gallery/PromptsApp';
import AdminPromptsPage from '@/features/prompts-gallery/pages/AdminPromptsPage';
import RoadmapPage from '@/features/roadmap/RoadmapPage';
import RoadmapHomePage from '@/features/roadmap/RoadmapHomePage';

import MainLayout from '@/layouts/MainLayout';
import JobPortalExamContainer from '@/features/job-portal/components/prep/ExamContainer';

const AuthProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const StandaloneExamWrapper = () => {
  return <JobPortalExamContainer />;
};

const AppRoutes = ({ theme, toggleTheme }) => {
  return (
    <Routes>
      {/* ── STANDALONE ROUTES (No Header/Footer) ── */}
      <Route path="/job-portal/prep/exam/:testId" element={<StandaloneExamWrapper />} />

      {/* ── STANDARD ROUTES (With MainLayout) ── */}
      <Route element={<MainLayout theme={theme} onToggleTheme={toggleTheme} />}>
        <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/support-me" element={<SupportPage />} />
        <Route path="/our-services" element={<OurServices />} />
        <Route path="/services/*" element={<OurServicesApp />} />
        <Route path="/ai-resume-builder/*" element={<AIResumeBuilderApp />} />
        <Route path="/job-portal/prep/results" element={<ResultsPage />} />
        <Route path="/job-portal/*" element={<JobPortalApp />} />
        <Route path="/AdminPortal/*" element={<AdminPortalApp />} />
        <Route path="/prompts/*" element={<PromptsApp />} />
        <Route path="/roadmap" element={<RoadmapHomePage />} />
        <Route path="/roadmap/:tech" element={<RoadmapPage />} />
        <Route
          path="/admin-prompts"
          element={
            <AuthProtectedRoute>
              <AdminPromptsPage />
            </AuthProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route
          path="/profile"
          element={
            <AuthProtectedRoute>
              <ProfilePage />
            </AuthProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
