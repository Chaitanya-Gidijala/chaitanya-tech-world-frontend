import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScoreCard from './ScoreCard';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    useEffect(() => {
        // Reset scroll to top
        window.scrollTo(0, 0);
        
        // If no data (direct access), go back to prep
        if (!data) {
            navigate('/job-portal/prep');
        }
    }, [data, navigate]);

    if (!data) return null;

    return (
        <div className="iq-shell">
            <main className="iq-body" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                <ScoreCard
                    score={data.score}
                    total={data.total}
                    testTitle={data.testTitle}
                    results={data.questions.map((q, idx) => ({
                        question: q.question,
                        userAnswer: data.answers[idx],
                        correctAnswer: q.correctAnswer,
                        isCorrect: data.answers[idx] === q.correctAnswer
                    }))}
                    onRetake={() => {
                        // For retake, we just go back to the hub or original test
                        navigate('/job-portal/prep');
                    }}
                    tags={data.tags}
                />
            </main>
        </div>
    );
};

export default ResultsPage;
