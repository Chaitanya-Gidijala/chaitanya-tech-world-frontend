import React from 'react';
import { motion } from 'framer-motion';
import { Check, Layout, Heart, Gift, BookOpen, Megaphone, Smartphone, Video, ArrowRight } from 'lucide-react';
import { photoEditorConfig } from '../../../config/photoEditorConfig';

const IconMap = {
    Layout,
    Heart,
    Gift,
    BookOpen,
    Megaphone,
    Smartphone,
    Video
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const Pricing = () => {
    return (
        <section className="container" style={{ padding: '4rem 0' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontWeight: '700'
                }}
            >
                Creative <span className="text-gradient">Design Solutions</span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    marginBottom: '4rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}
            >
                Tailored design packages for your personal and professional needs.
                Contact us for custom quotes and bulk orders.
            </motion.p>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem',
                    alignItems: 'stretch'
                }}
            >
                {photoEditorConfig.designServices.map((service, index) => {
                    const Icon = IconMap[service.icon] || Layout;

                    return (
                        <motion.div
                            key={service.id}
                            variants={itemVariants}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            className="glass-panel"
                            style={{
                                padding: '2.5rem',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    background: 'var(--gradient-brand)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icon size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                                    {service.title}
                                </h3>
                            </div>

                            <p style={{
                                color: 'var(--text-muted)',
                                marginBottom: '2rem',
                                lineHeight: '1.6',
                                flex: 1
                            }}>
                                {service.description}
                            </p>

                            <ul style={{
                                listStyle: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                marginBottom: '2rem',
                                padding: 0
                            }}>
                                {service.features.map((feature, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderRadius: '50%',
                                            padding: '4px',
                                            color: 'var(--color-primary)',
                                            display: 'flex'
                                        }}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    background: 'transparent',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--surface-hover)';
                                    e.currentTarget.style.borderColor = 'var(--text-main)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = 'var(--border-light)';
                                }}
                            >
                                Get Started <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default Pricing;
