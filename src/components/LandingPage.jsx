import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Camera, Wallet, ArrowRight, Globe, Map, Briefcase,
    Zap, Shield, Cpu, Code2, Sparkles, Star, Users, Database, Layout, Smartphone,
    Code, Activity, Terminal, Hash, Layers, CheckCircle2, Rocket, PiggyBank, FileText
} from 'lucide-react';
import '../styles/LandingPage.css';

const FloatingSymbols = () => {
    const symbols = [
        { Icon: Cpu, top: '10%', left: '5%', size: 40, delay: 0 },
        { Icon: Code, top: '20%', left: '85%', size: 30, delay: 2 },
        { Icon: Globe, top: '70%', left: '10%', size: 50, delay: 4 },
        { Icon: Zap, top: '80%', left: '90%', size: 35, delay: 1 },
        { Icon: Terminal, top: '40%', left: '15%', size: 25, delay: 3 },
        { Icon: Database, top: '60%', left: '80%', size: 45, delay: 5 },
    ];

    return (
        <div className="bg-symbols">
            {symbols.map((s, i) => (
                <motion.div
                    key={i}
                    className="floating-symbol"
                    style={{ top: s.top, left: s.left }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        delay: s.delay,
                        ease: "easeInOut"
                    }}
                >
                    <s.Icon size={s.size} />
                </motion.div>
            ))}
        </div>
    );
};

const CodePulse = () => (
    <div className="code-pulse-wrap">
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                className="pulse-ring"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: [0, 0.1, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
            />
        ))}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <Code2 size={120} strokeWidth={0.5} className="pulse-icon" />
        </motion.div>
    </div>
);

