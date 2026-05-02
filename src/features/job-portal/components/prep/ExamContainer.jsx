import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MCQExamPage from './MCQExamPage';
import { PREP_TESTS } from '../../data/prepData';
import { getQuizById } from '../../services/prepService';
import { ToastProvider } from '@/components/ui/Toast';

const ExamContainer = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTest = async () => {
            setLoading(true);
            try {
                const data = await getQuizById(testId);
                const fallbackTest = PREP_TESTS.find((quiz) => String(quiz.id) === String(testId)) || null;
                setTest(data || fallbackTest);
            } catch (err) {
                console.error("Failed to fetch test", err);
                const fallbackTest = PREP_TESTS.find((quiz) => String(quiz.id) === String(testId)) || null;
                setTest(fallbackTest);
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [testId]);

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--iq-bg)' }}>
            <div className="jp-spinner"></div>
        </div>
    );

    if (!test) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--iq-bg)', color: 'var(--iq-text)' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Test Not Found</h2>
                <button onClick={() => window.close()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Close Window</button>
            </div>
        </div>
    );

    if (!Array.isArray(test.questions) || test.questions.length === 0) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--iq-bg)', color: 'var(--iq-text)' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
                    <h2>Assessment Not Ready</h2>
                    <p style={{ color: 'var(--iq-text-dim)', marginTop: '0.5rem' }}>This assessment is not ready yet. Please publish questions from admin.</p>
                    <button onClick={() => window.close()} style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Close Window</button>
                </div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <MCQExamPage test={test} onComplete={() => window.close()} />
        </ToastProvider>
    );
};

export default ExamContainer;
