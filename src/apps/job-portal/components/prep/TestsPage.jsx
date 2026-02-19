
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, PlayCircle, Clock, BarChart, Search, X, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { getAllQuizzes, getTopics } from '../../services/prepService';
import TechBadge from './TechBadge';

const TestsPage = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [tests, setTests] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 9; // Grid of 3x3 layout looks good


    useEffect(() => {
        fetchInitialData();
    }, [currentPage, selectedTags]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const tag = selectedTags.length > 0 ? selectedTags[0] : 'All';
            const [tData, tpData] = await Promise.all([
                getAllQuizzes(currentPage, pageSize, tag),
                getTopics()
            ]);
            setTests(tData.content || []);
            setTotalPages(tData.totalPages || 0);
            setTopics(tpData);
        } catch (e) {
            console.error("Failed to load tests", e);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tech = params.get('tech');
        if (tech) {
            setSelectedTags(tech.split(','));
        }
    }, []);

    const toggleTag = (tag) => {
        setCurrentPage(0); // Reset page on filter change
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([tag]); // Single tag filtering for robustness
        }
    };


    const filteredTests = tests.filter(t => {
        return t.title.toLowerCase().includes(searchTerm.toLowerCase());
    });


    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem' }}>
            <div className="jp-spinner"></div>
            <p style={{ color: 'var(--jp-text-muted)', fontWeight: 500 }}>Loading assessments...</p>
        </div>
    );

    return (
        <div className="jp-container" style={{ padding: '0 1rem 4rem 1rem' }}>
            {/* Simple Clean Header */}
            <div style={{ margin: '3rem 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--jp-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    Assessment Center
                </h1>
                <p style={{ color: 'var(--jp-text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                    Validate your professional skills with standardized mock assessments.
                </p>
            </div>

            {/* Structured Professional Filter Section */}
            <div style={{
                background: 'var(--jp-card-bg)',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid var(--jp-border)',
                marginBottom: '3rem',
                boxShadow: 'var(--jp-shadow-sm)'
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    {/* Compact Search Wrapper */}
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by assessment name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 2.5rem 0.75rem 2.75rem',
                                borderRadius: '12px',
                                border: '1px solid var(--jp-border)',
                                background: 'var(--jp-bg)',
                                color: 'var(--jp-text-main)',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--jp-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--jp-border)'}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--jp-text-muted)', display: 'flex' }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div style={{ width: '1px', height: '24px', background: 'var(--jp-border)', display: 'flex' }} className="desktop-only"></div>

                    {/* Simple Tags Row */}
                    <div style={{ flex: '1 1 400px', display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <SlidersHorizontal size={16} style={{ color: 'var(--jp-text-muted)', flexShrink: 0 }} />
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }} className="no-scrollbar">
                            <button
                                onClick={() => { setSelectedTags([]); setCurrentPage(0); }}

                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    border: selectedTags.length === 0 ? '1px solid var(--jp-primary)' : '1px solid var(--jp-border)',
                                    background: selectedTags.length === 0 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    color: selectedTags.length === 0 ? 'var(--jp-primary)' : 'var(--jp-text-muted)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                All Topics
                            </button>
                            {topics.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => toggleTag(topic.name)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        border: selectedTags.includes(topic.name) ? '1px solid var(--jp-primary)' : '1px solid var(--jp-border)',
                                        background: selectedTags.includes(topic.name) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        color: selectedTags.includes(topic.name) ? 'var(--jp-primary)' : 'var(--jp-text-muted)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {topic.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessment Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                <AnimatePresence>
                    {filteredTests.map((test) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ y: -4, boxShadow: 'var(--jp-shadow)' }}
                            style={{
                                background: 'var(--jp-card-bg)',
                                padding: '1.5rem',
                                borderRadius: '24px',
                                border: '1px solid var(--jp-border)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--jp-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Target size={22} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    {test.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', color: 'var(--jp-text-muted)', background: 'var(--jp-bg)', borderRadius: '6px', textTransform: 'uppercase' }}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--jp-text-main)', marginBottom: '0.75rem', lineHeight: '1.3' }}>{test.title}</h3>

                            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', color: 'var(--jp-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Clock size={16} /> {test.duration} mins
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <BarChart size={16} /> {test.questions ? test.questions.length : 0} Questions
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigate('mcq', test)}
                                style={{
                                    width: '100%',
                                    marginTop: 'auto',
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'var(--jp-primary)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                Start Assessment <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTests.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: 'var(--jp-card-bg)', borderRadius: '24px', border: '1px dashed var(--jp-border)' }}>
                        <p style={{ color: 'var(--jp-text-muted)', fontSize: '1.1rem' }}>No assessments found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedTags([]); }}
                            style={{ marginTop: '1rem', color: 'var(--jp-primary)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '3rem' }}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px',
                                background: 'var(--jp-card-bg)',
                                color: currentPage === 0 ? 'var(--jp-text-muted)' : 'var(--jp-text-main)',
                                border: '1px solid var(--jp-border)',
                                cursor: currentPage === 0 ? 'default' : 'pointer',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                opacity: currentPage === 0 ? 0.5 : 1
                            }}
                        >
                            Previous
                        </button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx)}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '12px',
                                        background: currentPage === idx ? 'var(--jp-primary)' : 'var(--jp-card-bg)',
                                        color: currentPage === idx ? 'white' : 'var(--jp-text-main)',
                                        border: '1px solid var(--jp-border)',
                                        cursor: 'pointer',
                                        fontWeight: 800,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px',
                                background: 'var(--jp-card-bg)',
                                color: currentPage === totalPages - 1 ? 'var(--jp-text-muted)' : 'var(--jp-text-main)',
                                border: '1px solid var(--jp-border)',
                                cursor: currentPage === totalPages - 1 ? 'default' : 'pointer',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                opacity: currentPage === totalPages - 1 ? 0.5 : 1
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default TestsPage;
