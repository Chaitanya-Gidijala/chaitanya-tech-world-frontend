import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../PhotoEditor.css';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Design', 'Websites', 'Branding'];

let galleryData = {};
try {
    galleryData = JSON.parse(import.meta.env.VITE_PHOTO_EDITOR_GALLERY_JSON || '{}');
} catch (e) {
    console.warn('Could not parse gallery JSON from env');
}

export const projects = [
    {
        id: 1, cat: 'Design',
        img: galleryData?.portfolioImages?.['1'] || '',
        title: 'Royal Wedding Suite',
        desc: 'Luxury wedding invitation set with gold foil typography',
    },
    {
        id: 2, cat: 'Websites',
        img: galleryData?.portfolioImages?.['2'] || '',
        title: 'Portfolio Website',
        desc: 'Full-stack React portfolio with dark/light mode',
    },
    {
        id: 3, cat: 'Design',
        img: galleryData?.portfolioImages?.['3'] || '',
        title: 'Birthday Bash Cards',
        desc: 'Vibrant birthday invitation series — 3 themes',
    },
    {
        id: 4, cat: 'Branding',
        img: galleryData?.portfolioImages?.['4'] || '',
        title: 'Startup Brand Kit',
        desc: 'Logo, colour palette, and social media kit',
    },
    {
        id: 5, cat: 'Websites',
        img: galleryData?.portfolioImages?.['5'] || '',
        title: 'E-Commerce Store',
        desc: 'Full-stack shop with cart, payments & admin panel',
    },
    {
        id: 6, cat: 'Design',
        img: galleryData?.portfolioImages?.['6'] || '',
        title: 'Housewarming Invite',
        desc: 'Warm & modern housewarming invitation design',
    },
    {
        id: 7, cat: 'Branding',
        img: galleryData?.portfolioImages?.['7'] || '',
        title: 'Restaurant Branding',
        desc: 'Menu design, food photography editing & social assets',
    },
    {
        id: 8, cat: 'Websites',
        img: galleryData?.portfolioImages?.['8'] || '',
        title: 'SaaS Dashboard',
        desc: 'Analytics dashboard with real-time charts',
    },
    {
        id: 9, cat: 'Design',
        img: galleryData?.portfolioImages?.['9'] || '',
        title: 'Corporate Event Kit',
        desc: 'Conference banners, badges, and invitation suite',
    },
];

const Portfolio = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState('All');

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
                                <div className="pe-portfolio-img-wrap" onClick={() => navigate(`/photo-editor/project/${p.id}`)}>
                                    <img
                                        src={p.img}
                                        alt={p.title}
                                        className="pe-portfolio-img"
                                        loading="lazy"
                                    />
                                    {/* Hover overlay */}
                                    <div className="pe-portfolio-overlay">
                                        <div className="pe-portfolio-overlay-icon">
                                            <ExternalLink size={20} strokeWidth={2} />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="pe-portfolio-info">
                                    <motion.div className="pe-portfolio-cat" whileHover={{ scale: 1.05 }}>
                                        {p.cat}
                                    </motion.div>
                                    <div className="pe-portfolio-title-row">
                                        <h3 className="pe-portfolio-title">{p.title}</h3>
                                        <ArrowUpRight size={16} className="pe-portfolio-title-icon" strokeWidth={2.5} />
                                    </div>
                                    <p className="pe-portfolio-link">
                                        {p.desc}
                                    </p>
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
