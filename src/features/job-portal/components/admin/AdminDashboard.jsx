import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircle, Layers, Send, XCircle, RefreshCw,
    Users, Eye, Globe, X, Menu, Moon, Sun, LogOut,
    ChevronRight, Home, FileText, HelpCircle, Hash, Book, ClipboardCheck, MessageSquare, Briefcase, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { postJob, postBatchJobs, getAllJobs, updateJob, deleteJob } from '../../services/jobService';
import { getVisitorStats } from '../../services/analyticsService';
import { logout, getUserCount } from '../../services/authService';
import { getAllInquiries } from '../../services/contactService';
import { getAllQuestions, getTopics, getAllResources, getAllQuizzes } from '../../services/prepService';
import { useToast } from '@/components/ui/Toast';
import RichTextEditor from './RichTextEditor';
import AdminSidebar from './AdminSidebar';
import DeleteConfirmModal from './DeleteConfirmModal';
import ManageJobs from './ManageJobs';
import ManageQuestions from './ManageQuestions';
import ManageTopics from './ManageTopics';
import ManageResources from './ManageResources';
import ManageQuizzes from './ManageQuizzes';
import AdminSettings from './AdminSettings';
import ManageInquiries from './ManageInquiries';
import './AdminLayout.css';

const tabTitles = {
    overview: 'Dashboard Overview',
    create: 'Post a Job',
    manage: 'Manage Jobs',
    questions: 'Questions',
    topics: 'Topics',
    resources: 'Resources',
    quizzes: 'Quizzes',
    analytics: 'Analytics',
    inquiries: 'Inquiries',
    settings: 'Settings',
};

