import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
    ArrowRight, GitBranch, Map, Sparkles, UserRound, Mail,
    Compass, CircleDot, Layers3, Route
} from 'lucide-react';
import LandingNavbar from '@/components/layout/LandingNavbar';
import './LandingPage.css';

const products = [
    {
        title: 'Portfolio',
        eyebrow: 'About & work',
        description: 'Explore selected work, skills, and the thinking behind the projects.',
        path: '/portfolio',
        icon: UserRound,
        accent: 'violet',
    },
    {
        title: 'Traceflow',
        eyebrow: 'Visual learning',
        description: 'Turn complex algorithms into clear, step-by-step visual explanations.',
        path: '/traceflow',
        icon: GitBranch,
        accent: 'blue',
    },
    {
        title: 'Learning Roadmaps',
        eyebrow: 'Build your path',
        description: 'Follow structured technology roadmaps and Claude certification guides.',
        path: '/roadmap',
        icon: Map,
        accent: 'orange',
    },
    {
        title: 'Prompts Gallery',
        eyebrow: 'Creative toolkit',
        description: 'Browse carefully collected prompts for image and video creation.',
        path: '/prompts',
        icon: Sparkles,
        accent: 'pink',
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
                    A focused digital workspace
                </Motion.div>
                <Motion.h1 {...reveal(0.08)}>
                    Explore ideas.<br />
                    <span>Build with clarity.</span>
                </Motion.h1>
                <Motion.p {...reveal(0.16)} className="home-hero-copy">
                    Chaitanya Tech World brings practical tools for visual learning,
                    focused growth, and creative exploration into one calm place.
                </Motion.p>
                <Motion.div {...reveal(0.24)} className="home-hero-actions">
                    <a className="home-button home-button--solid" href="#explore">
                        Explore the workspace <ArrowRight size={17} />
                    </a>
                    <Link className="home-button home-button--quiet" to="/contact">
                        Get in touch <Mail size={16} />
                    </Link>
                </Motion.div>
                <Motion.div {...reveal(0.34)} className="home-signal-row" aria-label="Available experiences">
                    <span><CircleDot size={14} /> Four focused experiences</span>
                    <span><Layers3 size={14} /> Built to explore at your pace</span>
                </Motion.div>
            </section>

            <section id="explore" className="home-products home-shell">
                <Motion.div {...reveal()} className="home-section-heading">
                    <div>
                        <span className="home-eyebrow">Start anywhere</span>
                        <h2>One place. Four directions.</h2>
                    </div>
                    <p>Choose an experience based on what you want to discover today.</p>
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
                    <span className="home-eyebrow"><Compass size={14} /> Learn by doing</span>
                    <h2>Find the right next step.</h2>
                    <p>Visualize a concept in Traceflow, follow a roadmap, then save inspiration from the prompts gallery.</p>
                </div>
                <div className="home-path-steps">
                    <span>01 <strong>Explore</strong></span>
                    <Route size={17} aria-hidden="true" />
                    <span>02 <strong>Learn</strong></span>
                    <Route size={17} aria-hidden="true" />
                    <span>03 <strong>Create</strong></span>
                </div>
            </section>
        </main>
    </div>
);

export default LandingPage;
