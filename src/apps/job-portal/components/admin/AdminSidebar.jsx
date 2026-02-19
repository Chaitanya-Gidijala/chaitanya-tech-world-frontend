import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, List, Settings, BarChart3, Menu, X, Globe, HelpCircle, Book, ClipboardCheck, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, onTabChange, isOpen, onToggle }) => {
    const navigate = useNavigate();
    const tabs = [
        { id: 'create', label: 'Create Job', icon: PlusCircle },
        { id: 'manage', label: 'Manage Jobs', icon: List },
        { id: 'questions', label: 'Questions', icon: HelpCircle },
        { id: 'topics', label: 'Topics', icon: Hash },
        { id: 'resources', label: 'Resources', icon: Book },
        { id: 'quizzes', label: 'Quizzes', icon: ClipboardCheck },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={onToggle}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 998,
                        display: 'none'
                    }}
                    className="jp-sidebar-backdrop"
                />
            )}

            {/* Sidebar */}
            <motion.div
                initial={{ x: -280 }}
                animate={{ x: isOpen ? 0 : -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '280px',
                    height: '100vh',
                    background: 'var(--jp-card-bg)',
                    borderRight: '1px solid var(--jp-border)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
                }}
                className="jp-admin-sidebar"
            >
                {/* Header */}
                <div style={{
                    padding: '2rem 1.5rem',
                    borderBottom: '1px solid var(--jp-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <div className="mobile-only-logo" style={{ marginBottom: '1rem', display: 'none' }}>
                        <img src="/CTW.svg" alt="CTW Logo" style={{ width: '40px', height: '40px' }} />
                    </div>

                    <div className="sidebar-header-text">
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '0.25rem'
                        }}>
                            Admin Panel
                        </h2>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--jp-text-muted)',
                            margin: 0
                        }}>
                            Job Portal Management
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav style={{
                    flex: 1,
                    padding: '1.5rem 0',
                    overflowY: 'auto'
                }}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: isActive
                                        ? 'linear-gradient(90deg, var(--jp-primary), transparent)'
                                        : 'transparent',
                                    border: 'none',
                                    borderLeft: isActive ? '4px solid var(--jp-primary)' : '4px solid transparent',
                                    color: isActive ? 'var(--jp-primary)' : 'var(--jp-text-main)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '1rem',
                                    fontWeight: isActive ? 700 : 500,
                                    textAlign: 'left'
                                }}
                            >
                                <Icon size={20} />
                                <span>{tab.label}</span>
                            </motion.button>
                        );
                    })}

                    <div style={{ margin: '1rem 1.5rem', height: '1px', background: 'var(--jp-border)' }} />

                    <motion.button
                        onClick={() => navigate('/job-portal')}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: 'calc(100% - 3rem)',
                            margin: '0 1.5rem',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'hsla(260, 100%, 60%, 0.1)',
                            border: '1px solid hsla(260, 100%, 60%, 0.2)',
                            borderRadius: '12px',
                            color: 'var(--jp-primary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textAlign: 'left'
                        }}
                    >
                        <Globe size={18} />
                        <span>View Public Portal</span>
                    </motion.button>
                </nav>

                {/* Footer */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--jp-border)',
                    background: 'var(--jp-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <motion.button
                        className="mobile-only-close"
                        onClick={onToggle}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            background: 'var(--jp-bg-secondary)',
                            border: '1px solid var(--jp-border)',
                            color: 'var(--jp-text-main)',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        <X size={18} />
                        <span>Close Menu</span>
                    </motion.button>

                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--jp-text-muted)',
                        textAlign: 'center',
                        margin: 0
                    }}>
                        Admin Dashboard v1.0
                    </p>
                </div>
            </motion.div>

            <style>{`
                @media (min-width: 769px) {
                    .jp-admin-sidebar {
                        transform: translateX(0) !important;
                    }
                }
                @media (max-width: 768px) {
                    .mobile-only-close {
                        display: flex !important;
                    }
                    .jp-sidebar-backdrop {
                        display: block !important;
                    }
                    .sidebar-header-text {
                        display: none !important;
                    }
                    .mobile-only-logo {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminSidebar;
