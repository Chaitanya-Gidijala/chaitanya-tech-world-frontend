import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    PlusCircle, Layers, Send, XCircle, RefreshCw,
    Users, Eye, Globe, X, Menu, Moon, Sun, LogOut,
    ChevronRight, Home, FileText, HelpCircle, Hash, Book, 
    ClipboardCheck, MessageSquare, Briefcase, BarChart3, 
    CreditCard, Mail, Settings, ShieldCheck, Heart, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { postJob, postBatchJobs, getAllJobs, updateJob, deleteJob } from '../../services/jobService';
import { getVisitorStats, getVisitorSessions } from '../../services/analyticsService';
import { logout, getUserCount, getToken } from '../../services/authService';
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
import ManageSupport from './ManageSupport';
import ManageUsers from './ManageUsers';
import ManageSubscribers from './ManageSubscribers';
import AnalyticsPanel from './AnalyticsPanel';
import AdminPromptsPage from '../../../prompts-gallery/pages/AdminPromptsPage';
import ImageManagerPage from '../../../image-manager/pages/ImageManagerPage';
import { THEME_KEY } from '@/constants/theme';
import './AdminLayout.css';

const tabTitles = {
    overview: 'Portal Overview',
    create: 'Post a New Job',
    manage: 'Job Management',
    questions: 'Interview Prep Q&A',
    topics: 'Core Tech Topics',
    resources: 'PDF & Media Resources',
    quizzes: 'Live Assessment Quizzes',
    analytics: 'Traffic & Visitor Stats',
    inquiries: 'Contact Inquiries',
    support: 'Support Contributions',
    users: 'User Registry',
    payments: 'Financial Transactions',
    subscribers: 'Newsletter Subscribers',
    settings: 'Portal Configuration',
    prompts: 'Manage Prompts Gallery',
    images: 'Image Manager',
};

