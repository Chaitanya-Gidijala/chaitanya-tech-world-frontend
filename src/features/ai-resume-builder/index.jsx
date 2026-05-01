import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getToken } from '../job-portal/services/authService';
import apiConfig from '../../config/apiConfig';
import './styles/resume-builder.css';


/* ══════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════ */

const DEFAULT_RESUME = {
    name: 'Chaitanya Gidijala',
    title: 'Senior UI/UX Developer',
    email: 'support@chaitanyatechworld.com',
    phone: '+91 73370 72766',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/chaitanya',
    website: 'chaitanya.dev',
    summary: 'Passionate UI/UX Developer with 4+ years of experience building scalable web applications. Expertise in React, modern CSS, and design systems. Proven track record of delivering pixel-perfect interfaces that improve user engagement by 40%.',
    experience: [
        {
            id: 1,
            company: 'TechCorp Solutions',
            role: 'Senior Frontend Developer',
            period: 'Jan 2022 – Present',
            location: 'Bangalore, India',
            bullets: [
                'Led development of React-based dashboard serving 50K+ daily active users',
                'Improved application performance by 60% through code splitting and lazy loading',
                'Mentored a team of 4 junior developers and conducted code reviews',
            ],
        },
        {
            id: 2,
            company: 'StartupXYZ',
            role: 'Frontend Developer',
            period: 'Jun 2020 – Dec 2021',
            location: 'Remote',
            bullets: [
                'Built 15+ reusable React components used across 3 product lines',
                'Collaborated with UX team to create accessible, responsive interfaces',
                'Reduced CSS bundle size by 35% by introducing a design token system',
            ],
        },
    ],
    education: [
        {
            id: 1,
            institution: 'JNTU Hyderabad',
            degree: 'B.Tech in Computer Science',
            period: '2016 – 2020',
            grade: 'CGPA: 8.4 / 10',
        },
    ],
    skills: ['React.js', 'JavaScript (ES6+)', 'TypeScript', 'Node.js', 'Figma', 'CSS/SASS', 'REST APIs', 'Git', 'Agile/Scrum'],
    certifications: [
        { id: 1, name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2023' },
        { id: 2, name: 'Google UX Design Certificate', issuer: 'Google', year: '2022' },
    ],
    projects: [
        {
            id: 1,
            name: 'Real-Time Chat App',
            tech: 'React, Node.js, Socket.io',
            description: 'Built a full-stack real-time messaging platform with 500+ concurrent users',
        },
    ],
};

const TEMPLATES = [
    {
        id: 'clean-minimal',
        name: 'Clean Minimal',
        tag: 'Standard',
        tagColor: '#6366f1',
        accent: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        accentSolid: '#6366f1',
        headerBg: '#f8fafc',
        headerText: '#1e293b',
        borderAccent: '#6366f1',
        sidebarBg: '#ffffff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: '#f8fafc',
            accent: '#6366f1',
        },
    },
    {
        id: 'executive-pro',
        name: 'Executive Pro',
        tag: 'Standard',
        tagColor: '#1e293b',
        accent: 'linear-gradient(135deg,#0f172a,#1e293b)',
        accentSolid: '#1e293b',
        headerBg: '#1e293b',
        headerText: '#ffffff',
        borderAccent: '#1e293b',
        sidebarBg: '#f1f5f9',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: '#1e293b',
            accent: '#ffffff',
        },
    },
    {
        id: 'modern-edge',
        name: 'Modern Edge',
        tag: 'Standard',
        tagColor: '#059669',
        accent: 'linear-gradient(135deg,#059669,#10b981)',
        accentSolid: '#059669',
        headerBg: '#f0fdf4',
        headerText: '#064e3b',
        borderAccent: '#059669',
        sidebarBg: '#ffffff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: '#f0fdf4',
            accent: '#059669',
        },
    }
];

