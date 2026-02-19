import React from 'react';
import { motion } from 'framer-motion';
import '../PhotoEditor.css';
import {
    Heart, Gift, Gem, Home, Building2, CalendarDays,
    ImageIcon, Wallpaper, Globe, ArrowRight
} from 'lucide-react';

const services = [
    {
        Icon: Heart,
        title: 'Wedding Invitations',
        desc: 'Elegant, timeless wedding suites — save-the-dates, full invitation cards, digital & print-ready. Luxury typography meets your love story.',
        cta: 'Order Now',
    },
    {
        Icon: Gift,
        title: 'Birthday Invitations',
        desc: 'Vibrant, personalised birthday cards and e-invites. Fun or formal — every theme, any age, any style you imagine.',
        cta: 'Create Yours',
    },
    {
        Icon: Gem,
        title: 'Engagement Invitations',
        desc: 'Celebrate the big "Yes!" with sophisticated engagement invitations. Romantic designs that capture the joy of the moment.',
        cta: 'Design Now',
    },
    {
        Icon: Home,
        title: 'Housewarming Invitations',
        desc: 'Warm, welcoming invites for your new home celebration. Charming illustrations and clean layouts that set the perfect tone.',
        cta: 'Get Started',
    },
    {
        Icon: Building2,
        title: 'Corporate Invitations',
        desc: 'Polished, brand-aligned corporate event invitations for product launches, conferences, and annual functions.',
        cta: 'Explore',
    },
    {
        Icon: CalendarDays,
        title: 'Custom Event Cards',
        desc: "Baby showers, anniversaries, graduations — any occasion. Tell us your vision and we'll craft a one- of - a - kind invite.",
        cta: 'Customise',
    },
    {
        Icon: ImageIcon,
        title: 'Banners & Posters',
        desc: 'High-impact social media banners, YouTube channel art, event posters, and promotional flyers that demand attention.',
        cta: 'Order Banner',
    },
    {
        Icon: Wallpaper,
        title: 'Wallpaper Design',
        desc: 'Stunning desktop and mobile wallpapers — abstract art, brand-themed, motivational quotes, or completely custom.',
        cta: 'Get Wallpaper',
    },
    {
        Icon: Globe,
        title: 'Website Development',
        desc: 'Custom full-stack websites that are fast, responsive, and brand-aligned. From landing pages to complex web apps.',
        cta: 'Build Site',
    },
];

const card = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Services = () => (
    <section id="pe-services" className="pe-section pe-services">
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="pe-tag" style={{ margin: '0 auto 1rem' }}>
                    What I Offer
                </div>
                <h2 className="pe-section-title">
                    Services &amp; <span className="text-gradient">Specialisations</span>
                </h2>
                <p className="pe-section-subtitle">
                    From intimate wedding invitations to enterprise websites — premium quality work
                    that makes every occasion and brand truly unforgettable.
                </p>
            </motion.div>

            <motion.div
                className="pe-services-grid"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
            >
                {services.map(({ Icon, title, desc, cta }) => (
                    <motion.div key={title} variants={card} className="pe-service-card">
                        <div className="pe-service-icon-wrap">
                            <Icon size={22} strokeWidth={1.8} />
                        </div>
                        <h3 className="pe-service-title">{title}</h3>
                        <p className="pe-service-desc">{desc}</p>
                        <button className="pe-service-cta">
                            {cta} <ArrowRight size={13} />
                        </button>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default Services;
