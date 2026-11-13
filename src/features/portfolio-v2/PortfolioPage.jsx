import { useEffect, useRef } from 'react';
import { useDocumentMeta } from '@/design-system';
import PortfolioHeader from './components/PortfolioHeader';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import CredentialsSection from './components/CredentialsSection';
import ContactSection from './components/ContactSection';
import PortfolioFooter from './components/PortfolioFooter';
import { PROFILE } from './data/portfolioContent';
import './portfolio.css';

/** Moves the page-wide glow to follow the cursor (CSS variables, no re-renders). */
function useCursorGlow(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.('(pointer: coarse)').matches) return undefined;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--cx', `${e.clientX}px`);
        el.style.setProperty('--cy', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [ref]);
}

/**
 * PortfolioPage — standalone single-page portfolio at /portfolio.
 * Has its own visual design (portfolio.css, `pf-` prefix), independent of the site.
 * All copy lives in ./data/portfolioContent.js.
 */
export default function PortfolioPage() {
  const rootRef = useRef(null);
  useCursorGlow(rootRef);

  useDocumentMeta({
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description:
      'Java backend engineer building Spring Boot microservices and REST APIs. Experience, projects, certifications and contact details.',
  });

  return (
    <div className="pf-page" ref={rootRef}>
      <div className="pf-bg" aria-hidden="true">
        <span className="pf-bg__blob pf-bg__blob--1" />
        <span className="pf-bg__blob pf-bg__blob--2" />
        <span className="pf-bg__grid" />
        <span className="pf-bg__cursor" />
        <span className="pf-bg__noise" />
      </div>

      <a href="#main" className="pf-skip">
        Skip to content
      </a>
      <PortfolioHeader />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <CredentialsSection />
        <ContactSection />
      </main>
      <PortfolioFooter />
    </div>
  );
}
