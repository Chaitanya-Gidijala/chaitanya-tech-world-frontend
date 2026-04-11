import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, Save, X, Clock, BookOpen, RefreshCw } from 'lucide-react';
import { getAllQuizzes, createQuiz, updateQuiz, deleteQuiz, getTopics } from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import TechBadge from '../prep/TechBadge';
import './AdminLayout.css';

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
    const [formData, setFormData] = useState({ title:'', description:'', duration:30, totalQuestions:10, tags:[] });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(currentPage, selectedTag); }, [refreshTrigger, currentPage, selectedTag]);

    const loadData = async (page=0, tag='All') => {
        setIsLoading(true);
        try {
            const [qData, tData] = await Promise.all([getAllQuizzes(page, pageSize, tag), getTopics()]);
            setQuizzes(qData.content || []);
            setTotalPages(qData.totalPages || 0);
            setTotalElements(qData.totalElements || 0);
            setTopics(tData);
        } catch { showToast('Failed to load quizzes.', 'error'); }
        finally { setIsLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) { await updateQuiz(editingId, formData); showToast('Quiz updated!', 'success'); }
            else { await createQuiz(formData); showToast('Quiz created!', 'success'); }
            setViewMode('list'); setEditingId(null); setFormData({title:'',description:'',duration:30,totalQuestions:10,tags:[]}); loadData();
        } catch { showToast('Failed to save quiz.', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quiz?')) return;
        try { await deleteQuiz(id); showToast('Deleted.', 'success'); loadData(); }
        catch { showToast('Delete failed.', 'error'); }
    };

    const openEdit = (quiz) => {
        setEditingId(quiz.id);
        setFormData({ title:quiz.title||'', description:quiz.description||'', duration:quiz.duration||30, totalQuestions:quiz.totalQuestions||10, tags:quiz.tags||[] });
        setViewMode('create');
    };

    const toggleTag = (n) => setFormData(p => ({ ...p, tags: p.tags.includes(n) ? p.tags.filter(t=>t!==n) : [...p.tags,n] }));

    const filtered = quizzes.filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="adm-mode-switcher">
                <button className={`adm-mode-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')}>List</button>
                <button className={`adm-mode-btn ${viewMode==='create'?'active':''}`} onClick={()=>{setViewMode('create');setEditingId(null);setFormData({title:'',description:'',duration:30,totalQuestions:10,tags:[]});}}>+ Create Quiz</button>
            </div>

            {viewMode === 'list' && (
                <div>
                    <div className="adm-toolbar">
                        <div className="adm-toolbar-left">
                            <div className="adm-search-wrap">
                                <Search className="adm-search-icon" size={16}/>
                                <input className="adm-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search quizzes..."/>
                            </div>
                            <select className="adm-select" value={selectedTag} onChange={e=>{setSelectedTag(e.target.value);setCurrentPage(0);}}>
                                <option value="All">All Topics</option>
                                {topics.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                            </select>
                        </div>
                        <div className="adm-toolbar-right">
                            <span className="adm-badge adm-badge-neutral">Showing 0 to {quizzes.length} of {totalElements} quizzes</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="adm-loading-center"><RefreshCw className="adm-spinner" size={28}/></div>
                    ) : filtered.length === 0 ? (
                        <div className="adm-empty"><div className="adm-empty-icon">ðŸ§ </div><h3>No quizzes found</h3><p>Create your first quiz to get started.</p></div>
                    ) : (
                        <>
                            <div className="adm-table-card">
                                <div className="adm-table-scroll">
                                    <table className="adm-table">
                                        <thead><tr><th>ID</th><th>Title</th><th>Details</th><th>Duration</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {filtered.map((q,i) => (
                                                <motion.tr key={q.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}>
                                                    <td><span className="adm-mono">{q.id}</span></td>
                                                    <td>
                                                        <div className="adm-cell-primary">{q.title}</div>
                                                        <div className="adm-cell-muted">{String(q.description||'').substring(0,60)}{q.description?.length>60?'â€¦':''}</div>
                                                    </td>
                                                    <td>
                                                        <span className="adm-badge adm-badge-neutral"><BookOpen size={12}/> {q.totalQuestions} Qs</span>
                                                        <div className="adm-tags-row" style={{marginTop:'0.3rem'}}>{q.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div>
                                                    </td>
                                                    <td><span className="adm-badge adm-badge-primary"><Clock size={12}/> {q.duration}m</span></td>
                                                    <td><div className="adm-cell-actions"><button onClick={()=>openEdit(q)} className="adm-btn-icon"><Edit2 size={15}/></button><button onClick={()=>handleDelete(q.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button></div></td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="adm-card-grid">
                                {filtered.map((q,i) => (
                                    <motion.div key={q.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="adm-card">
                                        <div className="adm-card-header">
                                            <div style={{flex:1,minWidth:0}}>
                                                <h3 className="adm-card-title">{q.title}</h3>
                                                <p className="adm-card-subtitle">{q.description}</p>
                                            </div>
                                            <div className="adm-card-actions">
                                                <button onClick={()=>openEdit(q)} className="adm-btn-icon"><Edit2 size={15}/></button>
                                                <button onClick={()=>handleDelete(q.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button>
                                            </div>
                                        </div>
                                        <div className="adm-card-divider"/>
                                        <div className="adm-card-footer">
                                            <div>
                                                <div className="adm-card-meta-row"><BookOpen size={12}/>{q.totalQuestions} Questions</div>
                                                <div className="adm-tags-row">{q.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div>
                                            </div>
                                            <span className="adm-badge adm-badge-primary"><Clock size={12}/> {q.duration} min</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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

            {(viewMode==='create'||viewMode==='edit') && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="adm-card-panel adm-form">
                    <div className="adm-form-step-header">
                        <span className="adm-step-badge"><PlusCircle size={14}/></span>
                        <h3 className="adm-step-title">{editingId ? 'Edit Quiz' : 'Create New Quiz'}</h3>
                    </div>
                    <form onSubmit={handleSave} className="adm-form">
                        <div className="adm-field"><label className="adm-label">Quiz Title *</label><input required value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} placeholder="e.g. Java Fundamentals" className="adm-input"/></div>
                        <div className="adm-field"><label className="adm-label">Description</label><textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} placeholder="Short description..." className="adm-input adm-textarea"/></div>
                        <div className="adm-form-grid">
                            <div className="adm-field"><label className="adm-label">Duration (minutes)</label><input type="number" min="1" value={formData.duration} onChange={e=>setFormData({...formData,duration:Number(e.target.value)})} className="adm-input"/></div>
                            <div className="adm-field"><label className="adm-label">Total Questions</label><input type="number" min="1" value={formData.totalQuestions} onChange={e=>setFormData({...formData,totalQuestions:Number(e.target.value)})} className="adm-input"/></div>
                        </div>
                        <div className="adm-field"><label className="adm-label">Tags / Topics</label><div className="adm-tags-picker">{topics.map(t=><TechBadge key={t.id} tech={t.name} active={formData.tags.includes(t.name)} onClick={()=>toggleTag(t.name)}/>)}</div></div>
                        <div className="adm-modal-footer" style={{padding:0,border:'none',justifyContent:'flex-end',marginTop:'0.5rem'}}>
                            <button type="button" onClick={()=>setViewMode('list')} className="adm-btn adm-btn-secondary"><X size={15}/> Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-primary"><Save size={15}/> {editingId ? 'Update Quiz' : 'Create Quiz'}</button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default ManageQuizzes;
