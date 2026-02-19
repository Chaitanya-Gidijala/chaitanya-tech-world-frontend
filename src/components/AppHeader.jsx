import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sun, Moon, Menu, X } from 'lucide-react';
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
        return 'Chaitanya Tech World';
    };

    const apps = [
        { name: 'Photo Editor', path: '/photo-editor' },
        // { name: 'Split Expenses', path: '/split-expenses' },
        // { name: 'Time Zone', path: '/time-zone-converter' },
        // { name: 'Trip Planner', path: '/trip-planner' },
        // { name: 'Habits', path: '/habit-productivity' },
        { name: 'Jobs', path: '/job-portal' },
        { name: 'Prep Hub', path: '/job-portal/prep' }
    ];

    if (isLanding) return null; // Don't show header on landing page

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="glass-panel app-header"
            style={{
                position: 'relative',
                zIndex: 100,
                marginBottom: 0
            }}
        >
            <div className="header-content">
                {/* Left: App Title Only on Mobile, Home + Title on Desktop */}
                <div className="header-left">
                    <Link
                        to="/"
                        className="home-link desktop-only"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <Home size={20} />
                        <span className="home-text">Home</span>
                    </Link>

                    <div className="header-divider desktop-only" />

                    <div className="mobile-only-brand">
                        <Logo size="medium" />
                    </div>

                    <h1 className="app-title">
                        {getAppName()}
                    </h1>
                </div>

                {/* Center: Desktop Navigation */}
                <nav className="desktop-nav">
                    {apps.map((app) => (
                        <Link
                            key={app.path}
                            to={app.path}
                            className={`nav-link ${location.pathname.startsWith(app.path) ? 'active' : ''}`}
                        >
                            {app.name}
                        </Link>
                    ))}
                </nav>

                {/* Right: Theme toggle (Desktop) & Mobile Menu Button */}
                <div className="header-right">
                    <button
                        onClick={onToggleTheme}
                        className="theme-toggle desktop-only"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                    </button>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mobile-nav"
                    >
                        {/* Mobile Menu Items: Home, Apps, Theme Toggle */}

                        <div className="mobile-nav-top-controls">
                            <Link
                                to="/"
                                className="mobile-nav-link special-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Home size={18} /> Home
                            </Link>

                            <button
                                onClick={() => {
                                    onToggleTheme();
                                    // Don't close menu to allow seeing the change
                                }}
                                className="mobile-nav-link special-link"
                                style={{ border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                {theme === 'dark' ? ' Light Mode' : ' Dark Mode'}
                            </button>
                        </div>

                        <div className="mobile-nav-divider" />

                        {apps.map((app) => (
                            <Link
                                key={app.path}
                                to={app.path}
                                className={`mobile-nav-link ${location.pathname.startsWith(app.path) ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {app.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default AppHeader;
