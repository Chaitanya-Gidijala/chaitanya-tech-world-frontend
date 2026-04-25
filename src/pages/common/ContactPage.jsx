import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, Linkedin, Instagram, Github,
    MessageCircle, ArrowRight, Send, CheckCircle2,
    Clock, Sparkles, ExternalLink, ChevronRight,
    Palette, Globe, RotateCcw
} from 'lucide-react';
import { profileConfig } from '../../config/profileConfig';
import config from '../../config/apiConfig';
import './ContactPage.css';

/* ── Static data ─────────────────────────────────────────── */

const contactCards = [
    {
        Icon: Mail,
        label: 'Email — Primary',
        value: profileConfig.contact.email,
        hint: 'Reply within 6 hours on weekdays',
        href: `mailto:${profileConfig.contact.email}`,
        bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
        Icon: Phone,
        label: 'WhatsApp',
        value: '+91 7337072766',
        hint: 'Chat directly — usually instant',
        href: 'https://wa.me/917337072766?text=Hi%20Chaitanya%2C%20I%27d%20like%20to%20discuss%20a%20project!',
        bg: 'linear-gradient(135deg, #22c55e, #16a34a)',
    },
    {
        Icon: Linkedin,
        label: 'LinkedIn',
        value: 'Chaitanya Gidijala',
        hint: 'Connect for professional inquiries',
        href: profileConfig.socialLinks.linkedin,
        bg: 'linear-gradient(135deg, #0a66c2, #0284c7)',
    },
];

const availability = [
    { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM IST', open: true },
    { day: 'Saturday', time: '10:00 AM – 2:00 PM IST', open: true },
    { day: 'Sunday', time: 'Closed', open: false },
];

const serviceOptions = [
    'Wedding Invitation',
    'Birthday / Event Card',
    'Engagement Invite',
    'Corporate Invitation',
    'Banner / Poster',
    'Wallpaper Design',
    'Website Development',
    'Branding Package',
    'Other',
];

const budgetLabels = (val) => {
    if (val < 2000) return '< ₹2,000';
    if (val < 5000) return '₹2,000 – ₹5,000';
    if (val < 15000) return '₹5,000 – ₹15,000';
    if (val < 30000) return '₹15,000 – ₹30,000';
    return '₹30,000+';
};

const quickActions = [
    {
        icon: '💌',
        iconBg: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        title: 'Custom Invitation',
        desc: 'Wedding, Birthday, Engagement or any special event',
        action: 'Start Design',
        href: `mailto:${profileConfig.contact.email}?subject=Custom%20Invitation%20Request`,
    },
    {
        icon: '🌐',
        iconBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        title: 'Website Project',
        desc: 'Custom full-stack websites from scratch',
        action: 'Discuss Project',
        href: `https://wa.me/917337072766?text=Hi!%20I%27d%20like%20a%20new%20website%20built.`,
    },
    {
        icon: '🎨',
        iconBg: 'linear-gradient(135deg, #f59e0b, #f97316)',
        title: 'Branding Package',
        desc: 'Logo, social kit, banners & complete brand identity',
        action: 'Get Quote',
        href: `mailto:${profileConfig.contact.email}?subject=Branding%20Package%20Inquiry`,
    },
];

/* ── Sub-components ─────────────────────────────────────── */

const ParticleBackground = () => {
    return (
        <div className="cp-particles">
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={i}
                    className="cp-particle"
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.4
                    }}
                    animate={{
                        y: ['-5%', '105%'],
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 15,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * -20
                    }}
                />
            ))}
        </div>
    );
};

const FadeIn = ({ children, delay = 0, y = 20 }) => (
    <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);


/* ── Main Component ─────────────────────────────────────── */