const FORM_DEFAULTS = {
    jobTitle: '', company: '', location: '', jobDetails: '',
    experienceRequired: '', experience: 'Fresher',
    applyLink: '', salary: 'Negotiable', companyLogo: '', jobType: 'Full-time'
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [uploadMode, setUploadMode] = useState('single');
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, browserStats: {} });
    const [batchJson, setBatchJson] = useState('');
    const [jobs, setJobs] = useState([]);
    const [editingJobId, setEditingJobId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [batchJobs, setBatchJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [overviewStats, setOverviewStats] = useState({
        users: 0, jobs: 0, questions: 0, topics: 0, resources: 0, quizzes: 0, inquiries: 0
    });
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [jobData, setJobData] = useState(FORM_DEFAULTS);
    const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) setSidebarOpen(true);
            else if (window.innerWidth <= 768) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { loadJobs(); }, []);

    useEffect(() => {
        if (activeTab === 'analytics') getVisitorStats().then(setStats).catch(console.error);
        if (activeTab === 'overview') loadOverviewStats();
    }, [activeTab, refreshTrigger]);

    const loadOverviewStats = async () => {
        setIsLoading(true);
        try {
            const [uCount, jList, qPage, tList, rPage, quizPage, iList] = await Promise.all([
                getUserCount(),
                getAllJobs(),
                getAllQuestions(0, 1),
                getTopics(),
                getAllResources(0, 1),
                getAllQuizzes(0, 1),
                getAllInquiries()
            ]);

            setOverviewStats({
                users: uCount || 0,
                jobs: jList.length || 0,
                questions: qPage.totalElements || 0,
                topics: tList.length || 0,
                resources: rPage.totalElements || 0,
                quizzes: quizPage.totalElements || 0,
                inquiries: iList.length || 0
            });
        } catch (err) {
            console.error('Failed to load overview stats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDark ? 'dark' : 'light';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('jp-theme', newTheme);
    };

    const loadJobs = async () => {
        try { const j = await getAllJobs(); setJobs(j); } catch (err) { console.error(err); }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (job) => {
        setEditingJobId(job.id);
        setJobData({
            jobTitle: job.jobTitle || '', company: job.company || '',
            location: job.location || '', jobDetails: job.jobDetails || '',
            experienceRequired: job.experienceRequired || '', experience: job.experience || 'Fresher',
            applyLink: job.applyLink || '', salary: job.salary || 'Negotiable',
            companyLogo: job.companyLogo || '', jobType: job.jobType || 'Full-time'
        });
        setActiveTab('create');
        setUploadMode('single');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => { setEditingJobId(null); setJobData(FORM_DEFAULTS); };

    const handleDeleteClick = (job) => { setJobToDelete(job); setShowDeleteModal(true); };

    const handleDeleteConfirm = async () => {
        if (!jobToDelete) return;
        setIsDeleting(true);
        try {
            await deleteJob(jobToDelete.id);
            showToast(`"${jobToDelete.jobTitle}" deleted!`, 'success');
            setShowDeleteModal(false);
            setJobToDelete(null);
            if (editingJobId === jobToDelete.id) handleCancelEdit();
            await loadJobs();
        } catch { showToast('Delete failed.', 'error'); }
        finally { setIsDeleting(false); }
    };

    const handleSubmitSingle = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = { ...jobData, postedAt: new Date().toISOString() };
            if (editingJobId) {
                await updateJob(editingJobId, payload);
                showToast('Job updated!', 'success');
                setEditingJobId(null);
            } else {
                await postJob(payload);
                showToast('Job posted!', 'success');
            }
            setJobData(FORM_DEFAULTS);
            await loadJobs();
        } catch { showToast('Action failed.', 'error'); }
        finally { setIsLoading(false); }
    };

    const handleAddToBatch = () => {
        if (!jobData.jobTitle || !jobData.company || !jobData.applyLink) {
            showToast('Fill Title, Company & Apply Link.', 'warning');
            return;
        }
        setBatchJobs(prev => [{ ...jobData, id: Date.now() }, ...prev]);
        setJobData(FORM_DEFAULTS);
        showToast('Added to batch!', 'info');
    };

    const handleRemoveFromBatch = (id) => setBatchJobs(prev => prev.filter(j => j.id !== id));

    const handleSubmitBatch = async () => {
        let jobsToPublish = [];
        try {
            if (batchJson.trim()) {
                const parsed = JSON.parse(batchJson);
                if (!Array.isArray(parsed)) throw new Error('Expected JSON array');
                jobsToPublish = parsed;
            } else if (batchJobs.length > 0) {
                const now = new Date().toISOString();
                jobsToPublish = batchJobs.map(({ id, ...rest }) => ({ ...rest, postedAt: now }));
            } else {
                showToast('No jobs to publish.', 'warning');
                return;
            }
            setIsLoading(true);
            await postBatchJobs(jobsToPublish);
            showToast(`${jobsToPublish.length} jobs published!`, 'success');
            setBatchJobs([]);
            setBatchJson('');
            await loadJobs();
        } catch (err) {
            showToast(err.message === 'Expected JSON array' ? 'JSON must be an array.' : 'Publishing failed.', 'error');
        } finally { setIsLoading(false); }
    };

    const handleRefresh = async () => {
        if (activeTab === 'manage' || activeTab === 'create') await loadJobs();
        else setRefreshTrigger(p => p + 1);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const title = editingJobId ? 'Edit Job' : tabTitles[activeTab] || 'Dashboard';

    return (
        <div className="adm-root">
            {/* â”€â”€ TOP NAV BAR â”€â”€ */}
            <header className="adm-topbar">
                <div className="adm-topbar-left">
                    <button
                        className="adm-topbar-toggle"
                        onClick={() => setSidebarOpen(p => !p)}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <a href="/" className="adm-topbar-brand">
                        <img src="/CTW.svg" alt="CTW" className="adm-topbar-logo" />
                        <span className="adm-topbar-brand-name">Chaitanya Tech World</span>
                    </a>
                </div>
                <div className="adm-topbar-right">
                    <button className="adm-topbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="adm-topbar-icon-btn" onClick={handleRefresh} title="Refresh">
                        <RefreshCw size={18} className={isLoading ? 'adm-spinner' : ''} />
                    </button>
                    <button className="adm-topbar-logout" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            {/* â”€â”€ BODY: sidebar + content â”€â”€ */}
            <div className="adm-body">
                {/* SIDEBAR */}
                <AdminSidebar
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        setActiveTab(tab);
                        if (window.innerWidth <= 768) setSidebarOpen(false);
                    }}
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(p => !p)}
                />

                {/* Mobile backdrop */}
                {sidebarOpen && window.innerWidth <= 768 && (
                    <div className="adm-backdrop visible" onClick={() => setSidebarOpen(false)} />
                )}

                {/* MAIN CONTENT */}
                <main className={`adm-content ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                    <DeleteConfirmModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteConfirm}
                        jobTitle={jobToDelete?.jobTitle || ''}
                        isDeleting={isDeleting}
                    />

                    {/* Page header */}
                    <div className="adm-page-header">
                        <div>
                            <h1 className="adm-page-title">{title}</h1>
                            <p className="adm-page-subtitle">
                                {editingJobId ? 'Modify job details below' : 'Manage your portal content efficiently'}
                            </p>
                        </div>
                        <div className="adm-page-actions">
                            {editingJobId && (
                                <button className="adm-btn adm-btn-secondary" onClick={handleCancelEdit}>
                                    <X size={15} /> Cancel Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + (editingJobId || '')}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.16 }}
                        >
                            {/* ── OVERVIEW ── */}
                            {activeTab === 'overview' && (
                                <div className="adm-overview">
                                    <div className="adm-stats-grid">
                                        {[
                                            { id: 'users', label: 'Total Users', val: overviewStats.users, icon: Users, color: '#6366f1', link: 'settings' },
                                            { id: 'jobs', label: 'Active Jobs', val: overviewStats.jobs, icon: Briefcase, color: '#ec4899', link: 'manage' },
                                            { id: 'questions', label: 'Questions', val: overviewStats.questions, icon: HelpCircle, color: '#3b82f6', link: 'questions' },
                                            { id: 'topics', label: 'Topics', val: overviewStats.topics, icon: Hash, color: '#10b981', link: 'topics' },
                                            { id: 'resources', label: 'Resources', val: overviewStats.resources, icon: Book, color: '#f59e0b', link: 'resources' },
                                            { id: 'quizzes', label: 'Quizzes', val: overviewStats.quizzes, icon: ClipboardCheck, color: '#8b5cf6', link: 'quizzes' },
                                            { id: 'inquiries', label: 'Enquiries', val: overviewStats.inquiries, icon: MessageSquare, color: '#06b6d4', link: 'inquiries' }
                                        ].map(stat => (
                                            <div 
                                                key={stat.id} 
                                                className="adm-stat-card clickable" 
                                                onClick={() => setActiveTab(stat.link)}
                                            >
                                                <div 
                                                    className="adm-stat-icon" 
                                                    style={{ background: `${stat.color}15`, color: stat.color }}
                                                >
                                                    <stat.icon size={24} />
                                                </div>
                                                <div className="adm-stat-info">
                                                    <h4 className="adm-stat-value">{isLoading ? '...' : stat.val}</h4>
                                                    <p className="adm-stat-label">{stat.label}</p>
                                                </div>
                                                <div className="adm-stat-arrow">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="adm-quick-links-panel adm-card-panel" style={{ marginTop: '2.5rem' }}>
                                        <h3 className="adm-step-title" style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
                                        <div className="adm-quick-actions-grid">
                                            <button className="adm-btn adm-btn-primary" onClick={() => setActiveTab('create')}>
                                                <PlusCircle size={16} /> Post New Job
                                            </button>
                                            <button className="adm-btn adm-btn-secondary" onClick={() => setActiveTab('manage')}>
                                                <Layers size={16} /> Manage All Jobs
                                            </button>
                                            <button className="adm-btn adm-btn-dashed" onClick={() => setActiveTab('analytics')}>
                                                <BarChart3 size={16} /> View Traffic Analytics
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── CREATE / EDIT JOB ── */}
                            {activeTab === 'create' && (
                                <div>
                                    <div className="adm-mode-switcher">
                                        <button className={`adm-mode-btn ${uploadMode === 'single' ? 'active' : ''}`} onClick={() => setUploadMode('single')}>
                                            <PlusCircle size={16} /> Single Upload
                                        </button>
                                        <button className={`adm-mode-btn ${uploadMode === 'batch' ? 'active' : ''}`} onClick={() => setUploadMode('batch')}>
                                            <Layers size={16} /> Batch Builder
                                        </button>
                                    </div>

                                    {uploadMode === 'single' ? (
                                        <form className="adm-card-panel adm-form" onSubmit={handleSubmitSingle}>
                                            <div className="adm-form-grid">
                                                <div className="adm-field"><label className="adm-label">Job Title *</label><input name="jobTitle" value={jobData.jobTitle} onChange={handleFormChange} required placeholder="e.g. Senior Developer" className="adm-input" /></div>
                                                <div className="adm-field"><label className="adm-label">Company Name *</label><input name="company" value={jobData.company} onChange={handleFormChange} required placeholder="e.g. Tech Corp" className="adm-input" /></div>
                                                <div className="adm-field"><label className="adm-label">Company Logo URL</label><input name="companyLogo" value={jobData.companyLogo} onChange={handleFormChange} placeholder="https://logo.png" className="adm-input" /></div>
                                                <div className="adm-field"><label className="adm-label">Location *</label><input name="location" value={jobData.location} onChange={handleFormChange} required placeholder="e.g. Remote / Hyderabad" className="adm-input" /></div>
                                                <div className="adm-field"><label className="adm-label">Salary</label><input name="salary" value={jobData.salary} onChange={handleFormChange} placeholder="e.g. â‚¹5L â€“ â‚¹8L" className="adm-input" /></div>
                                                <div className="adm-field"><label className="adm-label">Job Type</label><select name="jobType" value={jobData.jobType} onChange={handleFormChange} className="adm-input"><option value="Full-time">Full Time</option><option value="Part-time">Part Time</option><option value="Contract">Contract</option><option value="Remote">Remote</option></select></div>
                                                <div className="adm-field"><label className="adm-label">Experience Required</label><input name="experienceRequired" value={jobData.experienceRequired} onChange={handleFormChange} placeholder="e.g. 2â€“4 years" className="adm-input" /></div>
                                                <div className="adm-field"><label className="adm-label">Apply Link *</label><input name="applyLink" value={jobData.applyLink} onChange={handleFormChange} required placeholder="https://..." className="adm-input" /></div>
                                            </div>
                                            <div className="adm-field">
                                                <label className="adm-label">Job Details / Description</label>
                                                <RichTextEditor value={jobData.jobDetails} onChange={(c) => setJobData(p => ({ ...p, jobDetails: c }))} />
                                            </div>
                                            <div className="adm-form-footer">
                                                <button type="submit" disabled={isLoading} className="adm-btn adm-btn-primary adm-btn-wide">
                                                    {isLoading ? <><RefreshCw size={16} className="adm-spinner" /> Savingâ€¦</> : <><Send size={16} /> {editingJobId ? 'Update Job' : 'Publish Job'}</>}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="adm-batch-outer">
                                            {/* Step 1 */}
                                            <div className="adm-card-panel adm-form">
                                                <div className="adm-form-step-header">
                                                    <span className="adm-step-badge">1</span>
                                                    <h3 className="adm-step-title">Define a Job for the Batch</h3>
                                                </div>
                                                <div className="adm-form-grid">
                                                    <div className="adm-field"><label className="adm-label">Job Title</label><input name="jobTitle" value={jobData.jobTitle} onChange={handleFormChange} placeholder="e.g. Senior Developer" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Company</label><input name="company" value={jobData.company} onChange={handleFormChange} placeholder="e.g. Tech Corp" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Location</label><input name="location" value={jobData.location} onChange={handleFormChange} placeholder="e.g. Remote" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Salary</label><input name="salary" value={jobData.salary} onChange={handleFormChange} placeholder="e.g. â‚¹5L â€“ â‚¹8L" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Job Type</label><select name="jobType" value={jobData.jobType} onChange={handleFormChange} className="adm-input"><option value="Full-time">Full Time</option><option value="Part-time">Part Time</option><option value="Contract">Contract</option><option value="Remote">Remote</option></select></div>
                                                    <div className="adm-field"><label className="adm-label">Apply Link</label><input name="applyLink" value={jobData.applyLink} onChange={handleFormChange} placeholder="https://..." className="adm-input" /></div>
                                                </div>
                                                <div className="adm-field">
                                                    <label className="adm-label">Job Details</label>
                                                    <RichTextEditor value={jobData.jobDetails} onChange={(c) => setJobData(p => ({ ...p, jobDetails: c }))} />
                                                </div>
                                                <button type="button" onClick={handleAddToBatch} className="adm-btn adm-btn-dashed adm-btn-wide">
                                                    <PlusCircle size={16} /> Add to Batch List
                                                </button>
                                            </div>

                                            {/* Step 2 review */}
                                            {batchJobs.length > 0 && (
                                                <div className="adm-card-panel">
                                                    <div className="adm-batch-review-header">
                                                        <div className="adm-form-step-header" style={{ border: 'none', padding: 0, marginBottom: 0 }}>
                                                            <span className="adm-step-badge">2</span>
                                                            <h3 className="adm-step-title">Review Batch ({batchJobs.length})</h3>
                                                        </div>
                                                        <button onClick={handleSubmitBatch} disabled={isLoading} className="adm-btn adm-btn-primary">
                                                            {isLoading ? <RefreshCw size={15} className="adm-spinner" /> : <Send size={15} />} Publish All
                                                        </button>
                                                    </div>
                                                    <div className="adm-batch-list">
                                                        {batchJobs.map(job => (
                                                            <div key={job.id} className="adm-batch-item">
                                                                <div className="adm-batch-item-info">
                                                                    <div className="adm-company-logo">{job.companyLogo ? <img src={job.companyLogo} alt="" /> : 'ðŸ¢'}</div>
                                                                    <div>
                                                                        <p className="adm-batch-item-title">{job.jobTitle}</p>
                                                                        <p className="adm-batch-item-meta">{job.company} Â· {job.location}</p>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => handleRemoveFromBatch(job.id)} className="adm-btn-icon delete"><XCircle size={15} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 3 JSON */}
                                            <div className="adm-card-panel adm-form">
                                                <div className="adm-form-step-header">
                                                    <span className="adm-step-badge">3</span>
                                                    <h3 className="adm-step-title">Paste JSON Array</h3>
                                                </div>
                                                <div className="adm-field">
                                                    <label className="adm-label">JSON Array</label>
                                                    <textarea value={batchJson} onChange={(e) => setBatchJson(e.target.value)} placeholder='[{"jobTitle": "Developer", ...}]' className="adm-input adm-textarea adm-json-textarea" />
                                                </div>
                                                <button onClick={handleSubmitBatch} disabled={isLoading} className="adm-btn adm-btn-primary adm-btn-wide">
                                                    {isLoading ? <><RefreshCw size={16} className="adm-spinner" /> Publishingâ€¦</> : <><Send size={16} /> Publish from JSON</>}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'manage' && <ManageJobs jobs={jobs} onEdit={handleEdit} onDelete={handleDeleteClick} editingJobId={editingJobId} />}

                            {/* â”€â”€ ANALYTICS â”€â”€ */}
                            {activeTab === 'analytics' && (
                                <div className="adm-analytics-section">
                                    <div className="adm-stats-grid">
                                        <div className="adm-stat-card accent">
                                            <div className="adm-stat-icon"><Eye size={22} /></div>
                                            <div className="adm-stat-info">
                                                <h4 className="adm-stat-value">{stats.totalViews}</h4>
                                                <p className="adm-stat-label">Total Views</p>
                                            </div>
                                        </div>
                                        <div className="adm-stat-card">
                                            <div className="adm-stat-icon" style={{ background: 'rgba(236,72,153,0.1)', color: 'var(--jp-secondary)' }}>
                                                <Users size={22} />
                                            </div>
                                            <div className="adm-stat-info">
                                                <h4 className="adm-stat-value">{stats.uniqueVisitors}</h4>
                                                <p className="adm-stat-label">Unique Visitors</p>
                                            </div>
                                        </div>
                                        <div className="adm-stat-card">
                                            <div className="adm-stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                                <Globe size={22} />
                                            </div>
                                            <div className="adm-stat-info">
                                                <h4 className="adm-stat-value">Global</h4>
                                                <p className="adm-stat-label">Traffic Reach</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="adm-analytics-grid">
                                        <div className="adm-analytics-card">
                                            <div className="adm-analytics-header">
                                                <div className="adm-analytics-icon"><Globe size={18} /></div>
                                                <div><h3 className="adm-analytics-title">Browser Distribution</h3><p className="adm-analytics-subtitle">Hits by browser</p></div>
                                            </div>
                                            <div className="adm-progress-row">
                                                {Object.entries(stats.browserStats || {}).length > 0
                                                    ? Object.entries(stats.browserStats).sort((a, b) => b[1] - a[1]).map(([browser, count]) => {
                                                        const pct = Math.round((count / stats.totalViews) * 100) || 0;
                                                        return (
                                                            <div key={browser} className="adm-progress-item">
                                                                <div className="adm-progress-meta"><span className="adm-progress-name">{browser}</span><span className="adm-progress-pct">{count} ({pct}%)</span></div>
                                                                <div className="adm-progress-bg"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="adm-progress-fill" /></div>
                                                            </div>
                                                        );
                                                    })
                                                    : <p className="adm-page-subtitle">No browser data yet.</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="adm-analytics-card">
                                            <div className="adm-analytics-header">
                                                <div className="adm-analytics-icon"><Users size={18} /></div>
                                                <div><h3 className="adm-analytics-title">Platform Breakdown</h3><p className="adm-analytics-subtitle">Desktop vs Mobile</p></div>
                                            </div>
                                            <div className="adm-platform-list">
                                                <div className="adm-platform-item"><span className="adm-progress-name">Desktop Users</span><span className="adm-badge adm-badge-success">Most Active</span></div>
                                                <div className="adm-platform-item"><span className="adm-progress-name">Mobile Users</span><span className="adm-badge adm-badge-primary">Trending</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'questions' && <ManageQuestions refreshTrigger={refreshTrigger} />}
                            {activeTab === 'topics' && <ManageTopics refreshTrigger={refreshTrigger} />}
                            {activeTab === 'resources' && <ManageResources refreshTrigger={refreshTrigger} />}
                            {activeTab === 'quizzes' && <ManageQuizzes refreshTrigger={refreshTrigger} />}
                            {activeTab === 'inquiries' && <ManageInquiries refreshTrigger={refreshTrigger} />}
                            {activeTab === 'settings' && <AdminSettings />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
