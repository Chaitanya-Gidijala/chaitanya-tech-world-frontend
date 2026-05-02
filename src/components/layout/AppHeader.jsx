import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sun, Moon, Menu, X, Camera, Briefcase, Wallet, Globe, Map, Brain, Mail, FileText, Users, LogIn, Heart, BookOpen, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated, logout } from '@/features/job-portal/services/authService';
import Logo from './Logo';
import './AppHeader.css';

const AppHeader = ({ theme, onToggleTheme }) => {
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

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

    // Get app name based on route
    const getAppName = () => {
        if (location.pathname.startsWith('/services') || location.pathname.startsWith('/our-services')) return 'Our Services';
        if (location.pathname.startsWith('/job-portal')) return 'Job Portal';
        if (location.pathname.startsWith('/ai-resume-builder')) return 'AI Resume Builder';
        if (location.pathname === '/contact') return 'Contact';
        return 'Chaitanya Tech World';
    };

    const apps = [
        { name: 'Our Services', path: '/services', Icon: Camera },
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

    if (isLanding) return null; // Don't show header on landing page

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="app-header"
            >
                {/* ── Main Header Row ── */}
                <div className="header-inner-wrap">

                    {/* LEFT: Consistent Brand Heading */}
                    <div className="header-left">
                        <Link to="/" className="brand-link" style={{ textDecoration: 'none' }}>
                            <h1 className="brand-heading">
                                Chaitanya Tech World
                            </h1>
                        </Link>
                    </div>



                    {/* RIGHT: Theme Toggle + Side Menu Button */}
                    <div className="header-right">
                        <button
                            onClick={onToggleTheme}
                            className="theme-toggle"
                            aria-label="Toggle Theme"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button
                            className="menu-toggle-btn"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="icon-main" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* ── Side Navigation Overlay ── */}
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
                        <motion.div
                            key="side-nav-menu"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="side-nav-menu"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="side-nav-header">
                                {/* Close Button Top Left */}
                                <button className="side-nav-close" onClick={closeMobileMenu} aria-label="Close menu">
                                    <X className="icon-close" />
                                </button>
                                <h1 className="side-nav-title">Chaitanya Tech World</h1>
                            </div>

                            <div className="side-nav-content">
                                <div className="side-nav-section">
                                    <h3 className="section-label">Main Menu</h3>
                                    <Link to="/" className="side-nav-item" onClick={closeMobileMenu}>
                                        <div className="item-icon-new"><Home size={17} /></div>
                                        <span>Home Page</span>
                                    </Link>
                                    <button className="side-nav-item" onClick={onToggleTheme}>
                                        <div className="item-icon-new">
                                            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                                        </div>
                                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                    </button>
                                    <Link
                                        to="/contact"
                                        className={`side-nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
                                        onClick={closeMobileMenu}
                                    >
                                        <div className="item-icon-new"><Mail size={17} /></div>
                                        <span>Contact Me</span>
                                    </Link>
                                </div>

                                <div className="side-nav-section">
                                    <h3 className="section-label">Account</h3>
                                    {!isAuthenticated() ? (
                                        <>
                                            <Link to="/login" className="side-nav-item" onClick={closeMobileMenu}>
                                                <div className="item-icon-new"><Users size={17} /></div>
                                                <span>Login</span>
                                            </Link>
                                            <Link to="/signup" className="side-nav-item" onClick={closeMobileMenu}>
                                                <div className="item-icon-new"><LogIn size={17} /></div>
                                                <span>Sign Up Free</span>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/profile" className="side-nav-item" onClick={closeMobileMenu}>
                                                <div className="item-icon-new"><Users size={17} /></div>
                                                <span>My Profile</span>
                                            </Link>
                                            <button 
                                                className="side-nav-item" 
                                                onClick={() => { logout(); closeMobileMenu(); window.location.reload(); }}
                                            >
                                                <div className="item-icon-new"><LogIn size={17} /></div>
                                                <span>Sign Out</span>
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="side-nav-section">
                                    <h3 className="section-label">Our Applications</h3>
                                    <div className="side-nav-list">
                                        {apps.map((app) => {
                                            const isActive = app.path === '/job-portal' 
                                                ? (location.pathname === '/job-portal' || (location.pathname.startsWith('/job-portal') && !location.pathname.startsWith('/job-portal/prep')))
                                                : location.pathname.startsWith(app.path);
                                                
                                            return (
                                                <Link
                                                    key={app.path}
                                                    to={app.path}
                                                    className={`side-nav-item ${isActive ? 'active' : ''}`}
                                                    onClick={closeMobileMenu}
                                                >
                                                    <div className="item-icon-new"><app.Icon size={17} /></div>
                                                    <span>{app.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="side-nav-section">
                                    <h3 className="section-label">Prep Hub</h3>
                                    <div className="side-nav-list">
                                        {prepLinks.map((link) => {
                                            const isActive = link.exact
                                                ? location.pathname === link.path
                                                : location.pathname.startsWith(link.path);

                                            return (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    className={`side-nav-item ${isActive ? 'active' : ''}`}
                                                    onClick={closeMobileMenu}
                                                >
                                                    <div className="item-icon-new"><link.Icon size={17} /></div>
                                                    <span>{link.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="side-nav-footer">
                                <span className="footer-version">
                                    By Chaitanya Gidijala <Heart size={10} fill="currentColor" style={{ marginLeft: '4px', display: 'inline' }} />
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AppHeader;
