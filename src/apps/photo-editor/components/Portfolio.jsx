import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../PhotoEditor.css';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { categories, projects } from '../../../config/photoEditorData';

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
                        What I Offer
                    </div>
                    <h2 className="pe-section-title">
                        Services &amp; <span className="text-gradient">Specialisations</span>
                    </h2>
                    <p className="pe-section-subtitle">
                        From intimate wedding invitations to enterprise websites — premium quality work
                        that makes every occasion and brand truly unforgettable.
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
                                <div className="pe-portfolio-img-wrap" onClick={() => navigate(`/photo-editor/service/${p.id}`)}>
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
