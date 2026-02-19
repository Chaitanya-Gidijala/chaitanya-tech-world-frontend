import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Search, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react';

const AdminHeader = ({ user, onLogout, sidebarOpen, onToggleSidebar }) => {
    return (
        <header style={{
            height: '70px',
            background: 'var(--jp-card-bg)',
            borderBottom: '1px solid var(--jp-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            flexWrap: 'nowrap',
            overflow: 'hidden'
        }}>
            {/* Left Section: Mobile Menu & Search */}
            <div className="header-left-group" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <motion.button
                    className="mobile-menu-toggle"
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleSidebar}
                    style={{
                        padding: '0.6rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'var(--jp-bg-secondary)',
                        color: 'var(--jp-text-main)',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.button>

                {/* Navbar Branding - Visible primarily on mobile or when sidebar is closed */}
                <div className="navbar-branding" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.4rem', background: 'var(--jp-bg-secondary)', borderRadius: '8px', display: 'flex' }}>
                        <img src="/CTW.svg" alt="Logo" style={{ width: '24px', height: '24px' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--jp-text-main)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                        FindSharp <span style={{ color: 'var(--jp-primary)', fontSize: '0.8rem', fontWeight: 600, verticalAlign: 'middle', marginLeft: '2px', opacity: 0.8 }}>ADMIN</span>
                    </span>
                </div>

                <div className="header-search-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="header-search-input"
                            style={{
                                padding: '0.6rem 1rem 0.6rem 2.8rem',
                                borderRadius: '10px',
                                border: '1px solid var(--jp-border)',
                                background: 'var(--jp-bg-secondary)',
                                color: 'var(--jp-text-main)',
                                fontSize: '0.9rem',
                                width: '250px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="header-icons-group" style={{ display: 'flex', gap: '0.75rem' }}>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--jp-text-muted)', cursor: 'pointer' }}>
                        <Bell size={20} />
                    </motion.button>
                    <motion.button className="desktop-only" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--jp-text-muted)', cursor: 'pointer' }}>
                        <HelpCircle size={20} />
                    </motion.button>
                </div>

                <div className="header-divider" style={{ height: '24px', width: '1px', background: 'var(--jp-border)' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="header-user-info" style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jp-text-main)', margin: 0 }}>Admin</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--jp-text-muted)', fontWeight: 600 }}>ONLINE</span>
                        </div>
                    </div>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                    }}>
                        <User size={18} />
                    </div>
                    <motion.button
                        onClick={onLogout}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            marginLeft: '0.25rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#ef4444',
                            cursor: 'pointer'
                        }}
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </motion.button>
                </div>
            </div>

            <style>{`
                @media (min-width: 769px) {
                    .navbar-branding {
                        display: ${sidebarOpen ? 'none' : 'flex'} !important;
                    }
                }
                @media (max-width: 992px) {
                    .header-search-input { width: 180px !important; }
                }
                @media (max-width: 768px) {
                    header {
                        margin-left: 0 !important;
                        padding: 0 0.75rem !important;
                        height: 60px !important;
                    }
                    .mobile-menu-toggle {
                        display: flex !important;
                        padding: 0.5rem !important;
                    }
                    .header-search-container {
                        display: none !important;
                    }
                    .navbar-branding {
                        display: flex !important;
                        gap: 0.4rem !important;
                        flex: 1;
                        justify-content: center;
                    }
                    .navbar-branding span {
                        font-size: 0.95rem !important;
                    }
                    .navbar-branding span span {
                        display: none; /* Hide 'ADMIN' text on very small screens to save space */
                    }
                    .header-left-group {
                        gap: 0.5rem !important;
                        flex: 1;
                    }
                    .header-icons-group {
                        gap: 0.4rem !important;
                    }
                    .header-divider {
                        display: none !important;
                    }
                }
                @media (max-width: 480px) {
                    .header-user-info, .desktop-only {
                        display: none !important;
                    }
                    .navbar-branding {
                        justify-content: flex-start !important;
                        margin-left: 0.25rem;
                    }
                    header {
                        gap: 0.5rem !important;
                    }
                }
            `}</style>
        </header>
    );
};

export default AdminHeader;
