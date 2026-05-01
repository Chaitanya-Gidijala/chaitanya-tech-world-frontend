import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PlusCircle, Search, Trash2, Edit2, UploadCloud, Save, X, RefreshCw, 
    HelpCircle, FileCode, CheckCircle, ChevronDown, ListPlus, Trash, ArrowRight
} from 'lucide-react';
import { 
    getAllQuestions, createQuestion, updateQuestion, 
    deleteQuestion, createQuestionsBatch, getTopics 
} from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import './AdminLayout.css';

const DIFF_BADGE = { 
    EASY: 'adm-badge-success', 
    INTERMEDIATE: 'adm-badge-warning', 
    MEDIUM: 'adm-badge-warning',
    HARD: 'adm-badge-danger',
    EXPERT: 'adm-badge-danger'
};

const INTERVIEW_TIPS = [
    "Structure your response using the STAR method: Situation, Task, Action, and Result.",
    "Think out loud to show your reasoning process to the interviewer.",
    "If you don't know the answer, explain how you would go about finding it.",
    "Ask clarifying questions before jumping into the solution.",
    "Always mention the time and space complexity (Big O) of your solution.",
    "Explain the trade-offs between your chosen approach and alternatives.",
    "Use real-world examples from your past projects to illustrate your points.",
    "Keep your explanation concise; avoid rambling or over-complicating simple concepts.",
    "Mention how your solution would handle edge cases or massive scale.",
    "Practice whiteboarding your core concepts to improve visual communication."
];

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
    const pageSize = 15;

    // Advanced Form State
    const [formData, setFormData] = useState({ 
        question: '', 
        answer: '', 
        takeaways: ['', '', ''], 
        tip: INTERVIEW_TIPS[0],
        tags: [], 
        difficulty: 'INTERMEDIATE' 
    });
    const [editingId, setEditingId] = useState(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isJsonValid, setIsJsonValid] = useState(true);

    useEffect(() => { loadData(currentPage, selectedTag, selectedDifficulty); }, [refreshTrigger, currentPage, selectedTag, selectedDifficulty]);

    const loadData = async (page = 0, tag = 'All', diff = 'All') => {
        setIsLoading(true);
        try {
            console.log(`🔍 Fetching questions: page=${page}, tag=${tag}, diff=${diff}`);
            const [qData, tData] = await Promise.all([getAllQuestions(page, pageSize, tag, diff), getTopics()]);
            setQuestions(qData.content || []);
            setTotalPages(qData.totalPages || 0);
            setTotalElements(qData.totalElements || 0);
            setTopics(tData);
            console.log(`✅ Loaded ${qData.content?.length} questions.`);
        } catch (err) { 
            console.error('❌ Failed to load questions:', err);
            showToast('Failed to load questions.', 'error'); 
        } finally { 
            setIsLoading(false); 
        }
    };

    // Helper to package/unpackage structured content in the 'answer' field
    const packageAnswer = (data) => {
        const payload = {
            expertAnswer: data.answer || '',
            takeaways: (data.takeaways || []).filter(t => t && t.trim() !== ''),
            tip: data.tip || ''
        };
        return JSON.stringify(payload);
    };

    const unpackageAnswer = (rawAnswer) => {
        if (!rawAnswer) return { answer: '', takeaways: ['', '', ''], tip: INTERVIEW_TIPS[0] };
        try {
            if (typeof rawAnswer === 'string' && rawAnswer.trim().startsWith('{')) {
                const parsed = JSON.parse(rawAnswer);
                return {
                    answer: parsed.expertAnswer || '',
                    takeaways: parsed.takeaways?.length > 0 ? parsed.takeaways : ['', '', ''],
                    tip: parsed.tip || INTERVIEW_TIPS[0]
                };
            }
        } catch (e) {
            console.warn('Failed to parse answer JSON, using raw string.');
        }
        return {
            answer: rawAnswer,
            takeaways: ['', '', ''],
            tip: INTERVIEW_TIPS[0]
        };
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.question || !formData.answer) { showToast('Question and Answer required.', 'error'); return; }
        
        const finalPayload = {
            ...formData,
            answer: packageAnswer(formData)
        };

        try {
            if (editingId) { 
                await updateQuestion(editingId, finalPayload); 
                showToast('Question updated!', 'success'); 
            } else { 
                await createQuestion(finalPayload); 
                showToast('Question created!', 'success'); 
            }
            setViewMode('list'); 
            setEditingId(null); 
            setFormData({ question:'', answer:'', takeaways:['','',''], tip:INTERVIEW_TIPS[0], tags:[], difficulty:'INTERMEDIATE' }); 
            loadData();
        } catch (err) { 
            console.error('❌ Save error:', err);
            showToast('Failed to save.', 'error'); 
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try { 
            await deleteQuestion(id); 
            showToast('Deleted.', 'success'); 
            loadData(); 
        } catch (err) { 
            console.error('❌ Delete error:', err);
            showToast('Delete failed.', 'error'); 
        }
    };

    const openEdit = (q) => {
        const { answer, takeaways, tip } = unpackageAnswer(q.answer);
        setEditingId(q.id);
        setFormData({ 
            question: q.question || '', 
            answer: answer,
            takeaways: takeaways.length > 0 ? takeaways : ['', '', ''],
            tip: tip,
            tags: q.tags || [], 
            difficulty: q.difficulty || 'INTERMEDIATE' 
        });
        setViewMode('edit');
    };

    const handleBatchJsonUpload = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            
            const structuredItems = items.map(item => ({
                question: item.question,
                difficulty: item.difficulty || 'INTERMEDIATE',
                tags: item.tags || [],
                answer: packageAnswer({
                    answer: item.answer || item.expertAnswer || '',
                    takeaways: item.takeaways || item.keyPoints || [],
                    tip: item.tip || item.interviewTip || INTERVIEW_TIPS[0]
                })
            }));

            setIsLoading(true);
            await createQuestionsBatch(structuredItems);
            showToast(`${structuredItems.length} questions imported successfully!`, 'success');
            setJsonInput('');
            setViewMode('list');
            loadData();
        } catch (err) {
            console.error('❌ Batch error:', err);
            showToast('Invalid JSON format. Check console.', 'error');
            setIsJsonValid(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTakeaway = () => setFormData(prev => ({ ...prev, takeaways: [...prev.takeaways, ''] }));
    const removeTakeaway = (idx) => setFormData(prev => ({ ...prev, takeaways: prev.takeaways.filter((_, i) => i !== idx) }));
    
    const toggleTag = (tagName) => {
        setFormData(prev => ({ 
            ...prev, 
            tags: prev.tags.includes(tagName) ? prev.tags.filter(t => t !== tagName) : [...prev.tags, tagName] 
        }));
    };

    const filteredQuestions = searchTerm 
        ? questions.filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
        : questions;

    return (
        <div className="adm-questions-container">
            {/* Mode bar */}
            <div className="adm-mode-switcher">
                <button className={`adm-mode-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>Question List</button>
                <button className={`adm-mode-btn ${viewMode === 'create' || viewMode === 'edit' ? 'active' : ''}`} onClick={() => { setViewMode('create'); setEditingId(null); setFormData({ question: '', answer: '', takeaways: ['', '', ''], tip: INTERVIEW_TIPS[0], tags: [], difficulty: 'INTERMEDIATE' }); }}>+ New Question</button>
                <button className={`adm-mode-btn ${viewMode === 'batch' ? 'active' : ''}`} onClick={() => setViewMode('batch')}>Batch Import</button>
            </div>

            {/* LIST VIEW */}
            {viewMode === 'list' && (
                <div>
                    <div className="adm-toolbar">
                        <div className="adm-toolbar-left">
                            <div className="adm-search-wrap">
                                <Search className="adm-search-icon" size={16} />
                                <input className="adm-search-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filter by question..." />
                            </div>
                            <select className="adm-select" value={selectedTag} onChange={e => { setSelectedTag(e.target.value); setCurrentPage(0); }}>
                                <option value="All">All Topics</option>
                                {topics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                            </select>
                            <select className="adm-select" value={selectedDifficulty} onChange={e => { setSelectedDifficulty(e.target.value); setCurrentPage(0); }}>
                                <option value="All">All Levels</option>
                                <option value="EASY">Easy</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="HARD">Hard</option>
                            </select>
                            <button onClick={() => loadData(currentPage, selectedTag, selectedDifficulty)} className="adm-btn-icon" title="Refresh List"><RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /></button>
                        </div>
                        <div className="adm-toolbar-right">
                            <span className="adm-badge adm-badge-neutral">{totalElements} Total</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="adm-loading-center" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <RefreshCw className="adm-spinner animate-spin" size={32} style={{ color: 'var(--jp-primary)' }} />
                        </div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="adm-empty">
                            <div className="adm-empty-icon"><HelpCircle size={48} /></div>
                            <h3>No questions found</h3>
                            <p>Try clearing filters or add a new question.</p>
                        </div>
                    ) : (
                        <>
                            {/* Table view for Desktop */}
                            <div className="adm-table-card desktop-only">
                                <div className="adm-table-scroll">
                                    <table className="adm-table">
                                        <thead><tr><th>Question Detail</th><th>Level</th><th>Topics</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {filteredQuestions.map((q, i) => (
                                                <motion.tr key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                                                    <td style={{ maxWidth: 360 }}>
                                                        <div className="adm-cell-primary">{q.question}</div>
                                                        <div className="adm-cell-muted">
                                                            {unpackageAnswer(q.answer).answer.substring(0, 80)}...
                                                        </div>
                                                    </td>
                                                    <td><span className={`adm-badge ${DIFF_BADGE[q.difficulty] || 'adm-badge-neutral'}`}>{q.difficulty}</span></td>
                                                    <td>
                                                        <div className="adm-tags-row">
                                                            {q.tags?.length > 0 ? q.tags.map(t => <span key={t} className="adm-tag">{t}</span>) : <span className="adm-tag-muted">None</span>}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="adm-cell-actions">
                                                            <button onClick={() => openEdit(q)} className="adm-btn-icon" title="Edit"><Edit2 size={15} /></button>
                                                            <button onClick={() => handleDelete(q.id)} className="adm-btn-icon delete" title="Delete"><Trash2 size={15} /></button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Card view for Mobile */}
                            <div className="adm-card-grid mobile-only" style={{ display: 'none' }}>
                                {filteredQuestions.map((q, i) => (
                                    <div key={q.id} className="adm-card-simple">
                                        <div className="adm-card-header">
                                            <span className={`adm-badge ${DIFF_BADGE[q.difficulty] || 'adm-badge-neutral'}`}>{q.difficulty}</span>
                                            <div className="adm-card-actions">
                                                <button onClick={() => openEdit(q)} className="adm-btn-icon"><Edit2 size={14} /></button>
                                                <button onClick={() => handleDelete(q.id)} className="adm-btn-icon delete"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        <h4 className="adm-card-q">{q.question}</h4>
                                        <div className="adm-tags-row">
                                            {q.tags?.map(t => <span key={t} className="adm-tag">{t}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="adm-pagination">
                                    <button className="adm-btn adm-btn-secondary" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>Prev</button>
                                    <span className="adm-page-subtitle">Page {currentPage + 1} of {totalPages}</span>
                                    <button className="adm-btn adm-btn-secondary" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}>Next</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* FORM: CREATE / EDIT */}
            {(viewMode === 'create' || viewMode === 'edit') && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="adm-card-panel">
                    <div className="adm-form-header-fancy">
                        <div className="header-icon-box"><PlusCircle size={20} /></div>
                        <div>
                            <h3 className="adm-step-title">{viewMode === 'edit' ? 'Update Technical Question' : 'Architect New Question'}</h3>
                            <p className="adm-step-desc">Enter technical details to help users master their next interview.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="adm-fancy-form">
                        <div className="form-section">
                            <h4 className="section-title">Core Content</h4>
                            <div className="adm-field">
                                <label className="adm-label">The Question</label>
                                <textarea required rows={2} value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} placeholder="Enter question..." className="adm-input adm-textarea" />
                            </div>
                            <div className="adm-field">
                                <label className="adm-label">Expert Answer / Explanation</label>
                                <textarea required rows={5} value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} placeholder="Provide explanation..." className="adm-input adm-textarea" />
                            </div>
                        </div>

                        <div className="form-section-grid">
                            <div className="form-section">
                                <h4 className="section-title">Classification</h4>
                                <div className="adm-field">
                                    <label className="adm-label">Difficulty Level</label>
                                    <div className="custom-select-wrap">
                                        <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} className="adm-input">
                                            <option value="EASY">Easy</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="HARD">Hard</option>
                                        </select>
                                        <ChevronDown className="select-icon" size={16} />
                                    </div>
                                </div>
                                <div className="adm-field">
                                    <label className="adm-label">Topics</label>
                                    <div className="adm-tags-selector-box">
                                        {topics.length === 0 ? <p className="adm-cell-muted">Loading topics...</p> : topics.map(t => (
                                            <button 
                                                key={t.id} 
                                                type="button"
                                                onClick={() => toggleTag(t.name)}
                                                className={`tag-choice-btn ${formData.tags.includes(t.name) ? 'selected' : ''}`}
                                            >
                                                {formData.tags.includes(t.name) && <CheckCircle size={12} />}
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="section-title">Interview Polish</h4>
                                <div className="adm-field">
                                    <label className="adm-label">Expert Interview Tip</label>
                                    <div className="custom-select-wrap">
                                        <select value={formData.tip} onChange={e => setFormData({ ...formData, tip: e.target.value })} className="adm-input">
                                            {INTERVIEW_TIPS.map((tip, i) => (
                                                <option key={i} value={tip}>{tip.substring(0, 60)}...</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="select-icon" size={16} />
                                    </div>
                                </div>

                                <div className="adm-field">
                                    <div className="label-with-action">
                                        <label className="adm-label">Key Takeaways (Bullets)</label>
                                        <button type="button" onClick={handleAddTakeaway} className="btn-tiny"><ListPlus size={12}/> Add</button>
                                    </div>
                                    <div className="takeaways-list">
                                        {formData.takeaways.map((pt, i) => (
                                            <div key={i} className="takeaway-input-wrap">
                                                <span className="dot">•</span>
                                                <input 
                                                    value={pt} 
                                                    onChange={e => {
                                                        const newT = [...formData.takeaways];
                                                        newT[i] = e.target.value;
                                                        setFormData({ ...formData, takeaways: newT });
                                                    }}
                                                    placeholder="Add a key point..."
                                                    className="adm-input input-minimal"
                                                />
                                                <button type="button" onClick={() => removeTakeaway(i)} className="btn-remove"><Trash size={12}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="adm-form-footer">
                            <button type="button" onClick={() => setViewMode('list')} className="adm-btn adm-btn-secondary"><X size={15} /> Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-primary"><Save size={15} /> {viewMode === 'edit' ? 'Update' : 'Publish'}</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* BATCH IMPORT */}
            {viewMode === 'batch' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="adm-card-panel">
                    <div className="adm-form-header-fancy">
                        <div className="header-icon-box" style={{ background: 'var(--iq-primary-soft)', color: 'var(--iq-primary)' }}><FileCode size={20} /></div>
                        <div>
                            <h3 className="adm-step-title">Batch Import</h3>
                            <p className="adm-step-desc">Paste JSON data here to rapidly add multiple questions.</p>
                        </div>
                    </div>

                    <div className="batch-import-container">
                        <div className="json-editor-wrap">
                            <textarea 
                                value={jsonInput}
                                onChange={e => { setJsonInput(e.target.value); setIsJsonValid(true); }}
                                placeholder='Paste your JSON array here...'
                                className={`adm-input json-textarea ${!isJsonValid ? 'error' : ''}`}
                                rows={15}
                            />
                        </div>

                        <div className="batch-import-sidebar">
                            <div className="info-box">
                                <h5>Success Instructions</h5>
                                <p>Once you paste, click "Import" to save. The list will refresh automatically.</p>
                                <button 
                                    onClick={handleBatchJsonUpload} 
                                    disabled={isLoading || !jsonInput.trim()} 
                                    className="adm-btn adm-btn-primary adm-btn-wide"
                                    style={{ height: '50px', fontSize: '1rem', marginTop: '1rem' }}
                                >
                                    {isLoading ? <RefreshCw className="animate-spin" /> : <UploadCloud size={18} />} 
                                    {isLoading ? ' Importing...' : ' Start Import'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ManageQuestions;
