import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Target, ChevronLeft, ChevronRight, Bookmark, AlertTriangle, ShieldCheck, Lock, Info, Menu, X, Shield, ArrowLeft, PlayCircle, Loader2, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';

const MCQExamPage = ({ test }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [marked, setMarked] = useState([]);
    const [timeLeft, setTimeLeft] = useState(test.duration * 60);
    const [isProcessing, setIsProcessing] = useState(false);
    const { showToast } = useToast();
    const [warnings, setWarnings] = useState(0);
    const [lastViolation, setLastViolation] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const finishTest = useCallback(() => {
        setIsProcessing(true);
        
        // Calculate score
        let correctCount = 0;
        test.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correctCount++;
        });

        // "Ultra Animation" delay
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#10b981', '#f59e0b']
            });

            setTimeout(() => {
                // Navigate to a standard page with Header/Footer for results
                // We pass the results via state
                navigate('/job-portal/prep/results', { 
                    state: { 
                        score: correctCount,
                        total: test.questions.length,
                        testTitle: test.title,
                        answers: answers,
                        questions: test.questions,
                        tags: test.tags
                    } 
                });
            }, 1500);
        }, 3000);
    }, [answers, test, navigate]);

    useEffect(() => {
        if (lastViolation) {
            const { msg, count } = lastViolation;
            showToast(`${msg} (Warning ${count}/5)`, 'warning');
            if (count >= 5) {
                showToast('Assessment terminated due to multiple violations.', 'error');
                finishTest();
            }
            setLastViolation(null);
        }
    }, [lastViolation, showToast, finishTest]);

    const handleProctoringViolation = useCallback((msg) => {
        if (isProcessing) return;
        setWarnings(prev => {
            const next = prev + 1;
            setLastViolation({ msg, count: next });
            return next;
        });
    }, [isProcessing]);

    useEffect(() => {
        if (isProcessing) return;
        const preventDefault = (e) => {
            e.preventDefault();
            handleProctoringViolation("Action not allowed.");
        };
        const handleVisibility = () => {
            if (document.visibilityState === 'hidden') handleProctoringViolation("Tab switch detected!");
        };
        const handleBlur = () => handleProctoringViolation("Window focus lost!");

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
    }, [isProcessing, handleProctoringViolation]);

    useEffect(() => {
        if (isProcessing) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isProcessing, finishTest]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (option) => {
        if (isProcessing) return;
        setAnswers(prev => ({ ...prev, [currentIndex]: option }));
    };

    const toggleMark = () => {
        setMarked(prev => prev.includes(currentIndex) ? prev.filter(i => i !== currentIndex) : [...prev, currentIndex]);
    };

    if (isProcessing) {
        return (
            <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--iq-bg)', color: 'var(--iq-text)', textAlign: 'center', padding: '2rem' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem' }}>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{ position: 'absolute', inset: 0, border: '4px solid var(--iq-primary-soft)', borderTopColor: 'var(--iq-primary)', borderRadius: '50%' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--iq-primary)' }}>
                            <Trophy size={48} />
                        </div>
                    </div>
                    
                    <h2 style={{ fontSize: '2rem', fontWeight: 850, marginBottom: '1rem' }}>Analyzing Results</h2>
                    <p style={{ color: 'var(--iq-text-dim)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
                        Generating your detailed performance report and verifying assessment integrity...
                    </p>

                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {[0, 1, 2].map(i => (
                            <motion.div 
                                key={i}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--iq-primary)' }}
                            />
                        ))}
                    </div>
                </motion.div>
                
                {/* Background Sparkles */}
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
                    <Sparkles size={100} style={{ position: 'absolute', top: '10%', left: '10%', opacity: 0.1 }} />
                    <Sparkles size={80} style={{ position: 'absolute', bottom: '15%', right: '12%', opacity: 0.1 }} />
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentIndex];
    const progress = (Object.keys(answers).length / test.questions.length) * 100;

    return (
        <div className="iq-shell" style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', background: 'var(--iq-bg)' }}>
            <header style={{ minHeight: isMobile ? '80px' : '60px', background: 'var(--iq-surface)', borderBottom: '1px solid var(--iq-border)', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 1.25rem', justifyContent: 'space-between', gap: '1rem', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', minWidth: 0, flex: 1 }}>
                    <div style={{ width: isMobile ? '36px' : '32px', height: isMobile ? '36px' : '32px', background: 'var(--iq-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                        <Shield size={isMobile ? 18 : 16} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <h2 className="jp-live-exam-title" style={{ fontSize: isMobile ? '1.1rem' : '0.86rem', fontWeight: 800, margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{test.title}</h2>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.1rem' }}>
                             <span style={{ fontSize: '0.65rem', color: 'var(--iq-text-muted)', fontWeight: 700 }}>Q{currentIndex + 1} of {test.questions.length}</span>
                             <div style={{ width: '1px', height: '10px', background: 'var(--iq-border)' }} />
                             <span style={{ fontSize: '0.65rem', color: 'var(--iq-text-muted)', fontWeight: 700 }}>{warnings} Warnings</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: timeLeft < 60 ? 'var(--iq-hard-bg)' : 'var(--iq-surface-2)', color: timeLeft < 60 ? 'var(--iq-hard)' : 'var(--iq-text)', padding: '0.45rem 0.75rem', borderRadius: '8px', fontWeight: 800, fontSize: isMobile ? '0.9rem' : '0.85rem', fontFamily: 'monospace' }}>
                        <Clock size={16} /> {formatTime(timeLeft)}
                    </div>
                    {!isMobile && (
                        <button onClick={() => setShowFinishConfirm(true)} style={{ background: 'var(--iq-easy)', color: 'white', border: 'none', padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            Submit <CheckCircle size={14} />
                        </button>
                    )}
                </div>
            </header>

            <div style={{ height: '2px', width: '100%', background: 'var(--iq-surface-2)' }}>
                <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--iq-easy)' }} />
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {!isMobile && (
                    <aside style={{ width: '220px', borderRight: '1px solid var(--iq-border)', background: 'var(--iq-surface)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--iq-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Navigator</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', overflowY: 'auto', paddingRight: '4px' }}>
                            {test.questions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    style={{
                                        height: '32px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--iq-border)',
                                        background: currentIndex === idx ? 'var(--iq-primary)' : marked.includes(idx) ? 'var(--iq-mid-bg)' : answers[idx] ? 'var(--iq-easy-bg)' : 'transparent',
                                        color: currentIndex === idx ? 'white' : marked.includes(idx) ? 'var(--iq-mid)' : answers[idx] ? 'var(--iq-easy)' : 'var(--iq-text-muted)',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </aside>
                )}

                <main style={{ flex: 1, padding: isMobile ? '1.25rem' : '2rem', overflowY: 'auto', background: 'var(--iq-bg)', scrollbarWidth: 'thin' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: isMobile ? 'auto' : '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: 850, color: 'var(--iq-primary)', textTransform: 'uppercase' }}>Question {currentIndex + 1}</span>
                            <button 
                                onClick={toggleMark} 
                                style={{ background: 'none', border: 'none', color: marked.includes(currentIndex) ? 'var(--iq-mid)' : 'var(--iq-text-muted)', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                <Bookmark size={16} fill={marked.includes(currentIndex) ? 'currentColor' : 'none'} />
                                {marked.includes(currentIndex) ? 'Review set' : 'Mark for review'}
                            </button>
                        </div>

                        <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.12rem', fontWeight: 800, color: 'var(--iq-text)', lineHeight: 1.4, marginBottom: '2rem' }}>
                            {currentQuestion.question}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        textAlign: 'left',
                                        background: answers[currentIndex] === option ? 'var(--iq-primary-soft)' : 'var(--iq-surface)',
                                        border: '1px solid',
                                        borderColor: answers[currentIndex] === option ? 'var(--iq-primary)' : 'var(--iq-border)',
                                        borderRadius: '12px',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        color: answers[currentIndex] === option ? 'var(--iq-primary)' : 'var(--iq-text)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        minHeight: '60px'
                                    }}
                                >
                                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid', borderColor: answers[currentIndex] === option ? 'var(--iq-primary)' : 'var(--iq-border)', background: answers[currentIndex] === option ? 'var(--iq-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {answers[currentIndex] === option && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />}
                                    </div>
                                    <span>{option}</span>
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '1.5rem 0', borderTop: '1px solid var(--iq-border)' }}>
                            <button
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex(currentIndex - 1)}
                                style={{ background: 'var(--iq-surface)', border: '1px solid var(--iq-border)', padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', color: 'var(--iq-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', opacity: currentIndex === 0 ? 0.45 : 1 }}
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                            
                            {currentIndex === test.questions.length - 1 ? (
                                <button onClick={() => setShowFinishConfirm(true)} style={{ background: 'var(--iq-easy)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '10px', fontWeight: 850, fontSize: '0.85rem', cursor: 'pointer' }}>
                                    Final Submission
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentIndex(currentIndex + 1)}
                                    style={{ background: 'var(--iq-primary)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '10px', fontWeight: 850, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                >
                                    Next Question <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {showFinishConfirm && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="prep-surface-card" style={{ maxWidth: '360px', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--iq-mid-bg)', color: 'var(--iq-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                <AlertTriangle size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Submit Assessment?</h3>
                            <p style={{ color: 'var(--iq-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                You have answered <strong>{Object.keys(answers).length}</strong> of <strong>{test.questions.length}</strong> questions.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <button onClick={() => setShowFinishConfirm(false)} style={{ background: 'var(--iq-surface-2)', border: 'none', padding: '0.6rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Resume</button>
                                <button onClick={finishTest} style={{ background: 'var(--iq-easy)', color: 'white', border: 'none', padding: '0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Submit</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MCQExamPage;
