import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, ExternalLink,
  Code2, Database, Cloud, Server, Wrench, Cpu,
  Zap, Shield, ChevronDown, Globe, CheckCircle, Award
} from 'lucide-react';
import './PortfolioPage.css';

/* ──────────────────────────────────────────
   ANIMATION HELPERS
────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = (delay = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } }
});

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

/* Scroll-aware wrapper */
const Reveal = ({ children, variants = fadeUp, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* Animated counter */
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ──────────────────────────────────────────
   DATA
────────────────────────────────────────── */
const SKILLS = [
  {
    icon: <Code2 size={22} />,
    name: 'Languages & Frameworks',
    tags: ['Java 17/21', 'Spring Boot 3.x', 'Spring MVC', 'Spring Data JPA', 'Hibernate ORM', 'RESTful APIs']
  },
  {
    icon: <Server size={22} />,
    name: 'Microservices & Messaging',
    tags: ['Microservices Architecture', 'Apache Kafka', 'RabbitMQ', 'Event-Driven Design', 'API Gateway']
  },
  {
    icon: <Database size={22} />,
    name: 'Databases & Caching',
    tags: ['MySQL', 'SQL Optimization', 'Redis', 'JDBC', 'Composite Indexing', 'Connection Pooling']
  },
  {
    icon: <Cpu size={22} />,
    name: 'DevOps & CI/CD',
    tags: ['Docker', 'Kubernetes (K8s)', 'Helm Charts', 'Jenkins CI/CD', 'SonarQube', 'Multi-stage Builds']
  },
  {
    icon: <Cloud size={22} />,
    name: 'Cloud & Security',
    tags: ['AWS', 'JWT Auth', 'OAuth 2.0', 'RBAC', 'HTTPS/TLS', 'Swagger / OpenAPI 3.0']
  },
  {
    icon: <Wrench size={22} />,
    name: 'AI Tools & Testing',
    tags: ['GitHub Copilot', 'Agentic AI Workflows', 'JUnit 5', 'Mockito', 'Postman', 'Git / GitHub']
  }
];

const EXPERIENCES = [
  {
    role: 'Java Developer',
    company: 'Capgemini — Client: GE Aerospace',
    date: 'Aug 2024 – Present',
    bullets: [
      'Owned end-to-end delivery of a core Spring Boot microservice processing 50,000+ daily transactions across US, UK & India.',
      'Reduced API latency by 50% (800ms → 400ms) via SQL query optimization, composite indexing, and connection pool tuning.',
      'Containerized service with Docker multi-stage builds and authored a Helm chart for Kubernetes — cutting deployment time by 80%.',
      'Secured REST APIs with JWT, OAuth 2.0 & RBAC for aerospace-grade operational data protection.',
      'Drove event-driven architecture using Apache Kafka and Apache Flink for real-time stream processing.',
      'Appointed COE Team Lead — delivered daily DevOps knowledge-transfer sessions (Docker, K8s, Jenkins, Helm) to 7 juniors.'
    ]
  },
  {
    role: 'Full Stack Developer — Chaitanya Tech World',
    company: 'Independent Project',
    date: '2024 – Present',
    bullets: [
      'Built a production-grade full-stack platform with React.js frontend and Spring Boot backend serving 10+ active modules.',
      'Engineered a Job Portal with JWT-secured REST APIs, dynamic search with Spring Data JPA, and iText PDF generation.',
      'Integrated a real-time analytics engine capturing visitor sessions, browser metadata, and system info into MySQL.',
      'Developed an AI Resume Builder, Prompts Gallery, Roadmap Generator, and Admin CMS — all deployed and live.'
    ]
  },
  {
    role: 'Full Stack Developer — WebMethods AI',
    company: 'Independent Project',
    date: '2026 – Present',
    bullets: [
      'Designed an AI-assisted tool that auto-generates webMethods IS packages and scaffolds their complete folder structure.',
      'Built an auto-documentation engine parsing flow-service structures and producing technical docs from configurations.',
      'Developed an AI-driven error analyzer surfacing root causes from IS logs and service configurations.',
      'Integrated LLM-based generation logic into a React + Spring Boot full-stack architecture.'
    ]
  }
];

const EDUCATION = [
  { degree: 'Master of Computer Applications (MCA)', uni: 'Andhra University, Visakhapatnam', gpa: '8.6 CGPA', year: '2024–2026' },
  { degree: 'B.Sc. Computer Science', uni: 'Dr. B.R. Ambedkar University, Rajam', gpa: '8.2 CGPA', year: '2019–2022' }
];

const CERTS = [
  { name: 'GitHub Copilot for Software Engineering Practitioners', issuer: 'Microsoft — 2026' },
  { name: 'GitHub Copilot Fundamentals: AI-Paired Programming', issuer: 'Microsoft — 2026' },
  { name: 'Java OCEAN Certification Level 1 & Level 2', issuer: 'Capgemini — 2025, 2026' },
  { name: 'Java Full Stack Developer Certification', issuer: 'Frontlines Media Edutech — 2024' }
];

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const PortfolioPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Detect theme from html data-theme attribute
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';

  return (
    <div className="portfolio-page" data-theme={theme}>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="port-hero">
        <div className="port-hero__bg" />
        <div className="port-hero__overlay" />
        <div className="port-hero__orb port-hero__orb--1" />
        <div className="port-hero__orb port-hero__orb--2" />

        <div className="port-container">
          <div className="port-hero__content">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger(0.12)}
              className="port-hero__text-column"
            >
              <motion.div variants={fadeUp}>
                <span className="port-hero__eyebrow">
                  <span className="port-hero__eyebrow-dot" />
                  Available for opportunities
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="port-hero__name">
                Chaitanya<br />Gidijala.
              </motion.h1>

              <motion.p variants={fadeUp} className="port-hero__title">
                <span>Java Developer</span> &amp; Full Stack Engineer
              </motion.p>

              <motion.p variants={fadeUp} className="port-hero__description">
                I design and ship enterprise-grade microservices and full-stack products.
                Currently working at <strong>Capgemini on GE Aerospace</strong>, building systems
                that process 50,000+ daily transactions — with Java, Spring Boot, Kafka, Docker,
                Kubernetes and AI-assisted workflows.
              </motion.p>

              <motion.div variants={fadeUp} className="port-hero__actions">
                <a href="mailto:chaitugidijala@gmail.com" className="btn-hero-primary">
                  <Mail size={16} /> Get In Touch
                </a>
                <a href="https://chaitanyatechworld.com" target="_blank" rel="noreferrer" className="btn-hero-ghost">
                  <Globe size={16} /> View Live Project
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="port-hero__socials">
                <a href="https://linkedin.com/in/chaitanya-gidijala" target="_blank" rel="noreferrer" className="port-social-btn" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="https://github.com/Chaitanya-Gidijala" target="_blank" rel="noreferrer" className="port-social-btn" title="GitHub">
                  <Github size={18} />
                </a>
                <a href="mailto:chaitugidijala@gmail.com" className="port-social-btn" title="Email">
                  <Mail size={18} />
                </a>
                <a href="tel:+917337072766" className="port-social-btn" title="Phone">
                  <Phone size={18} />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeLeft}
              className="port-hero__visual-column"
            >
               <div className="port-hero__3d-card">
                 <div className="port-hero__3d-card-inner">
                    <div className="code-header">
                       <span className="dot dot-red"></span>
                       <span className="dot dot-yellow"></span>
                       <span className="dot dot-green"></span>
                    </div>
                    <pre className="code-content">
<code>
<span className="keyword">package</span> com.portfolio;{"\n\n"}
<span className="keyword">import</span> org.springframework.boot.SpringApplication;{"\n"}
<span className="keyword">import</span> org.springframework.boot.autoconfigure.SpringBootApplication;{"\n\n"}
<span className="annotation">@SpringBootApplication</span>{"\n"}
<span className="keyword">public class</span> <span className="class-name">DeveloperProfile</span> {"{"}{"\n"}
    <span className="keyword">public static void</span> <span className="method-name">main</span>(String[] args) {"{"}{"\n"}
        SpringApplication.<span className="method-name">run</span>(DeveloperProfile.class, args);{"\n"}
        System.out.<span className="method-name">println</span>(<span className="string">"Ready to build scalable systems."</span>);{"\n"}
    {"}"}{"\n"}
{"}"}
</code>
                    </pre>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>

        <div className="port-scroll-hint">
          <ChevronDown size={16} />
          scroll
        </div>
      </section>

      {/* ══════════════════════════════
          STAT STRIP
      ══════════════════════════════ */}
      <section className="port-stats">
        <div className="port-container">
          <div className="port-stats__grid">
            {[
              { num: 50, suffix: 'K+', label: 'Daily Transactions Handled' },
              { num: 50, suffix: '%', label: 'API Latency Reduction' },
              { num: 80, suffix: '%', label: 'Faster Deployments via K8s' },
              { num: 10, suffix: '+', label: 'Live Application Modules' }
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="port-stat">
                  <span className="port-stat__num">
                    <Counter to={s.num} suffix={s.suffix} />
                  </span>
                  <span className="port-stat__label">{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURED PROJECT — CTW
      ══════════════════════════════ */}
      <section className="port-section">
        <div className="port-container">
          <Reveal>
            <span className="port-section-label">Featured Build</span>
            <h2 className="port-section-title">Chaitanya Tech World</h2>
            <p className="port-section-sub">
              A full-stack platform I designed, built, and deployed entirely — showcasing what one developer can ship end-to-end.
            </p>
          </Reveal>

          <Reveal variants={scaleIn}>
            <div className="port-feature-card">
              <span className="port-feature-badge">
                <CheckCircle size={12} /> Live &amp; Production
              </span>
              <h3 className="port-feature-title">A Complete Developer Ecosystem</h3>
              <p className="port-feature-desc">
                An end-to-end production platform built from scratch using React.js, Spring Boot, MySQL, Docker, and GitHub APIs.
                It includes a Job Portal, AI Resume Builder, Prompts Gallery, Developer Roadmaps, Quiz &amp; Prep Hub,
                an Analytics Dashboard with real-time visitor tracking, a GitHub-backed Image Manager, and a full Admin CMS —
                all secured with JWT authentication, live on the web.
              </p>

              <div className="port-feature-tech">
                {['React.js', 'Spring Boot', 'MySQL', 'JWT Auth', 'Docker', 'GitHub API', 'Framer Motion', 'iText PDF', 'Redis', 'REST APIs'].map(t => (
                  <span key={t} className="tech-pill">{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <a href="https://chaitanyatechworld.com" target="_blank" rel="noreferrer" className="port-feature-link">
                  <Globe size={16} /> View Live Site <ExternalLink size={14} />
                </a>
                <a href="https://github.com/Chaitanya-Gidijala" target="_blank" rel="noreferrer" className="port-feature-link">
                  <Github size={16} /> GitHub <ExternalLink size={14} />
                </a>
              </div>

              <div className="port-feature-highlights">
                <div className="port-highlight">
                  <span className="port-highlight__num">10+</span>
                  <span className="port-highlight__txt">Functional Modules</span>
                </div>
                <div className="port-highlight">
                  <span className="port-highlight__num">Full</span>
                  <span className="port-highlight__txt">Stack — Frontend to DB</span>
                </div>
                <div className="port-highlight">
                  <span className="port-highlight__num">Live</span>
                  <span className="port-highlight__txt">Deployed &amp; In Use</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════
          SKILLS
      ══════════════════════════════ */}
      <section className="port-section port-section--alt">
        <div className="port-container">
          <Reveal>
            <span className="port-section-label">Capabilities</span>
            <h2 className="port-section-title">Built to Engineer at Scale</h2>
            <p className="port-section-sub">
              From microservices handling 50K+ daily transactions to full-stack applications, here is the complete tech arsenal I use to build enterprise systems.
            </p>
          </Reveal>

          <motion.div
            className="port-skills-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger(0.08)}
          >
            {SKILLS.map((skill, i) => (
              <motion.div key={i} className="port-skill-card" variants={fadeUp}>
                <div className="port-skill-icon">{skill.icon}</div>
                <h3 className="port-skill-name">{skill.name}</h3>
                <div className="port-skill-tags">
                  {skill.tags.map(t => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════
          EXPERIENCE
      ══════════════════════════════ */}
      <section className="port-section">
        <div className="port-container">
          <Reveal>
            <span className="port-section-label">Career</span>
            <h2 className="port-section-title">Where I Have Worked</h2>
            <p className="port-section-sub">
              Building production systems at enterprise scale and independently shipping full-stack products from idea to deployment.
            </p>
          </Reveal>

          <div className="port-timeline">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={i} variants={fadeLeft} delay={i * 0.1}>
                <div className="port-timeline-item">
                  <div className="port-timeline-dot" />
                  <div className="port-exp-card">
                    <div className="port-exp-top">
                      <div>
                        <h3 className="port-exp-role">{exp.role}</h3>
                        <p className="port-exp-company"><Zap size={14} />{exp.company}</p>
                      </div>
                      <span className="port-exp-date">{exp.date}</span>
                    </div>
                    <ul className="port-exp-bullets">
                      {exp.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          EDUCATION & CERTS
      ══════════════════════════════ */}
      <section className="port-section port-section--alt">
        <div className="port-container">
          <Reveal>
            <span className="port-section-label">Background</span>
            <h2 className="port-section-title">Education &amp; Certifications</h2>
          </Reveal>

          <div className="port-edu-grid">
            {/* Education */}
            <div>
              <Reveal>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 700 }}>Academic</h3>
              </Reveal>
              {EDUCATION.map((e, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="port-edu-item">
                    <h4 className="port-edu-degree">{e.degree}</h4>
                    <p className="port-edu-uni">{e.uni}</p>
                    <div className="port-edu-meta">
                      <span className="port-edu-chip">{e.gpa}</span>
                      <span className="port-edu-chip">{e.year}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <Reveal>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 700 }}>
                  <Award size={18} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent)' }} />
                  Certifications
                </h3>
              </Reveal>
              {CERTS.map((c, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="port-cert-item">
                    <p className="port-cert-name">{c.name}</p>
                    <p className="port-cert-issuer">{c.issuer}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CONTACT CTA
      ══════════════════════════════ */}
      <section className="port-section">
        <div className="port-container">
          <Reveal variants={scaleIn}>
            <div className="port-contact-card">
              <h2 className="port-contact-title">Let's Build Something Together</h2>
              <p className="port-contact-sub">
                Open to full-time roles, freelance projects, and collaborations. If you're looking for a Java developer who can own a system end-to-end — let's talk.
              </p>
              <div className="port-contact-links">
                <a href="mailto:chaitugidijala@gmail.com" className="port-contact-btn">
                  <Mail size={16} /> chaitugidijala@gmail.com
                </a>
                <a href="https://linkedin.com/in/chaitanya-gidijala" target="_blank" rel="noreferrer" className="port-contact-btn">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href="tel:+917337072766" className="port-contact-btn">
                  <Phone size={16} /> +91 733 707 2766
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
