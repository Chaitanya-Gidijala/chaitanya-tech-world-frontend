import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Video, ExternalLink, Download, Filter } from 'lucide-react';
import { getAllResources, getTopics } from '../../services/prepService';
import TechBadge from './TechBadge';

const ResourcesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [resources, setResources] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 8; // 2x4 layout or 4x2 layout looks good


    useEffect(() => {
        fetchInitialData();
    }, [currentPage, selectedTags, typeFilter]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const tag = selectedTags.length > 0 ? selectedTags[0] : 'All';
            const [rData, tData] = await Promise.all([
                getAllResources(currentPage, pageSize, tag, typeFilter),
                getTopics()
            ]);
            setResources(rData.content || []);
            setTotalPages(rData.totalPages || 0);
            setTopics(tData);
        } catch (e) {
            console.error("Failed to load resources", e);
        } finally {
            setLoading(false);
        }
    };



    const filteredResources = resources.filter(r => {
        return r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase());
    });


    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
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
        <div className="jp-container" style={{ padding: '0.5rem' }}>
            <div className="jp-mobile-tight" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="jp-mobile-title-sm" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Learning Resources</h1>
                <p className="jp-mobile-text-sm" style={{ color: 'var(--jp-text-muted)' }}>Articles, videos, and documentation for tech skills.</p>
            </div>

            <div className="jp-mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.85rem 1rem 0.85rem 3rem',
                            borderRadius: '12px',
                            border: '1px solid var(--jp-border)',
                            background: 'var(--jp-bg)',
                            color: 'var(--jp-text-main)',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => { setTypeFilter('All'); setCurrentPage(0); }}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--jp-border)', background: typeFilter === 'All' ? 'var(--jp-primary)' : 'var(--jp-card-bg)', color: typeFilter === 'All' ? 'white' : 'var(--jp-text-main)', fontSize: '0.85rem', fontWeight: 600 }}
                    >All</button>

                    <button
                        onClick={() => { setTypeFilter('pdf'); setCurrentPage(0); }}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--jp-border)', background: typeFilter === 'pdf' ? 'var(--jp-primary)' : 'var(--jp-card-bg)', color: typeFilter === 'pdf' ? 'white' : 'var(--jp-text-main)', fontSize: '0.85rem', fontWeight: 600 }}
                    >PDF</button>
                    <button
                        onClick={() => { setTypeFilter('video'); setCurrentPage(0); }}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--jp-border)', background: typeFilter === 'video' ? 'var(--jp-primary)' : 'var(--jp-card-bg)', color: typeFilter === 'video' ? 'white' : 'var(--jp-text-main)', fontSize: '0.85rem', fontWeight: 600 }}
                    >Video</button>

                </div>
            </div>

            <div className="jp-mobile-tight" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {filteredResources.map((res) => (
                    <motion.div
                        key={res.id}
                        whileHover={{ y: -5 }}
                        style={{
                            background: 'var(--jp-card-bg)',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            border: '1px solid var(--jp-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: res.type === 'pdf' ? 'rgba(225, 29, 72, 0.1)' : res.type === 'video' ? 'rgba(2, 132, 199, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: res.type === 'pdf' ? '#e11d48' : res.type === 'video' ? '#0284c7' : '#16a34a'
                            }}>
                                {res.type === 'pdf' ? <FileText /> : res.type === 'video' ? <Video /> : <ExternalLink />}
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {res.tags.slice(0, 2).map(tag => (
                                    <span key={tag} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-muted)', borderRadius: '4px', border: '1px solid var(--jp-border)' }}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{res.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--jp-text-muted)', lineHeight: '1.5' }}>{res.description}</p>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--jp-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--jp-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{res.type}</span>
                            <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--jp-primary)',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.9rem'
                                }}
                            >
                                {res.type === 'pdf' ? <><Download size={16} /> Download</> : <><ExternalLink size={16} /> View Resource</>}
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

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
    );
};

export default ResourcesPage;
