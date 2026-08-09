import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingFooter from '@/components/layout/LandingFooter';
import RoadmapNavbar from './RoadmapNavbar';
import './RoadmapHomePage.css';



/* ── Roadmap data ── */
const COURSE_ROADMAPS = [
  {
    id: 'gen-ai',
    title: 'Gen AI & Prompt Engineering',
    subtitle: 'Fundamentals → Prompt Engineering → Advanced Control → MCP',
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #059669, #34d399)',
    color: '#10B981',
    status: 'live',
    href: '/tutorial/gen-ai',
    stats: [{ label: 'Phases', value: 4 }, { label: 'Topics', value: 17 }, { label: 'Style', value: 'Interactive' }],
    tags: ['Generative AI', 'Prompt Engineering', 'LLMs', 'MCP'],
  },
  {
    id: 'java',
    title: 'Java Backend Developer',
    subtitle: 'Core Java → Spring Boot → Microservices → Cloud Deployment',
    icon: '☕',
    gradient: 'linear-gradient(135deg, #f89820, #ef4444)',
    color: '#f89820',
    status: 'live',
    stats: [{ label: 'Phases', value: 10 }, { label: 'Topics', value: '85+' }, { label: 'Weeks', value: 36 }],
    tags: ['Core Java', 'Spring Boot', 'Hibernate', 'Docker'],
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    subtitle: 'HTML/CSS → JavaScript → React.js → TypeScript → Next.js',
    icon: '⚛️',
    gradient: 'linear-gradient(135deg, #61dafb, #6366f1)',
    color: '#6366f1',
    status: 'live',
    stats: [{ label: 'Phases', value: 8 }, { label: 'Topics', value: '90+' }, { label: 'Weeks', value: 28 }],
    tags: ['HTML/CSS', 'JavaScript', 'React.js', 'TypeScript'],
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    subtitle: 'Java Backend + React Frontend + DevOps in one path',
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    color: '#8b5cf6',
    status: 'soon',
    stats: [{ label: 'Phases', value: 12 }, { label: 'Topics', value: '150+' }, { label: 'Weeks', value: 52 }],
    tags: ['Java', 'React', 'APIs', 'DevOps'],
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    subtitle: 'Linux → Docker → Kubernetes → CI/CD → AWS/GCP',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    color: '#10b981',
    status: 'soon',
    stats: [{ label: 'Phases', value: 7 }, { label: 'Topics', value: '60+' }, { label: 'Weeks', value: 24 }],
    tags: ['Linux', 'Docker', 'Kubernetes', 'AWS'],
  },
];

const AI_CERT_TRACKS = [
  {
    id: 'claude',
    provider: 'Anthropic',
    title: 'Claude AI Certifications',
    subtitle: '4 certifications from Associate to Expert',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #D97706, #F59E0B, #FCD34D)',
    color: '#F59E0B',
    certCount: 4,
    levels: ['Foundations', 'Developer', 'Architect', 'Expert'],
    status: 'live',
    href: '/roadmap/certifications/claude',
  },
];