const PREMIUM_TEMPLATES = [
    {
        id: 'ats-expert-blue',
        name: 'ATS Expert Blue',
        tag: '👑 Premium',
        tagColor: '#2563eb',
        accentSolid: '#2563eb',
        accent: 'linear-gradient(135deg,#2563eb,#3b82f6)',
        headerBg: '#eff6ff',
        headerText: '#1e3a8a',
        borderAccent: '#2563eb',
        sidebarBg: '#ffffff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: { header: 'linear-gradient(135deg,#eff6ff,#dbeafe)', accent: '#2563eb' },
        locked: true,
        atsOptimized: true,
    },
    {
        id: 'corporate-elite',
        name: 'Corporate Elite',
        tag: '👑 Premium',
        tagColor: '#dc2626',
        accentSolid: '#dc2626',
        accent: 'linear-gradient(135deg,#dc2626,#ef4444)',
        headerBg: '#fef2f2',
        headerText: '#7f1d1d',
        borderAccent: '#dc2626',
        sidebarBg: '#ffffff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: { header: 'linear-gradient(135deg,#fef2f2,#fee2e2)', accent: '#dc2626' },
        locked: true,
        atsOptimized: true,
    },
    {
        id: 'nordic-ats',
        name: 'Nordic ATS',
        tag: '👑 Premium',
        tagColor: '#4b5563',
        accentSolid: '#4b5563',
        accent: 'linear-gradient(135deg,#4b5563,#6b7280)',
        headerBg: '#f9fafb',
        headerText: '#111827',
        borderAccent: '#4b5563',
        sidebarBg: '#ffffff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: { header: 'linear-gradient(135deg,#f9fafb,#f3f4f6)', accent: '#4b5563' },
        locked: true,
        atsOptimized: true,
    }
];

const ULTRA_PREMIUM_TEMPLATES = [
    {
        id: 'midnight-luxury',
        name: 'Midnight Luxury',
        tag: '💎 Ultra',
        tagColor: '#fbbf24',
        accentSolid: '#fbbf24',
        accent: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
        headerBg: '#111827',
        headerText: '#ffffff',
        borderAccent: '#fbbf24',
        sidebarBg: '#1f2937',
        bodyFont: "'Inter', sans-serif",
        previewThumb: { header: '#111827', accent: '#fbbf24' },
        price: 99,
        ultra: true
    },
    {
        id: 'cyber-tech-pro',
        name: 'Cyber Tech Pro',
        tag: '💎 Ultra',
        tagColor: '#00f2ff',
        accentSolid: '#00f2ff',
        accent: 'linear-gradient(135deg,#00f2ff,#0066ff)',
        headerBg: '#050a15',
        headerText: '#ffffff',
        borderAccent: '#00f2ff',
        sidebarBg: '#0a101f',
        bodyFont: "'Inter', sans-serif",
        previewThumb: { header: '#050a15', accent: '#00f2ff' },
        price: 149,
        ultra: true
    }
];

/* ── Animated counter hook ── */
function useCountUp(target, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / duration, 1);
            setCount(Math.round(p * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

function AnimatedStat({ num, suffix = '', label }) {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
        }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    const count = useCountUp(num, 1600, inView);
    return (
        <div ref={ref} className="rba-stat-card">
            <div className="rba-stat-num">{count}{suffix}</div>
            <div className="rba-stat-label">{label}</div>
        </div>
    );
}

const TESTIMONIALS = [
    { name: 'Aditya Rao', role: 'Software Engineer, Cognizant', text: 'Built my resume in 8 minutes. Got a callback from Cognizant within 3 days!', initials: 'AR' },
    { name: 'Sneha Patel', role: 'QA Analyst, Capgemini', text: 'The ATS score went from 62% to 96% after using this builder. Interview rate tripled.', initials: 'SP' },
    { name: 'Kiran Sharma', role: 'Business Analyst, Wipro', text: 'The Executive Dark template is stunning. My hiring manager loved the layout!', initials: 'KS' },
    { name: 'Pooja Nair', role: 'Frontend Dev, HCL Technologies', text: 'No sign up, no hidden fees. Best free resume builder I have ever used.', initials: 'PN' },
    { name: 'Rahul Verma', role: 'Data Analyst, Infosys BPM', text: 'Switched from PowerPoint resumes to this. The real-time preview is amazing.', initials: 'RV' },
    { name: 'Meera Krishnan', role: 'Cloud Engineer, TCS', text: 'Ocean Blue template got me shortlisted at TCS. Highly recommend the AI suggestions!', initials: 'MK' },
    { name: 'Suresh Babu', role: 'SAP Consultant, Accenture', text: 'Changed template 3 times mid-edit without losing a single line of content. Brilliant!', initials: 'SB' },
    { name: 'Deepa Joshi', role: 'HR Manager, Mphasis', text: 'The PDF quality is print-ready. Sent it directly to the interviewer during the call!', initials: 'DJ' },
    { name: 'Arjun Menon', role: 'DevOps Engineer, LTIMindtree', text: 'We use this tool internally to help freshers build their first resume. Works perfectly.', initials: 'AM' },
];

const AI_SUGGESTIONS = {
    summary: [
        'Results-driven professional with {years}+ years of experience in {field}. Proven ability to deliver high-impact solutions that increase efficiency by 40%. Adept at cross-functional collaboration and agile methodologies.',
        'Dynamic {role} with expertise in {skills}. Successfully led multiple end-to-end projects, consistently delivering ahead of schedule. Passionate about innovation and continuous learning.',
        'Strategic thinker and hands-on executor with deep knowledge of {field}. Track record of reducing operational costs by 25% while improving quality metrics. Strong communicator and team player.',
    ],
    bullets: [
        'Developed and maintained {feature} used by 50,000+ daily active users, achieving 99.9% uptime',
        'Reduced {metric} by 40% through implementation of optimized algorithms and best practices',
        'Led cross-functional team of {n} engineers to deliver project 2 weeks ahead of schedule',
        'Increased user engagement by 35% by redesigning key user flows based on A/B testing insights',
        'Automated {process} using custom tooling, saving 10+ hours of manual work per week',
    ],
};

/* ══════════════════════════════════════════════════════════════
   UTILITY: generate PDF via print
══════════════════════════════════════════════════════════════ */
function downloadResume(name) {
    const el = document.getElementById('resume-output');
    if (!el) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    const styles = Array.from(document.styleSheets)
        .filter(ss => { try { return ss.cssRules; } catch { return false; } })
        .map(ss => Array.from(ss.cssRules).map(r => r.cssText).join('\n'))
        .join('\n');
    printWindow.document.write(`
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${name} Resume</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      * { margin:0;padding:0;box-sizing:border-box; }
      body { font-family:'Inter',sans-serif; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
      @page { size: A4; margin: 0; }
      ${styles}
      .resume-print-wrap { width:210mm; min-height:297mm; margin:0; }
    </style>
    </head><body><div class="resume-print-wrap">${el.innerHTML}</div>
    <script>window.onload=()=>{window.print();window.close();}<\/script>
    </body></html>`);
    printWindow.document.close();
}

/* ══════════════════════════════════════════════════════════════
/* ══════════════════════════════════════════════════════════════
   TEMPLATE THUMBNAIL — renders real scaled resume
══════════════════════════════════════════════════════════════ */
function TemplateThumbnail({ tpl }) {
    const containerRef = React.useRef(null);
    const [scale, setScale] = React.useState(0.28); // default approx scale

    React.useEffect(() => {
        const RESUME_W = 794;
        const update = () => {
            if (containerRef.current) {
                const w = containerRef.current.clientWidth;
                setScale(w / RESUME_W);
            }
        };
        update();
        const ro = new ResizeObserver(update);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Visual height after scaling (A4 = 1123px tall)
    const scaledHeight = Math.round(1123 * scale);

    return (
        <div className="rba-tpl-real-preview">
            {/* Container that measures available width */}
            <div
                ref={containerRef}
                className="rba-tpl-preview-container"
                style={{ height: scaledHeight }}
            >
                {/* Scaled resume — 794px wide, scaled to fit */}
                <div
                    className="rba-tpl-preview-inner"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: 794,
                        pointerEvents: 'none', // prevent interaction with preview
                    }}
                >
                    <ResumeTemplate resume={DEFAULT_RESUME} tpl={tpl} />
                </div>
            </div>
            {/* Overlay label */}
            <div className="rba-tpl-preview-meta">
                <span className="rba-tpl-name">{tpl.name}</span>
                <span className="rba-tpl-tag" style={{ background: `${tpl.tagColor}22`, color: tpl.tagColor }}>{tpl.tag}</span>
            </div>
        </div>
    );
}


/* ══════════════════════════════════════════════════════════════
   RESUME TEMPLATES (actual rendered output)
══════════════════════════════════════════════════════════════ */
function ResumeTemplate({ resume, tpl }) {
    const { name, title, email, phone, location, linkedin, website, summary,
        experience, education, skills, certifications, projects } = resume;

    // Sidebar layout templates
    const sidebarTemplates = ['modern-pro', 'ocean-blue', 'purple-vibe', 'forest-green', 'slate-professional', 'ats-expert-blue', 'corporate-elite'];
    const isSidebar = sidebarTemplates.includes(tpl.id);
    const isUltra = tpl.ultra;

    if (isUltra) {
        return (
            <div className="rba-resume-ultra-layout" style={{ fontFamily: tpl.bodyFont }}>
                {/* Ultra unique design: Wide Header with floating contact card */}
                <div className="rba-ultra-header" style={{ background: tpl.headerBg }}>
                    <div className="rba-ultra-header-content">
                        <div className="rba-ultra-name" style={{ color: tpl.headerText }}>{name}</div>
                        <div className="rba-ultra-title" style={{ color: tpl.accentSolid }}>{title}</div>
                    </div>
                    <div className="rba-ultra-contact-card" style={{ borderColor: tpl.accentSolid }}>
                        {email && <div className="rba-ultra-contact-item">📧 {email}</div>}
                        {phone && <div className="rba-ultra-contact-item">📞 {phone}</div>}
                        {location && <div className="rba-ultra-contact-item">📍 {location}</div>}
                    </div>
                </div>

                <div className="rba-ultra-body">
                    {summary && (
                        <div className="rba-ultra-section">
                            <div className="rba-ultra-section-title" style={{ color: tpl.accentSolid }}>
                                <span className="rba-ultra-icon">✨</span> ABOUT ME
                            </div>
                            <p className="rba-ultra-summary">{summary}</p>
                        </div>
                    )}

                    <div className="rba-ultra-main-grid">
                        <div className="rba-ultra-col-1">
                            {experience.length > 0 && (
                                <div className="rba-ultra-section">
                                    <div className="rba-ultra-section-title" style={{ color: tpl.accentSolid }}>
                                        <span className="rba-ultra-icon">💼</span> EXPERIENCE
                                    </div>
                                    {experience.map(exp => (
                                        <div key={exp.id} className="rba-ultra-exp-item">
                                            <div className="rba-ultra-exp-meta">
                                                <div className="rba-ultra-exp-role">{exp.role}</div>
                                                <div className="rba-ultra-exp-period">{exp.period}</div>
                                            </div>
                                            <div className="rba-ultra-exp-company" style={{ color: tpl.accentSolid }}>{exp.company}</div>
                                            <ul className="rba-ultra-bullets">
                                                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rba-ultra-col-2">
                            {skills.length > 0 && (
                                <div className="rba-ultra-section">
                                    <div className="rba-ultra-section-title" style={{ color: tpl.accentSolid }}>
                                        <span className="rba-ultra-icon">⚡</span> EXPERTISE
                                    </div>
                                    <div className="rba-ultra-skills">
                                        {skills.map((s, i) => (
                                            <span key={i} className="rba-ultra-skill" style={{ background: `${tpl.accentSolid}11`, color: tpl.accentSolid }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {education.length > 0 && (
                                <div className="rba-ultra-section">
                                    <div className="rba-ultra-section-title" style={{ color: tpl.accentSolid }}>
                                        <span className="rba-ultra-icon">🎓</span> EDUCATION
                                    </div>
                                    {education.map(edu => (
                                        <div key={edu.id} className="rba-ultra-edu-item">
                                            <div className="rba-ultra-edu-degree">{edu.degree}</div>
                                            <div className="rba-ultra-edu-school">{edu.institution}</div>
                                            <div className="rba-ultra-edu-period">{edu.period}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isSidebar) {
        return (
            <div className="rba-resume-sidebar-layout" style={{ fontFamily: tpl.bodyFont }}>
                {/* Sidebar */}
                <div className="rba-sidebar" style={{ background: tpl.sidebarBg, borderRight: `3px solid ${tpl.accentSolid}` }}>
                    <div className="rba-sidebar-header" style={{ background: tpl.headerBg }}>
                        <div className="rba-sidebar-initials" style={{ background: tpl.accentSolid }}>
                            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="rba-sidebar-name" style={{ color: tpl.headerText }}>{name}</div>
                        <div className="rba-sidebar-title" style={{ color: `${tpl.headerText}cc` }}>{title}</div>
                    </div>
                    <div className="rba-sidebar-body">
                        <div className="rba-sb-section">
                            <div className="rba-sb-section-title" style={{ color: tpl.accentSolid }}>Contact</div>
                            {email && <div className="rba-sb-contact-item">📧 {email}</div>}
                            {phone && <div className="rba-sb-contact-item">📞 {phone}</div>}
                            {location && <div className="rba-sb-contact-item">📍 {location}</div>}
                            {linkedin && <div className="rba-sb-contact-item">🔗 {linkedin}</div>}
                            {website && <div className="rba-sb-contact-item">🌐 {website}</div>}
                        </div>
                        {skills.length > 0 && (
                            <div className="rba-sb-section">
                                <div className="rba-sb-section-title" style={{ color: tpl.accentSolid }}>Skills</div>
                                <div className="rba-sb-skills">
                                    {skills.map((s, i) => (
                                        <span key={i} className="rba-sb-skill" style={{ borderColor: tpl.accentSolid, color: tpl.accentSolid }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {certifications.length > 0 && (
                            <div className="rba-sb-section">
                                <div className="rba-sb-section-title" style={{ color: tpl.accentSolid }}>Certifications</div>
                                {certifications.map(c => (
                                    <div key={c.id} className="rba-sb-cert">
                                        <div className="rba-sb-cert-name">{c.name}</div>
                                        <div className="rba-sb-cert-issuer">{c.issuer} · {c.year}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Main Content */}
                <div className="rba-main-content">
                    {summary && (
                        <div className="rba-section">
                            <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                Professional Summary
                            </div>
                            <p className="rba-summary-text">{summary}</p>
                        </div>
                    )}
                    {experience.length > 0 && (
                        <div className="rba-section">
                            <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                Work Experience
                            </div>
                            {experience.map(exp => (
                                <div key={exp.id} className="rba-exp-item">
                                    <div className="rba-exp-header">
                                        <div>
                                            <div className="rba-exp-role">{exp.role}</div>
                                            <div className="rba-exp-company">{exp.company} {exp.location && `· ${exp.location}`}</div>
                                        </div>
                                        <div className="rba-exp-period" style={{ color: tpl.accentSolid }}>{exp.period}</div>
                                    </div>
                                    <ul className="rba-bullets">
                                        {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                            <li key={i} style={{ '--bullet-color': tpl.accentSolid }}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                    {projects.length > 0 && (
                        <div className="rba-section">
                            <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                Projects
                            </div>
                            {projects.map(p => (
                                <div key={p.id} className="rba-project-item">
                                    <div className="rba-project-header">
                                        <span className="rba-project-name">{p.name}</span>
                                        <span className="rba-project-tech" style={{ background: `${tpl.accentSolid}18`, color: tpl.accentSolid }}>{p.tech}</span>
                                    </div>
                                    <div className="rba-project-desc">{p.description}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {education.length > 0 && (
                        <div className="rba-section">
                            <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                Education
                            </div>
                            {education.map(edu => (
                                <div key={edu.id} className="rba-edu-item">
                                    <div className="rba-edu-header">
                                        <div>
                                            <div className="rba-edu-degree">{edu.degree}</div>
                                            <div className="rba-edu-institution">{edu.institution}</div>
                                        </div>
                                        <div className="rba-edu-period" style={{ color: tpl.accentSolid }}>{edu.period}</div>
                                    </div>
                                    {edu.grade && <div className="rba-edu-grade">{edu.grade}</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Single-column / header-block templates (clean-minimal, executive-dark, rose-elegant)
    return (
        <div className="rba-resume-single-layout" style={{ fontFamily: tpl.bodyFont }}>
            {/* Header */}
            <div className="rba-header-block" style={{ background: tpl.headerBg, color: tpl.headerText }}>
                <div className="rba-header-info">
                    <div className="rba-header-name" style={{ color: tpl.headerText }}>{name}</div>
                    <div className="rba-header-title" style={{ color: `${tpl.headerText}cc` }}>{title}</div>
                </div>
                <div className="rba-header-contacts">
                    {email && <span>📧 {email}</span>}
                    {phone && <span>📞 {phone}</span>}
                    {location && <span>📍 {location}</span>}
                    {linkedin && <span>🔗 {linkedin}</span>}
                </div>
                <div className="rba-header-accent-bar" style={{ background: tpl.accent }} />
            </div>

            {/* Body */}
            <div className="rba-single-body">
                {summary && (
                    <div className="rba-section">
                        <div className="rba-section-heading rba-sh-bar" style={{
                            background: tpl.accent, color: '#fff',
                        }}>
                            Professional Summary
                        </div>
                        <p className="rba-summary-text">{summary}</p>
                    </div>
                )}

                <div className="rba-two-cols">
                    <div className="rba-col-main">
                        {experience.length > 0 && (
                            <div className="rba-section">
                                <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                    Work Experience
                                </div>
                                {experience.map(exp => (
                                    <div key={exp.id} className="rba-exp-item">
                                        <div className="rba-exp-header">
                                            <div>
                                                <div className="rba-exp-role">{exp.role}</div>
                                                <div className="rba-exp-company">{exp.company} {exp.location && `· ${exp.location}`}</div>
                                            </div>
                                            <div className="rba-exp-period" style={{ color: tpl.accentSolid }}>{exp.period}</div>
                                        </div>
                                        <ul className="rba-bullets">
                                            {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                                <li key={i} style={{ '--bullet-color': tpl.accentSolid }}>{b}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                        {projects.length > 0 && (
                            <div className="rba-section">
                                <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                    Projects
                                </div>
                                {projects.map(p => (
                                    <div key={p.id} className="rba-project-item">
                                        <div className="rba-project-header">
                                            <span className="rba-project-name">{p.name}</span>
                                            <span className="rba-project-tech" style={{ background: `${tpl.accentSolid}18`, color: tpl.accentSolid }}>{p.tech}</span>
                                        </div>
                                        <div className="rba-project-desc">{p.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="rba-col-side">
                        {skills.length > 0 && (
                            <div className="rba-section">
                                <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                    Skills
                                </div>
                                <div className="rba-skills-wrap">
                                    {skills.map((s, i) => (
                                        <span key={i} className="rba-skill-tag" style={{ background: `${tpl.accentSolid}15`, color: tpl.accentSolid }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {education.length > 0 && (
                            <div className="rba-section">
                                <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                    Education
                                </div>
                                {education.map(edu => (
                                    <div key={edu.id} className="rba-edu-item">
                                        <div className="rba-edu-degree">{edu.degree}</div>
                                        <div className="rba-edu-institution">{edu.institution}</div>
                                        <div className="rba-edu-period" style={{ color: tpl.accentSolid }}>{edu.period}</div>
                                        {edu.grade && <div className="rba-edu-grade">{edu.grade}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                        {certifications.length > 0 && (
                            <div className="rba-section">
                                <div className="rba-section-heading" style={{ color: tpl.accentSolid, borderBottomColor: tpl.accentSolid }}>
                                    Certifications
                                </div>
                                {certifications.map(c => (
                                    <div key={c.id} className="rba-cert-item">
                                        <div className="rba-cert-name">{c.name}</div>
                                        <div className="rba-cert-issuer">{c.issuer} · {c.year}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   EDITOR PANELS
══════════════════════════════════════════════════════════════ */

function PersonalInfoPanel({ resume, onChange }) {
    const f = (field) => e => onChange({ ...resume, [field]: e.target.value });
    return (
        <div className="rba-panel">
            <div className="rba-panel-title">👤 Personal Info</div>
            <div className="rba-form-grid-2">
                <div className="rba-field">
                    <label>Full Name</label>
                    <input value={resume.name} onChange={f('name')} placeholder="Your Name" />
                </div>
                <div className="rba-field">
                    <label>Job Title</label>
                    <input value={resume.title} onChange={f('title')} placeholder="Senior Developer" />
                </div>
                <div className="rba-field">
                    <label>Email</label>
                    <input value={resume.email} onChange={f('email')} placeholder="you@example.com" />
                </div>
                <div className="rba-field">
                    <label>Phone</label>
                    <input value={resume.phone} onChange={f('phone')} placeholder="+91 ..." />
                </div>
                <div className="rba-field">
                    <label>Location</label>
                    <input value={resume.location} onChange={f('location')} placeholder="City, Country" />
                </div>
                <div className="rba-field">
                    <label>LinkedIn</label>
                    <input value={resume.linkedin} onChange={f('linkedin')} placeholder="linkedin.com/in/..." />
                </div>
                <div className="rba-field rba-field-full">
                    <label>Website / Portfolio</label>
                    <input value={resume.website} onChange={f('website')} placeholder="yoursite.com" />
                </div>
                <div className="rba-field rba-field-full">
                    <label>Professional Summary</label>
                    <textarea rows={4} value={resume.summary} onChange={f('summary')} placeholder="A brief professional summary..." />
                    <AISuggestBtn
                        label="✨ AI Suggest Summary"
                        suggestions={AI_SUGGESTIONS.summary}
                        onSelect={(s) => onChange({ ...resume, summary: s.replace('{role}', resume.title).replace('{field}', 'software development').replace('{years}', '4').replace('{skills}', resume.skills.slice(0, 3).join(', ')) })}
                    />
                </div>
            </div>
        </div>
    );
}

function ExperiencePanel({ resume, onChange }) {
    const updateExp = (id, field, val) => onChange({
        ...resume,
        experience: resume.experience.map(e => e.id === id ? { ...e, [field]: val } : e)
    });
    const updateBullet = (expId, idx, val) => onChange({
        ...resume,
        experience: resume.experience.map(e => e.id === expId
            ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) }
            : e)
    });
    const addBullet = (expId) => onChange({
        ...resume,
        experience: resume.experience.map(e => e.id === expId
            ? { ...e, bullets: [...e.bullets, ''] }
            : e)
    });
    const removeBullet = (expId, idx) => onChange({
        ...resume,
        experience: resume.experience.map(e => e.id === expId
            ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) }
            : e)
    });
    const addExp = () => onChange({
        ...resume,
        experience: [...resume.experience, {
            id: Date.now(), company: '', role: '', period: '', location: '', bullets: ['']
        }]
    });
    const removeExp = (id) => onChange({ ...resume, experience: resume.experience.filter(e => e.id !== id) });

    return (
        <div className="rba-panel">
            <div className="rba-panel-title">💼 Work Experience</div>
            {resume.experience.map((exp) => (
                <div key={exp.id} className="rba-exp-block">
                    <div className="rba-exp-block-header">
                        <span className="rba-block-label">Experience</span>
                        <button className="rba-remove-btn" onClick={() => removeExp(exp.id)}>✕ Remove</button>
                    </div>
                    <div className="rba-form-grid-2">
                        <div className="rba-field">
                            <label>Job Title</label>
                            <input value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} placeholder="Senior Developer" />
                        </div>
                        <div className="rba-field">
                            <label>Company</label>
                            <input value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} placeholder="Company Name" />
                        </div>
                        <div className="rba-field">
                            <label>Period</label>
                            <input value={exp.period} onChange={e => updateExp(exp.id, 'period', e.target.value)} placeholder="Jan 2022 – Present" />
                        </div>
                        <div className="rba-field">
                            <label>Location</label>
                            <input value={exp.location} onChange={e => updateExp(exp.id, 'location', e.target.value)} placeholder="City / Remote" />
                        </div>
                    </div>
                    <div className="rba-bullets-editor">
                        <label>Bullet Points</label>
                        {exp.bullets.map((b, idx) => (
                            <div key={idx} className="rba-bullet-row">
                                <span className="rba-bullet-dot" />
                                <input value={b} onChange={e => updateBullet(exp.id, idx, e.target.value)} placeholder="Describe your achievement..." />
                                <button className="rba-icon-btn" onClick={() => removeBullet(exp.id, idx)} title="Remove">✕</button>
                            </div>
                        ))}
                        <div className="rba-bullet-actions">
                            <button className="rba-add-bullet-btn" onClick={() => addBullet(exp.id)}>+ Add Bullet</button>
                            <AISuggestBtn
                                label="✨ AI Bullet"
                                suggestions={AI_SUGGESTIONS.bullets}
                                onSelect={(s) => addBullet(exp.id) || updateBullet(exp.id, exp.bullets.length, s.replace('{feature}', 'core module').replace('{metric}', 'load time').replace('{n}', '5').replace('{process}', 'deployment'))}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button className="rba-add-section-btn" onClick={addExp}>+ Add Experience</button>
        </div>
    );
}

function EducationPanel({ resume, onChange }) {
    const updateEdu = (id, field, val) => onChange({
        ...resume, education: resume.education.map(e => e.id === id ? { ...e, [field]: val } : e)
    });
    const addEdu = () => onChange({
        ...resume, education: [...resume.education, { id: Date.now(), institution: '', degree: '', period: '', grade: '' }]
    });
    const removeEdu = (id) => onChange({ ...resume, education: resume.education.filter(e => e.id !== id) });

    return (
        <div className="rba-panel">
            <div className="rba-panel-title">🎓 Education</div>
            {resume.education.map(edu => (
                <div key={edu.id} className="rba-exp-block">
                    <div className="rba-exp-block-header">
                        <span className="rba-block-label">Education</span>
                        <button className="rba-remove-btn" onClick={() => removeEdu(edu.id)}>✕ Remove</button>
                    </div>
                    <div className="rba-form-grid-2">
                        <div className="rba-field rba-field-full">
                            <label>Institution</label>
                            <input value={edu.institution} onChange={e => updateEdu(edu.id, 'institution', e.target.value)} placeholder="University Name" />
                        </div>
                        <div className="rba-field">
                            <label>Degree</label>
                            <input value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} placeholder="B.Tech in CS" />
                        </div>
                        <div className="rba-field">
                            <label>Period</label>
                            <input value={edu.period} onChange={e => updateEdu(edu.id, 'period', e.target.value)} placeholder="2016 – 2020" />
                        </div>
                        <div className="rba-field">
                            <label>Grade / GPA</label>
                            <input value={edu.grade} onChange={e => updateEdu(edu.id, 'grade', e.target.value)} placeholder="CGPA: 8.4" />
                        </div>
                    </div>
                </div>
            ))}
            <button className="rba-add-section-btn" onClick={addEdu}>+ Add Education</button>
        </div>
    );
}

function SkillsPanel({ resume, onChange }) {
    const [newSkill, setNewSkill] = useState('');
    const addSkill = () => {
        if (!newSkill.trim()) return;
        onChange({ ...resume, skills: [...resume.skills, newSkill.trim()] });
        setNewSkill('');
    };
    const removeSkill = (i) => onChange({ ...resume, skills: resume.skills.filter((_, idx) => idx !== i) });

    return (
        <div className="rba-panel">
            <div className="rba-panel-title">⚡ Skills</div>
            <div className="rba-skills-list">
                {resume.skills.map((s, i) => (
                    <div key={i} className="rba-skill-chip">
                        <span>{s}</span>
                        <button onClick={() => removeSkill(i)}>✕</button>
                    </div>
                ))}
            </div>
            <div className="rba-skill-add-row">
                <input
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill (press Enter)"
                />
                <button className="rba-skill-add-btn" onClick={addSkill}>Add</button>
            </div>
        </div>
    );
}

function CertificationsPanel({ resume, onChange }) {
    const updateCert = (id, field, val) => onChange({
        ...resume, certifications: resume.certifications.map(c => c.id === id ? { ...c, [field]: val } : c)
    });
    const addCert = () => onChange({
        ...resume, certifications: [...resume.certifications, { id: Date.now(), name: '', issuer: '', year: '' }]
    });
    const removeCert = (id) => onChange({ ...resume, certifications: resume.certifications.filter(c => c.id !== id) });

    return (
        <div className="rba-panel">
            <div className="rba-panel-title">🏆 Certifications</div>
            {resume.certifications.map(c => (
                <div key={c.id} className="rba-exp-block">
                    <div className="rba-exp-block-header">
                        <span className="rba-block-label">Certificate</span>
                        <button className="rba-remove-btn" onClick={() => removeCert(c.id)}>✕ Remove</button>
                    </div>
                    <div className="rba-form-grid-2">
                        <div className="rba-field rba-field-full">
                            <label>Certification Name</label>
                            <input value={c.name} onChange={e => updateCert(c.id, 'name', e.target.value)} placeholder="AWS Certified Developer" />
                        </div>
                        <div className="rba-field">
                            <label>Issuing Body</label>
                            <input value={c.issuer} onChange={e => updateCert(c.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
                        </div>
                        <div className="rba-field">
                            <label>Year</label>
                            <input value={c.year} onChange={e => updateCert(c.id, 'year', e.target.value)} placeholder="2023" />
                        </div>
                    </div>
                </div>
            ))}
            <button className="rba-add-section-btn" onClick={addCert}>+ Add Certification</button>
        </div>
    );
}

function ProjectsPanel({ resume, onChange }) {
    const updateProj = (id, field, val) => onChange({
        ...resume, projects: resume.projects.map(p => p.id === id ? { ...p, [field]: val } : p)
    });
    const addProj = () => onChange({
        ...resume, projects: [...resume.projects, { id: Date.now(), name: '', tech: '', description: '' }]
    });
    const removeProj = (id) => onChange({ ...resume, projects: resume.projects.filter(p => p.id !== id) });

    return (
        <div className="rba-panel">
            <div className="rba-panel-title">🚀 Projects</div>
            {resume.projects.map(p => (
                <div key={p.id} className="rba-exp-block">
                    <div className="rba-exp-block-header">
                        <span className="rba-block-label">Project</span>
                        <button className="rba-remove-btn" onClick={() => removeProj(p.id)}>✕ Remove</button>
                    </div>
                    <div className="rba-form-grid-2">
                        <div className="rba-field">
                            <label>Project Name</label>
                            <input value={p.name} onChange={e => updateProj(p.id, 'name', e.target.value)} placeholder="My Awesome App" />
                        </div>
                        <div className="rba-field">
                            <label>Tech Stack</label>
                            <input value={p.tech} onChange={e => updateProj(p.id, 'tech', e.target.value)} placeholder="React, Node.js, MongoDB" />
                        </div>
                        <div className="rba-field rba-field-full">
                            <label>Description</label>
                            <textarea rows={2} value={p.description} onChange={e => updateProj(p.id, 'description', e.target.value)} placeholder="Brief description of the project and its impact..." />
                        </div>
                    </div>
                </div>
            ))}
            <button className="rba-add-section-btn" onClick={addProj}>+ Add Project</button>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   AI SUGGEST BUTTON
══════════════════════════════════════════════════════════════ */
function AISuggestBtn({ label, suggestions, onSelect }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rba-ai-suggest-wrap">
            <button className="rba-ai-suggest-btn" onClick={() => setOpen(o => !o)}>{label}</button>
            {open && (
                <div className="rba-ai-dropdown">
                    {suggestions.map((s, i) => (
                        <div key={i} className="rba-ai-item" onClick={() => { onSelect(s); setOpen(false); }}>
                            <span className="rba-ai-sparkle">✨</span> {s.slice(0, 90)}…
                        </div>
                    ))}
                    <div className="rba-ai-note">💡 Click to apply suggestion</div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   FAQ SECTION COMPONENT
══════════════════════════════════════════════════════════════ */
const FAQ_DATA = [
    { q: 'Is this resume builder completely free?', a: 'Yes! Build, edit, and download as PDF — completely free. No sign-up or credit card needed.' },
    { q: 'Will my resume pass ATS filters?', a: 'All templates are built with ATS best practices: clean layout, standard fonts, keyword-friendly structure.' },
    { q: 'Can I switch templates mid-edit?', a: 'Yes! Switch between all templates inside the builder at any time without losing your content.' },
    { q: 'What file formats can I download?', a: 'You can download a high-quality, print-ready PDF suitable for digital submission and physical printing.' },
    { q: 'Is my data stored on your servers?', a: 'No. Your data lives entirely in your browser session. We never store or share your personal information.' },
    { q: 'Can I use this on mobile?', a: 'Yes, the builder is fully responsive. For the best editing experience, a tablet or desktop is recommended.' },
    { q: 'Are the premium templates worth it?', a: 'Premium templates include exclusive designs like Midnight Luxury and Cyber Tech — register free to unlock them.' },
    { q: 'How do I register for premium templates?', a: 'Click any locked template or the "Register for Premium" button and create a free account in seconds.' },
    { q: 'What is the ATS score checker?', a: 'It analyses your resume against ATS systems and gives you a percentage score with specific improvement tips.' },
    { q: 'Can I add my own photo to the resume?', a: 'Currently, our templates are photo-free by design — which maximises ATS compatibility and professionalism.' },
];

function FaqSection({ onBuild }) {
    const [openIdx, setOpenIdx] = useState(null);
    const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);
    const left = FAQ_DATA.slice(0, 5);
    const right = FAQ_DATA.slice(5, 10);
    const renderItem = (item, i, offset = 0) => (
        <div
            key={i}
            className={`rba-faq-item${openIdx === i + offset ? ' open' : ''}`}
            onClick={() => toggle(i + offset)}
        >
            <div className="rba-faq-q">
                <span>{item.q}</span>
                <span className="rba-faq-icon">+</span>
            </div>
            {openIdx === i + offset && (
                <div className="rba-faq-a">{item.a}</div>
            )}
        </div>
    );
    return (
        <section className="rba-faq-section">
            <div className="rb-container">
                <div className="rba-section-header">
                    <div className="rb-section-label">❓ FAQ</div>
                    <h2 className="rb-section-h2">Frequently Asked Questions</h2>
                    <p className="rb-section-sub">Everything you need to know about building your perfect resume.</p>
                </div>
                <div className="rba-faq-2col">
                    <div className="rba-faq-col">{left.map((item, i) => renderItem(item, i, 0))}</div>
                    <div className="rba-faq-col">{right.map((item, i) => renderItem(item, i, 5))}</div>
                </div>
            </div>
        </section>
    );
}


/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */

const EDITOR_TABS = [
    { id: 'personal', label: '👤 Personal' },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education', label: '🎓 Education' },
    { id: 'skills', label: '⚡ Skills' },
    { id: 'projects', label: '🚀 Projects' },
    { id: 'certs', label: '🏆 Certs' },
];

const AIResumeBuilderApp = () => {
    const [view, setView] = useState('landing'); // 'landing' | 'builder' | 'payment'
    const [resume, setResume] = useState(DEFAULT_RESUME);
    const [activeTpl, setActiveTpl] = useState(TEMPLATES[0]);
    const [activeTab, setActiveTab] = useState('personal');
    const [mobileView, setMobileView] = useState('edit'); // 'edit' | 'preview'
    const [atsScore] = useState(Math.floor(Math.random() * 6) + 92);
    const [previewScale, setPreviewScale] = useState(1);
    const [user, setUser] = useState(null);
    const [purchasedTemplates, setPurchasedTemplates] = useState([]);
    const [selectedUltra, setSelectedUltra] = useState(null);
    const navigate = useNavigate();
    const locationState = useLocation().state;
    const isUserLoggedIn = isAuthenticated();

    // Load state from navigation (e.g. from Profile page)
    useEffect(() => {
        if (locationState?.resumeData) {
            const data = locationState.resumeData;
            const parsedContent = data.content ? JSON.parse(data.content) : null;
            if (parsedContent) {
                setResume(parsedContent);
            }
            // Find template object
            const allTpls = [...TEMPLATES, ...PREMIUM_TEMPLATES, ...ULTRA_PREMIUM_TEMPLATES];
            const foundTpl = allTpls.find(t => t.id === data.template);
            if (foundTpl) setActiveTpl(foundTpl);
            
            setView('builder');
            setMobileView('preview');

            // Handle auto-download
            if (locationState.autoDownload) {
                setTimeout(() => {
                    downloadResume(data.name || 'Resume');
                }, 1000); // Give it a second to render
            }
        }
    }, [locationState]);

    // Ref to the preview container — used to measure available width
    const previewColRef = React.useRef(null);

    // Calculate scale whenever preview is shown or container resizes
    React.useEffect(() => {
        const RESUME_WIDTH = 794; // A4 width in px

        const updateScale = () => {
            if (previewColRef.current) {
                const containerWidth = previewColRef.current.clientWidth;
                const padding = 24; // 12px each side
                const available = containerWidth - padding;
                const scale = Math.min(available / RESUME_WIDTH, 1); // never zoom in beyond 1
                setPreviewScale(scale);
            }
        };

        updateScale();

        const observer = new ResizeObserver(updateScale);
        if (previewColRef.current) {
            observer.observe(previewColRef.current);
        }

        return () => observer.disconnect();
    }, [mobileView, view]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (previewColRef.current) {
            previewColRef.current.scrollTo(0, 0);
        }
    }, [view]);

    useEffect(() => {
        if (previewColRef.current) {
            previewColRef.current.scrollTo(0, 0);
        }
    }, [activeTpl]);

    const handleTemplateSelect = (tpl) => {
        setActiveTpl(tpl);
        setView('builder');
        setMobileView('edit');
    };

    // Load user data and purchased templates
    useEffect(() => {
        if (isUserLoggedIn) {
            const fetchUserData = async () => {
                try {
                    const token = getToken();
                    // Fetch profile info
                    const authRes = await fetch(apiConfig.endpoints.auth.me || `${apiConfig.AUTH_API_URL}/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (authRes.ok) {
                        const authData = await authRes.json();
                        setUser(authData.data);
                    }

                    // Fetch purchased templates (using the payments endpoint)
                    const payRes = await fetch(apiConfig.endpoints.userProfile.payments, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (payRes.ok) {
                        const payments = await payRes.json();
                        const ultraPurchases = payments
                            .filter(p => p.itemType === 'RESUME' && p.status === 'Completed')
                            .map(p => p.itemId);
                        setPurchasedTemplates(ultraPurchases);
                    }
                } catch (err) {
                    console.error("Failed to load user session data:", err);
                }
            };
            fetchUserData();
        }
    }, [isUserLoggedIn]);

    const handleSaveResume = async () => {
        if (!isUserLoggedIn) {
            alert("Please login to save your resume to your profile.");
            navigate('/login');
            return;
        }

        try {
            const token = getToken();
            const res = await fetch(apiConfig.endpoints.userProfile.resumes, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: resume.name,
                    template: activeTpl.id,
                    type: activeTpl.ultra ? 'Ultra Premium' : (activeTpl.tag || 'Standard'),
                    resumeId: `R-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    content: JSON.stringify(resume)
                })
            });

            if (res.ok) {
                alert("Resume saved successfully to your profile!");
            } else {
                const err = await res.json();
                alert(`Failed to save: ${err.message || 'Unknown error'}`);
            }
        } catch (err) {
            alert("An error occurred while saving your resume.");
        }
    };

    if (view === 'builder') {
        return (
            <div className="rba-app rba-builder-mode">
                {/* ── TOPBAR ── */}
                <div className="rba-builder-topbar">
                    {/* Row 1 */}
                    <div className="rba-topbar-row1">
                        <button className="rba-back-btn" onClick={() => setView('landing')}>← Back</button>
                        <div className="rba-topbar-center">
                            <span className="rba-topbar-tpl-badge" style={{ background: activeTpl.accentSolid }}>
                                {activeTpl.name}
                            </span>
                            <span className="rba-ats-chip">📊 ATS {atsScore}%</span>
                        </div>
                        <div className="rba-topbar-actions">
                            {isUserLoggedIn && (
                                <button className="rba-save-profile-btn" onClick={handleSaveResume} title="Save to Profile">
                                    💾 Save
                                </button>
                            )}
                            <button className="rba-download-btn" onClick={() => downloadResume(resume.name)}>
                                ⬇ PDF
                            </button>
                        </div>
                    </div>

                    {/* Mobile toggle row — row 2 on mobile: Download + Edit/Preview */}
                    <div className="rba-mobile-toggle-row">
                        {/* Download button shown in row 2 on mobile (row 1 version hidden via CSS) */}
                        <button className="rba-download-btn" onClick={() => downloadResume(resume.name)}>
                            ⬇ PDF
                        </button>
                        <button
                            className={`rba-mob-toggle-btn${mobileView === 'edit' ? ' active' : ''}`}
                            onClick={() => setMobileView('edit')}
                        >
                            ✏️ Edit
                        </button>
                        <button
                            className={`rba-mob-toggle-btn${mobileView === 'preview' ? ' active' : ''}`}
                            onClick={() => setMobileView('preview')}
                        >
                            👁 Preview
                        </button>
                    </div>
                </div>

                {/* ── BUILDER BODY ── */}
                <div className="rba-builder-layout">

                    {/* LEFT — Editor (hidden on mobile when preview is active) */}
                    <div className={`rba-editor-col${mobileView === 'preview' ? ' rba-mobile-hidden' : ''}`}>
                        {/* Template mini-picker */}
                        <div className="rba-tpl-mini-list">
                            {TEMPLATES.map(t => (
                                <div
                                    key={t.id}
                                    className={`rba-tpl-mini${activeTpl.id === t.id ? ' active' : ''}`}
                                    onClick={() => setActiveTpl(t)}
                                    style={{ borderColor: activeTpl.id === t.id ? t.accentSolid : 'transparent' }}
                                >
                                    <div className="rba-tpl-mini-color" style={{ background: t.previewThumb.header }} />
                                    <span>{t.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Section Tabs */}
                        <div className="rba-tabs">
                            {EDITOR_TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`rba-tab${activeTab === tab.id ? ' active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Editor Panel */}
                        <div className="rba-editor-body">
                            {activeTab === 'personal' && <PersonalInfoPanel resume={resume} onChange={setResume} />}
                            {activeTab === 'experience' && <ExperiencePanel resume={resume} onChange={setResume} />}
                            {activeTab === 'education' && <EducationPanel resume={resume} onChange={setResume} />}
                            {activeTab === 'skills' && <SkillsPanel resume={resume} onChange={setResume} />}
                            {activeTab === 'projects' && <ProjectsPanel resume={resume} onChange={setResume} />}
                            {activeTab === 'certs' && <CertificationsPanel resume={resume} onChange={setResume} />}
                        </div>
                    </div>

                    {/* RIGHT — Live Resume Preview */}
                    <div
                        ref={previewColRef}
                        className={`rba-preview-col${mobileView === 'edit' ? ' rba-mobile-hidden' : ''}`}
                    >
                        {/*
                          Scaled resume approach:
                          - scaler-inner is 794px wide (A4), scaled down by previewScale
                          - transform:scale keeps original layout dimensions, so we set
                            an explicit height on the wrap = resumeNaturalHeight * scale
                            so the scrollable area is the correct visual size
                        */}
                        <div
                            className="rba-preview-scaler-wrap"
                            style={{
                                /* Natural A4 height ≈ 1123px, adjust wrap height to scaled visual height */
                                height: `calc(1123px * ${previewScale} + 24px)`,
                                minHeight: `calc(1123px * ${previewScale} + 24px)`,
                            }}
                        >
                            <div
                                className="rba-preview-scaler-inner"
                                style={{
                                    transform: `scale(${previewScale})`,
                                    transformOrigin: 'top left',
                                }}
                            >
                                <div id="resume-output">
                                    <ResumeTemplate resume={resume} tpl={activeTpl} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'payment' && selectedUltra) {
        const payNow = async () => {
            if (!isUserLoggedIn) { alert('Please log in to purchase templates.'); return; }
            try {
                const token = getToken();
                const headers = { 'Content-Type': 'application/json' };
                if (token && token !== 'null') {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const orderRes = await fetch(apiConfig.endpoints.payments.createOrder, {
                    method: 'POST', headers,
                    body: JSON.stringify({ amount: selectedUltra.price * 100, currency: 'INR' })
                });
                if (!orderRes.ok) throw new Error('Failed to create order on server');
                const orderData = await orderRes.json();
                const loadRazorpay = () => new Promise((resolve) => {
                    if (window.Razorpay) return resolve(true);
                    const s = document.createElement('script');
                    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    s.onload = () => resolve(true); s.onerror = () => resolve(false);
                    document.body.appendChild(s);
                });
                const loaded = await loadRazorpay();
                if (!loaded) { alert('Razorpay SDK failed to load.'); return; }
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
                    amount: orderData.amount, currency: orderData.currency, order_id: orderData.order_id,
                    name: 'Chaitanya Tech World', description: `Unlock ${selectedUltra.name} Template`,
                    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135692.png',
                    handler: async (response) => {
                        try {
                            const verifyRes = await fetch(apiConfig.endpoints.payments.verifyPayment, {
                                method: 'POST', headers,
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });
                            if (!verifyRes.ok) throw new Error('Payment verification failed');
                            await fetch(apiConfig.endpoints.userProfile.payments, {
                                method: 'POST', headers,
                                body: JSON.stringify({
                                    itemName: `Premium Template: ${selectedUltra.name}`, 
                                    amount: `${selectedUltra.price}`,
                                    itemId: selectedUltra.id,
                                    itemType: 'RESUME',
                                    paymentMethod: 'Razorpay', 
                                    status: 'Completed',
                                    transactionId: response.razorpay_payment_id,
                                    name: user?.name || 'Guest',
                                    email: user?.email || ''
                                })
                            });
                            setPurchasedTemplates([...purchasedTemplates, selectedUltra.id]);
                            setActiveTpl(selectedUltra); setView('builder'); setMobileView('edit');
                        } catch (e) { alert('Payment verification failed. Contact support if money was deducted.'); }
                    },
                    prefill: { name: user?.name || '', email: user?.email || '', contact: '' },
                    theme: { color: '#3395ff' }
                };
                const rp = new window.Razorpay(options);
                rp.on('payment.failed', (r) => alert('Payment failed: ' + r.error.description));
                rp.open();
            } catch (err) { alert('Could not initiate payment. ' + err.message); }
        };

        return (
            <div className="rba-payment-page">


                {/* Main Content Split Layout */}
                <div className="rb-container rba-payment-main-container">
                    <div className="rba-payment-body-split">
                        
                        {/* Left Side: Template Details */}
                        <div className="rba-payment-details-side">
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--rb-text)' }}>Unlock Ultra Premium</h2>
                            <p style={{ color: 'var(--rb-text-muted)', marginBottom: '2rem' }}>Get lifetime access to this exclusive, highly-converting design.</p>
                            
                            <div className="rba-payment-item-large">
                                <div className="rba-payment-thumb-large">
                                    <div className="rba-payment-thumb-inner">
                                        <div className="rba-payment-thumb-header" style={{ background: selectedUltra.previewThumb.header }} />
                                        <div className="rba-payment-thumb-body">
                                            {[70, 50, 80, 60, 90].map((w, i) => (<div key={i} className="rba-payment-thumb-line" style={{ width: `${w}%` }} />))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div className="rba-payment-item-name-large">{selectedUltra.name}</div>
                                    <div className="rba-payment-item-tag-large">💎 Ultra Premium Template</div>
                                    
                                    <div className="rba-payment-features" style={{ marginTop: '1.5rem' }}>
                                        {['Lifetime access to template', 'Unlimited PDF downloads', 'ATS score > 96% guaranteed', 'Stand out with unique design'].map((f, i) => (
                                            <div key={i} className="rba-pf-item"><div className="rba-pf-check">✓</div>{f}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Payment Info & Action */}
                        <div className="rba-payment-action-side">
                            <div className="rba-payment-breakdown">
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--rb-text)' }}>Order Summary</h3>
                                <div className="rba-pb-row"><span className="rba-pb-label">Template Price</span><span className="rba-pb-val">₹{selectedUltra.price}</span></div>
                                <div className="rba-pb-row"><span className="rba-pb-label">Tax (GST 18%)</span><span className="rba-pb-val">Included</span></div>
                                <div className="rba-pb-row total"><span className="rba-pb-label">Total to Pay</span><span className="rba-pb-val">₹{selectedUltra.price}</span></div>
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <button className="rba-pay-btn" onClick={payNow}>
                                    <span>Pay with Razorpay</span>
                                    <span className="rba-pay-btn-amount">₹{selectedUltra.price}</span>
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--rb-text-muted)', marginTop: '1rem' }}>
                                    By clicking pay, you agree to our Terms of Service.
                                </p>
                            </div>
                            
                            <div className="rba-payment-trust">
                                <div className="rba-trust-badge">🔒 AES-256 Encrypted</div>
                                <div className="rba-trust-badge">⚡ Powered by Razorpay</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    /* ── LANDING PAGE ── */
    return (
        <div className="rba-app">
            {/* Hero */}
            <section className="rba-hero">
                <div className="rba-hero-mesh">
                    <div className="rba-hero-dots" />
                    <div className="rba-hero-orb rba-orb-1" />
                    <div className="rba-hero-orb rba-orb-2" />
                    <div className="rba-hero-orb rba-orb-3" />
                </div>
                <div className="rb-container">
                    <div className="rba-hero-inner">
                        <div className="rba-hero-left">
                            <div className="rb-hero-eyebrow">
                                <span className="rb-eyebrow-dot" />
                                AI-Powered Resume Builder
                            </div>
                            <h1 className="rb-hero-h1">
                                Build a Resume That
                                <span className="rb-gradient-text">Gets You Hired</span>
                            </h1>
                            <p className="rb-hero-desc">
                                Select a professional template, edit in real time, and download your
                                ATS-optimised resume as a PDF — all powered by AI. No sign-up needed.
                            </p>
                            <div className="rb-hero-actions">
                                <button className="rb-btn-primary" onClick={() => setView('builder')}>
                                    ✨ Build My Resume Free
                                </button>
                                <a href="#templates" className="rb-btn-ghost">🎨 View Templates</a>
                            </div>
                            <div className="rba-hero-stats">
                                <div className="rba-hstat"><strong>2.4M+</strong><span>Resumes Created</span></div>
                                <div className="rba-hstat-div" />
                                <div className="rba-hstat"><strong>94%</strong><span>Interview Rate</span></div>
                                <div className="rba-hstat-div" />
                                <div className="rba-hstat"><strong>8 Templates</strong><span>All Editable</span></div>
                            </div>
                        </div>
                        <div className="rb-hero-preview">
                            <div className="rba-hero-preview-card">

                                {/* ── Header with avatar ── */}
                                <div className="rba-hpc-header">
                                    <div className="rba-hpc-avatar">VK</div>
                                    <div className="rba-hpc-name-block">
                                        <div className="rba-hpc-name-line" />
                                        <div className="rba-hpc-title-line" />
                                    </div>
                                    {/* AI badge — inline, not absolute */}
                                    <div className="rba-ai-float">✨ AI Enhanced</div>
                                </div>

                                {/* ── Body ── */}
                                <div className="rba-hpc-body">

                                    {/* Skills chips */}
                                    <div className="rba-hpc-chips">
                                        {['React', 'Node.js', 'TypeScript', 'AWS'].map((s, i) => (
                                            <span key={i} className="rba-hpc-chip">{s}</span>
                                        ))}
                                    </div>

                                    {/* Experience section */}
                                    <div className="rba-hpc-section-label">💼 Experience</div>
                                    <div className="rba-hpc-line" style={{ width: '85%' }} />
                                    <div className="rba-hpc-line" style={{ width: '70%' }} />
                                    <div className="rba-hpc-line" style={{ width: '60%' }} />

                                    {/* Education section */}
                                    <div className="rba-hpc-section-label">🎓 Education</div>
                                    <div className="rba-hpc-line" style={{ width: '75%' }} />
                                    <div className="rba-hpc-line" style={{ width: '55%' }} />

                                    {/* ATS Score row with animated progress bar */}
                                    <div className="rba-hpc-ats-row">
                                        <span className="rba-hpc-ats-label">📊 ATS Score</span>
                                        <span className="rba-hpc-ats-score">96%</span>
                                    </div>
                                    <div className="rba-hpc-ats-bar-wrap">
                                        <div className="rba-hpc-ats-bar" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Gallery — Free */}
            <section className="rba-tpls-section" id="templates">
                <div className="rb-container">
                    <div className="rba-section-header">
                        <div className="rb-section-label">🎨 Templates</div>
                        <h2 className="rb-section-h2">Choose Your Perfect Template</h2>
                        <p className="rb-section-sub">20+ hand-crafted templates. All ATS-optimised. Click to customise.</p>
                    </div>
                    {/* Free templates */}
                    <div className="rba-tpls-subhead">✅ Free Templates</div>
                    <div className="rba-tpls-grid">
                        {TEMPLATES.map(tpl => (
                            <div key={tpl.id} className="rba-tpl-card-lg" onClick={() => handleTemplateSelect(tpl)}>
                                <TemplateThumbnail tpl={tpl} active={false} />
                                <button className="rba-use-tpl-btn" style={{ background: tpl.accentSolid }}>
                                    Use This Template →
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Premium locked templates */}
                    <div className="rba-tpls-subhead rba-tpls-subhead--premium">👑 Premium Templates — {isUserLoggedIn ? 'Unlocked for You' : 'Register Free to Unlock'}</div>
                    <div className="rba-tpls-grid">
                        {PREMIUM_TEMPLATES.map(tpl => (
                            <div key={tpl.id} className={`rba-tpl-card-lg ${!isUserLoggedIn ? 'rba-tpl-card-locked' : ''}`} onClick={() => {
                                if (isUserLoggedIn) {
                                    handleTemplateSelect(tpl);
                                } else {
                                    navigate('/signup');
                                }
                            }}>
                                {isUserLoggedIn ? (
                                    <TemplateThumbnail tpl={tpl} active={false} />
                                ) : (
                                    <div className="rba-locked-thumb">
                                        <div className="rba-locked-header" style={{ background: tpl.previewThumb.header }}>
                                            <div className="rba-locked-accent-bar" style={{ background: tpl.accentSolid }} />
                                        </div>
                                        <div className="rba-locked-body">
                                            <div className="rba-locked-line" style={{ width: '70%' }} />
                                            <div className="rba-locked-line" style={{ width: '55%' }} />
                                            <div className="rba-locked-line" style={{ width: '80%' }} />
                                        </div>
                                        <div className="rba-lock-overlay">
                                            <div className="rba-lock-icon">🔒</div>
                                            <div className="rba-lock-label">Register Free to Unlock</div>
                                        </div>
                                    </div>
                                )}
                                <div className="rba-tpl-preview-meta">
                                    <span className="rba-tpl-name">{tpl.name}</span>
                                    <span className="rba-tpl-tag" style={{ background: `${tpl.tagColor}22`, color: tpl.tagColor }}>{tpl.tag}</span>
                                </div>
                                {!isUserLoggedIn ? (
                                    <button className="rba-use-tpl-btn rba-unlock-btn">
                                        🔓 Unlock — Register Free
                                    </button>
                                ) : (
                                    <button className="rba-use-tpl-btn" style={{ background: tpl.accentSolid }}>
                                        Use This Template →
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Ultra Premium locked templates */}
                    <div className="rba-tpls-subhead rba-tpls-subhead--premium" style={{ marginTop: '3rem', color: '#fbbf24' }}>💎 Ultra Premium Templates — Stand Out</div>
                    <div className="rba-tpls-grid">
                        {ULTRA_PREMIUM_TEMPLATES.map(tpl => {
                            const isPurchased = purchasedTemplates.includes(tpl.id);
                            return (
                                <div key={tpl.id} className={`rba-tpl-card-lg ${!isPurchased ? 'rba-tpl-card-locked' : ''}`} onClick={() => {
                                    if (isPurchased) {
                                        handleTemplateSelect(tpl);
                                    } else if (!isUserLoggedIn) {
                                        navigate('/login');
                                    } else {
                                        setSelectedUltra(tpl);
                                        setView('payment');
                                    }
                                }}>
                                    {isPurchased ? (
                                        <TemplateThumbnail tpl={tpl} active={false} />
                                    ) : (
                                        <div className="rba-locked-thumb" style={{ border: '2px solid rgba(251,191,36,0.3)', borderRadius: '12px' }}>
                                            <div className="rba-locked-header" style={{ background: tpl.previewThumb.header }}>
                                                <div className="rba-locked-accent-bar" style={{ background: tpl.accentSolid }} />
                                            </div>
                                            <div className="rba-locked-body">
                                                <div className="rba-locked-line" style={{ width: '70%' }} />
                                                <div className="rba-locked-line" style={{ width: '55%' }} />
                                                <div className="rba-locked-line" style={{ width: '80%' }} />
                                                <div className="rba-locked-line" style={{ width: '60%' }} />
                                            </div>
                                            <div className="rba-lock-overlay" style={{ background: 'rgba(0,0,0,0.85)' }}>
                                                <div className="rba-lock-icon">💎</div>
                                                <div className="rba-lock-label" style={{ color: '#fbbf24' }}>₹{tpl.price} — Pay to Unlock</div>
                                                <div style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 'bold', marginTop: '4px' }}>
                                                    96%+ ATS Score
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="rba-tpl-preview-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span className="rba-tpl-name" style={{ fontSize: '0.9rem' }}>{tpl.name}</span>
                                            <span className="rba-tpl-tag" style={{ background: `${tpl.tagColor}22`, color: tpl.tagColor, fontSize: '0.65rem' }}>{tpl.tag}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem', fontWeight: '700', color: '#10b981' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 96% ATS</span>
                                            <span style={{ color: '#84849a' }}>•</span>
                                            <span style={{ color: '#fbbf24' }}>Unique Design</span>
                                        </div>
                                    </div>
                                    {!isPurchased ? (
                                        <button className="rba-use-tpl-btn rba-unlock-btn" style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#000', fontWeight: '900' }}>
                                            💎 Buy for ₹{tpl.price}
                                        </button>
                                    ) : (
                                        <button className="rba-use-tpl-btn" style={{ background: tpl.accentSolid }}>
                                            Use This Template →
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Bar — animated counters */}
            <section className="rba-stats-section">
                <div className="rb-container">
                    <div className="rba-stats-grid">
                        <AnimatedStat num={20} suffix="+" label="Resumes Created" />
                        <AnimatedStat num={94} suffix="%" label="Interview Success Rate" />
                        <AnimatedStat num={5} suffix="" label="Premium Templates" />
                        <AnimatedStat num={5} suffix=" min" label="Average Build Time" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="rba-features-section">
                <div className="rb-container">
                    <div className="rba-section-header">
                        <div className="rb-section-label">⚡ Why Choose Us</div>
                        <h2 className="rb-section-h2">Everything You Need to Get Hired</h2>
                        <p className="rb-section-sub">Built with the tools and intelligence modern job seekers need to stand out.</p>
                    </div>
                    <div className="rba-features-grid">
                        {[
                            { icon: '🤖', title: 'AI-Powered Suggestions', desc: 'Real-time AI bullet points and summary recommendations tailored to your field.' },
                            { icon: '📊', title: 'ATS Score Checker', desc: 'Scores 90%+ on every major ATS system — beat the bots and reach real humans.' },
                            { icon: '🎨', title: '12 Templates', desc: '8 free + 4 premium designs crafted by professional designers, all editable.' },
                            { icon: '⚡', title: 'Real-Time Preview', desc: 'Watch your resume update live as you type — no refresh needed.' },
                            { icon: '📄', title: 'One-Click PDF', desc: 'Print-ready, ATS-optimised PDF download. No watermarks, no fees.' },
                            { icon: '🔒', title: 'Privacy First', desc: 'Your data stays in your browser. Zero tracking, zero storage.' },
                        ].map((f, i) => (
                            <div key={i} className="rba-feature-card">
                                <div className="rba-feature-icon">{f.icon}</div>
                                <h3 className="rba-feature-title">{f.title}</h3>
                                <p className="rba-feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials — RTL Marquee */}
            <section className="rba-testi-section">
                <div className="rba-section-header" style={{ margin: '0 auto 2.5rem', textAlign: 'center', maxWidth: 800, padding: '0 1.5rem' }}>
                    <div className="rb-section-label">⭐ Success Stories</div>
                    <h2 className="rb-section-h2">Loved by Job Seekers Worldwide</h2>
                    <p className="rb-section-sub">Professionals across India's top MNCs landed their dream jobs using our builder.</p>
                </div>
                <div className="rba-marquee-track">
                    <div className="rba-marquee-strip">
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                            <div key={i} className="rba-testi-card">
                                <div className="rba-testi-stars">⭐⭐⭐⭐⭐</div>
                                <p className="rba-testi-text">"{t.text}"</p>
                                <div className="rba-testi-author">
                                    <div className="rba-testi-avatar">{t.initials}</div>
                                    <div>
                                        <div className="rba-testi-name">{t.name}</div>
                                        <div className="rba-testi-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ — 2 column */}
            <FaqSection onBuild={() => setView('builder')} />

            {/* How It Works */}
            <section className="rba-how-section">
                <div className="rb-container">
                    <div className="rba-section-header">
                        <div className="rb-section-label">⚡ How It Works</div>
                        <h2 className="rb-section-h2">From Blank Page to Dream Job in 4 Steps</h2>
                    </div>
                    <div className="rba-how-grid">
                        {[
                            { num: 1, icon: '🎨', title: 'Pick a Template', desc: 'Choose from 8 free + 4 premium ATS-friendly templates.' },
                            { num: 2, icon: '✏️', title: 'Edit Your Details', desc: 'Fill in your info using our real-time editor with AI suggestions.' },
                            { num: 3, icon: '👁', title: 'Preview Live', desc: 'See your resume update in real-time as you type.' },
                            { num: 4, icon: '⬇', title: 'Download PDF', desc: 'One-click download as a print-ready, ATS-optimised PDF.' },
                        ].map(s => (
                            <div key={s.num} className="rba-how-card">
                                <div className="rba-how-num">{s.icon}</div>
                                <div className="rba-how-title">{s.title}</div>
                                <div className="rba-how-desc">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA — compact inline banner */}
            <section className="rba-cta-section">
                <div className="rb-container">
                    <div className="rba-cta-inline">
                        <div className="rba-cta-inline-left">
                            <span className="rba-cta-inline-badge">✨ Free Forever</span>
                            <h2 className="rba-cta-inline-h2">Ready to land your dream job?</h2>
                            <p className="rba-cta-inline-sub">Build, customise & download your ATS-optimised resume in under 5 minutes.</p>
                        </div>
                        <div className="rba-cta-inline-actions">
                            <button className="rb-btn-primary" onClick={() => setView('builder')}>✨ Build Free Resume</button>
                            <button className="rb-btn-ghost" onClick={() => navigate('/signup')}>🔓 Register for Premium</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AIResumeBuilderApp;
