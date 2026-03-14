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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="jp-details-container">
                <Link to="/job-portal" className="jp-back-link">
                    <ArrowLeft size={18} /> Back to Listings
                </Link>

                <div className="jp-details-header">
                    <div className="jp-details-header-content">
                        <div className="jp-details-logo-wrapper">
                            {job.companyLogo ? (
                                <img
                                    src={job.companyLogo}
                                    alt={job.company}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`;
                                    }}
                                />
                            ) : (
                                <div style={{ fontSize: '2rem' }}>🏢</div>
                            )}
                        </div>

                        <div className="jp-details-title-group">
                            <h1 className="jp-details-title">
                                {job.jobTitle}
                            </h1>
                            <div className="jp-details-meta">
                                <div className="jp-meta-item">{job.company}</div>
                                <span className="jp-meta-dot"></span>
                                <div className="jp-meta-item">
                                    <MapPin size={16} /> {job.location}
                                </div>
                                <span className="jp-meta-dot"></span>
                                <div className="jp-meta-item">
                                    <Calendar size={16} />
                                    {job.createdAt || job.createdDate ? new Date(job.createdAt || job.createdDate).toLocaleDateString() : 'Recently'}
                                </div>
                            </div>

                            <div className="jp-tags" style={{ marginTop: '1.25rem' }}>
                                <span className="jp-tag type">
                                    <Briefcase size={14} /> {job.jobType}
                                </span>
                                <span className="jp-tag">
                                    <Clock size={14} /> {job.experienceRequired || job.experience}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="jp-details-grid">
                    <div className="jp-details-main">
                        <section className="jp-details-section">
                            <h3 className="jp-section-title">Job Description</h3>
                            <div
                                className="jp-details-card jp-rich-content"
                                dangerouslySetInnerHTML={{ __html: job.jobDetails }}
                            />
                        </section>

                        <JobPreparationSection
                            jobTitle={job.jobTitle}
                            tags={jobTags}
                            onNavigate={handlePrepNavigate}
                        />
                    </div>

                    <aside className="jp-details-sidebar">
                        <div className="jp-sidebar-box">
                            <h3 className="jp-section-title">Salary Range</h3>
                            <span className="jp-salary-display">
                                {job.salary}
                            </span>

                            <div className="jp-sidebar-actions">
                                <a
                                    href={job.applyLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="jp-btn jp-btn-primary"
                                    style={{ height: '52px', fontSize: '1.05rem' }}
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
                                        height: '52px',
                                        borderColor: copied ? '#10b981' : '',
                                        color: copied ? '#10b981' : ''
                                    }}
                                >
                                    <Share2 size={18} /> {copied ? 'Link Copied!' : 'Share Job'}
                                </button>
                            </div>

                            <div className="jp-prep-promo">
                                <h4>Ready to Prepare?</h4>
                                <p>Validate your skills and prepare for this specific role with our tools.</p>
                                <button
                                    onClick={() => handlePrepNavigate('hub')}
                                    className="jp-btn-white"
                                >
                                    Open Prep Hub
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </motion.div>
    );
};

export default JobDetails;
