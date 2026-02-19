import React from 'react';
import { motion } from 'framer-motion';
import '../PhotoEditor.css';
import {
    Zap, Smartphone, ShieldCheck, Code2, ArrowRight, Globe
} from 'lucide-react';

const features = [
    {
        Icon: Code2,
        title: 'Custom Built From Scratch',
        desc: 'No templates, no page builders. Every line of code is crafted uniquely for your brand and goals.',
    },
    {
        Icon: Smartphone,
        title: 'Fully Responsive Design',
        desc: 'Pixel-perfect on every device — mobile, tablet, and desktop — ensuring a seamless user experience.',
    },
    {
        Icon: Zap,
        title: 'Blazing Fast Performance',
        desc: 'Optimised for speed and SEO. Your visitors get instant load times and search engines reward you.',
    },
    {
        Icon: ShieldCheck,
        title: 'Secure & Scalable',
        desc: 'Built with security best practices and architecture that grows with your business without limits.',
    },
];

const stats = [
    { num: '40+', label: 'Sites Delivered' },
    { num: '3+', label: 'Years in Dev' },
    { num: '100%', label: 'On-Time' },
];

const WebDev = () => (
    <section id="pe-webdev" className="pe-section pe-webdev">
        <div className="container">
            <div className="pe-webdev-split">

                {/* ── Left Content ── */}
                <motion.div
                    className="pe-webdev-content"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div>
                        <div className="pe-tag">Web Development</div>
                        <h2 className="pe-webdev-h2">
                            Custom Websites That{' '}
                            <span className="text-gradient">Drive Results</span>
                        </h2>
                    </div>

                    <p className="pe-webdev-desc">
                        I build modern, high-performance web applications using React, Node.js, and
                        the latest full-stack technologies. Every site is brand-new, built specifically
                        for your vision — not adapted from a generic template.
                    </p>

                    {/* Feature bullets */}
                    <div className="pe-webdev-features">
                        {features.map(({ Icon, title, desc }) => (
                            <div key={title} className="pe-webdev-feature">
                                <div className="pe-webdev-feature-icon">
                                    <Icon size={18} strokeWidth={1.8} />
                                </div>
                                <div className="pe-webdev-feature-text">
                                    <h4>{title}</h4>
                                    <p>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats row */}
                    <div className="pe-webdev-stats">
                        {stats.map(({ num, label }) => (
                            <div key={label} className="pe-webdev-stat">
                                <div className="pe-webdev-stat-num">{num}</div>
                                <div className="pe-webdev-stat-label">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <button
                        className="pe-btn-primary"
                        style={{ width: 'fit-content' }}
                        onClick={() => document.getElementById('pe-cta')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <Globe size={16} /> Start My Project <ArrowRight size={15} />
                    </button>
                </motion.div>

                {/* ── Right Visual ── */}
                <motion.div
                    className="pe-webdev-visual"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                >
                    {/* Browser mockup */}
                    <div className="pe-webdev-mockup">
                        {/* Browser bar */}
                        <div className="pe-mockup-bar">
                            <span className="pe-mockup-dot pe-mockup-dot-1" />
                            <span className="pe-mockup-dot pe-mockup-dot-2" />
                            <span className="pe-mockup-dot pe-mockup-dot-3" />
                            <div className="pe-mockup-url">
                                <Globe size={10} style={{ marginRight: '4px', flexShrink: 0 }} />
                                yourwebsite.com
                            </div>
                        </div>

                        {/* Simulated page layout */}
                        <div className="pe-mockup-body">
                            <div className="pe-mockup-hero-block" />
                            <div className="pe-mockup-cards">
                                <div className="pe-mockup-card-block" />
                                <div className="pe-mockup-card-block" />
                                <div className="pe-mockup-card-block" />
                            </div>
                            <div className="pe-mockup-text-lines">
                                <div className="pe-mockup-line" />
                                <div className="pe-mockup-line" />
                                <div className="pe-mockup-line pe-mockup-line-short" />
                            </div>
                            <div className="pe-mockup-cards">
                                <div className="pe-mockup-card-block" />
                                <div className="pe-mockup-card-block" />
                                <div className="pe-mockup-card-block" />
                            </div>
                            <div className="pe-mockup-text-lines">
                                <div className="pe-mockup-line" />
                                <div className="pe-mockup-line pe-mockup-line-short" />
                            </div>
                        </div>
                    </div>

                    {/* Floating trust badge */}
                    <div className="pe-webdev-float-badge">
                        <div className="pe-webdev-float-badge-num">100%</div>
                        <div className="pe-webdev-float-badge-label">Satisfaction</div>
                    </div>
                </motion.div>

            </div>
        </div>
    </section>
);

export default WebDev;