const LandingPage = () => {
    const handleMouseMove = (e) => {
        const cards = document.getElementsByClassName('app-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    };
    return (
        <div className="landing-wrapper" onMouseMove={handleMouseMove}>
            <FloatingSymbols />
            <div className="hero-spotlight" />
            <CodePulse />

            {/* ── HERO SECTION ── */}
            <div className="container" style={{
                minHeight: '65vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '3rem 1rem',
                position: 'relative',
                zIndex: 2
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div
                        className="hero-badge"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Sparkles size={16} className="text-indigo-400" />
                        Next Generation Digital Suite
                    </motion.div>
                    <motion.h1
                        className="lp-hero-h1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Build Your Future with <br />
                        <span className="text-gradient">Chaitanya Tech World</span>
                    </motion.h1>
                    <motion.p
                        className="lp-hero-desc"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                    >
                        Discover a curated collection of powerful web applications designed to solve real-world problems with elegance and speed.
                    </motion.p>
                    <div className="lp-hero-btns">
                        <a href="#apps-grid" className="btn btn-primary lp-hero-btn">Explore Apps</a>
                        <Link to="/contact" className="btn lp-btn-secondary lp-hero-btn">Let's Talk</Link>
                    </div>
                </motion.div>
            </div>

            {/* ── TRUST BAR ── */}
            <div className="trust-bar">
                <div className="container">
                    <p className="trust-text">POWERING DIGITAL INNOVATION FOR PROFESSIONALS WORLDWIDE</p>
                    <div className="tech-marquee">
                        {['React', 'Next.js', 'Vite', 'Node.js', 'Tailwind', 'Framer Motion', 'MongoDB'].map((tech, i) => (
                            <div key={i} className="tech-tag">{tech}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── APPS GRID SECTION ── */}
            <section id="apps-grid" className="container apps-grid-section">
                <div className="landing-section-header">
                    <span className="landing-section-badge">Our Ecosystem</span>
                    <h2 className="landing-section-title">One Platform, Infinite Possibilities</h2>
                </div>

                <div className="lp-apps-grid">
                    {/* App items mapped here for cleaner code */}
                    {[
                        {
                            title: 'AI Resume Builder',
                            desc: 'Build ATS-optimised, professional resumes in minutes with 8 stunning templates.',
                            icon: FileText,
                            color: '#7c3aed',
                            path: '/ai-resume-builder',
                            delay: 0.05,
                            featured: true,
                            badge: '✨ New'
                        },
                        {
                            title: 'Job Portal',
                            desc: 'Premium job board with AI-driven matching and interview prep tools.',
                            icon: Briefcase,
                            color: '#3b82f6',
                            path: '/job-portal',
                            delay: 0.1,
                            featured: true
                        },
                        {
                            title: 'Photo Editor',
                            desc: 'Non-destructive image processing with professional grade filters.',
                            icon: Camera,
                            color: '#8b5cf6',
                            path: '/photo-editor',
                            delay: 0.2
                        }
                    ].map((app, i) => (
                        <Link to={app.path} key={i}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -8 }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: app.delay }}
                                className={`app-card ${app.featured ? 'featured' : ''}`}
                                style={{ '--app-color': app.color, position: 'relative' }}
                            >
                                <div className="app-card-header">
                                    <div className="app-icon-wrap">
                                        <app.icon size={24} />
                                    </div>
                                    <div className="app-header-text">
                                        <h3 className="app-title">{app.title}</h3>
                                        {app.badge && <span className="app-badge-pill">{app.badge}</span>}
                                    </div>
                                </div>
                                <div className="app-card-body">
                                    <p className="app-desc">{app.desc}</p>
                                </div>
                                <div className="app-link">
                                    Launch App <ArrowRight size={18} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── VISION SECTION ── */}
            <section className="vision-section">
                <div className="container vision-inner">
                    <div className="vision-content">
                        <span className="landing-section-badge purple">Our Philosophy</span>
                        <h2 className="landing-section-title white">Built for the modern <br /><span>High-Performance</span> web</h2>
                        <p className="vision-text">
                            We don't just build apps; we craft experiences. Every pixel, every interaction is engineered for maximum impact and flawless execution.
                        </p>
                        <div className="vision-stats">
                            <div className="v-stat">
                                <h3>99%</h3>
                                <p>Efficiency</p>
                            </div>
                            <div className="v-stat">
                                <h3>24/7</h3>
                                <p>Availability</p>
                            </div>
                            <div className="v-stat">
                                <h3>50ms</h3>
                                <p>Response Time</p>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        className="vision-visual"
                        initial={{ opacity: 0, rotate: -10 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                    >
                        <Cpu size={200} strokeWidth={0.5} className="v-icon-glow" />
                    </motion.div>
                </div>
            </section>

            {/* ── TECHNOLOGY STACK ── */}
            <section className="tech-stack-section">
                <div className="container">
                    <div className="landing-section-header center">
                        <span className="landing-section-badge">The Engine Room</span>
                        <h2 className="landing-section-title">Industry Standard Tech</h2>
                    </div>
                    <div className="tech-grid">
                        {[
                            { icon: Code2, title: 'Clean Architecture', desc: 'Maintainable, scalable codebase following SOLID principles.' },
                            { icon: Zap, title: 'Lightning Fast', desc: 'Blazing performance with zero layout shift and rapid TTFB.' },
                            { icon: Shield, title: 'Security First', desc: 'Robust protection and data privacy at the core of every app.' },
                            { icon: Layout, title: 'Adaptive Design', desc: 'Seamlessly floating between mobile, tablet and ultra-wide screens.' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="tech-item"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="tech-icon"><stat.icon size={23} /></div>
                                <div>
                                    <h6>{stat.title}</h6>
                                    <p>{stat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SERVICE / VALUE SECTION ── */}
            <section className="container" style={{ padding: '2.5rem 1rem' }}>
                <div className="landing-section-header center">
                    <span className="landing-section-badge">Sustainable Development</span>
                    <h2 className="landing-section-title">High Efficiency. <span>Low Cost.</span></h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        maxWidth: '700px',
                        margin: '1.5rem auto 0',
                        fontSize: '1.1rem'
                    }}>
                        I bridge the gap between premium performance and affordable development.
                        Get a fully structured, professional website without the enterprise markup.
                    </p>
                </div>

                <div className="service-grid">
                    {[
                        {
                            title: "Full-Stack Structure",
                            desc: "Complete architectural integrity from robust backends to pixel-perfect frontends.",
                            price: "Value Pack",
                            icon: Rocket,
                            features: ["Clean Folders", "DB Integration", "State Mgmt"]
                        },
                        {
                            title: "Ultra Efficiency",
                            desc: "Lightweight code for max speed, SEO, and zero layout shift.",
                            price: "Performance First",
                            icon: Zap,
                            features: ["100/100 Lighthouse", "Optimized Assets", "Fully Responsive"]
                        },
                        {
                            title: "Ethical Pricing",
                            desc: "Top-tier skills at honest rates. Pay for quality, not the brand.",
                            price: "Affordable",
                            icon: PiggyBank,
                            features: ["Zero Extra Fee", "Scalable Logic", "Future Proof"]
                        }
                    ].map((svc, i) => (
                        <motion.div
                            key={i}
                            className="service-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <span className="service-price-tag">{svc.price}</span>
                            <div className="service-card-header">
                                <div className="app-icon-wrap" style={{ '--app-color': 'var(--color-primary)' }}>
                                    <svc.icon size={24} />
                                </div>
                                <h3>{svc.title}</h3>
                            </div>
                            <div className="service-card-body">
                                <p className="service-desc">{svc.desc}</p>
                                <div className="service-features-list">
                                    {svc.features.map((f, fi) => (
                                        <div key={fi} className="service-feature-item">
                                            <CheckCircle2 size={14} />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Link to="/contact" className="btn lp-btn-secondary" style={{ width: '100%', marginTop: 'auto', textAlign: 'center', justifyContent: 'center' }}>Hire Me</Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="efficiency-highlight"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="eff-stat">
                        <h4>10x</h4>
                        <p>Better Value</p>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'var(--border-light)' }} />
                    <div className="eff-stat">
                        <h4>Zero</h4>
                        <p>Bloated Code</p>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'var(--border-light)' }} />
                    <div className="eff-stat">
                        <h4>100%</h4>
                        <p>Full Transparency</p>
                    </div>
                </motion.div>
            </section>

            {/* ── CTA ── */}
            <section className="container final-cta-section">
                <motion.div
                    className="final-cta"
                    whileHover={{ scale: 1.01 }}
                >
                    <div className="cta-left">
                        <Rocket size={120} className="cta-icon-float" />
                        <h2>Ready for the next experience?</h2>
                        <p>Join the thousands already using Chaitanya Tech World today.</p>
                    </div>
                    <div className="cta-right">
                        <Link to="/contact" className="btn btn-primary lp-hero-btn">Contact Developer</Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default LandingPage;
