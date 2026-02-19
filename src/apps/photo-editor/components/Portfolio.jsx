import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../PhotoEditor.css';
import { ExternalLink } from 'lucide-react';

const categories = ['All', 'Design', 'Websites', 'Branding'];

const projects = [
    {
        id: 1, cat: 'Design',
        emoji: '💍', bg: 'linear-gradient(135deg, #f9c6d0, #fde2e4)',
        darkBg: 'linear-gradient(135deg, #3d1a2b, #5a2a3a)',
        title: 'Royal Wedding Suite',
        desc: 'Luxury wedding invitation set with gold foil typography',
        link: '#',
    },
    {
        id: 2, cat: 'Websites',
        emoji: '🌐', bg: 'linear-gradient(135deg, #c9d6ff, #e2e0ff)',
        darkBg: 'linear-gradient(135deg, #1a1a3e, #2a2a5a)',
        title: 'Portfolio Website',
        desc: 'Full-stack React portfolio with dark/light mode',
        link: '#',
    },
    {
        id: 3, cat: 'Design',
        emoji: '🎂', bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
        darkBg: 'linear-gradient(135deg, #3a2010, #5a3020)',
        title: 'Birthday Bash Cards',
        desc: 'Vibrant birthday invitation series — 3 themes',
        link: '#',
    },
    {
        id: 4, cat: 'Branding',
        emoji: '✨', bg: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
        darkBg: 'linear-gradient(135deg, #102040, #1a3050)',
        title: 'Startup Brand Kit',
        desc: 'Logo, colour palette, and social media kit',
        link: '#',
    },
    {
        id: 5, cat: 'Websites',
        emoji: '🛒', bg: 'linear-gradient(135deg, #d4fc79, #96e6a1)',
        darkBg: 'linear-gradient(135deg, #0a2010, #1a4020)',
        title: 'E-Commerce Store',
        desc: 'Full-stack shop with cart, payments & admin panel',
        link: '#',
    },
    {
        id: 6, cat: 'Design',
        emoji: '🏠', bg: 'linear-gradient(135deg, #f6d365, #fda085)',
        darkBg: 'linear-gradient(135deg, #3a2000, #5a3000)',
        title: 'Housewarming Invite',
        desc: 'Warm & modern housewarming invitation design',
        link: '#',
    },
    {
        id: 7, cat: 'Branding',
        emoji: '🎨', bg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
        darkBg: 'linear-gradient(135deg, #1a0a30, #2a1050)',
        title: 'Restaurant Branding',
        desc: 'Menu design, food photography editing & social assets',
        link: '#',
    },
    {
        id: 8, cat: 'Websites',
        emoji: '📊', bg: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        darkBg: 'linear-gradient(135deg, #002820, #004840)',
        title: 'SaaS Dashboard',
        desc: 'Analytics dashboard with real-time charts',
        link: '#',
    },
    {
        id: 9, cat: 'Design',
        emoji: '💼', bg: 'linear-gradient(135deg, #30cfd0, #667eea)',
        darkBg: 'linear-gradient(135deg, #002030, #100830)',
        title: 'Corporate Event Kit',
        desc: 'Conference banners, badges, and invitation suite',
        link: '#',
    },
];

const Portfolio = () => {
    const [active, setActive] = useState('All');
    // detect dark
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const filtered = active === 'All' ? projects : projects.filter(p => p.cat === active);

    return (
        <section id="pe-portfolio" className="pe-section pe-portfolio">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="pe-tag" style={{ margin: '0 auto 1rem' }}>
                        My Work
                    </div>
                    <h2 className="pe-section-title">
                        Portfolio &amp; <span className="text-gradient">Reference Work</span>
                    </h2>
                    <p className="pe-section-subtitle">
                        A curated showcase of design and development projects. Each one crafted with
                        purpose, precision, and a premium aesthetic.
                    </p>
                </motion.div>

                {/* Filter tabs */}
                <div className="pe-filter-tabs">
                    {categories.map(cat => (
                        <motion.button
                            key={cat}
                            className={`pe-filter-btn ${active === cat ? 'active' : ''}`}
                            onClick={() => setActive(cat)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div layout className="pe-portfolio-grid">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((p, i) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ duration: 0.35, delay: i * 0.05 }}
                                className="pe-portfolio-card"
                            >
                                {/* Image area */}
                                <div className="pe-portfolio-img-wrap">
                                    <div
                                        className="pe-portfolio-img"
                                        style={{ background: isDark ? p.darkBg : p.bg }}
                                    >
                                        {p.emoji}
                                    </div>
                                    {/* Hover overlay */}
                                    <div className="pe-portfolio-overlay">
                                        <a
                                            href={p.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pe-portfolio-overlay-icon"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="pe-portfolio-info">
                                    <span className="pe-portfolio-cat">{p.cat}</span>
                                    <h3 className="pe-portfolio-title">{p.title}</h3>
                                    <div className="pe-portfolio-link">
                                        <ExternalLink size={11} /> {p.desc}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Portfolio;
