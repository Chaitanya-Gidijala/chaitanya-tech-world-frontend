import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({ job }) => {
    const getPostedTime = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        return `${diffInDays}d ago`;
    };

    const detailUrl = `/job-portal/job/${job.jobTitle.toLowerCase().replace(/\s+/g, '-')}/${job.id}`;

    const cleanDesc = job.jobDetails
        ? job.jobDetails
            .replace(/<\/?(p|div|br|li|h[1-6])[^>]*>/gi, ' ')
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 150) + (job.jobDetails.length > 150 ? '…' : '')
        : '';

    return (
        <motion.div
            className="jp-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3 }}
        >
            {/* ── MOBILE compact card (hidden on desktop via CSS) ── */}
            <Link to={detailUrl} className="jp-card-mobile" aria-label={`${job.jobTitle} at ${job.company}`}>
                <div className="jp-card-mobile-header">
                    <img
                        src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`}
                        alt={job.company}
                        className="jp-company-logo jp-company-logo--mobile"
                    />
                    <div className="jp-card-mobile-info">
                        <span className="jp-card-mobile-title">{job.jobTitle}</span>
                        <span className="jp-card-mobile-company">{job.company}</span>
                    </div>
                </div>
                <div className="jp-card-mobile-tags">
                    <span className="jp-card-mobile-tag">
                        <MapPin size={10} aria-hidden="true" />
                        {job.location}
                    </span>
                    <span className="jp-card-mobile-tag">
                        <Briefcase size={10} aria-hidden="true" />
                        {job.jobType}
                    </span>
                </div>
                <ArrowRight size={16} className="jp-card-mobile-arrow" aria-hidden="true" />
            </Link>

            {/* ── DESKTOP full card (hidden on mobile via CSS) ── */}
            <div className="jp-card-desktop">
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
                            <MapPin size={12} aria-hidden="true" />
                            {job.location}
                        </span>
                        <span className="jp-tag type">
                            <Briefcase size={12} aria-hidden="true" />
                            {job.jobType}
                        </span>
                        <span className="jp-tag">
                            <Clock size={12} aria-hidden="true" />
                            {job.experienceRequired || job.experience}
                        </span>
                    </div>

                    {cleanDesc && (
                        <p className="jp-card-desc">{cleanDesc}</p>
                    )}
                </div>

                <div className="jp-salary-bar">
                    <div className="jp-salary-value">
                        <DollarSign size={15} aria-hidden="true" />
                        {job.salary}
                    </div>
                    <span className="jp-posted-date">{getPostedTime(job.createdAt || job.createdDate)}</span>
                </div>

                <div className="jp-card-footer">
                    <Link to={detailUrl} className="jp-btn jp-btn-primary">
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
