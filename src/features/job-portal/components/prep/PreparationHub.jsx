import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    FileText,
    Layers3,
    PlayCircle,
    Sparkles,
    Target,
    Search,
    ChevronDown
} from 'lucide-react';
import { getAllQuestions, getAllResources, getAllQuizzes, getTopics } from '../../services/prepService';
import { PREP_QUESTIONS, PREP_RESOURCES, PREP_TESTS, PREP_TOPICS } from '../../data/prepData';
import '../../styles/InterviewQuestions.css';

import PrepHeroVisual from './PrepHeroVisual';

const hubSections = [
    {
        key: 'tests',
        title: 'Mock Assessments',
        subtitle: 'Timed validation',
        description: 'Run focused practice exams with clear time limits, question counts, and direct launch actions.',
        emptyLabel: 'No assessments available yet.',
        icon: Target,
        accent: 'tests'
    },
    {
        key: 'questions',
        title: 'Interview Q&A',
        subtitle: 'Answer frameworks',
        description: 'Review technical questions in a deeper reading experience with quick takeaways and structured explanations.',
        emptyLabel: 'No interview questions available yet.',
        icon: BookOpen,
        accent: 'questions'
    },
    {
        key: 'resources',
        title: 'Learning Resources',
        subtitle: 'Curated learning',
        description: 'Keep your preparation practical with guides, videos, PDFs, and links grouped around your target stack.',
        emptyLabel: 'No resources available yet.',
        icon: FileText,
        accent: 'resources'
    }
];

const preparationFlow = [
    {
        title: 'Choose a stack',
        copy: 'Filter by the technology you are targeting so every question, test, and resource stays relevant.'
    },
    {
        title: 'Practice in sequence',
        copy: 'Start with questions, verify with an assessment, and then close gaps using hand-picked resources.'
    },
    {
        title: 'Stay interview ready',
        copy: 'Use the hub as a repeatable prep loop before applications, screenings, and final rounds.'
    }
];

const platformBenefits = [
    {
        title: 'One prep workspace',
        copy: 'Questions, assessments, and resources now live in one consistent flow instead of separate-looking pages.',
        icon: Layers3
    },
    {
        title: 'Faster review cycles',
        copy: 'Smaller cards, tighter spacing, and clearer hierarchy make the content easier to scan on every device.',
        icon: Sparkles
    },
    {
        title: 'Professional structure',
        copy: 'Each section is designed to feel like a focused product surface instead of a single large dashboard panel.',
        icon: CheckCircle2
    }
];

