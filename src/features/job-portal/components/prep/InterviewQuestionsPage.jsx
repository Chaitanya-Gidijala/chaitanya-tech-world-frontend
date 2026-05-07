import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ChevronDown, ChevronLeft, ChevronRight,
    BookOpen, Bookmark, Share2, X,
    LayoutGrid, List, Lightbulb, Zap
} from 'lucide-react';
import { getAllQuestions, getTopics } from '../../services/prepService';
import '../../styles/InterviewQuestions.css';
import PrepHeroVisual from './PrepHeroVisual';

/* ──────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────── */
// Demo questions removed to enforce database-only fetching.
const DEMO_QUESTIONS = [];

const TOPIC_ICONS = {
    React: '⚛️', 'Node.js': '🟩', Java: '☕', Python: '🐍',
    SQL: '🗄️', NoSQL: '📦', Auth: '🔐', Web: '🌐',
    DSA: '📊', Networking: '🕸️', System: '⚙️', Spring: '🍃',
    Docker: '🐳', AWS: '☁️', Git: '🌿', TypeScript: '📘',
};

const TOPIC_CATEGORIES = [
    { name: 'React', icon: '⚛️', count: 48 },
    { name: 'Node.js', icon: '🟩', count: 35 },
    { name: 'Python', icon: '🐍', count: 52 },
    { name: 'Java', icon: '☕', count: 41 },
    { name: 'SQL', icon: '🗄️', count: 39 },
    { name: 'DSA', icon: '📊', count: 60 },
    { name: 'System', icon: '⚙️', count: 28 },
    { name: 'Auth', icon: '🔐', count: 22 },
    { name: 'Docker', icon: '🐳', count: 19 },
    { name: 'AWS', icon: '☁️', count: 31 },
    { name: 'Git', icon: '🌿', count: 17 },
    { name: 'Web', icon: '🌐', count: 44 },
];

const normalizeDifficulty = (value) => {
    const difficulty = String(value || '').toUpperCase();

    if (difficulty === 'EASY') return 'EASY';
    if (difficulty === 'INTERMEDIATE' || difficulty === 'MEDIUM') return 'INTERMEDIATE';
    if (difficulty === 'HARD' || difficulty === 'EXPERT') return 'HARD';

    return 'INTERMEDIATE';
};

const normalizeQuestion = (question, index) => {
    let finalAnswer = question.answer || '';
    let keyPoints = Array.isArray(question.keyPoints) ? question.keyPoints : [];
    let tip = '';

    // Check if answer is a JSON string (structured data from new admin)
    try {
        if (question.answer && typeof question.answer === 'string' && question.answer.trim().startsWith('{')) {
            const parsed = JSON.parse(question.answer);
            finalAnswer = parsed.expertAnswer !== undefined ? parsed.expertAnswer : finalAnswer;
            keyPoints = parsed.takeaways || keyPoints;
            tip = parsed.tip || '';
        }
    } catch (e) {
        // Fallback to plain text if parsing fails
    }

    return {
        id: question.id || `question-${index}`,
        question: question.question || 'Untitled question',
        answer: finalAnswer || 'Answer details will appear here once the item is updated from admin.',
        difficulty: normalizeDifficulty(question.difficulty),
        tags: Array.isArray(question.tags) && question.tags.length > 0 ? question.tags : ['General'],
        keyPoints: keyPoints,
        interviewTip: tip
    };
};

const buildTopicCards = (topics, questionBank) => {
    const topicNamesFromQuestions = questionBank.flatMap((question) => question.tags || []);
    const preferredNames = topics.length > 0
        ? topics.map((topic) => topic.name)
        : TOPIC_CATEGORIES.map((topic) => topic.name);

    return Array.from(new Set([...preferredNames, ...topicNamesFromQuestions])).map((topicName) => {
        const topicMeta = TOPIC_CATEGORIES.find((topic) => topic.name === topicName);
        return {
            name: topicName,
            icon: topicMeta?.icon || TOPIC_ICONS[topicName] || '◌',
            count: questionBank.filter((question) => question.tags?.includes(topicName)).length
        };
    });
};

