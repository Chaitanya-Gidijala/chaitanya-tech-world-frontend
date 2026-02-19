import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Wallet, ArrowRight, Globe, Map, Briefcase } from 'lucide-react';
import '../styles/global.css';

const LandingPage = () => {
    return (
        <div>
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4rem',
                padding: '2rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ textAlign: 'center' }}
                >
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.1'
                    }}>
                        Welcome to <br />
                        <span className="text-gradient">Chaitanya Tech World</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                        Explore my digital creations. Select an experience below.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '900px'
                }}>
                    {/* Card 1: Photo Editor */}
                    <Link to="/photo-editor">
                        <motion.div
                            whileHover={{ scale: 1.03, y: -10 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="glass-panel"
                            style={{
                                padding: '3rem 2rem',
                                borderRadius: '24px',
                                position: 'relative',
                                overflow: 'hidden',
                                borderTop: '4px solid #6366f1',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-50%', right: '-20%',
                                width: '200px', height: '200px',
                                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                                filter: 'blur(40px)', zIndex: 0
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
                                }}>
                                    <Camera size={32} color="#fff" />
                                </div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Photo Editor</h2>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Professional photo editing services with premium quality results.
                                </p>
                            </div>
                            <div style={{
                                marginTop: '2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: '#6366f1', fontWeight: '600'
                            }}>
                                View Portfolio <ArrowRight size={20} />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Card 2: Split Expenses */}
                    <Link to="/split-expenses">
                        <motion.div
                            whileHover={{ scale: 1.03, y: -10 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="glass-panel"
                            style={{
                                padding: '3rem 2rem',
                                borderRadius: '24px',
                                position: 'relative',
                                overflow: 'hidden',
                                borderTop: '4px solid #a855f7',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-50%', right: '-20%',
                                width: '200px', height: '200px',
                                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                                filter: 'blur(40px)', zIndex: 0
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)'
                                }}>
                                    <Wallet size={32} color="#fff" />
                                </div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Split Expenses</h2>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Easily split bills and track shared expenses with friends.
                                </p>
                            </div>
                            <div style={{
                                marginTop: '2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: '#a855f7', fontWeight: '600'
                            }}>
                                Start Splitting <ArrowRight size={20} />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Card 3: Time Zone Converter */}
                    <Link to="/time-zone-converter">
                        <motion.div
                            whileHover={{ scale: 1.03, y: -10 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="glass-panel"
                            style={{
                                padding: '3rem 2rem',
                                borderRadius: '24px',
                                position: 'relative',
                                overflow: 'hidden',
                                borderTop: '4px solid #00ff9d',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-50%', right: '-20%',
                                width: '200px', height: '200px',
                                background: 'radial-gradient(circle, rgba(0, 255, 157, 0.15) 0%, transparent 70%)',
                                filter: 'blur(40px)', zIndex: 0
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #00ff9d, #00b8d4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 8px 24px rgba(0, 255, 157, 0.3)'
                                }}>
                                    <Globe size={32} color="#fff" />
                                </div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Time Zone Converter</h2>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Convert time zones instantly for global collaboration.
                                </p>
                            </div>
                            <div style={{
                                marginTop: '2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: '#00ff9d', fontWeight: '600'
                            }}>
                                Convert Now <ArrowRight size={20} />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Card 4: Trip Planner */}
                    <Link to="/trip-planner">
                        <motion.div
                            whileHover={{ scale: 1.03, y: -10 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="glass-panel"
                            style={{
                                padding: '3rem 2rem',
                                borderRadius: '24px',
                                position: 'relative',
                                overflow: 'hidden',
                                borderTop: '4px solid #00ff9d',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-50%', right: '-20%',
                                width: '200px', height: '200px',
                                background: 'radial-gradient(circle, rgba(0, 255, 157, 0.15) 0%, transparent 70%)',
                                filter: 'blur(40px)', zIndex: 0
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #00ff9d, #00b8d4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 8px 24px rgba(0, 255, 157, 0.3)'
                                }}>
                                    <Map size={32} color="#fff" />
                                </div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Trip Planner</h2>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Create detailed trip plans with transportation, accommodations, and itineraries.
                                </p>
                            </div>
                            <div style={{
                                marginTop: '2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: '#00ff9d', fontWeight: '600'
                            }}>
                                Plan Trip <ArrowRight size={20} />
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Card 5: Job Portal */}
                <Link to="/job-portal">
                    <motion.div
                        whileHover={{ scale: 1.03, y: -10 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="glass-panel"
                        style={{
                            padding: '3rem 2rem',
                            borderRadius: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            borderTop: '4px solid #3b82f6',
                            cursor: 'pointer',
                            marginTop: '2rem',
                            maxWidth: '100%'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-50%', right: '-20%',
                            width: '200px', height: '200px',
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                            filter: 'blur(40px)', zIndex: 0
                        }} />

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{
                                width: '60px', height: '60px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                                flexShrink: 0
                            }}>
                                <Briefcase size={32} color="#fff" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Job Portal</h2>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Find your dream job with our curated listings.
                                </p>
                            </div>
                            <div style={{
                                marginLeft: 'auto',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: '#3b82f6', fontWeight: '600'
                            }}>
                                Browse Jobs <ArrowRight size={20} />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