const FORM_DEFAULTS = {
    jobTitle: '', company: '', location: '', jobDetails: '',
    experienceRequired: '', experience: 'Fresher',
    applyLink: '', salary: 'Negotiable', companyLogo: '', jobType: 'Full-time'
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { tab: urlTab } = useParams();
    const { showToast } = useToast();
    const [uploadMode, setUploadMode] = useState('single');
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, browserStats: {}, dailyStats: [] });
    const [batchJson, setBatchJson] = useState('');
    const [jobs, setJobs] = useState([]);
    const [editingJobId, setEditingJobId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [batchJobs, setBatchJobs] = useState([]);

    // Derive activeTab from URL param; fall back to 'overview'
    const VALID_TABS = Object.keys(tabTitles);
    const activeTab = VALID_TABS.includes(urlTab) ? urlTab : 'overview';

    const [overviewStats, setOverviewStats] = useState({
        users: 0, jobs: 0, questions: 0, topics: 0, resources: 0, quizzes: 0, inquiries: 0, support: 0, revenue: 0
    });
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [jobData, setJobData] = useState(FORM_DEFAULTS);
    const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

    useEffect(() => {
        // One-time cleanup: remove old localStorage analytics keys that inflate counts.
        // These were used as a fallback before the backend was fully implemented.
        ['jp_visitor_count', 'jp_unique_visitors', 'jp_browser_stats', 'jp_sessions'].forEach(k => {
            try { localStorage.removeItem(k); } catch {}
        });
    }, []);

    useEffect(() => {
        fetchStats();
        fetchOverviewData();
        
        // Auto-refresh analytics every 60s when analytics tab is active
        let interval;
        if (activeTab === 'analytics') {
            interval = setInterval(fetchStats, 60000);
        }
        
        return () => { if (interval) clearInterval(interval); };
    }, [activeTab]);

    const fetchStats = () => {
        if (activeTab === 'analytics') {
            getVisitorStats()
                .then(data => setStats({
                    totalViews:    data.totalViews    ?? 0,
                    uniqueVisitors: data.uniqueVisitors ?? 0,
                    browserStats:  data.browserStats  ?? {},
                    dailyStats:    data.dailyStats    ?? [],
                }))
                .catch(console.error);
        }
    };

    const fetchOverviewData = () => {
        if (activeTab === 'overview') {
            loadOverviewStats();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) setSidebarOpen(true);
            else if (window.innerWidth <= 768) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { loadJobs(); }, []);

    useEffect(() => {
        if (activeTab === 'overview') {
            loadOverviewStats();
        }
    }, [activeTab]);

    const handleTabChange = (tab) => {
        // Navigate to the tab-specific URL — this updates activeTab via useParams
        navigate(`/AdminPortal/admin/dashboard/${tab}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

            setOverviewStats(prev => ({
                ...prev,
                users: uCount || 0,
                jobs: jList.length || 0,
                questions: qPage.totalElements || 0,
                topics: tList.length || 0,
                resources: rPage.totalElements || 0,
                quizzes: quizPage.totalElements || 0,
                inquiries: iList.length || 0,
            }));

            // Fetch payment stats
            const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080/api';
            const r = await fetch(`${API_HOST}/user/profile/payments/all`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            
            if (!r.ok) {
                console.warn(`Payment stats fetch failed with status: ${r.status}`);
                return;
            }

            const paymentData = await r.json();
            if (Array.isArray(paymentData)) {
                const totalRevenue = paymentData.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
                setOverviewStats(prev => ({ ...prev, support: paymentData.length, revenue: totalRevenue }));
            }

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
        localStorage.setItem(THEME_KEY, newTheme);
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
        navigate('/AdminPortal/admin/dashboard/create');
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
        navigate('/job-portal');
    };

    const currentTitle = editingJobId ? 'Edit Job Posting' : tabTitles[activeTab] || 'Admin Hub';

    return (
        <div className="adm-root">
            {/* ── TOP NAV BAR ── */}
            <header className="adm-topbar">
                <div className="adm-topbar-left">
                    <button className="adm-topbar-toggle" onClick={() => setSidebarOpen(p => !p)}>
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                    <a href="/" className="adm-topbar-brand">
                        <img src="/CTW.svg" alt="Logo" className="adm-topbar-logo" />
                    </a>
                </div>
                <div className="adm-topbar-right">
                    <button className="adm-topbar-icon-btn" onClick={toggleTheme} title="Toggle Mode">
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="adm-topbar-icon-btn" onClick={handleRefresh} title="Refresh Data">
                        <RefreshCw size={18} className={isLoading ? 'jp-spin' : ''} />
                    </button>
                    <button className="adm-topbar-logout" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <div className="adm-body">
                <AdminSidebar 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange} 
                    isOpen={sidebarOpen} 
                    onToggle={() => setSidebarOpen(!sidebarOpen)} 
                />

                {sidebarOpen && window.innerWidth <= 768 && (
                    <div className="adm-backdrop visible" onClick={() => setSidebarOpen(false)} />
                )}

                <main className="adm-content">
                    <DeleteConfirmModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteConfirm}
                        jobTitle={jobToDelete?.jobTitle || ''}
                        isDeleting={isDeleting}
                    />

                    {/* Page Header Strip */}
                    <div className="adm-page-header">
                        <div>
                            <h1 className="adm-page-title">{currentTitle}</h1>
                            <p className="adm-page-subtitle">
                                {editingJobId ? 'Updating existing record' : 'Real-time portal management & insights'}
                            </p>
                        </div>
                        <div className="adm-page-actions">
                            {editingJobId && (
                                <button className="adm-btn adm-btn-secondary" onClick={handleCancelEdit}>
                                    <X size={14} /> Cancel Edit
                                </button>
                            )}
                            <button className="adm-btn adm-btn-primary" onClick={() => setRefreshTrigger(p => p + 1)}>
                                <RefreshCw size={14} /> Refresh
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="adm-overview">
                                    <div className="adm-stats-grid">
                                        {[
                                            { id: 'users', label: 'Registered Users', val: overviewStats.users, icon: Users, color: '#6366f1', link: 'users' },
                                            { id: 'jobs', label: 'Active Jobs', val: overviewStats.jobs, icon: Briefcase, color: '#ec4899', link: 'manage' },
                                            { id: 'revenue', label: 'Total Revenue', val: `₹${overviewStats.revenue}`, icon: CreditCard, color: '#10b981', link: 'payments' },
                                            { id: 'support', label: 'Contributions', val: overviewStats.support, icon: Heart, color: '#f59e0b', link: 'support' },
                                            { id: 'questions', label: 'Prep Q&A', val: overviewStats.questions, icon: HelpCircle, color: '#3b82f6', link: 'questions' },
                                            { id: 'inquiries', label: 'Enquiries', val: overviewStats.inquiries, icon: MessageSquare, color: '#06b6d4', link: 'inquiries' }
                                        ].map(stat => (
                                            <div key={stat.id} className="adm-stat-card clickable" onClick={() => handleTabChange(stat.link)}>
                                                <div className="adm-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                                    <stat.icon size={22} />
                                                </div>
                                                <div className="adm-stat-info">
                                                    <h4 className="adm-stat-value">{isLoading ? '...' : stat.val}</h4>
                                                    <p className="adm-stat-label">{stat.label}</p>
                                                </div>
                                                <ChevronRight size={16} className="adm-stat-arrow" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="adm-card-panel">
                                        <h3 className="adm-step-title" style={{ marginBottom: '1.25rem' }}>Quick Navigation</h3>
                                        <div className="adm-quick-actions-grid">
                                            <button className="adm-btn adm-btn-primary" onClick={() => handleTabChange('create')}>
                                                <PlusCircle size={16} /> New Job Post
                                            </button>
                                            <button className="adm-btn adm-btn-secondary" onClick={() => handleTabChange('manage')}>
                                                <Layers size={16} /> Job Registry
                                            </button>
                                            <button className="adm-btn adm-btn-secondary" onClick={() => handleTabChange('support')}>
                                                <Heart size={16} /> Support Logs
                                            </button>
                                            <button className="adm-btn adm-btn-secondary" onClick={() => handleTabChange('analytics')}>
                                                <BarChart3 size={16} /> View Traffic
                                            </button>
                                        </div>
                                    </div>

                                    <div className="adm-card-panel">
                                        <h3 className="adm-step-title" style={{ marginBottom: '0.65rem' }}>Prep Operations</h3>
                                        <p className="adm-page-subtitle" style={{ marginBottom: '1.25rem' }}>
                                            These admin sections now feed the public prep hub, tests, resources, and question bank experience.
                                        </p>
                                        <div className="adm-quick-actions-grid">
                                            <button className="adm-btn adm-btn-secondary" onClick={() => handleTabChange('questions')}>
                                                <HelpCircle size={16} /> Manage Questions
                                            </button>
                                            <button className="adm-btn adm-btn-secondary" onClick={() => handleTabChange('topics')}>
                                                <Hash size={16} /> Manage Topics
                                            </button>
                                            <button className="adm-btn adm-btn-secondary" onClick={() => handleTabChange('resources')}>
                                                <Book size={16} /> Manage Resources
                                            </button>
                                            <button className="adm-btn adm-btn-primary" onClick={() => handleTabChange('quizzes')}>
                                                <ClipboardCheck size={16} /> Build Live Quizzes
                                            </button>
                                        </div>
                                        <div className="adm-stats-grid" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
                                            {[
                                                { id: 'topics', label: 'Topics', val: overviewStats.topics, icon: Hash, color: '#7c3aed', link: 'topics' },
                                                { id: 'resources', label: 'Resources', val: overviewStats.resources, icon: Book, color: '#10b981', link: 'resources' },
                                                { id: 'quizzes', label: 'Live Quizzes', val: overviewStats.quizzes, icon: ClipboardCheck, color: '#3b82f6', link: 'quizzes' }
                                            ].map((stat) => (
                                                <div key={stat.id} className="adm-stat-card clickable" onClick={() => handleTabChange(stat.link)}>
                                                    <div className="adm-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                                        <stat.icon size={20} />
                                                    </div>
                                                    <div className="adm-stat-info">
                                                        <h4 className="adm-stat-value">{isLoading ? '...' : stat.val}</h4>
                                                        <p className="adm-stat-label">{stat.label}</p>
                                                    </div>
                                                    <ChevronRight size={16} className="adm-stat-arrow" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CREATE JOB TAB */}
                            {activeTab === 'create' && (
                                <div className="adm-create-view">
                                    <div className="adm-mode-switcher">
                                        <button className={`adm-mode-btn ${uploadMode === 'single' ? 'active' : ''}`} onClick={() => setUploadMode('single')}>
                                            <PlusCircle size={14} /> Single Post
                                        </button>
                                        <button className={`adm-mode-btn ${uploadMode === 'batch' ? 'active' : ''}`} onClick={() => setUploadMode('batch')}>
                                            <Layers size={14} /> Batch Upload
                                        </button>
                                    </div>

                                    {uploadMode === 'single' ? (
                                        <div className="adm-card-panel">
                                            <form className="adm-form" onSubmit={handleSubmitSingle}>
                                                <div className="adm-form-grid">
                                                    <div className="adm-field"><label className="adm-label">Job Title *</label><input name="jobTitle" value={jobData.jobTitle} onChange={handleFormChange} required placeholder="e.g. Full Stack Developer" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Company Name *</label><input name="company" value={jobData.company} onChange={handleFormChange} required placeholder="e.g. Google" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Location *</label><input name="location" value={jobData.location} onChange={handleFormChange} required placeholder="e.g. Remote / Hyderabad" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Salary Range</label><input name="salary" value={jobData.salary} onChange={handleFormChange} placeholder="e.g. ₹12L - ₹15L" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Experience Required *</label><input name="experienceRequired" value={jobData.experienceRequired} onChange={handleFormChange} required placeholder="e.g. 0-2 years / Fresher" className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Experience Level</label><select name="experience" value={jobData.experience} onChange={handleFormChange} className="adm-input"><option value="Fresher">Fresher</option><option value="Junior">Junior (1-3 yrs)</option><option value="Mid">Mid (3-5 yrs)</option><option value="Senior">Senior (5+ yrs)</option></select></div>
                                                    <div className="adm-field"><label className="adm-label">Job Type</label><select name="jobType" value={jobData.jobType} onChange={handleFormChange} className="adm-input"><option value="Full-time">Full Time</option><option value="Part-time">Part Time</option><option value="Contract">Contract</option><option value="Internship">Internship</option></select></div>
                                                    <div className="adm-field"><label className="adm-label">Apply Link *</label><input name="applyLink" value={jobData.applyLink} onChange={handleFormChange} required placeholder="https://..." className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Company Logo URL</label><input name="companyLogo" value={jobData.companyLogo} onChange={handleFormChange} placeholder="https://..." className="adm-input" /></div>
                                                </div>
                                                <div className="adm-field">
                                                    <label className="adm-label">Detailed Description</label>
                                                    <RichTextEditor value={jobData.jobDetails} onChange={(val) => setJobData(p => ({ ...p, jobDetails: val }))} />
                                                </div>
                                                <div className="adm-form-footer">
                                                    <button type="submit" disabled={isLoading} className="adm-btn adm-btn-primary adm-btn-wide">
                                                        {isLoading ? <RefreshCw className="jp-spin" size={16} /> : <Send size={16} />} 
                                                        {editingJobId ? 'Update Posting' : 'Publish to Portal'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="adm-batch-view">
                                            <div className="adm-card-panel">
                                                <div className="adm-form-step-header">
                                                    <span className="adm-step-badge">1</span>
                                                    <h3 className="adm-step-title">Add Job to Batch List</h3>
                                                </div>
                                                <div className="adm-form-grid" style={{ marginTop: '1rem' }}>
                                                    <div className="adm-field"><label className="adm-label">Job Title</label><input name="jobTitle" value={jobData.jobTitle} onChange={handleFormChange} className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Company</label><input name="company" value={jobData.company} onChange={handleFormChange} className="adm-input" /></div>
                                                    <div className="adm-field"><label className="adm-label">Apply Link</label><input name="applyLink" value={jobData.applyLink} onChange={handleFormChange} className="adm-input" /></div>
                                                </div>
                                                <button onClick={handleAddToBatch} className="adm-btn adm-btn-dashed" style={{ marginTop: '1rem', width: '100%' }}>
                                                    <PlusCircle size={14} /> Add to Collection
                                                </button>
                                            </div>

                                            {batchJobs.length > 0 && (
                                                <div className="adm-card-panel">
                                                    <div className="adm-batch-review-header">
                                                        <h3 className="adm-step-title">Pending Jobs ({batchJobs.length})</h3>
                                                        <button onClick={handleSubmitBatch} className="adm-btn adm-btn-primary">
                                                            Publish {batchJobs.length} Jobs
                                                        </button>
                                                    </div>
                                                    <div className="adm-batch-list">
                                                        {batchJobs.map(j => (
                                                            <div key={j.id} className="adm-batch-item">
                                                                <span className="adm-batch-item-title">{j.jobTitle} @ {j.company}</span>
                                                                <button onClick={() => handleRemoveFromBatch(j.id)} className="adm-btn-icon delete"><X size={14} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="adm-card-panel">
                                                <div className="adm-form-step-header">
                                                    <span className="adm-step-badge">2</span>
                                                    <h3 className="adm-step-title">Import via JSON Array</h3>
                                                </div>
                                                <div className="adm-field" style={{ marginTop: '1rem' }}>
                                                    <textarea 
                                                        className="adm-input adm-textarea adm-json-textarea" 
                                                        value={batchJson} 
                                                        onChange={(e) => setBatchJson(e.target.value)}
                                                        placeholder='[{"jobTitle": "Dev", "company": "ABC", "applyLink": "http://..."}]'
                                                    />
                                                </div>
                                                <button onClick={handleSubmitBatch} disabled={isLoading} className="adm-btn adm-btn-primary adm-btn-wide">
                                                    <Layers size={14} /> Import & Publish JSON
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'manage' && <ManageJobs jobs={jobs} onEdit={handleEdit} onDelete={handleDeleteClick} />}
                            {activeTab === 'questions' && <ManageQuestions refreshTrigger={refreshTrigger} />}
                            {activeTab === 'topics' && <ManageTopics refreshTrigger={refreshTrigger} />}
                            {activeTab === 'resources' && <ManageResources refreshTrigger={refreshTrigger} />}
                            {activeTab === 'quizzes' && <ManageQuizzes refreshTrigger={refreshTrigger} />}
                            {activeTab === 'inquiries' && <ManageInquiries refreshTrigger={refreshTrigger} />}
                            {activeTab === 'support' && <ManageSupport refreshTrigger={refreshTrigger} />}
                            {activeTab === 'payments' && <ManageSupport refreshTrigger={refreshTrigger} />}
                            {activeTab === 'users' && <ManageUsers refreshTrigger={refreshTrigger} />}
                            {activeTab === 'subscribers' && <ManageSubscribers refreshTrigger={refreshTrigger} />}
                            {activeTab === 'prompts' && <AdminPromptsPage />}
                            {activeTab === 'images' && <ImageManagerPage />}
                            
                            {activeTab === 'analytics' && <AnalyticsPanel stats={stats} overviewStats={overviewStats} refreshTrigger={refreshTrigger} />}

                            {activeTab === 'settings' && <AdminSettings />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
