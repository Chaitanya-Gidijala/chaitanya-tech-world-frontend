import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import WebDev from './components/WebDev';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import CtaBanner from './components/CtaBanner';
import GalleryPage from './components/GalleryPage';
import './PhotoEditor.css';

const Home = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Scroll progress bar */}
            <motion.div
                style={{
                    scaleX,
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: 'var(--gradient-brand)',
                    transformOrigin: '0%',
                    zIndex: 1000,
                }}
            />

            <Hero />
            <Services />
            <Portfolio />
            <WebDev />
            <Process />
            {/* <Testimonials /> */}
            <CtaBanner />
        </div>
    );
};

const PhotoEditorApp = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/service/:id" element={<GalleryPage type="service" />} />
            <Route path="/project/:id" element={<GalleryPage type="project" />} />
        </Routes>
    );
};

export default PhotoEditorApp;
