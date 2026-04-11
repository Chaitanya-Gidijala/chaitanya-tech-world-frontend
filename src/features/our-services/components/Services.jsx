import React from 'react';
import { motion } from 'framer-motion';
import '../styles/OurServices_v1.css';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { services } from '../config/photoEditorData';

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] },
    }),
};

const Services = () => {
    const navigate = useNavigate();

    return (
        <section id="pe-services" className="pe-section pe-services">
            <div className="container">
                {/* Section header */}
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

                {/* Cards grid */}
                <div className="pe-svc-img-grid">
                    {services.map(({ id, Icon, title, desc, cta, img, accent, tag }, i) => (
                        <motion.div
                            key={id}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            className="pe-svc-img-card"
                            onClick={() => navigate(`/services/service/${id}`)}
                            whileHover="hover"
                        >
                            {/* Image panel */}
                            <div className="pe-svc-img-panel">
                                <motion.img
                                    src={img}
                                    alt={title}
                                    className="pe-svc-img"
                                    loading="lazy"
                                    variants={{ hover: { scale: 1.07 } }}
                                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                />
                                {/* gradient overlay */}
                                <div className="pe-svc-img-overlay" style={{ background: `${accent.replace('linear-gradient', 'linear-gradient').replace(')', ',0.55)')}` }} />

                                {/* Tag badge */}
                                <div className="pe-svc-tag-badge" style={{ background: accent }}>
                                    {tag}
                                </div>

                                {/* Icon circle */}
                                <div className="pe-svc-icon-circle" style={{ background: accent }}>
                                    <Icon size={20} color="#fff" strokeWidth={1.8} />
                                </div>
                            </div>

                            {/* Text panel */}
                            <div className="pe-svc-text-panel">
                                <h3 className="pe-svc-card-title">{title}</h3>
                                <p className="pe-svc-card-desc">{desc}</p>
                                <motion.div
                                    className="pe-svc-card-cta"
                                    style={{ color: 'var(--color-primary)' }}
                                    variants={{ hover: { gap: '0.65rem' } }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span
                                        className="pe-svc-cta-bar"
                                        style={{ background: accent }}
                                    />
                                    {cta}
                                    <motion.span
                                        className="pe-svc-cta-arrow"
                                        variants={{ hover: { x: 4, y: -4 } }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <ArrowUpRight size={15} strokeWidth={2.5} />
                                    </motion.span>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
