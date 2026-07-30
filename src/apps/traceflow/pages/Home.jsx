import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, BookOpen, GitBranch, ChevronRight, Zap, Clock, Code2, Blocks, Cpu, Eye, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllAlgorithms } from '../algorithms/index.js';
import './Home.css';

const difficultyColor = { beginner: 'success', intermediate: 'warning', advanced: 'error' };

const FEATURES = [
  { icon: Play, title: 'Step-by-step Visualization', desc: 'Watch every comparison, swap and pointer move animate in real time. Play, pause, step forward or backward.' },
  { icon: BookOpen, title: 'Human Explanations', desc: 'Every step explains WHY — not just what happened, but the reasoning behind each algorithm decision.' },
  { icon: Zap, title: 'Live Java Code', desc: 'The highlighted line in the Java implementation tracks in sync with every visualization step.' },
  { icon: Clock, title: 'Full History', desc: 'Scrub backwards through execution history — no re-running required. Every step is recorded.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const FeatureCard = ({ icon: Icon, title, desc }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="tf-feature-card tf-glass"
    >
      <div 
        className="tf-feature-card__spotlight"
        style={{ 
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 229, 160, 0.1), transparent 40%)`
        }}
      />
      <div className="tf-feature-card__content">
        <div className="tf-feature-card__header">
          <div className="tf-feature-card__icon-wrapper">
            <Icon size={20} className="tf-feature-card__icon" />
          </div>
          <h3 className="tf-feature-card__title">{title}</h3>
        </div>
        <p className="tf-feature-card__desc">{desc}</p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const algorithms = getAllAlgorithms();

  return (
    <div className="tf-home">
      {/* ── HERO ── */}
      <section className="tf-hero">
        <div className="tf-hero__bg-elements">
          <motion.div 
            className="tf-hero__glow tf-hero__glow--1"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="tf-hero__glow tf-hero__glow--2"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="tf-container tf-hero__inner">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="tf-hero__content"
          >
            <div className="tf-hero__badge-wrapper">
              <span className="tf-badge tf-badge--accent tf-badge--glow">
                <Zap size={12} className="tf-icon-spin" /> Interactive Algorithm Learning
              </span>
            </div>
            
            <h1 className="tf-hero__headline">
              Understand Algorithms.<br />
              <span className="tf-hero__accent">Don't Memorize It.</span>
            </h1>
            
            <p className="tf-hero__sub">
              Bridge the gap between abstract theory and working code. Traceflow transforms complex algorithms into intuitive, step-by-step visual journeys.
            </p>
            
            <div className="tf-hero__actions">
              <Link to="/traceflow/catalogue" className="tf-btn tf-btn--primary tf-btn--lg tf-btn--glow">
                <Play size={18} /> Start Visualizing
              </Link>
              <Link to="/traceflow/catalogue" className="tf-btn tf-btn--secondary tf-btn--lg">
                Browse Algorithms <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="tf-hero__visual"
          >
            <div className="tf-learning-path">
              <motion.div 
                whileHover={{ y: -5, scale: 1.05 }}
                className="tf-path-node tf-path-node--code"
              >
                <div className="tf-path-node__icon"><Cpu size={24} /></div>
                <span>Raw Code</span>
                <div className="tf-path-node__pulse"></div>
              </motion.div>
              
              <div className="tf-path-connector">
                <motion.div 
                  className="tf-path-connector__line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </div>
              
              <motion.div 
                whileHover={{ y: -5, scale: 1.05 }}
                className="tf-path-node tf-path-node--visual"
              >
                <div className="tf-path-node__icon"><Eye size={24} /></div>
                <span>Visual Flow</span>
                <div className="tf-path-node__pulse"></div>
              </motion.div>

              <div className="tf-path-connector">
                <motion.div 
                  className="tf-path-connector__line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                />
              </div>

              <motion.div 
                whileHover={{ y: -5, scale: 1.05 }}
                className="tf-path-node tf-path-node--understand"
              >
                <div className="tf-path-node__icon"><Lightbulb size={24} /></div>
                <span>Deep Intuition</span>
                <div className="tf-path-node__pulse"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="tf-section tf-section--alt">
        <div className="tf-container">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="tf-section__header">
              <h2 className="tf-section__title">Everything connected</h2>
            </div>
            
            <div className="tf-features-grid">
              {FEATURES.map((feature, idx) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="tf-section">
        <div className="tf-container">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="tf-section__header">
              <h2 className="tf-section__title">Explore by Domain</h2>
            </div>
            
            <div className="tf-categories-grid">
              {[
                { tab: 'algorithms', icon: GitBranch, name: 'Algorithms', desc: 'Interactive visualizations of sorting, searching, graphs, and dynamic programming.', count: `${algorithms.length} algorithms`, color: '#6366F1' },
                { tab: 'system-design', icon: Blocks, name: 'System Design', desc: 'Learn how to build scalable systems with interactive architecture diagrams.', count: '12 concepts', color: '#F59E0B' }
              ].map(cat => (
                <motion.div variants={itemVariants} key={cat.tab} className="tf-cat-wrapper">
                  <Link to={`/traceflow/catalogue?tab=${cat.tab}`} className="tf-cat-card tf-card tf-glass tf-card--hoverable">
                    <div className="tf-cat-card__header">
                      <div className="tf-cat-card__icon" style={{ background: `${cat.color}18`, color: cat.color, borderColor: `${cat.color}30` }}>
                        <cat.icon size={20} />
                      </div>
                      <h3 className="tf-cat-card__name">{cat.name}</h3>
                    </div>
                    <div className="tf-cat-card__body">
                      <p className="tf-cat-card__desc">{cat.desc}</p>
                    </div>
                    <div className="tf-cat-card__footer">
                      <span className="tf-text-mono" style={{fontSize:'var(--tf-text-xs)', color:'var(--tf-text-muted)'}}>
                        {cat.count}
                      </span>
                      <div className="tf-cat-card__arrow">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
