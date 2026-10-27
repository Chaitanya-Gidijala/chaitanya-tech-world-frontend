import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Heart, Sparkles, ArrowRight, Map, GitBranch, UserRound } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import './LandingNavbar.css';

const LandingNavbar = ({ theme, onToggleTheme }) => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

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
        { label: 'Explore', action: () => scrollTo('explore') },
        { label: 'Roadmaps', to: '/roadmap' },
        { label: 'Prompts', to: '/prompts' },
        { label: 'Contact', to: '/contact' },
    ];

    return (
        <>
            <Motion.nav
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

                        <Link to="/portfolio" className="ln__cta">
                            View Portfolio <ArrowRight size={14} />
                        </Link>

                        <button className="ln__burger" onClick={() => setMobileOpen(true)} aria-label="Menu">
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </Motion.nav>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <Motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ln-overlay"
                        onClick={close}
                    >
                        <Motion.aside
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
                                {/* Navigate */}
                                <span className="ln-drawer__label">Navigate</span>
                                {navItems.map((item) => {
                                    const isActive = item.to ? location.pathname === item.to : false;
                                    return item.to ? (
                                        <Link key={item.label} className={`ln-drawer__item ${isActive ? 'active' : ''}`} to={item.to} onClick={close}>
                                            <span>{item.label}</span>
                                        </Link>
                                    ) : (
                                        <button key={item.label} className="ln-drawer__item" onClick={item.action}>
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}

                                <div className="ln-drawer__divider" />

                                <span className="ln-drawer__label">Quick Access</span>
                                {[
                                    { label: 'Portfolio', to: '/portfolio', Icon: UserRound },
                                    { label: 'Traceflow', to: '/traceflow', Icon: GitBranch },
                                    { label: 'Learning Roadmaps', to: '/roadmap', Icon: Map },
                                    { label: 'Prompts Gallery', to: '/prompts', Icon: Sparkles },
                                ].map((link) => {
                                    const isActive = location.pathname.startsWith(link.to);

                                    return (
                                        <Link key={link.label} className={`ln-drawer__item ${isActive ? 'active' : ''}`} to={link.to} onClick={close}>
                                            <link.Icon size={15} />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}

                                <div className="ln-drawer__divider" />

                                <button className="ln-drawer__item" onClick={onToggleTheme}>
                                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>

                            </div>

                            <div className="ln-drawer__foot">
                                <Heart size={9} fill="currentColor" /> By Chaitanya Gidijala
                            </div>
                        </Motion.aside>
                    </Motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
