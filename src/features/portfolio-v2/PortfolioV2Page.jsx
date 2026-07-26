import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Dribbble, Github, Mail, Menu, Code, Layout, Database, CheckCircle, ExternalLink, Send } from 'lucide-react';
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

  const scrollFade = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
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

        {/* SERVICES SECTION */}
        <section id="services" className="portv2-section">
          <motion.div 
            className="portv2-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scrollFade}
          >
            <h2 className="portv2-section-title">My <span>Services</span></h2>
            <p className="portv2-section-subtitle">What I can do for you</p>
          </motion.div>

          <div className="portv2-services-grid">
            <motion.div className="portv2-service-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade}>
              <Layout size={40} className="portv2-service-icon" />
              <h3 className="portv2-service-title">Frontend Development</h3>
              <p className="portv2-service-desc">Building sleek, responsive, and highly interactive user interfaces using React, Redux, and modern CSS frameworks tailored to your brand.</p>
            </motion.div>
            <motion.div className="portv2-service-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade} transition={{ delay: 0.1 }}>
              <Code size={40} className="portv2-service-icon" />
              <h3 className="portv2-service-title">Backend Architecture</h3>
              <p className="portv2-service-desc">Designing robust and scalable RESTful APIs and microservices using Java Spring Boot, Node.js, and efficient database architectures.</p>
            </motion.div>
            <motion.div className="portv2-service-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade} transition={{ delay: 0.2 }}>
              <Database size={40} className="portv2-service-icon" />
              <h3 className="portv2-service-title">Full Stack Solutions</h3>
              <p className="portv2-service-desc">End-to-end development of comprehensive platforms, from database design and cloud deployment (Docker, AWS) to the final pixel-perfect UI.</p>
            </motion.div>
          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section id="about" className="portv2-section">
          <motion.div 
            className="portv2-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scrollFade}
          >
            <h2 className="portv2-section-title">About <span>Me</span></h2>
            <p className="portv2-section-subtitle">My professional journey</p>
          </motion.div>

          <div className="portv2-about-content">
            <motion.div className="portv2-about-image-wrapper" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade}>
              {/* Reusing hero vector for structural balance, or you can insert a real photo here */}
              <img src="/portfolio-v2-hero.png" alt="Chaitanya" style={{ backgroundColor: '#1a1a1a' }} />
            </motion.div>
            <motion.div className="portv2-about-text" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade}>
              <p>
                I am a passionate <strong>Software Engineer</strong> with over 2 years of professional experience, previously working as a Software Engineer at Capgemini, where I contributed to large-scale enterprise applications.
              </p>
              <p>
                Beyond my corporate experience, I independently built and shipped <strong>Chaitanya Tech World</strong>, a massive full-stack developer ecosystem encompassing a job portal, an AI-powered resume builder, comprehensive roadmaps, and quiz environments.
              </p>
              
              <div className="portv2-about-highlights">
                <div className="portv2-about-highlight">
                  <CheckCircle size={20} /> Expertise in Java Spring Boot & React.js
                </div>
                <div className="portv2-about-highlight">
                  <CheckCircle size={20} /> Deployed full-stack systems with Docker & CI/CD
                </div>
                <div className="portv2-about-highlight">
                  <CheckCircle size={20} /> Strong focus on Clean Code & Microservices
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section id="portfolio" className="portv2-section">
          <motion.div 
            className="portv2-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scrollFade}
          >
            <h2 className="portv2-section-title">My <span>Portfolio</span></h2>
            <p className="portv2-section-subtitle">Featured projects I've built</p>
          </motion.div>

          <div className="portv2-portfolio-grid">
            <motion.div className="portv2-project-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade}>
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" alt="Chaitanya Tech World" className="portv2-project-img" />
              <div className="portv2-project-content">
                <h3 className="portv2-project-title">Chaitanya Tech World</h3>
                <p className="portv2-project-desc">A complete developer ecosystem featuring a job portal, interview prep, and roadmaps.</p>
                <div className="portv2-project-links">
                  <a href="/" className="portv2-project-link"><ExternalLink size={16}/> Live Demo</a>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="portv2-project-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade} transition={{ delay: 0.1 }}>
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" alt="AI Resume Builder" className="portv2-project-img" />
              <div className="portv2-project-content">
                <h3 className="portv2-project-title">AI Resume Builder</h3>
                <p className="portv2-project-desc">Intelligent ATS-friendly resume generator with live preview and PDF export capabilities.</p>
                <div className="portv2-project-links">
                  <a href="/ai-resume-builder" className="portv2-project-link"><ExternalLink size={16}/> Live Demo</a>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="portv2-project-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade} transition={{ delay: 0.2 }}>
              <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" alt="Enterprise Microservices" className="portv2-project-img" />
              <div className="portv2-project-content">
                <h3 className="portv2-project-title">Spring Boot Microservices</h3>
                <p className="portv2-project-desc">Highly scalable backend architecture integrating MySQL, JWT Auth, and REST APIs.</p>
                <div className="portv2-project-links">
                  <a href="#" className="portv2-project-link"><Github size={16}/> Source Code</a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="portv2-section">
          <motion.div 
            className="portv2-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scrollFade}
          >
            <h2 className="portv2-section-title">Contact <span>Me</span></h2>
            <p className="portv2-section-subtitle">Let's work together</p>
          </motion.div>

          <div className="portv2-contact-wrapper">
            <motion.div className="portv2-contact-info" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade}>
              <div className="portv2-contact-item">
                <div className="portv2-contact-icon"><Mail size={24} /></div>
                <div className="portv2-contact-detail">
                  <h4>Email</h4>
                  <p>hello@chaitanyatechworld.com</p>
                </div>
              </div>
              <div className="portv2-contact-item">
                <div className="portv2-contact-icon"><Linkedin size={24} /></div>
                <div className="portv2-contact-detail">
                  <h4>LinkedIn</h4>
                  <p>linkedin.com/in/chaitanya-gidijala</p>
                </div>
              </div>
            </motion.div>
            
            <motion.form className="portv2-contact-form" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollFade}>
              <div className="portv2-form-group">
                <input type="text" className="portv2-input" placeholder="Your Name" required />
              </div>
              <div className="portv2-form-group">
                <input type="email" className="portv2-input" placeholder="Your Email" required />
              </div>
              <div className="portv2-form-group">
                <textarea className="portv2-textarea" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" className="portv2-btn-submit">
                <Send size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> 
                Send Message
              </button>
            </motion.form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="portv2-footer">
          <p>&copy; {new Date().getFullYear()} Chaitanya Gidijala. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default PortfolioV2Page;
