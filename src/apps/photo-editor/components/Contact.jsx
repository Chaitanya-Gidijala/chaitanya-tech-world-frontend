import React from 'react';
import { Mail, Instagram, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import { photoEditorConfig } from '../../../config/photoEditorConfig';

const Contact = () => {
    const { email, instagram, linkedin, note } = photoEditorConfig.contact;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer id="contact" style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-light)',
            padding: '5rem 0 2rem 0',
            marginTop: '6rem',
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
                            Chaitanya <span className="text-gradient">Tech</span>
                        </h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            {note}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <SocialIcon Icon={Instagram} href="#" />
                            <SocialIcon Icon={Linkedin} href="#" />
                            <SocialIcon Icon={Twitter} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Services</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
                            {photoEditorConfig.services.slice(0, 4).map(s => (
                                <li key={s.id}>{s.title}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href={`mailto:${email}`} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                color: 'var(--text-main)',
                                transition: 'color 0.2s'
                            }}>
                                <div style={{ background: 'var(--bg-body)', padding: '8px', borderRadius: '50%' }}>
                                    <Mail size={18} />
                                </div>
                                {email}
                            </a>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Available Mon-Fri, 9am - 6pm IST
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
                            fontWeight: '600'
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

export default Contact;
