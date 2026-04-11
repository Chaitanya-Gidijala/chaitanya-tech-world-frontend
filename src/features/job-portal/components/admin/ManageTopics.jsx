import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, UploadCloud, Save, X } from 'lucide-react';
import { getTopics, createTopic, updateTopic, deleteTopic, createTopicsBatch } from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import './AdminLayout.css';

const ManageTopics = ({ refreshTrigger }) => {
    const [topics, setTopics] = useState([]);
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ id: '', name: '', icon: '' });
    const [editingTopicId, setEditingTopicId] = useState(null);
    const [batchJson, setBatchJson] = useState('');

    useEffect(() => { loadData(); }, [refreshTrigger]);

    const loadData = async () => {
        setIsLoading(true);
        try { setTopics(await getTopics()); }
        catch { showToast('Failed to load topics.', 'error'); }
        finally { setIsLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingTopicId) { await updateTopic(editingTopicId, formData); showToast('Topic updated!', 'success'); }
            else { await createTopic(formData); showToast('Topic created!', 'success'); }
            setViewMode('list'); setEditingTopicId(null); setFormData({ id: '', name: '', icon: '' }); loadData();
        } catch { showToast('Failed to save topic.', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Delete topic "${id}"?`)) return;
        try { await deleteTopic(id); showToast('Topic deleted.', 'success'); loadData(); }
        catch { showToast('Delete failed. Topic may be in use.', 'error'); }
    };

    const handleBatchUpload = async (e) => {
        e.preventDefault();
        try {
            const data = JSON.parse(batchJson);
            if (!Array.isArray(data)) throw new Error('Must be array');
            await createTopicsBatch(data);
            showToast(`${data.length} topics uploaded!`, 'success');
            setBatchJson(''); setViewMode('list'); loadData();
        } catch { showToast('Invalid JSON or upload failed.', 'error'); }
    };

    const openEdit = (t) => {
        setEditingTopicId(t.id);
        setFormData({ id: t.id, name: t.name || '', icon: t.icon || '' });
        setViewMode('create');
    };

    const filtered = topics.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Mode bar */}
            <div className="adm-mode-switcher">
                <button className={`adm-mode-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List</button>
                <button className={`adm-mode-btn ${viewMode === 'create' ? 'active' : ''}`} onClick={() => { setViewMode('create'); setFormData({ id:'',name:'',icon:'' }); setEditingTopicId(null); }}>+ Add New</button>
                <button className={`adm-mode-btn ${viewMode === 'batch' ? 'active' : ''}`} onClick={() => setViewMode('batch')}>Batch Upload</button>
            </div>

            {/* LIST */}
            {viewMode === 'list' && (
                <div>
                    <div className="adm-toolbar">
                        <div className="adm-toolbar-left">
                            <div className="adm-search-wrap">
                                <Search className="adm-search-icon" size={16} />
                                <input className="adm-search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search topics..." />
                            </div>
                        </div>
                        <div className="adm-toolbar-right">
                            <span className="adm-badge adm-badge-neutral">{filtered.length} topics</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="adm-loading-center"><div className="adm-spinner" style={{width:28,height:28,border:'3px solid var(--jp-border)',borderTop:'3px solid var(--jp-primary)',borderRadius:'50%'}} /></div>
                    ) : filtered.length === 0 ? (
                        <div className="adm-empty"><div className="adm-empty-icon">ðŸ“Œ</div><h3>No topics found</h3><p>Create your first topic to get started.</p></div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="adm-table-card">
                                <div className="adm-table-scroll">
                                    <table className="adm-table">
                                        <thead><tr><th>ID</th><th>Icon</th><th>Name</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {filtered.map((t, i) => (
                                                <motion.tr key={t.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}>
                                                    <td><span className="adm-mono">{t.id}</span></td>
                                                    <td><span style={{fontSize:'1.5rem'}}>{t.icon || 'ðŸ“Œ'}</span></td>
                                                    <td><span className="adm-cell-primary">{t.name}</span></td>
                                                    <td><div className="adm-cell-actions"><button onClick={() => openEdit(t)} className="adm-btn-icon"><Edit2 size={15} /></button><button onClick={() => handleDelete(t.id)} className="adm-btn-icon delete"><Trash2 size={15} /></button></div></td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Mobile cards */}
                            <div className="adm-card-grid">
                                {filtered.map((t, i) => (
                                    <motion.div key={t.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="adm-card">
                                        <div className="adm-card-header">
                                            <div className="adm-card-title-group">
                                                <span style={{fontSize:'2rem'}}>{t.icon || 'ðŸ“Œ'}</span>
                                                <div><h3 className="adm-card-title">{t.name}</h3><p className="adm-card-subtitle"><span className="adm-mono">{t.id}</span></p></div>
                                            </div>
                                            <div className="adm-card-actions">
                                                <button onClick={() => openEdit(t)} className="adm-btn-icon"><Edit2 size={15} /></button>
                                                <button onClick={() => handleDelete(t.id)} className="adm-btn-icon delete"><Trash2 size={15} /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* CREATE / EDIT */}
            {viewMode === 'create' && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="adm-card-panel adm-form" style={{maxWidth:520}}>
                    <div className="adm-form-step-header">
                        <span className="adm-step-badge"><PlusCircle size={14} /></span>
                        <h3 className="adm-step-title">{editingTopicId ? 'Edit Topic' : 'Add New Topic'}</h3>
                    </div>
                    <form onSubmit={handleSave} className="adm-form">
                        <div className="adm-field">
                            <label className="adm-label">Topic ID *</label>
                            <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={!!editingTopicId} placeholder="e.g. spring-boot" className="adm-input" />
                            {editingTopicId && <p style={{fontSize:'0.75rem',color:'var(--jp-text-muted)',margin:'0.25rem 0 0'}}>ID cannot be changed after creation.</p>}
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Name *</label>
                            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Spring Boot" className="adm-input" />
                        </div>
                        <div className="adm-field">
                            <label className="adm-label">Icon (Emoji)</label>
                            <input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="e.g. ðŸƒ" className="adm-input" />
                            <div className="adm-emoji-picker" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem', padding: '0.6rem', background: 'var(--jp-bg-secondary)', borderRadius: '8px' }}>
                                {['âš›ï¸', 'ðŸƒ', 'â˜•', 'ðŸŸ¨', 'ðŸ”·', 'ðŸŸ¢', 'ðŸ', 'ðŸ³', 'â˜¸ï¸', 'â˜ï¸', 'ðŸ—„ï¸', 'ðŸ“±', 'ðŸŒ', 'ðŸ§ª', 'ðŸ›¡ï¸', 'âš™ï¸', 'ðŸ¦€', 'ðŸŽ', 'ðŸ§', 'ðŸ”¥', 'ðŸš€', 'ðŸŽ¨'].map(e => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => setFormData({...formData, icon: e})}
                                        style={{ fontSize: '1.2rem', padding: '0.4rem', border: '1px solid var(--jp-border)', background: 'var(--jp-card-bg)', borderRadius: '6px', cursor: 'pointer' }}
                                        title="Click to select"
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="adm-modal-footer" style={{padding:0,border:'none',justifyContent:'flex-end'}}>
                            <button type="button" onClick={() => setViewMode('list')} className="adm-btn adm-btn-secondary"><X size={15} /> Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-primary"><Save size={15} /> Save Topic</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* BATCH */}
            {viewMode === 'batch' && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="adm-card-panel adm-form">
                    <div className="adm-form-step-header">
                        <span className="adm-step-badge"><UploadCloud size={14} /></span>
                        <h3 className="adm-step-title">Batch Upload Topics</h3>
                    </div>
                    <p className="adm-page-subtitle">Paste a JSON array of topic objects.</p>
                    <div className="adm-field">
                        <label className="adm-label">JSON Array</label>
                        <textarea required value={batchJson} onChange={e => setBatchJson(e.target.value)} rows={8} placeholder={`[\n  { "id": "java", "name": "Java", "icon": "â˜•" },\n  ...\n]`} className="adm-input adm-textarea adm-json-textarea" />
                    </div>
                    <div className="adm-form-footer">
                        <button onClick={handleBatchUpload} className="adm-btn adm-btn-primary"><UploadCloud size={16} /> Upload Batch</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ManageTopics;
