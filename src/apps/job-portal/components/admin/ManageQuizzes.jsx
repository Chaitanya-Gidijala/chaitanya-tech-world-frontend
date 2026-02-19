import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, Save, CheckCircle2, AlertCircle, Clock, BookOpen } from 'lucide-react';
import { getAllQuizzes, createQuiz, updateQuiz, deleteQuiz, getTopics } from '../../services/prepService';
import { useToast } from '../common/Toast';
import TechBadge from '../prep/TechBadge';

const ManageQuizzes = ({ refreshTrigger }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [topics, setTopics] = useState([]);
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 30, // minutes
        totalQuestions: 10,
        tags: []
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadData(currentPage, selectedTag);
    }, [refreshTrigger, currentPage, selectedTag]);



    const loadData = async (page = 0, tag = 'All') => {
        setIsLoading(true);
        try {
            const [qData, tData] = await Promise.all([
                getAllQuizzes(page, pageSize, tag),
                getTopics()
            ]);

            setQuizzes(qData.content || []);
            setTotalPages(qData.totalPages || 0);
            setTotalElements(qData.totalElements || 0);
            setTopics(tData);
        } catch (err) {
            console.error(err);
            showToast('Failed to load quizzes.', 'error');
        } finally {
            setIsLoading(false);
        }
    };




    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateQuiz(editingId, formData);
                showToast('Quiz updated successfully!', 'success');
            } else {
                await createQuiz(formData);
                showToast('Quiz created successfully!', 'success');
            }
            setViewMode('list');
            setEditingId(null);
            resetForm();
            loadData();
        } catch (err) {
            showToast('Failed to save quiz.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quiz?')) return;
        try {
            await deleteQuiz(id);
            showToast('Quiz deleted.', 'success');
            loadData();
        } catch (err) {
            showToast('Failed to delete quiz.', 'error');
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', duration: 30, totalQuestions: 10, tags: [] });
    };

    const openEdit = (quiz) => {
        setEditingId(quiz.id);
        setFormData({
            title: quiz.title || '',
            description: quiz.description || '',
            duration: quiz.duration || 30,
            totalQuestions: quiz.totalQuestions || 10,
            tags: quiz.tags || []
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

    const filteredQuizzes = quizzes.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isLoading) return <div className="jp-spinner"></div>;

    return (
        <div style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Manage Quizzes</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => { setViewMode('list'); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'list' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'list' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600 }}>List</button>
                    <button onClick={() => { setViewMode('create'); resetForm(); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'create' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'create' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600 }}>+ Create Quiz</button>
                </div>
            </div>



            {viewMode === 'list' && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: '1 1 300px' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={18} />
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search quizzes..."
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
                            value={selectedTag}
                            onChange={e => {
                                setSelectedTag(e.target.value);
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
                            <option value="All">All Topics</option>
                            {topics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>
                            Showing {quizzes.length > 0 ? (currentPage * pageSize) + 1 : 0} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} quizzes
                        </span>
                    </div>

                    {/* Table View */}

                    {/* Main Content Area: Responsive View */}
                    <div>
                        {/* Desktop Table View */}
                        <div className="manage-qz-desktop">
                            <div style={{ overflowX: 'auto', background: 'var(--jp-card-bg)', borderRadius: '12px', border: '1px solid var(--jp-border)', boxShadow: 'var(--jp-shadow)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: 'var(--jp-text-main)' }}>
                                    <thead style={{ background: 'var(--jp-bg-secondary)', borderBottom: '1px solid var(--jp-border)' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>ID</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Title</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Details</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Duration</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredQuizzes.map((q) => (
                                            <tr key={q.id} style={{ borderBottom: '1px solid var(--jp-border)' }}>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--jp-text-muted)' }}>{String(q.id).substring(0, 8)}...</td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', fontWeight: 600 }}>{q.title}</td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: '300px' }}>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--jp-text-muted)', marginBottom: '0.4rem' }}>{q.description}</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', background: 'var(--jp-bg-secondary)', borderRadius: '4px', color: 'var(--jp-primary)', fontWeight: 600 }}>{q.totalQuestions} Questions</span>
                                                        {q.tags && q.tags.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--jp-bg-secondary)', borderRadius: '4px' }}>{t}</span>)}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--jp-text-muted)' }}>
                                                        <Clock size={16} /> {q.duration}m
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                        <button onClick={() => openEdit(q)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(q.id)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="manage-qz-mobile">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {filteredQuizzes.map((q) => (
                                    <div key={q.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--jp-text-main)', lineHeight: 1.3 }}>{q.title}</h3>
                                                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--jp-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} style={{ color: 'var(--jp-primary)' }} /> {q.duration}m</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><BookOpen size={14} style={{ color: 'var(--jp-secondary)' }} /> {q.totalQuestions} Qs</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openEdit(q)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--jp-bg-secondary)', border: 'none', color: 'var(--jp-text-main)', display: 'flex' }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(q.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', display: 'flex' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>

                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--jp-text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.description}</p>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--jp-border)', paddingTop: '0.75rem' }}>
                                            {q.tags && q.tags.map(t => <TechBadge key={t} tag={t} />)}
                                        </div>
                                    </div>
                                ))}
                                {filteredQuizzes.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--jp-text-muted)' }}>No quizzes found.</div>
                                )}
                            </div>
                        </div>

                        <style>{`
                            @media (min-width: 769px) { .manage-qz-mobile { display: none !important; } }
                            @media (max-width: 768px) { .manage-qz-desktop { display: none !important; } }
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
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Quiz' : 'Create New Quiz'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Quiz Title *</label>
                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Duration (mins)</label>
                                <input type="number" required value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Total Questions</label>
                                <input type="number" required value={formData.totalQuestions} onChange={e => setFormData({ ...formData, totalQuestions: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
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
                            <button type="submit" style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'var(--jp-primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Save size={18} /> Save Quiz</button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default ManageQuizzes;
