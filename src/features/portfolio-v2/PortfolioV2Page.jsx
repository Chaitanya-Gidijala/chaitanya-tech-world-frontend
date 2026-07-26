import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Menu, X, Download, Code, Layout, 
  Database, Server, ExternalLink, Send, Phone, MapPin, 
  Briefcase, GraduationCap, Award, CheckCircle, Zap, Layers, ShieldCheck, CheckCircle2, Loader2
} from 'lucide-react';
import config from '../../config/apiConfig';
import './PortfolioV2Page.css';

const PortfolioV2Page = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Contact Form State
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleInput = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const payload = {
        name: form.name,
        email: form.email,
        phone: 'N/A', // Adding default to match ContactPage schema
        serviceType: form.subject || 'Portfolio Contact',
        budget: 0,
        message: form.message
    };

    // Fire and forget API request
    fetch(config.endpoints.contact.submit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(err => console.error('Submission error:', err));

    // Simulate short network delay for smooth UX
    setTimeout(() => {
        setSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  // Framer motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  const scrollFade = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="portv2-wrapper">
      <div className="portv2-bg-blob portv2-bg-blob--1"></div>
      <div className="portv2-bg-blob portv2-bg-blob--2"></div>
      
      <div className="portv2-container">
        
        {/* ================= HEADER ================= */}
        <header className={`portv2-header ${isScrolled ? 'scrolled' : ''}`}>
          <a href="#" className="portv2-logo">CG.</a>
          
          <nav className="portv2-nav">
            <a href="#">Home</a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
          
          <a href="#contact" className="portv2-btn-header">Hire Me</a>
          
          <button className="portv2-mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        {/* MOBILE MENU OVERLAY */}
        <div className={`portv2-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <button className="portv2-mobile-menu-close" onClick={closeMenu}>
            <X size={32} />
          </button>
          <a href="#" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>

        {/* ================= HERO SECTION ================= */}
        <section className="portv2-hero">
          <motion.div 
            className="portv2-hero-left"
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span className="portv2-eyebrow" variants={fadeUp}>
              Software Engineer
            </motion.span>
            
            <motion.p className="portv2-greeting" variants={fadeUp}>
              Hi I am
            </motion.p>
            
            <motion.h1 className="portv2-name" variants={fadeUp}>
              Chaitanya Gidijala
            </motion.h1>
            
            <motion.h2 className="portv2-role" variants={fadeUp}>
              Java Developer <br/>&amp; Full Stack Engineer
            </motion.h2>

            <motion.div className="portv2-contact-chips" variants={fadeUp}>
              <span className="portv2-chip"><MapPin size={14}/> Hyderabad, IN</span>
              <span className="portv2-chip"><Phone size={14}/> +91 7337072766</span>
              <span className="portv2-chip"><Mail size={14}/> chaitugidijala@gmail.com</span>
            </motion.div>

            <motion.div className="portv2-socials" variants={fadeUp}>
              <a href="https://linkedin.com/in/chaitanya-gidijala" target="_blank" rel="noreferrer" className="portv2-social-link"><Linkedin size={18} /></a>
              <a href="https://github.com/chaitanya-gidijala" target="_blank" rel="noreferrer" className="portv2-social-link"><Github size={18} /></a>
            </motion.div>

            <motion.div className="portv2-actions" variants={fadeUp}>
              <a href="#contact" className="portv2-btn-primary">
                Hire Me <Send size={16}/>
              </a>
              <a href="/resume.pdf" target="_blank" className="portv2-btn-secondary">
                Download CV <Download size={16}/>
              </a>
            </motion.div>

            <motion.div className="portv2-stats" variants={fadeUp}>
              <div className="portv2-stat-item">
                <div className="portv2-stat-number">2+</div>
                <div className="portv2-stat-label">Years Exp.</div>
              </div>
              <div className="portv2-stat-item">
                <div className="portv2-stat-number">15+</div>
                <div className="portv2-stat-label">REST APIs</div>
              </div>
              <div className="portv2-stat-item">
                <div className="portv2-stat-number">50k+</div>
                <div className="portv2-stat-label">Daily Txns</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="portv2-hero-right"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="portv2-image-wrapper">
              <div className="portv2-image-ring"></div>
              <div className="portv2-image-bg"></div>
              <img src="/portfolio-v2-hero.png" alt="Chaitanya Gidijala Vector" className="portv2-image" />
            </div>
          </motion.div>
        </section>

        {/* ================= ABOUT & SKILLS ================= */}
        <section id="about" className="portv2-section">
          <motion.div className="portv2-section-header" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
            <span className="portv2-section-label">Discover</span>
            <h2 className="portv2-section-title">About <span>Me</span></h2>
            <p className="portv2-section-subtitle">A brief look at who I am and my core technical competencies.</p>
          </motion.div>

          <div className="portv2-about-content">
            <motion.div className="portv2-about-image-wrapper" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-about-glow"></div>
              <div className="portv2-about-image-inner">
                <img src="/portfolio-v2-about.png" alt="Tech Abstract" className="portv2-about-img" />
              </div>
            </motion.div>
            
            <motion.div className="portv2-about-text" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <p>
                I am a Java Developer with 2+ years of experience building, testing, and operating production <strong>Spring Boot microservices</strong> on an enterprise platform for <span className="highlight">GE Aerospace</span>, processing <strong>50,000+ daily transactions</strong> across US, UK, and India operations.
              </p>
              <p>
                I apply <strong>AI-assisted development practices</strong> daily—using GitHub Copilot and agentic coding workflows for scaffolding, code review, and test generation. I strongly enforce automated quality and deployment gates (SonarQube, Jenkins CI/CD) and actively implement security test cases to catch edge-case vulnerabilities.
              </p>
              
              <div className="portv2-about-highlights">
                <div className="portv2-about-highlight-card">
                  <div className="portv2-about-highlight-icon"><Server size={18} /></div>
                  <div className="portv2-about-highlight-text">Delivered 15+ production REST APIs end-to-end</div>
                </div>
                <div className="portv2-about-highlight-card">
                  <div className="portv2-about-highlight-icon"><Zap size={18} /></div>
                  <div className="portv2-about-highlight-text">Reduced API response latency by 50% via SQL opt.</div>
                </div>
                <div className="portv2-about-highlight-card">
                  <div className="portv2-about-highlight-icon"><Layers size={18} /></div>
                  <div className="portv2-about-highlight-text">Docker containerization & K8s/Helm deployments</div>
                </div>
                <div className="portv2-about-highlight-card">
                  <div className="portv2-about-highlight-icon"><ShieldCheck size={18} /></div>
                  <div className="portv2-about-highlight-text">Rigorous security & automated CI/CD pipelines</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="portv2-skills-categories" style={{ marginTop: '4rem' }}>
            <motion.div className="portv2-skill-cat" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-skill-cat-header">
                <div className="portv2-skill-cat-icon"><Code size={20}/></div>
                <h3 className="portv2-skill-cat-name">Languages & Frameworks</h3>
              </div>
              <div className="portv2-skill-tags">
                <span className="portv2-skill-tag">Java 17/21</span>
                <span className="portv2-skill-tag">Spring Boot 3.x</span>
                <span className="portv2-skill-tag">Spring Data JPA / Hibernate</span>
                <span className="portv2-skill-tag">RESTful APIs</span>
                <span className="portv2-skill-tag">Microservices</span>
                <span className="portv2-skill-tag">SQL</span>
              </div>
            </motion.div>

            <motion.div className="portv2-skill-cat" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-skill-cat-header">
                <div className="portv2-skill-cat-icon"><Server size={20}/></div>
                <h3 className="portv2-skill-cat-name">Infrastructure, Database & DevOps</h3>
              </div>
              <div className="portv2-skill-tags">
                <span className="portv2-skill-tag">MySQL</span>
                <span className="portv2-skill-tag">Redis</span>
                <span className="portv2-skill-tag">Apache Kafka</span>
                <span className="portv2-skill-tag">Docker</span>
                <span className="portv2-skill-tag">Kubernetes (K8s)</span>
                <span className="portv2-skill-tag">Helm Charts</span>
                <span className="portv2-skill-tag">Jenkins CI/CD</span>
                <span className="portv2-skill-tag">AWS (EC2, S3, RDS)</span>
              </div>
            </motion.div>

            <motion.div className="portv2-skill-cat" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-skill-cat-header">
                <div className="portv2-skill-cat-icon"><Database size={20}/></div>
                <h3 className="portv2-skill-cat-name">AI, Security & Tools</h3>
              </div>
              <div className="portv2-skill-tags">
                <span className="portv2-skill-tag">GitHub Copilot</span>
                <span className="portv2-skill-tag">Agentic AI Workflows</span>
                <span className="portv2-skill-tag">JWT & OAuth 2.0</span>
                <span className="portv2-skill-tag">SonarQube</span>
                <span className="portv2-skill-tag">JUnit 5 & Mockito</span>
                <span className="portv2-skill-tag">Swagger/OpenAPI</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= EXPERIENCE ================= */}
        <section id="experience" className="portv2-section">
          <motion.div className="portv2-section-header" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
            <span className="portv2-section-label">Career</span>
            <h2 className="portv2-section-title">Professional <span>Experience</span></h2>
            <p className="portv2-section-subtitle">My journey building enterprise and independent platforms.</p>
          </motion.div>

          <div className="portv2-timeline">
            
            <motion.div className="portv2-timeline-item" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-timeline-dot"></div>
              <div className="portv2-exp-card">
                <div className="portv2-exp-top">
                  <div>
                    <h3 className="portv2-exp-role">Java Developer</h3>
                    <div className="portv2-exp-company"><Briefcase size={14}/> Capgemini</div>
                  </div>
                  <span className="portv2-exp-date">Aug 2024 - Present</span>
                </div>
                <div className="portv2-exp-client">Client: GE Aerospace - Enterprise Microservices Platform</div>
                <ul className="portv2-exp-bullets">
                  <li>Owned end-to-end delivery of a core Spring Boot microservice—architecture, REST API design, and deployment—using GitHub Copilot and agentic AI workflows.</li>
                  <li>Configured Jenkins CI/CD pipeline with SonarQube as a hard deployment gate, embedding security-and-quality-as-code practices.</li>
                  <li>Reduced API response latency by 50% (800ms → 400ms) by optimizing SQL queries, adding composite indexing, and tuning connection pooling.</li>
                  <li>Containerized microservices with Docker multi-stage builds and authored Helm charts for Kubernetes, cutting deployment time by 80%.</li>
                  <li>Secured REST APIs with JWT authentication, OAuth 2.0, and RBAC for production-facing aerospace endpoints.</li>
                  <li>Appointed COE Team Lead: ran daily knowledge-transfer sessions on Docker, Kubernetes, Jenkins for 7 junior developers.</li>
                </ul>
              </div>
            </motion.div>

            <motion.div className="portv2-timeline-item" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-timeline-dot"></div>
              <div className="portv2-exp-card">
                <div className="portv2-exp-top">
                  <div>
                    <h3 className="portv2-exp-role">Java Backend Developer (Independent)</h3>
                    <div className="portv2-exp-company"><Briefcase size={14}/> Chaitanya Tech World</div>
                  </div>
                  <span className="portv2-exp-date">2024 - Present</span>
                </div>
                <ul className="portv2-exp-bullets">
                  <li>Built Spring Boot REST APIs for a Resume Builder and Job Portal, applying production-level request validation and exception handling.</li>
                  <li>Used Spring Data JPA with MySQL to model job listings and user profiles with dynamic search queries.</li>
                  <li>Implemented JWT-based authentication with protected routes for the Job Portal layer.</li>
                  <li>Integrated iText library for on-the-fly PDF resume generation and configured SLF4J/Logback for request tracing.</li>
                </ul>
              </div>
            </motion.div>

            <motion.div className="portv2-timeline-item" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-timeline-dot"></div>
              <div className="portv2-exp-card">
                <div className="portv2-exp-top">
                  <div>
                    <h3 className="portv2-exp-role">AI Developer (Independent)</h3>
                    <div className="portv2-exp-company"><Briefcase size={14}/> WebMethods AI Automation</div>
                  </div>
                  <span className="portv2-exp-date">2026 - Present</span>
                </div>
                <ul className="portv2-exp-bullets">
                  <li>Designed an AI-assisted tool that automatically generates webMethods IS packages and scaffolds structures.</li>
                  <li>Built an auto-documentation engine parsing package flows to reduce manual documentation efforts.</li>
                  <li>Developed an AI-driven error analyzer inspecting flow service logs for root cause analysis and suggested fixes.</li>
                  <li>Built frontend in React.js and backend in Spring Boot integrating LLM-based generation logic.</li>
                </ul>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ================= PROJECTS / PORTFOLIO ================= */}
        <section id="projects" className="portv2-section">
          <motion.div className="portv2-section-header" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
            <span className="portv2-section-label">Showcase</span>
            <h2 className="portv2-section-title">Independent <span>Projects</span></h2>
            <p className="portv2-section-subtitle">Highlights from my full-stack independent builds.</p>
          </motion.div>

          <div className="portv2-portfolio-grid">
            
            <motion.div className="portv2-project-card" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-project-img-wrap">
                <div className="portv2-project-overlay"></div>
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" alt="Chaitanya Tech World" className="portv2-project-img" />
              </div>
              <div className="portv2-project-content">
                <div className="portv2-project-tags">
                  <span className="portv2-project-tag">Spring Boot</span>
                  <span className="portv2-project-tag">React</span>
                  <span className="portv2-project-tag">MySQL</span>
                </div>
                <h3 className="portv2-project-title">Chaitanya Tech World</h3>
                <p className="portv2-project-desc">A complete developer ecosystem featuring a job portal, resume builder, AI prompts, and developer roadmaps.</p>
                <div className="portv2-project-links">
                  <a href="/" className="portv2-project-link"><ExternalLink size={16}/> Live App</a>
                </div>
              </div>
            </motion.div>

            <motion.div className="portv2-project-card" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-project-img-wrap">
                <div className="portv2-project-overlay"></div>
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" alt="WebMethods AI" className="portv2-project-img" />
              </div>
              <div className="portv2-project-content">
                <div className="portv2-project-tags">
                  <span className="portv2-project-tag">Java LLM API</span>
                  <span className="portv2-project-tag">React</span>
                  <span className="portv2-project-tag">AI Agentic</span>
                </div>
                <h3 className="portv2-project-title">WebMethods AI Gen</h3>
                <p className="portv2-project-desc">AI automation tool integrating LLM logic to generate IS packages, auto-document code, and analyze error logs.</p>
                <div className="portv2-project-links">
                  <a href="#" className="portv2-project-link"><Github size={16}/> Source Code</a>
                </div>
              </div>
            </motion.div>

            <motion.div className="portv2-project-card" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-project-img-wrap">
                <div className="portv2-project-overlay"></div>
                <img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80" alt="Enterprise Platform" className="portv2-project-img" />
              </div>
              <div className="portv2-project-content">
                <div className="portv2-project-tags">
                  <span className="portv2-project-tag">Kafka</span>
                  <span className="portv2-project-tag">Docker/K8s</span>
                  <span className="portv2-project-tag">OAuth 2.0</span>
                </div>
                <h3 className="portv2-project-title">Enterprise Microservices</h3>
                <p className="portv2-project-desc">Scalable RESTful microservices architecture using Spring Boot, Kafka event-streaming, JWT/OAuth, and Helm deployments.</p>
                <div className="portv2-project-links">
                  <a href="#" className="portv2-project-link"><Github size={16}/> Architecture</a>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ================= EDUCATION & CERTIFICATIONS ================= */}
        <section className="portv2-section">
          <div className="portv2-edu-certs-grid">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                <h2 className="portv2-section-title">Education</h2>
              </div>
              <div className="portv2-edu-list">
                <div className="portv2-edu-card">
                  <h3 className="portv2-edu-degree">Master of Computer Applications (MCA)</h3>
                  <div className="portv2-edu-uni">Andhra University, Visakhapatnam</div>
                  <div className="portv2-edu-meta">
                    <span>2024 - 2026</span>
                    <span>CGPA: 8.6</span>
                  </div>
                </div>
                <div className="portv2-edu-card">
                  <h3 className="portv2-edu-degree">Bachelor of Science, Computer Science</h3>
                  <div className="portv2-edu-uni">Dr. B.R. Ambedkar University, Rajam</div>
                  <div className="portv2-edu-meta">
                    <span>2019 - 2022</span>
                    <span>CGPA: 8.2</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade} transition={{ delay: 0.1 }}>
              <div className="portv2-section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                <h2 className="portv2-section-title">Certifications</h2>
              </div>
              <div className="portv2-cert-list">
                <div className="portv2-cert-card">
                  <Award size={20} color="#f97316" style={{ marginBottom: '0.5rem' }}/>
                  <h3 className="portv2-cert-name">Microsoft GitHub Copilot for SE Practitioners</h3>
                  <div className="portv2-cert-year">2026</div>
                </div>
                <div className="portv2-cert-card">
                  <Award size={20} color="#f97316" style={{ marginBottom: '0.5rem' }}/>
                  <h3 className="portv2-cert-name">GitHub Copilot Fundamentals: AI-Paired Programming</h3>
                  <div className="portv2-cert-year">2026</div>
                </div>
                <div className="portv2-cert-card">
                  <Award size={20} color="#f97316" style={{ marginBottom: '0.5rem' }}/>
                  <h3 className="portv2-cert-name">Java OCEAN Certification Level 1 & Level 2</h3>
                  <div className="portv2-cert-year">Capgemini - 2025/2026</div>
                </div>
                <div className="portv2-cert-card">
                  <Award size={20} color="#f97316" style={{ marginBottom: '0.5rem' }}/>
                  <h3 className="portv2-cert-name">Java Full Stack Developer</h3>
                  <div className="portv2-cert-year">Frontlines Media - 2024</div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="portv2-section">
          <motion.div className="portv2-section-header" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
            <span className="portv2-section-label">Connect</span>
            <h2 className="portv2-section-title">Contact <span>Me</span></h2>
            <p className="portv2-section-subtitle">Reach out to discuss opportunities or collaboration.</p>
          </motion.div>

          <div className="portv2-contact-wrapper">
            <motion.div className="portv2-contact-info-list" initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-contact-item">
                <div className="portv2-contact-icon"><Phone size={24} /></div>
                <div className="portv2-contact-detail">
                  <h4>Phone</h4>
                  <p>+91 7337072766</p>
                </div>
              </div>
              <div className="portv2-contact-item">
                <div className="portv2-contact-icon"><Mail size={24} /></div>
                <div className="portv2-contact-detail">
                  <h4>Email</h4>
                  <a href="mailto:chaitugidijala@gmail.com">chaitugidijala@gmail.com</a>
                </div>
              </div>
              <div className="portv2-contact-item">
                <div className="portv2-contact-icon"><Linkedin size={24} /></div>
                <div className="portv2-contact-detail">
                  <h4>LinkedIn</h4>
                  <a href="https://www.linkedin.com/in/chaitanya-gidijala-660406231/" target="_blank" rel="noreferrer">Chaitanya Gidijala</a>
                </div>
              </div>
              <div className="portv2-contact-item">
                <div className="portv2-contact-icon"><Github size={24} /></div>
                <div className="portv2-contact-detail">
                  <h4>GitHub</h4>
                  <a href="https://github.com/chaitanya-gidijala" target="_blank" rel="noreferrer">chaitanya-gidijala</a>
                </div>
              </div>
            </motion.div>
            
            <motion.form className="portv2-contact-form" onSubmit={handleSubmit} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={scrollFade}>
              <div className="portv2-form-row">
                <div className="portv2-form-group">
                  <input type="text" name="name" value={form.name} onChange={handleInput} className="portv2-input" placeholder="Your Name" required />
                </div>
                <div className="portv2-form-group">
                  <input type="email" name="email" value={form.email} onChange={handleInput} className="portv2-input" placeholder="Your Email" required />
                </div>
              </div>
              <div className="portv2-form-group">
                <input type="text" name="subject" value={form.subject} onChange={handleInput} className="portv2-input" placeholder="Subject" required />
              </div>
              <div className="portv2-form-group">
                <textarea name="message" value={form.message} onChange={handleInput} className="portv2-textarea" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" className={`portv2-btn-submit ${sent ? 'sent' : ''}`} disabled={sending || sent}>
                <AnimatePresence mode="wait">
                  {sending ? (
                    <motion.div key="sending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-center">
                      Sending... <Loader2 size={18} className="spin-icon" />
                    </motion.div>
                  ) : sent ? (
                    <motion.div key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center">
                      Sent Successfully! <CheckCircle2 size={18} />
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="flex-center">
                      Send Message <Send size={18} /> 
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.form>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="portv2-footer">
          <div className="portv2-footer-inner">
            <div className="portv2-footer-left">
              <p>&copy; {new Date().getFullYear()} <span>Chaitanya Gidijala</span>. All rights reserved.</p>
            </div>
            <div className="portv2-footer-socials">
              <a href="https://www.linkedin.com/in/chaitanya-gidijala-660406231/" className="portv2-footer-social" target="_blank" rel="noreferrer"><Linkedin size={18}/></a>
              <a href="https://github.com/chaitanya-gidijala" className="portv2-footer-social" target="_blank" rel="noreferrer"><Github size={18}/></a>
              <a href="mailto:chaitugidijala@gmail.com" className="portv2-footer-social"><Mail size={18}/></a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default PortfolioV2Page;
