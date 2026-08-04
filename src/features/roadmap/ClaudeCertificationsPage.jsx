import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingFooter from '@/components/layout/LandingFooter';
import RoadmapNavbar from './RoadmapNavbar';
import './ClaudeCertificationsPage.css';



/* ── Certification definitions ── */
const CLAUDE_CERTS = [
  {
    id: 'claude-certified-associate-foundations',
    code: 'CCAO-F',
    title: 'Claude Certified Associate',
    subtitle: 'Foundations',
    level: 'Associate',
    levelNum: 1,
    description: 'Master the fundamentals of working with Claude — prompt engineering, output evaluation, governance, model selection, and workflow integration. The essential starting point for Claude users.',
    status: 'live',
    gradient: 'linear-gradient(135deg, #D97706, #F59E0B, #FCD34D)',
    color: '#F59E0B',
    domains: 7,
    objectives: 27,
    resources: 47,
    examCode: 'CCAO-F',
    hours: 40,
    passScore: 72,
    tags: ['Prompt Engineering', 'Output Validation', 'Governance', 'Model Selection'],
    icon: '🎯',
    difficulty: 'Beginner',
  },
  {
    id: 'claude-certified-developer',
    code: 'CCD',
    title: 'Claude Certified Developer',
    subtitle: 'Builder & Integrations',
    level: 'Developer',
    levelNum: 2,
    description: 'Learn to build Claude-powered applications with the Anthropic API — RAG pipelines, multi-agent systems, tool use, streaming, and production-ready integrations.',
    status: 'soon',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: '#8B5CF6',
    domains: 8,
    objectives: 34,
    resources: 62,
    examCode: 'CCD',
    hours: 60,
    passScore: 75,
    tags: ['Anthropic API', 'Tool Use', 'RAG', 'Agents'],
    icon: '⚙️',
    difficulty: 'Intermediate',
  },
  {
    id: 'claude-certified-architect',
    code: 'CCA',
    title: 'Claude Certified Architect',
    subtitle: 'Enterprise & System Design',
    level: 'Architect',
    levelNum: 3,
    description: 'Design, secure, and optimize large-scale Claude deployments for enterprise. Covers multi-model orchestration, safety guardrails, cost management, and MLOps patterns.',
    status: 'soon',
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    color: '#10B981',
    domains: 9,
    objectives: 40,
    resources: 75,
    examCode: 'CCA',
    hours: 80,
    passScore: 78,
    tags: ['Enterprise', 'MLOps', 'Guardrails', 'Orchestration'],
    icon: '🏗️',
    difficulty: 'Advanced',
  },
  {
    id: 'claude-certified-expert',
    code: 'CCE',
    title: 'Claude Certified Expert',
    subtitle: 'Research & Frontier Applications',
    level: 'Expert',
    levelNum: 4,
    description: 'The pinnacle Claude certification — covering cutting-edge research applications, constitutional AI, interpretability, frontier model capabilities, and Anthropic alignment principles.',
    status: 'soon',
    gradient: 'linear-gradient(135deg, #EF4444, #EC4899)',
    color: '#EC4899',
    domains: 10,
    objectives: 50,
    resources: 90,
    examCode: 'CCE',
    hours: 120,
    passScore: 80,
    tags: ['Constitutional AI', 'Alignment', 'Interpretability', 'Frontier'],
    icon: '🔬',
    difficulty: 'Expert',
  },
];

