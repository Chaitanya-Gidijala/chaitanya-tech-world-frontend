import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Trash2, Edit2, Save, X, ExternalLink, Video, FileText, Link, RefreshCw } from 'lucide-react';
import { getAllResources, createResource, updateResource, deleteResource, getTopics } from '../../services/prepService';
import { useToast } from '../common/Toast';
import TechBadge from '../prep/TechBadge';
import './AdminLayout.css';

const TYPE_ICON = { VIDEO: <Video size={14} />, PDF: <FileText size={14} />, LINK: <Link size={14} /> };

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
    const [formData, setFormData] = useState({ title:'', description:'', url:'', type:'LINK', tags:[], jobId:null });
    const [editingId, setEditingId] = useState(null);

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

    const filtered = resources.filter(r => r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || r.description?.toLowerCase().includes(searchTerm.toLowerCase()));

    const typeBadge = { VIDEO:'adm-badge-primary', PDF:'adm-badge-danger', LINK:'adm-badge-success' };

    return (
        <div>
            <div className="adm-mode-switcher">
                <button className={`adm-mode-btn ${viewMode==='list'?'active':''}`} onClick={()=>setViewMode('list')}>List</button>
                <button className={`adm-mode-btn ${viewMode==='create'||viewMode==='edit'?'active':''}`} onClick={()=>{setViewMode('create');setEditingId(null);setFormData({title:'',description:'',url:'',type:'LINK',tags:[],jobId:null});}}>+ Add New</button>
            </div>

            {viewMode === 'list' && (
                <div>
                    <div className="adm-toolbar">
                        <div className="adm-toolbar-left">
                            <div className="adm-search-wrap">
                                <Search className="adm-search-icon" size={16}/>
                                <input className="adm-search-input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search resources..."/>
                            </div>
                            <select className="adm-select" value={selectedType} onChange={e=>{setSelectedType(e.target.value);setCurrentPage(0);}}>
                                <option value="All">All Types</option>
                                <option value="VIDEO">Video</option>
                                <option value="PDF">PDF</option>
                                <option value="LINK">Link</option>
                            </select>
                        </div>
                        <div className="adm-toolbar-right">
                            <span className="adm-badge adm-badge-neutral">Showing 0 to {resources.length} of {totalElements} resources</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="adm-loading-center"><RefreshCw className="adm-spinner" size={28}/></div>
                    ) : filtered.length === 0 ? (
                        <div className="adm-empty"><div className="adm-empty-icon">📚</div><h3>No resources found</h3><p>Add your first resource.</p></div>
                    ) : (
                        <>
                            <div className="adm-table-card">
                                <div className="adm-table-scroll">
                                    <table className="adm-table">
                                        <thead><tr><th>ID</th><th>Type</th><th>Title / Description</th><th>URL</th><th>Tags</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {filtered.map((r,i) => (
                                                <motion.tr key={r.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}>
                                                    <td><span className="adm-mono">{r.id}</span></td>
                                                    <td><span className={`adm-badge ${typeBadge[r.type]||'adm-badge-neutral'}`}>{TYPE_ICON[r.type]} {r.type}</span></td>
                                                    <td>
                                                        <div className="adm-cell-primary">{r.title}</div>
                                                        <div className="adm-cell-muted">{String(r.description||'').substring(0,60)}{r.description?.length>60?'…':''}</div>
                                                    </td>
                                                    <td><a href={r.url} target="_blank" rel="noreferrer" className="adm-link"><ExternalLink size={13}/> Link</a></td>
                                                    <td><div className="adm-tags-row">{r.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div></td>
                                                    <td><div className="adm-cell-actions"><button onClick={()=>openEdit(r)} className="adm-btn-icon"><Edit2 size={15}/></button><button onClick={()=>handleDelete(r.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button></div></td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="adm-card-grid">
                                {filtered.map((r,i) => (
                                    <motion.div key={r.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="adm-card">
                                        <div className="adm-card-header">
                                            <div style={{flex:1,minWidth:0}}>
                                                <span className={`adm-badge ${typeBadge[r.type]||'adm-badge-neutral'}`}>{TYPE_ICON[r.type]} {r.type}</span>
                                                <h3 className="adm-card-title" style={{marginTop:'0.5rem'}}>{r.title}</h3>
                                                <p className="adm-card-subtitle">{r.description}</p>
                                            </div>
                                            <div className="adm-card-actions">
                                                <button onClick={()=>openEdit(r)} className="adm-btn-icon"><Edit2 size={15}/></button>
                                                <button onClick={()=>handleDelete(r.id)} className="adm-btn-icon delete"><Trash2 size={15}/></button>
                                            </div>
                                        </div>
                                        <div className="adm-card-divider"/>
                                        <div className="adm-tags-row">{r.tags?.map(t=><span key={t} className="adm-tag">{t}</span>)}</div>
                                        <a href={r.url} target="_blank" rel="noreferrer" className="adm-link" style={{marginTop:'0.5rem',display:'inline-flex',alignItems:'center',gap:'0.3rem'}}><ExternalLink size={13}/> Open Link</a>
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
                        <h3 className="adm-step-title">{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
                    </div>
                    <form onSubmit={handleSave} className="adm-form">
                        <div className="adm-form-grid">
                            <div className="adm-field"><label className="adm-label">Title *</label><input required value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} placeholder="Resource title" className="adm-input"/></div>
                            <div className="adm-field"><label className="adm-label">Type</label><select value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})} className="adm-input"><option value="LINK">Link</option><option value="VIDEO">Video</option><option value="PDF">PDF</option></select></div>
                        </div>
                        <div className="adm-field"><label className="adm-label">URL *</label><input required value={formData.url} onChange={e=>setFormData({...formData,url:e.target.value})} placeholder="https://..." className="adm-input"/></div>
                        <div className="adm-field"><label className="adm-label">Description</label><textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} placeholder="Short description..." className="adm-input adm-textarea"/></div>
                        <div className="adm-field"><label className="adm-label">Tags</label><div className="adm-tags-picker">{topics.map(t=><TechBadge key={t.id} tech={t.name} active={formData.tags.includes(t.name)} onClick={()=>toggleTag(t.name)}/>)}</div></div>
                        <div className="adm-modal-footer" style={{padding:0,border:'none',justifyContent:'flex-end',marginTop:'0.5rem'}}>
                            <button type="button" onClick={()=>setViewMode('list')} className="adm-btn adm-btn-secondary"><X size={15}/> Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-primary"><Save size={15}/> {editingId ? 'Update' : 'Publish'}</button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default ManageResources;
