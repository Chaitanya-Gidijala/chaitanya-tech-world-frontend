import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoadmapHomePage.css';

/* ── Star field ── */
const StarField = () => {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    dur: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    op: 0.3 + Math.random() * 0.45,
    size: Math.random() > 0.8 ? 3 : 2,
  }));
  return (
    <div className="rmh-stars" aria-hidden="true">
      {stars.map(s => (
        <div key={s.id} className="rmh-star" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, '--op': s.op,
        }} />
      ))}
    </div>
  );
};

/* ── Roadmap card definitions ── */
const roadmaps = [
  {
    id: 'java',
    title: 'Java Backend Developer',
    subtitle: 'Core Java → Spring Boot → Microservices → Cloud Deployment',
    icon: '☕',
    gradient: 'linear-gradient(135deg, #f89820, #ef4444)',
    glow: 'rgba(248,152,32,0.35)',
    accent: '#f89820',
    status: 'available',
    phases: 10,
    topics: '85+',
    weeks: '36 weeks',
    highlights: [
      { label: '10 Phases' },
      { label: '85+ Topics' },
      { label: '36 Weeks' },
    ],
    keyTopics: ['Core Java', 'Java 8/17/21', 'Spring Boot', 'Hibernate', 'Microservices', 'Docker'],
    ctaText: 'Start Java Roadmap',
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    subtitle: 'HTML/CSS → JavaScript → React.js → TypeScript → Next.js',
    icon: '⚛️',
    gradient: 'linear-gradient(135deg, #61dafb, #6366f1)',
    glow: 'rgba(99,102,241,0.3)',
    accent: '#6366f1',
    status: 'available',
    phases: 8,
    topics: '90+',
    weeks: '28 weeks',
    highlights: [
      { label: '8 Phases' },
      { label: '90+ Topics' },
      { label: '28 Weeks' },
    ],
    keyTopics: ['HTML & CSS', 'JavaScript ES6+', 'React.js', 'TypeScript', 'Next.js', 'Testing'],
    ctaText: 'Start Frontend Roadmap',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    subtitle: 'Combine Java Backend + React Frontend + DevOps in one path',
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    glow: 'rgba(139,92,246,0.3)',
    accent: '#8b5cf6',
    status: 'coming-soon',
    phases: 12,
    topics: '150+',
    weeks: '52 weeks',
    highlights: [
      { label: '12 Phases' },
      { label: '150+ Topics' },
      { label: '52 Weeks' },
    ],
    keyTopics: ['Java Backend', 'React Frontend', 'REST APIs', 'Databases', 'DevOps', 'Cloud'],
    ctaText: 'View Full Stack Roadmap',
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    subtitle: 'Linux → Docker → Kubernetes → CI/CD → Cloud (AWS/GCP)',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    glow: 'rgba(16,185,129,0.3)',
    accent: '#10b981',
    status: 'coming-soon',
    phases: 7,
    topics: '60+',
    weeks: '24 weeks',
    highlights: [
      { label: '7 Phases' },
      { label: '60+ Topics' },
      { label: '24 Weeks' },
    ],
    keyTopics: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
    ctaText: 'View DevOps Roadmap',
  },
];

