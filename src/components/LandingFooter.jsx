import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Linkedin, Twitter, ArrowUp, Camera, Wallet, Globe, Map } from 'lucide-react';
import { profileConfig } from '../config/profileConfig';

const LandingFooter = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer style={{
            background: 'var(--bg-body)',
            borderTop: '1px solid var(--border-light)',
            padding: '5rem 0 2rem 0',
            position: 'relative'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Column */}
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                            Chaitanya <span className="text-gradient">Tech World</span>
                        </h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Explore my digital creations and innovative web applications. From photo editing to expense tracking, discover tools designed to make your life easier.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <SocialIcon Icon={Instagram} href={profileConfig.socialLinks.instagram} />
                            <SocialIcon Icon={Linkedin} href={profileConfig.socialLinks.linkedin} />
                            <SocialIcon Icon={Twitter} href={profileConfig.socialLinks.twitter} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Applications</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>
                                <Link to="/photo-editor" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}>
                                    <Camera size={16} /> Photo Editor
                                </Link>
                            </li>
                            <li>
                                <Link to="/split-expenses" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}>
                                    <Wallet size={16} /> Split Expenses
                                </Link>
                            </li>
                            <li>
                                <Link to="/time-zone-converter" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}>
                                    <Globe size={16} /> Time Zone Converter
                                </Link>
                            </li>
                            <li>
                                <Link to="/trip-planner" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}>
                                    <Map size={16} /> Trip Planner
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href={`mailto:${profileConfig.contact.email}`} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                color: 'var(--text-main)',
                                transition: 'color 0.2s'
                            }}>
                                <div style={{ background: 'var(--bg-body)', padding: '8px', borderRadius: '50%' }}>
                                    <Mail size={18} />
                                </div>
                                {profileConfig.contact.email}
                            </a>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {profileConfig.contact.availability}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        © {new Date().getFullYear()} Chaitanya Tech World. All rights reserved.
                    </p>

                    <button
                        onClick={scrollToTop}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            color: 'var(--text-main)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Top <ArrowUp size={16} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ Icon, href }) => (
    <a href={href} style={{
        width: '40px', height: '40px',
        borderRadius: '50%',
        background: 'var(--bg-body)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-main)',
        border: '1px solid var(--border-light)',
        transition: 'transform 0.2s'
    }}>
        <Icon size={20} />
    </a>
);

export default LandingFooter;