/* ──────────────────────────────────────────────
   FORMATTED ANSWER — renders paragraphs properly
──────────────────────────────────────────────── */
const FormattedAnswer = ({ text, className = '' }) => {
    if (!text) return null;
    // Split on double-newline (paragraph breaks) OR single newline
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length <= 1) {
        // Fallback: split on single newline
        const lines = text.split(/\n/).filter(l => l.trim());
        if (lines.length > 1) {
            return (
                <div className={`iq-formatted-answer ${className}`}>
                    {lines.map((line, i) => (
                        <p key={i} className="iq-answer-text">{line}</p>
                    ))}
                </div>
            );
        }
        return <p className={`iq-answer-text ${className}`}>{text}</p>;
    }
    return (
        <div className={`iq-formatted-answer ${className}`}>
            {paragraphs.map((para, i) => (
                <p key={i} className="iq-answer-text">{para.trim()}</p>
            ))}
        </div>
    );
};

/* ──────────────────────────────────────────────
   SMALL SUBCOMPONENTS
──────────────────────────────────────────────── */
const DiffBadge = ({ difficulty }) => {
    const map = { EASY: 'easy', INTERMEDIATE: 'intermediate', HARD: 'hard' };
    const label = { EASY: 'Easy', INTERMEDIATE: 'Mid', HARD: 'Expert' };
    return (
        <span className={`iq-badge iq-badge-${map[difficulty] || 'easy'}`}>
            {label[difficulty] || difficulty}
        </span>
    );
};

const HighlightText = ({ text, highlight }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) => (
                part.toLowerCase() === highlight.toLowerCase() ?
                    <mark key={i} className="iq-search-highlight">{part}</mark> :
                    part
            ))}
        </span>
    );
};

const QuestionRow = ({ q, active, onClick, index, searchTerm }) => (
    <motion.div
        className={`iq-q-row ${active ? 'active' : ''}`}
        onClick={() => onClick(q)}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
    >
        <div className="iq-q-row-meta">
            <DiffBadge difficulty={q.difficulty} />
            {q.tags?.slice(0, 2).map((t, i) => (
                <span key={i} className="iq-tag">{t}</span>
            ))}
        </div>
        <p className="iq-q-row-title">
            <HighlightText text={q.question} highlight={searchTerm} />
        </p>
    </motion.div>
);

const GridCard = ({ q, onClick, index, searchTerm }) => (
    <motion.div
        className="iq-grid-card"
        onClick={() => onClick(q)}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.04 }}
    >
        <div className="iq-grid-card-top">
            <DiffBadge difficulty={q.difficulty} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {q.tags?.slice(0, 2).map((t, i) => <span key={i} className="iq-tag">{t}</span>)}
            </div>
        </div>
        <p className="iq-grid-card-q">
            <HighlightText text={q.question} highlight={searchTerm} />
        </p>
        <p className="iq-grid-card-preview">{q.answer}</p>
        <div className="iq-grid-card-footer">
            <span style={{ fontFamily: 'var(--iq-font-mono)', fontSize: '0.68rem', color: 'var(--iq-text-muted)' }}>
                View answer →
            </span>
        </div>
    </motion.div>
);

