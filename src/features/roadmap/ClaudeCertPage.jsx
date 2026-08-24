import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { claudeFoundationsData } from './data/claudeFoundationsData';
import { claudeDeveloperData } from './data/claudeDeveloperData';
import LandingFooter from '@/components/layout/LandingFooter';
import RoadmapNavbar from './RoadmapNavbar';
import './ClaudeCertPage.css';

/* ── Certification Registry ── */
const CERT_REGISTRY = {
  'claude-certified-associate-foundations': claudeFoundationsData,
  'claude-certified-developer': claudeDeveloperData,
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
        
        {/* Enriched Content Sections */}
        {domain.description && (
          <div className="cc-domain-enriched-content">
            <div className="cc-domain-desc-bar">
              <p className="cc-domain-desc">{domain.description}</p>
              <span className={`cc-priority-badge cc-priority-${domain.priority}`}>
                {domain.priority.replace('-', ' ')} Priority
              </span>
            </div>

            {domain.topicsToLearn && (
              <div className="cc-section-block">
                <h4 className="cc-block-title">Topics to Learn</h4>
                <div className="cc-topics-grid">
                  {domain.topicsToLearn.map((t, i) => (
                    <span key={i} className="cc-topic-chip" style={{ '--dc': domain.color }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="cc-two-col-block">
              {domain.importantConcepts && (
                <div className="cc-section-block">
                  <h4 className="cc-block-title">Important Concepts</h4>
                  <ul className="cc-concepts-list">
                    {domain.importantConcepts.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
              {domain.practicalSkills && (
                <div className="cc-section-block">
                  <h4 className="cc-block-title">Practical Skills to Practice</h4>
                  <ul className="cc-skills-checklist">
                    {domain.practicalSkills.map((s, i) => (
                      <li key={i}>
                        <span className="cc-check-icon">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="cc-two-col-block">
              {domain.learningOutcomes && (
                <div className="cc-section-block">
                  <h4 className="cc-block-title">Learning Outcomes</h4>
                  <ul className="cc-outcomes-list">
                    {domain.learningOutcomes.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}
              {domain.revisionPoints && (
                <div className="cc-section-block">
                  <h4 className="cc-block-title">Quick Revision Points</h4>
                  <ul className="cc-revision-list">
                    {domain.revisionPoints.map((r, i) => <li key={i}>⚡ {r}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {domain.commonMistakes && (
              <div className="cc-section-block">
                <h4 className="cc-block-title">Common Exam Traps</h4>
                <div className="cc-traps-grid">
                  {domain.commonMistakes.map((m, i) => (
                    <div key={i} className="cc-trap-card">
                      <span className="cc-trap-icon">⚠️</span>
                      <p>{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {domain.questionTypes && (
              <div className="cc-section-block">
                <h4 className="cc-block-title">Example Question Types</h4>
                <p className="cc-question-disclaimer">Note: These describe question <i>patterns</i>, not actual exam questions.</p>
                <div className="cc-questions-grid">
                  {domain.questionTypes.map((q, i) => (
                    <div key={i} className="cc-question-card">
                      <span className="cc-q-icon">❓</span>
                      <p>{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing Objectives */}
        <h4 className="cc-block-title" style={{ marginTop: '32px' }}>Learning Objectives & Resources</h4>
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
      const domainEls = document.querySelectorAll('.cc-domain');
      if (!domainEls.length) return;
      const viewportMid = window.innerHeight / 2;
      let closest = 0;
      let closestDist = Infinity;
      domainEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elMid = rect.top + rect.height / 2;
        const dist = Math.abs(elMid - viewportMid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveDomain(closest);
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
            <span className="cc-pill">✅ 720/1000 to Pass</span>
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

      {/* ── HOW TO USE & STRATEGY ── */}
      <section className="cc-strategy-section">
        <div className="cc-howto-card">
          <h2>How to Use This Roadmap</h2>
          <ol className="cc-howto-list">
            <li><strong>Learn the concepts</strong>: Read the recommended Anthropic documentation for each domain.</li>
            <li><strong>Practice the workflows</strong>: Actually use Claude for the specific skills mentioned (e.g., JSON mode, Projects, Artifacts).</li>
            <li><strong>Review common mistakes</strong>: Be aware of exam traps like blindly trusting outputs or violating Usage Policy.</li>
            <li><strong>Understand scenario-based decision making</strong>: The exam heavily focuses on applying concepts to real business scenarios.</li>
            <li><strong>Evaluate outputs</strong>: Get comfortable critically assessing Claude's responses instead of assuming they are perfect.</li>
            <li><strong>Revise by weight</strong>: Prioritize your study time according to the official domain weighting (highest weight first).</li>
            <li><strong>Use official resources</strong>: Anthropic's official documentation is your ultimate source of truth.</li>
          </ol>
        </div>

        <div className="cc-priority-card">
          <h2>Domain Priority Guide</h2>
          <div className="cc-priority-table-wrap">
            <table className="cc-priority-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Domain</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><span className="cc-priority-badge cc-priority-high">High</span></td><td>Output Evaluation and Validation</td><td>21%</td></tr>
                <tr><td><span className="cc-priority-badge cc-priority-high">High</span></td><td>Workflow Integration and Solution Design</td><td>16%</td></tr>
                <tr><td><span className="cc-priority-badge cc-priority-high">High</span></td><td>Governance, Risk, and Responsible Use</td><td>15%</td></tr>
                <tr><td><span className="cc-priority-badge cc-priority-medium-high">Med-High</span></td><td>Prompting and Task Execution</td><td>14%</td></tr>
                <tr><td><span className="cc-priority-badge cc-priority-medium">Medium</span></td><td>Product and Model Selection</td><td>12%</td></tr>
                <tr><td><span className="cc-priority-badge cc-priority-medium">Medium</span></td><td>Configuration and Knowledge Management</td><td>12%</td></tr>
                <tr><td><span className="cc-priority-badge cc-priority-lower">Lower</span></td><td>Troubleshooting and Optimization</td><td>10%</td></tr>
              </tbody>
            </table>
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

        {/* ── 2-DAY REVISION & CHECKLIST ── */}
        <div className="cc-final-prep-section">
          <div className="cc-revision-card">
            <h2>2-Day Final Revision Strategy</h2>
            <div className="cc-days-grid">
              <div className="cc-day-col">
                <h3>Day 1: High Priority (52%)</h3>
                <ul>
                  <li>Review <strong>Output Evaluation</strong> (21%): Focus on hallucination reduction and success criteria.</li>
                  <li>Review <strong>Workflow Integration</strong> (16%): Focus on use cases and connectors.</li>
                  <li>Review <strong>Governance</strong> (15%): Re-read the Acceptable Use Policy and data privacy FAQs.</li>
                </ul>
              </div>
              <div className="cc-day-col">
                <h3>Day 2: Medium/Lower (48%)</h3>
                <ul>
                  <li>Review <strong>Prompting</strong> (14%): Practice XML tags and task decomposition.</li>
                  <li>Review <strong>Models & Config</strong> (24%): Differentiate Haiku/Sonnet/Opus and Projects/Artifacts.</li>
                  <li>Review <strong>Troubleshooting</strong> (10%): Focus on diagnosing prompt vs context issues.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cc-checklist-card">
            <h2>Final Exam Checklist</h2>
            <ul className="cc-final-checklist">
              <li><label><input type="checkbox"/> I understand the differences between Haiku, Sonnet, and Opus.</label></li>
              <li><label><input type="checkbox"/> I know when to use Projects versus Artifacts.</label></li>
              <li><label><input type="checkbox"/> I can identify a hallucination and know how to prompt Claude to reduce them.</label></li>
              <li><label><input type="checkbox"/> I know how to use XML tags to separate context from instructions.</label></li>
              <li><label><input type="checkbox"/> I understand Anthropic's Acceptable Use Policy regarding sensitive data.</label></li>
              <li><label><input type="checkbox"/> I know how to define clear success criteria for an evaluation rubric.</label></li>
            </ul>
          </div>
        </div>

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
