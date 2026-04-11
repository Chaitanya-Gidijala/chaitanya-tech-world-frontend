import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, Shield, LogOut, Settings, 
    Bell, MapPin, Calendar, Camera, Edit3, 
    CheckCircle, Award, Activity, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUser, logout } from '../job-portal/services/authService';
import './styles/profile.css';

const ProfilePage = () => {
    const user = getCurrentUser() || {
        name: 'Guest User',
        email: 'guest@example.com',
        username: 'guest',
        roles: ['ROLE_USER']
    };
    
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="profile-container">
            {/* ── HERO BANNER ── */}
            <div className="profile-hero">
                <div className="hero-overlay" />
            </div>

            <div className="profile-content-wrapper">
                {/* ── HEADER CARD ── */}
                <header className="profile-header-card">
                    <div className="avatar-box">
                        <div className="initials">{getInitials(user.name)}</div>
                        <button className="avatar-edit-btn" title="Change Avatar">
                            <Camera size={16} />
                        </button>
                    </div>

                    <div className="user-meta">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            {user.name}
                        </motion.h1>
                        <div className="role-badge">
                            <Shield size={14} />
                            {user.roles?.[0]?.replace('ROLE_', '') || 'User'}
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="btn-premium">
                            <Edit3 size={18} />
                            Edit Profile
                        </button>
                        <button className="btn-outline" onClick={handleLogout}>
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* ── MAIN GRID ── */}
                <main className="profile-grid-main">
                    {/* SIDEBAR */}
                    <aside className="sidebar-nav">
                        <div 
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <Activity size={20} />
                            Overview
                        </div>
                        <div 
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings size={20} />
                            Settings
                        </div>
                        <div 
                            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Bell size={20} />
                            Notifications
                        </div>
                    </aside>

                    {/* CONTENT AREA */}
                    <div className="content-area">
                        {activeTab === 'overview' && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="profile-section-card"
                            >
                                <div className="section-header">
                                    <h3>Account Overview</h3>
                                    <CheckCircle size={20} color="#10b981" />
                                </div>

                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Email Address</label>
                                        <div className="val">{user.email}</div>
                                    </div>
                                    <div className="info-item">
                                        <label>Username</label>
                                        <div className="val">@{user.username}</div>
                                    </div>
                                    <div className="info-item">
                                        <label>Member Since</label>
                                        <div className="val">
                                            {user.createdAt 
                                                ? new Date(user.createdAt).toLocaleDateString() 
                                                : 'April 2024'}
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <label>Account ID</label>
                                        <div className="val">#UP-{user.id || 'N/A'}</div>
                                    </div>
                                </div>

                                <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '2.5rem 0' }} />

                                <div className="section-header">
                                    <h3>Recent Activity</h3>
                                </div>

                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div className="act-icon"><Briefcase size={18} /></div>
                                        <div className="act-meta">
                                            <h4>Submitted Job Application</h4>
                                            <p>Applied for Senior Java Developer at Google Cloud</p>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="act-icon"><Award size={18} /></div>
                                        <div className="act-meta">
                                            <h4>Quiz Completed</h4>
                                            <p>Scored 92% in advanced Spring Boot certification</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab !== 'overview' && (
                            <div className="profile-section-card" style={{ textAlign: 'center', padding: '5rem' }}>
                                <Settings size={48} color="#3f3f46" />
                                <h3 style={{ marginTop: '1.5rem' }}>Section under construction</h3>
                                <p style={{ color: '#5a5a6e' }}>We are working hard to bring this feature to your profile soon.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
