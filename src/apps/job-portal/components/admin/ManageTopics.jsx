import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, UploadCloud, Save, CheckCircle2, AlertCircle, Hash } from 'lucide-react';
import { getTopics, createTopic, updateTopic, deleteTopic, createTopicsBatch } from '../../services/prepService';
import { useToast } from '../common/Toast';

const ManageTopics = ({ refreshTrigger }) => {
    const [topics, setTopics] = useState([]);
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'batch'

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ id: '', name: '', icon: '' });
    const [editingTopicId, setEditingTopicId] = useState(null);
    const [batchJson, setBatchJson] = useState('');

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getTopics();
            setTopics(data);
        } catch (err) {
            console.error("Failed to load topics", err);
            showToast('Failed to load topics.', 'error');
        } finally {
            setIsLoading(false);
        }
    };



    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingTopicId) {
                await updateTopic(editingTopicId, formData);
                showToast('Topic updated successfully!', 'success');
            } else {
                await createTopic(formData);
                showToast('Topic created successfully!', 'success');
            }
            setViewMode('list');
            setEditingTopicId(null);
            resetForm();
            loadData();
        } catch (err) {
            showToast('Failed to save topic.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete topic "${id}"?`)) return;
        try {
            await deleteTopic(id);
            showToast('Topic deleted.', 'success');
            loadData();
        } catch (err) {
            showToast('Failed to delete topic. It may be in use.', 'error');
        }
    };

    const handleBatchUpload = async (e) => {
        e.preventDefault();
        try {
            const data = JSON.parse(batchJson);
            if (!Array.isArray(data)) throw new Error('Data must be an array.');

            await createTopicsBatch(data);
            showToast(`${data.length} topics uploaded successfully!`, 'success');
            setBatchJson('');
            setViewMode('list');
            loadData();
        } catch (err) {
            showToast('Invalid JSON or upload failed.', 'error');
        }
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', icon: '' });
    };

    const openEdit = (t) => {
        setEditingTopicId(t.id);
        setFormData({ id: t.id, name: t.name || '', icon: t.icon || '' });
        setViewMode('create');
    };

    const filteredTopics = topics.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="jp-spinner"></div>;

    return (
        <div style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Manage Topics</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => { setViewMode('list'); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'list' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'list' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600 }}>List</button>
                    <button onClick={() => { setViewMode('create'); resetForm(); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'create' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'create' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600 }}>+ Add New</button>
                    <button onClick={() => { setViewMode('batch'); }} style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: viewMode === 'batch' ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)', color: viewMode === 'batch' ? 'white' : 'var(--jp-text-main)', border: 'none', fontWeight: 600 }}>Batch Upload</button>
                </div>
            </div>



            {viewMode === 'list' && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <div style={{ position: 'relative', marginBottom: '2rem', maxWidth: '400px' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={18} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search topics..."
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

                    {/* Main Content Area: Responsive View */}
                    <div>
                        {/* Desktop Table View */}
                        <div className="manage-tp-desktop">
                            <div style={{ overflowX: 'auto', background: 'var(--jp-card-bg)', borderRadius: '12px', border: '1px solid var(--jp-border)', boxShadow: 'var(--jp-shadow)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: 'var(--jp-text-main)' }}>
                                    <thead style={{ background: 'var(--jp-bg-secondary)', borderBottom: '1px solid var(--jp-border)' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>ID</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Icon</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Name</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTopics.map((t) => (
                                            <tr key={t.id} style={{ borderBottom: '1px solid var(--jp-border)' }}>
                                                <td style={{ padding: '1rem', verticalAlign: 'middle', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>{t.id}</td>
                                                <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '10px',
                                                        background: 'var(--jp-bg-secondary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.25rem',
                                                        border: '1px solid var(--jp-border)'
                                                    }}>
                                                        {t.icon || '📌'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', verticalAlign: 'middle', fontWeight: 600, fontSize: '1rem' }}>{t.name}</td>
                                                <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                        <button onClick={() => openEdit(t)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(t.id)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="manage-tp-mobile">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                                {filteredTopics.map((t) => (
                                    <div key={t.id} className="glass-panel" style={{
                                        padding: '1.25rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        gap: '1rem',
                                        position: 'relative',
                                        background: 'var(--jp-card-bg)',
                                        border: '1px solid var(--jp-border)'
                                    }}>
                                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                                            <button onClick={() => openEdit(t)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--jp-bg-secondary)', border: 'none', color: 'var(--jp-text-main)', display: 'flex' }}><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(t.id)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', display: 'flex' }}><Trash2 size={14} /></button>
                                        </div>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '14px',
                                            background: 'var(--jp-bg-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.75rem',
                                            border: '1px solid var(--jp-border)',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            {t.icon || '📌'}
                                        </div>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--jp-text-main)', marginBottom: '0.2rem' }}>{t.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--jp-text-muted)', fontFamily: 'monospace', opacity: 0.8 }}>ID: {t.id}</div>
                                        </div>
                                    </div>
                                ))}
                                {filteredTopics.length === 0 && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--jp-text-muted)' }}>No topics found.</div>
                                )}
                            </div>
                        </div>

                        <style>{`
                            @media (min-width: 769px) { .manage-tp-mobile { display: none !important; } }
                            @media (max-width: 768px) { .manage-tp-desktop { display: none !important; } }
                        `}</style>
                    </div>
                </div>
            )}

            {viewMode === 'create' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
                    <h3 style={{ marginTop: 0 }}>{editingTopicId ? 'Edit Topic' : 'Add New Topic'}</h3>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Topic ID *</label>
                            <input required value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} disabled={!!editingTopicId} placeholder="e.g. spring-boot" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: editingTopicId ? 'rgba(0,0,0,0.05)' : 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)', cursor: editingTopicId ? 'not-allowed' : 'text' }} />
                            {editingTopicId && <p style={{ fontSize: '0.8rem', color: 'var(--jp-text-muted)', margin: '0.3rem 0 0' }}>ID cannot be changed once created.</p>}
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name *</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Spring Boot" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Icon (Emoji)</label>
                            <input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g. 🍃" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button type="button" onClick={() => setViewMode('list')} style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'var(--jp-primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Save size={18} /> Save Topic</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {viewMode === 'batch' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginTop: 0 }}>Batch Upload Topics</h3>
                    <p style={{ color: 'var(--jp-text-muted)', marginBottom: '1.5rem' }}>Paste a JSON array of topic objects below.</p>
                    <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '1.5rem', overflowX: 'auto' }}>
                        {`[
  {
    "id": "java",
    "name": "Java",
    "icon": "☕"
  },
  ...
]`}
                    </div>
                    <form onSubmit={handleBatchUpload}>
                        <textarea required value={batchJson} onChange={e => setBatchJson(e.target.value)} rows={10} placeholder="Paste your JSON here..." style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)', fontFamily: 'monospace', marginBottom: '1.5rem' }} />
                        <button type="submit" style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'var(--jp-primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UploadCloud size={18} /> Upload Batch
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default ManageTopics;
