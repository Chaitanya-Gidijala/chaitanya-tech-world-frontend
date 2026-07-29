import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Heart, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="tf-footer">
      <div className="tf-footer__glow" />
      <div className="tf-container tf-footer__inner">
        
        <div className="tf-footer__top">
          <div className="tf-footer__brand">
            <Link to="/traceflow" className="tf-footer__logo">
              <div className="tf-logo-mark">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="4" cy="11" r="2.5" fill="currentColor" opacity="0.4"/>
                  <circle cx="11" cy="4" r="2.5" fill="currentColor"/>
                  <circle cx="18" cy="11" r="2.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="11" cy="18" r="2.5" fill="currentColor" opacity="0.8"/>
                  <line x1="4" y1="11" x2="11" y2="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                  <line x1="11" y1="4" x2="18" y2="11" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="18" y1="11" x2="11" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                </svg>
              </div>
              <span className="tf-logo-name">Traceflow</span>
            </Link>
            <p className="tf-footer__desc">
              The premium, interactive playground for Data Structures and Algorithms. 
              Built for developers who demand perfection.
            </p>
          </div>

          <div className="tf-footer__links">
            <div className="tf-footer__col">
              <h3>Product</h3>
              <Link to="/traceflow/catalogue">Algorithms</Link>
              <a href="https://www.chaitanyatechworld.com/roadmap" target="_blank" rel="noopener noreferrer">Roadmap</a>
              <a href="#">Pro Features</a>
            </div>
            <div className="tf-footer__col">
              <h3>Resources</h3>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Community</a>
            </div>
            <div className="tf-footer__col">
              <h3>Company</h3>
              <a href="https://www.chaitanyatechworld.com/portfolio" target="_blank" rel="noopener noreferrer">About Us</a>
              <a href="https://www.chaitanyatechworld.com/job-portal" target="_blank" rel="noopener noreferrer">Careers</a>
              <a href="https://www.chaitanyatechworld.com/contact" target="_blank" rel="noopener noreferrer">Contact</a>
            </div>
          </div>
        </div>

        <div className="tf-footer__bottom">
          <div className="tf-footer__copyright">
            <div className="tf-footer__copyright-row">
              <span>© {new Date().getFullYear()} Traceflow. Crafted with</span>
              <Heart size={14} style={{ color: '#ff4d4f', fill: '#ff4d4f', animation: 'tf-pulse 2s infinite' }} />
              <span>by</span>
            </div>
            <a href="https://www.chaitanyatechworld.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none', letterSpacing: '0.5px' }}>
              Chaitanya Tech World.
            </a>
          </div>
          <div className="tf-footer__social">
            <a href="mailto:support@chaitanyatechworld.com" aria-label="Email"><Mail size={18} /></a>
            <a href="https://github.com/chaitanya-gidijala" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://www.linkedin.com/in/chaitanya-gidijala-660406231/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
