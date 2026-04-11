import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '@/pages/common/LandingPage';
import ContactPage from '@/pages/common/ContactPage';
import NotFound from '@/pages/NotFound';

import OurServicesApp from '@/features/our-services';
import JobPortalApp from '@/features/job-portal';
import AIResumeBuilderApp from '@/features/ai-resume-builder';
import LoginPage from '@/features/auth/Login';
import SignupPage from '@/features/auth/Signup';
import ProfilePage from '@/features/auth/Profile';
import OurServices from '@/features/our-services/OurServices';
import AdminPortalApp from '@/features/admin-portal';
import { isAuthenticated } from '@/features/job-portal/services/authService';
import { Navigate } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';

/**
 * routes/AppRoutes.jsx
 *
 * Centralized routing configuration for the entire application.
 * All routes are wrapped in MainLayout, which conditionally
 * renders the global header and footer based on the route.
 *
 * Props:
 *   - theme        {string}
 *   - toggleTheme  {Function}
 */

const AuthProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
const AppRoutes = ({ theme, toggleTheme }) => {
  return (
    <MainLayout theme={theme} onToggleTheme={toggleTheme}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/our-services" element={<OurServices />} />
        <Route path="/services/*" element={<OurServicesApp />} />
        <Route path="/ai-resume-builder/*" element={<AIResumeBuilderApp />} />
        <Route path="/job-portal/*" element={<JobPortalApp />} />
        <Route path="/AdminPortal/*" element={<AdminPortalApp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/profile" 
          element={
            <AuthProtectedRoute>
              <ProfilePage />
            </AuthProtectedRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;
