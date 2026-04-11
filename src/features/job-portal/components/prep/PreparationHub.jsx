
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
        <div className="jp-container">
            <header className="jp-prep-header">
                <h1 className="jp-prep-title">Preparation Hub</h1>
                <p className="jp-prep-subtitle">Your central destination for interview prep, skill validation, and technical resources.</p>
            </header>

            {/* Topic Switcher */}
            <div className="jp-tech-switcher">
                <span className="label">Explore by Technology</span>
                <div className="jp-tech-list">
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

            <div className="jp-prep-grid">
                {/* MCQ Tests Card */}
                <motion.div
                    whileHover={{ y: -8 }}
                    className="jp-prep-card"
                >
                    <div className="jp-prep-card-header">
                        <div className="jp-prep-icon-box blue">
                            <Target size={26} />
                        </div>
                        <div>
                            <h3 className="jp-prep-card-title">Mock Assessments</h3>
                            <p className="jp-prep-card-subtitle">{counts.tests} interactive tests</p>
                        </div>
                    </div>

                    <div className="jp-prep-content-list">
                        {filteredTests.slice(0, 2).map(test => (
                            <div key={test.id} className="jp-prep-item">
                                <span>{test.title}</span>
                                <button onClick={() => onNavigate('mcq', test)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <PlayCircle size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => onNavigate('tests-all')}
                        className="jp-prep-btn blue"
                    >
                        View All Tests <ChevronRight size={18} />
                    </button>
                </motion.div>

                {/* Interview Questions Card */}
                <motion.div
                    whileHover={{ y: -8 }}
                    className="jp-prep-card"
                >
                    <div className="jp-prep-card-header">
                        <div className="jp-prep-icon-box pink">
                            <BookOpen size={26} />
                        </div>
                        <div>
                            <h3 className="jp-prep-card-title">Interview Q&A</h3>
                            <p className="jp-prep-card-subtitle">{counts.questions} shared questions</p>
                        </div>
                    </div>

                    <div className="jp-prep-content-list">
                        {filteredQuestions.slice(0, 2).map(q => (
                            <div key={q.id} className="jp-prep-item">
                                <span>{q.question}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => onNavigate('questions')}
                        className="jp-prep-btn pink"
                    >
                        Practice Questions <ChevronRight size={18} />
                    </button>
                </motion.div>

                {/* Resources Card */}
                <motion.div
                    whileHover={{ y: -8 }}
                    className="jp-prep-card"
                >
                    <div className="jp-prep-card-header">
                        <div className="jp-prep-icon-box green">
                            <FileText size={26} />
                        </div>
                        <div>
                            <h3 className="jp-prep-card-title">Learning Materials</h3>
                            <p className="jp-prep-card-subtitle">{counts.resources} curated resources</p>
                        </div>
                    </div>

                    <div className="jp-prep-content-list">
                        {filteredResources.slice(0, 2).map(r => (
                            <div key={r.id} className="jp-prep-item">
                                <span>{r.title}</span>
                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--jp-border)', borderRadius: '6px' }}>{r.type}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => onNavigate('resources-all')}
                        className="jp-prep-btn green"
                    >
                        Browse All Materials <ChevronRight size={18} />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default PreparationHub;
