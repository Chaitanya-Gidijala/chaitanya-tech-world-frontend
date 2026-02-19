import React from 'react';
import { Sparkles, Scissors, Wand, Palette, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { photoEditorConfig } from '../../../config/photoEditorConfig';

// Map string names to Components
const IconMap = {
    Sparkles,
    Scissors,
    Wand,
    Palette,
    Default: ImageIcon
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

const Services = () => {
    return (
        <section className="container" style={{ padding: '4rem 0' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    fontSize: '2.5rem',
                    marginBottom: '3rem',
                    textAlign: 'center',
                    fontWeight: '700'
                }}
            >
                My <span className="text-gradient">Services</span>
            </motion.h2>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}
            >
                {photoEditorConfig.services.map((service) => {
                    const Icon = IconMap[service.icon] || IconMap.Default;

                    return (
                        <motion.div
                            key={service.id}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="glass-panel"
                            style={{
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                borderTop: '4px solid var(--color-primary)',
                                height: '100%',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 100%)'
                            }}
                        >
                            <div style={{ color: 'var(--color-primary)' }}>
                                <Icon size={40} strokeWidth={1.5} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{service.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>{service.description}</p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default Services;
