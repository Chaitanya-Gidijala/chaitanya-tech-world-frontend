import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sun, Moon, Menu, X, Home, Heart, Mail, Brain, Briefcase,
    FileText, Sparkles, ArrowRight, Users, LogIn, User, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated, getCurrentUser, logout } from '@/features/job-portal/services/authService';
import './LandingNavbar.css';

const LandingNavbar = ({ theme, onToggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const loggedIn = isAuthenticated();
    const user = loggedIn ? getCurrentUser() : null;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const close = () => setMobileOpen(false);

    const scrollTo = (id) => {
        close();
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const navItems = [
        { label: 'Home', action: () => scrollTo('hero') },
        { label: 'Apps', action: () => scrollTo('apps-grid') },
        { label: 'Prep Hub', action: () => scrollTo('prep-hub') },
        { label: 'Contact', to: '/contact' },
    ];

    /* User initials for avatar */
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`ln ${scrolled ? 'ln--solid' : ''}`}
            >
                <div className="ln__inner">
                    {/* Brand */}
                    <Link 
                        to="/" 
                        className="ln__brand"
                        onClick={(e) => {
                            if (window.location.pathname === '/') {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <span className="ln__brand-txt">Chaitanya Tech World</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="ln__nav">
                        {navItems.map((item) =>
                            item.to ? (
                                <Link key={item.label} to={item.to} className="ln__nav-link">{item.label}</Link>
                            ) : (
                                <button key={item.label} className="ln__nav-link" onClick={item.action}>{item.label}</button>
                            )
                        )}
                    </div>

                    {/* Right controls */}
                    <div className="ln__right">
                        <button className="ln__icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        {loggedIn ? (
                            <Link to="/profile" className="ln__avatar" title={user?.name || 'Profile'}>
                                {initials}
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="ln__login-link">Log In</Link>
                                <Link to="/signup" className="ln__cta">
                                    Get Started <ArrowRight size={14} />
                                </Link>
                            </>
                        )}

                        <button className="ln__burger" onClick={() => setMobileOpen(true)} aria-label="Menu">
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ln-overlay"
                        onClick={close}
                    >
                        <motion.aside
                            key="drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
                            className="ln-drawer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="ln-drawer__head">
                                <Link to="/" className="ln-drawer__title" onClick={close}>Chaitanya Tech World</Link>
                                <button className="ln-drawer__x" onClick={close}><X size={18} /></button>
                            </div>

                            <div className="ln-drawer__body">
                                {/* User banner */}
                                {loggedIn ? (
                                    <div className="ln-drawer__user">
                                        <div className="ln__avatar ln__avatar--lg">{initials}</div>
                                        <div>
                                            <strong>{user?.name || 'User'}</strong>
                                            <small>{user?.email || ''}</small>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ln-drawer__auth-btns">
                                        <Link to="/login" className="ln-drawer__auth-btn" onClick={close}>Log In</Link>
                                        <Link to="/signup" className="ln-drawer__auth-btn ln-drawer__auth-btn--fill" onClick={close}>Sign Up Free</Link>
                                    </div>
                                )}

                                <div className="ln-drawer__divider" />

                                {/* Navigate */}
                                <span className="ln-drawer__label">Navigate</span>
                                {navItems.map((item) =>
                                    item.to ? (
                                        <Link key={item.label} className="ln-drawer__item" to={item.to} onClick={close}>
                                            <span>{item.label}</span>
                                        </Link>
                                    ) : (
                                        <button key={item.label} className="ln-drawer__item" onClick={item.action}>
                                            <span>{item.label}</span>
                                        </button>
                                    )
                                )}

                                <div className="ln-drawer__divider" />

                                <span className="ln-drawer__label">Quick Access</span>
                                {[
                                    { label: 'Job Portal', to: '/job-portal', Icon: Briefcase },
                                    { label: 'Prep Hub', to: '/job-portal/prep', Icon: Brain },
                                    { label: 'AI Resume Builder', to: '/ai-resume-builder', Icon: FileText },
                                ].map((link) => (
                                    <Link key={link.label} className="ln-drawer__item" to={link.to} onClick={close}>
                                        <link.Icon size={15} />
                                        <span>{link.label}</span>
                                    </Link>
                                ))}

                                <div className="ln-drawer__divider" />

                                <button className="ln-drawer__item" onClick={onToggleTheme}>
                                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>

                                {loggedIn && (
                                    <>
                                        <Link to="/profile" className="ln-drawer__item" onClick={close}>
                                            <User size={15} /><span>My Profile</span>
                                        </Link>
                                        <button className="ln-drawer__item" onClick={() => { logout(); close(); window.location.reload(); }}>
                                            <LogIn size={15} /><span>Sign Out</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="ln-drawer__foot">
                                <Heart size={9} fill="currentColor" /> By Chaitanya Gidijala
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
