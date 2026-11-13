import { useEffect, useState } from 'react';
import clsx from 'clsx';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { NAV_SECTIONS, PROFILE } from '../data/portfolioContent';
import { PfButton } from './ui';

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

export default function PortfolioHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={clsx('pf-header', scrolled && 'is-scrolled')}>
      <motion.span className="pf-header__progress" style={{ scaleX: progress }} aria-hidden="true" />

      <div className="pf-container pf-header__bar">
        <a href="#top" className="pf-logo" onClick={close} aria-label={`${PROFILE.name} — back to top`}>
          <span className="pf-logo__mark">{PROFILE.initials}</span>
          <span className="pf-logo__name">{PROFILE.name}</span>
        </a>

        <nav className="pf-nav" aria-label="Portfolio sections">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={clsx('pf-nav__link', activeId === s.id && 'is-active')}
              aria-current={activeId === s.id ? 'location' : undefined}
            >
              {activeId === s.id && (
                <motion.span
                  layoutId="pf-nav-pill"
                  className="pf-nav__pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="pf-nav__label">{s.label}</span>
            </a>
          ))}
        </nav>

        <div className="pf-header__actions">
          <PfButton
            href={PROFILE.resume.href}
            download={PROFILE.resume.filename}
            variant="ghost"
            iconStart={<Download size={15} />}
            className="pf-header__resume"
          >
            Résumé
          </PfButton>
          <button
            type="button"
            className="pf-icon-btn pf-header__menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="pf-mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="pf-mobile-nav"
            className="pf-mobile-nav"
            aria-label="Portfolio sections"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_SECTIONS.map((s, i) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                onClick={close}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05 }}
              >
                <span className="pf-mobile-nav__num">0{i + 1}</span>
                {s.label}
              </motion.a>
            ))}
            <PfButton href={PROFILE.resume.href} download={PROFILE.resume.filename} iconStart={<Download size={15} />}>
              Download résumé
            </PfButton>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
