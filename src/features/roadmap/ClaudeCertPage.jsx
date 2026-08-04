import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { claudeFoundationsData } from './data/claudeFoundationsData';
import LandingFooter from '@/components/layout/LandingFooter';
import RoadmapNavbar from './RoadmapNavbar';
import './ClaudeCertPage.css';

/* ── Certification Registry ── */
const CERT_REGISTRY = {
  'claude-certified-associate-foundations': claudeFoundationsData,
};

/* ── Domain Weight Arc ── */
const WeightArc = ({ weight, color }) => {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (weight / 100) * circ;
  return (
    <svg className="cc-arc" width="70" height="70" viewBox="0 0 70 70">
      <circle cx="35" cy="35" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
      <circle
        cx="35" cy="35" r={r}
        stroke={color} strokeWidth="5" fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 35 35)"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
      />
      <text x="35" y="40" textAnchor="middle" fill={color} fontSize="13" fontWeight="700">{weight}%</text>
    </svg>
  );
};

/* ── Resource Link ── */
const ResourceLink = ({ resource }) => (
  <a className="cc-resource-link" href={resource.url} target="_blank" rel="noopener noreferrer">
    <span className="cc-resource-icon">
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </span>
    {resource.label}
  </a>
);

/* ── Objective Card ── */
const ObjectiveCard = ({ objective, domainColor, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cc-obj-card ${open ? 'cc-obj-card--open' : ''}`} style={{ '--dc': domainColor }}>
      <button className="cc-obj-header" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="cc-obj-num" style={{ background: domainColor + '22', color: domainColor }}>
          {String.fromCharCode(64 + index)}
        </span>
        <span className="cc-obj-title">{objective.title}</span>
        <span className="cc-obj-count">{objective.resources.length} resources</span>
        <span className={`cc-obj-chevron ${open ? 'open' : ''}`}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="cc-obj-body">
          <div className="cc-resource-list">
            {objective.resources.map((r, i) => <ResourceLink key={i} resource={r} />)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Domain Section ── */
const DomainSection = ({ domain, index, isOpen, onToggle }) => (
  <div
    className={`cc-domain ${isOpen ? 'cc-domain--open' : ''}`}
    id={`domain-${index}`}
    style={{ '--dc': domain.color, animationDelay: `${index * 0.1}s` }}
  >
    <button className="cc-domain-header" onClick={onToggle} aria-expanded={isOpen}>
      <div className="cc-domain-left">
        <div className="cc-domain-icon-wrap" style={{ background: domain.color + '18', borderColor: domain.color + '40' }}>
          <span className="cc-domain-emoji">{domain.icon}</span>
        </div>
        <div className="cc-domain-info">
          <span className="cc-domain-label">Domain {domain.number}</span>
          <h3 className="cc-domain-title">{domain.title}</h3>
          <span className="cc-domain-objectives-count">
            {domain.objectives.length} objectives · {domain.objectives.reduce((a, o) => a + o.resources.length, 0)} resources
          </span>
        </div>
      </div>
      <div className="cc-domain-right">
        <WeightArc weight={domain.weight} color={domain.color} />
        <span className={`cc-domain-chevron ${isOpen ? 'open' : ''}`}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </button>
    {isOpen && (
      <div className="cc-domain-body">
        <div className="cc-domain-divider" style={{ background: domain.color }} />
        <div className="cc-objectives-list">
          {domain.objectives.map((obj, i) => (
            <ObjectiveCard key={obj.id} objective={obj} domainColor={domain.color} index={i + 1} />
          ))}
        </div>
      </div>
    )}
  </div>
);

/* ── Floating Progress Nav ── */
const ProgressNav = ({ domains, activeDomain, onJump }) => (
  <nav className="cc-progress-nav" aria-label="Domain navigation">
    {domains.map((d, i) => (
      <button
        key={d.id}
        className={`cc-progress-dot ${activeDomain === i ? 'active' : ''}`}
        style={{ '--dc': d.color }}
        onClick={() => onJump(i)}
        title={`Domain ${d.number}: ${d.title}`}
        aria-label={`Go to Domain ${d.number}: ${d.title}`}
      />
    ))}
  </nav>
);


export default function ClaudeCertPage() {
  const { certName } = useParams();
  const navigate = useNavigate();

  const data = CERT_REGISTRY[certName];
  const [openDomains, setOpenDomains] = useState(new Set([0]));
  const [activeDomain, setActiveDomain] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  );

  useEffect(() => {
    if (!data) navigate('/roadmap', { replace: true });
  }, [data, navigate]);

  useEffect(() => {
    if (data) {
      document.title = `${data.shortName} Study Guide | Chaitanya Tech World`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
      meta.content = data.description;
    }
  }, [data]);

  useEffect(() => {
    const onScroll = () => {
      setHeaderScrolled(window.scrollY > 60);
      const scrollMid = window.scrollY + window.innerHeight / 2;
      let found = 0;
      document.querySelectorAll('.cc-domain').forEach((el, i) => {
        if (scrollMid >= el.offsetTop) found = i;
      });
      setActiveDomain(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  if (!data) return null;

  const totalObjectives = data.domains.reduce((a, d) => a + d.objectives.length, 0);
  const totalResources = data.domains.reduce((a, d) => a + d.objectives.reduce((b, o) => b + o.resources.length, 0), 0);

  const toggleDomain = (idx) => {
    setOpenDomains(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const expandAll = () => setOpenDomains(new Set(data.domains.map((_, i) => i)));
  const collapseAll = () => setOpenDomains(new Set());
  const allOpen = openDomains.size === data.domains.length;

  const jumpToDomain = (idx) => {
    const el = document.getElementById(`domain-${idx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpenDomains(prev => { const n = new Set(prev); n.add(idx); return n; });
  };

  return (
    <div className="cc-root">

      <RoadmapNavbar theme={theme} toggleTheme={toggleTheme} showCTA={true} />

      {/* ── HERO ── */}
      <section className="cc-hero">
        <div className="cc-hero-mesh" aria-hidden="true">
          <div className="cc-hero-glow cc-hero-glow--1" style={{ background: data.accentColor }} />
          <div className="cc-hero-glow cc-hero-glow--2" />
          <div className="cc-hero-grid" />
        </div>

        {/* Breadcrumb */}
        <div className="cc-breadcrumb">
          <Link to="/roadmap" className="cc-back-link">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            All Roadmaps
          </Link>
          <span className="cc-sep">›</span>
          <Link to="/roadmap/certifications/claude" className="cc-back-link">Claude Certifications</Link>
          <span className="cc-sep">›</span>
          <span className="cc-breadcrumb-current">{data.shortName}</span>
        </div>

        <div className="cc-hero-content">
          <div className="cc-hero-badge-row">
            <span className="cc-provider-badge">
              <span className="cc-provider-dot" style={{ background: data.accentColor }} />
              Anthropic Official
            </span>
            <span className="cc-level-badge" style={{
              color: data.accentColor,
              borderColor: data.accentColor + '50',
              background: data.accentColor + '12'
            }}>
              {data.level} Level
            </span>
          </div>

          <div className="cc-exam-code" style={{ color: data.accentColor }}>{data.examCode}</div>

          <h1 className="cc-hero-title">
            <span className="cc-hero-title-accent" style={{
              WebkitTextFillColor: 'transparent',
              backgroundImage: data.gradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }}>
              Claude Certified
            </span>
            <br />
            Associate – Foundations
          </h1>

          <p className="cc-hero-desc">{data.description}</p>

          <div className="cc-stats-row">
            {[
              { label: 'Domains', value: data.domains.length },
              { label: 'Objectives', value: totalObjectives },
              { label: 'Resources', value: totalResources },
              { label: 'Study Hours', value: `~${data.estimatedHours}h` },
              { label: 'Passing Score', value: `${data.passScore}%` },
            ].map((s, i) => (
              <div className="cc-stat" key={i}>
                <span className="cc-stat-value" style={{ color: data.accentColor }}>{s.value}</span>
                <span className="cc-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="cc-exam-info-row">
            <span className="cc-pill">⏱ {data.examDuration}</span>
            <span className="cc-pill">📝 {data.questionCount} Questions</span>
            <span className="cc-pill">✅ {data.passScore}% to Pass</span>
            <span className="cc-pill">🏅 Anthropic Certified</span>
          </div>
        </div>

        {/* Domain Weight Overview */}
        <div className="cc-domain-overview">
          <h2 className="cc-overview-title">Exam Domain Breakdown</h2>
          <div className="cc-domain-bars">
            {data.domains.map((d) => (
              <div key={d.id} className="cc-domain-bar-item">
                <span className="cc-domain-bar-icon">{d.icon}</span>
                <div className="cc-domain-bar-track">
                  <div className="cc-domain-bar-fill" style={{ width: `${d.weight}%`, background: d.color }} />
                </div>
                <span className="cc-domain-bar-pct" style={{ color: d.color }}>{d.weight}%</span>
                <span className="cc-domain-bar-name">{d.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTROLS ── */}
      <div className="cc-controls-bar">
        <span className="cc-controls-label">
          {data.domains.length} Domains · {totalObjectives} Learning Objectives
        </span>
        <button className="cc-expand-btn" onClick={allOpen ? collapseAll : expandAll}>
          {allOpen ? (
            <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg> Collapse All</>
          ) : (
            <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg> Expand All</>
          )}
        </button>
      </div>

      {/* ── DOMAINS ── */}
      <main className="cc-main">
        <div className="cc-timeline-line" />
        {data.domains.map((domain, idx) => (
          <DomainSection
            key={domain.id}
            domain={domain}
            index={idx}
            isOpen={openDomains.has(idx)}
            onToggle={() => toggleDomain(idx)}
          />
        ))}

        <div className="cc-completion-banner">
          <div className="cc-completion-inner">
            <span className="cc-completion-icon">🎓</span>
            <div className="cc-completion-text">
              <h3>Ready to take the exam?</h3>
              <p>You've covered all 7 domains. Register for the {data.shortName} certification on the official Anthropic portal.</p>
            </div>
            <a
              href="https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification"
              target="_blank"
              rel="noopener noreferrer"
              className="cc-completion-btn"
              style={{ background: data.gradient }}
            >
              Register for Exam →
            </a>
          </div>
        </div>
      </main>

      <ProgressNav domains={data.domains} activeDomain={activeDomain} onJump={jumpToDomain} />

      <LandingFooter />
    </div>
  );
}
