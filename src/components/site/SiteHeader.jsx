import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Button, IconButton, ThemeToggle } from '@/design-system';
import { HEADER_CTA, PRIMARY_NAV } from '@/config/navigation';
import BrandMark from './BrandMark';
import './site.css';

/** True when `item` is the active route (mirrors NavLink's matching). */
function isActive(pathname, item) {
  if (item.end) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

/**
 * SiteHeader — floating glass navigation bar shared by every public page.
 * Animated active pill, scroll-progress line and animated mobile menu.
 */
export default function SiteHeader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const highlighted = hovered ?? PRIMARY_NAV.find((item) => isActive(pathname, item))?.to;

  return (
    <header className={clsx('site-header', scrolled && 'is-scrolled')}>
      <motion.span className="site-header__progress" style={{ scaleX: progress }} aria-hidden="true" />

      <div className="ds-container">
        <div className="site-header__bar">
          <BrandMark onClick={closeMenu} />

          <nav className="site-nav" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive: active }) => clsx('site-nav__link', active && 'is-active')}
                onMouseEnter={() => setHovered(item.to)}
              >
                {highlighted === item.to && (
                  <motion.span
                    layoutId="site-nav-pill"
                    className="site-nav__pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="site-nav__label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <ThemeToggle />
            <Button to={HEADER_CTA.to} size="sm" iconEnd={<ArrowRight size={14} />} className="site-header__cta">
              {HEADER_CTA.label}
            </Button>
            <IconButton
              className="site-header__menu-btn"
              label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="site-mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </IconButton>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="site-mobile-nav"
            className="site-mobile-nav"
            aria-label="Primary mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="ds-container">
              {[...PRIMARY_NAV, HEADER_CTA].map((item, i) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive: active }) => clsx('site-mobile-nav__link', active && 'is-active')}
                    onClick={closeMenu}
                  >
                    {item.label}
                    <ArrowRight size={18} aria-hidden="true" />
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
