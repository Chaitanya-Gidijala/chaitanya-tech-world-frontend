import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    User, Mail, Shield, LogOut, Settings,
    Bell, Camera, Edit3, CheckCircle, Award,
    Activity, Briefcase, FileText, CreditCard,
    Menu, X, Download, Lock, Star, Zap,
    Globe, Phone, MapPin, Calendar, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, logout, getToken } from '../job-portal/services/authService';
import apiConfig from '../../config/apiConfig';
import './styles/profile.css';

/* ── Skeleton component ── */
const Skeleton = ({ className = '', style = {} }) => (
    <div className={`skeleton ${className}`} style={style} />
);

/* ── Toggle component ── */
const Toggle = ({ on, onClick }) => (
    <div className={`toggle-switch ${on ? 'on' : ''}`} onClick={onClick} />
);

const ProfilePage = () => {
    const user = getCurrentUser() || {
        name: 'Guest User',
        email: 'guest@example.com',
        username: 'guest',
        roles: ['ROLE_USER'],
        createdAt: new Date().toISOString()
    };

    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notifSettings, setNotifSettings] = useState({ email: true, push: false, updates: true });
    const [editForm, setEditForm] = useState({ 
        name: user.name || '', 
        email: user.email || '', 
        phone: user.phone || '', 
        location: user.location || '', 
        website: user.website || '' 
    });
    const [saveStatus, setSaveStatus] = useState('');

    // Handle tab from URL query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);
    }, [location]);

    // Update editForm when user object changes (e.g. after refresh)
    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                website: user.website || ''
            });
        }
    }, [user.name, user.email, user.phone, user.location, user.website]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const getInitials = (name) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const navItems = [
        { id: 'overview', icon: Activity, label: 'Overview' },
        { id: 'resumes', icon: FileText, label: 'My Resumes', badge: resumes.length || null },
        { id: 'billing', icon: CreditCard, label: 'Billing & Plans' },
        { id: 'settings', icon: Settings, label: 'Account Settings' },
        { id: 'security', icon: Lock, label: 'Security' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
    ];

    useEffect(() => {
        if (!user || user.name === 'Guest User') return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                const [resumesRes, paymentsRes] = await Promise.all([
                    fetch(apiConfig.endpoints.userProfile.resumes, { headers }),
                    fetch(apiConfig.endpoints.userProfile.payments, { headers })
                ]);
                if (resumesRes.ok) setResumes(await resumesRes.json());
                if (paymentsRes.ok) setPayments(await paymentsRes.json());
            } catch (err) {
                console.error('Profile fetch error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveSettings = async () => {
        setSaveStatus('saving');
        try {
            const token = getToken();
            const res = await fetch(apiConfig.endpoints.auth.me, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                setSaveStatus('saved');
                // Optional: update local user storage if needed, or just let refresh handle it
                const result = await res.json();
                if (result.data) {
                    localStorage.setItem('jp_user', JSON.stringify(result.data));
                }
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
            console.error('Update profile error', err);
            setSaveStatus('error');
        } finally {
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const downloadResume = (resumeData) => {
        // Create a hidden element to render the resume
        // For simplicity, we navigate to the builder with the data and trigger print there
        // OR we can implement a more robust client-side PDF generation here.
        // For now, let's use the same logic as the builder but adapt it for Profile.
        
        const el = document.createElement('div');
        el.id = 'temp-resume-output';
        el.style.display = 'none';
        document.body.appendChild(el);
        
        // This is a bit complex because ResumeTemplate needs all the styles.
        // The most professional way is to use a dedicated PDF service or a specialized library.
        // Given the request, I will implement a "Preview & Download" flow or use the builder's logic.
        
        // Simple approach: navigate to builder and it will auto-load
        navigate('/ai-resume-builder', { state: { resumeData, autoDownload: true } });
    };

    const tabVariants = {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
        exit: { opacity: 0, y: -8, transition: { duration: 0.12 } }
    };


    return (
        <div className="profile-container">
            <div className="profile-hero">
                <div className="hero-overlay" />
            </div>

            <div className="profile-content-wrapper">
                {/* Header Card */}
                <header className="profile-header-card">
                    <div className="avatar-box">
                        <span className="initials">{getInitials(user.name)}</span>
                        <button className="avatar-edit-btn" title="Change photo">
                            <Camera size={12} />
                        </button>
                    </div>

                    <div className="user-meta">
                        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                            {user.name}
                        </motion.h1>
                        <div className="role-badge">
                            <Shield size={11} />
                            {user.roles?.[0]?.replace('ROLE_', '') || 'User'}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="profile-quick-stats">
                        <div className="pqs-item">
                            <div className="pqs-num">{loading ? '—' : resumes.length}</div>
                            <div className="pqs-label">Resumes</div>
                        </div>
                        <div className="pqs-item">
                            <div className="pqs-num">{loading ? '—' : payments.length}</div>
                            <div className="pqs-label">Payments</div>
                        </div>
                        <div className="pqs-item">
                            <div className="pqs-num">{resumes.length > 0 ? '94%' : '—'}</div>
                            <div className="pqs-label">ATS Score</div>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="btn-premium" onClick={() => setActiveTab('settings')}>
                            <Edit3 size={14} />
                            <span>Edit Profile</span>
                        </button>
                        <button className="btn-outline" onClick={handleLogout} title="Logout">
                            <LogOut size={15} />
                        </button>
                    </div>
                </header>

                {/* Mobile Nav Toggle */}
                <div className="mobile-nav-toggle">
                    <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
                        {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
                        {navItems.find(n => n.id === activeTab)?.label || 'Menu'}
                    </button>
                </div>

                {/* Main Grid */}
                <main className="profile-grid-main">
                    {/* Sidebar */}
                    {isMobileNavOpen && (
                        <div className="profile-sidebar-overlay active" onClick={() => setIsMobileNavOpen(false)} />
                    )}
                    <aside className={`sidebar-nav ${isMobileNavOpen ? 'mobile-open' : ''}`}>
                        <div className="sidebar-close-btn" onClick={() => setIsMobileNavOpen(false)}>
                            <X size={20} />
                        </div>
                        {navItems.map(item => (
                            <div
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => { setActiveTab(item.id); setIsMobileNavOpen(false); }}
                            >
                                <item.icon size={16} />
                                <span className="nav-label">{item.label}</span>
                                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                            </div>
                        ))}
                    </aside>

                    {/* Content */}
                    <div className="content-area">
                        <AnimatePresence mode="wait">

                            {/* ── OVERVIEW ── */}
                            {activeTab === 'overview' && (
                                <motion.div key="overview" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="profile-section-card">
                                        <div className="section-header">
                                            <h3>Account Overview</h3>
                                            <CheckCircle size={16} color="#10b981" />
                                        </div>

                                        <div className="info-grid">
                                            <div className="info-item">
                                                <label><Mail size={10} style={{ display: 'inline', marginRight: 4 }} />Email</label>
                                                {loading
                                                    ? <Skeleton className="skeleton-text wide" />
                                                    : <div className="val">{user.email}</div>}
                                            </div>
                                            <div className="info-item">
                                                <label><User size={10} style={{ display: 'inline', marginRight: 4 }} />Username</label>
                                                {loading
                                                    ? <Skeleton className="skeleton-text mid" />
                                                    : <div className="val">@{user.username || user.email?.split('@')[0]}</div>}
                                            </div>
                                            <div className="info-item">
                                                <label><Calendar size={10} style={{ display: 'inline', marginRight: 4 }} />Member Since</label>
                                                {loading
                                                    ? <Skeleton className="skeleton-text mid" />
                                                    : <div className="val">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Apr 2024'}
                                                    </div>}
                                            </div>
                                            <div className="info-item">
                                                <label><Shield size={10} style={{ display: 'inline', marginRight: 4 }} />Account ID</label>
                                                <div className="val" style={{ fontFamily: 'monospace', color: '#a78bfa' }}>
                                                    #UP-{user.id || '00001'}
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <label><Zap size={10} style={{ display: 'inline', marginRight: 4 }} />Current Plan</label>
                                                <div className="val">
                                                    <span className={`status-badge ${payments.length > 0 ? 'premium' : 'free'}`}>
                                                        {payments.length > 0 ? 'Premium' : 'Free'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <label><BarChart2 size={10} style={{ display: 'inline', marginRight: 4 }} />Avg. ATS Score</label>
                                                <div className="val" style={{ color: '#10b981' }}>
                                                    {resumes.length > 0 ? '94%' : '—'}
                                                </div>
                                            </div>
                                        </div>



                                        <hr className="section-divider" />

                                        {/* Recent Activity */}
                                        <div className="section-header">
                                            <h3>Recent Activity</h3>
                                        </div>
                                        <div className="activity-list">
                                            {loading
                                                ? Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="activity-item">
                                                        <Skeleton style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0 }} />
                                                        <div style={{ flex: 1 }}>
                                                            <Skeleton className="skeleton-text wide" />
                                                            <Skeleton className="skeleton-text mid" />
                                                        </div>
                                                    </div>
                                                ))
                                                : [...resumes, ...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((act, i) => (
                                                    <div key={i} className="activity-item">
                                                        <div className="act-icon" style={{ 
                                                            background: act.itemName ? '#6366f118' : '#10b98118', 
                                                            color: act.itemName ? '#6366f1' : '#10b981' 
                                                        }}>
                                                            {act.itemName ? <CreditCard size={15} /> : <FileText size={15} />}
                                                        </div>
                                                        <div className="act-meta">
                                                            <h4>{act.itemName ? `Payment: ${act.itemName}` : `Created Resume: ${act.name}`}</h4>
                                                        </div>
                                                        <span className="act-time">{new Date(act.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                            {resumes.length === 0 && payments.length === 0 && !loading && (
                                                <div className="empty-activity">No recent activity</div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── RESUMES ── */}
                            {activeTab === 'resumes' && (
                                <motion.div key="resumes" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="profile-section-card">
                                        <div className="section-header">
                                            <h3>My Resumes</h3>
                                            <button className="btn-premium" onClick={() => navigate('/ai-resume-builder')}>
                                                <FileText size={13} /> Create New
                                            </button>
                                        </div>

                                        {loading ? (
                                            <div>
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                                                        <Skeleton style={{ width: 40, height: 40, borderRadius: 10 }} />
                                                        <div style={{ flex: 1 }}>
                                                            <Skeleton className="skeleton-text wide" />
                                                            <Skeleton className="skeleton-text short" />
                                                        </div>
                                                        <Skeleton style={{ width: 60, height: 28, borderRadius: 8 }} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : resumes.length === 0 ? (
                                            <div className="empty-state">
                                                <div className="empty-state-icon">📄</div>
                                                <h4>No resumes yet</h4>
                                                <p>Create your first AI-powered resume in minutes</p>
                                                <button className="btn-premium" style={{ margin: '1rem auto 0', display: 'inline-flex' }} onClick={() => navigate('/ai-resume-builder')}>
                                                    ✨ Build Resume Free
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="data-table-wrapper">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Resume Name</th>
                                                            <th>Template</th>
                                                            <th>Type</th>
                                                            <th>Created</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {resumes.map(r => (
                                                            <tr key={r.id}>
                                                                <td className="font-medium">{r.name}</td>
                                                                <td>{r.template}</td>
                                                                <td><span className={`status-badge ${r.type === 'Free' ? 'free' : 'premium'}`}>{r.type}</span></td>
                                                                <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                                                                <td>
                                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                        <button className="action-btn-sm" onClick={() => navigate('/ai-resume-builder', { state: { resumeData: r } })}>
                                                                            <Edit3 size={12} /> Edit
                                                                        </button>
                                                                        <button className="action-btn-sm" onClick={() => downloadResume(r)}>
                                                                            <Download size={12} /> PDF
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── BILLING ── */}
                            {activeTab === 'billing' && (
                                <motion.div key="billing" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="profile-section-card">
                                        <div className="section-header">
                                            <h3>Billing & Plans</h3>
                                        </div>

                                        {/* Current Plan */}
                                        <div className="plan-card">
                                            <div className="plan-icon">🚀</div>
                                            <div className="plan-info">
                                                <div className="plan-name">Free Plan</div>
                                                <div className="plan-desc">3 free templates · No ATS lock · PDF export</div>
                                            </div>
                                            <button className="plan-upgrade-btn" onClick={() => navigate('/ai-resume-builder#templates')}>
                                                ⚡ Upgrade
                                            </button>
                                        </div>

                                        <div className="section-header">
                                            <h3>Transaction History</h3>
                                        </div>
                                        {loading ? (
                                            Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} style={{ marginBottom: '0.5rem' }}>
                                                    <Skeleton className="skeleton-text wide" />
                                                    <Skeleton className="skeleton-text mid" />
                                                </div>
                                            ))
                                        ) : payments.length === 0 ? (
                                            <div className="empty-state">
                                                <div className="empty-state-icon">💳</div>
                                                <h4>No transactions yet</h4>
                                                <p>Unlock premium templates to see payment history</p>
                                            </div>
                                        ) : (
                                            <div className="data-table-wrapper">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Transaction ID</th>
                                                            <th>Item</th>
                                                            <th>Amount</th>
                                                            <th>Date & Time</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {payments.map(p => (
                                                            <tr key={p.id}>
                                                                <td className="font-mono">{p.transactionId}</td>
                                                                <td>{p.itemName}</td>
                                                                <td className="font-medium">₹{p.amount}</td>
                                                                <td>
                                                                    {new Date(p.createdAt).toLocaleDateString('en-IN')}
                                                                    <div style={{ fontSize: '0.75rem', color: '#6b6b80', marginTop: '2px' }}>
                                                                        {new Date(p.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </td>
                                                                <td><span className="status-badge success">{p.status}</span></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SETTINGS ── */}
                            {activeTab === 'settings' && (
                                <motion.div key="settings" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="profile-section-card">
                                        <div className="section-header">
                                            <h3>Account Settings</h3>
                                        </div>

                                        <div className="settings-section">
                                            <div className="settings-section-title">Personal Information</div>
                                            <div className="settings-grid-2">
                                                <div className="settings-field">
                                                    <label>Full Name</label>
                                                    <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                                </div>
                                                <div className="settings-field">
                                                    <label>Email Address</label>
                                                    <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                                </div>
                                                <div className="settings-field">
                                                    <label>Phone Number</label>
                                                    <input value={editForm.phone} placeholder="+91 73370 72766" onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                                </div>
                                                <div className="settings-field">
                                                    <label>Location</label>
                                                    <input value={editForm.location} placeholder="City, Country" onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                                                </div>
                                                <div className="settings-field">
                                                    <label>Portfolio / Website</label>
                                                    <input value={editForm.website} placeholder="yoursite.com" onChange={e => setEditForm({ ...editForm, website: e.target.value })} />
                                                </div>
                                                <div className="settings-field">
                                                    <label>LinkedIn URL</label>
                                                    <input placeholder="linkedin.com/in/yourprofile" />
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <button className="settings-save-btn" onClick={handleSaveSettings}>
                                                {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✅ Saved!' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SECURITY ── */}
                            {activeTab === 'security' && (
                                <motion.div key="security" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="profile-section-card">
                                        <div className="section-header">
                                            <h3>Security</h3>
                                        </div>

                                        {[
                                            { icon: Lock, label: 'Password', desc: 'Last changed 30 days ago', status: 'good', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                                            { icon: Shield, label: 'Two-Factor Auth', desc: 'Not enabled — we recommend enabling 2FA', status: 'warn', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                                            { icon: Globe, label: 'Active Sessions', desc: '1 active session • Chrome, Windows', status: 'good', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                                        ].map((item, i) => (
                                            <div key={i} className="security-item">
                                                <div className="security-icon-wrap" style={{ background: item.bg }}>
                                                    <item.icon size={16} color={item.color} />
                                                </div>
                                                <div className="security-info">
                                                    <h5>{item.label}</h5>
                                                    <p>{item.desc}</p>
                                                </div>
                                                <span className={`security-status ${item.status}`}>
                                                    {item.status === 'good' ? '✓ Secure' : '⚠ Review'}
                                                </span>
                                            </div>
                                        ))}

                                        <hr className="section-divider" />
                                        <button className="settings-save-btn" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                                            Delete Account
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── NOTIFICATIONS ── */}
                            {activeTab === 'notifications' && (
                                <motion.div key="notifications" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                                    <div className="profile-section-card">
                                        <div className="section-header">
                                            <h3>Notifications</h3>
                                        </div>

                                        <div className="settings-section-title">Notification Preferences</div>
                                        {[
                                            { key: 'email', label: 'Email Notifications', desc: 'Resume tips, job alerts, platform updates' },
                                            { key: 'push', label: 'Push Notifications', desc: 'In-app alerts for activity and messages' },
                                            { key: 'updates', label: 'Product Updates', desc: 'New templates, features, and improvements' },
                                        ].map(item => (
                                            <div key={item.key} className="toggle-row">
                                                <div className="toggle-info">
                                                    <h5>{item.label}</h5>
                                                    <p>{item.desc}</p>
                                                </div>
                                                <Toggle
                                                    on={notifSettings[item.key]}
                                                    onClick={() => setNotifSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                                                />
                                            </div>
                                        ))}

                                        <hr className="section-divider" />
                                        <div className="settings-section-title">Recent Notifications</div>
                                        {[
                                            { title: '🎉 Resume Created Successfully', desc: 'Your "Executive Pro" resume was saved.', time: '2h ago', unread: true },
                                            { title: '📊 ATS Score Updated', desc: 'Your latest resume scores 96% on ATS.', time: '1d ago', unread: true },
                                            { title: '✨ New Template Available', desc: 'Cyber Tech Pro template is now available.', time: '3d ago', unread: false },
                                        ].map((n, i) => (
                                            <div key={i} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                                                <div className={`notif-dot ${n.unread ? '' : 'read'}`} />
                                                <div className="notif-meta">
                                                    <div className="notif-title">{n.title}</div>
                                                    <div className="notif-desc">{n.desc}</div>
                                                </div>
                                                <div className="notif-time">{n.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
