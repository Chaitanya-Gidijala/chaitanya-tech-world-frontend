import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../PhotoEditor.css';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Priya S.',
        role: 'Bride — Wedding Invitation Client',
        initials: 'PS',
        color: '#c084fc',
        text: '"My wedding invitations were absolutely stunning. Every guest complimented them. The attention to detail and the luxury feel was exactly what I dreamed of. Highly recommend!"',
        stars: 5,
    },
    {
        name: 'Rohan M.',
        role: 'Startup Founder — Website Client',
        initials: 'RM',
        color: '#60a5fa',
        text: '"Chaitanya built our product landing page from scratch. Clean code, blazing fast, and the design wowed our investors. Delivered ahead of schedule with zero issues."',
        stars: 5,
    },
    {
        name: 'Sneha K.',
        role: 'Event Organiser — Design Client',
        initials: 'SK',
        color: '#f472b6',
        text: '"The birthday invitation suite was vibrant and perfectly on-theme. Quick turnaround, multiple revisions accommodated, and the final files were print-ready. Brilliant work!"',
        stars: 5,
    },
    {
        name: 'Arjun D.',
        role: 'Restaurant Owner — Branding Client',
        initials: 'AD',
        color: '#34d399',
        text: "Complete branding package — logo, menu design, social media templates. The work transformed our restaurant's visual identity.We've seen more footfall since the rebrand.",
        stars: 5,
    },
    {
        name: 'Kavya R.',
        role: 'Blogger — Portfolio Website',
        initials: 'KR',
        color: '#fb923c',
        text: '"My new portfolio site is everything I envisioned and more. Dark/light mode, smooth animations, and it loads so fast. My clients are seriously impressed."',
        stars: 5,
    },
];

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
