
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, FileText, ChevronRight, Search, PlayCircle } from 'lucide-react';
import { getAllQuestions, getAllResources, getAllQuizzes, getTopics } from '../../services/prepService';
import TechBadge from './TechBadge';

const PreparationHub = ({ onNavigate }) => {
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [topics, setTopics] = useState([]);
    const [tests, setTests] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [resources, setResources] = useState([]);
    const [counts, setCounts] = useState({ tests: 0, questions: 0, resources: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const qt = await getTopics();
                setTopics(qt);
            } catch (e) {
                console.error("Error fetching topics", e);
            }
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const tag = selectedTopic === 'All' ? '' : selectedTopic;
                const [t, q, r] = await Promise.all([
                    getAllQuizzes(0, 10, tag),
                    getAllQuestions(0, 10, tag),
                    getAllResources(0, 10, tag)
                ]);

                setTests(t.content || []);
                setQuestions(q.content || []);
                setResources(r.content || []);

                setCounts({
                    tests: t.totalElements || (t.content ? t.content.length : 0),
                    questions: q.totalElements || (q.content ? q.content.length : 0),
                    resources: r.totalElements || (r.content ? r.content.length : 0)
                });

            } catch (e) {
                console.error("Error fetching prep hub data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [selectedTopic]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tech = params.get('tech');
        if (tech) {
            const tags = tech.split(',');
            if (tags.length > 0) setSelectedTopic(tags[0]);
        }
    }, []);

    if (loading) return <div className="jp-spinner"></div>;

    const filteredTests = tests;
    const filteredQuestions = questions;
    const filteredResources = resources;

    return (
        <div className="jp-container" style={{ padding: '0.5rem' }}>
            <div className="jp-mobile-tight" style={{ marginBottom: 'clamp(1.5rem, 5vw, 3rem)', textAlign: 'center' }}>
                <h1 className="jp-mobile-title-sm" style={{ fontSize: 'clamp(1.75rem, 8vw, 2.5rem)', marginBottom: '0.5rem', color: 'var(--jp-text-main)' }}>Preparation Hub</h1>
                <p className="jp-mobile-text-sm" style={{ fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', color: 'var(--jp-text-muted)', maxWidth: '600px', margin: '0 auto' }}>Central destination for interview and assessment prep.</p>
            </div>

            {/* Topic Switcher */}
            <div className="jp-mobile-tight" style={{ marginBottom: '3rem' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--jp-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Explore by Technology</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                    <TechBadge tech="All" active={selectedTopic === 'All'} onClick={() => setSelectedTopic('All')} />
                    {topics.map(topic => (
                        <TechBadge
                            key={topic.id}
                            tech={topic.name}
                            active={selectedTopic === topic.name}
                            onClick={() => setSelectedTopic(topic.name)}
                        />
                    ))}
                </div>
            </div>

            <div className="jp-mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
                {/* MCQ Tests Card */}
                <motion.div
                    whileHover={{ y: window.innerWidth > 768 ? -5 : 0 }}
                    className="jp-mobile-compact"
                    style={{
                        background: 'var(--jp-card-bg)',
                        padding: 'clamp(1.25rem, 4vw, 2rem)',
                        borderRadius: '24px',
                        boxShadow: 'var(--jp-shadow)',
                        border: '1px solid var(--jp-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.6rem', background: '#eff6ff', color: 'var(--jp-primary)', borderRadius: '12px' }}>
                            <Target size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem' }}>Mock Assessments</h3>
                            <p style={{ color: 'var(--jp-text-muted)', fontSize: '0.85rem' }}>{counts.tests} Tests available</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: '120px' }}>
                        {filteredTests.slice(0, 2).map(test => (
                            <div key={test.id} style={{ padding: '0.75rem', background: 'var(--jp-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--jp-border)', fontSize: '0.95rem' }}>
                                <span style={{ fontWeight: 600 }}>{test.title}</span>
                                <button onClick={() => onNavigate('mcq', test)} style={{ background: 'none', border: 'none', color: 'var(--jp-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: '0.5rem' }}><PlayCircle size={18} /></button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => onNavigate('tests-all')}
                        style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--jp-primary)', color: 'var(--jp-primary)', background: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                    >
                        View All Tests <ChevronRight size={16} />
                    </button>
                </motion.div>

                {/* Interview Questions Card */}
                <motion.div
                    whileHover={{ y: window.innerWidth > 768 ? -5 : 0 }}
                    className="jp-mobile-compact"
                    style={{
                        background: 'var(--jp-card-bg)',
                        padding: 'clamp(1.25rem, 4vw, 2rem)',
                        borderRadius: '24px',
                        boxShadow: 'var(--jp-shadow)',
                        border: '1px solid var(--jp-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.6rem', background: '#fdf2f8', color: '#db2777', borderRadius: '12px' }}>
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem' }}>Interview Q&A</h3>
                            <p style={{ color: 'var(--jp-text-muted)', fontSize: '0.85rem' }}>{counts.questions} Questions</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: '120px' }}>
                        {filteredQuestions.slice(0, 2).map(q => (
                            <div key={q.id} style={{ padding: '0.75rem', background: 'var(--jp-bg)', borderRadius: '12px', border: '1px solid var(--jp-border)', fontSize: '0.95rem' }}>
                                <span style={{ fontWeight: 600 }}>{q.question}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => onNavigate('questions')}
                        style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #db2777', color: '#db2777', background: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                    >
                        Practice Questions <ChevronRight size={16} />
                    </button>
                </motion.div>

                {/* Resources Card */}
                <motion.div
                    whileHover={{ y: window.innerWidth > 768 ? -5 : 0 }}
                    className="jp-mobile-compact"
                    style={{
                        background: 'var(--jp-card-bg)',
                        padding: 'clamp(1.25rem, 4vw, 2rem)',
                        borderRadius: '24px',
                        boxShadow: 'var(--jp-shadow)',
                        border: '1px solid var(--jp-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.6rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem' }}>Learning Materials</h3>
                            <p style={{ color: 'var(--jp-text-muted)', fontSize: '0.85rem' }}>{counts.resources} Resources</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: '120px' }}>
                        {filteredResources.slice(0, 2).map(r => (
                            <div key={r.id} style={{ padding: '0.75rem', background: 'var(--jp-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--jp-border)', fontSize: '0.95rem' }}>
                                <span style={{ fontWeight: 600 }}>{r.title}</span>
                                <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', background: 'var(--jp-border)', borderRadius: '4px', flexShrink: 0, marginLeft: '0.5rem' }}>{r.type}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => onNavigate('resources-all')}
                        style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #16a34a', color: '#16a34a', background: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                    >
                        Browse All Materials <ChevronRight size={16} />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default PreparationHub;