/* ──────────────────────────────────────────────
   READER PANE (Pro Flashcard UI)
──────────────────────────────────────────────── */
const ReaderPane = ({ q, questions, onNavigate, bookmarks, toggleBookmark }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    // Reset reveal when question changes
    useEffect(() => {
        setIsRevealed(false);
    }, [q?.id]);

    if (!q) return (
        <div className="iq-reader-pane" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--iq-text-muted)', padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>📖</div>
                <p style={{ fontFamily: 'var(--iq-font-mono)', fontSize: '0.8rem' }}>Select a question to unlock knowledge</p>
            </div>
        </div>
    );

    const idx = questions.findIndex(x => x.id === q.id);
    const isBookmarked = bookmarks.includes(q.id);

    return (
        <div className="iq-reader-pane">
            {/* Header */}
            <div className="iq-reader-header">
                <div className="iq-reader-meta-row">
                    <DiffBadge difficulty={q.difficulty} />
                    {q.tags?.map((t, i) => <span key={i} className="iq-tag">{t}</span>)}
                    <span style={{
                        fontFamily: 'var(--iq-font-mono)', fontSize: '0.65rem',
                        color: 'var(--iq-text-muted)', marginLeft: 'auto'
                    }}>
                        {idx + 1} / {questions.length}
                    </span>
                </div>
                <h2 className="iq-reader-q">{q.question}</h2>
            </div>

            {/* Scrollable body */}
            <div className="iq-reader-scroll">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Answer with Reveal Logic */}
                        <div className="iq-answer-section">
                            <div className="iq-answer-label">
                                <div className="iq-answer-label-icon"><Zap size={10} /></div>
                                Expert Answer
                            </div>

                            {!isRevealed ? (
                                <div className="iq-reveal-card" onClick={() => setIsRevealed(true)}>
                                    <div className="iq-reveal-inner">
                                        <Lightbulb size={24} style={{ marginBottom: '0.5rem' }} />
                                        <p>Click to reveal explanation</p>
                                        <span>Test your knowledge first!</span>
                                    </div>
                                    <div className="iq-blur-text">
                                        {(q.answer || '').substring(0, 120)}...
                                    </div>
                                </div>
                            ) : (
                                <FormattedAnswer text={q.answer} className="iq-fade-in" />
                            )}
                        </div>

                        {/* Key Points */}
                        {q.keyPoints && q.keyPoints.length > 0 && (
                            <div className="iq-key-points">
                                <p className="iq-key-points-title">⚡ Key Takeaways</p>
                                <ul>
                                    {q.keyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Interview Tip */}
                        {(q.interviewTip || q.difficulty === 'HARD') && (
                            <div className="iq-key-points" style={{
                                borderLeftColor: 'var(--iq-accent)',
                                marginTop: '1.25rem'
                            }}>
                                <p className="iq-key-points-title" style={{ color: 'var(--iq-accent)' }}>
                                    💡 Interview Tip
                                </p>
                                <p className="iq-answer-text" style={{ fontSize: '0.82rem' }}>
                                    {q.interviewTip || "When answering this question, structure your response using the STAR method: briefly define the concept, explain how it works, give a real-world example, and mention trade-offs or alternatives. Interviewers appreciate concise, structured thinking."}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer nav */}
            <div className="iq-reader-footer">
                <div className="iq-nav-btns">
                    <button className="iq-nav-btn" onClick={() => onNavigate(idx - 1)} disabled={idx === 0}>
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <button className="iq-nav-btn" onClick={() => onNavigate(idx + 1)} disabled={idx === questions.length - 1}>
                        Next <ChevronRight size={14} />
                    </button>
                </div>
                <div className="iq-action-btns">
                    <button
                        className={`iq-icon-btn ${isBookmarked ? 'bookmarked' : ''}`}
                        onClick={() => toggleBookmark(q.id)}
                        title="Bookmark"
                    >
                        <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        className={`iq-icon-btn ${showShareToast ? 'active' : ''}`}
                        title="Share"
                        onClick={() => {
                            const url = `${window.location.origin}/job-portal/prep/view/question/${q.id}`;
                            navigator.clipboard.writeText(url);
                            setShowShareToast(true);
                            setTimeout(() => setShowShareToast(false), 2000);
                        }}
                    >
                        <Share2 size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────── */
const InterviewQuestionsPage = () => {
    const navigate = useNavigate();
    // Data
    const [questionBank, setQuestionBank] = useState([]);
    const [topics, setTopics] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [difficulty, setDifficulty] = useState('All');

    // UI state
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [viewMode, setViewMode] = useState('split'); // 'split' | 'grid'
    const [bookmarks, setBookmarks] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        const fetchQuestionBank = async () => {
            setIsFetching(true);

            try {
                const [questionsResponse, topicsResponse] = await Promise.all([
                    getAllQuestions(0, 50),
                    getTopics()
                ]);

                const normalizedQuestions = (questionsResponse.content || []).map(normalizeQuestion);
                setQuestionBank(normalizedQuestions);
                setTopics(buildTopicCards(topicsResponse || [], normalizedQuestions));
            } catch (error) {
                console.error('Failed to load question bank', error);
                setQuestionBank([]);
                setTopics([]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchQuestionBank();
    }, []);

    const baseQuestions = useMemo(() => (
        questionBank.filter((question) => {
            const matchesTag = selectedTag === 'All' || question.tags?.includes(selectedTag);
            const matchesDifficulty = difficulty === 'All' || question.difficulty === difficulty;
            return matchesTag && matchesDifficulty;
        })
    ), [difficulty, questionBank, selectedTag]);

    const filteredQuestions = useMemo(() => {
        if (!searchTerm) return baseQuestions;
        const term = searchTerm.toLowerCase();
        return baseQuestions.filter(q =>
            q.question.toLowerCase().includes(term) ||
            q.tags?.some(t => t.toLowerCase().includes(term))
        );
    }, [baseQuestions, searchTerm]);

    useEffect(() => {
        if (filteredQuestions.length === 0) {
            setActiveQuestion(null);
            return;
        }

        if (!activeQuestion || !filteredQuestions.some((question) => question.id === activeQuestion.id)) {
            setActiveQuestion(filteredQuestions[0]);
        }
    }, [activeQuestion, filteredQuestions]);

    const handleQuestionClick = (q) => {
        setActiveQuestion(q);
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            navigate(`/job-portal/prep/view/question/${q.id}`);
        } else {
            // Auto-switch to split view on desktop so user can see the answer
            setViewMode('split');
            // Scroll to top of body to ensure they see the reader
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    const handleNavigate = (newIdx) => {
        if (newIdx >= 0 && newIdx < filteredQuestions.length) {
            setActiveQuestion(filteredQuestions[newIdx]);
        }
    };

    const toggleBookmark = (id) => {
        setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
    };

    const toggleTag = (tag) => {
        setSelectedTag(prev => prev === tag ? 'All' : tag);
        setCurrentPage(0);
    };

    useEffect(() => {
        setCurrentPage(0);
    }, [difficulty, searchTerm]);

    const totalPages = Math.ceil(filteredQuestions.length / pageSize);
    const paginatedQ = filteredQuestions.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const stats = {
        total: baseQuestions.length,
        easy: baseQuestions.filter(q => q.difficulty === 'EASY').length,
        mid: baseQuestions.filter(q => q.difficulty === 'INTERMEDIATE').length,
        hard: baseQuestions.filter(q => q.difficulty === 'HARD').length,
    };

    // Instant loading mode enabled. No blocking spinner.

    return (
        <div className="iq-shell">
            {/* ── HEADER ── */}
            <header className="iq-header">
                <div className="prep-hero-grid">
                    <div className="prep-hero-copy">
                        <div className="iq-header-meta">
                            <span className="iq-breadcrumb">Academy <span>/</span> Prep</span>
                        </div>

                        <h1 className="iq-main-title">
                            Technical <em>Interview</em><br />Question Bank
                        </h1>

                        <p className="iq-subtitle">
                            Master your engineering interviews with curated questions and deep-dive explanations in a minimalist reading experience.
                        </p>

                        <div className="iq-stats-bar">
                            <div className="iq-stat">
                                <span className="iq-stat-num">{stats.total}+</span>
                                <span className="iq-stat-label">Questions</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num" style={{ color: 'var(--iq-easy)' }}>{stats.easy}</span>
                                <span className="iq-stat-label">Beginner</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num" style={{ color: 'var(--iq-mid)' }}>{stats.mid}</span>
                                <span className="iq-stat-label">Mid</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num" style={{ color: 'var(--iq-hard)' }}>{stats.hard}</span>
                                <span className="iq-stat-label">Expert</span>
                            </div>
                        </div>
                    </div>

                    <div className="prep-hero-visual">
                        <PrepHeroVisual type="questions" />
                    </div>
                </div>
            </header>

            {/* ── CONTROLS BAR ── */}
            <div className="iq-controls-wrap">
                <div className="iq-controls-inner">
                    {/* Search */}
                    <div className="iq-search-wrap">
                        <Search className="iq-search-icon" size={16} />
                        <input
                            type="text"
                            className="iq-input"
                            placeholder="Search by concept, tag, or keyword..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Difficulty */}
                    <div className="iq-select-wrap">
                        <select className="iq-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                            <option value="All">All Levels</option>
                            <option value="EASY">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="HARD">Expert</option>
                        </select>
                        <ChevronDown className="iq-select-chevron" size={14} />
                    </div>

                    {/* Tech select */}
                    <div className="iq-select-wrap">
                        <select
                            className="iq-select"
                            value={selectedTag}
                            onChange={(e) => toggleTag(e.target.value)}
                        >
                            <option value="All">All Technologies</option>
                            {topics.map(t => (
                                <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="iq-select-chevron" size={14} />
                    </div>

                    {/* View toggle */}
                    <div className="iq-view-toggle">
                        <button className={`iq-view-btn ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')} title="Split view">
                            <List size={15} />
                        </button>
                        <button className={`iq-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid view">
                            <LayoutGrid size={15} />
                        </button>
                    </div>
                    {isFetching && (
                        <div className="prep-fetching-indicator">
                            <div className="iq-spinner-small" />
                            <span>Updating...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── BODY ── */}
            <main className="iq-body">


                {/* PROGRESS TRACKER */}
                <section className="iq-progress-section">
                    <div className="iq-section-label">
                        <span className="iq-section-label-text">Your Progress</span>
                        <div className="iq-section-label-line" />
                    </div>
                    <div className="iq-progress-bar-wrap">
                        <div className="iq-progress-levels">
                            {[
                                { label: 'Beginner', cls: 'easy', color: 'var(--iq-easy)', val: stats.easy, of: stats.total },
                                { label: 'Intermediate', cls: 'mid', color: 'var(--iq-mid)', val: stats.mid, of: stats.total },
                                { label: 'Expert', cls: 'hard', color: 'var(--iq-hard)', val: stats.hard, of: stats.total },
                            ].map(lvl => (
                                <div key={lvl.label} className="iq-progress-level">
                                    <div className="iq-progress-level-meta">
                                        <span className="iq-progress-level-name" style={{ color: lvl.color }}>{lvl.label}</span>
                                        <span className="iq-progress-level-pct">{lvl.val} / {lvl.of}</span>
                                    </div>
                                    <div className="iq-progress-track">
                                        <div className={`iq-progress-fill ${lvl.cls}`} style={{ width: `${Math.round((lvl.val / Math.max(lvl.of, 1)) * 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="iq-progress-cta">
                            <span className="iq-progress-total">{stats.total}</span>
                            <span className="iq-progress-total-label">Total Questions</span>
                        </div>
                    </div>
                </section>

                {/* ── MAIN QUESTIONS SECTION ── */}
                <div className="iq-section-label">
                    <span className="iq-section-label-text">
                        {selectedTag !== 'All' ? selectedTag : 'All Questions'}
                        {' '}— {filteredQuestions.length} results
                    </span>
                    <div className="iq-section-label-line" />
                </div>

                {filteredQuestions.length > 0 ? (
                    viewMode === 'split' ? (
                        /* ── SPLIT VIEW ── */
                        <div className="iq-split">
                            {/* Left list */}
                            <div className="iq-list-pane">
                                <div className="iq-list-header">
                                    <span style={{ fontFamily: 'var(--iq-font-display)', fontSize: '0.9rem', fontWeight: 700 }}>Questions</span>
                                    <span className="iq-list-count"><span>{filteredQuestions.length}</span> found</span>
                                </div>
                                <div className="iq-list-scroll">
                                    <AnimatePresence>
                                        {filteredQuestions.map((q, i) => (
                                            <QuestionRow
                                                key={q.id}
                                                q={q}
                                                index={i}
                                                searchTerm={searchTerm}
                                                active={activeQuestion?.id === q.id}
                                                onClick={handleQuestionClick}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Right reader */}
                            <ReaderPane
                                q={activeQuestion}
                                questions={filteredQuestions}
                                onNavigate={handleNavigate}
                                bookmarks={bookmarks}
                                toggleBookmark={toggleBookmark}
                            />
                        </div>
                    ) : (
                        /* ── GRID VIEW ── */
                        <div className="iq-grid-view">
                            <AnimatePresence>
                                {paginatedQ.map((q, i) => (
                                    <GridCard key={q.id} q={q} index={i} searchTerm={searchTerm} onClick={handleQuestionClick} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                ) : (
                    <div className="iq-empty-state-v2 iq-fade-in">
                        <div className="iq-empty-art">
                            <div className="iq-empty-circle" />
                            <Search size={64} className="iq-empty-icon-v2" />
                        </div>
                        <div className="iq-empty-content">
                            <h3>No Questions Found</h3>
                            <p>We couldn't find any questions matching your current filters or search term. Try adjusting your criteria or clearing all filters to browse our full bank.</p>
                            <button className="iq-empty-reset-btn" onClick={() => { setSearchTerm(''); setSelectedTag('All'); setDifficulty('All'); }}>
                                <Zap size={16} />
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* PAGINATION (grid only) */}
                {viewMode === 'grid' && totalPages > 1 && (
                    <div className="iq-pagination">
                        <button className="iq-page-btn" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                            <button key={i} className={`iq-page-btn ${currentPage === i ? 'active' : ''}`} onClick={() => setCurrentPage(i)}>
                                {i + 1}
                            </button>
                        ))}
                        <button className="iq-page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InterviewQuestionsPage;
