import React from 'react';
import { motion } from 'framer-motion';
import '../styles/OurServices_v1.css';
import {
    Palette, Code2, ArrowRight, Sparkles, Star, MonitorSmartphone
} from 'lucide-react';

const fade = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

import { heroStats as stats } from '../config/photoEditorData';

const Hero = () => (
    <section className="pe-hero">
        {/* animated grid */}
        <div className="pe-hero-grid" />
        {/* colour blobs */}
        <div className="pe-hero-orb pe-hero-orb-1" />
        <div className="pe-hero-orb pe-hero-orb-2" />
        <div className="pe-hero-orb pe-hero-orb-3" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="pe-hero-flex-layout">
                <motion.div
                    className="pe-hero-left-content"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Dual identity badges */}
                    <motion.div variants={fade} className="pe-hero-badges-left">
                        <span className="pe-hero-badge">
                            <Palette size={13} />
                            Creative Designer
                        </span>
                        <span className="pe-hero-badge" style={{ borderColor: 'hsla(260,100%,65%,0.3)' }}>
                            <span className="pe-hero-badge-dot" />
                            Available for Work
                        </span>
                        <span className="pe-hero-badge">
                            <Code2 size={13} />
                            Full Stack Developer
                        </span>
                    </motion.div>

                    {/* Main headline */}
                    <motion.h1 variants={fade} className="pe-hero-h1-left">
                        <span className="pe-line">Crafting</span>
                        <span className="pe-line pe-shimmer-text">Beautiful Designs</span>
                        <span className="pe-line-small">&amp; Powerful Websites</span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p variants={fade} className="pe-hero-desc-left">
                        Elegance in design meets modern, responsive, and custom-built code. We elevate your brand with purpose-driven digital experiences.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div variants={fade} className="pe-hero-ctas-left">
                        <button
                            className="pe-btn-primary"
                            onClick={() => document.getElementById('pe-portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Sparkles size={16} /> View Designs
                        </button>
                        <button
                            className="pe-btn-primary"
                            style={{ background: 'linear-gradient(135deg, hsl(260,100%,55%), hsl(190,100%,45%))' }}
                            onClick={() => document.getElementById('pe-webdev')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <MonitorSmartphone size={16} /> Build Your Website
                        </button>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div variants={fade} className="pe-hero-stats-left">
                        {stats.map(({ num, label }) => (
                            <div key={label} className="pe-hero-stat-item">
                                <span className="pe-hero-stat-num">{num}</span>
                                <span className="pe-hero-stat-label">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right side Custom SVG Illustration */}
                <motion.div
                    className="pe-hero-right-banner"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="pe-hero-vector-container">
                        <svg viewBox="0 0 500 500" className="pe-hero-svg">
                            <defs>
                                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(20, 10, 40, 0.95)" />
                                    <stop offset="100%" stopColor="rgba(8, 4, 20, 0.8)" />
                                </linearGradient>
                                <linearGradient id="glare" x1="0%" y1="0%" x2="120%" y2="120%">
                                    <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                                    <stop offset="50%" stopColor="white" stopOpacity="0" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                                </linearGradient>
                                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            <circle cx="250" cy="250" r="220" fill="url(#glow)" />

                            {/* Connection Lines */}
                            <motion.path
                                d="M 380 120 L 250 250 M 50 320 L 250 250"
                                stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />

                            {/* Main Platform Card */}
                            <motion.g
                                whileHover={{ scale: 1.02 }}
                                initial={{ y: 20 }}
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <rect
                                    x="90" y="140" width="320" height="220" rx="24"
                                    fill="url(#screenGrad)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
                                />

                                {/* Glass Shine / Glare */}
                                <rect x="90" y="140" width="320" height="220" rx="24" fill="url(#glare)" pointerEvents="none" />

                                {/* Browser Top Bar */}
                                <rect x="90" y="140" width="320" height="34" rx="17" fill="rgba(255,255,255,0.08)" />
                                <g transform="translate(120, 157)">
                                    <circle cx="0" cy="0" r="4.5" fill="#ff5f56" />
                                    <circle cx="18" cy="0" r="4.5" fill="#ffbd2e" />
                                    <circle cx="36" cy="0" r="4.5" fill="#27c93f" />
                                </g>

                                <text x="125" y="205" fill="white" fontSize="19" fontWeight="800" fontFamily="sans-serif" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                                    Creative Ecosystem
                                </text>

                                <rect x="125" y="230" width="210" height="9" rx="4.5" fill="rgba(255,255,255,0.2)" />
                                <rect x="125" y="252" width="170" height="9" rx="4.5" fill="rgba(255,255,255,0.1)" />
                                <rect x="125" y="274" width="240" height="9" rx="4.5" fill="rgba(255,255,255,0.15)" />

                                <motion.path
                                    d="M 125 325 Q 185 275 245 315 T 355 295"
                                    fill="none" stroke="var(--color-primary)" strokeWidth="3.5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                                />
                            </motion.g>

                            {/* Floating Design Node */}
                            <motion.g
                                animate={{ y: [0, -25, 0], x: [0, 5, 0], rotate: [0, 8, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <circle cx="390" cy="110" r="40" fill="rgba(124, 58, 237, 0.25)" stroke="var(--color-primary)" strokeWidth="2.5" style={{ filter: 'blur(0.5px)' }} />
                                <Palette x="368" y="88" size={44} color="var(--color-primary)" strokeWidth={2} />
                            </motion.g>

                            {/* Floating Tech Node */}
                            <motion.g
                                animate={{ y: [0, 25, 0], x: [0, -5, 0], rotate: [0, -8, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <rect x="40" y="280" width="80" height="80" rx="17" fill="rgba(0, 212, 255, 0.15)" stroke="var(--color-secondary)" strokeWidth="2.5" />
                                <Code2 x="60" y="299" size={44} color="var(--color-secondary)" strokeWidth={2} />
                            </motion.g>

                            {/* Pulsing Signal Dots on lines */}
                            <motion.circle r="3" fill="var(--color-tertiary)"
                                animate={{ cx: [390, 250], cy: [110, 250], opacity: [0, 1, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

export default Hero;
