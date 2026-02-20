import React from 'react';
import { motion } from 'framer-motion';
import '../PhotoEditor.css';
import {
    Palette, Code2, ArrowRight, Sparkles, Star, MonitorSmartphone
} from 'lucide-react';

const fade = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const stats = [
    { num: '12+', label: 'Designs Delivered' },
    { num: '3+', label: 'Websites Built' },
    { num: '2+', label: 'Years Experience' },
    { num: '100%', label: 'Client Satisfaction' },
];

const Hero = () => (
    <section className="pe-hero">
        {/* animated grid */}
        <div className="pe-hero-grid" />
        {/* colour blobs */}
        <div className="pe-hero-orb pe-hero-orb-1" />
        <div className="pe-hero-orb pe-hero-orb-2" />
        <div className="pe-hero-orb pe-hero-orb-3" />

        <div className="container pe-hero-inner">
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
            >
                {/* Dual identity badges */}
                <motion.div variants={fade} className="pe-hero-badges">
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
                <motion.h1 variants={fade} className="pe-hero-h1">
                    <span className="pe-line">Crafting</span>
                    <span className="pe-line pe-shimmer-text">Beautiful Designs</span>
                    <span className="pe-line">&amp; Powerful Websites</span>
                </motion.h1>

                {/* Tagline */}
                <motion.p variants={fade} className="pe-hero-desc">
                    Wedding invitations, birthday cards, banners, and wallpapers — created with elegance.
                    Combined with modern, responsive, and custom-built websites that elevate your brand.
                </motion.p>

                {/* CTA buttons */}
                <motion.div variants={fade} className="pe-hero-ctas">
                    <button
                        className="pe-btn-primary"
                        onClick={() => document.getElementById('pe-portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <Sparkles size={16} /> View Designs
                    </button>
                    <button
                        className="pe-btn-ghost"
                        onClick={() => window.open('/contact', '_blank')}
                    >
                        Get Custom Invitation <ArrowRight size={15} />
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
                <motion.div variants={fade} className="pe-hero-stats">
                    {stats.map(({ num, label }) => (
                        <div key={label} className="pe-hero-stat">
                            <span className="pe-hero-stat-num">{num}</span>
                            <span className="pe-hero-stat-label">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    </section>
);

export default Hero;