/* ── Main Component ── */
const RoadmapHomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Developer Roadmaps 2026 | Chaitanya Tech World';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = 'Free, complete developer roadmaps for Java Backend, Frontend, Full Stack and DevOps — from beginner to advanced level.';
  }, []);

  const handleCardClick = (rm) => {
    if (rm.status === 'available') navigate(`/roadmap/${rm.id}`);
  };

  const availableCount = roadmaps.filter(r => r.status === 'available').length;

  return (
    <div className="rmh-root">
      <StarField />

      {/* ── HERO ── */}
      <section className="rmh-hero">
        <div className="rmh-hero-glow rmh-hero-glow--1" />
        <div className="rmh-hero-glow rmh-hero-glow--2" />

        <div className="rmh-badge">
          <span className="rmh-badge-dot" />
          Developer Roadmaps 2026
        </div>

        <h1 className="rmh-hero-title">
          Your Complete Path to<br />
          <span>Becoming a Developer</span>
        </h1>

        <p className="rmh-hero-sub">
          Structured, beginner-to-advanced roadmaps built from real industry experience.
          Pick your technology and start your journey today — completely free.
        </p>

        <div className="rmh-stats">
          <div className="rmh-stat">
            <span className="rmh-stat-value">{roadmaps.length}</span>
            <span className="rmh-stat-label">Roadmaps</span>
          </div>
          <div className="rmh-stat-sep" />
          <div className="rmh-stat">
            <span className="rmh-stat-value">350+</span>
            <span className="rmh-stat-label">Topics</span>
          </div>
          <div className="rmh-stat-sep" />
          <div className="rmh-stat">
            <span className="rmh-stat-value">{availableCount}</span>
            <span className="rmh-stat-label">Live Now</span>
          </div>
          <div className="rmh-stat-sep" />
          <div className="rmh-stat">
            <span className="rmh-stat-value">Free</span>
            <span className="rmh-stat-label">Always</span>
          </div>
        </div>
      </section>

      {/* ── Section heading ── */}
      <div className="rmh-section-head">
        <div className="rmh-section-label">Choose Your Path</div>
        <h2 className="rmh-section-title">Pick Your Technology Stack</h2>
        <p className="rmh-section-sub">
          Each roadmap guides you step-by-step from absolute beginner to job-ready professional.
        </p>
      </div>

      {/* ── CARDS GRID ── */}
      <div className="rmh-grid-wrapper">
        {roadmaps.map((rm, idx) => (
          <div
            key={rm.id}
            className={`rmh-card ${rm.status === 'coming-soon' ? 'coming-soon' : ''}`}
            style={{
              '--card-grad': rm.gradient,
              '--card-glow': rm.glow,
              '--card-accent': rm.accent,
              '--delay': `${idx * 0.1}s`,
            }}
            onClick={() => handleCardClick(rm)}
            role="button"
            tabIndex={rm.status === 'available' ? 0 : -1}
            aria-label={`${rm.title} roadmap — ${rm.status === 'available' ? 'click to view' : 'coming soon'}`}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(rm)}
          >
            {/* Gradient top strip */}
            <div className="rmh-card-strip" />

            <div className="rmh-card-inner">
              {/* Header */}
              <div className="rmh-card-header">
                <div className="rmh-card-icon-wrap">{rm.icon}</div>
                <div className="rmh-card-info">
                  <h3 className="rmh-card-title">{rm.title}</h3>
                  <p className="rmh-card-subtitle">{rm.subtitle}</p>
                </div>
                <span className={`rmh-card-status ${rm.status === 'available' ? 'available' : 'soon'}`}>
                  {rm.status === 'available' ? '● Live' : '◌ Soon'}
                </span>
              </div>

              {/* Highlights */}
              <div className="rmh-card-highlights">
                {rm.highlights.map((h, i) => (
                  <div key={i} className="rmh-chip">
                    <span className="rmh-chip-dot" />
                    {h.label}
                  </div>
                ))}
              </div>

              {/* Key topics preview */}
              <div className="rmh-card-topics">
                {rm.keyTopics.map((t, i) => (
                  <span key={i} className="rmh-topic-pill">{t}</span>
                ))}
              </div>

              {/* CTA row */}
              <div className="rmh-card-cta">
                {rm.status === 'available' ? (
                  <>
                    <span className="rmh-card-cta-text">
                      {rm.ctaText}
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                    <div className="rmh-card-cta-arrow">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <span className="rmh-card-soon-msg">🔔 Coming soon — stay tuned!</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── More coming ── */}
      <div className="rmh-coming-soon-row">
        <div className="rmh-coming-row-inner">
          <span className="rmh-coming-dot" />
          <span className="rmh-coming-dot" />
          <span className="rmh-coming-dot" />
          <span>Python, Node.js, Android & more roadmaps coming soon</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapHomePage;
