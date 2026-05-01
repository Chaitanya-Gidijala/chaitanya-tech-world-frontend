import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    PlusCircle, Search, Trash2, Edit2, Save, X, ExternalLink, 
    Video, FileText, Link, RefreshCw, UploadCloud, FileCode 
} from 'lucide-react';
import { 
    getAllResources, createResource, updateResource, 
    deleteResource, createResourcesBatch, getTopics 
} from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import TechBadge from '../prep/TechBadge';
import './AdminLayout.css';

const TYPE_ICON = { 
    VIDEO: <Video size={14} />, 
    PDF: <FileText size={14} />, 
    LINK: <Link size={14} /> 
};

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
    const pageSize = 15;

    const [formData, setFormData] = useState({ title:'', description:'', url:'', type:'LINK', tags:[], jobId:null });
    const [editingId, setEditingId] = useState(null);
    const [jsonInput, setJsonInput] = useState('');

    useEffect(() => { loadData(currentPage, selectedType); }, [refreshTrigger, currentPage, selectedType]);

    const loadData = async (page=0, type='All') => {
        setIsLoading(true);
        try {
            const [rData, tData] = await Promise.all([getAllResources(page, pageSize, 'All', type), getTopics()]);
            setResources(rData.content || []);
            setTotalPages(rData.totalPages || 0);
            setTotalElements(rData.totalElements || 0);
            setTopics(tData);
        } catch { showToast('Failed to load resources.', 'error'); }
        finally { setIsLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.url) { showToast('Title and URL required.', 'error'); return; }
        try {
            if (editingId) { await updateResource(editingId, formData); showToast('Resource updated!', 'success'); }
            else { await createResource(formData); showToast('Resource created!', 'success'); }
            setViewMode('list'); setEditingId(null); setFormData({title:'',description:'',url:'',type:'LINK',tags:[],jobId:null}); loadData();
        } catch { showToast('Failed to save.', 'error'); }
    };

    const handleBatchUpload = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            setIsLoading(true);
            await createResourcesBatch(items);
            showToast(`${items.length} resources imported!`, 'success');
            setJsonInput('');
            setViewMode('list');
            loadData();
        } catch (err) {
            showToast('Invalid JSON format.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try { await deleteResource(id); showToast('Deleted.', 'success'); loadData(); }
        catch { showToast('Delete failed.', 'error'); }
    };

    const openEdit = (r) => {
        setEditingId(r.id);
        setFormData({ title:r.title||'', description:r.description||'', url:r.url||'', type:r.type||'LINK', tags:r.tags||[], jobId:r.jobId||null });
        setViewMode('create');
    };

    const toggleTag = (n) => setFormData(p => ({ ...p, tags: p.tags.includes(n) ? p.tags.filter(t=>t!==n) : [...p.tags, n] }));

    const filtered = resources.filter(r => 
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const typeBadge = { VIDEO:'adm-badge-primary', PDF:'adm-badge-danger', LINK:'adm-badge-success' };

    return (
        <div className="adm-questions-container">
            <div className="adm-mode-switcher">
                <button className={`adm-mode-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')}>Resource Library</button>
                <button className={`adm-mode-btn ${viewMode==='create'||viewMode==='edit'?'active':''}`} onClick={()=>{setViewMode('create');setEditingId(null);setFormData({title:'',description:'',url:'',type:'LINK',tags:[],jobId:null});}}>+ Add New</button>
                <button className={`adm-mode-btn ${viewMode==='batch'?'active':''}`} onClick={()=>setViewMode('batch')}>Batch Import</button>
            </div>

            {viewMode === 'list' && (
                <div>
                    <div className="adm-toolbar">
                        <div className="adm-toolbar-left">
                            <div className="adm-search-wrap">
                                <Search className="adm-search-icon" size={16}/>
                                <input className="adm-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search library..."/>
                            </div>
                            <select className="adm-select" value={selectedType} onChange={e=>{setSelectedType(e.target.value);setCurrentPage(0);}}>
                                <option value="All">All Types</option>
                                <option value="VIDEO">Videos</option>
                                <option value="PDF">PDFs</option>
                                <option value="LINK">Articles/Links</option>
                            </select>
                            <button onClick={() => loadData(currentPage, selectedType)} className="adm-btn-icon"><RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /></button>
                        </div>
                        <div className="adm-toolbar-right">
                            <span className="adm-badge adm-badge-neutral">{totalElements} Total Resources</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="adm-loading-center"><RefreshCw className="adm-spinner animate-spin" size={32}/></div>
                    ) : filtered.length === 0 ? (
                        <div className="adm-empty">
                            <div className="adm-empty-icon">📚</div>
                            <h3>Library is empty</h3>
                            <p>Start adding PDFs, videos, and documentation links.</p>
                        </div>
                    ) : (
                        <>
                            <div className="adm-table-card">
                                <div className="adm-table-scroll">
                                    <table className="adm-table">
                                        <thead><tr><th>Type</th><th>Title / Info</th><th>Link</th><th>Topics</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {filtered.map((r,i) => (
                                                <motion.tr key={r.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}>
                                                    <td><span className={`adm-badge ${typeBadge[r.type]||'adm-badge-neutral'}`}>{TYPE_ICON[r.type]} {r.type}</span></td>
                                                    <td>
                                                        <div className="adm-cell-primary">{r.title}</div>
                                                        <div className="adm-cell-muted">{r.description}</div>
                                                    </td>
                                                    <td><a href={r.url} target="_blank" rel="noreferrer" className="adm-link"><ExternalLink size={13}/> Open</a></td>
                                                    <td><div className="adm-tags-row">{r.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div></td>
                                                    <td><div className="adm-cell-actions"><button onClick={()=>openEdit(r)} className="adm-btn-icon"><Edit2 size={15}/></button><button onClick={()=>handleDelete(r.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button></div></td>
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

            {(viewMode==='create'||viewMode==='edit') && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="adm-card-panel">
                    <div className="adm-form-header-fancy">
                        <div className="header-icon-box"><PlusCircle size={20}/></div>
                        <div>
                            <h3 className="adm-step-title">{editingId ? 'Modify Resource' : 'Curate New Resource'}</h3>
                            <p className="adm-step-desc">Add educational material to help candidates prepare for their technical rounds.</p>
                        </div>
                    </div>
                    <form onSubmit={handleSave} className="adm-fancy-form">
                        <div className="form-section-grid">
                            <div className="form-section">
                                <h4 className="section-title">Essential Info</h4>
                                <div className="adm-field"><label className="adm-label">Resource Title</label><input required value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} placeholder="e.g. Advanced Java Concurrency PDF" className="adm-input"/></div>
                                <div className="adm-field"><label className="adm-label">Direct URL</label><input required value={formData.url} onChange={e=>setFormData({...formData,url:e.target.value})} placeholder="https://..." className="adm-input"/></div>
                            </div>
                            <div className="form-section">
                                <h4 className="section-title">Categorization</h4>
                                <div className="adm-field"><label className="adm-label">Media Type</label><select value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})} className="adm-input"><option value="LINK">Article / Web Link</option><option value="VIDEO">Video Tutorial</option><option value="PDF">PDF / Document</option></select></div>
                                <div className="adm-field"><label className="adm-label">Associated Topics</label><div className="adm-tags-selector-box" style={{maxHeight:'140px'}}>{topics.map(t=><button key={t.id} type="button" onClick={()=>toggleTag(t.name)} className={`tag-choice-btn ${formData.tags.includes(t.name)?'selected':''}`}>{t.name}</button>)}</div></div>
                            </div>
                        </div>
                        <div className="adm-field"><label className="adm-label">Brief Description</label><textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} placeholder="What will the candidate learn from this resource?" className="adm-input adm-textarea"/></div>
                        <div className="adm-form-footer">
                            <button type="button" onClick={()=>setViewMode('list')} className="adm-btn adm-btn-secondary"><X size={15}/> Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-primary"><Save size={15}/> {editingId ? 'Update Resource' : 'Publish Resource'}</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {viewMode === 'batch' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="adm-card-panel">
                    <div className="adm-form-header-fancy">
                        <div className="header-icon-box" style={{ background: 'var(--iq-primary-soft)', color: 'var(--iq-primary)' }}><FileCode size={20} /></div>
                        <div>
                            <h3 className="adm-step-title">Batch Resource Import</h3>
                            <p className="adm-step-desc">Bulk upload multiple learning resources via JSON.</p>
                        </div>
                    </div>

                    <div className="batch-import-container">
                        <div className="json-editor-wrap">
                            <textarea 
                                value={jsonInput}
                                onChange={e => setJsonInput(e.target.value)}
                                placeholder='[ { "title": "...", "url": "...", "type": "PDF", "tags": ["Java"] }, ... ]'
                                className="adm-input json-textarea"
                                rows={15}
                            />
                        </div>
                        <div className="batch-import-sidebar">
                            <div className="info-box">
                                <h5>Format Rules</h5>
                                <p>Ensure `type` is one of: VIDEO, PDF, LINK.</p>
                                <button 
                                    onClick={handleBatchUpload} 
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

export default ManageResources;
