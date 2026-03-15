import React from 'react';
import { motion } from 'framer-motion';
import '../PhotoEditor.css';
import { ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { services } from '../../../config/photoEditorData';

const card = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Services = () => {
    const navigate = useNavigate();

    return (
        <section id="pe-services" className="pe-section pe-services">
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

                <motion.div
                    className="pe-services-grid"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {services.map(({ id, Icon, title, desc, cta }) => (
                        <motion.div key={title} variants={card} className="pe-service-card" onClick={() => navigate(`/photo-editor/service/${id}`)} style={{ cursor: 'pointer' }}>
                            <div className="pe-service-icon-wrap">
                                <Icon size={22} strokeWidth={1.8} />
                            </div>
                            <h3 className="pe-service-title">{title}</h3>
                            <p className="pe-service-desc">{desc}</p>
                            <button
                                className="pe-service-cta"
                            >
                                {cta} <ArrowRight size={13} />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
