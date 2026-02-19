import React from 'react';
import { Link } from 'react-router-dom';
import {
    Mail, Instagram, Linkedin, Twitter, ArrowUp,
    Camera, Wallet, Globe, Map, Github, Brain,
    Briefcase, Sparkles, ExternalLink, Phone, Heart
} from 'lucide-react';
import { profileConfig } from '../config/profileConfig';
import './LandingFooter.css';

/* ──────────────────────────────────────────────
   Static data
────────────────────────────────────────────── */

const apps = [
    { name: 'Photo Editor', path: '/photo-editor', Icon: Camera },
    { name: 'Split Expenses', path: '/split-expenses', Icon: Wallet },
    { name: 'Time Zone', path: '/time-zone-converter', Icon: Globe },
    { name: 'Trip Planner', path: '/trip-planner', Icon: Map },
    { name: 'Habit Hub', path: '/habit-productivity', Icon: Brain },
    { name: 'Job Portal', path: '/job-portal', Icon: Briefcase },
];

const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Photo Editor', path: '/photo-editor' },
    { label: 'Job Portal', path: '/job-portal' },
    { label: 'Prep Hub', path: '/job-portal/prep' },
    { label: 'Habit Hub', path: '/habit-productivity' },
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
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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

                            {/* Social links row (uncomment to show) */}
                            {/* <div className="footer-social-row">
                                {socials.map(({ Icon, href, label, color }) => (
                                    <SocialBtn key={label} Icon={Icon} href={href} label={label} color={color} />
                                ))}
                            </div> */}
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

                    {/* ── CTA Banner ── */}
                    <div className="footer-cta-banner">
                        <div className="footer-cta-title">
                            <Sparkles size={18} /> Need a Website?
                        </div>
                        <div className="footer-cta-sub">
                            Let's build something amazing together. Reach out now!
                        </div>
                    </div>

                </div>{/* /footer-top-section */}

                {/* ── Divider ── */}
                <div className="footer-divider" />

                {/* ── Bottom Bar ── */}
                <div className="footer-bottom-bar">
                    <div className="footer-copyright-block">
                        <p className="footer-copyright-line">
                            <span>©{new Date().getFullYear()}</span>
                            <strong style={{ color: 'var(--text-main)', margin: '0 0.25rem' }}>
                                Chaitanya Tech World
                            </strong>
                            <span>· All rights reserved.</span>
                        </p>
                        <p className="footer-made-by-line">
                            <span>Made with</span>
                            <Heart size={12} style={{ color: '#f43f5e', fill: '#f43f5e', margin: '0 0.2rem' }} />
                            <span>by</span>
                            <strong style={{ color: 'var(--color-primary)', margin: '0 0.2rem', fontWeight: 700 }}>
                                Chaitanya Gidijala
                            </strong>
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
