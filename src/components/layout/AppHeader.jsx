import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Map, Heart, Sparkles, UserRound, GitBranch } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import './AppHeader.css';

const AppHeader = ({ theme, onToggleTheme }) => {
    const location = useLocation();
    const isLanding = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    

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
        { name: 'My Portfolio', path: '/portfolio', Icon: UserRound },
        { name: 'Traceflow', path: '/traceflow', Icon: GitBranch },
        { name: 'Prompts Gallery', path: '/prompts', Icon: Sparkles },
        { name: 'Learning Roadmaps', path: '/roadmap', Icon: Map },
    ];

    if (isLanding) return null;

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <Motion.header
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
            </Motion.header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <Motion.div
                        key="side-nav-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileMenu}
                        className="side-nav-overlay"
                    >
                        <Motion.aside
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
                                    const isActive = location.pathname.startsWith(app.path);
                                    
                                    return (
                                        <Link key={app.path} to={app.path} className={`side-nav-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                                            <app.Icon size={15} />
                                            <span>{app.name}</span>
                                        </Link>
                                    );
                                })}

                            </div>

                            <div className="side-nav-footer">
                                <Heart size={9} fill="currentColor" /> By Chaitanya Gidijala
                            </div>
                        </Motion.aside>
                    </Motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AppHeader;
