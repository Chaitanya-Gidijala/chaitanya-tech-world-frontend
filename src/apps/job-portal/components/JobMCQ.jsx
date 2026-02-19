import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, RefreshCw, ChevronRight } from 'lucide-react';

const JobMCQ = ({ questions, title = "Skill Assessment" }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleOptionSelect = (questionId, optionIndex) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        return Math.round((correctCount / questions.length) * 100);
    };

    const resetQuiz = () => {
        setAnswers({});
        setSubmitted(false);
        setCurrentQuestionIndex(0);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const allAnswered = questions.every(q => answers[q.id] !== undefined);

    if (!questions || questions.length === 0) return null;

    return (
        <div className="jp-details-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={24} color="var(--jp-primary)" />
                {title}
            </h3>

            <div style={{
                background: 'var(--jp-card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--jp-border-color)',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ padding: '2rem' }}
                        >
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: 'var(--jp-text-muted)' }}>
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </span>
                                <div style={{
                                    height: '8px',
                                    width: '120px',
                                    background: 'var(--jp-bg-secondary)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                                        background: 'var(--jp-primary)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--jp-text-main)' }}>
                                    {questions[currentQuestionIndex].question}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {questions[currentQuestionIndex].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(questions[currentQuestionIndex].id, idx)}
                                            style={{
                                                padding: '1rem',
                                                border: `2px solid ${answers[questions[currentQuestionIndex].id] === idx ? 'var(--jp-primary)' : 'var(--jp-border-color)'}`,
                                                borderRadius: '8px',
                                                background: answers[questions[currentQuestionIndex].id] === idx ? 'var(--jp-bg-secondary)' : 'transparent',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                color: 'var(--jp-text-main)',
                                                fontWeight: 500,
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}
                                        >
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: `2px solid ${answers[questions[currentQuestionIndex].id] === idx ? 'var(--jp-primary)' : 'var(--jp-text-muted)'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {answers[questions[currentQuestionIndex].id] === idx && (
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--jp-primary)' }} />
                                                )}
                                            </div>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="jp-btn jp-btn-outline"
                                    style={{ visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}
                                >
                                    Previous
                                </button>

                                {currentQuestionIndex === questions.length - 1 ? (
                                    <button
                                        onClick={() => setSubmitted(true)}
                                        disabled={!allAnswered}
                                        className="jp-btn jp-btn-primary"
                                        style={{ opacity: allAnswered ? 1 : 0.5 }}
                                    >
                                        Submit Assessment
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        className="jp-btn jp-btn-primary"
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ padding: '2rem', textAlign: 'center' }}
                        >
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Assessment Complete!</h4>
                                <div style={{
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    color: getScoreColor(calculateScore()),
                                    marginBottom: '0.5rem'
                                }}>
                                    {calculateScore()}%
                                </div>
                                <p style={{ color: 'var(--jp-text-muted)' }}>
                                    You answered {questions.filter(q => answers[q.id] === q.correctAnswer).length} out of {questions.length} questions correctly.
                                </p>
                            </div>

                            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                {questions.map((q, index) => {
                                    const isCorrect = answers[q.id] === q.correctAnswer;
                                    return (
                                        <div key={index} style={{
                                            padding: '1rem',
                                            marginBottom: '1rem',
                                            border: `1px solid ${isCorrect ? '#10b98122' : '#ef444422'}`,
                                            background: isCorrect ? '#f0fdf4' : '#fef2f2',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                {isCorrect ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
                                                <span style={{ fontWeight: 600, color: '#374151' }}>{q.question}</span>
                                            </div>
                                            <div style={{ marginLeft: '1.75rem', fontSize: '0.9rem', color: '#4b5563' }}>
                                                <div style={{ marginBottom: '0.25rem' }}>
                                                    Your Answer:
                                                    <span style={{ fontWeight: 600, marginLeft: '0.5rem', color: isCorrect ? '#10b981' : '#ef4444' }}>
                                                        {q.options[answers[q.id]]}
                                                    </span>
                                                </div>
                                                {!isCorrect && (
                                                    <div>
                                                        Correct Answer:
                                                        <span style={{ fontWeight: 600, marginLeft: '0.5rem', color: '#10b981' }}>
                                                            {q.options[q.correctAnswer]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button onClick={resetQuiz} className="jp-btn jp-btn-outline">
                                <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                                Retake Assessment
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default JobMCQ;
