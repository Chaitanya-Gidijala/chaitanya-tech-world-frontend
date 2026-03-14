import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, List, Settings, BarChart3, Menu, X, Globe, HelpCircle, Book, ClipboardCheck, Hash, Home, Moon, Sun, Monitor } from 'lucide-react';
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

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Initialize theme from document element
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setIsDark(currentTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark ? 'dark' : 'light';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('jp-theme', newTheme);
    };

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
                            fontSize: '1.4rem',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                            color: 'var(--jp-text-main)',
                            marginBottom: '0.25rem'
                        }}>
                            Admin<span style={{ color: 'var(--jp-primary)' }}>Portal</span>
                        </h2>
                        <p style={{
                            fontSize: '0.8rem',
                            color: 'var(--jp-text-muted)',
                            margin: 0,
                            fontWeight: 500
                        }}>
                            Job Portal Management
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav style={{
                    flex: 1,
                    padding: '1rem 0',
                    overflowY: 'auto'
                }}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                whileHover={{ x: isActive ? 0 : 4 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: 'calc(100% - 1.5rem)',
                                    margin: '0.25rem 0.75rem',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: isActive
                                        ? 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))'
                                        : 'transparent',
                                    border: 'none',
                                    color: isActive ? 'white' : 'var(--jp-text-main)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.95rem',
                                    fontWeight: isActive ? 600 : 500,
                                    textAlign: 'left',
                                    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                                }}
                            >
                                <Icon size={20} style={{ color: isActive ? 'white' : 'var(--jp-text-muted)', transition: 'color 0.2s ease' }} />
                                <span>{tab.label}</span>
                            </motion.button>
                        );
                    })}

                    <div style={{ margin: '1rem 1.5rem', height: '1px', background: 'var(--jp-border)' }} />

                    {/* Quick Access Links */}
                    <div style={{ padding: '0 0.5rem' }}>
                        <p style={{
                            padding: '0 1.25rem',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontWeight: 800,
                            color: 'var(--jp-text-muted)',
                            marginBottom: '0.5rem'
                        }}>
                            Quick Access
                        </p>
                        
                        <motion.button
                            onClick={() => navigate('/job-portal')}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--jp-text-main)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            <Monitor size={18} style={{ color: 'var(--jp-primary)' }} />
                            <span>Job Portal App</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => navigate('/')}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--jp-text-main)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            <Home size={18} style={{ color: '#10b981' }} />
                            <span>Main Home Page</span>
                        </motion.button>

                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: 'calc(100% - 2rem)',
                                margin: '0.5rem 1rem',
                                padding: '0.8rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'var(--jp-bg-secondary)',
                                border: '1px solid var(--jp-border)',
                                borderRadius: '12px',
                                color: 'var(--jp-text-main)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {isDark ? <Moon size={18} style={{ color: '#818cf8' }} /> : <Sun size={18} style={{ color: '#f59e0b' }} />}
                                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                            </div>
                            
                            {/* Toggle Switch UI */}
                            <div style={{
                                width: '36px', height: '20px', borderRadius: '10px', background: isDark ? 'var(--jp-primary)' : 'var(--jp-border)',
                                position: 'relative', transition: 'background 0.3s'
                            }}>
                                <div style={{
                                    width: '14px', height: '14px', borderRadius: '50%', background: 'white',
                                    position: 'absolute', top: '3px', left: isDark ? '19px' : '3px', transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} />
                            </div>
                        </motion.button>
                    </div>
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
