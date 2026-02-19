
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Target, ChevronLeft, ChevronRight, Bookmark, AlertTriangle, ShieldCheck, Lock, Info, AlertCircle, Shield, Menu, X, Grid } from 'lucide-react';
import confetti from 'canvas-confetti';
import ScoreCard from './ScoreCard';
import { useToast } from '../common/Toast';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MCQExamPage = ({ test, onComplete }) => {
    const [view, setView] = useState('instructions'); // 'instructions' or 'exam'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [marked, setMarked] = useState([]);
    const [timeLeft, setTimeLeft] = useState(test.duration * 60); // Initialized with test.duration
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const { showToast } = useToast();
    const [warnings, setWarnings] = useState(0);
    const [lastViolation, setLastViolation] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect for showing toasts to avoid 'setState during render'
    useEffect(() => {
        if (lastViolation) {
            const { msg, count } = lastViolation;
            showToast(`${msg} (Warning ${count}/3)`, 'warning');
            if (count >= 3) {
                showToast('Assessment terminated due to multiple violations.', 'error');
                finishTest(); // Changed to finishTest
            }
            setLastViolation(null);
        }
    }, [lastViolation, showToast]);

    // Proctoring Logic
    const handleProctoringViolation = useCallback((msg) => {
        if (view !== 'exam' || isSubmitted) return;

        setWarnings(prev => {
            const next = prev + 1;
            setLastViolation({ msg, count: next });
            return next;
        });
    }, [view, isSubmitted]);

    useEffect(() => {
        if (view !== 'exam' || isSubmitted) return;

        // Prevent Copy/Paste/Right-Click
        const preventDefault = (e) => {
            e.preventDefault();
            handleProctoringViolation("Action not allowed during assessment.");
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'hidden') {
                handleProctoringViolation("Tab switch detected!");
            }
        };

        const handleBlur = () => {
            handleProctoringViolation("Window focus lost!");
        };

        document.addEventListener('contextmenu', preventDefault);
        document.addEventListener('copy', preventDefault);
        document.addEventListener('paste', preventDefault);
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('contextmenu', preventDefault);
            document.removeEventListener('copy', preventDefault);
            document.removeEventListener('paste', preventDefault);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('blur', handleBlur);
        };
    }, [view, isSubmitted, handleProctoringViolation]);

    // Timer logic
    useEffect(() => {
        if (view !== 'exam' || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const updated = prev - 1;
                if (updated <= 0) {
                    clearInterval(timer);
                    finishTest(); // Changed to finishTest
                }
                return updated;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [view, isSubmitted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (option) => {
        setAnswers({ ...answers, [currentIndex]: option });
    };

    const toggleMark = () => {
        if (marked.includes(currentIndex)) {
            setMarked(marked.filter(i => i !== currentIndex));
        } else {
            setMarked([...marked, currentIndex]);
        }
    };

    const finishTest = () => { // Renamed from handleSubmit
        if (isSubmitted) return;
        let finalScore = 0;
        test.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) finalScore++;
        });
        setScore(finalScore);
        setIsSubmitted(true);

        // Show confetti only if passed (score >= 60%)
        const percentage = (finalScore / test.questions.length) * 100;
        if (percentage >= 60) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    // Instructions View
    // Instructions View
    if (view === 'instructions') {
        return (
            <div className="jp-container" style={{ padding: isMobile ? '1rem' : '1.5rem', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="jp-card"
                    style={{
                        padding: '0',
                        overflow: 'hidden',
                        borderRadius: '20px',
                        border: '1px solid var(--jp-border)',
                        boxShadow: 'var(--jp-shadow-lg)'
                    }}
                >
                    {/* Header Section */}
                    <div style={{ padding: isMobile ? '1.5rem' : '2rem', background: 'var(--jp-bg-secondary)', borderBottom: '1px solid var(--jp-border)', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'var(--jp-primary)',
                            color: 'white',
                            marginBottom: '1rem',
                            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                        }}>
                            <ShieldCheck size={24} />
                        </div>
                        <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 800, color: 'var(--jp-text-main)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                            {test.title}
                        </h1>
                        <p style={{ fontSize: '0.9rem', color: 'var(--jp-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                            Please review the rules before starting.
                        </p>
                    </div>

                    {/* Stats Strip */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--jp-border)' }}>
                        <div style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRight: '1px solid var(--jp-border)' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--jp-text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Duration</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--jp-text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                                <Clock size={16} className="text-indigo-500" /> {test.duration}m
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--jp-text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Questions</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--jp-text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                                <Target size={16} className="text-emerald-500" /> {test.questions.length}
                            </div>
                        </div>
                    </div>

                    {/* Rules Section */}
                    <div style={{ padding: isMobile ? '1.5rem' : '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--jp-text-main)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Examination Rules
                            </h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: 0, margin: 0, listStyle: 'none' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--jp-text-muted)', alignItems: 'flex-start' }}>
                                    <Lock size={16} style={{ color: '#ef4444', marginTop: '0.1rem', flexShrink: 0 }} />
                                    <span>Copy-paste functionality is strictly disabled.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--jp-text-muted)', alignItems: 'flex-start' }}>
                                    <AlertTriangle size={16} style={{ color: '#f59e0b', marginTop: '0.1rem', flexShrink: 0 }} />
                                    <span>Tab switching will trigger immediate warnings.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--jp-text-muted)', alignItems: 'flex-start' }}>
                                    <Info size={16} style={{ color: '#3b82f6', marginTop: '0.1rem', flexShrink: 0 }} />
                                    <span>Auto-submit occurs after <strong>3 violations</strong>.</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setView('exam')}
                            className="jp-btn jp-btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 800,
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                            }}
                        >
                            Start Assessment <ChevronRight size={18} />
                        </button>

                        <button
                            onClick={() => window.history.back()}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--jp-text-muted)',
                                width: '100%',
                                padding: '1rem',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                marginTop: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="jp-exam-container" style={{ overflowY: 'auto' }}>
                <div className="jp-container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                    <ScoreCard
                        score={score}
                        total={test.questions.length}
                        testTitle={test.title}
                        results={test.questions.map((q, idx) => ({
                            question: q.question,
                            userAnswer: answers[idx],
                            correctAnswer: q.correctAnswer,
                            isCorrect: answers[idx] === q.correctAnswer
                        }))}
                        onRetake={() => {
                            setIsSubmitted(false);
                            setAnswers({});
                            setMarked([]);
                            setTimeLeft(test.duration * 60);
                            setCurrentIndex(0);
                            setWarnings(0);
                            setView('instructions');
                        }}
                        tags={test.tags}
                    />
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentIndex];

    return (
        <div className="jp-exam-container">
            {/* Dedicated Header */}
            <header className="jp-exam-header" style={{ backdropFilter: 'blur(10px)', background: 'var(--jp-glass-bg)', borderBottomColor: 'var(--jp-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{ padding: '0.6rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }}>
                        <Target size={20} />
                    </div>
                    <div className="jp-mobile-hide">
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--jp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.1rem' }}>Assessments / Exam</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--jp-text-main)' }}>{test.title}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="jp-mobile-hide" style={{ textAlign: 'right', minWidth: '140px', marginRight: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--jp-text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span>Progress</span>
                            <span>{Math.round((Object.keys(answers).length / test.questions.length) * 100)}%</span>
                        </div>
                        <div style={{ height: '8px', width: '100%', background: 'var(--jp-bg-secondary)', borderRadius: '100px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(Object.keys(answers).length / test.questions.length) * 100}%` }}
                                transition={{ type: "spring", stiffness: 50 }}
                                style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)' }}
                            />
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: timeLeft < 60 ? '#ef4444' : 'var(--jp-primary)',
                        background: timeLeft < 60 ? '#fff1f2' : 'var(--jp-bg-secondary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: timeLeft < 60 ? '#fecdd3' : 'var(--jp-border)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        minWidth: '85px',
                        justifyContent: 'center'
                    }}>
                        <Clock size={16} /> {formatTime(timeLeft)}
                    </div>

                    {warnings > 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#d97706',
                            background: '#fffbeb',
                            padding: '0.5rem 0.85rem',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            border: '1px solid #fde68a',
                            whiteSpace: 'nowrap'
                        }}>
                            <AlertTriangle size={16} />
                            <span>{warnings} <span className="jp-text-finish">Warnings</span></span>
                        </div>
                    )}

                    <button
                        onClick={() => setShowFinishConfirm(true)}
                        className="jp-btn-finish"
                        style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1rem',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span className="jp-text-finish">Finish</span> <Lock size={16} />
                    </button>
                </div>
            </header>

            <div className="jp-exam-body">
                {/* Fixed/Sticky Sidebar Navigation - Always Visible (Stacked on Mobile) */}
                <aside className="jp-exam-sidebar">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--jp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800 }}>Question Map</h4>
                    </div>

                    <div style={{ padding: '0.8rem', background: 'var(--jp-bg-secondary)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--jp-border)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={14} className="text-emerald-500" /> <span>Security Active</span>
                    </div>

                    <div className="jp-progress-grid">
                        {test.questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                }}
                                style={{
                                    height: '36px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: currentIndex === idx ? 'var(--jp-primary)' :
                                        marked.includes(idx) ? '#f59e0b' :
                                            answers[idx] ? '#10b981' : 'var(--jp-card-bg)',
                                    color: (currentIndex === idx || answers[idx] || marked.includes(idx)) ? 'white' : 'var(--jp-text-muted)',
                                    border: (currentIndex === idx || answers[idx] || marked.includes(idx)) ? 'none' : '1px solid var(--jp-border)',
                                    transform: currentIndex === idx ? 'scale(1.05)' : 'scale(1)'
                                }}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <div className="jp-exam-legend" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem', marginTop: '1.5rem', borderTop: '1px solid var(--jp-border)', paddingTop: '1.25rem', color: 'var(--jp-text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                            <div style={{ width: '10px', height: '10px', background: 'var(--jp-card-bg)', borderRadius: '2px', border: '1px solid var(--jp-border)' }}></div> Unanswered
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                            <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }}></div> Answered
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                            <div style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px' }}></div> Marked
                        </div>
                    </div>
                </aside>

                <main className="jp-exam-main">
                    <div className="jp-exam-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--jp-text-main)' }}>Q {currentIndex + 1} / {test.questions.length}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={toggleMark}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: marked.includes(currentIndex) ? 'rgba(245, 158, 11, 0.1)' : 'var(--jp-bg-secondary)',
                                        border: '1px solid',
                                        borderColor: marked.includes(currentIndex) ? 'rgba(245, 158, 11, 0.3)' : 'var(--jp-border)',
                                        color: marked.includes(currentIndex) ? '#d97706' : 'var(--jp-text-muted)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <Bookmark size={16} fill={marked.includes(currentIndex) ? '#d97706' : 'none'} />
                                    <span className="jp-mobile-hide">{marked.includes(currentIndex) ? 'Marked' : 'Mark'}</span>
                                </button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.5', color: 'var(--jp-text-main)', fontWeight: 800 }}>
                            {currentQuestion.question}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            {currentQuestion.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className={`jp-option-item ${answers[currentIndex] === option ? 'selected' : ''}`}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        fontSize: '1rem',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <div className="jp-option-radio">
                                        <div className="jp-option-radio-inner"></div>
                                    </div>
                                    <div style={{ fontSize: 'inherit' }}>{option}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--jp-border)' }}>
                            <button
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex(currentIndex - 1)}
                                className="jp-btn"
                                style={{
                                    opacity: currentIndex === 0 ? 0.5 : 1,
                                    background: 'transparent',
                                    border: '1px solid var(--jp-border)',
                                    color: 'var(--jp-text-muted)',
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '12px',
                                }}
                            >
                                <ChevronLeft size={18} /> Prev
                            </button>

                            {currentIndex === test.questions.length - 1 ? (
                                <button
                                    onClick={() => setShowFinishConfirm(true)}
                                    className="jp-btn jp-btn-primary"
                                    style={{ background: '#10b981', padding: '0.75rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                                >
                                    <CheckCircle size={18} /> Finish
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentIndex(currentIndex + 1)}
                                    className="jp-btn jp-btn-primary"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.25)',
                                        fontWeight: 800
                                    }}
                                >
                                    Save & Next <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <FinishConfirmationModal
                show={showFinishConfirm}
                onClose={() => setShowFinishConfirm(false)}
                onConfirm={() => {
                    setShowFinishConfirm(false);
                    finishTest();
                }}
                answeredCount={Object.keys(answers).length}
                totalCount={test.questions.length}
            />
        </div>
    );
};

