import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, BookOpen, Target, FileText,
    Zap, Lightbulb, Bookmark, Share2, Clock3,
    Layers3, Target as TargetIcon, CheckCircle2,
    ArrowRight, Shield
} from 'lucide-react';
import { getQuizById, getQuestionById, getResourceById } from '../../services/prepService';
import { PREP_QUESTIONS, PREP_RESOURCES, PREP_TESTS } from '../../data/prepData';
import '../../styles/InterviewQuestions.css';

/* Renders answer text with proper paragraph spacing */
const FormattedAnswer = ({ text, className = '' }) => {
    if (!text) return null;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length <= 1) {
        const lines = text.split(/\n/).filter(l => l.trim());
        if (lines.length > 1) {
            return (
                <div className={`iq-formatted-answer ${className}`}>
                    {lines.map((line, i) => <p key={i} className="pd-main-text">{line}</p>)}
                </div>
            );
        }
        return <p className={`pd-main-text ${className}`}>{text}</p>;
    }
    return (
        <div className={`iq-formatted-answer ${className}`}>
            {paragraphs.map((para, i) => <p key={i} className="pd-main-text">{para.trim()}</p>)}
        </div>
    );
};

const PrepDetailView = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    const normalizeData = (item) => {
        if (!item) return null;
        let finalItem = { ...item };

        // Handle JSON strings in answer/description (from admin)
        const contentField = type === 'question' ? 'answer' : 'description';
        const rawContent = item[contentField];

        try {
            if (rawContent && typeof rawContent === 'string' && rawContent.trim().startsWith('{')) {
                const parsed = JSON.parse(rawContent);
                if (type === 'question') {
                    finalItem.answer = parsed.expertAnswer || finalItem.answer;
                    finalItem.keyPoints = parsed.takeaways || finalItem.keyPoints || [];
                    finalItem.interviewTip = parsed.tip || finalItem.interviewTip || '';
                } else if (type === 'resource') {
                    finalItem.description = parsed.description || finalItem.description;
                }
            }
        } catch (e) {
            // Fallback to raw if parsing fails
        }

        return finalItem;
    };

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setIsLoading(true);

            // 2. Background/Live Update
            try {
                let live = null;
                if (type === 'assessment') live = await getQuizById(id);
                else if (type === 'question') live = await getQuestionById(id);
                else if (type === 'resource') live = await getResourceById(id);

                if (isMounted && live) {
                    setData(normalizeData(live));
                    setError(null);
                } else if (isMounted) {
                    setError('Item not found');
                }
            } catch (err) {
                console.warn('API fetch failed', err);
                if (isMounted) setError('Failed to connect to the server. Please check if the backend is running.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [type, id]);

    if (isLoading) {
        return (
            <div className="iq-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="iq-spinner-small" style={{ width: '40px', height: '40px' }} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="iq-shell">
                <div className="iq-empty" style={{ marginTop: '10vh' }}>
                    <div className="iq-empty-icon">{error?.includes('server') ? '🔌' : '⚠️'}</div>
                    <p>{error || "We couldn't find this item."}</p>
                    <button onClick={() => navigate(-1)} className="prep-secondary-btn" style={{ marginTop: '1rem' }}>Go Back</button>
                </div>
            </div>
        );
    }

    const renderHeader = () => {
        const iconMap = {
            question: <BookOpen size={20} />,
            assessment: <TargetIcon size={20} />,
            resource: <FileText size={20} />
        };

        const kickerMap = {
            question: 'Interview Framework',
            assessment: 'Assessment Overview',
            resource: 'Learning Material'
        };

        return (
            <div className="pd-header">
                <div className="pd-top-actions">
                    <button className="pd-back" onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </button>
                    <div className={`pd-icon-box ${type}`}>
                        {iconMap[type]}
                    </div>
                </div>

                <div className="pd-header-main">
                    <p className="pd-kicker">{kickerMap[type]}</p>
                    <h1 className="pd-title">{data.question || data.title}</h1>
                </div>
            </div>
        );
    };

    const renderQuestionContent = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pd-content-stack">
            <div className="pd-tags">
                <span className={`iq-badge iq-badge-${data.difficulty?.toLowerCase() || 'easy'}`}>
                    {data.difficulty}
                </span>
                {data.tags?.map(t => <span key={t} className="iq-tag">{t}</span>)}
            </div>

            <div className="pd-section">
                <div className="iq-answer-label">
                    <div className="iq-answer-label-icon"><Zap size={10} /></div>
                    Expert Explanation
                </div>
                {!isRevealed ? (
                    <div className="iq-reveal-card" onClick={() => setIsRevealed(true)} style={{ minHeight: '180px' }}>
                        <div className="iq-reveal-inner">
                            <Lightbulb size={32} style={{ marginBottom: '0.75rem', color: 'var(--iq-mid)' }} />
                            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>Reveal Expert Answer</p>
                            <span>Click to unlock the professional explanation</span>
                        </div>
                    </div>
                ) : (
                    <FormattedAnswer text={data.answer} className="iq-fade-in" />
                )}
            </div>

            {data.keyPoints?.length > 0 && (
                <div className="pd-section">
                    <p className="pd-section-label">⚡ Key Takeaways</p>
                    <ul className="pd-feature-list">
                        {data.keyPoints.map((pt, i) => (
                            <li key={i}><CheckCircle2 size={14} style={{ color: 'var(--iq-mid)' }} /> {pt}</li>
                        ))}
                    </ul>
                </div>
            )}

            {data.interviewTip && (
                <div className="pd-tip-card">
                    <div className="pd-tip-icon"><Lightbulb size={18} /></div>
                    <div>
                        <p className="pd-tip-title">Interview Strategy</p>
                        <p className="pd-tip-text">{data.interviewTip}</p>
                    </div>
                </div>
            )}
        </motion.div>
    );

    const renderAssessmentContent = () => {
        const questionCount = data.questions?.length || data.totalQuestions || 0;
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pd-assessment-layout-v2">
                {/* 1. Integrated Info Bar (No Cards) */}
                <div className="pd-info-bar">
                    <div className="pd-info-item">
                        <Clock3 size={16} />
                        <span>{data.duration}m Duration</span>
                    </div>
                    <div className="pd-info-item">
                        <FileText size={16} />
                        <span>{questionCount} Questions</span>
                    </div>
                    <div className="pd-info-item">
                        <TargetIcon size={16} />
                        <span>Mid-Level</span>
                    </div>
                </div>

                {/* 2. Main Body Content */}
                <div className="pd-body-main">
                    <section className="pd-body-section">
                        <h4 className="pd-body-label">About this Assessment</h4>
                        <p className="pd-body-text">
                            Targeted practice for {data.tags?.join(', ') || 'technical topics'} with a timed workflow built to simulate a real screening round. This assessment evaluates both technical accuracy and speed.
                        </p>
                    </section>

                    <div className="pd-body-grid">
                        <section className="pd-body-section">
                            <h4 className="pd-body-label">
                                <Shield size={16} style={{ marginRight: '8px', color: 'var(--iq-primary)' }} />
                                What this covers
                            </h4>
                            <ul className="pd-body-list">
                                <li>Timed completion window</li>
                                <li>Focused interview question set</li>
                                <li>Role-aligned topic tags</li>
                            </ul>
                        </section>

                        <section className="pd-body-section">
                            <h4 className="pd-body-label">
                                <Zap size={16} style={{ marginRight: '8px', color: 'var(--iq-mid)' }} />
                                Pro Tips
                            </h4>
                            <ul className="pd-body-list">
                                <li>Review concepts before starting</li>
                                <li>Aim for consistency over speed</li>
                                <li>Track your progress in history</li>
                            </ul>
                        </section>
                    </div>
                </div>

                {/* 3. Integrated Action Banner */}
                <div className="pd-action-footer">
                    <div className="pd-action-header">
                        <h3>Ready to start?</h3>
                        <p>You can retake this assessment anytime.</p>
                    </div>
                    <button
                        className="pd-full-launch-btn"
                        onClick={() => window.open(`/job-portal/prep/exam/${data.id}`, '_blank')}
                    >
                        Launch Assessment <ArrowRight size={20} />
                    </button>
                </div>
            </motion.div>
        );
    };

    const renderResourceContent = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pd-resource-body">
            <div className="pd-resource-meta">
                <span className={`iq-badge iq-badge-${data.difficulty?.toLowerCase() || 'easy'}`}>
                    {data.difficulty || 'Essential'}
                </span>
                {data.tags?.map(t => <span key={t} className="iq-tag">{t}</span>)}
            </div>

            <div className="pd-resource-main">
                <p className="pd-resource-text">
                    {data.description || "Detailed guide and documentation covering essential concepts for your technical preparation."}
                </p>

                <div className="pd-resource-info-strip">
                    <div className="pd-info-item">
                        <Layers3 size={16} />
                        <span>{data.type === 'video' ? 'Video Workshop' : 'Technical Document'}</span>
                    </div>
                </div>
            </div>

            <button
                className="pd-resource-launch-btn"
                onClick={() => window.open(data.link || '#', '_blank')}
            >
                Access Resource <ArrowRight size={20} />
            </button>
        </motion.div>
    );

    return (
        <div className="iq-shell pd-shell">
            <div className="pd-container">
                {renderHeader()}

                <main className="pd-main">
                    {type === 'question' && renderQuestionContent()}
                    {type === 'assessment' && renderAssessmentContent()}
                    {type === 'resource' && renderResourceContent()}
                </main>

                <footer className="pd-footer">
                    <button className={`pd-action-btn ${isBookmarked ? 'active' : ''}`} onClick={() => setIsBookmarked(!isBookmarked)}>
                        <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                        {isBookmarked ? 'Saved' : 'Save for later'}
                    </button>
                    <button
                        className={`pd-action-btn ${showShareToast ? 'active' : ''}`}
                        onClick={async () => {
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: data.question || data.title,
                                        text: 'Check out this interview question on Chaitanya Tech World!',
                                        url: window.location.href
                                    });
                                } catch (err) {
                                    // Fallback if user cancels or error
                                    navigator.clipboard.writeText(window.location.href);
                                    setShowShareToast(true);
                                    setTimeout(() => setShowShareToast(false), 2000);
                                }
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                setShowShareToast(true);
                                setTimeout(() => setShowShareToast(false), 2000);
                            }
                        }}
                    >
                        <Share2 size={18} />
                        {showShareToast ? 'Link Copied!' : 'Share'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PrepDetailView;
