import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, Save, UploadCloud, CheckCircle2, AlertCircle, ExternalLink, Video, FileText } from 'lucide-react';
import { getAllResources, createResource, updateResource, deleteResource, getTopics } from '../../services/prepService';
import { useToast } from '../common/Toast';
import TechBadge from '../prep/TechBadge';

const ManageResources = ({ refreshTrigger }) => {
    const [resources, setResources] = useState([]);
    const [topics, setTopics] = useState([]);
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        type: 'LINK', // Backend expects: LINK, VIDEO, PDF
        tags: [],
        jobId: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadData(currentPage, selectedType);
    }, [refreshTrigger, currentPage, selectedType]);



    const loadData = async (page = 0, type = 'All') => {
        setIsLoading(true);
        try {
            const apiType = type === 'All' ? 'All' : type;
            const [rData, tData] = await Promise.all([
                getAllResources(page, pageSize, 'All', apiType),
                getTopics()
            ]);

            setResources(rData.content || []);
            setTotalPages(rData.totalPages || 0);
            setTotalElements(rData.totalElements || 0);
            setTopics(tData);
        } catch (err) {
            console.error(err);
            showToast('Failed to load resources.', 'error');
        } finally {
            setIsLoading(false);
        }
    };




    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateResource(editingId, formData);
                showToast('Resource updated successfully!', 'success');
            } else {
                await createResource(formData);
                showToast('Resource added successfully!', 'success');
            }
            setViewMode('list');
            setEditingId(null);
            resetForm();
            loadData();
        } catch (err) {
            showToast('Failed to save resource.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            await deleteResource(id);
            showToast('Resource deleted.', 'success');
            loadData();
        } catch (err) {
            showToast('Failed to delete resource.', 'error');
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', url: '', type: 'LINK', tags: [], jobId: null });
    };

    const openEdit = (r) => {
        // Map any legacy or non-standard types to backend accepted ones
        let initialType = r.type?.toUpperCase() || 'LINK';
        if (initialType === 'ARTICLE' || initialType === 'COURSE') initialType = 'LINK';

        setEditingId(r.id);
        setFormData({
            title: r.title || '',
            description: r.description || '',
            url: r.url || r.link || '',
            type: initialType,
            tags: r.tags || [],
            jobId: r.jobId || null
        });
        setViewMode('create');
    };

    const toggleFormTag = (tagName) => {
        setFormData(prev => {
            const tags = prev.tags.includes(tagName)
                ? prev.tags.filter(t => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags };
        });
    };

    const filteredResources = resources.filter(r => {
        return r.title.toLowerCase().includes(searchTerm.toLowerCase());
    });


    const getTypeIcon = (type) => {
        const t = (type || 'LINK').toUpperCase();
        switch (t) {
            case 'VIDEO': return <Video size={16} />;
            case 'PDF': return <FileText size={16} />;
            default: return <ExternalLink size={16} />;
        }
    };

    if (isLoading) return <div className="jp-spinner"></div>;

    return (
        <div style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Manage Resources</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => { setViewMode('list'); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'list' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'list' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600 }}>List</button>
                    <button onClick={() => { setViewMode('create'); resetForm(); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'create' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'create' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600 }}>+ Add New</button>
                </div>
            </div>



            {viewMode === 'list' && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1 1 300px' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={18} />
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search resources..."
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--jp-border)',
                                    background: 'var(--jp-bg-secondary)',
                                    color: 'var(--jp-text-main)',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <select
                            value={selectedType}
                            onChange={e => {
                                setSelectedType(e.target.value);
                                setCurrentPage(0); // Reset to first page
                            }}

                            style={{
                                padding: '0.875rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--jp-border)',
                                background: 'var(--jp-bg-secondary)',
                                color: 'var(--jp-text-main)',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                minWidth: '150px'
                            }}
                        >
                            <option value="All">All Types</option>
                            <option value="LINK">Link / Article</option>
                            <option value="VIDEO">Video</option>
                            <option value="PDF">PDF</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>
                            Showing {resources.length > 0 ? (currentPage * pageSize) + 1 : 0} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} resources
                        </span>
                    </div>

                    {/* Table View */}

                    {/* Main Content Area: Responsive View */}
                    <div>
                        {/* Desktop Table View */}
                        <div className="manage-res-desktop">
                            <div style={{ overflowX: 'auto', background: 'var(--jp-card-bg)', borderRadius: '12px', border: '1px solid var(--jp-border)', boxShadow: 'var(--jp-shadow)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: 'var(--jp-text-main)' }}>
                                    <thead style={{ background: 'var(--jp-bg-secondary)', borderBottom: '1px solid var(--jp-border)' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>ID</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Type</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Title</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>URL / Description</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Tags</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResources.map((r) => (
                                            <tr key={r.id} style={{ borderBottom: '1px solid var(--jp-border)' }}>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--jp-text-muted)' }}>{String(r.id).substring(0, 8)}...</td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--jp-bg-secondary)', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                                                        {getTypeIcon(r.type)} {r.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', fontWeight: 600 }}>{r.title}</td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: '300px' }}>
                                                    <a href={r.url || r.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'var(--jp-primary)', marginBottom: '0.25rem', textDecoration: 'none', fontSize: '0.85rem', wordBreak: 'break-all' }}>{r.url || r.link}</a>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--jp-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.description}</span>
                                                </td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                        {r.tags && r.tags.map(t => (
                                                            <span key={t} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--jp-bg-secondary)', borderRadius: '4px' }}>{t}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                        <button onClick={() => openEdit(r)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(r.id)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="manage-res-mobile">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {filteredResources.map((r) => (
                                    <div key={r.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.6rem', background: 'var(--jp-bg-secondary)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--jp-primary)', marginBottom: '0.5rem', border: '1px solid var(--jp-border)' }}>
                                                    {getTypeIcon(r.type)} {r.type}
                                                </div>
                                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--jp-text-main)', lineHeight: 1.4 }}>{r.title}</h3>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openEdit(r)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--jp-bg-secondary)', border: 'none', color: 'var(--jp-text-main)', display: 'flex' }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(r.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', display: 'flex' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>

                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--jp-text-muted)', lineHeight: 1.5 }}>{r.description}</p>

                                        <a href={r.url || r.link} target="_blank" rel="noopener noreferrer" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            color: 'white',
                                            background: 'var(--jp-primary)',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                        }}>
                                            <ExternalLink size={16} /> View Resource
                                        </a>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--jp-border)', paddingTop: '0.75rem' }}>
                                            {r.tags && r.tags.map(t => <TechBadge key={t} tag={t} />)}
                                        </div>
                                    </div>
                                ))}
                                {filteredResources.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--jp-text-muted)' }}>No resources found.</div>
                                )}
                            </div>
                        </div>

                        <style>{`
                            @media (min-width: 769px) { .manage-res-mobile { display: none !important; } }
                            @media (max-width: 768px) { .manage-res-desktop { display: none !important; } }
                        `}</style>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    background: 'var(--jp-bg-secondary)',
                                    color: currentPage === 0 ? 'var(--jp-text-muted)' : 'var(--jp-text-main)',
                                    border: '1px solid var(--jp-border)',
                                    cursor: currentPage === 0 ? 'default' : 'pointer',
                                    fontWeight: 600,
                                    opacity: currentPage === 0 ? 0.5 : 1
                                }}
                            >
                                Previous
                            </button>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: currentPage === idx ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)',
                                            color: currentPage === idx ? 'white' : 'var(--jp-text-main)',
                                            border: '1px solid var(--jp-border)',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            fontSize: '0.85rem'
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
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    background: 'var(--jp-bg-secondary)',
                                    color: currentPage === totalPages - 1 ? 'var(--jp-text-muted)' : 'var(--jp-text-main)',
                                    border: '1px solid var(--jp-border)',
                                    cursor: currentPage === totalPages - 1 ? 'default' : 'pointer',
                                    fontWeight: 600,
                                    opacity: currentPage === totalPages - 1 ? 0.5 : 1
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

            )}

            {viewMode === 'create' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Title *</label>
                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Resource URL *</label>
                            <input required type="url" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://example.com/..." style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Type</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }}>
                                    <option value="LINK">Link / Article</option>
                                    <option value="VIDEO">Video</option>
                                    <option value="PDF">PDF</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                                <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tags</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', background: 'var(--jp-bg-secondary)', borderRadius: '10px', minHeight: '44px' }}>
                                {topics.map(t => (
                                    <TechBadge key={t.id} tech={t.name} active={formData.tags.includes(t.name)} onClick={() => toggleFormTag(t.name)} />
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button type="button" onClick={() => setViewMode('list')} style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'var(--jp-primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Save size={18} /> Save Resource</button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default ManageResources;
