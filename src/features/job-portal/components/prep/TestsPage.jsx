import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CirclePlay,
    Clock3,
    Layers3,
    Target,
    X
} from 'lucide-react';
import { getAllQuizzes, getQuizById, getTopics } from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import { PREP_TESTS, PREP_TOPICS } from '../../data/prepData';
import '../../styles/InterviewQuestions.css';
import PrepHeroVisual from './PrepHeroVisual';

const durationOptions = [
    { value: 'All', label: 'All formats' },
    { value: 'Quick', label: 'Quick rounds' },
    { value: 'Standard', label: 'Standard rounds' },
    { value: 'Deep', label: 'Deep dives' }
];

const getDurationBucket = (duration) => {
    if (duration < 20) return 'Quick';
    if (duration <= 40) return 'Standard';
    return 'Deep';
};

const buildAssessmentSummary = (test) => {
    const tagLabel = test.tags?.length ? test.tags.join(', ') : 'core interview topics';
    return `Targeted practice for ${tagLabel} with a timed workflow built to simulate a real screening round.`;
};

const TestDetailBody = ({ test, onStart }) => {
    if (!test) {
        return (
            <div className="prep-detail-empty">
                <div className="prep-detail-empty-icon">◌</div>
                <p>Select an assessment to inspect the format, timing, and launch details.</p>
            </div>
        );
    }

    const questionCount = test.questions?.length || test.totalQuestions || 0;
    const duration = test.duration || 0;
    const durationBucket = getDurationBucket(duration);

    return (
        <div className="prep-detail-stack">
            <div className="prep-detail-hero">
                    <div>
                        <p className="prep-dashboard-kicker">Assessment overview</p>
                        <h2 className="prep-detail-title">{test.title}</h2>
                    </div>

                <div className="prep-chip-row">
                    <span className="prep-data-badge">{duration} mins</span>
                    <span className="prep-data-badge">{questionCount} questions</span>
                    <span className="prep-data-badge">{durationBucket}</span>
                    {(test.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="prep-data-badge subtle">{tag}</span>
                    ))}
                </div>

                <p className="prep-detail-copy">{buildAssessmentSummary(test)}</p>
            </div>

            <div className="prep-detail-grid">
                <section className="prep-detail-panel">
                    <p className="prep-detail-label">What this covers</p>
                    <ul className="prep-detail-list">
                        <li>Timed completion window for better interview pacing.</li>
                        <li>Focused question set sized for quick scoring feedback.</li>
                        <li>Topic tags that keep practice aligned with your target role.</li>
                    </ul>
                </section>

                <section className="prep-detail-panel">
                    <p className="prep-detail-label">Recommended use</p>
                    <ul className="prep-detail-list">
                        <li>Use after reviewing concept notes or interview questions.</li>
                        <li>Repeat the same topic family until your speed feels consistent.</li>
                        <li>Pair short rounds with longer tests before final interviews.</li>
                    </ul>
                </section>
            </div>

            <div className="prep-detail-footer">
                <div className="prep-detail-metrics">
                    <div>
                        <span className="prep-detail-metric-value">{duration}</span>
                        <span className="prep-detail-metric-label">minutes</span>
                    </div>
                    <div>
                        <span className="prep-detail-metric-value">{questionCount}</span>
                        <span className="prep-detail-metric-label">questions</span>
                    </div>
                </div>

                <button type="button" className="prep-primary-btn tests" onClick={() => onStart(test)}>
                    Start Assessment <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

const TestsPage = ({ onNavigate }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [durationFilter, setDurationFilter] = useState('All');
    const [tests, setTests] = useState(PREP_TESTS.slice(0, 15));
    const [topics, setTopics] = useState(PREP_TOPICS);
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalTests, setTotalTests] = useState(0);
    const [activeTest, setActiveTest] = useState(null);

    const pageSize = 15;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tech = params.get('tech');
        if (tech) {
            const [primaryTag] = tech.split(',');
            if (primaryTag) {
                setSelectedTopic(primaryTag);
            }
        }
    }, []);

    useEffect(() => {
        const fetchTests = async () => {
            setIsFetching(true);
            try {
                const [testsResponse, topicsResponse] = await Promise.all([
                    getAllQuizzes(currentPage, pageSize, selectedTopic === 'All' ? '' : selectedTopic),
                    getTopics()
                ]);

                const nextTests = testsResponse.content || [];
                const fallbackTests = selectedTopic === 'All'
                    ? PREP_TESTS
                    : PREP_TESTS.filter((item) => item.tags?.includes(selectedTopic));

                const resolvedTests = nextTests.length > 0 ? nextTests : fallbackTests;
                const resolvedTopics = (topicsResponse || []).length > 0 ? topicsResponse : PREP_TOPICS;

                setTests(resolvedTests);
                setTopics(resolvedTopics);
                setTotalPages(testsResponse.totalPages || (resolvedTests.length > 0 ? 1 : 0));
                setTotalTests(testsResponse.totalElements || resolvedTests.length);
            } catch (error) {
                console.error('Failed to load tests', error);
                const fallbackTests = selectedTopic === 'All'
                    ? PREP_TESTS
                    : PREP_TESTS.filter((item) => item.tags?.includes(selectedTopic));
                setTests(fallbackTests);
                setTopics(PREP_TOPICS);
                setTotalPages(fallbackTests.length > 0 ? 1 : 0);
                setTotalTests(fallbackTests.length);
            } finally {
                setIsFetching(false);
            }
        };

        fetchTests();
    }, [currentPage, selectedTopic]);

    const filteredTests = useMemo(() => tests.filter((test) => {
        const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDuration = durationFilter === 'All' || getDurationBucket(test.duration || 0) === durationFilter;
        return matchesSearch && matchesDuration;
    }), [durationFilter, searchTerm, tests]);

    useEffect(() => {
        if (filteredTests.length === 0) {
            setActiveTest(null);
            return;
        }

        if (!activeTest || !filteredTests.some((test) => test.id === activeTest.id)) {
            setActiveTest(filteredTests[0]);
        }
    }, [activeTest, filteredTests]);

    const totalQuestions = filteredTests.reduce((sum, test) => sum + (test.questions?.length || test.totalQuestions || 0), 0);
    const averageDuration = filteredTests.length
        ? Math.round(filteredTests.reduce((sum, test) => sum + (test.duration || 0), 0) / filteredTests.length)
        : 0;

    const handleSelectTest = (test) => {
        setActiveTest(test);

        if (window.innerWidth < 768) {
            navigate(`/job-portal/prep/view/assessment/${test.id}`);
        }
    };

    const handleStartAssessment = async (test) => {
        if (test.questions?.length) {
            onNavigate('mcq', test);
            return;
        }

        try {
            const liveQuiz = await getQuizById(test.id);

            if (liveQuiz?.questions?.length) {
                onNavigate('mcq', liveQuiz);
                return;
            }

            showToast('This quiz does not have published questions yet. Please update it from admin.', 'warning');
        } catch (error) {
            console.error('Failed to load full quiz details', error);
            showToast('Unable to load the quiz details right now.', 'error');
        }
    };

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic);
        setCurrentPage(0);
    };

    return (
        <div className="iq-shell">
            <header className="iq-header">
                <div className="prep-hero-grid">
                    <div className="prep-hero-copy">
                        <div className="iq-header-meta">
                            <span className="iq-breadcrumb">Academy <span>/</span> Prep</span>
                        </div>

                        <h1 className="iq-main-title">
                            Mock <em>Assessment</em> Library
                        </h1>

                        <p className="iq-subtitle">
                            Browse compact, timed assessment tracks in a clean, distraction-free environment.
                        </p>

                        <div className="iq-stats-bar">
                            <div className="iq-stat">
                                <span className="iq-stat-num">{totalTests}+</span>
                                <span className="iq-stat-label">Assessments</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num">{totalQuestions}</span>
                                <span className="iq-stat-label">Questions</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num">{averageDuration}</span>
                                <span className="iq-stat-label">Avg. Mins</span>
                            </div>
                        </div>
                    </div>

                    <div className="prep-hero-visual">
                        <PrepHeroVisual type="tests" />
                    </div>
                </div>
            </header>

            <div className="iq-controls-wrap">
                <div className="iq-controls-inner">
                    <div className="iq-search-wrap">
                        <input
                            type="text"
                            className="iq-input"
                            placeholder="Search assessments by title..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="iq-select-wrap">
                        <select
                            className="iq-select"
                            value={durationFilter}
                            onChange={(event) => setDurationFilter(event.target.value)}
                        >
                            {durationOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="iq-select-chevron" size={14} />
                    </div>

                    <div className="iq-select-wrap">
                        <select 
                            className="iq-select" 
                            value={selectedTopic} 
                            onChange={(e) => handleTopicChange(e.target.value)}
                        >
                            <option value="All">All Technologies</option>
                            {topics.map(t => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="iq-select-chevron" size={14} />
                    </div>
                    {isFetching && (
                        <div className="prep-fetching-indicator">
                            <div className="iq-spinner-small" />
                            <span>Updating...</span>
                        </div>
                    )}
                </div>
            </div>

            <main className="iq-body">

                <section className="prep-summary-grid">
                    <article className="prep-surface-card">
                        <div className="prep-surface-head">
                            <div className="prep-surface-icon"><Clock3 size={18} /></div>
                            <h3>Time-balanced rounds</h3>
                        </div>
                        <p>Use quick, standard, and deep-dive filters to match the time window you have available.</p>
                    </article>
                    <article className="prep-surface-card">
                        <div className="prep-surface-head">
                            <div className="prep-surface-icon"><Layers3 size={18} /></div>
                            <h3>Topic-first discovery</h3>
                        </div>
                        <p>Stay inside one stack at a time so your assessments feel more intentional and easier to compare.</p>
                    </article>
                    <article className="prep-surface-card">
                        <div className="prep-surface-head">
                            <div className="prep-surface-icon"><CirclePlay size={18} /></div>
                            <h3>Launch from detail view</h3>
                        </div>
                        <p>Inspect the format first, then start an assessment directly from the reader pane or mobile sheet.</p>
                    </article>
                </section>

                <div className="iq-section-label">
                    <span className="iq-section-label-text">
                        Assessment catalog - {filteredTests.length} visible
                    </span>
                    <div className="iq-section-label-line" />
                </div>

                {filteredTests.length === 0 ? (
                    <div className="iq-empty">
                        <div className="iq-empty-icon">◌</div>
                        <p className="iq-empty-text">No assessments match the current search and duration filters.</p>
                    </div>
                ) : (
                    <div className="prep-collection-shell">
                        <div className="prep-collection-list">
                            <div className="prep-collection-list-header">
                                <span>Assessments</span>
                                <span>{filteredTests.length} visible</span>
                            </div>

                            <div className="prep-collection-scroll">
                                {filteredTests.map((test) => {
                                    const questionCount = test.questions?.length || test.totalQuestions || 0;

                                    return (
                                        <motion.button
                                            type="button"
                                            key={test.id}
                                            className={`prep-collection-item ${activeTest?.id === test.id ? 'active' : ''}`}
                                            onClick={() => handleSelectTest(test)}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <div className="prep-collection-item-head">
                                                <div className="prep-collection-icon tests">
                                                    <Target size={16} />
                                                </div>
                                                <div>
                                                    <p className="prep-collection-kicker">{getDurationBucket(test.duration || 0)}</p>
                                                    <h3>{test.title}</h3>
                                                </div>
                                            </div>

                                            <div className="prep-chip-row">
                                                <span className="prep-data-badge">{test.duration || 0} mins</span>
                                                <span className="prep-data-badge">{questionCount} questions</span>
                                                {(test.tags || []).slice(0, 2).map((tag) => (
                                                    <span key={tag} className="prep-data-badge subtle">{tag}</span>
                                                ))}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="prep-collection-detail">
                            <TestDetailBody test={activeTest} onStart={handleStartAssessment} />
                        </div>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="iq-pagination">
                        <button
                            type="button"
                            className="iq-page-btn"
                            onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                            disabled={currentPage === 0}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`iq-page-btn ${currentPage === index ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            type="button"
                            className="iq-page-btn"
                            onClick={() => setCurrentPage((page) => Math.min(totalPages - 1, page + 1))}
                            disabled={currentPage === totalPages - 1}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </main>

        </div>
    );
};

export default TestsPage;
