import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, Globe, Briefcase, Zap, Shield, Cpu, Code2, Sparkles,
    Users, Database, Layout, Target, BookOpen, MessageCircle, Heart,
    Coffee, FileText, CheckCircle2
} from 'lucide-react';
import { incrementVisitorCount } from '@/features/job-portal/services/analyticsService';
import LandingNavbar from '@/components/layout/LandingNavbar';
import './LandingPage.css';

/* ── Animation Presets ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
});

const fadeLeft = (delay = 0) => ({
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
});

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const LandingPage = ({ theme, toggleTheme }) => {

    useEffect(() => {
        incrementVisitorCount({
            page: 'Home Landing Page',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        }).catch(() => {});
    }, []);

    return (
        <div className="landing-wrapper">
            {/* Background Blobs for Crope aesthetic */}
            <div className="bg-blob bg-blob-1" />
            <div className="bg-blob bg-blob-2" />
            <div className="bg-blob bg-blob-3" />

            <LandingNavbar theme={theme} onToggleTheme={toggleTheme} />

            {/* ═══════════════════════════════════════════
                §1 — HERO (Crope Style)
               ═══════════════════════════════════════════ */}
            <section id="hero" className="crope-hero crope-container">
                <div className="crope-hero-bg-anim">
                    <div className="hero-blob-mobile" />
                </div>
                <div className="crope-hero-grid">
                    <motion.div {...fadeUp()} className="crope-hero-content">
                        <div className="crope-section-tag">Digital Excellence</div>
                        <h1 className="crope-title">
                            Creative<br/>
                            <span className="shine-text">Never Ends</span>
                        </h1>
                        <p className="crope-subtitle">
                            Welcome to Chaitanya Tech World. A premium suite of web applications designed to solve real-world problems with elegance, speed, and cutting-edge technology.
                        </p>
                        <div className="crope-hero-actions">
                            <a href="#apps-grid" className="crope-btn crope-btn-primary">
                                Explore Ecosystem <ArrowRight size={18} />
                            </a>
                            <Link to="/contact" className="crope-btn crope-btn-outline">
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div {...fadeLeft(0.2)} className="crope-hero-visual">
                        <img src="/our-services-hero-banner.jpg" alt="Creative Studio" className="hero-main-img" />
                        
                        {/* Floating elements typical of Crope */}
                        <motion.div 
                            animate={{ y: [0, -15, 0] }} 
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="hero-floating-element hero-float-1"
                        >
                            <div className="crope-icon-btn"><Zap size={24} /></div>
                            <div>
                                <h4 style={{ fontWeight: 800 }}>Lightning Fast</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zero layout shift</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 15, 0] }} 
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="hero-floating-element hero-float-2"
                        >
                            <div className="crope-icon-btn"><Layout size={24} /></div>
                            <div>
                                <h4 style={{ fontWeight: 800 }}>Pixel Perfect</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Modern Design</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                §2 — ECOSYSTEM / SERVICES
               ═══════════════════════════════════════════ */}
            <section id="apps-grid" className="crope-services crope-container">
                <div style={{ textAlign: 'center' }}>
                    <div className="crope-section-tag">Our Ecosystem</div>
                    <h2 className="crope-h2">Digital Products</h2>
                </div>

                <div className="crope-service-grid">
                    {[
                        { title: 'AI Resume Builder', desc: 'Craft ATS-friendly, professional resumes in minutes using our intelligent builder and premium templates.', icon: FileText, path: '/ai-resume-builder' },
                        { title: 'Job Portal', desc: 'A sophisticated platform connecting top talent with industry-leading opportunities, featuring advanced filtering.', icon: Briefcase, path: '/job-portal' },
                        { title: 'Our Services', desc: 'Bespoke web development and high-end digital solutions tailored to elevate your business presence.', icon: Sparkles, path: '/services' }
                    ].map((app, i) => (
                        <motion.div key={i} {...fadeUp(i * 0.1)} className="crope-service-card">
                            <div className="crope-service-header">
                                <div className="crope-service-icon">
                                    <app.icon size={32} />
                                </div>
                                <h3>{app.title}</h3>
                            </div>
                            <p>{app.desc}</p>
                            <Link to={app.path} className="crope-link-arrow">
                                Launch App <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                §4 — PREPARATION HUB (Portfolio Style)
               ═══════════════════════════════════════════ */}
            <section id="prep-hub" className="crope-portfolio">
                <div className="crope-container">
                    <div style={{ textAlign: 'center' }}>
                        <div className="crope-section-tag">Career Accelerator</div>
                        <h2 className="crope-h2">Preparation Hub</h2>
                        <p className="crope-subtitle" style={{ margin: '0 auto 3rem' }}>
                            Master your technical interviews with our comprehensive suite of preparation tools — from curated questions to timed mock tests.
                        </p>
                    </div>

                    <div className="crope-portfolio-grid">
                        {[
                            { title: 'Mock Tests', desc: 'Simulate real exam conditions with timed MCQ tests.', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', path: '/job-portal/prep/tests' },
                            { title: 'Interview Questions', desc: 'Curated library of tech questions & answers.', img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800', path: '/job-portal/prep/questions' },
                            { title: 'Learning Resources', desc: 'Hand-picked articles, tutorials, and cheat sheets.', img: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800', path: '/job-portal/prep/resources' }
                        ].map((item, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.2)} className="crope-port-card">
                                <div className="crope-port-img-wrap">
                                    <img src={item.img} alt={item.title} className="crope-port-img" />
                                    <div className="crope-port-overlay">
                                        <div className="crope-port-content">
                                            <h3>{item.title}</h3>
                                            <p>{item.desc}</p>
                                            <Link to={item.path} className="crope-link-arrow" style={{ color: '#fff', marginTop: '1rem' }}>
                                                Explore <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <Link to="/job-portal/prep" className="crope-btn crope-btn-primary" style={{ padding: '1rem 3rem' }}>
                            View Full Prep Hub <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                §NEW — CORE FEATURES
               ═══════════════════════════════════════════ */}
            <section className="crope-features crope-container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div className="crope-section-tag">Why Choose Us</div>
                    <h2 className="crope-h2">Core Features</h2>
                </div>
                <div className="crope-features-grid">
                    {[
                        { title: 'Lightning Fast', desc: 'Optimized for speed with zero layout shift and instantaneous load times.', icon: Zap },
                        { title: 'Enterprise Security', desc: 'Bank-grade encryption and secure authentication protecting your data.', icon: Shield },
                        { title: 'Global Infrastructure', desc: 'Distributed servers ensure high availability and low latency everywhere.', icon: Globe },
                        { title: 'Data Analytics', desc: 'Advanced tracking and reporting capabilities to monitor your progress.', icon: Database }
                    ].map((feature, i) => (
                        <motion.div key={i} {...fadeUp(i * 0.1)} className="crope-feature-card">
                            <div className="crope-feature-icon"><feature.icon size={28} /></div>
                            <div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                §5 — SUPPORT ME (Contact Style)
               ═══════════════════════════════════════════ */}
            <section id="support-me" className="crope-contact crope-container">
                <motion.div {...fadeUp()} className="crope-contact-box">
                    <div className="crope-contact-content">
                        <h2>Help Me Build<br/>& Grow</h2>
                        <p>
                            As an independent developer, I build these tools with passion — no ads, no trackers, just pure value. Your support fuels continuous development and keeps essential tools free for the community.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <Link to="/support-me" className="crope-btn crope-btn-white">
                                <Heart size={18} fill="currentColor" /> Support My Work
                            </Link>
                            <Link to="/contact" className="crope-btn crope-btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                                Let's Connect
                            </Link>
                        </div>
                    </div>
                    <div className="crope-contact-visual" style={{ position: 'relative', zIndex: 2 }}>
                        <img src="/support_community_v2.png" alt="Support" style={{ width: '100%', maxWidth: '350px', borderRadius: '24px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }} />
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════
                §6 — MARQUEE FOOTER 
               ═══════════════════════════════════════════ */}
            <div className="crope-marquee">
                <div className="crope-marquee-inner">
                    <span className="crope-marquee-text">INNOVATION • CREATIVITY • EXCELLENCE • PERFORMANCE • </span>
                    <span className="crope-marquee-text">INNOVATION • CREATIVITY • EXCELLENCE • PERFORMANCE • </span>
                </div>
            </div>
            
        </div>
    );
};

export default LandingPage;
