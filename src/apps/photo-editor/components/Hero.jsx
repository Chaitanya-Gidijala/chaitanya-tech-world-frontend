import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { photoEditorConfig } from '../../../config/photoEditorConfig';

// Professional colors for character hover effects
const HOVER_COLORS = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#06B6D4', // Cyan
];

const InteractiveTitle = ({ text, className, baseColor = 'text-main' }) => {
    return (
        <span className={className} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    style={{
                        display: 'inline-block',
                        cursor: 'default',
                        color: char === ' ' ? 'inherit' : undefined
                    }}
                    whileHover={{
                        scale: 1.2,
                        y: -5,
                        color: HOVER_COLORS[index % HOVER_COLORS.length],
                        // Important: Override text-fill-color to allow solid color on hover
                        // regardless of parent's gradient background
                        WebkitTextFillColor: HOVER_COLORS[index % HOVER_COLORS.length],
                        textShadow: `0 0 20px ${HOVER_COLORS[index % HOVER_COLORS.length]}`
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};

const Hero = () => {
    const { title, highlight, subtitle, cta } = photoEditorConfig.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} style={{
            minHeight: '95vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '4rem 0',
            textAlign: 'center',
            background: '#0a0a0a' // Darker base for better contrast
        }} className="container-fluid">

            {/* New Background Format: Cyber-Aurora Grid */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                {/* Grid Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    opacity: 0.5
                }} />

                {/* Dynamic Gradient Orbs */}
                <motion.div style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '20%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    y: yBackground
                }} />

                <motion.div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '10%',
                    width: '700px',
                    height: '700px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    y: useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
                }} />

                {/* Light Beam */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '1px', height: '100%',
                    background: 'linear-gradient(to bottom, transparent, var(--color-primary), transparent)',
                    opacity: 0.1
                }} />
            </div>

            <motion.div
                style={{ position: 'relative', zIndex: 2, opacity: opacityHero, width: '100%', maxWidth: '1200px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Decorative Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '50px',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Sparkles size={16} className="text-secondary" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>NEXT GEN EDITING</span>
                </motion.div>

                <h1 style={{
                    fontSize: 'clamp(3.5rem, 10vw, 7rem)', // Bigger font size
                    fontWeight: '900',
                    lineHeight: 1,
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase', // Powerful aesthetic
                    letterSpacing: '-0.02em',
                    color: 'var(--text-main)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {/* Interactive Title Line 1 */}
                    <InteractiveTitle text={title} />

                    {/* Interactive Highlight Line 2 */}
                    <InteractiveTitle
                        text={highlight}
                        className="text-gradient" // Keep gradient base, but hover overrides it
                    />
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    style={{
                        fontSize: '1.25rem',
                        maxWidth: '700px',
                        margin: '0 auto 3rem auto',
                        color: 'var(--text-muted)',
                        lineHeight: '1.7',
                        fontWeight: '300'
                    }}
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px var(--color-primary-glow)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                        style={{
                            padding: '1.25rem 3rem',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: '#000', // Black text for contrast on bright button
                            background: 'var(--color-primary)', // Solid primary color
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {cta} <ArrowRight size={20} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '1.25rem 3rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            background: 'transparent',
                            border: '1px solid var(--border-light)',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(5px)'
                        }}
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Learn More
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
