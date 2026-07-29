import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, Cpu, ArrowLeft } from 'lucide-react';
import CommandSearch from './CommandSearch.jsx';
import './Navbar.css';

export default function Navbar({ theme, toggleTheme }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Ctrl/Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLinks = [
    { to: '/traceflow', label: 'Home' },
    { to: '/traceflow/catalogue', label: 'Algorithms' },
    { to: '/traceflow/roadmap', label: 'Roadmap' },
  ];

  const isActive = (to) => location.pathname === to || (to !== '/traceflow' && location.pathname.startsWith(to));

  return (
    <>
      <header className={`tf-navbar ${scrolled ? 'tf-navbar--scrolled' : ''}`}>
        <div className="tf-container tf-navbar__inner">
          {/* Logo */}
          <Link to="/traceflow" className="tf-navbar__logo">
            <div className="tf-logo-mark">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="4" cy="11" r="2.5" fill="currentColor" opacity="0.4"/>
                <circle cx="11" cy="4" r="2.5" fill="currentColor"/>
                <circle cx="18" cy="11" r="2.5" fill="currentColor" opacity="0.6"/>
                <circle cx="11" cy="18" r="2.5" fill="currentColor" opacity="0.8"/>
                <line x1="4" y1="11" x2="11" y2="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                <line x1="11" y1="4" x2="18" y2="11" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="18" y1="11" x2="11" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
              </svg>
            </div>
            <span className="tf-logo-name">Traceflow</span>
            <span className="tf-logo-tag">DSA</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="tf-navbar__links">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`tf-navbar__link ${isActive(to) ? 'tf-navbar__link--active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="tf-navbar__actions">
            <button
              className="tf-btn tf-btn--ghost tf-search-trigger"
              onClick={() => setSearchOpen(true)}
              title="Search (Ctrl+K)"
            >
              <Search size={15} />
              <span className="tf-search-trigger__text">Search…</span>
              <kbd>⌘K</kbd>
            </button>

            <button
              className="tf-btn tf-btn--icon tf-btn--ghost"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              className="tf-btn tf-btn--icon tf-btn--ghost tf-mobile-toggle"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="tf-mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
          <div className="tf-mobile-nav">
            <nav className="tf-mobile-nav__links">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`tf-mobile-nav__link ${isActive(to) ? 'tf-mobile-nav__link--active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="tf-mobile-nav__footer">
            <button className="tf-btn tf-btn--secondary" style={{width:'100%'}} onClick={() => { setSearchOpen(true); setMobileOpen(false); }}>
              <Search size={14} /> Search algorithms
            </button>
          </div>
          </div>
        </>
      )}

      <CommandSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
