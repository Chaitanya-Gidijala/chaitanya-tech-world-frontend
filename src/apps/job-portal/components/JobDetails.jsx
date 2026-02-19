import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, ExternalLink, Share2 } from 'lucide-react';
import { getJobByTitleAndId } from '../services/jobService';
import JobPreparationSection from './prep/JobPreparationSection';
import { extractTagsFromTitle } from '../services/prepService';

const JobDetails = () => {
    const { jobSlug, jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                // Fetch by slug (title) and id to satisfy the new backend requirement
                const data = await getJobByTitleAndId(jobSlug, jobId);
                if (!data) throw new Error('Job not found');
                setJob(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (jobSlug && jobId) fetchJob();
    }, [jobSlug, jobId]);

    const handlePrepNavigate = (type, data) => {
        const tags = extractTagsFromTitle(job.jobTitle);
        const tagParam = tags.join(',');

        if (type === 'questions') navigate(`/job-portal/prep/questions?tech=${tagParam}`);
        if (type === 'resources') navigate(`/job-portal/prep/resources?tech=${tagParam}`);
        if (type === 'mcq-start' || type === 'hub') navigate(`/job-portal/prep?tech=${tagParam}`);
    };

    if (loading) return <div className="jp-spinner"></div>;
    if (error) return (
        <div className="jp-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>{error}</h2>
            <Link to="/job-portal" className="jp-btn jp-btn-outline" style={{ marginTop: '1rem' }}>Back to Jobs</Link>
        </div>
    );

    const jobTags = extractTagsFromTitle(job.jobTitle);

    return (
        <motion.div
            className="jp-container"
            style={{ padding: '1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Link to="/job-portal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--jp-text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }}>
                <ArrowLeft size={18} /> Back to Listings
            </Link>

            <div className="jp-details-container">
                <div className="jp-details-header jp-mobile-compact" style={{
                    background: 'var(--jp-card-bg)',
                    borderRadius: '24px',
                    marginBottom: '2rem',
                    border: '1px solid var(--jp-border)',
                    boxShadow: 'var(--jp-shadow)'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Logo */}
                        <div className="jp-mobile-tight" style={{
                            width: '80px',
                            height: '80px',
                            background: 'white',
                            borderRadius: '16px',
                            padding: '8px',
                            border: '1px solid var(--jp-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {job.companyLogo ? (
                                <img
                                    src={job.companyLogo}
                                    alt={job.company}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`;
                                    }}
                                />
                            ) : (
                                <div style={{ fontSize: '2rem' }}>🏢</div>
                            )}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <h1 className="jp-mobile-title-sm" style={{
                                    fontSize: '2.25rem',
                                    fontWeight: 800,
                                    margin: '0 0 0.5rem 0',
                                    color: 'var(--jp-text-main)',
                                    lineHeight: 1.2,
                                    textAlign: 'left'
                                }}>
                                    {job.jobTitle}
                                </h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--jp-text-muted)', fontWeight: 500, flexWrap: 'wrap' }}>
                                    <span>{job.company}</span>
                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', opacity: 0.5 }}></span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <MapPin size={16} /> {job.location}
                                    </span>
                                </div>
                            </div>

                            {/* Clean Badges Row */}
                            <div className="jp-tags" style={{ marginTop: '0.5rem' }}>
                                <span className="jp-card-tag" style={{ color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }}>
                                    <Briefcase size={14} /> {job.jobType}
                                </span>

                                <span className="jp-card-tag" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                                    <Clock size={14} /> {job.experienceRequired || job.experience}
                                </span>

                                <span className="jp-card-tag" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)' }}>
                                    <Calendar size={14} /> {job.createdAt || job.createdDate ? new Date(job.createdAt || job.createdDate).toLocaleDateString() : 'Recently'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="jp-details-content jp-mobile-grid-1">
                    <div className="jp-details-main">
                        <div className="jp-details-section">
                            <h3 className="jp-mobile-hide" style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--jp-text-muted)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                                Job Description
                            </h3>
                            <div
                                className="jp-rich-content jp-mobile-compact"
                                dangerouslySetInnerHTML={{ __html: job.jobDetails }}
                                style={{
                                    padding: '2.5rem',
                                    background: 'var(--jp-card-bg)',
                                    borderRadius: '24px',
                                    border: '1px solid var(--jp-border)',
                                    boxShadow: 'var(--jp-shadow-sm)'
                                }}
                            />
                        </div>

                        <JobPreparationSection
                            jobTitle={job.jobTitle}
                            tags={jobTags}
                            onNavigate={handlePrepNavigate}
                        />
                    </div>

                    <div className="jp-details-sidebar jp-mobile-compact" style={{ position: 'sticky', top: '2rem', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{
                            padding: '2rem',
                            background: 'var(--jp-bg)',
                            borderRadius: '24px',
                            border: '1px solid var(--jp-border)',
                            boxShadow: 'var(--jp-shadow)'
                        }}>
                            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--jp-text-muted)', marginBottom: '1rem' }}>Salary Range</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jp-primary)', marginBottom: '2rem' }}>
                                {job.salary}
                            </p>

                            <a
                                href={job.applyLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="jp-btn jp-btn-primary"
                                style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', marginBottom: '1rem' }}
                            >
                                Apply Now <ExternalLink size={20} />
                            </a>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="jp-btn jp-btn-outline"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    borderColor: copied ? '#10b981' : 'var(--jp-border)',
                                    color: copied ? '#10b981' : 'inherit'
                                }}
                            >
                                <Share2 size={18} /> {copied ? 'Link Copied!' : 'Share Job'}
                            </button>
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))',
                            borderRadius: '24px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Ready to Prepare?</h4>
                            <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem' }}>Validate your skills and prepare for this specific role with our tools.</p>
                            <button
                                onClick={() => handlePrepNavigate('hub')}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'white',
                                    color: 'var(--jp-primary)',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Open Prep Hub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JobDetails;
