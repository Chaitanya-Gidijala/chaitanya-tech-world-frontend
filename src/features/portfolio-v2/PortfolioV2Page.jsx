import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Dribbble, Github, Mail, Menu } from 'lucide-react';
import './PortfolioV2Page.css';

const PortfolioV2Page = () => {
  
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const fadeRight = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="portv2-wrapper">
      <div className="portv2-bg-accents"></div>
      
      <div className="portv2-container">
        
        {/* HEADER */}
        <header className="portv2-header">
          <a href="#" className="portv2-logo">Chaitanya</a>
          
          <nav className="portv2-nav">
            <a href="#" className="active">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About me</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact me</a>
          </nav>
          
          <button className="portv2-btn-header">Hire Me</button>
          
          <button className="portv2-mobile-toggle">
            <Menu size={28} />
          </button>
        </header>

        {/* HERO SECTION */}
        <section className="portv2-hero">
          
          <motion.div 
            className="portv2-hero-left"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.p className="portv2-greeting" variants={fadeUp}>
              Hi I am
            </motion.p>
            <motion.h1 className="portv2-name" variants={fadeUp}>
              Chaitanya Gidijala
            </motion.h1>
            <motion.h2 className="portv2-role" variants={fadeUp}>
              Java Developer <br/> &amp; Full Stack Engineer
            </motion.h2>

            <motion.div className="portv2-socials" variants={fadeRight}>
              <a href="#" className="portv2-social-link"><Linkedin size={18} /></a>
              <a href="#" className="portv2-social-link"><Github size={18} /></a>
              <a href="#" className="portv2-social-link"><Mail size={18} /></a>
            </motion.div>

            <motion.div className="portv2-actions" variants={fadeUp}>
              <a href="#contact" className="portv2-btn-primary">Hire Me</a>
              <a href="/resume.pdf" target="_blank" className="portv2-btn-secondary">Download CV</a>
            </motion.div>

            <motion.div className="portv2-stats" variants={fadeUp}>
              <div className="portv2-stat-item">
                <span className="portv2-stat-number">2+</span>
                <span className="portv2-stat-label">Years Experience</span>
              </div>
              <div className="portv2-stat-item">
                <span className="portv2-stat-number">10+</span>
                <span className="portv2-stat-label">Projects Built</span>
              </div>
              <div className="portv2-stat-item">
                <span className="portv2-stat-number">5+</span>
                <span className="portv2-stat-label">Happy Clients</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="portv2-hero-right"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="portv2-image-wrapper">
              <div className="portv2-image-bg"></div>
              <img 
                src="/portfolio-v2-hero.png" 
                alt="Chaitanya Gidijala Vector" 
                className="portv2-image"
              />
            </div>
          </motion.div>

        </section>

      </div>
    </div>
  );
};

export default PortfolioV2Page;
