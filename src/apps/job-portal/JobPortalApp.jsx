import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import JobFeed from './components/JobFeed';
import JobDetails from './components/JobDetails';
import PreparationHub from './components/prep/PreparationHub';
import InterviewQuestionsPage from './components/prep/InterviewQuestionsPage';
import ResourcesPage from './components/prep/ResourcesPage';
import MCQExamPage from './components/prep/MCQExamPage';
import TestsPage from './components/prep/TestsPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { isAuthenticated } from './services/authService';
import { getQuizById } from './services/prepService';
import './styles/job-portal.css';

import { ToastProvider } from './components/common/Toast';

import { incrementVisitorCount } from './services/analyticsService';

const JobPortalApp = () => {
    const navigate = useNavigate();

    const getBrowserInfo = () => {
        const ua = navigator.userAgent;
        let browser = "Other";
        if (ua.indexOf("Chrome") > -1) browser = "Chrome";
        else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
        else if (ua.indexOf("Safari") > -1) browser = "Safari";
        else if (ua.indexOf("Edge") > -1) browser = "Edge";

        const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
        return {
            browser,
            device: isMobile ? "Mobile" : "Desktop",
            os: ua.indexOf("Windows") > -1 ? "Windows" : ua.indexOf("Mac") > -1 ? "MacOS" : "Other"
        };
    };

    useEffect(() => {
        // Track unique visit per session
        if (!sessionStorage.getItem('jp_session_visit')) {
            const metadata = getBrowserInfo();
            incrementVisitorCount(metadata).catch(err => console.error("Tracking failed", err));
            sessionStorage.setItem('jp_session_visit', 'true');
        }
    }, []);

    const handleHubNavigate = (type, data) => {
        if (type === 'questions') navigate('/job-portal/prep/questions');
        if (type === 'resources-all') navigate('/job-portal/prep/resources');
        if (type === 'tests-all') navigate('/job-portal/prep/tests');
        if (type === 'mcq') navigate(`/job-portal/prep/exam/${data.id}`);
    };

    return (
        <ToastProvider>
            <div className="jp-app-wrapper" style={{
                minHeight: 'calc(100vh - 80px)',
                background: 'var(--jp-bg)',
                color: 'var(--jp-text-main)',
                transition: 'background-color 0.3s ease, color 0.3s ease'
            }}>
                <Routes>
                    <Route path="/" element={<JobFeed />} />
                    {/* <Route path="/job/:jobTitle" element={<JobDetails />} /> */}
                    <Route path="/job/:jobSlug/:jobId" element={<JobDetails />} />

                    {/* Preparation Routes */}
                    <Route path="/prep" element={<PreparationHub onNavigate={handleHubNavigate} />} />
                    <Route path="/prep/questions" element={<InterviewQuestionsPage />} />
                    <Route path="/prep/resources" element={<ResourcesPage />} />
                    <Route path="/prep/tests" element={<TestsPage onNavigate={handleHubNavigate} />} />
                    <Route path="/prep/exam/:testId" element={<ExamWrapper />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </ToastProvider>
    );
};

const ExamWrapper = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTest = async () => {
            setLoading(true);
            const data = await getQuizById(testId);
            setTest(data);
            setLoading(false);
        };
        fetchTest();
    }, [testId]);

    if (loading) return <div className="jp-spinner"></div>;
    if (!test) return <div>Test not found</div>;

    return <MCQExamPage test={test} onComplete={() => navigate('/job-portal/prep')} />;
};

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/job-portal/admin/login" replace />;
    }
    return children;
};

export default JobPortalApp;
