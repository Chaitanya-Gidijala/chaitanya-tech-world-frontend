import React, { useState, useEffect } from 'react';
import { getAllJobs, searchJobs } from '../services/jobService';
import JobCard from './JobCard';
import JobFilters from './JobFilters';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div className="jp-container" style={{ textAlign: 'center', color: 'red' }}>
                <p>{error}</p>
                <button onClick={fetchJobs} className="jp-btn jp-btn-outline">Try Again</button>
            </div>
        );
    }

    return (
        <div className="jp-container">
            <div className="jp-header">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Find Your Dream Job
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    Browse thousands of job openings from top companies
                </motion.p>
            </div>

            <JobFilters onSearch={handleSearch} />

            {loading ? (
                <div className="jp-spinner"></div>
            ) : (
                <>
                    {jobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--jp-text-muted)' }}>
                            <h3>No jobs found matching your criteria.</h3>
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
        </div>
    );
};

export default JobFeed;
