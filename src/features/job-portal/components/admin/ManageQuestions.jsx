import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, UploadCloud, Save, X, RefreshCw } from 'lucide-react';
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion, createQuestionsBatch, getTopics } from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import TechBadge from '../prep/TechBadge';
import './AdminLayout.css';

const DIFF_BADGE = { EASY: 'adm-badge-success', INTERMEDIATE: 'adm-badge-warning', HARD: 'adm-badge-danger' };

const ManageQuestions = ({ refreshTrigger }) => {
    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;
    const [formData, setFormData] = useState({ question: '', answer: '', tags: [], difficulty: 'INTERMEDIATE' });
    const [editingId, setEditingId] = useState(null);
    const [batchDrafts, setBatchDrafts] = useState([]);
    const [batchFormData, setBatchFormData] = useState({ question: '', answer: '', tags: [], difficulty: 'INTERMEDIATE' });

    useEffect(() => { loadData(currentPage, selectedTag, selectedDifficulty); }, [refreshTrigger, currentPage, selectedTag, selectedDifficulty]);

    const loadData = async (page = 0, tag = 'All', diff = 'All') => {
        setIsLoading(true);
        try {
            const [qData, tData] = await Promise.all([getAllQuestions(page, pageSize, tag, diff), getTopics()]);
            setQuestions(qData.content || []);
            setTotalPages(qData.totalPages || 0);
            setTotalElements(qData.totalElements || 0);
            setTopics(tData);
        } catch { showToast('Failed to load questions.', 'error'); }
        finally { setIsLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.question || !formData.answer) { showToast('Question and Answer required.', 'error'); return; }
        try {
            if (editingId) { await updateQuestion(editingId, formData); showToast('Question updated!', 'success'); }
            else { await createQuestion(formData); showToast('Question created!', 'success'); }
            setViewMode('list'); setEditingId(null); setFormData({ question:'',answer:'',tags:[],difficulty:'INTERMEDIATE' }); loadData();
        } catch { showToast('Failed to save.', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try { await deleteQuestion(id); showToast('Deleted.', 'success'); loadData(); }
        catch { showToast('Delete failed.', 'error'); }
    };

    const handleAddDraft = (e) => {
        e.preventDefault();
        if (!batchFormData.question || !batchFormData.answer) { showToast('Fill Question and Answer.', 'error'); return; }
        setBatchDrafts(prev => [...prev, { ...batchFormData, id: Date.now() }]);
        setBatchFormData({ question:'',answer:'',tags:[],difficulty:'INTERMEDIATE' });
        showToast('Added to batch!', 'success');
    };

    const handleBatchPublish = async () => {
        if (!batchDrafts.length) return;
        setIsLoading(true);
        try {
            await createQuestionsBatch(batchDrafts.map(({ id, ...rest }) => rest));
            showToast(`${batchDrafts.length} questions published!`, 'success');
            setBatchDrafts([]); setViewMode('list'); loadData();
        } catch { showToast('Batch publish failed.', 'error'); }
        finally { setIsLoading(false); }
    };

    const openEdit = (q) => {
        setEditingId(q.id);
        setFormData({ question: q.question||'', answer: q.answer||'', tags: q.tags||[], difficulty: q.difficulty||'INTERMEDIATE' });
        setViewMode('edit');
    };

    const toggleTag = (tagName, isBatch = false) => {
        const upd = prev => ({ ...prev, tags: prev.tags.includes(tagName) ? prev.tags.filter(t=>t!==tagName) : [...prev.tags, tagName] });
        if (isBatch) setBatchFormData(upd); else setFormData(upd);
    };

    return (
        <div>
            {/* Mode bar */}
            <div className="adm-mode-switcher">
                <button className={`adm-mode-btn ${viewMode==='list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List</button>
                <button className={`adm-mode-btn ${viewMode==='create'||viewMode==='edit' ? 'active' : ''}`} onClick={() => { setViewMode('create'); setEditingId(null); setFormData({question:'',answer:'',tags:[],difficulty:'INTERMEDIATE'}); }}>+ Add New</button>
                <button className={`adm-mode-btn ${viewMode==='batch' ? 'active' : ''}`} onClick={() => setViewMode('batch')}>Batch</button>
            </div>

            {/* LIST */}
            {viewMode === 'list' && (
                <div>
                    <div className="adm-toolbar">
                        <div className="adm-toolbar-left">
                            <div className="adm-search-wrap">
                                <Search className="adm-search-icon" size={16} />
                                <input className="adm-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search questions..." />
                            </div>
                            <select className="adm-select" value={selectedTag} onChange={e=>{setSelectedTag(e.target.value);setCurrentPage(0);}}>
                                <option value="All">All Topics</option>
                                {topics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                            </select>
                            <select className="adm-select" value={selectedDifficulty} onChange={e=>{setSelectedDifficulty(e.target.value);setCurrentPage(0);}}>
                                <option value="All">All Difficulties</option>
                                <option value="EASY">Easy</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                        <div className="adm-toolbar-right">
                            <span className="adm-badge adm-badge-neutral">{totalElements} questions</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="adm-loading-center"><RefreshCw className="adm-spinner" size={28} /></div>
                    ) : questions.length === 0 ? (
                        <div className="adm-empty"><div className="adm-empty-icon">â“</div><h3>No questions found</h3><p>Try adjusting filters or add new questions.</p></div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="adm-table-card">
                                <div className="adm-table-scroll">
                                    <table className="adm-table">
                                        <thead><tr><th>Question</th><th>Difficulty</th><th>Tags</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {questions.map((q, i) => (
                                                <motion.tr key={q.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}>
                                                    <td style={{maxWidth:340}}>
                                                        <div className="adm-cell-primary" style={{lineHeight:1.4}}>{q.question}</div>
                                                        <div className="adm-cell-muted" style={{fontStyle:'italic'}}>{String(q.answer||'').substring(0,80)}â€¦</div>
                                                    </td>
                                                    <td><span className={`adm-badge ${DIFF_BADGE[q.difficulty] || 'adm-badge-neutral'}`}>{q.difficulty}</span></td>
                                                    <td><div className="adm-tags-row">{q.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div></td>
                                                    <td><div className="adm-cell-actions"><button onClick={()=>openEdit(q)} className="adm-btn-icon"><Edit2 size={15}/></button><button onClick={()=>handleDelete(q.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button></div></td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Mobile */}
                            <div className="adm-card-grid">
                                {questions.map((q,i) => (
                                    <motion.div key={q.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="adm-card">
                                        <div className="adm-card-header">
                                            <div style={{flex:1,minWidth:0}}>
                                                <span className={`adm-badge ${DIFF_BADGE[q.difficulty]||'adm-badge-neutral'}`}>{q.difficulty}</span>
                                                <h3 className="adm-card-title" style={{marginTop:'0.5rem'}}>{q.question}</h3>
                                            </div>
                                            <div className="adm-card-actions">
                                                <button onClick={()=>openEdit(q)} className="adm-btn-icon"><Edit2 size={15}/></button>
                                                <button onClick={()=>handleDelete(q.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button>
                                            </div>
                                        </div>
                                        <div className="adm-answer-preview">{q.answer}</div>
                                        <div className="adm-tags-row">{q.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div>
                                    </motion.div>
                                ))}
                            </div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="adm-pagination">
                                    <button className="adm-btn adm-btn-secondary" onClick={()=>setCurrentPage(p=>Math.max(0,p-1))} disabled={currentPage===0}>Prev</button>
                                    <span className="adm-page-subtitle">Page {currentPage+1} / {totalPages}</span>
                                    <button className="adm-btn adm-btn-secondary" onClick={()=>setCurrentPage(p=>Math.min(totalPages-1,p+1))} disabled={currentPage===totalPages-1}>Next</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* CREATE / EDIT */}
            {(viewMode==='create'||viewMode==='edit') && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="adm-card-panel adm-form">
                    <div className="adm-form-step-header">
                        <span className="adm-step-badge"><PlusCircle size={14}/></span>
                        <h3 className="adm-step-title">{viewMode==='edit' ? 'Edit Question' : 'Add New Question'}</h3>
                    </div>
                    <form onSubmit={handleSave} className="adm-form">
                        <div className="adm-field"><label className="adm-label">Question *</label><textarea required rows={3} value={formData.question} onChange={e=>setFormData({...formData,question:e.target.value})} placeholder="Enter question..." className="adm-input adm-textarea" /></div>
                        <div className="adm-field"><label className="adm-label">Answer / Explanation *</label><textarea required rows={5} value={formData.answer} onChange={e=>setFormData({...formData,answer:e.target.value})} placeholder="Enter answer..." className="adm-input adm-textarea" /></div>
                        <div className="adm-form-grid">
                            <div className="adm-field">
                                <label className="adm-label">Difficulty</label>
                                <select value={formData.difficulty} onChange={e=>setFormData({...formData,difficulty:e.target.value})} className="adm-input">
                                    <option value="EASY">Easy</option><option value="INTERMEDIATE">Intermediate</option><option value="HARD">Hard</option>
                                </select>
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Topics / Tags</label>
                                <div className="adm-tags-picker">{topics.map(t=><TechBadge key={t.id} tech={t.name} active={formData.tags.includes(t.name)} onClick={()=>toggleTag(t.name)} />)}</div>
                            </div>
                        </div>
                        <div className="adm-modal-footer" style={{padding:0,border:'none',justifyContent:'flex-end',marginTop:'0.5rem'}}>
                            <button type="button" onClick={()=>setViewMode('list')} className="adm-btn adm-btn-secondary"><X size={15}/> Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-primary"><Save size={15}/> {viewMode==='edit' ? 'Update' : 'Publish'}</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* BATCH */}
            {viewMode === 'batch' && (
                <div className="adm-batch-layout">
                    <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} className="adm-card-panel adm-form">
                        <div className="adm-form-step-header"><span className="adm-step-badge">1</span><h3 className="adm-step-title">Stage a Question</h3></div>
                        <form onSubmit={handleAddDraft} className="adm-form">
                            <div className="adm-field"><label className="adm-label">Question</label><input required value={batchFormData.question} onChange={e=>setBatchFormData({...batchFormData,question:e.target.value})} placeholder="Question..." className="adm-input" /></div>
                            <div className="adm-field"><label className="adm-label">Answer</label><textarea required rows={3} value={batchFormData.answer} onChange={e=>setBatchFormData({...batchFormData,answer:e.target.value})} placeholder="Answer..." className="adm-input adm-textarea" /></div>
                            <div className="adm-field"><label className="adm-label">Difficulty</label><select value={batchFormData.difficulty} onChange={e=>setBatchFormData({...batchFormData,difficulty:e.target.value})} className="adm-input"><option value="EASY">Easy</option><option value="INTERMEDIATE">Intermediate</option><option value="HARD">Hard</option></select></div>
                            <div className="adm-field"><label className="adm-label">Tags</label><div className="adm-tags-picker">{topics.map(t=><TechBadge key={t.id} tech={t.name} active={batchFormData.tags.includes(t.name)} onClick={()=>toggleTag(t.name,true)} />)}</div></div>
                            <button type="submit" className="adm-btn adm-btn-dashed adm-btn-wide"><PlusCircle size={16}/> Add to Batch</button>
                        </form>
                    </motion.div>
                    <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} className="adm-card-panel">
                        <div className="adm-batch-review-header">
                            <div className="adm-form-step-header" style={{border:'none',padding:0,marginBottom:0}}><span className="adm-step-badge">2</span><h3 className="adm-step-title">Batch ({batchDrafts.length})</h3></div>
                            {batchDrafts.length>0 && <button onClick={handleBatchPublish} disabled={isLoading} className="adm-btn adm-btn-primary"><UploadCloud size={15}/> Publish</button>}
                        </div>
                        <div className="adm-batch-list">
                            {batchDrafts.length===0 ? <p className="adm-page-subtitle" style={{textAlign:'center',padding:'2rem'}}>No questions staged yet.</p>
                            : batchDrafts.map(d=>(
                                <div key={d.id} className="adm-batch-item">
                                    <div className="adm-batch-item-info"><div><p className="adm-batch-item-title">{d.question}</p><p className="adm-batch-item-meta">{d.difficulty} Â· {d.tags.join(', ')}</p></div></div>
                                    <button onClick={()=>setBatchDrafts(p=>p.filter(x=>x.id!==d.id))} className="adm-btn-icon delete"><X size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageQuestions;