/* ── Course Card ── */
const CourseCard = ({ rm }) => {
  const navigate = useNavigate();
  const isLive = rm.status === 'live';
  const handleClick = () => { 
    if (isLive) {
      if (rm.href) {
        navigate(rm.href);
      } else {
        navigate(`/roadmap/${rm.id}`); 
      }
    }
  };

  return (
    <div
      className={`rmh-course-card ${!isLive ? 'rmh-course-card--soon' : ''}`}
      style={{ '--card-color': rm.color }}
      onClick={handleClick}
      role={isLive ? 'button' : undefined}
      tabIndex={isLive ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`${rm.title} roadmap`}
    >
      <div className="rmh-course-card__top-bar" style={{ background: rm.gradient }} />
      <div className="rmh-course-card__body">
        <div className="rmh-course-card__header">
          <div className="rmh-course-card__icon">{rm.icon}</div>
          <div className="rmh-course-card__info">
            <span className={`rmh-course-card__status ${isLive ? 'live' : 'soon'}`}>
              {isLive ? '● Live' : '◌ Coming Soon'}
            </span>
            <h3 className="rmh-course-card__title">{rm.title}</h3>
            <p className="rmh-course-card__subtitle">{rm.subtitle}</p>
          </div>
        </div>

        <div className="rmh-course-card__stats">
          {rm.stats.map((s, i) => (
            <div key={i} className="rmh-course-stat">
              <span className="rmh-course-stat__val" style={{ color: rm.color }}>{s.value}</span>
              <span className="rmh-course-stat__lbl">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="rmh-course-card__tags">
          {rm.tags.map((t, i) => (
            <span key={i} className="rmh-tag">{t}</span>
          ))}
        </div>

        {isLive && (
          <div className="rmh-course-card__cta">
            <span>Start {rm.title.split(' ')[0]} Roadmap</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── AI Cert Track Card ── */
const CertTrackCard = ({ track }) => (
  <Link to={track.href} className="rmh-cert-track-card" style={{ '--track-color': track.color }}>
    <div className="rmh-cert-track-card__glow" style={{ background: track.color }} />
    <div className="rmh-cert-track-card__body">
      <div className="rmh-cert-track-card__header">
        <div className="rmh-cert-track-card__icon-wrap" style={{ background: track.gradient }}>
          <span className="rmh-cert-track-card__icon">{track.icon}</span>
        </div>
        <div>
          <p className="rmh-cert-track-card__provider">{track.provider}</p>
          <h3 className="rmh-cert-track-card__title">{track.title}</h3>
          <p className="rmh-cert-track-card__subtitle">{track.subtitle}</p>
        </div>
        <span className="rmh-cert-track-card__live">● Live</span>
      </div>

      <div className="rmh-cert-track-card__levels">
        {track.levels.map((l, i) => (
          <div key={i} className="rmh-cert-level">
            <span className="rmh-cert-level__num" style={{ color: track.color }}>{i + 1}</span>
            <span className="rmh-cert-level__name">{l}</span>
          </div>
        ))}
      </div>

      <div className="rmh-cert-track-card__cta">
        <span>View {track.certCount} Certifications</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  </Link>
);

/* ══ MAIN ══ */
export default function RoadmapHomePage() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    document.title = 'Developer Roadmaps & AI Certifications 2026 | Chaitanya Tech World';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = 'Free structured roadmaps for Java, Frontend, Full Stack, DevOps — plus Claude AI Certification prep guides.';
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div className="rmh-root">
      <RoadmapNavbar theme={theme} toggleTheme={toggleTheme} />

      {/* ── Background ── */}
      <div className="rmh-bg-mesh" aria-hidden="true">
        <div className="rmh-bg-glow rmh-bg-glow--1" />
        <div className="rmh-bg-glow rmh-bg-glow--2" />
        <div className="rmh-bg-grid" />
      </div>

      {/* ── HERO ── */}
      <section className="rmh-hero">
        <div className="rmh-hero-badge">
          <span className="rmh-hero-badge-dot" />
          Free Learning Paths · 2026
        </div>
        <h1 className="rmh-hero-title">
          Your Complete Path to
          <br />
          <span className="rmh-hero-title-accent">Tech Mastery</span>
        </h1>
        <p className="rmh-hero-desc">
          Structured, beginner-to-advanced roadmaps built from real industry experience — 
          plus official AI certification prep guides. Pick your path and start today.
        </p>
        <div className="rmh-hero-stats">
          {[
            { val: `${COURSE_ROADMAPS.length + AI_CERT_TRACKS.length}`, lbl: 'Tracks' },
            { val: '350+', lbl: 'Topics' },
            { val: '4', lbl: 'AI Certs' },
            { val: 'Free', lbl: 'Always' },
          ].map((s, i) => (
            <div key={i} className="rmh-hero-stat">
              <span className="rmh-hero-stat-val">{s.val}</span>
              <span className="rmh-hero-stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ COURSE ROADMAPS ══ */}
      <section className="rmh-section">
        <div className="rmh-section-header">
          <span className="rmh-section-label">Development Paths</span>
          <h2 className="rmh-section-title">Course Roadmaps</h2>
          <p className="rmh-section-sub">Step-by-step paths from absolute beginner to job-ready professional.</p>
        </div>
        <div className="rmh-course-grid">
          {COURSE_ROADMAPS.map(rm => <CourseCard key={rm.id} rm={rm} />)}
        </div>
        <div className="rmh-more-coming">
          <span className="rmh-more-dot" /><span className="rmh-more-dot" /><span className="rmh-more-dot" />
          <span>Python, Node.js, Android & more coming soon</span>
        </div>
      </section>

      {/* ══ AI CERTIFICATIONS ══ */}
      <section className="rmh-section">
        <div className="rmh-section-header">
          <span className="rmh-section-label">AI Certifications</span>
          <h2 className="rmh-section-title">Official Certification Prep</h2>
          <p className="rmh-section-sub">Curated study guides for official AI certifications — everything you need, in one place.</p>
        </div>
        <div className="rmh-cert-tracks">
          {AI_CERT_TRACKS.map(track => <CertTrackCard key={track.id} track={track} />)}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
