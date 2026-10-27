import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
    ArrowRight, GitBranch, Map, Sparkles, UserRound, Mail,
    Award, Code2, Compass, Workflow
} from 'lucide-react';
import LandingNavbar from '@/components/layout/LandingNavbar';
import './LandingPage.css';

const products = [
    {
        title: 'Portfolio',
        eyebrow: 'Professional profile',
        description: 'View experience, technical skills, and selected project work.',
        path: '/portfolio',
        icon: UserRound,
        accent: 'violet',
    },
    {
        title: 'Traceflow',
        eyebrow: 'Algorithm visualizer',
        description: 'Understand algorithms through clear, interactive step-by-step visualizations.',
        path: '/traceflow',
        icon: GitBranch,
        accent: 'blue',
    },
    {
        title: 'Learning Roadmaps',
        eyebrow: 'Structured learning',
        description: 'Follow practical technology roadmaps designed around real learning goals.',
        path: '/roadmap',
        icon: Map,
        accent: 'orange',
    },
    {
        title: 'Prompts Gallery',
        eyebrow: 'AI creativity',
        description: 'Discover useful prompts for AI image and video generation.',
        path: '/prompts',
        icon: Sparkles,
        accent: 'pink',
    },
    {
        title: 'Claude Certifications',
        eyebrow: 'Certification guides',
        description: 'Prepare with focused certification pathways and learning resources.',
        path: '/roadmap/certifications/claude',
        icon: Award,
        accent: 'green',
    },
    {
        title: 'Contact',
        eyebrow: 'Let’s connect',
        description: 'Reach out for collaboration, project discussions, or questions.',
        path: '/contact',
        icon: Mail,
        accent: 'slate',
    },
];

const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const LandingPage = ({ theme, toggleTheme }) => (
    <div className="home-page">
        <LandingNavbar theme={theme} onToggleTheme={toggleTheme} />

        <main>
            <section id="hero" className="home-hero home-shell">
                <div className="home-aurora home-aurora--one" />
                <div className="home-aurora home-aurora--two" />
                <Motion.div {...reveal()} className="home-kicker">
                    <span className="home-kicker-dot" />
                    Chaitanya Tech World
                </Motion.div>
                <Motion.h1 {...reveal(0.08)}>
                    Tools for learning,<br />
                    <span>building, and creating.</span>
                </Motion.h1>
                <Motion.p {...reveal(0.16)} className="home-hero-copy">
                    Explore practical technology resources, visual learning tools,
                    curated AI prompts, and professional work in one place.
                </Motion.p>
                <Motion.div {...reveal(0.24)} className="home-hero-actions">
                    <a className="home-button home-button--solid" href="#explore">
                        Explore tools <ArrowRight size={17} />
                    </a>
                    <Link className="home-button home-button--quiet" to="/contact">
                        Get in touch <Mail size={16} />
                    </Link>
                </Motion.div>
                <Motion.div {...reveal(0.34)} className="home-signal-row" aria-label="Available experiences">
                    <span><Code2 size={14} /> Learning resources</span>
                    <span><Workflow size={14} /> Interactive tools</span>
                    <span><Compass size={14} /> Clear next steps</span>
                </Motion.div>
            </section>

            <section id="explore" className="home-products home-shell">
                <Motion.div {...reveal()} className="home-section-heading">
                    <div>
                        <span className="home-eyebrow">Explore the platform</span>
                        <h2>Find exactly what you need.</h2>
                    </div>
                    <p>Each section is designed for a specific purpose, with a direct path to get started.</p>
                </Motion.div>

                <div className="home-product-grid">
                    {products.map(({ title, eyebrow, description, path, icon: Icon, accent }, index) => (
                        <Motion.div key={path} {...reveal(0.08 * index)}>
                            <Link className={`home-product-card home-product-card--${accent}`} to={path}>
                                <div className="home-card-top">
                                    <span className="home-card-icon">{React.createElement(Icon, { size: 22 })}</span>
                                    <ArrowRight className="home-card-arrow" size={19} />
                                </div>
                                <span className="home-card-eyebrow">{eyebrow}</span>
                                <h3>{title}</h3>
                                <p>{description}</p>
                                <span className="home-card-link">Open experience <ArrowRight size={15} /></span>
                            </Link>
                        </Motion.div>
                    ))}
                </div>
            </section>

            <section className="home-path home-shell">
                <div className="home-path-copy">
                    <span className="home-eyebrow"><Compass size={14} /> Simple, focused access</span>
                    <h2>Learn with a clear direction.</h2>
                    <p>Use Roadmaps to plan your next skill, Traceflow to understand how it works, and Prompts Gallery to create something new.</p>
                </div>
                <div className="home-path-steps">
                    <Link to="/roadmap" className="home-path-link">View Roadmaps <ArrowRight size={16} /></Link>
                    <Link to="/contact" className="home-path-link home-path-link--quiet">Contact <Mail size={15} /></Link>
                </div>
            </section>
        </main>
    </div>
);

export default LandingPage;
