import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({ job }) => {
    // Determine relative time
    const getPostedTime = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        return `${diffInDays} days ago`;
    };

    return (
        <motion.div
            className="jp-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            <div className="jp-card-header">
                <img
                    src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`}
                    alt={job.company}
                    className="jp-company-logo"
                />
                <div>
                    <h3 className="jp-card-title">{job.jobTitle}</h3>
                    <p className="jp-card-company">{job.company}</p>
                </div>
            </div>

            <div className="jp-card-body">
                <div className="jp-tags">
                    <span className="jp-tag location">
                        <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                        {job.location}
                    </span>
                    <span className="jp-tag type">
                        <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />
                        {job.jobType}
                    </span>
                    <span className="jp-tag" title="Experience">
                        <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                        {job.experienceRequired || job.experience}
                    </span>
                </div>
                <p style={{
                    color: 'var(--jp-text-muted)',
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                }}>
                    {job.jobDetails
                        ? job.jobDetails
                            .replace(/<\/?(p|div|br|li|h[1-6])[^>]*>/gi, ' ')  // Replace block elements with space
                            .replace(/<[^>]*>/g, '')  // Remove remaining tags
                            .replace(/\s+/g, ' ')  // Collapse multiple spaces
                            .trim()
                            .substring(0, 150) + (job.jobDetails.length > 150 ? '...' : '')
                        : ''
                    }
                </p>
            </div>

            <div className="jp-salary">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {/* <DollarSign size={16} /> */}
                    {job.salary}
                </div>
                <small style={{ color: 'var(--jp-text-muted)', fontWeight: 400 }}>
                    {getPostedTime(job.createdAt || job.createdDate)}
                </small>
            </div>

            <div style={{ marginTop: '1rem' }}>
                {/* <Link to={`/job-portal/job/${encodeURIComponent(job.jobTitle.replace(/\s+/g, '-'))}`} className="jp-btn jp-btn-outline" style={{ width: '100%' }}></Link> */}
                <Link to={`/job-portal/job/${job.jobTitle.toLowerCase().replace(/\s+/g, '-')}/${job.id}`} className="jp-btn jp-btn-outline" style={{ width: '100%' }}>
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

export default JobCard;
