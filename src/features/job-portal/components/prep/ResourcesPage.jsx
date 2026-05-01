import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    ExternalLink,
    FileText,
    Link2,
    PlayCircle,
    Video,
    X
} from 'lucide-react';
import { getAllResources, getTopics } from '../../services/prepService';
import { PREP_RESOURCES, PREP_TOPICS } from '../../data/prepData';
import '../../styles/InterviewQuestions.css';
import PrepHeroVisual from './PrepHeroVisual';

const typeOptions = [
    { value: 'All', label: 'All formats' },
    { value: 'pdf', label: 'PDF guides' },
    { value: 'video', label: 'Video lessons' }
];

const getResourceIcon = (type) => {
    if (type === 'pdf') return FileText;
    if (type === 'video') return Video;
    return Link2;
};

const getResourceAction = (type) => {
    if (type === 'pdf') {
        return { label: 'Download resource', Icon: Download };
    }

    if (type === 'video') {
        return { label: 'Watch resource', Icon: PlayCircle };
    }

    return { label: 'Open resource', Icon: ExternalLink };
};

const ResourceDetailBody = ({ resource }) => {
    if (!resource) {
        return (
            <div className="prep-detail-empty">
                <div className="prep-detail-empty-icon">◌</div>
                <p>Select a resource to preview its format, description, and access link.</p>
            </div>
        );
    }

    const ResourceIcon = getResourceIcon(resource.type);
    const { label: actionLabel, Icon: ActionIcon } = getResourceAction(resource.type);

    return (
        <div className="prep-detail-stack">
            <div className="prep-detail-hero">
                <div className="prep-collection-item-head">
                    <div className="prep-collection-icon resources">
                        <ResourceIcon size={18} />
                    </div>
                    <div>
                        <p className="prep-dashboard-kicker">Resource overview</p>
                        <h2 className="prep-detail-title">{resource.title}</h2>
                    </div>
                </div>

                <div className="prep-chip-row">
                    <span className="prep-data-badge">{(resource.type || 'link').toUpperCase()}</span>
                    {(resource.tags || []).slice(0, 4).map((tag) => (
                        <span key={tag} className="prep-data-badge subtle">{tag}</span>
                    ))}
                </div>

                <p className="prep-detail-copy">
                    {resource.description || 'A focused learning resource curated to support technical interview preparation.'}
                </p>
            </div>

            <div className="prep-detail-grid">
                <section className="prep-detail-panel">
                    <p className="prep-detail-label">Best for</p>
                    <ul className="prep-detail-list">
                        <li>Strengthening one topic after a practice session or interview review.</li>
                        <li>Saving concise references for revision before a screening round.</li>
                        <li>Turning weak areas from mock tests into an action plan.</li>
                    </ul>
                </section>

                <section className="prep-detail-panel">
                    <p className="prep-detail-label">How to use it</p>
                    <ul className="prep-detail-list">
                        <li>Read or watch the resource, then return to questions for recall practice.</li>
                        <li>Use the tags to stay inside the same technology focus.</li>
                        <li>Open the source directly when you are ready to go deeper.</li>
                    </ul>
                </section>
            </div>

            <div className="prep-detail-footer">
                <div className="prep-detail-metrics">
                    <div>
                        <span className="prep-detail-metric-value">{(resource.type || 'link').toUpperCase()}</span>
                        <span className="prep-detail-metric-label">format</span>
                    </div>
                    <div>
                        <span className="prep-detail-metric-value">{resource.tags?.length || 0}</span>
                        <span className="prep-detail-metric-label">focus tags</span>
                    </div>
                </div>

                <a
                    className="prep-primary-btn resources"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {actionLabel} <ActionIcon size={16} />
                </a>
            </div>
        </div>
    );
};

const ResourcesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [resources, setResources] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResources, setTotalResources] = useState(0);
    const [activeResource, setActiveResource] = useState(null);
    const [mobileModalOpen, setMobileModalOpen] = useState(false);

    const pageSize = 10;

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
        const fetchResources = async () => {
            setLoading(true);
            try {
                const [resourcesResponse, topicsResponse] = await Promise.all([
                    getAllResources(currentPage, pageSize, selectedTopic === 'All' ? '' : selectedTopic, typeFilter),
                    getTopics()
                ]);

                const nextResources = resourcesResponse.content || [];
                const fallbackResources = selectedTopic === 'All'
                    ? PREP_RESOURCES
                    : PREP_RESOURCES.filter((item) => item.tags?.includes(selectedTopic));

                const resolvedResources = nextResources.length > 0 ? nextResources : fallbackResources;
                const resolvedTopics = (topicsResponse || []).length > 0 ? topicsResponse : PREP_TOPICS;

                setResources(resolvedResources);
                setTopics(resolvedTopics);
                setTotalPages(resourcesResponse.totalPages || (resolvedResources.length > 0 ? 1 : 0));
                setTotalResources(resourcesResponse.totalElements || resolvedResources.length);
            } catch (error) {
                console.error('Failed to load resources', error);
                const fallbackResources = selectedTopic === 'All'
                    ? PREP_RESOURCES
                    : PREP_RESOURCES.filter((item) => item.tags?.includes(selectedTopic));
                setResources(fallbackResources);
                setTopics(PREP_TOPICS);
                setTotalPages(fallbackResources.length > 0 ? 1 : 0);
                setTotalResources(fallbackResources.length);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, [currentPage, selectedTopic, typeFilter]);

    const filteredResources = useMemo(() => resources.filter((resource) => {
        const searchValue = searchTerm.toLowerCase();
        const title = resource.title?.toLowerCase() || '';
        const description = resource.description?.toLowerCase() || '';

        return title.includes(searchValue) || description.includes(searchValue);
    }), [resources, searchTerm]);

    useEffect(() => {
        if (filteredResources.length === 0) {
            setActiveResource(null);
            return;
        }

        if (!activeResource || !filteredResources.some((resource) => resource.id === activeResource.id)) {
            setActiveResource(filteredResources[0]);
        }
    }, [activeResource, filteredResources]);

    const pdfCount = filteredResources.filter((resource) => resource.type === 'pdf').length;
    const videoCount = filteredResources.filter((resource) => resource.type === 'video').length;
    const linkCount = filteredResources.filter((resource) => !resource.type || resource.type === 'link').length;

    const handleSelectResource = (resource) => {
        setActiveResource(resource);

        if (window.innerWidth < 768) {
            setMobileModalOpen(true);
        }
    };

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic);
        setCurrentPage(0);
    };

    if (loading && resources.length === 0) {
        return <div className="iq-shell"><div className="iq-spinner" /></div>;
    }

    return (
        <div className="iq-shell">
            <header className="iq-header">
                <div className="prep-hero-grid">
                    <div className="prep-hero-copy">
                        <div className="iq-header-meta">
                            <span className="iq-breadcrumb">Academy <span>/</span> Prep</span>
                        </div>

                        <h1 className="iq-main-title">
                            Learning <em>Resource</em> Desk
                        </h1>

                        <p className="iq-subtitle">
                            Curated resources, guides, and videos for your technical growth.
                        </p>

                        <div className="iq-stats-bar">
                            <div className="iq-stat">
                                <span className="iq-stat-num">{totalResources}+</span>
                                <span className="iq-stat-label">Resources</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num">{pdfCount}</span>
                                <span className="iq-stat-label">PDF</span>
                            </div>
                            <div className="iq-stat-divider" />
                            <div className="iq-stat">
                                <span className="iq-stat-num">{videoCount}</span>
                                <span className="iq-stat-label">Video</span>
                            </div>
                        </div>
                    </div>

                    <div className="prep-hero-visual">
                        <PrepHeroVisual type="resources" />
                    </div>
                </div>
            </header>

            <div className="iq-controls-wrap">
                <div className="iq-controls-inner">
                    <div className="iq-search-wrap">
                        <input
                            type="text"
                            className="iq-input"
                            placeholder="Search by title or description..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>

                    <div className="iq-select-wrap">
                        <select
                            className="iq-select"
                            value={typeFilter}
                            onChange={(event) => {
                                setTypeFilter(event.target.value);
                                setCurrentPage(0);
                            }}
                        >
                            {typeOptions.map((option) => (
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
                </div>
            </div>

            <main className="iq-body">

                <section className="prep-summary-grid">
                    <article className="prep-surface-card">
                        <div className="prep-surface-head">
                            <div className="prep-surface-icon"><FileText size={18} /></div>
                            <h3>Reference-first browsing</h3>
                        </div>
                        <p>Each resource opens in a cleaner detail view before you leave the page, so selection feels more deliberate.</p>
                    </article>
                    <article className="prep-surface-card">
                        <div className="prep-surface-head">
                            <div className="prep-surface-icon"><Video size={18} /></div>
                            <h3>Mixed media support</h3>
                        </div>
                        <p>Switch between PDFs, videos, and links using the same editorial layout and compact filter bar.</p>
                    </article>
                    <article className="prep-surface-card">
                        <div className="prep-surface-head">
                            <div className="prep-surface-icon"><ExternalLink size={18} /></div>
                            <h3>Direct source access</h3>
                        </div>
                        <p>Open the selected resource from the reader pane once you confirm it matches the topic you need.</p>
                    </article>
                </section>

                <div className="iq-section-label">
                    <span className="iq-section-label-text">
                        Resource catalog - {filteredResources.length} visible
                    </span>
                    <div className="iq-section-label-line" />
                </div>

                {filteredResources.length === 0 ? (
                    <div className="iq-empty">
                        <div className="iq-empty-icon">◌</div>
                        <p className="iq-empty-text">No resources match the current topic, format, and search filters.</p>
                    </div>
                ) : (
                    <div className="prep-collection-shell">
                        <div className="prep-collection-list">
                            <div className="prep-collection-list-header">
                                <span>Resources</span>
                                <span>{filteredResources.length} visible</span>
                            </div>

                            <div className="prep-collection-scroll">
                                {filteredResources.map((resource) => {
                                    const ResourceIcon = getResourceIcon(resource.type);

                                    return (
                                        <motion.button
                                            type="button"
                                            key={resource.id}
                                            className={`prep-collection-item ${activeResource?.id === resource.id ? 'active' : ''}`}
                                            onClick={() => handleSelectResource(resource)}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <div className="prep-collection-item-head">
                                                <div className="prep-collection-icon resources">
                                                    <ResourceIcon size={16} />
                                                </div>
                                                <div>
                                                    <p className="prep-collection-kicker">{(resource.type || 'link').toUpperCase()}</p>
                                                    <h3>{resource.title}</h3>
                                                </div>
                                            </div>

                                            <p className="prep-collection-preview">
                                                {resource.description || 'Curated learning material for focused technical preparation.'}
                                            </p>

                                            <div className="prep-chip-row">
                                                {(resource.tags || []).slice(0, 3).map((tag) => (
                                                    <span key={tag} className="prep-data-badge subtle">{tag}</span>
                                                ))}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="prep-collection-detail">
                            <ResourceDetailBody resource={activeResource} />
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

            <AnimatePresence>
                {mobileModalOpen && activeResource && (
                    <>
                        <div className="iq-modal-overlay" onClick={() => setMobileModalOpen(false)} style={{ display: 'block' }} />
                        <motion.div
                            className="iq-modal"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        >
                            <div className="iq-modal-header">
                                <div>
                                    <p className="prep-dashboard-kicker">Resource overview</p>
                                    <h2 className="prep-detail-title" style={{ fontSize: '1.1rem' }}>{activeResource.title}</h2>
                                </div>
                                <button type="button" className="iq-modal-close" onClick={() => setMobileModalOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <ResourceDetailBody resource={activeResource} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResourcesPage;
