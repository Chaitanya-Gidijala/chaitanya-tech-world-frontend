import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../PhotoEditor.css';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { testimonials } from '../../../config/photoEditorData';

// How many cards visible at once (changes per breakpoint via CSS)
const VISIBLE = 3;

const Testimonials = () => {
    const [index, setIndex] = useState(0);
    const total = testimonials.length;
    const maxIndex = total - VISIBLE;

    const prev = () => setIndex(i => Math.max(0, i - 1));
    const next = () => setIndex(i => Math.min(maxIndex, i + 1));

    return (
        <section className="pe-section pe-testimonials">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="pe-tag" style={{ margin: '0 auto 1rem' }}>
                        Client Stories
                    </div>
                    <h2 className="pe-section-title">
                        What Clients <span className="text-gradient">Say</span>
                    </h2>
                    <p className="pe-section-subtitle">
                        Real feedback from real clients. Building trust through quality work
                        and exceptional communication — every single time.
                    </p>
                </motion.div>

                {/* Track */}
                <div className="pe-testimonials-track-wrap">
                    <motion.div
                        className="pe-testimonials-track"
                        animate={{ x: `calc(-${index * (100 / VISIBLE)}% - ${index * 1.5 / VISIBLE}rem)` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                    >
                        {testimonials.map(({ name, role, initials, color, text, stars }) => (
                            <div key={name} className="pe-testimonial-card">
                                {/* Stars */}
                                <div className="pe-testimonial-stars">
                                    {Array.from({ length: stars }).map((_, i) => (
                                        <Star key={i} size={15} fill="currentColor" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="pe-testimonial-quote">{text}</p>

                                {/* Author */}
                                <div className="pe-testimonial-author">
                                    <div
                                        className="pe-testimonial-avatar"
                                        style={{ background: color }}
                                    >
                                        {initials}
                                    </div>
                                    <div>
                                        <p className="pe-testimonial-name">{name}</p>
                                        <p className="pe-testimonial-role">{role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Arrows + dots */}
                <div className="pe-carousel-arrows">
                    <button
                        className="pe-carousel-arrow"
                        onClick={prev}
                        disabled={index === 0}
                        style={{ opacity: index === 0 ? 0.4 : 1 }}
                        aria-label="Previous"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        className="pe-carousel-arrow"
                        onClick={next}
                        disabled={index >= maxIndex}
                        style={{ opacity: index >= maxIndex ? 0.4 : 1 }}
                        aria-label="Next"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="pe-carousel-dots">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            className={`pe-carousel-dot ${index === i ? 'active' : ''}`}
                            onClick={() => setIndex(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
