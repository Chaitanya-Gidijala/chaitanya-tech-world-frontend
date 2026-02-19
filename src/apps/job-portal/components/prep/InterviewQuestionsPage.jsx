import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Tag, Filter } from 'lucide-react';
import { getAllQuestions, getTopics } from '../../services/prepService';
import TechBadge from './TechBadge';

const InterviewQuestionsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [difficulty, setDifficulty] = useState('All');
    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;


    useEffect(() => {
        fetchInitialData();
    }, [currentPage, selectedTags, difficulty]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Priority: Technology Filter (selectedTags) takes precedence in search
            const tag = selectedTags.length > 0 ? selectedTags[0] : 'All';
            const [qData, tData] = await Promise.all([
                getAllQuestions(currentPage, pageSize, tag, difficulty),
                getTopics()
            ]);

            setQuestions(qData.content || []);
            setTotalPages(qData.totalPages || 0);
            setTopics(tData);
        } catch (e) {
            console.error("❌ Failed to load questions", e);
        } finally {
            setLoading(false);
        }
    };




    const filteredQuestions = questions.filter(q => {
        // Search term is client-side for immediate feedback
        return q.question.toLowerCase().includes(searchTerm.toLowerCase());
    });





    const toggleTag = (tag) => {
        setCurrentPage(0); // Reset page on filter change
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([tag]); // For now, single tag search is more robust with current API
        }
    };


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tech = params.get('tech');
        if (tech) {
            setSelectedTags(tech.split(','));
        }
    }, []);

    if (loading) return <div className="jp-spinner"></div>;

    return (
        <div className="jp-container" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section - Clean & Clear Style */}
            <div style={{
                background: 'var(--jp-card-bg)',
                borderRadius: '24px',
                padding: '2rem',
                border: '1px solid var(--jp-border)',
                marginBottom: '2rem',
                boxShadow: 'var(--jp-shadow)',
                textAlign: 'left' // Enforce left alignment
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '0.75rem',
                    fontWeight: 800,
                    color: 'var(--jp-text-main)',
                    lineHeight: 1.2
                }}>
                    Interview Question Bank
                </h1>
                <p style={{
                    color: 'var(--jp-text-muted)',
                    fontSize: '1.1rem',
                    maxWidth: '800px',
                    lineHeight: 1.6
                }}>
                    Master your next interview. Explore our curated collection of technical questions across various difficulties and technologies.
                </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
                className="jp-mobile-only"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                style={{
                    display: 'none',
                    width: '100%',
                    padding: '0.875rem',
                    marginBottom: '1rem',
                    background: 'var(--jp-card-bg)',
                    border: '1px solid var(--jp-border)',
                    borderRadius: '12px',
                    color: 'var(--jp-text-main)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600
                }}>
                <Filter size={18} /> {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Filters Section - Standardized Inputs */}
            <div className={`jp-filters-panel ${mobileFiltersOpen ? 'open' : ''}`} style={{
                marginBottom: '2.5rem'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={20} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 3rem',
                                borderRadius: '12px',
                                border: '1px solid var(--jp-border)',
                                background: 'var(--jp-card-bg)', // Match theme
                                color: 'var(--jp-text-main)',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={difficulty}
                            onChange={(e) => {
                                setDifficulty(e.target.value);
                                setCurrentPage(0);
                            }}

                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--jp-border)',
                                background: 'var(--jp-card-bg)', // Match theme
                                color: 'var(--jp-text-main)',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                appearance: 'none',
                                outline: 'none'
                            }}
                        >
                            <option value="All">All Difficulties</option>
                            <option value="EASY">Easy</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="HARD">Hard</option>

                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--jp-text-muted)' }} />
                    </div>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--jp-text-muted)', fontWeight: 600 }}>
                        <Tag size={14} /> Technology
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <TechBadge
                            tech="All"
                            active={selectedTags.length === 0}
                            onClick={() => {
                                setSelectedTags([]);
                                setCurrentPage(0);
                            }}
                        />
                        {topics.map(topic => (

                            <TechBadge
                                key={topic.id}
                                tech={topic.name}
                                active={selectedTags.includes(topic.name)}
                                onClick={() => toggleTag(topic.name)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Questions List - Clean Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredQuestions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--jp-card-bg)', borderRadius: '24px', border: '1px solid var(--jp-border)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--jp-text-main)' }}>No questions found</h3>
                        <p style={{ color: 'var(--jp-text-muted)' }}>Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedTags([]); setDifficulty('All'); }}
                            style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'var(--jp-primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    filteredQuestions.map((q, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={q.id}
                            style={{
                                background: 'var(--jp-card-bg)',
                                borderRadius: '16px',
                                border: '1px solid var(--jp-border)',
                                overflow: 'hidden',
                                boxShadow: 'var(--jp-shadow-sm)',
                                transition: 'all 0.2s ease'
                            }}
                            whileHover={{ borderColor: 'var(--jp-primary-light)', transform: 'translateY(-2px)' }}
                        >
                            <div
                                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                                style={{
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '1.5rem'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            background: q.difficulty?.toUpperCase() === 'EASY' ? 'rgba(16, 185, 129, 0.1)' : q.difficulty?.toUpperCase() === 'HARD' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: q.difficulty?.toUpperCase() === 'EASY' ? '#10b981' : q.difficulty?.toUpperCase() === 'HARD' ? '#ef4444' : '#fbbf24',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            textTransform: 'capitalize'
                                        }}>
                                            {q.difficulty?.toLowerCase()}
                                        </span>

                                        {q.tags && q.tags.map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '0.75rem',
                                                padding: '0.35rem 0.75rem',
                                                background: 'var(--jp-bg-secondary)',
                                                borderRadius: '8px',
                                                color: 'var(--jp-text-muted)',
                                                fontWeight: 500
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: '1.5', margin: 0, color: 'var(--jp-text-main)' }}>{q.question}</h3>
                                </div>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    background: expandedId === q.id ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)',
                                    color: expandedId === q.id ? 'white' : 'var(--jp-text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    flexShrink: 0
                                }}>
                                    {expandedId === q.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === q.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ borderTop: '1px solid var(--jp-border)', background: 'var(--jp-bg-secondary)' }}
                                    >
                                        <div style={{ padding: '2rem', lineHeight: '1.8', color: 'var(--jp-text-main)', fontSize: '1rem' }}>
                                            <div style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--jp-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '4px', height: '1.5rem', background: 'var(--jp-primary)', borderRadius: '2px' }}></div>
                                                Suggested Answer
                                            </div>
                                            <div style={{ whiteSpace: 'pre-wrap' }}>{q.answer}</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '3rem', padding: '1rem' }}>
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
                                opacity: currentPage === 0 ? 0.5 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            Previous
                        </button>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {(() => {
                                const pageNumbers = [];
                                const showEllipsisStart = currentPage > 2;
                                const showEllipsisEnd = currentPage < totalPages - 3;

                                // Always show first page
                                pageNumbers.push(
                                    <button
                                        key={0}
                                        onClick={() => setCurrentPage(0)}
                                        style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '12px',
                                            background: currentPage === 0 ? 'var(--jp-primary)' : 'var(--jp-card-bg)',
                                            color: currentPage === 0 ? 'white' : 'var(--jp-text-main)',
                                            border: '1px solid var(--jp-border)',
                                            cursor: 'pointer',
                                            fontWeight: 800,
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            boxShadow: currentPage === 0 ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                                        }}
                                    >
                                        1
                                    </button>
                                );

                                // Show ellipsis if needed
                                if (showEllipsisStart) {
                                    pageNumbers.push(
                                        <span key="ellipsis-start" style={{ color: 'var(--jp-text-muted)', fontSize: '1.2rem', fontWeight: 'bold' }}>...</span>
                                    );
                                }

                                // Show current page and neighbors
                                const start = Math.max(1, currentPage - 1);
                                const end = Math.min(totalPages - 2, currentPage + 1);

                                for (let i = start; i <= end; i++) {
                                    pageNumbers.push(
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i)}
                                            style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '12px',
                                                background: currentPage === i ? 'var(--jp-primary)' : 'var(--jp-card-bg)',
                                                color: currentPage === i ? 'white' : 'var(--jp-text-main)',
                                                border: '1px solid var(--jp-border)',
                                                cursor: 'pointer',
                                                fontWeight: 800,
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s',
                                                boxShadow: currentPage === i ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                }

                                // Show ellipsis if needed
                                if (showEllipsisEnd) {
                                    pageNumbers.push(
                                        <span key="ellipsis-end" style={{ color: 'var(--jp-text-muted)', fontSize: '1.2rem', fontWeight: 'bold' }}>...</span>
                                    );
                                }

                                // Always show last page if there's more than 1 page
                                if (totalPages > 1) {
                                    pageNumbers.push(
                                        <button
                                            key={totalPages - 1}
                                            onClick={() => setCurrentPage(totalPages - 1)}
                                            style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '12px',
                                                background: currentPage === totalPages - 1 ? 'var(--jp-primary)' : 'var(--jp-card-bg)',
                                                color: currentPage === totalPages - 1 ? 'white' : 'var(--jp-text-main)',
                                                border: '1px solid var(--jp-border)',
                                                cursor: 'pointer',
                                                fontWeight: 800,
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s',
                                                boxShadow: currentPage === totalPages - 1 ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                                            }}
                                        >
                                            {totalPages}
                                        </button>
                                    );
                                }

                                return pageNumbers;
                            })()}
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
                                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>

            <style>{`
                @media (max-width: 768px) {
                    .jp-mobile-only { display: flex !important; }
                    .jp-filters-panel { display: none; }
                    .jp-filters-panel.open { display: block; }
                }
            `}</style>
        </div>
    );
};

export default InterviewQuestionsPage;
