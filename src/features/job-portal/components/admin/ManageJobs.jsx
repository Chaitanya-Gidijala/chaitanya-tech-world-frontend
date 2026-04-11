import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Search, Briefcase, MapPin, Clock } from 'lucide-react';
import './AdminLayout.css';

const ManageJobs = ({ jobs, onEdit, onDelete, editingJobId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredJobs = jobs.filter(job => {
        const matchSearch = [job.jobTitle, job.company, job.location]
            .some(v => v?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchFilter = filterType === 'all' || job.jobType === filterType;
        return matchSearch && matchFilter;
    });

    const getPostedTime = (dateString) => {
        if (!dateString) return 'Recently';
        const diff = Math.floor((new Date() - new Date(dateString)) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        return `${diff} days ago`;
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="adm-toolbar">
                <div className="adm-toolbar-left">
                    <div className="adm-search-wrap">
                        <Search className="adm-search-icon" size={16} />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="adm-search-input"
                        />
                    </div>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="adm-select">
                        <option value="all">All Types</option>
                        <option value="Full-time">Full Time</option>
                        <option value="Part-time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <div className="adm-toolbar-right">
                    <span className="adm-badge adm-badge-neutral">
                        {filteredJobs.length} / {jobs.length} jobs
                    </span>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="adm-empty">
                    <div className="adm-empty-icon"><Briefcase size={26} /></div>
                    <h3>No jobs found</h3>
                    <p>{searchTerm || filterType !== 'all' ? 'Try adjusting filters' : 'Create your first job to get started'}</p>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="adm-table-card">
                        <div className="adm-table-scroll">
                            <table className="adm-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Company</th>
                                        <th>Details</th>
                                        <th>Salary</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <AnimatePresence mode="popLayout" component="tbody">
                                    {filteredJobs.map((job, i) => (
                                        <motion.tr
                                            key={job.id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className={editingJobId === job.id ? 'is-editing' : ''}
                                        >
                                            <td><span className="adm-mono">{String(job.id).substring(0, 8)}â€¦</span></td>
                                            <td><span className="adm-cell-primary">{job.jobTitle}</span></td>
                                            <td>
                                                <div className="adm-cell-title-group">
                                                    <div className="adm-company-logo">
                                                        {job.companyLogo ? <img src={job.companyLogo} alt={job.company} /> : 'ðŸ¢'}
                                                    </div>
                                                    <span className="adm-cell-primary">{job.company}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="adm-cell-meta">
                                                    <span className="adm-cell-meta-row"><MapPin size={13} />{job.location}</span>
                                                    <span className="adm-cell-meta-row"><Briefcase size={13} />{job.jobType}</span>
                                                </div>
                                            </td>
                                            <td><span className="adm-salary">{job.salary}</span></td>
                                            <td>
                                                <div className="adm-cell-actions">
                                                    <button onClick={() => onEdit(job)} className="adm-btn-icon" title="Edit"><Edit2 size={15} /></button>
                                                    <button onClick={() => onDelete(job)} className="adm-btn-icon delete" title="Delete"><Trash2 size={15} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </table>
                        </div>
                    </div>

                    {/* Mobile cards */}
                    <div className="adm-card-grid">
                        {filteredJobs.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className={`adm-card ${editingJobId === job.id ? 'is-editing' : ''}`}
                            >
                                <div className="adm-card-header">
                                    <div className="adm-card-title-group">
                                        <div className="adm-company-logo">
                                            {job.companyLogo ? <img src={job.companyLogo} alt={job.company} /> : 'ðŸ¢'}
                                        </div>
                                        <div>
                                            <h3 className="adm-card-title">{job.jobTitle}</h3>
                                            <p className="adm-card-subtitle">{job.company}</p>
                                        </div>
                                    </div>
                                    <div className="adm-card-actions">
                                        <button onClick={() => onEdit(job)} className="adm-btn-icon"><Edit2 size={15} /></button>
                                        <button onClick={() => onDelete(job)} className="adm-btn-icon delete"><Trash2 size={15} /></button>
                                    </div>
                                </div>
                                <div className="adm-card-divider" />
                                <div className="adm-card-footer">
                                    <div>
                                        <div className="adm-card-meta-row"><MapPin size={12} />{job.location}</div>
                                        <div className="adm-card-meta-row"><Briefcase size={12} />{job.jobType}</div>
                                    </div>
                                    <div>
                                        <div className="adm-salary">{job.salary}</div>
                                        <div className="adm-card-meta-row"><Clock size={12} />{getPostedTime(job.createdAt || job.postedAt)}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageJobs;