const ContactPage = () => {
    /* form state */
    const [selectedService, setSelectedService] = useState('');
    const [budget, setBudget] = useState(5000);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', message: '',
    });
    const formRef = useRef(null);

    const handleInput = (e) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            serviceType: selectedService || 'Not Selected',
            budget: budget,
            message: form.message
        };

        // Fire and forget the API request so the user doesn't wait
        fetch(config.endpoints.contact.submit, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        }).catch(error => console.error('Background submission error:', error));

        // Simulate a brief loading state for UX, then show success
        setTimeout(() => {
            setSending(false);
            setSent(true);
        }, 800);
    };

    const resetForm = () => {
        setSent(false);
        setForm({ name: '', email: '', phone: '', message: '' });
        setSelectedService('');
        setBudget(5000);
    };

    // Range background fill percentage (0-50000 range)
    const rangePct = Math.round((budget / 50000) * 100);

    return (
        <div className="cp-page">
            <ParticleBackground />
            <div className="cp-grid-bg" />

            <motion.div
                className="cp-orb cp-orb-1"
                animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="cp-orb cp-orb-2"
                animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -50, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: -5 }}
            />
            <motion.div
                className="cp-orb cp-orb-3"
                animate={{ opacity: [0.06, 0.12, 0.06], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: -2 }}
            />

            <div className="container cp-hero">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="cp-hero-tag">
                        <Sparkles size={13} />
                        Get In Touch
                    </div>
                    <h1 className="cp-hero-h1">
                        Let's Build Something{' '}
                        <span className="cp-shimmer">Beautiful</span>
                    </h1>
                    <p className="cp-hero-sub">
                        Have a project in mind? Need a custom invitation or a new website?
                        Reach out — I'd love to hear about your vision.
                    </p>
                </motion.div>
            </div>

            <div className="container cp-body">
                <div className="cp-grid">
                    <div className="cp-left">
                        {contactCards.map(({ Icon, label, value, hint, href, bg }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <a href={href} target="_blank" rel="noopener noreferrer" className="cp-contact-card">
                                    <div className="cp-card-icon" style={{ background: bg, color: '#fff' }}>
                                        <Icon size={22} strokeWidth={1.8} />
                                    </div>
                                    <div className="cp-card-body">
                                        <div className="cp-card-label">{label}</div>
                                        <div className="cp-card-value">{value}</div>
                                        <div className="cp-card-hint">{hint}</div>
                                    </div>
                                    <ExternalLink size={16} className="cp-card-arrow" />
                                </a>
                            </motion.div>
                        ))}

                        <FadeIn delay={0.5}>
                            <div className="cp-availability">
                                <div className="cp-availability-title">
                                    <Clock size={14} />
                                    <span>Working Hours</span>
                                    <span style={{ fontSize: '0.6rem', color: '#22c55e', fontWeight: 600, marginLeft: 'auto' }}>
                                        <span className="cp-online-dot" /> Online Now
                                    </span>
                                </div>
                                {availability.map(({ day, time, open }) => (
                                    <div key={day} className="cp-avail-row">
                                        <span className="cp-avail-day">{day}</span>
                                        <span className="cp-avail-time">{open ? time : '—'}</span>
                                        <span className={open ? 'cp-avail-open' : 'cp-avail-closed'}>
                                            {open ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.1} y={32}>
                        <div className="cp-form-panel">
                            <AnimatePresence mode="wait">
                                {sent ? (
                                    <motion.div
                                        key="success"
                                        className="cp-success"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="cp-success-confetti">
                                            {[...Array(12)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="cp-confetti-dot"
                                                    initial={{ scale: 0, x: 0, y: 0 }}
                                                    animate={{
                                                        scale: [0, 1, 0],
                                                        x: (Math.random() - 0.5) * 200,
                                                        y: (Math.random() - 0.5) * 200,
                                                    }}
                                                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                                                />
                                            ))}
                                        </div>

                                        <motion.div
                                            className="cp-success-icon"
                                            initial={{ scale: 0, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
                                        >
                                            <CheckCircle2 size={42} strokeWidth={2.5} />
                                        </motion.div>

                                        <motion.h2
                                            className="cp-success-title"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25 }}
                                        >
                                            Message Sent! 🎉
                                        </motion.h2>

                                        <motion.p
                                            className="cp-success-sub"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            I'll review your message and reply within 6 hours. <br /> Excited to work together!
                                        </motion.p>

                                        <motion.button
                                            className="cp-success-reset"
                                            onClick={resetForm}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5, type: 'spring' }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <RotateCcw size={14} /> Send Another Message
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <h2 className="cp-form-title">Send a <span className="text-gradient">Message</span></h2>
                                        <p className="cp-form-subtitle">Fill the details below and I'll get back to you shortly.</p>
                                        <form className="cp-form" onSubmit={handleSubmit}>
                                            <div className="cp-form-row">
                                                <div className="cp-field">
                                                    <label className="cp-label">Full Name *</label>
                                                    <input type="text" name="name" className="cp-input" placeholder="Your name" required value={form.name} onChange={handleInput} />
                                                </div>
                                                <div className="cp-field">
                                                    <label className="cp-label">Email Address *</label>
                                                    <input type="email" name="email" className="cp-input" placeholder="your@email.com" required value={form.email} onChange={handleInput} />
                                                </div>
                                            </div>
                                            <div className="cp-form-row">
                                                <div className="cp-field">
                                                    <label className="cp-label">Phone / WhatsApp</label>
                                                    <input type="tel" name="phone" className="cp-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleInput} />
                                                </div>
                                                <div className="cp-field">
                                                    <label className="cp-label">Service Type</label>
                                                    <div className="cp-select-wrap">
                                                        <select className="cp-select" value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                                                            <option value="">Select a service</option>
                                                            {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cp-field">
                                                <label className="cp-label">Estimated Budget</label>
                                                <div className="cp-budget-display">{budgetLabels(budget)}</div>
                                                <input type="range" min={500} max={50000} step={500} value={budget} className="cp-range" style={{ '--range-pct': `${rangePct}%` }} onChange={e => setBudget(Number(e.target.value))} />
                                            </div>
                                            <div className="cp-field">
                                                <label className="cp-label">Your Message *</label>
                                                <textarea name="message" className="cp-textarea" placeholder="Tell me about your project..." required value={form.message} onChange={handleInput} />
                                            </div>
                                            <button type="submit" className="cp-submit" disabled={sending}>
                                                {sending ? <><span className="cp-submit-loading" /> Sending...</> : <><Send size={17} /> Send Message <ArrowRight size={15} /></>}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <div className="container cp-quick-strip">
                <p className="cp-quick-title">Or jump straight in →</p>
                <div className="cp-quick-grid">
                    {quickActions.map(({ icon, iconBg, title, desc, action, href }, i) => (
                        <FadeIn key={title} delay={i * 0.1}>
                            <a href={href} target="_blank" rel="noopener noreferrer" className="cp-quick-card">
                                <div className="cp-quick-icon" style={{ background: iconBg }}>{icon}</div>
                                <h3 className="cp-quick-card-title">{title}</h3>
                                <p className="cp-quick-card-desc">{desc}</p>
                                <span className="cp-quick-card-action" style={{ color: 'var(--color-primary)' }}>
                                    {action} <ChevronRight size={13} />
                                </span>
                            </a>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
