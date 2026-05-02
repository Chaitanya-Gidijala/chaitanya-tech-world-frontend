import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, BookOpen, Target, FileText, 
    Zap, Lightbulb, Bookmark, Share2, Clock3, 
    Layers3, Target as TargetIcon, CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { getQuizById, getAllQuestions, getAllResources } from '../../services/prepService';
import { PREP_QUESTIONS, PREP_RESOURCES, PREP_TESTS } from '../../data/prepData';
import '../../styles/InterviewQuestions.css';

const PrepDetailView = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let foundData = null;

                if (type === 'assessment') {
                    foundData = PREP_TESTS.find(t => String(t.id) === String(id));
                    const live = await getQuizById(id);
                    if (live) foundData = live;
                } else if (type === 'question') {
                    foundData = PREP_QUESTIONS.find(q => String(q.id) === String(id));
                    const res = await getAllQuestions(0, 1000);
                    const live = (res.content || []).find(q => String(q.id) === String(id));
                    if (live) foundData = live;
                } else if (type === 'resource') {
                    foundData = PREP_RESOURCES.find(r => String(r.id) === String(id));
                    const res = await getAllResources(0, 1000);
                    const live = (res.content || []).find(r => String(r.id) === String(id));
                    if (live) foundData = live;
                }

                if (foundData) {
                    setData(normalizeData(foundData));
                }
            } catch (err) {
                console.error('Failed to load detail', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [type, id]);

    if (isLoading) {
        return (
            <div className="iq-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="iq-spinner-small" style={{ width: '40px', height: '40px' }} />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="iq-shell">
                <div className="iq-empty" style={{ marginTop: '10vh' }}>
                    <div className="iq-empty-icon">⚠️</div>
                    <p>We couldn't find this item.</p>
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
                    <p className="pd-main-text iq-fade-in">{data.answer}</p>
                )}
            </div>

            {data.keyPoints?.length > 0 && (
                <div className="pd-section">
                    <p className="pd-section-label">⚡ Key Takeaways</p>
                    <ul className="pd-list">
                        {data.keyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pd-content-stack">
                <div className="pd-chip-row">
                    <span className="prep-data-badge">{data.duration} mins</span>
                    <span className="prep-data-badge">{questionCount} questions</span>
                    {data.tags?.slice(0, 3).map(t => <span key={t} className="prep-data-badge subtle">{t}</span>)}
                </div>

                <p className="pd-description">
                    Targeted practice for {data.tags?.join(', ') || 'technical topics'} with a timed workflow built to simulate a real screening round.
                </p>

                <div className="pd-grid-2">
                    <div className="pd-panel">
                        <p className="pd-panel-label">What this covers</p>
                        <ul className="pd-list">
                            <li>Timed completion window for better interview pacing.</li>
                            <li>Focused question set sized for quick scoring feedback.</li>
                            <li>Topic tags that keep practice aligned with your target role.</li>
                        </ul>
                    </div>
                    <div className="pd-panel">
                        <p className="pd-panel-label">Recommended use</p>
                        <ul className="pd-list">
                            <li>Use after reviewing concept notes or interview questions.</li>
                            <li>Repeat the same topic family until your speed feels consistent.</li>
                            <li>Pair short rounds with longer tests before final interviews.</li>
                        </ul>
                    </div>
                </div>

                <div className="pd-action-bar">
                    <div className="pd-metrics">
                        <div className="pd-metric">
                            <span className="pd-metric-val">{data.duration}</span>
                            <span className="pd-metric-lab">minutes</span>
                        </div>
                        <div className="pd-metric">
                            <span className="pd-metric-val">{questionCount}</span>
                            <span className="pd-metric-lab">questions</span>
                        </div>
                    </div>
                    <button 
                        className="prep-primary-btn tests pd-launch-btn"
                        onClick={() => window.open(`/job-portal/prep/exam/${data.id}`, '_blank')}
                    >
                        Start Assessment <ArrowRight size={18} />
                    </button>
                </div>
            </motion.div>
        );
    };

    const renderResourceContent = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pd-content-stack">
            <div className="pd-tags">
                <span className="iq-tag" style={{ background: 'var(--iq-primary-soft)', color: 'var(--iq-primary)' }}>
                    {data.type?.toUpperCase()}
                </span>
                {data.tags?.map(t => <span key={t} className="iq-tag">{t}</span>)}
            </div>

            <div className="pd-section">
                <p className="pd-main-text">{data.description || "Detailed guide and documentation covering essential concepts for your technical preparation."}</p>
            </div>

            <div className="pd-panel" style={{ borderLeft: '4px solid var(--iq-primary)' }}>
                <p className="pd-panel-label">Source Information</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <div className="pd-icon-box resources" style={{ width: '32px', height: '32px' }}><Layers3 size={14} /></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{data.type === 'video' ? 'Video Workshop' : 'Technical Document'}</span>
                </div>
            </div>

            <button 
                className="prep-primary-btn resources" 
                style={{ width: '100%', marginTop: '2rem', height: '56px', fontSize: '1rem' }}
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
