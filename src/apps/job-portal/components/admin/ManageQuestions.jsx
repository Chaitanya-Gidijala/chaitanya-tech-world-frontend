import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, UploadCloud, Save, X, ChevronDown, CheckCircle2, AlertCircle, MapPin, Briefcase, Clock, RefreshCw } from 'lucide-react';
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion, createQuestionsBatch, getTopics } from '../../services/prepService';
import { useToast } from '../common/Toast';
import TechBadge from '../prep/TechBadge';

const ManageQuestions = ({ refreshTrigger }) => {
    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit', 'batch'

    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Form State
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        tags: [],
        difficulty: 'INTERMEDIATE'
    });
    const [editingId, setEditingId] = useState(null);
    const [batchDrafts, setBatchDrafts] = useState([]);
    const [batchFormData, setBatchFormData] = useState({
        question: '',
        answer: '',
        tags: [],
        difficulty: 'INTERMEDIATE'
    });

    useEffect(() => {
        loadData(currentPage, selectedTag, selectedDifficulty);
    }, [refreshTrigger, currentPage, selectedTag, selectedDifficulty]);

    const loadData = async (page = 0, tag = 'All', difficulty = 'All') => {
        setIsLoading(true);
        try {
            const [qData, tData] = await Promise.all([
                getAllQuestions(page, pageSize, tag, difficulty),
                getTopics()
            ]);
            setQuestions(qData.content || []);
            setTotalPages(qData.totalPages || 0);
            setTotalElements(qData.totalElements || 0);
            setTopics(tData);
        } catch (err) {
            console.error("Failed to load data", err);
            showToast('Failed to load questions.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.question || !formData.answer) {
            showToast('Question and Answer are required.', 'error');
            return;
        }
        try {
            if (editingId) {
                await updateQuestion(editingId, formData);
                showToast('Question updated successfully!', 'success');
            } else {
                await createQuestion(formData);
                showToast('Question created successfully!', 'success');
            }
            setViewMode('list');
            setEditingId(null);
            resetForm();
            loadData();
        } catch (err) {
            showToast('Failed to save question.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await deleteQuestion(id);
            showToast('Question deleted.', 'success');
            loadData();
        } catch (err) {
            showToast('Failed to delete question.', 'error');
        }
    };

    const handleAddDraft = (e) => {
        e.preventDefault();
        if (!batchFormData.question || !batchFormData.answer) {
            showToast('Question and Answer are required for the draft.', 'error');
            return;
        }
        setBatchDrafts([...batchDrafts, { ...batchFormData, id: Date.now() }]);
        setBatchFormData({ question: '', answer: '', tags: [], difficulty: 'INTERMEDIATE' });
        showToast('Question added to batch draft list.', 'success');
    };

    const removeDraft = (id) => {
        setBatchDrafts(batchDrafts.filter(d => d.id !== id));
    };

    const handleBatchPublish = async () => {
        if (batchDrafts.length === 0) return;
        setIsLoading(true);
        try {
            const finalData = batchDrafts.map(({ id, ...rest }) => rest);
            await createQuestionsBatch(finalData);
            showToast(`${finalData.length} questions published successfully!`, 'success');
            setBatchDrafts([]);
            setViewMode('list');
            loadData();
        } catch (err) {
            showToast('Failed to publish batch.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ question: '', answer: '', tags: [], difficulty: 'INTERMEDIATE' });
    };

    const openEdit = (q) => {
        setEditingId(q.id);
        setFormData({
            question: q.question || '',
            answer: q.answer || '',
            tags: q.tags || [],
            difficulty: q.difficulty || 'INTERMEDIATE'
        });
        setViewMode('edit');
    };

    const toggleFormTag = (tagName, isBatch = false) => {
        const updater = prev => ({
            ...prev,
            tags: prev.tags.includes(tagName) ? prev.tags.filter(t => t !== tagName) : [...prev.tags, tagName]
        });
        if (isBatch) setBatchFormData(updater); else setFormData(updater);
    };

    if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><RefreshCw className="jp-spin" size={32} color="var(--jp-primary)" /></div>;

    return (
        <div style={{ maxWidth: '100%' }}>
            {/* Header / Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Manage Questions</h2>
                    <p style={{ color: 'var(--jp-text-muted)', fontSize: '0.9rem' }}>{totalElements} total questions</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => { setViewMode('list'); resetForm(); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'list' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'list' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>List</button>
                    <button onClick={() => { setViewMode('create'); resetForm(); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'create' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'create' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>+ Add New</button>
                    <button onClick={() => { setViewMode('batch'); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'batch' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'batch' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Batch</button>
                </div>
            </div>

            {viewMode === 'list' && (
                <div className="animate-in fade-in zoom-in duration-300">
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1 1 300px' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={18} />
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search questions..."
                                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', border: '1px solid var(--jp-border)', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', fontSize: '0.95rem', outline: 'none' }}
                            />
                        </div>
                        <select value={selectedTag} onChange={e => { setSelectedTag(e.target.value); setCurrentPage(0); }} style={{ padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--jp-border)', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', fontSize: '0.95rem', cursor: 'pointer', minWidth: '150px' }}>
                            <option value="All">All Topics</option>
                            {topics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                        <select value={selectedDifficulty} onChange={e => { setSelectedDifficulty(e.target.value); setCurrentPage(0); }} style={{ padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--jp-border)', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', fontSize: '0.95rem', cursor: 'pointer', minWidth: '150px' }}>
                            <option value="All">All Difficulties</option>
                            <option value="EASY">Easy</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>

                    {/* Table View (Desktop Only) */}
                    <div className="manage-q-desktop">
                        <div style={{ overflowX: 'auto', background: 'var(--jp-card-bg)', borderRadius: '12px', border: '1px solid var(--jp-border)', boxShadow: 'var(--jp-shadow)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: 'var(--jp-text-main)' }}>
                                <thead style={{ background: 'var(--jp-bg-secondary)', borderBottom: '1px solid var(--jp-border)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Question</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Difficulty</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Tags</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((q) => (
                                        <tr key={q.id} style={{ borderBottom: '1px solid var(--jp-border)' }}>
                                            <td style={{ padding: '1.25rem 1rem', verticalAlign: 'top', minWidth: '300px' }}>
                                                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{q.question}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--jp-text-muted)', fontStyle: 'italic' }}>{String(q.answer || '').substring(0, 100)}...</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', verticalAlign: 'top' }}>
                                                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: q.difficulty === 'EASY' ? 'rgba(16, 185, 129, 0.1)' : q.difficulty === 'HARD' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', color: q.difficulty === 'EASY' ? '#10b981' : q.difficulty === 'HARD' ? '#ef4444' : '#6366f1', borderRadius: '6px', fontWeight: 700 }}>{q.difficulty}</span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                    {q.tags && q.tags.map(t => <span key={t} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--jp-bg-secondary)', borderRadius: '4px' }}>{t}</span>)}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', verticalAlign: 'top', textAlign: 'right' }}>
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
                    <div className="manage-q-mobile">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {questions.map((q) => (
                                <div key={q.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '0.25rem 0.6rem',
                                            background: q.difficulty === 'EASY' ? 'rgba(16, 185, 129, 0.1)' : q.difficulty === 'HARD' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                            color: q.difficulty === 'EASY' ? '#10b981' : q.difficulty === 'HARD' ? '#ef4444' : '#6366f1',
                                            borderRadius: '6px',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>{q.difficulty}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => openEdit(q)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--jp-bg-secondary)', border: 'none', color: 'var(--jp-text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(q.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--jp-text-main)' }}>{q.question}</h3>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--jp-text-muted)',
                                        background: 'rgba(0,0,0,0.03)',
                                        padding: '0.875rem',
                                        borderRadius: '10px',
                                        maxHeight: '120px',
                                        overflowY: 'auto',
                                        border: '1px solid var(--jp-border)',
                                        lineHeight: 1.6
                                    }}>{q.answer}</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {q.tags && q.tags.map(t => <TechBadge key={t} tag={t} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: '1px solid var(--jp-border)', opacity: currentPage === 0 ? 0.5 : 1, cursor: 'pointer' }}>Prev</button>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button key={idx} onClick={() => setCurrentPage(idx)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: currentPage === idx ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: currentPage === idx ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>{idx + 1}</button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage === totalPages - 1} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: '1px solid var(--jp-border)', opacity: currentPage === totalPages - 1 ? 0.5 : 1, cursor: 'pointer' }}>Next</button>
                        </div>
                    )}
                </div>
            )}

            {(viewMode === 'create' || viewMode === 'edit') && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0 }}>{viewMode === 'edit' ? 'Edit Question' : 'Add New Question'}</h3>
                        <button onClick={() => setViewMode('list')} style={{ background: 'none', border: 'none', color: 'var(--jp-text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Question Content *</label>
                            <textarea required rows={3} value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} placeholder="Enter question..." style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correct Answer / Explanation *</label>
                            <textarea required rows={5} value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} placeholder="Enter answer..." style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Difficulty Level</label>
                                <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }}>
                                    <option value="EASY">Easy</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="HARD">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Tags</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.5rem', background: 'var(--jp-bg-secondary)', borderRadius: '10px', minHeight: '44px' }}>
                                    {topics.map(t => <TechBadge key={t.id} tech={t.name} active={formData.tags.includes(t.name)} onClick={() => toggleFormTag(t.name)} />)}
                                </div>
                            </div>
                        </div>
                        <button type="submit" style={{ height: '54px', borderRadius: '12px', background: 'var(--jp-primary)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' }}>
                            {viewMode === 'edit' ? 'Update Question' : 'Publish Question'}
                        </button>
                    </form>
                </motion.div>
            )}

            {viewMode === 'batch' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1rem 0' }}>Stage for Batch</h3>
                        <form onSubmit={handleAddDraft} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input required value={batchFormData.question} onChange={e => setBatchFormData({ ...batchFormData, question: e.target.value })} placeholder="Question..." style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                            <textarea required rows={3} value={batchFormData.answer} onChange={e => setBatchFormData({ ...batchFormData, answer: e.target.value })} placeholder="Answer..." style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                            <select value={batchFormData.difficulty} onChange={e => setBatchFormData({ ...batchFormData, difficulty: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }}>
                                <option value="EASY">Easy</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="HARD">Hard</option>
                            </select>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxHeight: '120px', overflowY: 'auto', padding: '0.5rem', background: 'var(--jp-bg-secondary)', borderRadius: '10px' }}>
                                {topics.map(t => <TechBadge key={t.id} tech={t.name} active={batchFormData.tags.includes(t.name)} onClick={() => toggleFormTag(t.name, true)} />)}
                            </div>
                            <button type="submit" style={{ padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: '1px dashed var(--jp-primary)', fontWeight: 700, cursor: 'pointer' }}>+ Add to List</button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Current Batch ({batchDrafts.length})</h3>
                            {batchDrafts.length > 0 && <button onClick={handleBatchPublish} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--jp-primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Publish Batch</button>}
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {batchDrafts.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--jp-text-muted)', padding: '2rem' }}>No items staged.</p> : batchDrafts.map((d) => (
                                <div key={d.id} style={{ padding: '0.75rem', background: 'var(--jp-bg-secondary)', borderRadius: '10px', position: 'relative' }}>
                                    <button onClick={() => removeDraft(d.id)} style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', background: 'none', border: 'none', color: '#ef4444' }}><X size={14} /></button>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', paddingRight: '1rem' }}>{d.question}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--jp-text-muted)' }}>{d.difficulty} • {d.tags.join(', ')}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            <style>{`
                @media (min-width: 769px) { .manage-q-mobile { display: none !important; } }
                @media (max-width: 768px) { 
                    .manage-q-desktop { display: none !important; }
                    .glass-panel { padding: 1.25rem !important; }
                }
            `}</style>
        </div>
    );
};

export default ManageQuestions;
