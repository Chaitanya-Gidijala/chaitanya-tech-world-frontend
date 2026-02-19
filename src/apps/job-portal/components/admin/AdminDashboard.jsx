import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircle,
    Layers,
    Send,
    XCircle,
    RefreshCw,
    Settings,
    Users,
    Eye,
    Globe,
    Search,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { postJob, postBatchJobs, getAllJobs, updateJob, deleteJob } from '../../services/jobService';
import { getVisitorStats } from '../../services/analyticsService';
import { logout } from '../../services/authService';
import { useToast } from '../common/Toast';
import RichTextEditor from './RichTextEditor';
import AdminSidebar from './AdminSidebar';
import DeleteConfirmModal from './DeleteConfirmModal';
import ManageJobs from './ManageJobs';
import ManageQuestions from './ManageQuestions';
import ManageTopics from './ManageTopics';
import ManageResources from './ManageResources';
import ManageQuizzes from './ManageQuizzes';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [uploadMode, setUploadMode] = useState('single');
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, browserStats: {} });
    const [batchJson, setBatchJson] = useState('');

    // CRUD State
    const [jobs, setJobs] = useState([]);
    const [editingJobId, setEditingJobId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    // Batch Builder State
    const [batchJobs, setBatchJobs] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [activeTab, setActiveTab] = useState('create');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [jobData, setJobData] = useState({
        jobTitle: '',
        company: '',
        location: '',
        jobDetails: '',
        experienceRequired: '',
        experience: 'Fresher',
        applyLink: '',
        salary: 'Negotiable',
        companyLogo: '',
        jobType: 'Full-time'
    });

    useEffect(() => {
        loadJobs();
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getVisitorStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const loadJobs = async () => {
        try {
            const fetchedJobs = await getAllJobs();
            setJobs(fetchedJobs);
        } catch (err) {
            console.error('Failed to load jobs:', err);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (job) => {
        setEditingJobId(job.id);
        setJobData({
            jobTitle: job.jobTitle || '',
            company: job.company || '',
            location: job.location || '',
            jobDetails: job.jobDetails || '',
            experienceRequired: job.experienceRequired || '',
            experience: job.experience || 'Fresher',
            applyLink: job.applyLink || '',
            salary: job.salary || 'Negotiable',
            companyLogo: job.companyLogo || '',
            jobType: job.jobType || 'Full-time'
        });
        setActiveTab('create');
        setUploadMode('single');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingJobId(null);
        resetForm();
    };

    const resetForm = () => {
        setJobData({
            jobTitle: '',
            company: '',
            location: '',
            jobDetails: '',
            experienceRequired: '',
            experience: 'Fresher',
            applyLink: '',
            salary: 'Negotiable',
            companyLogo: '',
            jobType: 'Full-time'
        });
    };

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!jobToDelete) return;
        setIsDeleting(true);
        try {
            await deleteJob(jobToDelete.id);
            showToast(`Job "${jobToDelete.jobTitle}" deleted!`, 'success');
            setShowDeleteModal(false);
            setJobToDelete(null);
            if (editingJobId === jobToDelete.id) handleCancelEdit();
            await loadJobs();
        } catch (err) {
            showToast('Failed to delete job.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/job-portal/admin/login');
    };

    const handleSubmitSingle = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = { ...jobData, postedAt: new Date().toISOString() };
        try {
            if (editingJobId) {
                await updateJob(editingJobId, payload);
                showToast('Job updated!', 'success');
                setEditingJobId(null);
            } else {
                await postJob(payload);
                showToast('Job posted!', 'success');
            }
            resetForm();
            await loadJobs();
        } catch (err) {
            showToast('Action failed.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToBatch = (e) => {
        if (e) e.preventDefault();

        // Basic validation
        if (!jobData.jobTitle || !jobData.company || !jobData.applyLink) {
            showToast('Please fill Title, Company and Apply Link.', 'warning');
            return;
        }

        const newBatchJob = { ...jobData, id: Date.now() }; // Temporary ID for list management
        setBatchJobs(prev => [newBatchJob, ...prev]);
        resetForm();
        showToast('Job added to batch list!', 'info');
    };

    const handleRemoveFromBatch = (id) => {
        setBatchJobs(prev => prev.filter(job => job.id !== id));
    };

    const handleSubmitBatch = async (e) => {
        if (e) e.preventDefault();

        let jobsToPublish = [];

        try {
            if (batchJson.trim()) {
                // If there's JSON in the textarea, parse it
                const parsed = JSON.parse(batchJson);
                if (!Array.isArray(parsed)) throw new Error('Expected JSON array');
                jobsToPublish = parsed;
            } else if (batchJobs.length > 0) {
                // Otherwise use the interactive builder list
                // Clean payload: remove temporary UI 'id' and add current timestamp
                const now = new Date().toISOString();
                jobsToPublish = batchJobs.map(({ id, ...rest }) => ({
                    ...rest,
                    postedAt: now
                }));
            } else {
                showToast('No jobs to publish. Add jobs to list or paste JSON.', 'warning');
                return;
            }

            setIsLoading(true);
            await postBatchJobs(jobsToPublish);
            showToast(`${jobsToPublish.length} jobs published successfully!`, 'success');
            setBatchJobs([]);
            setBatchJson('');
            await loadJobs();
        } catch (err) {
            showToast(err.message === 'Expected JSON array' ? 'JSON must be an array of jobs.' : 'Publishing failed.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (activeTab === 'manage' || activeTab === 'create') {
            await loadJobs();
        } else {
            setRefreshTrigger(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (activeTab === 'analytics') {
            getVisitorStats().then(setStats).catch(console.error);
        }
    }, [activeTab]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--jp-bg)' }}>
            <AdminSidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`admin-main-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{
                transition: 'margin-left 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                position: 'relative',
                zIndex: 1
            }}>
                <AdminHeader
                    onLogout={handleLogout}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    jobTitle={jobToDelete?.jobTitle || ''}
                    isDeleting={isDeleting}
                />

                <main
                    className="jp-admin-content"
                    style={{
                        flex: 1,
                        padding: window.innerWidth <= 768 ? '1rem' : '2rem',
                        paddingBottom: window.innerWidth <= 768 ? '5rem' : '2rem', // Space for mobile toggle
                        minHeight: 'calc(100vh - 140px)'
                    }}
                >
                    {/* Mobile Floating Toggle */}
                    <motion.button
                        className="mobile-floating-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '1.5rem',
                            right: '1.5rem',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000, // Above everything
                            cursor: 'pointer'
                        }}
                    >
                        {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
                    </motion.button>
                    {/* Header Section */}
                    <div className="dashboard-header-strip" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: window.innerWidth <= 768 ? '1.25rem' : '2rem',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                    }}>
                        <div>
                            <h1 className="admin-page-title" style={{
                                margin: 0,
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {editingJobId ? 'Edit Job' : (activeTab === 'create' ? 'Post New Job' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
                            </h1>
                            <p className="admin-page-subtitle" style={{ color: 'var(--jp-text-muted)', fontSize: '0.850rem', marginTop: '0.15rem' }}>
                                {editingJobId ? 'Modify existing job details' : 'Manage your portal content.'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {editingJobId && (
                                <button className="jp-btn-secondary" onClick={handleCancelEdit}>
                                    Cancel Edit
                                </button>
                            )}
                            <motion.button
                                onClick={handleRefresh}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="jp-btn-secondary refresh-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px'
                                }}
                            >
                                <RefreshCw size={18} className={isLoading ? 'jp-spin' : ''} />
                                <span className="refresh-text">Refresh Data</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + editingJobId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'create' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className="glass-panel" style={{ padding: '0.75rem', maxWidth: '800px' }}>
                                        <div className="upload-mode-selector" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => setUploadMode('single')}
                                                style={{
                                                    flex: 1, minWidth: '150px', padding: '1rem', borderRadius: '12px', border: 'none',
                                                    background: uploadMode === 'single' ? 'var(--jp-primary)' : 'transparent',
                                                    color: uploadMode === 'single' ? 'white' : 'var(--jp-text-main)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 700, cursor: 'pointer'
                                                }}
                                            >
                                                <PlusCircle size={18} /> Single Upload
                                            </button>
                                            <button
                                                onClick={() => setUploadMode('batch')}
                                                style={{
                                                    flex: 1, minWidth: '150px', padding: '1rem', borderRadius: '12px', border: 'none',
                                                    background: uploadMode === 'batch' ? 'var(--jp-primary)' : 'transparent',
                                                    color: uploadMode === 'batch' ? 'white' : 'var(--jp-text-main)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 700, cursor: 'pointer'
                                                }}
                                            >
                                                <Layers size={18} /> Batch Builder
                                            </button>
                                        </div>
                                    </div>

                                    {uploadMode === 'single' ? (
                                        <motion.form onSubmit={handleSubmitSingle} className="glass-panel" style={{ padding: window.innerWidth <= 768 ? '1.5rem' : '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Title</label>
                                                    <input name="jobTitle" value={jobData.jobTitle} onChange={handleFormChange} required placeholder="e.g. Senior Developer" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                </div>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Company Name</label>
                                                    <input name="company" value={jobData.company} onChange={handleFormChange} required placeholder="e.g. Tech Corp" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                </div>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Company Logo URL</label>
                                                    <input name="companyLogo" value={jobData.companyLogo} onChange={handleFormChange} placeholder="https://logo-url.com/logo.png" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                </div>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
                                                    <input name="location" value={jobData.location} onChange={handleFormChange} required placeholder="e.g. Remote / City" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                </div>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Salary</label>
                                                    <input name="salary" value={jobData.salary} onChange={handleFormChange} placeholder="e.g. ₹5L - ₹8L" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                </div>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Type</label>
                                                    <select name="jobType" value={jobData.jobType} onChange={handleFormChange} className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)', color: 'inherit' }}>
                                                        <option value="Full-time">Full Time</option>
                                                        <option value="Part-time">Part Time</option>
                                                        <option value="Contract">Contract</option>
                                                        <option value="Remote">Remote</option>
                                                    </select>
                                                </div>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Experience</label>
                                                    <input name="experienceRequired" value={jobData.experienceRequired} onChange={handleFormChange} placeholder="e.g. 2-4 yrs" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                </div>
                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Apply Link</label>
                                                    <input name="applyLink" value={jobData.applyLink} onChange={handleFormChange} required placeholder="https://..." className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                </div>
                                            </div>
                                            <div className="jp-input-group">
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Details</label>
                                                <RichTextEditor value={jobData.jobDetails} onChange={(content) => setJobData(prev => ({ ...prev, jobDetails: content }))} />
                                            </div>
                                            <button type="submit" disabled={isLoading} className="jp-btn-primary" style={{ height: '54px', fontSize: '1.1rem', marginTop: '1rem' }}>
                                                {isLoading ? <RefreshCw className="jp-spin" size={20} /> : (editingJobId ? 'Update Job' : 'Publish Job')}
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                            {/* Step 1: Add Job to Batch */}
                                            <div className="glass-panel" style={{ padding: window.innerWidth <= 768 ? '1.5rem' : '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--jp-border)', paddingBottom: '1rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--jp-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</div>
                                                    <h3 style={{ margin: 0 }}>Define Job for Batch</h3>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Title</label>
                                                        <input name="jobTitle" value={jobData.jobTitle} onChange={handleFormChange} placeholder="e.g. Senior Developer" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                    </div>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Company Name</label>
                                                        <input name="company" value={jobData.company} onChange={handleFormChange} placeholder="e.g. Tech Corp" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                    </div>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Company Logo URL</label>
                                                        <input name="companyLogo" value={jobData.companyLogo} onChange={handleFormChange} placeholder="https://logo-url.com/logo.png" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                    </div>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
                                                        <input name="location" value={jobData.location} onChange={handleFormChange} placeholder="e.g. Remote / City" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                    </div>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Salary</label>
                                                        <input name="salary" value={jobData.salary} onChange={handleFormChange} placeholder="e.g. ₹5L - ₹8L" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                    </div>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Type</label>
                                                        <select name="jobType" value={jobData.jobType} onChange={handleFormChange} className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)', color: 'inherit' }}>
                                                            <option value="Full-time">Full Time</option>
                                                            <option value="Part-time">Part Time</option>
                                                            <option value="Contract">Contract</option>
                                                            <option value="Remote">Remote</option>
                                                        </select>
                                                    </div>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Experience</label>
                                                        <input name="experienceRequired" value={jobData.experienceRequired} onChange={handleFormChange} placeholder="e.g. 2-4 yrs" className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                    </div>
                                                    <div className="jp-input-group">
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Apply Link</label>
                                                        <input name="applyLink" value={jobData.applyLink} onChange={handleFormChange} placeholder="https://..." className="jp-search-field" style={{ width: '100%', background: 'var(--jp-bg-secondary)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--jp-border)' }} />
                                                    </div>
                                                </div>

                                                <div className="jp-input-group">
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Details</label>
                                                    <RichTextEditor value={jobData.jobDetails} onChange={(content) => setJobData(prev => ({ ...prev, jobDetails: content }))} />
                                                </div>

                                                <button onClick={handleAddToBatch} className="jp-btn-secondary" style={{ height: '54px', border: '2px dashed var(--jp-primary)', color: 'var(--jp-primary)', fontWeight: 700 }}>
                                                    <PlusCircle size={20} style={{ marginRight: '0.5rem' }} /> Add to Batch List
                                                </button>
                                            </div>

                                            {/* Step 2: Review and Publish */}
                                            {batchJobs.length > 0 && (
                                                <div className="glass-panel" style={{ padding: window.innerWidth <= 768 ? '1.5rem' : '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--jp-border)', paddingBottom: '1rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--jp-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</div>
                                                            <h3 style={{ margin: 0 }}>Review List ({batchJobs.length})</h3>
                                                        </div>
                                                        <button onClick={handleSubmitBatch} disabled={isLoading} className="jp-btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '10px' }}>
                                                            {isLoading ? <RefreshCw className="jp-spin" size={18} /> : 'Publish All'}
                                                        </button>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                                        {batchJobs.map((job) => (
                                                            <div key={job.id} style={{ padding: '1rem', background: 'var(--jp-bg-secondary)', borderRadius: '12px', border: '1px solid var(--jp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', border: '1px solid var(--jp-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                                        {job.companyLogo ? <img src={job.companyLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <Briefcase size={20} style={{ color: 'var(--jp-text-muted)' }} />}
                                                                    </div>
                                                                    <div>
                                                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.jobTitle}</div>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--jp-text-muted)' }}>{job.company} • {job.location}</div>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => handleRemoveFromBatch(job.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                                                                    <XCircle size={18} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 3: Advanced JSON Option */}
                                            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                                    <Layers size={24} style={{ color: 'var(--jp-primary)' }} />
                                                    <h3 style={{ margin: 0 }}>Advanced: Batch JSON Paste</h3>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--jp-text-muted)', marginBottom: '1rem' }}>
                                                    Already have a JSON array of jobs? Paste it here to skip the builder.
                                                </p>
                                                <textarea value={batchJson} onChange={(e) => setBatchJson(e.target.value)} placeholder='Paste JSON array here...' style={{ width: '100%', height: '200px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', borderRadius: '12px', padding: '1.5rem', color: 'var(--jp-text-main)', fontFamily: 'monospace', marginBottom: '1.5rem', outline: 'none' }} />
                                                <button onClick={handleSubmitBatch} disabled={isLoading} className="jp-btn-primary" style={{ width: '100%', height: '54px' }}>
                                                    {isLoading ? <RefreshCw className="jp-spin" size={20} /> : 'Publish from JSON'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'manage' && (
                                <ManageJobs jobs={jobs} onEdit={handleEdit} onDelete={handleDeleteClick} editingJobId={editingJobId} />
                            )}

                            {activeTab === 'analytics' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, hsl(260, 100%, 65%), hsl(260, 100%, 55%))', color: 'white', border: 'none' }}>
                                            <Eye size={32} />
                                            <div><h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalViews}</h3><p style={{ margin: 0, opacity: 0.9 }}>Page Views</p></div>
                                        </div>
                                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <Users size={32} style={{ color: 'var(--jp-secondary)' }} />
                                            <div><h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>{stats.uniqueVisitors}</h3><p style={{ margin: 0, color: 'var(--jp-text-muted)' }}>Unique Visitors</p></div>
                                        </div>
                                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <Globe size={32} style={{ color: '#10b981' }} />
                                            <div><h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>Global</h3><p style={{ margin: 0, color: 'var(--jp-text-muted)' }}>Traffic Tracking</p></div>
                                        </div>
                                    </div>

                                    {/* Browser Distribution */}
                                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--jp-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Globe size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0 }}>Traffic Overview</h3>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>Distribution by Browser & Device</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                                            <div>
                                                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--jp-text-muted)', marginBottom: '1.5rem' }}>Browsers</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                                    {Object.entries(stats.browserStats || {}).length > 0 ? (
                                                        Object.entries(stats.browserStats)
                                                            .sort((a, b) => b[1] - a[1])
                                                            .map(([browser, count]) => {
                                                                const percentage = Math.round((count / stats.totalViews) * 100) || 0;
                                                                return (
                                                                    <div key={browser}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                                            <span style={{ fontWeight: 600 }}>{browser}</span>
                                                                            <span style={{ color: 'var(--jp-text-muted)' }}>{count} hits ({percentage}%)</span>
                                                                        </div>
                                                                        <div style={{ height: '8px', background: 'var(--jp-bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${percentage}%` }}
                                                                                style={{ height: '100%', background: 'var(--jp-primary)', borderRadius: '4px' }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                    ) : (
                                                        <p style={{ color: 'var(--jp-text-muted)', fontSize: '0.9rem' }}>No browser data collected yet.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ background: 'var(--jp-bg-secondary)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--jp-border)' }}>
                                                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--jp-text-muted)', marginBottom: '1.5rem' }}>Top Platforms</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    <div style={{ padding: '1rem', background: 'var(--jp-card-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: 600 }}>Desktop Users</span>
                                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>Most Active</span>
                                                    </div>
                                                    <div style={{ padding: '1rem', background: 'var(--jp-card-bg)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: 600 }}>Mobile Users</span>
                                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--jp-primary)', fontSize: '0.8rem', fontWeight: 700 }}>Trending</span>
                                                    </div>
                                                </div>
                                                <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--jp-text-muted)', lineHeight: 1.5 }}>
                                                    Real-time tracking is enabled. Data is refreshed every time you hit the dashboard.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'questions' && <ManageQuestions refreshTrigger={refreshTrigger} />}
                            {activeTab === 'topics' && <ManageTopics refreshTrigger={refreshTrigger} />}
                            {activeTab === 'resources' && <ManageResources refreshTrigger={refreshTrigger} />}
                            {activeTab === 'quizzes' && <ManageQuizzes refreshTrigger={refreshTrigger} />}

                            {activeTab === 'settings' && <AdminSettings />}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <AdminFooter sidebarOpen={sidebarOpen} />

                <style>{`
                .admin-page-title { font-size: 2.5rem; }
                @media (min-width: 769px) {
                    .admin-main-layout.sidebar-open { 
                        margin-left: 280px !important; 
                    }
                    .admin-main-layout.sidebar-closed { 
                        margin-left: 0 !important; 
                    }
                }
                @media (max-width: 768px) {
                    .admin-main-layout { margin-left: 0 !important; }
                    .admin-page-title { font-size: 1.5rem !important; }
                    .admin-page-subtitle { font-size: 0.8rem !important; }
                    .dashboard-header-strip { 
                        flex-direction: row !important; 
                        align-items: center !important; 
                        justify-content: space-between !important;
                    }
                    .refresh-text { display: none; }
                    .refresh-btn { padding: 0.6rem !important; aspect-ratio: 1; border-radius: 50% !important; }
                    .dashboard-header-strip button { width: auto !important; }
                    .mobile-floating-toggle { display: flex !important; }
                    .mobile-menu-toggle { display: none !important; } /* Hide the one in the header on mobile as we now have the FAB */
                }
            `}</style>
            </div>
        </div>
    );
};

export default AdminDashboard;