const FinishConfirmationModal = ({ show, onClose, onConfirm, answeredCount, totalCount }) => {
    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static"
            keyboard={false}
            className="jp-bootstrap-modal"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="text-danger fw-bold d-flex align-items-center gap-2">
                    <AlertTriangle size={24} className="text-danger" />
                    Finish Assessment?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
                <p className="text-muted text-center mb-4">
                    You are about to submit your test. Please review your attempt summary below.
                </p>
                <div className="container-fluid px-0">
                    <div className="row g-3">
                        <div className="col-6">
                            <div className="p-3 border border-success border-opacity-25 rounded bg-success-subtle text-center h-100">
                                <h2 className="display-6 fw-bold text-success mb-0">{answeredCount}</h2>
                                <small className="text-success text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Attempted</small>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 border border-warning border-opacity-25 rounded bg-warning-subtle text-center h-100">
                                <h2 className="display-6 fw-bold text-warning-emphasis mb-0">{totalCount - answeredCount}</h2>
                                <small className="text-warning-emphasis text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Unattempted</small>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0 pb-4 justify-content-center gap-2">
                <Button variant="outline-secondary" onClick={onClose} className="px-4 fw-bold rounded-3">
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} className="px-4 fw-bold rounded-3">
                    Finish Test
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MCQExamPage;
