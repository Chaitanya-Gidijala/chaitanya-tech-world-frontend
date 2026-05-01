import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Brain, Clock, Edit2, PlusCircle, RefreshCw, Save, 
    Search, Trash2, X, UploadCloud, FileCode, ChevronDown, ListPlus, Trash, 
    ShieldCheck, CheckCircle, Copy
} from 'lucide-react';
import { 
    createQuiz, deleteQuiz, getAllQuizzes, getTopics, 
    updateQuiz, createQuizzesBatch 
} from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import './AdminLayout.css';

const DEFAULT_TOPICS = [
    "Android Development", "Cloud Computing", "Cyber Security", "DevOps & Docker", 
    "Data Structures & Algorithms", "HTML & CSS", "Java", "JavaScript", 
    "Machine Learning", "Node.js", "Python", "React.js", "Spring Boot", 
    "SQL & Databases", "System Design"
];

const createEmptyQuestion = () => ({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
});

const createDefaultForm = () => ({
    title: '',
    description: '',
    duration: 30,
    tags: [],
    questions: [createEmptyQuestion()]
});

const normalizeQuestions = (questions = []) => {
    if (!Array.isArray(questions) || questions.length === 0) {
        return [createEmptyQuestion()];
    }
    return questions.map((q) => ({
        question: q.question || '',
        options: Array.isArray(q.options) && q.options.length >= 4
            ? q.options.slice(0, 4)
            : [...Array(4)].map((_, i) => q.options?.[i] || ''),
        correctAnswer: q.correctAnswer || ''
    }));
};

