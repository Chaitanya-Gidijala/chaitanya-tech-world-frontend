import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, Linkedin, Instagram, Github,
    MessageCircle, ArrowRight, Send, CheckCircle2,
    Clock, Sparkles, ExternalLink, ChevronRight,
    Palette, Globe, RotateCcw
} from 'lucide-react';
import { profileConfig } from '../config/profileConfig';
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
    {
        Icon: Instagram,
        label: 'Instagram',
        value: profileConfig.contact.instagramHandle,
        hint: 'See my design work & updates',
        href: profileConfig.socialLinks.instagram,
        bg: 'linear-gradient(135deg, #e1306c, #f77737)',
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

const FadeIn = ({ children, delay = 0, y = 24 }) => (
    <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
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
        // Simulate send delay
        await new Promise(r => setTimeout(r, 1800));
        setSending(false);
        setSent(true);
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
            {/* Decorative background */}
            <div className="cp-grid-bg" />
            <div className="cp-orb cp-orb-1" />
            <div className="cp-orb cp-orb-2" />
            <div className="cp-orb cp-orb-3" />

            {/* ── Hero ── */}
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

            {/* ── Body: Left cards + Right form ── */}
            <div className="container cp-body">
                <div className="cp-grid">

                    {/* ── LEFT — Contact cards + Schedule ── */}
                    <div className="cp-left">

                        {/* Contact method cards */}
                        {contactCards.map(({ Icon, label, value, hint, href, bg }, i) => (
                            <FadeIn key={label} delay={i * 0.08}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cp-contact-card"
                                    aria-label={label}
                                >
                                    <div
                                        className="cp-card-icon"
                                        style={{ background: bg, color: '#fff' }}
                                    >
                                        <Icon size={22} strokeWidth={1.8} />
                                    </div>
                                    <div className="cp-card-body">
                                        <div className="cp-card-label">{label}</div>
                                        <div className="cp-card-value">{value}</div>
                                        <div className="cp-card-hint">{hint}</div>
                                    </div>
                                    <ExternalLink size={16} className="cp-card-arrow" />
                                </a>
                            </FadeIn>
                        ))}

                        {/* Availability schedule */}
                        <FadeIn delay={0.38}>
                            <div className="cp-availability">
                                <div className="cp-availability-title">
                                    <Clock size={14} />
                                    <span>Working Hours</span>
                                    <span className="cp-online-dot" style={{ marginLeft: 'auto' }} />
                                    <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>
                                        Online Now
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

                    {/* ── RIGHT — Contact form ── */}
                    <FadeIn delay={0.1} y={32}>
                        <div className="cp-form-panel">
                            <AnimatePresence mode="wait">
                                {sent ? (
                                    /* ── Success view ── */
                                    <motion.div
                                        key="success"
                                        className="cp-success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <motion.div
                                            className="cp-success-icon"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 250, damping: 18, delay: 0.15 }}
                                        >
                                            <CheckCircle2 size={36} strokeWidth={2} />
                                        </motion.div>
                                        <h2 className="cp-success-title">Message Sent! 🎉</h2>
                                        <p className="cp-success-sub">
                                            Thank you for reaching out! I'll review your message and reply
                                            within <strong>6 hours</strong> on weekdays. Excited to work together!
                                        </p>
                                        <button className="cp-success-reset" onClick={resetForm}>
                                            <RotateCcw size={15} /> Send Another Message
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* ── Form view ── */
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <h2 className="cp-form-title">
                                            Send a <span className="text-gradient">Message</span>
                                        </h2>
                                        <p className="cp-form-subtitle">
                                            Select what you need, fill the details and hit send.
                                            I'll get back to you with a custom quote or reply shortly.
                                        </p>

                                        {/* Service type pills */}
                                        <div className="cp-service-pills">
                                            {serviceOptions.map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    className={`cp-service-pill ${selectedService === s ? 'selected' : ''}`}
                                                    onClick={() => setSelectedService(s)}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>

                                        <form ref={formRef} className="cp-form" onSubmit={handleSubmit}>
                                            {/* Name + Email */}
                                            <div className="cp-form-row">
                                                <div className="cp-field">
                                                    <label className="cp-label">
                                                        Full Name <span className="cp-label-required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        className="cp-input"
                                                        placeholder="Your full name"
                                                        required
                                                        value={form.name}
                                                        onChange={handleInput}
                                                    />
                                                </div>
                                                <div className="cp-field">
                                                    <label className="cp-label">
                                                        Email Address <span className="cp-label-required">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="cp-input"
                                                        placeholder="your@email.com"
                                                        required
                                                        value={form.email}
                                                        onChange={handleInput}
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone + Service dropdown */}
                                            <div className="cp-form-row">
                                                <div className="cp-field">
                                                    <label className="cp-label">Phone / WhatsApp</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        className="cp-input"
                                                        placeholder="+91 XXXXX XXXXX"
                                                        value={form.phone}
                                                        onChange={handleInput}
                                                    />
                                                </div>
                                                <div className="cp-field">
                                                    <label className="cp-label">Service Type</label>
                                                    <div className="cp-select-wrap">
                                                        <select
                                                            className="cp-select"
                                                            value={selectedService}
                                                            onChange={e => setSelectedService(e.target.value)}
                                                        >
                                                            <option value="">Select a service</option>
                                                            {serviceOptions.map(s => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Budget slider */}
                                            <div className="cp-field">
                                                <label className="cp-label">
                                                    Estimated Budget
                                                </label>
                                                <div className="cp-budget-display">
                                                    {budgetLabels(budget)}
                                                </div>
                                                <input
                                                    type="range"
                                                    min={500}
                                                    max={50000}
                                                    step={500}
                                                    value={budget}
                                                    className="cp-range"
                                                    style={{ '--range-pct': `${rangePct}%` }}
                                                    onChange={e => setBudget(Number(e.target.value))}
                                                />
                                            </div>

                                            {/* Message */}
                                            <div className="cp-field">
                                                <label className="cp-label">
                                                    Your Message <span className="cp-label-required">*</span>
                                                </label>
                                                <textarea
                                                    name="message"
                                                    className="cp-textarea"
                                                    placeholder="Tell me about your project — theme, occasion, timeline, or anything else…"
                                                    required
                                                    value={form.message}
                                                    onChange={handleInput}
                                                />
                                            </div>

                                            {/* Submit */}
                                            <button
                                                type="submit"
                                                className="cp-submit"
                                                disabled={sending}
                                            >
                                                {sending ? (
                                                    <>
                                                        <span className="cp-submit-loading" />
                                                        Sending…
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={17} />
                                                        Send Message
                                                        <ArrowRight size={15} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </FadeIn>

                </div>
            </div>

            {/* ── Quick action strip ── */}
            <div className="container cp-quick-strip">
                <p className="cp-quick-title">Or jump straight in →</p>
                <div className="cp-quick-grid">
                    {quickActions.map(({ icon, iconBg, title, desc, action, href }) => (
                        <FadeIn key={title}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cp-quick-card"
                            >
                                <div
                                    className="cp-quick-icon"
                                    style={{ background: iconBg }}
                                >
                                    {icon}
                                </div>
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
