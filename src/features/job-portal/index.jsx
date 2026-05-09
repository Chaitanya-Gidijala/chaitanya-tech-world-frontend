import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import JobFeed from './components/JobFeed';
import JobDetails from './components/JobDetails';
import PreparationHub from './components/prep/PreparationHub';
import InterviewQuestionsPage from './components/prep/InterviewQuestionsPage';
import ResourcesPage from './components/prep/ResourcesPage';
import MCQExamPage from './components/prep/MCQExamPage';
import TestsPage from './components/prep/TestsPage';
import PrepDetailView from './components/prep/PrepDetailView';
import { PREP_TESTS } from './data/prepData';
import { getQuizById } from './services/prepService';
import './styles/job-portal.css';

import { ToastProvider } from '@/components/ui/Toast';

import { incrementVisitorCount } from './services/analyticsService';

const JobPortalApp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

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
        // Track unique visit per day per user
        const lastVisit = localStorage.getItem('jp_last_visit_date');
        const today = new Date().toISOString().split('T')[0];

        if (lastVisit !== today) {
            const metadata = getBrowserInfo();
            incrementVisitorCount(metadata)
                .then(() => {
                    localStorage.setItem('jp_last_visit_date', today);
                })
                .catch(err => console.error("Tracking failed", err));
        }
    }, []);

    const handleHubNavigate = (type, data) => {
        if (type === 'questions') navigate('/job-portal/prep/questions');
        if (type === 'resources-all') navigate('/job-portal/prep/resources');
        if (type === 'tests-all') navigate('/job-portal/prep/tests');
        if (type === 'view-question') navigate(`/job-portal/prep/view/question/${data.id}`);
        if (type === 'view-resource') navigate(`/job-portal/prep/view/resource/${data.id}`);
        if (type === 'mcq') {
            // Open exam in a new tab
            window.open(`/job-portal/prep/exam/${data.id}`, '_blank');
        }
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
                    <Route path="/prep/view/:type/:id" element={<PrepDetailView />} />
                </Routes>
            </div>
        </ToastProvider>
    );
};


export default JobPortalApp;
