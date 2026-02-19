import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { photoEditorConfig } from '../../../config/photoEditorConfig';

const Testimonials = () => {
    return (
        <section style={{ padding: '4rem 0', background: 'var(--bg-body)' }}> {/* Separate bg visual break if needed, but keeping global bg for now */}
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        fontSize: '2.5rem',
                        marginBottom: '4rem',
                        textAlign: 'center',
                        fontWeight: '700'
                    }}
                >
                    Client <span className="text-gradient">Stories</span>
                </motion.h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {photoEditorConfig.testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel"
                            style={{
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                position: 'relative'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1, color: 'var(--text-muted)' }}>
                                <Quote size={40} />
                            </div>

                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.6',
                                color: 'var(--text-main)',
                                fontStyle: 'italic',
                                flex: 1
                            }}>
                                "{item.text}"
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                                <img
                                    src={item.avatar}
                                    alt={item.name}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid var(--color-primary)'
                                    }}
                                />
                                <div>
                                    <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{item.name}</h4>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>{item.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
