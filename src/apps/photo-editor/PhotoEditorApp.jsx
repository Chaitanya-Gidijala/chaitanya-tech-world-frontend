import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from './components/Hero';
import Services from './components/Services';
import Pricing from './components/Pricing';

const PhotoEditorApp = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Scroll Progress Bar */}
            <motion.div
                style={{
                    scaleX,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'var(--gradient-brand)',
                    transformOrigin: '0%',
                    zIndex: 1000
                }}
            />

            <Hero />
            <Services />
            <Pricing />
        </div>
    );
};

export default PhotoEditorApp;
