import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sun, Moon, Menu, X, Camera, Briefcase, Wallet, Globe, Map, Brain, Mail, FileText, Users, LogIn, Heart, BookOpen, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated, logout, getCurrentUser } from '@/features/job-portal/services/authService';
import Logo from './Logo';
import './AppHeader.css';

const AppHeader = ({ theme, onToggleTheme }) => {
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const loggedIn = isAuthenticated();
    const user = loggedIn ? getCurrentUser() : null;

    // initials for avatar
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    // Lock body scroll when menu is open
    React.useEffect(() => {
        const body = document.body;
        if (isMobileMenuOpen) {
            body.style.overflow = 'hidden';
            body.style.height = '100vh';
        } else {
            body.style.overflow = 'unset';
            body.style.height = 'auto';
        }
        return () => {
            body.style.overflow = 'unset';
            body.style.height = 'auto';
        };
    }, [isMobileMenuOpen]);

    const apps = [
        { name: 'Our Services', path: '/services', Icon: Camera },
        { name: 'Prompts Gallery', path: '/prompts', Icon: Sparkles },
        { name: 'Roadmap', path: '/roadmap', Icon: Map },
        { name: 'Job Portal', path: '/job-portal', Icon: Briefcase },
        { name: 'Prep Hub', path: '/job-portal/prep', Icon: Brain },
        { name: 'AI Resume Builder', path: '/ai-resume-builder', Icon: FileText },
    ];

    const prepLinks = [
        { name: 'Preparation Hub', path: '/job-portal/prep', Icon: Brain, exact: true },
        { name: 'Mock Tests', path: '/job-portal/prep/tests', Icon: Target },
        { name: 'Interview Questions', path: '/job-portal/prep/questions', Icon: BookOpen },
        { name: 'Learning Resources', path: '/job-portal/prep/resources', Icon: FileText },
    ];

    if (isLanding) return null;

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="app-header"
            >
                <div className="header-inner-wrap">
                    <div className="header-left">
                        <Link to="/" className="brand-link" style={{ textDecoration: 'none' }}>
                            <h1 className="brand-heading">Chaitanya Tech World</h1>
                        </Link>
                    </div>

                    <div className="header-right">
                        <button onClick={onToggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="menu-toggle-btn" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="icon-main" />
                        </button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="side-nav-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileMenu}
                        className="side-nav-overlay"
                    >
                        <motion.aside
                            key="side-nav-menu"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
                            className="side-nav-menu"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="side-nav-header">
                                <Link to="/" className="side-nav-title" onClick={closeMobileMenu}>Chaitanya Tech World</Link>
                                <button className="side-nav-close" onClick={closeMobileMenu}><X size={18} /></button>
                            </div>

                            <div className="side-nav-content">
                                {loggedIn ? (
                                    <div className="side-nav-user-banner">
                                        <div className="user-avatar-initials">{initials}</div>
                                        <div className="user-info-text">
                                            <strong>{user?.name || 'User'}</strong>
                                            <small>{user?.email || ''}</small>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="side-nav-auth-grid">
                                        <Link to="/login" className="side-nav-auth-btn" onClick={closeMobileMenu}>Log In</Link>
                                        <Link to="/signup" className="side-nav-auth-btn fill" onClick={closeMobileMenu}>Sign Up</Link>
                                    </div>
                                )}

                                <div className="side-nav-divider" />

                                <span className="side-nav-label">Navigate</span>
                                <Link to="/" className={`side-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
                                    <span>Home Page</span>
                                </Link>
                                <Link to="/contact" className={`side-nav-item ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>
                                    <span>Contact Me</span>
                                </Link>
                                <button className="side-nav-item" onClick={() => { onToggleTheme(); closeMobileMenu(); }}>
                                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>

                                <div className="side-nav-divider" />

                                <span className="side-nav-label">Applications</span>
                                {apps.map((app) => {
                                    const isActive = app.path === '/job-portal' 
                                        ? (location.pathname === '/job-portal' || (location.pathname.startsWith('/job-portal') && !location.pathname.startsWith('/job-portal/prep')))
                                        : location.pathname.startsWith(app.path);
                                    
                                    return (
                                        <Link key={app.path} to={app.path} className={`side-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                                            <app.Icon size={15} />
                                            <span>{app.name}</span>
                                        </Link>
                                    );
                                })}

                                <div className="side-nav-divider" />

                                <span className="side-nav-label">Prep Hub</span>
                                {prepLinks.map((link) => {
                                    const isActive = link.exact
                                        ? location.pathname === link.path
                                        : location.pathname.startsWith(link.path);

                                    return (
                                        <Link key={link.path} to={link.path} className={`side-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                                            <link.Icon size={15} />
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}

                                {loggedIn && (
                                    <>
                                        <div className="side-nav-divider" />
                                        <span className="side-nav-label">Settings</span>
                                        <Link to="/profile" className="side-nav-item" onClick={closeMobileMenu}>
                                            <Users size={15} /><span>My Profile</span>
                                        </Link>
                                        <button className="side-nav-item sign-out" onClick={() => { logout(); closeMobileMenu(); window.location.reload(); }}>
                                            <LogIn size={15} /><span>Sign Out</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="side-nav-footer">
                                <Heart size={9} fill="currentColor" /> By Chaitanya Gidijala
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AppHeader;
