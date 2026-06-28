import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { javaRoadmapData } from './data/javaRoadmapData';
import { frontendRoadmapData } from './data/frontendRoadmapData';
import './RoadmapPage.css';

/* ── Roadmap registry ── */
const ROADMAP_REGISTRY = {
  java: javaRoadmapData,
  frontend: frontendRoadmapData,
};

/* ── Stars background ── */
const StarField = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    dur: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    op: 0.3 + Math.random() * 0.5,
    size: Math.random() > 0.8 ? 3 : 2,
  }));
  return (
    <div className="rm-stars" aria-hidden="true">
      {stars.map(s => (
        <div key={s.id} className="rm-star" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, '--op': s.op,
        }} />
      ))}
    </div>
  );
};

/* ── Phase card ── */
const PhaseCard = ({ phase, index, isOpen, onToggle }) => {
  const phaseGradient = `linear-gradient(135deg, ${phase.color}, ${phase.color}99)`;

  return (
    <div
      className="rm-phase"
      id={`phase-${index}`}
      style={{
        '--phase-color': phase.color,
        '--phase-glow': phase.glow,
        '--phase-gradient': phaseGradient,
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <div className="rm-phase-connector" />

      {/* Header */}
      <div
        className={`rm-phase-header ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
      >
        <div className="rm-phase-num">{phase.icon}</div>
        <div className="rm-phase-meta">
          <div className="rm-phase-label">Phase {phase.phase}</div>
          <h3 className="rm-phase-title">{phase.title}</h3>
          <p className="rm-phase-subtitle">{phase.subtitle}</p>
        </div>
        <div className="rm-phase-right">
          <span className="rm-phase-weeks">⏱ {phase.estimatedWeeks}</span>
          <div className={`rm-phase-chevron ${isOpen ? 'open' : ''}`}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="rm-phase-body">
          {phase.sections.map((sec) => (
            <div className="rm-section-card" key={sec.id} style={{ '--phase-gradient': phaseGradient }}>
              <div className="rm-section-header">
                <div className="rm-section-icon">{sec.icon}</div>
                <div className="rm-section-title">{sec.title}</div>
                <div className="rm-section-count">{sec.topics.length}</div>
              </div>
              <div className="rm-topics">
                {sec.topics.map((topic, ti) => (
                  <div className="rm-topic" key={`${sec.id}-${ti}`} style={{ '--delay': `${ti * 0.04}s` }}>
                    <span className={`rm-topic-dot ${topic.level}`} />
                    <span className="rm-topic-name">{topic.name}</span>
                    <span className={`rm-topic-badge ${topic.level}`}>{topic.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Detail Page ── */
const RoadmapPage = () => {
  const navigate = useNavigate();
  const { tech } = useParams();

  // Look up roadmap by URL param — default to java if not found
  const data = ROADMAP_REGISTRY[tech] || ROADMAP_REGISTRY['java'];
  const isValidTech = !!ROADMAP_REGISTRY[tech];

  const [openPhases, setOpenPhases] = useState(new Set([0]));
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const phaseRefs = useRef([]);

  // Redirect invalid tech params
  useEffect(() => {
    if (!isValidTech && tech) {
      navigate('/roadmap', { replace: true });
    }
  }, [tech, isValidTech, navigate]);

  // SEO
  useEffect(() => {
    document.title = `${data.title} Roadmap 2026 | Chaitanya Tech World`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = data.description;
  }, [data]);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;
      let found = 0;
      document.querySelectorAll('.rm-phase').forEach((el, i) => {
        if (scrollY >= el.offsetTop) found = i;
      });
      setActivePhaseIdx(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const togglePhase = (idx) => {
    setOpenPhases(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const expandAll = () => setOpenPhases(new Set(data.phases.map((_, i) => i)));
  const collapseAll = () => setOpenPhases(new Set());
  const allOpen = openPhases.size === data.phases.length;

  const scrollToPhase = (idx) => {
    const el = document.getElementById(`phase-${idx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!openPhases.has(idx)) setOpenPhases(prev => { const n = new Set(prev); n.add(idx); return n; });
  };

  const totalTopics = data.phases.reduce(
    (acc, ph) => acc + ph.sections.reduce((a, s) => a + s.topics.length, 0), 0
  );

  return (
    <div className="rm-root">
      <StarField />

      {/* ── Back breadcrumb ── */}
      <div className="rm-breadcrumb">
        <Link to="/roadmap" className="rm-back-link">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          All Roadmaps
        </Link>
        <span className="rm-breadcrumb-sep">›</span>
        <span className="rm-breadcrumb-current">{data.title}</span>
      </div>

      {/* ── HERO ── */}
      <section className="rm-hero">
        <div className="rm-hero-glow rm-hero-glow--1" />
        <div className="rm-hero-glow rm-hero-glow--2" />

        <div className="rm-hero-badge">
          <span className="rm-badge-dot" />
          Developer Roadmaps 2026
        </div>

        <h1 className="rm-hero-title">
          <span className="rm-title-word-2">{data.icon} {data.title}</span>
          <br />
          <span className="rm-title-word-1" style={{ fontSize: '55%', letterSpacing: '-0.5px', color: '#94a3b8', fontWeight: 700 }}>
            {data.subtitle}
          </span>
        </h1>

        <p className="rm-hero-sub">{data.description}</p>

        {/* Stats */}
        <div className="rm-hero-stats">
          <div className="rm-stat">
            <span className="rm-stat-value">{data.phases.length}</span>
            <span className="rm-stat-label">Phases</span>
          </div>
          <div className="rm-stat-sep" />
          <div className="rm-stat">
            <span className="rm-stat-value">{totalTopics}+</span>
            <span className="rm-stat-label">Topics</span>
          </div>
          <div className="rm-stat-sep" />
          <div className="rm-stat">
            <span className="rm-stat-value">{data.estimatedWeeks}w</span>
            <span className="rm-stat-label">Duration</span>
          </div>
          <div className="rm-stat-sep" />
          <div className="rm-stat">
            <span className="rm-stat-value">Free</span>
            <span className="rm-stat-label">Always</span>
          </div>
        </div>
      </section>

      {/* ── Legend + Controls ── */}
      <div className="rm-controls">
        <div className="rm-legend">
          <div className="rm-legend-item"><span className="rm-legend-dot beginner" />Beginner</div>
          <div className="rm-legend-item"><span className="rm-legend-dot intermediate" />Intermediate</div>
          <div className="rm-legend-item"><span className="rm-legend-dot advanced" />Advanced</div>
        </div>
        <button className="rm-expand-btn" onClick={allOpen ? collapseAll : expandAll}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {allOpen ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
          </svg>
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* ── Roadmap phases ── */}
      <div className="rm-body">
        {data.phases.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            index={idx}
            isOpen={openPhases.has(idx)}
            onToggle={() => togglePhase(idx)}
          />
        ))}
      </div>

      {/* ── Floating progress dots ── */}
      <nav className="rm-progress-track" aria-label="Phase progress">
        {data.phases.map((phase, idx) => (
          <div
            key={phase.id}
            className={`rm-progress-dot ${activePhaseIdx === idx ? 'active' : ''}`}
            style={{ '--c': phase.color }}
            data-label={`${idx + 1}. ${phase.title}`}
            onClick={() => scrollToPhase(idx)}
            role="button"
            aria-label={`Go to Phase ${phase.phase}: ${phase.title}`}
          />
        ))}
      </nav>

      {/* ── Footer CTA ── */}
      <div className="rm-footer-cta">
        <h2>While You Learn, Create! 🎨</h2>
        <p>Explore our curated AI prompt gallery — handpicked prompts to generate stunning images &amp; videos using ChatGPT, Gemini, Midjourney &amp; more.</p>
        <a href="/prompts" className="rm-cta-btn">
          Browse AI Prompts Gallery
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default RoadmapPage;