const PreparationHub = ({ onNavigate }) => {
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [topics, setTopics] = useState(PREP_TOPICS);
    const [tests, setTests] = useState(PREP_TESTS.slice(0, 6));
    const [questions, setQuestions] = useState(PREP_QUESTIONS.slice(0, 6));
    const [resources, setResources] = useState(PREP_RESOURCES.slice(0, 6));
    const [counts, setCounts] = useState({ 
        tests: PREP_TESTS.length, 
        questions: PREP_QUESTIONS.length, 
        resources: PREP_RESOURCES.length 
    });
    const [isFetching, setIsFetching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const topicData = await getTopics();
                setTopics(topicData || []);
            } catch (error) {
                console.error('Error fetching topics', error);
            }
        };

        fetchTopics();
    }, []);

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
        const fetchContent = async () => {
            setIsFetching(true);
            try {
                const tag = selectedTopic === 'All' ? '' : selectedTopic;
                const [testsResponse, questionsResponse, resourcesResponse] = await Promise.all([
                    getAllQuizzes(0, 6, tag),
                    getAllQuestions(0, 6, tag),
                    getAllResources(0, 6, tag)
                ]);

                const nextTests = testsResponse.content || [];
                const nextQuestions = questionsResponse.content || [];
                const nextResources = resourcesResponse.content || [];

                const fallbackFilter = (items) => (
                    selectedTopic === 'All'
                        ? items
                        : items.filter((item) => item.tags?.includes(selectedTopic))
                );

                const resolvedTests = nextTests.length > 0 ? nextTests : fallbackFilter(PREP_TESTS);
                const resolvedQuestions = nextQuestions.length > 0 ? nextQuestions : fallbackFilter(PREP_QUESTIONS);
                const resolvedResources = nextResources.length > 0 ? nextResources : fallbackFilter(PREP_RESOURCES);

                setTests(resolvedTests);
                setQuestions(resolvedQuestions);
                setResources(resolvedResources);
                setTopics((existingTopics) => existingTopics.length > 0 ? existingTopics : PREP_TOPICS);
                setCounts({
                    tests: testsResponse.totalElements || resolvedTests.length,
                    questions: questionsResponse.totalElements || resolvedQuestions.length,
                    resources: resourcesResponse.totalElements || resolvedResources.length
                });
            } catch (error) {
                console.error('Error fetching prep hub data', error);
                const fallbackTests = selectedTopic === 'All' ? PREP_TESTS : PREP_TESTS.filter((item) => item.tags?.includes(selectedTopic));
                const fallbackQuestions = selectedTopic === 'All' ? PREP_QUESTIONS : PREP_QUESTIONS.filter((item) => item.tags?.includes(selectedTopic));
                const fallbackResources = selectedTopic === 'All' ? PREP_RESOURCES : PREP_RESOURCES.filter((item) => item.tags?.includes(selectedTopic));
                setTopics(PREP_TOPICS);
                setTests(fallbackTests);
                setQuestions(fallbackQuestions);
                setResources(fallbackResources);
                setCounts({
                    tests: fallbackTests.length,
                    questions: fallbackQuestions.length,
                    resources: fallbackResources.length
                });
            } finally {
                setIsFetching(false);
            }
        };

        fetchContent();
    }, [selectedTopic]);

    const totalAssets = counts.tests + counts.questions + counts.resources;

    const featuredCards = useMemo(() => {
        const filterBySearch = (items, key) => {
            if (!searchTerm) return items;
            const term = searchTerm.toLowerCase();
            return items.filter(item =>
                (item.title || item.question || '').toLowerCase().includes(term)
            );
        };

        const filteredTests = filterBySearch(tests, 'title');
        const filteredQuestions = filterBySearch(questions, 'question');
        const filteredResources = filterBySearch(resources, 'title');

        return ([
            {
                ...hubSections[0],
                count: counts.tests,
                items: filteredTests.slice(0, 3).map((test) => ({
                    id: test.id,
                    title: test.title,
                    meta: `${test.duration || 0} mins`,
                    action: () => onNavigate('mcq', test),
                    actionLabel: 'Launch'
                })),
                ctaLabel: 'View All Tests',
                onClick: () => onNavigate('tests-all')
            },
            {
                ...hubSections[1],
                count: counts.questions,
                items: filteredQuestions.slice(0, 3).map((question) => ({
                    id: question.id,
                    title: question.question,
                    meta: question.difficulty || 'Interview prep',
                    action: () => onNavigate('view-question', question),
                    actionLabel: 'Open'
                })),
                ctaLabel: 'Practice Questions',
                onClick: () => onNavigate('questions')
            },
            {
                ...hubSections[2],
                count: counts.resources,
                items: filteredResources.slice(0, 3).map((resource) => ({
                    id: resource.id,
                    title: resource.title,
                    meta: (resource.type || 'resource').toUpperCase(),
                    action: () => onNavigate('view-resource', resource),
                    actionLabel: 'View'
                })),
                ctaLabel: 'Browse Materials',
                onClick: () => onNavigate('resources-all')
            }
        ]);
    }, [counts, onNavigate, questions, resources, tests, searchTerm]);

    return (
        <div className="iq-shell">
            <header className="iq-header prep-page-header">
                <div className="prep-hero-grid">
                    <div className="prep-hero-copy">
                        <div className="iq-header-meta">
                            <span className="iq-breadcrumb">Academy <span>/</span> Prep Hub</span>
                        </div>

                        <h1 className="iq-main-title">
                            Preparation <em>Hub</em>
                        </h1>

                        <p className="iq-subtitle">
                            A clean, distraction-free environment for interview questions, mock assessments, and curated learning resources.
                        </p>

                        <div className="iq-stats-bar">
                            <div className="iq-stat">
                                <span className="iq-stat-num">{totalAssets}+</span>
                                <span className="iq-stat-label">Assets</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num">{counts.questions}</span>
                                <span className="iq-stat-label">Questions</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num">{counts.tests}</span>
                                <span className="iq-stat-label">Assessments</span>
                            </div>
                        </div>
                    </div>

                    <div className="prep-hero-visual">
                        <PrepHeroVisual type="hub" />
                    </div>
                </div>
            </header>

            <main className="iq-body">
                <div className="iq-controls-wrap" style={{ marginBottom: '2rem' }}>
                    <div className="iq-controls-inner">
                        <div className="iq-search-wrap">
                            <Search className="iq-search-icon" size={16} />
                            <input
                                type="text"
                                className="iq-input"
                                placeholder="Search all prep assets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="iq-select-wrap">
                            <select
                                className="iq-select"
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                            >
                                <option value="All">All Technologies</option>
                                {topics.map(t => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="iq-select-chevron" size={14} />
                        </div>
                    </div>
                    {isFetching && (
                        <div className="prep-fetching-indicator">
                            <div className="iq-spinner-small" />
                            <span>Updating...</span>
                        </div>
                    )}
                </div>

                <section className="prep-dashboard-grid">
                    {featuredCards.map((section, index) => {
                        const SectionIcon = section.icon;

                        return (
                            <motion.article
                                key={section.key}
                                className={`prep-dashboard-card ${section.accent}`}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                            >
                                <div className="prep-dashboard-top">
                                    <div className={`prep-dashboard-icon ${section.accent}`}>
                                        <SectionIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="prep-dashboard-kicker">{section.subtitle}</p>
                                        <h2 className="prep-dashboard-title">{section.title}</h2>
                                    </div>
                                </div>

                                <div className="prep-dashboard-metric">
                                    <span className="prep-dashboard-count">{section.count}</span>
                                    <span className="prep-dashboard-label">available now</span>
                                </div>

                                <p className="prep-dashboard-copy">{section.description}</p>

                                <div className="prep-mini-list">
                                    {section.items.length > 0 ? section.items.map((item) => (
                                        <div key={item.id} className="prep-mini-list-item">
                                            <div>
                                                <p className="prep-mini-list-title">{item.title}</p>
                                                <span className="prep-mini-list-meta">{item.meta}</span>
                                            </div>
                                            <button type="button" className="prep-inline-link" onClick={item.action}>
                                                {item.actionLabel}
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="prep-mini-empty">{section.emptyLabel}</div>
                                    )}
                                </div>

                                <button type="button" className={`prep-primary-btn ${section.accent}`} onClick={section.onClick}>
                                    {section.ctaLabel} <ChevronRight size={16} />
                                </button>
                            </motion.article>
                        );
                    })}
                </section>

                <section className="prep-insights-grid">
                    {platformBenefits.map((benefit) => {
                        const BenefitIcon = benefit.icon;

                        return (
                            <article key={benefit.title} className="prep-surface-card">
                                <div className="prep-surface-head">
                                    <div className="prep-surface-icon">
                                        <BenefitIcon size={18} />
                                    </div>
                                    <h3>{benefit.title}</h3>
                                </div>
                                <p>{benefit.copy}</p>
                            </article>
                        );
                    })}
                </section>

                <section className="prep-steps-section">
                    <div className="iq-section-label">
                        <span className="iq-section-label-text">Recommended Workflow</span>
                        <div className="iq-section-label-line" />
                    </div>

                    <div className="prep-step-grid">
                        {preparationFlow.map((step, index) => (
                            <article key={step.title} className="prep-step-card">
                                <span className="prep-step-number">0{index + 1}</span>
                                <h3>{step.title}</h3>
                                <p>{step.copy}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="prep-cta-panel">
                    <div>
                        <p className="prep-dashboard-kicker">Best next move</p>
                        <h2>Start with questions, then validate with a test.</h2>
                        <p>
                            The redesigned prep flow keeps every page lighter, more responsive, and easier to use across desktop, tablet, and mobile screens.
                        </p>
                    </div>
                    <div className="prep-cta-actions">
                        <button type="button" className="prep-primary-btn questions" onClick={() => onNavigate('questions')}>
                            Open Question Bank <ArrowRight size={16} />
                        </button>
                        <button type="button" className="prep-secondary-btn" onClick={() => onNavigate('tests-all')}>
                            <PlayCircle size={16} /> Run an Assessment
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PreparationHub;
