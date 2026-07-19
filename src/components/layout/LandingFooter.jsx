import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Mail, Instagram, Linkedin, Twitter, ArrowUp,
    Camera, Wallet, Globe, Map, Github, Brain,
    Briefcase, Sparkles, ExternalLink, Phone, Heart, FileText
} from 'lucide-react';
import { profileConfig } from '../../config/profileConfig';
import apiConfig from '../../config/apiConfig';
import './LandingFooter.css';

/* ──────────────────────────────────────────────
   Static data
────────────────────────────────────────────── */

const apps = [
    { name: 'Our Services', path: '/services', Icon: Camera },
    { name: 'Job Portal', path: '/job-portal', Icon: Briefcase },
    { name: 'Prep Hub', path: '/job-portal/prep', Icon: Brain },
    { name: 'AI Resume Builder', path: '/ai-resume-builder', Icon: FileText },
    { name: 'Prompts Gallery', path: '/prompts', Icon: Sparkles },
    { name: 'Roadmap', path: '/roadmap', Icon: Map },
];

const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'AI Resume Builder', path: '/ai-resume-builder' },
    { label: 'Job Portal', path: '/job-portal' },
    { label: 'Preparation Hub', path: '/job-portal/prep' },
    { label: 'Mock Tests', path: '/job-portal/prep/tests' },
    { label: 'Interview Questions', path: '/job-portal/prep/questions' },
    { label: 'Learning Resources', path: '/job-portal/prep/resources' },
    { label: 'Support Me', path: '/support-me' },
    { label: 'Contact', path: '/contact' },
];

