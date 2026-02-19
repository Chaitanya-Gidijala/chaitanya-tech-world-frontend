import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sun, Moon, Menu, X, Camera, Briefcase, BookOpen, Wallet, Globe, Map, Brain, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import './AppHeader.css';

const AppHeader = ({ theme, onToggleTheme }) => {
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get app name based on route
    const getAppName = () => {
        if (location.pathname.startsWith('/photo-editor')) return 'Photo Editor';
        if (location.pathname.startsWith('/split-expenses')) return 'Split Expenses';
        if (location.pathname.startsWith('/time-zone-converter')) return 'Time Zone Converter';
        if (location.pathname.startsWith('/trip-planner')) return 'Trip Planner';
        if (location.pathname.startsWith('/habit-productivity')) return 'Habit Hub';
        if (location.pathname.startsWith('/job-portal')) return 'Job Portal';
        if (location.pathname === '/contact') return 'Contact';
        return 'Chaitanya Tech World';
    };

    const apps = [
        { name: 'Photo Editor', path: '/photo-editor', Icon: Camera },
        { name: 'Split Expenses', path: '/split-expenses', Icon: Wallet },
        { name: 'Time Zone', path: '/time-zone-converter', Icon: Globe },
        { name: 'Trip Planner', path: '/trip-planner', Icon: Map },
        { name: 'Habit Hub', path: '/habit-productivity', Icon: Brain },
        { name: 'Job Portal', path: '/job-portal', Icon: Briefcase },
        { name: 'Prep Hub', path: '/job-portal/prep', Icon: BookOpen },
    ];

    if (isLanding) return null; // Don't show header on landing page

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
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
                    <h1 className="brand-heading">
                        Chaitanya Tech World
                    </h1>
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
                                        <div className="item-icon-new"><Home size={20} /></div>
                                        <span>Home Page</span>
                                    </Link>
                                    <button className="side-nav-item" onClick={onToggleTheme}>
                                        <div className="item-icon-new">
                                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                        </div>
                                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                    </button>
                                    <Link
                                        to="/contact"
                                        className={`side-nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
                                        onClick={closeMobileMenu}
                                    >
                                        <div className="item-icon-new"><Mail size={20} /></div>
                                        <span>Contact Me</span>
                                    </Link>
                                </div>

                                <div className="side-nav-section">
                                    <h3 className="section-label">Our Applications</h3>
                                    <div className="side-nav-list">
                                        {apps.map((app) => (
                                            <Link
                                                key={app.path}
                                                to={app.path}
                                                className={`side-nav-item ${location.pathname.startsWith(app.path) ? 'active' : ''}`}
                                                onClick={closeMobileMenu}
                                            >
                                                <div className="item-icon-new"><app.Icon size={20} /></div>
                                                <span>{app.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="side-nav-footer">
                                <span className="footer-version">v2.0.4 Premium</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default AppHeader;