const ManageQuizzes = ({ refreshTrigger }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [dbTopics, setDbTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(createDefaultForm());
    const [jsonInput, setJsonInput] = useState('');
    const { showToast } = useToast();

    const pageSize = 15;

    // Use DB topics if available, else fallback to standard list
    const availableTopics = dbTopics.length > 0 ? dbTopics.map(t => t.name) : DEFAULT_TOPICS;

    useEffect(() => { loadData(currentPage, selectedTag); }, [refreshTrigger, currentPage, selectedTag]);

    const loadData = async (page = 0, tag = 'All') => {
        setIsLoading(true);
        try {
            const [qData, tData] = await Promise.all([
                getAllQuizzes(page, pageSize, tag === 'All' ? '' : tag),
                getTopics()
            ]);
            setQuizzes(qData.content || []);
            setTotalPages(qData.totalPages || 0);
            setTotalElements(qData.totalElements || 0);
            setDbTopics(tData || []);
        } catch (error) {
            showToast('Failed to load assessments.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            duration: Number(formData.duration) || 30,
            totalQuestions: formData.questions.length,
            questions: formData.questions.filter(q => q.question && q.correctAnswer)
        };

        if (!payload.title) { showToast('Title required.', 'error'); return; }
        if (payload.questions.length === 0) { showToast('Add at least one complete question.', 'error'); return; }

        try {
            if (editingId) { await updateQuiz(editingId, payload); showToast('Quiz updated!', 'success'); }
            else { await createQuiz(payload); showToast('Quiz published!', 'success'); }
            setViewMode('list'); setEditingId(null); setFormData(createDefaultForm()); loadData();
        } catch { showToast('Failed to save quiz.', 'error'); }
    };

    const handleBatchUpload = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            setIsLoading(true);
            await createQuizzesBatch(items);
            showToast(`${items.length} assessments live!`, 'success');
            setJsonInput(''); setViewMode('list'); loadData();
        } catch { showToast('Invalid JSON format.', 'error'); }
        finally { setIsLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this assessment?')) return;
        try { await deleteQuiz(id); showToast('Deleted.', 'success'); loadData(); }
        catch { showToast('Delete failed.', 'error'); }
    };

    const openEdit = (quiz) => {
        setEditingId(quiz.id);
        setFormData({
            title: quiz.title || '',
            description: quiz.description || '',
            duration: quiz.duration || 30,
            tags: quiz.tags || [],
            questions: normalizeQuestions(quiz.questions)
        });
        setViewMode('create');
    };

    const toggleTag = (tagName) => {
        setFormData(prev => ({ 
            ...prev, 
            tags: prev.tags.includes(tagName) ? prev.tags.filter(t => t !== tagName) : [...prev.tags, tagName] 
        }));
    };

    const addQuestion = () => setFormData(prev => ({ ...prev, questions: [...prev.questions, createEmptyQuestion()] }));
    const removeQuestion = (idx) => setFormData(prev => ({ ...prev, questions: prev.questions.length === 1 ? [createEmptyQuestion()] : prev.questions.filter((_, i) => i !== idx) }));
    
    const updateQuestionField = (qIdx, field, val) => {
        const newQs = [...formData.questions];
        newQs[qIdx] = { ...newQs[qIdx], [field]: val };
        setFormData({ ...formData, questions: newQs });
    };

    const updateOption = (qIdx, oIdx, val) => {
        const newQs = [...formData.questions];
        const newOpts = [...newQs[qIdx].options];
        newOpts[oIdx] = val;
        newQs[qIdx] = { ...newQs[qIdx], options: newOpts };
        setFormData({ ...formData, questions: newQs });
    };

    const copyCurrentAsJson = () => {
        const payload = { ...formData, totalQuestions: formData.questions.length };
        setJsonInput(JSON.stringify(payload, null, 2));
        setViewMode('batch');
        showToast('Form data copied to JSON tab!', 'info');
    };

    const filteredQuizzes = quizzes.filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="adm-questions-container">
            <div className="adm-mode-switcher">
                <button className={`adm-mode-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')}>Quiz Library</button>
                <button className={`adm-mode-btn ${viewMode==='create'?'active':''}`} onClick={()=>{setEditingId(null); setFormData(createDefaultForm()); setViewMode('create');}}>+ New Assessment</button>
                <button className={`adm-mode-btn ${viewMode==='batch'?'active':''}`} onClick={()=>setViewMode('batch')}>Batch Import</button>
            </div>

            {viewMode === 'list' && (
                <div>
                    <div className="adm-toolbar">
                        <div className="adm-toolbar-left">
                            <div className="adm-search-wrap">
                                <Search className="adm-search-icon" size={16}/>
                                <input className="adm-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search quizzes..."/>
                            </div>
                            <select className="adm-select" value={selectedTag} onChange={e=>{setSelectedTag(e.target.value); setCurrentPage(0);}}>
                                <option value="All">All Techs</option>
                                {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button onClick={() => loadData(currentPage, selectedTag)} className="adm-btn-icon" title="Refresh List"><RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /></button>
                        </div>
                        <div className="adm-toolbar-right">
                            <span className="adm-badge adm-badge-neutral">{totalElements} Active Assessments</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="adm-loading-center"><RefreshCw className="adm-spinner animate-spin" size={32}/></div>
                    ) : filteredQuizzes.length === 0 ? (
                        <div className="adm-empty">
                            <div className="adm-empty-icon"><Brain size={48}/></div>
                            <h3>No assessments found</h3>
                            <p>Launch your first technical quiz to start tracking candidate skills.</p>
                        </div>
                    ) : (
                        <>
                            <div className="adm-table-card">
                                <div className="adm-table-scroll">
                                    <table className="adm-table">
                                        <thead><tr><th>Title / Concept</th><th>Status</th><th>Time</th><th>Topics</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {filteredQuizzes.map((q,i) => (
                                                <motion.tr key={q.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}>
                                                    <td style={{maxWidth:300}}>
                                                        <div className="adm-cell-primary">{q.title}</div>
                                                        <div className="adm-cell-muted">{q.description}</div>
                                                    </td>
                                                    <td>
                                                        <span className={`adm-badge ${q.questions?.length > 0 ? 'adm-badge-success' : 'adm-badge-warning'}`}>
                                                            {q.questions?.length > 0 ? <ShieldCheck size={12}/> : <X size={12}/>} 
                                                            {q.questions?.length || q.totalQuestions || 0} Questions
                                                        </span>
                                                    </td>
                                                    <td><span className="adm-badge adm-badge-primary"><Clock size={12}/> {q.duration}m</span></td>
                                                    <td><div className="adm-tags-row">{q.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div></td>
                                                    <td><div className="adm-cell-actions"><button onClick={()=>openEdit(q)} className="adm-btn-icon"><Edit2 size={15}/></button><button onClick={()=>handleDelete(q.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button></div></td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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

            {(viewMode==='create' || editingId) && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="adm-card-panel">
                    <div className="adm-form-header-fancy">
                        <div className="header-icon-box"><PlusCircle size={20}/></div>
                        <div>
                            <h3 className="adm-step-title">{editingId ? 'Edit Performance Quiz' : 'Architect New Assessment'}</h3>
                            <p className="adm-step-desc">Configure questions and timing for a professional candidate experience.</p>
                        </div>
                        <div className="adm-form-header-actions">
                             <button type="button" onClick={copyCurrentAsJson} className="adm-btn-icon" title="Copy as JSON"><Copy size={16}/></button>
                        </div>
                    </div>
                    <form onSubmit={handleSave} className="adm-fancy-form">
                        <div className="form-section-grid">
                            <div className="form-section">
                                <h4 className="section-title">Assessment Identity</h4>
                                <div className="adm-field"><label className="adm-label">Quiz Title</label><input required value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} placeholder="e.g. Senior Java Backend Round" className="adm-input"/></div>
                                <div className="adm-field"><label className="adm-label">Short Memo</label><textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} placeholder="What is the goal of this test?" className="adm-input adm-textarea"/></div>
                            </div>
                            <div className="form-section">
                                <h4 className="section-title">Parameters</h4>
                                <div className="adm-field"><label className="adm-label">Duration (Minutes)</label><input type="number" value={formData.duration} onChange={e=>setFormData({...formData,duration:e.target.value})} className="adm-input"/></div>
                                <div className="adm-field">
                                    <label className="adm-label">Tech Tags (Select Multiple)</label>
                                    <div className="adm-tags-selector-box" style={{maxHeight:'160px', overflowY:'auto', display:'flex', flexWrap:'wrap', gap:'6px', padding:'8px', background:'var(--iq-surface-2)', borderRadius:'8px', border:'1px solid var(--iq-border)'}}>
                                        {availableTopics.map(t => (
                                            <button 
                                                key={t} 
                                                type="button" 
                                                onClick={() => toggleTag(t)} 
                                                className={`tag-choice-btn ${formData.tags.includes(t)?'selected':''}`}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    border: '1px solid var(--iq-border)',
                                                    background: formData.tags.includes(t) ? 'var(--iq-primary)' : 'var(--iq-surface)',
                                                    color: formData.tags.includes(t) ? 'white' : 'var(--iq-text-dim)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                {formData.tags.includes(t) && <CheckCircle size={12}/>}
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="label-with-action" style={{marginBottom:'1rem'}}>
                                <h4 className="section-title" style={{margin:0}}>Assessment Questions</h4>
                                <button type="button" onClick={addQuestion} className="adm-btn adm-btn-secondary"><ListPlus size={14}/> Add Question</button>
                            </div>
                            
                            <div className="adm-quiz-builder-stack">
                                {formData.questions.map((q, qIdx) => (
                                    <div key={qIdx} className="adm-question-card-inner" style={{background:'var(--iq-surface)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--iq-border)', marginBottom:'1rem'}}>
                                        <div className="q-card-head" style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                                            <span className="adm-badge adm-badge-neutral">Question # {qIdx + 1}</span>
                                            <button type="button" onClick={()=>removeQuestion(qIdx)} className="btn-remove" style={{background:'none', border:'none', color:'var(--iq-hard)', cursor:'pointer'}}><Trash size={16}/></button>
                                        </div>
                                        <div className="adm-field">
                                            <label className="adm-label">Question Prompt</label>
                                            <textarea required value={q.question} onChange={e=>updateQuestionField(qIdx, 'question', e.target.value)} placeholder="Type the technical question..." className="adm-input adm-textarea-minimal" rows={2}/>
                                        </div>
                                        <div className="options-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginTop:'1rem'}}>
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="option-field-wrap">
                                                    <label className="adm-label" style={{fontSize:'0.7rem'}}>Option {oIdx+1}</label>
                                                    <input required value={opt} onChange={e=>updateOption(qIdx, oIdx, e.target.value)} placeholder={`Option ${oIdx+1}`} className="adm-input input-minimal"/>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="adm-field" style={{marginTop:'1rem'}}>
                                            <label className="adm-label">Correct Answer Key</label>
                                            <select required value={q.correctAnswer} onChange={e=>updateQuestionField(qIdx, 'correctAnswer', e.target.value)} className="adm-input select-minimal" style={{borderColor:'var(--iq-easy)'}}>
                                                <option value="">-- Select Correct Option --</option>
                                                {q.options.map((opt, oIdx) => opt && <option key={oIdx} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="adm-form-footer" style={{marginTop:'2rem', borderTop:'1px solid var(--iq-border)', paddingTop:'1.5rem'}}>
                            <button type="button" onClick={()=>{setViewMode('list'); setEditingId(null);}} className="adm-btn adm-btn-secondary"><X size={15}/> Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-primary"><Save size={15}/> {editingId ? 'Update Assessment' : 'Publish Assessment'}</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {viewMode === 'batch' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="adm-card-panel">
                    <div className="adm-form-header-fancy">
                        <div className="header-icon-box" style={{ background: 'var(--iq-primary-soft)', color: 'var(--iq-primary)' }}><FileCode size={20} /></div>
                        <div>
                            <h3 className="adm-step-title">Batch Assessment Data</h3>
                            <p className="adm-step-desc">Bulk publish quizzes or view existing JSON structure.</p>
                        </div>
                    </div>
                    <div className="batch-import-container" style={{display:'flex', gap:'1.5rem', marginTop:'1.5rem'}}>
                        <div className="json-editor-wrap" style={{flex:1}}>
                            <textarea 
                                value={jsonInput}
                                onChange={e => setJsonInput(e.target.value)}
                                placeholder='[ { "title": "Java Basics", "duration": 20, "questions": [...] }, ... ]'
                                className="adm-input json-textarea"
                                rows={18}
                                style={{fontFamily:'monospace', fontSize:'0.85rem', padding:'1rem'}}
                            />
                        </div>
                        <div className="batch-import-sidebar" style={{width:'300px'}}>
                            <div className="info-box" style={{background:'var(--iq-surface-2)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--iq-border)'}}>
                                <h5 style={{marginBottom:'0.75rem', fontWeight:800}}>JSON Instructions</h5>
                                <p style={{fontSize:'0.85rem', color:'var(--iq-text-dim)', marginBottom:'1rem'}}>Each quiz object needs `title`, `duration`, and a `questions` array. Each question must have `question`, `options` (array of 4), and `correctAnswer` (matching one of the options).</p>
                                <button 
                                    onClick={handleBatchUpload} 
                                    disabled={isLoading || !jsonInput.trim()} 
                                    className="adm-btn adm-btn-primary adm-btn-wide"
                                    style={{ height: '50px', fontSize: '1rem', width:'100%', justifyContent:'center' }}
                                >
                                    {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <UploadCloud size={18} />} 
                                    {isLoading ? ' Processing...' : ' Import JSON'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ManageQuizzes;
