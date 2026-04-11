import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, ExternalLink, Share2, Sparkles, Building2 } from 'lucide-react';
import { getJobByTitleAndId } from '../services/jobService';
import JobPreparationSection from './prep/JobPreparationSection';
import { extractTagsFromTitle } from '../services/prepService';
import '../styles/JobDetails.css';

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
        <div className="jd-shell" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>{error}</h2>
            <Link to="/job-portal" className="jd-btn-share" style={{ width: 'auto', display: 'inline-flex', padding: '0 2rem', marginTop: '1.5rem' }}>Back to Jobs</Link>
        </div>
    );

    const jobTags = extractTagsFromTitle(job.jobTitle);

    return (
        <motion.div
            className="jd-shell"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* ── Top Navigation ── */}
            <nav className="jd-nav-bar">
                <Link to="/job-portal" className="jd-back-btn">
                    <ArrowLeft size={18} /> Back to Listings
                </Link>
            </nav>

            {/* ── Hero Section ── */}
            <header className="jd-hero">
                <div className="jd-logo-box">
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
                        <Building2 size={40} color="#94a3b8" />
                    )}
                </div>

                <div className="jd-header-info">
                    <div className="jd-title-row">
                        <div style={{ flex: 1 }}>
                            <h1 className="jd-main-title">{job.jobTitle}</h1>
                            <Link to="#" className="jd-company-link">{job.company}</Link>
                        </div>
                    </div>

                    <div className="jd-meta-pills">
                        <div className="jd-pill location">
                            <MapPin size={15} /> {job.location}
                        </div>
                        <div className="jd-pill type">
                            <Briefcase size={15} /> {job.jobType}
                        </div>
                        <div className="jd-pill">
                            <Clock size={15} /> {job.experienceRequired || job.experience}
                        </div>
                        <div className="jd-pill">
                            <Calendar size={15} />
                            {job.createdAt || job.createdDate ? new Date(job.createdAt || job.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Layout ── */}
            <div className="jd-grid-layout">
                {/* Left: Content */}
                <main className="jd-main-content">
                    <section className="jd-body-section">
                        <h3 className="jd-section-label">Job Description</h3>
                        <div
                            className="jd-description-text"
                            dangerouslySetInnerHTML={{ __html: job.jobDetails }}
                        />
                    </section>

                    <JobPreparationSection
                        jobTitle={job.jobTitle}
                        tags={jobTags}
                        onNavigate={handlePrepNavigate}
                    />
                </main>

                {/* Right: Sidebar */}
                <aside className="jd-sidebar">
                    <div className="jd-summary-box">
                        {job.salary && (
                            <div className="jd-salary-row">
                                <span className="jd-salary-label">Estimated Salary</span>
                                <div className="jd-salary-val">{job.salary}</div>
                            </div>
                        )}

                        <div className="jd-action-stack">
                            <a
                                href={job.applyLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="jd-btn-apply"
                            >
                                Apply Now <ExternalLink size={18} />
                            </a>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="jd-btn-share"
                                style={{
                                    borderColor: copied ? '#10b981' : '',
                                    color: copied ? '#10b981' : ''
                                }}
                            >
                                <Share2 size={18} /> {copied ? 'Link Copied!' : 'Share Job'}
                            </button>
                        </div>
                    </div>

                    <div className="jd-prep-banner">
                        <Sparkles style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.2 }} size={100} />
                        <h4>Ready to Prepare?</h4>
                        <p>Validate your skills and prepare for this specific role with our specialized tools.</p>
                        <button
                            onClick={() => handlePrepNavigate('hub')}
                            className="jd-btn-hub"
                        >
                            Open Prep Hub
                        </button>
                    </div>
                </aside>
            </div>
        </motion.div>
    );
};

export default JobDetails;
