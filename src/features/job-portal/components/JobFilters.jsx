import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const JobFilters = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ keyword, location });
    };

    return (
        <motion.div
            className="jp-search-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <form onSubmit={handleSubmit} className="jp-search-form" noValidate>

                {/* Keyword */}
                <div className="jp-search-field">
                    <Search size={18} className="jp-search-field-icon" aria-hidden="true" />
                    <div className="jp-search-field-inner">
                        <span className="jp-search-field-label">Job Title / Keyword</span>
                        <input
                            id="jp-keyword-input"
                            type="text"
                            placeholder="Job title, keyword, or company"
                            value={keyword}
                            autoComplete="off"
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Separator */}
                <div className="jp-search-sep" aria-hidden="true" />

                {/* Location */}
                <div className="jp-search-field">
                    <MapPin size={18} className="jp-search-field-icon" aria-hidden="true" />
                    <div className="jp-search-field-inner">
                        <span className="jp-search-field-label">Location</span>
                        <input
                            id="jp-location-input"
                            type="text"
                            placeholder="City or state"
                            value={location}
                            autoComplete="off"
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                {/* Button */}
                <button type="submit" className="jp-search-btn" aria-label="Search jobs">
                    <Filter size={16} aria-hidden="true" />
                    <span>Search</span>
                </button>

            </form>
        </motion.div>
    );
};

export default JobFilters;
