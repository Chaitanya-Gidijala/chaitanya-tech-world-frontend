import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './RoadmapNavbar.css';

/* ── Icons ── */
const SunIcon = () => (
  <svg className="rmnav__theme-icon" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg className="rmnav__theme-icon" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ── Nav link definitions ── */
const NAV_LINKS = [
  { label: 'Home',         href: '/',                             icon: '🏠', exact: true },
  { label: 'Roadmaps',    href: '/roadmap',                       icon: '🗺️', exact: true },
  { label: 'Claude Certs',href: '/roadmap/certifications/claude', icon: '🤖', badge: 'New' },
  { label: 'TraceFlow',   href: '/traceflow',                     icon: '🔍', exact: true },
  { label: 'AI Prompts',  href: '/prompts',                       icon: '💬', exact: true },
];

/* ── Utility: is link active? ── */
function isActive(href, exact, pathname) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

/* ══════════════════════════════════════════
   ROADMAP NAVBAR COMPONENT
   ══════════════════════════════════════════ */
export default function RoadmapNavbar({ theme, toggleTheme, showCTA = false }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* Close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.rmnav') && !e.target.closest('.rmnav__drawer')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when menu open on mobile */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`rmnav ${scrolled ? 'rmnav--scrolled' : ''}`} role="navigation" aria-label="Roadmap navigation">
        <div className="rmnav__inner">

          {/* ── Brand ── */}
          <Link to="/" className="rmnav__brand" onClick={() => setMenuOpen(false)}>
            <div className="rmnav__brand-icon" aria-hidden="true">✦</div>
            <div>
              <span className="rmnav__brand-text">Chaitanya</span>
              <span className="rmnav__brand-sub">Tech World</span>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="rmnav__links" role="list">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`rmnav__link ${isActive(link.href, link.exact, location.pathname) ? 'active' : ''}`}
                role="listitem"
              >
                {link.label}
                {link.badge && <span className="rmnav__badge">{link.badge}</span>}
              </Link>
            ))}
          </div>

          {/* ── Actions ── */}
          <div className="rmnav__actions">
            {/* Theme toggle */}
            <button
              className="rmnav__theme-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Register CTA — only on cert pages */}
            {showCTA && (
              <a
                href="https://www.anthropic.com/claude-certification"
                target="_blank"
                rel="noopener noreferrer"
                className="rmnav__cta"
                aria-label="Register for Claude Certification"
              >
                Register →
              </a>
            )}

            {/* Hamburger */}
            <button
              className={`rmnav__burger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="rmnav-drawer"
            >
              <span className="rmnav__burger-line" />
              <span className="rmnav__burger-line" />
              <span className="rmnav__burger-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div
        className={`rmnav__drawer ${menuOpen ? 'open' : ''}`}
        id="rmnav-drawer"
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="rmnav__drawer-inner">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`rmnav__drawer-link ${isActive(link.href, link.exact, location.pathname) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="rmnav__drawer-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
              {link.badge && <span className="rmnav__badge" style={{ marginLeft: 'auto' }}>{link.badge}</span>}
            </Link>
          ))}

          {showCTA && (
            <>
              <div className="rmnav__drawer-divider" />
              <div className="rmnav__drawer-actions">
                <a
                  href="https://www.anthropic.com/claude-certification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rmnav__cta"
                  onClick={() => setMenuOpen(false)}
                >
                  Register for Certification →
                </a>
              </div>
            </>
          )}

          <div className="rmnav__drawer-divider" />
          <div className="rmnav__drawer-actions">
            <button
              className="rmnav__theme-btn"
              onClick={() => { toggleTheme(); setMenuOpen(false); }}
              aria-label="Toggle theme"
              style={{ width: 'auto', padding: '8px 16px', gap: '8px', display: 'flex', borderRadius: '9px' }}
            >
              {theme === 'dark' ? <><SunIcon /> Light Mode</> : <><MoonIcon /> Dark Mode</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
