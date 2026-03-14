import React, { useState, useRef, useCallback } from 'react';
import './styles/resume-builder.css';

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════ */

const DEFAULT_RESUME = {
    name: 'Chaitanya Gidijala',
    title: 'Senior UI/UX Developer',
    email: 'chaitanya@example.com',
    phone: '+91 98765 43210',
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
        id: 'modern-pro',
        name: 'Modern Pro',
        tag: 'Popular',
        tagColor: '#6366f1',
        accent: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        accentSolid: '#6366f1',
        headerBg: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)',
        headerText: '#fff',
        borderAccent: '#6366f1',
        sidebarBg: '#f0f0ff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: 'linear-gradient(135deg,#1e1b4b,#312e81)',
            accent: '#6366f1',
        },
    },
    {
        id: 'clean-minimal',
        name: 'Clean Minimal',
        tag: 'ATS Friendly',
        tagColor: '#059669',
        accent: 'linear-gradient(135deg,#059669,#10b981)',
        accentSolid: '#059669',
        headerBg: '#fff',
        headerText: '#111827',
        borderAccent: '#059669',
        sidebarBg: '#f0fdf4',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: '#f0fdf4',
            accent: '#059669',
        },
    },
    {
        id: 'executive-dark',
        name: 'Executive Dark',
        tag: 'Premium',
        tagColor: '#f59e0b',
        accent: 'linear-gradient(135deg,#b45309,#f59e0b)',
        accentSolid: '#d97706',
        headerBg: 'linear-gradient(135deg,#1c1917 0%,#292524 100%)',
        headerText: '#fff',
        borderAccent: '#d97706',
        sidebarBg: '#fdf8f0',
        bodyFont: "'Georgia', serif",
        previewThumb: {
            header: 'linear-gradient(135deg,#1c1917,#292524)',
            accent: '#d97706',
        },
    },
    {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        tag: 'Creative',
        tagColor: '#0ea5e9',
        accent: 'linear-gradient(135deg,#0284c7,#38bdf8)',
        accentSolid: '#0284c7',
        headerBg: 'linear-gradient(135deg,#0c4a6e 0%,#075985 100%)',
        headerText: '#fff',
        borderAccent: '#0284c7',
        sidebarBg: '#f0f9ff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: 'linear-gradient(135deg,#0c4a6e,#075985)',
            accent: '#0284c7',
        },
    },
    {
        id: 'rose-elegant',
        name: 'Rose Elegant',
        tag: 'Modern',
        tagColor: '#e11d48',
        accent: 'linear-gradient(135deg,#be123c,#f43f5e)',
        accentSolid: '#e11d48',
        headerBg: 'linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)',
        headerText: '#881337',
        borderAccent: '#e11d48',
        sidebarBg: '#fff1f2',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
            accent: '#e11d48',
        },
    },
    {
        id: 'forest-green',
        name: 'Forest Green',
        tag: 'Nature',
        tagColor: '#16a34a',
        accent: 'linear-gradient(135deg,#15803d,#22c55e)',
        accentSolid: '#16a34a',
        headerBg: 'linear-gradient(135deg,#14532d 0%,#166534 100%)',
        headerText: '#fff',
        borderAccent: '#16a34a',
        sidebarBg: '#f0fff4',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: 'linear-gradient(135deg,#14532d,#166534)',
            accent: '#16a34a',
        },
    },
    {
        id: 'purple-vibe',
        name: 'Purple Vibe',
        tag: 'Bold',
        tagColor: '#9333ea',
        accent: 'linear-gradient(135deg,#7e22ce,#a855f7)',
        accentSolid: '#9333ea',
        headerBg: 'linear-gradient(135deg,#4a1d96 0%,#6d28d9 100%)',
        headerText: '#fff',
        borderAccent: '#9333ea',
        sidebarBg: '#faf5ff',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: 'linear-gradient(135deg,#4a1d96,#6d28d9)',
            accent: '#9333ea',
        },
    },
    {
        id: 'slate-professional',
        name: 'Slate Pro',
        tag: 'Corporate',
        tagColor: '#475569',
        accent: 'linear-gradient(135deg,#334155,#64748b)',
        accentSolid: '#475569',
        headerBg: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
        headerText: '#fff',
        borderAccent: '#475569',
        sidebarBg: '#f8fafc',
        bodyFont: "'Inter', sans-serif",
        previewThumb: {
            header: 'linear-gradient(135deg,#0f172a,#1e293b)',
            accent: '#475569',
        },
    },
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
    const sidebarTemplates = ['modern-pro', 'ocean-blue', 'purple-vibe', 'forest-green', 'slate-professional'];
    const isSidebar = sidebarTemplates.includes(tpl.id);

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
    const [view, setView] = useState('landing'); // 'landing' | 'builder'
    const [resume, setResume] = useState(DEFAULT_RESUME);
    const [activeTpl, setActiveTpl] = useState(TEMPLATES[0]);
    const [activeTab, setActiveTab] = useState('personal');
    const [mobileView, setMobileView] = useState('edit'); // 'edit' | 'preview'
    const [atsScore] = useState(Math.floor(Math.random() * 6) + 92);
    const [previewScale, setPreviewScale] = useState(1);

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

    const handleTemplateSelect = (tpl) => {
        setActiveTpl(tpl);
        setView('builder');
        setMobileView('edit');
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
                        <button className="rba-download-btn" onClick={() => downloadResume(resume.name)}>
                            ⬇ PDF
                        </button>
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

            {/* Templates Gallery */}
            <section className="rba-tpls-section" id="templates">
                <div className="rb-container">
                    <div className="rba-section-header">
                        <div className="rb-section-label">🎨 Templates</div>
                        <h2 className="rb-section-h2">8 Professional Templates</h2>
                        <p className="rb-section-sub">Every template is fully editable and ATS-optimised. Click to customise.</p>
                    </div>
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
                </div>
            </section>

            {/* How It Works */}
            <section className="rba-how-section">
                <div className="rb-container">
                    <div className="rba-section-header">
                        <div className="rb-section-label">⚡ How It Works</div>
                        <h2 className="rb-section-h2">From Blank Page to Dream Job in 4 Steps</h2>
                    </div>
                    <div className="rba-how-grid">
                        {[
                            { num: 1, icon: '🎨', title: 'Pick a Template', desc: 'Choose from 8 professionally designed, ATS-friendly templates.' },
                            { num: 2, icon: '✏️', title: 'Edit Your Details', desc: 'Fill in your info using our real-time editor. AI suggests improvements.' },
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

            {/* CTA */}
            <section className="rba-cta-section">
                <div className="rb-container">
                    <div className="rba-cta-card">
                        <div className="rba-cta-orb rba-cta-orb-1" />
                        <div className="rba-cta-orb rba-cta-orb-2" />
                        <div className="rba-cta-content">
                            <h2 className="rba-cta-h2">Ready to Land Your Dream Job?</h2>
                            <p className="rba-cta-sub">Build a stunning, editable, ATS-optimised resume in under 5 minutes.</p>
                        </div>
                        <button className="rba-cta-btn" onClick={() => setView('builder')}>
                            ✨ Start Building — It's Free
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AIResumeBuilderApp;
