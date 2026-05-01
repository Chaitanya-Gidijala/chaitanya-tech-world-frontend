import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle2,
    Clock3,
    FileText,
    MonitorPlay,
    PlayCircle,
    Search,
    Target,
    UserRound
} from 'lucide-react';

const HERO_CONFIGS = {
    hub: {
        accent: '#8b5cf6',
        soft: '#22d3ee',
        label: 'Prep workspace',
        title: 'Today preparation plan',
        subtitle: 'Questions, exams, resources',
        metric: '10+',
        metricLabel: 'assets ready',
        status: 'Interview sprint',
        statusMeta: '3 focus blocks',
        reviewTitle: 'Learning path',
        reviewMeta: 'React • SQL • DSA',
        progress: 78,
        action: 'Start now',
        cards: [
            { label: 'Mock exam', value: '25 min', Icon: Target },
            { label: 'Questions', value: '5 new', Icon: BookOpen },
            { label: 'Resources', value: 'PDF + video', Icon: FileText }
        ]
    },
    questions: {
        accent: '#f59e0b',
        soft: '#ef4444',
        label: 'Question bank',
        title: 'Answer review session',
        subtitle: 'Structured interview practice',
        metric: '48',
        metricLabel: 'answers mapped',
        status: 'STAR response',
        statusMeta: 'Concept • example • trade-off',
        reviewTitle: 'Active question',
        reviewMeta: 'React Fiber reconciliation',
        progress: 64,
        action: 'Reveal answer',
        cards: [
            { label: 'Beginner', value: '12', Icon: CheckCircle2 },
            { label: 'Mid level', value: '24', Icon: BookOpen },
            { label: 'Expert', value: '12', Icon: Target }
        ]
    },
    tests: {
        accent: '#10b981',
        soft: '#3b82f6',
        label: 'Assessment mode',
        title: 'Mock exam control desk',
        subtitle: 'Timed practice with scoring',
        metric: '25:00',
        metricLabel: 'timer armed',
        status: 'Proctored round',
        statusMeta: '30 questions • single attempt',
        reviewTitle: 'Next assessment',
        reviewMeta: 'Frontend fundamentals',
        progress: 52,
        action: 'Launch test',
        cards: [
            { label: 'Timer', value: '25 min', Icon: Clock3 },
            { label: 'Questions', value: '30', Icon: Target },
            { label: 'Score', value: 'Auto', Icon: CheckCircle2 }
        ]
    },
    resources: {
        accent: '#3b82f6',
        soft: '#14b8a6',
        label: 'Resource desk',
        title: 'Curated learning board',
        subtitle: 'Guides, videos, PDFs, links',
        metric: '8',
        metricLabel: 'sources pinned',
        status: 'Reading queue',
        statusMeta: '2 videos • 4 PDFs • 2 links',
        reviewTitle: 'Current resource',
        reviewMeta: 'System design notes',
        progress: 71,
        action: 'Open material',
        cards: [
            { label: 'PDF guides', value: '4', Icon: FileText },
            { label: 'Videos', value: '2', Icon: MonitorPlay },
            { label: 'Links', value: '2', Icon: PlayCircle }
        ]
    }
};

const PrepHeroVisual = ({ type = 'hub' }) => {
    const config = HERO_CONFIGS[type] || HERO_CONFIGS.hub;

    return (
        <motion.div
            className={`prep-real-visual prep-real-${type}`}
            style={{
                '--prep-real-accent': config.accent,
                '--prep-real-soft': config.soft,
                '--prep-real-progress': `${config.progress}%`
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
        >
            <div className="prep-real-backdrop" />
            <div className="prep-real-desk-shadow" />

            <motion.div
                className="prep-real-laptop"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="prep-real-screen">
                    <div className="prep-real-browser-bar">
                        <span />
                        <span />
                        <span />
                        <div className="prep-real-address">
                            <Search size={12} />
                            <span>{config.label}</span>
                        </div>
                    </div>

                    <div className="prep-real-screen-body">
                        <div className="prep-real-main-panel">
                            <div className="prep-real-panel-head">
                                <div>
                                    <p>{config.label}</p>
                                    <h3>{config.title}</h3>
                                </div>
                                <span className="prep-real-live-dot" />
                            </div>

                            <div className="prep-real-focus-card">
                                <div className="prep-real-avatar">
                                    <UserRound size={20} />
                                </div>
                                <div>
                                    <span>{config.status}</span>
                                    <strong>{config.statusMeta}</strong>
                                </div>
                            </div>

                            <div className="prep-real-progress-card">
                                <div className="prep-real-progress-top">
                                    <span>Readiness</span>
                                    <strong>{config.progress}%</strong>
                                </div>
                                <div className="prep-real-progress-track">
                                    <div />
                                </div>
                            </div>

                            <button type="button" className="prep-real-action">
                                {config.action}
                            </button>
                        </div>

                        <div className="prep-real-side-panel">
                            <div className="prep-real-metric">
                                <strong>{config.metric}</strong>
                                <span>{config.metricLabel}</span>
                            </div>

                            {config.cards.map(({ label, value, Icon }) => (
                                <div key={label} className="prep-real-mini-card">
                                    <div className="prep-real-mini-icon">
                                        <Icon size={15} />
                                    </div>
                                    <div>
                                        <span>{label}</span>
                                        <strong>{value}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="prep-real-keyboard">
                    {Array.from({ length: 18 }).map((_, index) => (
                        <span key={index} />
                    ))}
                </div>
                <div className="prep-real-trackpad" />
            </motion.div>

            <motion.div
                className="prep-real-floating-card prep-real-floating-card-a"
                initial={{ opacity: 0, x: -18, y: 8 }}
                animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 0.25 }, x: { delay: 0.25 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            >
                <span className="prep-real-doc-mark" />
                <div>
                    <strong>{config.reviewTitle}</strong>
                    <p>{config.reviewMeta}</p>
                </div>
            </motion.div>

            <motion.div
                className="prep-real-floating-card prep-real-floating-card-b"
                initial={{ opacity: 0, x: 18, y: -8 }}
                animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
                transition={{ opacity: { delay: 0.35 }, x: { delay: 0.35 }, y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } }}
            >
                <div className="prep-real-check">
                    <CheckCircle2 size={17} />
                </div>
                <div>
                    <strong>Ready for review</strong>
                    <p>{config.subtitle}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PrepHeroVisual;