const socials = [
    { Icon: Instagram, href: profileConfig.socialLinks.instagram, label: 'Instagram', color: '#E1306C' },
    { Icon: Linkedin, href: profileConfig.socialLinks.linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { Icon: Twitter, href: profileConfig.socialLinks.twitter, label: 'Twitter', color: '#1DA1F2' },
    { Icon: Github, href: profileConfig.socialLinks.github || '#', label: 'GitHub', color: '#6e40c9' },
];

/* ──────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────── */

/** Social platform icon button */
const SocialBtn = ({ Icon, href, label, color }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        className="footer-social-btn"
        style={{ '--social-color': color }}
        onMouseEnter={e => {
            e.currentTarget.style.background = color;
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.boxShadow = `0 8px 20px ${color}55`;
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = '';
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.boxShadow = '';
        }}
    >
        <Icon size={19} />
    </a>
);

/** Application link item */
const AppLink = ({ path, Icon, name }) => (
    <li style={{ listStyle: 'none' }}>
        <Link to={path} className="footer-app-link">
            <span className="footer-app-icon">
                <Icon size={14} />
            </span>
            <span className="footer-app-name">{name}</span>
        </Link>
    </li>
);

/** Quick navigation link */
const QuickLink = ({ label, path }) => (
    <li>
        <Link to={path} className="footer-quick-link">
            {/* Chevron arrow */}
            <svg
                width="12" height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 18l6-6-6-6" />
            </svg>
            {label}
        </Link>
    </li>
);

/** Contact row item */
const ContactItem = ({ Icon, label, value, href, iconColor }) => {
    const Tag = href ? 'a' : 'div';
    return (
        <Tag
            href={href}
            className="footer-contact-item"
            {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
            <span
                className="footer-contact-icon"
                style={{ color: iconColor || 'var(--color-primary)' }}
            >
                <Icon size={16} />
            </span>
            <div>
                <div className="footer-contact-label">{label}</div>
                <div className="footer-contact-value">{value}</div>
            </div>
        </Tag>
    );
};

/* ──────────────────────────────────────────────
   Main Footer component
────────────────────────────────────────────── */

const LandingFooter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setStatus('');

        try {
            const response = await fetch(`${apiConfig.API_BASE_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (response.ok) {
                setStatus(data.message || 'Thanks for subscribing!');
                setEmail('');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus(data.error || 'Something went wrong. Try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setStatus('Failed to connect to server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="footer-shimmer-bg">

            {/* Decorative colour orbs */}
            <div className="footer-orb footer-orb-1" />
            <div className="footer-orb footer-orb-2" />

            {/* Animated rainbow glow bar */}
            <div className="footer-glow-bar" />

            <div className="container footer-inner">

                {/* ── Top Section ── */}
                <div className="footer-top-section">
                    <div className="footer-grid">

                        {/* ── Brand Column ── */}
                        <div className="footer-brand-col">
                            <div>
                                <h2 className="footer-brand-title">
                                    Chaitanya{' '}
                                    <span className="footer-brand-shine">Tech World</span>
                                </h2>
                                <p className="footer-brand-desc">
                                    Explore innovative web applications crafted with passion — from photo
                                    editing to smart job tools. Designed to make your digital life easier
                                    &amp; smarter.
                                </p>
                            </div>

                            {/* Availability badge */}
                            <div className="footer-availability-badge">
                                <span className="footer-availability-dot" />
                                {profileConfig.contact.availability}
                            </div>

                            {/* Newsletter / Stay Connected */}
                            <div className="footer-newsletter">
                                <h4 className="footer-newsletter-title">Stay Updated</h4>
                                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required 
                                        className="footer-newsletter-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button type="submit" className="footer-newsletter-btn" disabled={isLoading}>
                                        {isLoading ? 'Wait...' : 'Subscribe'}
                                    </button>
                                </form>
                                {status && <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '0.5rem' }}>{status}</div>}
                            </div>

                            {/* Social links row */}
                            <div className="footer-social-row">
                                {socials.map(({ Icon, href, label, color }) => (
                                    <SocialBtn key={label} Icon={Icon} href={href} label={label} color={color} />
                                ))}
                            </div>
                        </div>

                        {/* ── Applications Column ── */}
                        <div>
                            <h3 className="footer-col-title">
                                <Sparkles size={13} /> Applications
                            </h3>
                            <ul className="footer-apps-list">
                                {apps.map(({ name, path, Icon }) => (
                                    <AppLink key={path} path={path} Icon={Icon} name={name} />
                                ))}
                            </ul>
                        </div>

                        {/* ── Quick Links Column ── */}
                        <div>
                            <h3 className="footer-col-title">
                                <ExternalLink size={13} /> Quick Links
                            </h3>
                            <ul className="footer-quick-links-list">
                                {quickLinks.map(({ label, path }) => (
                                    <QuickLink key={path} label={label} path={path} />
                                ))}
                            </ul>
                        </div>

                        {/* ── Contact Column ── */}
                        <div>
                            <h3 className="footer-col-title">
                                <Mail size={13} /> Contact
                            </h3>
                            <div className="footer-contact-card">
                                <ContactItem
                                    Icon={Phone}
                                    label="Phone / WhatsApp"
                                    value="+91 7337072766"
                                    href="tel:+917337072766"
                                    iconColor="#22c55e"
                                />
                                <ContactItem
                                    Icon={Mail}
                                    label="Email"
                                    value={profileConfig.contact.email}
                                    href={`mailto:${profileConfig.contact.email}`}
                                    iconColor="var(--color-primary)"
                                />
                                <ContactItem
                                    Icon={Linkedin}
                                    label="LinkedIn"
                                    value="Chaitanya Gidijala"
                                    href={profileConfig.socialLinks.linkedin}
                                    iconColor="#0A66C2"
                                />
                            </div>
                        </div>

                    </div>{/* /footer-grid */}
                </div>{/* /footer-top-section */}

                {/* ── Divider ── */}
                <div className="footer-divider" />

                {/* ── Bottom Bar ── */}
                <div className="footer-bottom-bar">
                    <div className="footer-copyright-block">
                        <p className="footer-copyright-line">
                            <span>©{new Date().getFullYear()}</span>
                            <span className="footer-brand-shine" style={{ margin: '0 0.25rem', fontWeight: 800 }}>
                                Chaitanya Tech World
                            </span>
                            <span>· All rights reserved.</span>
                        </p>
                        <p className="footer-made-by-line">
                            <span>Made with</span>
                            <Heart size={12} style={{ color: '#f43f5e', fill: '#f43f5e', margin: '0 0.2rem' }} />
                            <span>by</span>
                            <span className="footer-creator-shine" style={{ margin: '0 0.2rem', fontWeight: 800 }}>
                                Chaitanya Gidijala
                            </span>
                        </p>
                    </div>

                    <button
                        className="footer-scroll-btn"
                        onClick={scrollToTop}
                        aria-label="Back to top"
                    >
                        <ArrowUp size={16} />
                        Back to Top
                    </button>
                </div>

            </div>{/* /container */}
        </footer>
    );
};

export default LandingFooter;
