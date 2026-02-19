import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Search, Briefcase, MapPin, ExternalLink, Clock } from 'lucide-react';

const ManageJobs = ({ jobs, onEdit, onDelete, editingJobId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'all' || job.jobType === filterType;

        return matchesSearch && matchesFilter;
    });

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
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                {/* <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Manage Jobs
                </h2> */}
                <p style={{ color: 'var(--jp-text-muted)' }}>
                    {jobs.length} total job{jobs.length !== 1 ? 's' : ''} • {filteredJobs.length} shown
                </p>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
            }}>
                {/* Search */}
                <div style={{
                    flex: '1 1 300px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            color: 'var(--jp-text-muted)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search by title, company, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem 0.875rem 3rem',
                            borderRadius: '12px',
                            border: '1px solid var(--jp-border)',
                            background: 'var(--jp-bg-secondary)',
                            color: 'var(--jp-text-main)',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Filter by Type */}
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--jp-border)',
                        background: 'var(--jp-bg-secondary)',
                        color: 'var(--jp-text-main)',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        minWidth: '150px'
                    }}
                >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                </select>
            </div>

            {/* Job List */}
            {filteredJobs.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: 'var(--jp-bg-secondary)',
                    borderRadius: '16px',
                    border: '1px dashed var(--jp-border)'
                }}>
                    <Briefcase size={48} style={{ color: 'var(--jp-text-muted)', marginBottom: '1rem' }} />
                    <h3 style={{ color: 'var(--jp-text-main)', marginBottom: '0.5rem' }}>
                        No jobs found
                    </h3>
                    <p style={{ color: 'var(--jp-text-muted)' }}>
                        {searchTerm || filterType !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first job to get started'}
                    </p>
                </div>
            ) : (
                <div>
                    {/* Desktop Table View */}
                    <div className="manage-jobs-desktop">
                        <div style={{ overflowX: 'auto', background: 'var(--jp-card-bg)', borderRadius: '12px', border: '1px solid var(--jp-border)', boxShadow: 'var(--jp-shadow)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: 'var(--jp-text-main)' }}>
                                <thead style={{ background: 'var(--jp-bg-secondary)', borderBottom: '1px solid var(--jp-border)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>ID</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Job Title</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Company</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Details</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Salary</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--jp-text-muted)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredJobs.map((job) => (
                                        <tr key={job.id} style={{ borderBottom: '1px solid var(--jp-border)', background: editingJobId === job.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                                            <td style={{ padding: '1rem', verticalAlign: 'top', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--jp-text-muted)' }}>{String(job.id).substring(0, 8)}...</td>
                                            <td style={{ padding: '1rem', verticalAlign: 'top', fontWeight: 600 }}>{job.jobTitle}</td>
                                            <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', border: '1px solid var(--jp-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                        {job.companyLogo ? <img src={job.companyLogo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <span style={{ fontSize: '1.2rem' }}>🏢</span>}
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{job.company}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--jp-text-muted)' }}><MapPin size={14} /> {job.location}</span>
                                                    <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--jp-text-muted)' }}><Briefcase size={14} /> {job.jobType}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', verticalAlign: 'top', color: 'var(--jp-primary)', fontWeight: 600 }}>{job.salary}</td>
                                            <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button onClick={() => onEdit(job)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-main)', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                    <button onClick={() => onDelete(job)} style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="manage-jobs-mobile">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {filteredJobs.map((job) => (
                                <div key={job.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', border: '1px solid var(--jp-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                {job.companyLogo ? <img src={job.companyLogo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <span style={{ fontSize: '1.4rem' }}>🏢</span>}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--jp-text-main)' }}>{job.jobTitle}</h3>
                                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: 'var(--jp-text-muted)', fontWeight: 600 }}>{job.company}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => onEdit(job)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--jp-bg-secondary)', border: 'none', color: 'var(--jp-text-main)', display: 'flex' }}><Edit2 size={16} /></button>
                                            <button onClick={() => onDelete(job)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', display: 'flex' }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '0.75rem', fontSize: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid var(--jp-border)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--jp-text-muted)' }}><MapPin size={14} /> {job.location}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--jp-text-muted)' }}><Briefcase size={14} /> {job.jobType}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                                            <div style={{ fontWeight: 800, color: 'var(--jp-primary)', fontSize: '0.95rem' }}>{job.salary}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--jp-text-muted)', fontSize: '0.75rem' }}><Clock size={14} /> {getPostedTime(job.createdAt || job.createdDate || job.postedAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <style>{`
                        @media (min-width: 769px) { .manage-jobs-mobile { display: none !important; } }
                        @media (max-width: 768px) { .manage-jobs-desktop { display: none !important; } }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default ManageJobs;