/* ── Cert Card ── */
const CertCard = ({ cert, index }) => {
  const isLive = cert.status === 'live';
  return (
    <div
      id={cert.id}
      className={`ccp-cert-card ${!isLive ? 'ccp-cert-card--soon' : ''}`}
      style={{ '--cert-color': cert.color, animationDelay: `${index * 0.1}s` }}
    >
      {/* Level strip */}
      <div className="ccp-cert-card__strip" style={{ background: cert.gradient }} />

      {/* Coming soon badge */}
      {!isLive && <div className="ccp-cert-card__soon-badge">Coming Soon</div>}

      <div className="ccp-cert-card__body">
        {/* Header */}
        <div className="ccp-cert-card__header">
          <div className="ccp-cert-card__level-circle" style={{ background: cert.gradient }}>
            <span className="ccp-cert-card__level-num">{cert.levelNum}</span>
          </div>
          <div>
            <span className="ccp-cert-card__code" style={{ color: cert.color }}>{cert.code}</span>
            <h3 className="ccp-cert-card__title">{cert.title}</h3>
            <p className="ccp-cert-card__subtitle">{cert.subtitle}</p>
          </div>
          <div className="ccp-cert-card__icon">{cert.icon}</div>
        </div>

        <p className="ccp-cert-card__desc">{cert.description}</p>

        {/* Stats */}
        <div className="ccp-cert-card__stats">
          {[
            { label: 'Domains', value: cert.domains },
            { label: 'Objectives', value: cert.objectives },
            { label: 'Resources', value: cert.resources },
            { label: 'Study Hours', value: `~${cert.hours}h` },
          ].map((s, i) => (
            <div key={i} className="ccp-cert-stat">
              <span className="ccp-cert-stat__val" style={{ color: cert.color }}>{s.value}</span>
              <span className="ccp-cert-stat__lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="ccp-cert-card__tags">
          {cert.tags.map((t, i) => (
            <span key={i} className="ccp-cert-tag">{t}</span>
          ))}
          <span className={`ccp-cert-difficulty ccp-cert-difficulty--${cert.difficulty.toLowerCase()}`}>
            {cert.difficulty}
          </span>
        </div>

        {/* CTA */}
        {isLive ? (
          <Link
            to={`/roadmap/certifications/${cert.id}`}
            className="ccp-cert-card__cta"
            style={{ background: cert.gradient }}
          >
            Start Study Guide →
          </Link>
        ) : (
          <div className="ccp-cert-card__cta ccp-cert-card__cta--disabled">
            🔔 Coming Soon
          </div>
        )}
      </div>
    </div>
  );
};

/* ══ MAIN ══ */
export default function ClaudeCertificationsPage() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    document.title = 'Claude AI Certifications | Chaitanya Tech World';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = 'Comprehensive study guides for all 4 Anthropic Claude certifications — from Foundations to Expert.';
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div className="ccp-root">
      <RoadmapNavbar theme={theme} toggleTheme={toggleTheme} showCTA={true} />

      {/* ── Background ── */}
      <div className="ccp-bg" aria-hidden="true">
        <div className="ccp-bg-glow ccp-bg-glow--1" />
        <div className="ccp-bg-glow ccp-bg-glow--2" />
        <div className="ccp-bg-grid" />
      </div>

      {/* ── Breadcrumb ── */}
      <div className="ccp-breadcrumb">
        <Link to="/roadmap" className="ccp-back-link">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          All Roadmaps
        </Link>
        <span className="ccp-sep">›</span>
        <span>Anthropic Claude</span>
      </div>

      {/* ── HERO ── */}
      <section className="ccp-hero">
        <div className="ccp-hero-badge-row">
          <span className="ccp-hero-badge">
            <span className="ccp-hero-badge-dot" />
            Anthropic Official Certifications
          </span>
        </div>
        <h1 className="ccp-hero-title">
          <span className="ccp-hero-title-accent">Claude AI</span>
          <br />Certification Paths
        </h1>
        <p className="ccp-hero-desc">
          Four official certifications from Anthropic — structured from Associate foundations to Expert-level research applications. 
          Every study guide contains curated resources directly from official Anthropic documentation.
        </p>

        {/* Cert path visual */}
        <div className="ccp-path-visual">
          {CLAUDE_CERTS.map((cert, i) => (
            <React.Fragment key={cert.id}>
              <button 
                className="ccp-path-step"
                onClick={() => {
                  const el = document.getElementById(cert.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                aria-label={`Scroll to ${cert.title}`}
              >
                <div className="ccp-path-circle" style={{ background: cert.gradient }}>
                  <span>{cert.levelNum}</span>
                </div>
                <span className="ccp-path-label" style={{ color: cert.color }}>{cert.level}</span>
              </button>
              {i < CLAUDE_CERTS.length - 1 && (
                <div className="ccp-path-connector" aria-hidden="true">
                  <div className="ccp-path-connector-line" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── CERT CARDS ── */}
      <main className="ccp-main">
        <div className="ccp-cert-grid">
          {CLAUDE_CERTS.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {/* Note about exam prep */}
        <div className="ccp-note-card">
          <div className="ccp-note-icon">💡</div>
          <div className="ccp-note-body">
            <h3>Are these guides enough to pass the certification exam?</h3>
            <p>
              Every study guide here is built <strong>directly from the official Anthropic exam blueprint</strong> — the exact domains, objectives, and documentation links that Anthropic publishes. 
              We cover 100% of exam topics with curated Anthropic docs links. 
              To maximize your score, work through all resources in each domain, practice on the Anthropic platform, and use Claude hands-on daily.
            </p>
            <div className="ccp-note-tips">
              <span className="ccp-note-tip">✅ Official Anthropic docs</span>
              <span className="ccp-note-tip">✅ 100% exam domain coverage</span>
              <span className="ccp-note-tip">✅ Curated, not bloated</span>
              <span className="ccp-note-tip">✅ Free forever</span>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
