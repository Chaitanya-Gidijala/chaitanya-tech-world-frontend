import React, { useState, useEffect } from 'react';
import { getAllJobs, searchJobs } from '../services/jobService';
import JobCard from './JobCard';
import JobFilters from './JobFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Users, Building2, Trophy, Quote, Star, ArrowRight, BookOpen, Target, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/JobFeed.css';

const JobFeed = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await getAllJobs();
            setJobs(data || []);
            setError(null);
        } catch (err) {
            setError("Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = async (criteria) => {
        setLoading(true);
        try {
            const data = await searchJobs(criteria);
            setJobs(data || []);
            setError(null);
        } catch (err) {
            setError("Failed to search jobs.");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="jp-container">
                <div className="jp-error-container">
                    <p className="jp-error-message">{error}</p>
                    <button onClick={fetchJobs} className="jp-btn jp-btn-outline">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="jp-main-feed">
            {/* ── HERO SECTION ── */}
            <div className="jp-hero-section">
                <motion.div
                    className="jp-hero-content"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="jp-badge">Platform for Professionals</span>
                    <h1 className="jp-glitter-title">Find Your Dream Job</h1>
                    <p className="jp-hero-subtitle">
                        Discover your next career move among <span>thousands of premium openings</span> from the world's most innovative companies.
                    </p>
                </motion.div>
            </div>

            <JobFilters onSearch={handleSearch} />

            {/* ── TRUST PARTNERS ── */}
            <motion.section
                className="jp-trust-partners"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="jp-trust-label">Trusted by industry leaders</p>
                <div className="jp-partners-grid">
                    {[...['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'], ...['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix']].map((name, idx) => (
                        <div key={`${name}-${idx}`} className="jp-partner-logo">
                            {name}
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* ── JOB FEED ── */}
            <div className="jp-feed-header">
                <h2 className="jp-feed-title">Latest Opportunities</h2>
                <div className="jp-feed-line" />
            </div>

            {loading ? (
                <div className="jp-spinner"></div>
            ) : (
                <>
                    {jobs.length === 0 ? (
                        <div className="jp-empty-state">
                            <div className="empty-icon">📂</div>
                            <h3>No matching jobs found</h3>
                            <p>We couldn't find any positions matching your current search criteria.</p>
                            <button onClick={fetchJobs} className="jp-btn jp-btn-outline">
                                View All Jobs
                            </button>
                        </div>
                    ) : (
                        <motion.div className="jp-grid" layout>
                            <AnimatePresence>
                                {jobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </>
            )}

            {/* ── STATS SECTION ── */}
            <section className="jp-stats-section">
                <div className="jp-stats-grid">
                    {[
                        { icon: Building2, count: '500+', label: 'Top Companies' },
                        { icon: Users, count: '12k+', label: 'Active Candidates' },
                        { icon: Trophy, count: '8k+', label: 'Successful Hires' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            className="jp-stat-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <stat.icon className="jp-stat-icon" size={21} />
                            <div className="jp-stat-info">
                                <h3>{stat.count}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CORE FEATURES ── */}
            <section className="jp-features-section">
                <div className="jp-section-header">
                    <span className="jp-section-badge">Premium Features</span>
                    <h2 className="jp-section-title">Everything you need to succeed</h2>
                </div>
                <div className="jp-features-grid">
                    {[
                        {
                            icon: BookOpen,
                            title: 'Prep Hub',
                            desc: 'Master your interviews with curated questions and mock exams.',
                            link: '/job-portal/prep',
                            color: '#6366f1'
                        },
                        {
                            icon: Target,
                            title: 'Smart Matching',
                            desc: 'Our AI finds jobs that perfectly align with your background.',
                            color: '#a855f7'
                        },
                        {
                            icon: ShieldCheck,
                            title: 'Verified Listings',
                            desc: 'Every job is manually reviewed for safety and authenticity.',
                            color: '#10b981'
                        }
                    ].map((feat, i) => (
                        <motion.div
                            key={i}
                            className="jp-feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="jp-feature-card-header">
                                <div className="jp-feat-icon-wrap" style={{ '--feat-color': feat.color }}>
                                    <feat.icon size={22} />
                                </div>
                                <h3>{feat.title}</h3>
                            </div>
                            <div className="jp-feature-card-body">
                                <p>{feat.desc}</p>
                                {feat.link && (
                                    <Link to={feat.link} className="jp-feat-link">
                                        Explore <ArrowRight size={14} />
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="jp-testimonials">
                <div className="jp-section-header center">
                    <span className="jp-section-badge">Success Stories</span>
                    <h2 className="jp-section-title">Loved by Thousands</h2>
                </div>
                <div className="jp-testi-grid">
                    {[
                        {
                            name: 'Arjun Tankala',
                            role: 'Frontend Developer',
                            text: 'Found my dream role at Google within two weeks of using the Prep Hub.',
                            stars: 5
                        },
                        {
                            name: 'Priya Patel',
                            role: 'Product Designer',
                            text: 'The interface is so clean and the verified listings gave me peace of mind.',
                            stars: 5
                        },
                        {
                            name: 'Rahul Varma',
                            role: 'Backend Engineer',
                            text: 'Highly recommended for anyone looking for premium tech opportunities.',
                            stars: 5
                        }
                    ].map((testi, i) => (
                        <motion.div
                            key={i}
                            className="jp-testi-card"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="jp-testi-header">
                                <div className="jp-stars">
                                    {[...Array(testi.stars)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                                </div>
                            </div>
                            <p className="jp-testi-text">"{testi.text}"</p>
                            <div className="jp-testi-author">
                                <div className="jp-avatar">{testi.name[0]}</div>
                                <div className="jp-author-info">
                                    <strong>{testi.name}</strong>
                                    <span>{testi.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA SECTION ── */}
            <motion.section
                className="jp-cta-footer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="jp-cta-content">
                    <h3>Ready to start your journey?</h3>
                    <p>Join thousands of professionals finding their next big break.</p>
                    <div className="jp-cta-btns">
                        <Link to="/job-portal/prep" className="jp-btn jp-btn-primary large">Get Started Now</Link>
                        <button className="jp-btn jp-btn-outline large">Contact Sales</button>
                    </div>
                </div>
                <div className="jp-cta-decoration">
                    <Sparkles className="jp-cta-icon" size={80} />
                </div>
            </motion.section>
        </div>
    );
};

export default JobFeed;
