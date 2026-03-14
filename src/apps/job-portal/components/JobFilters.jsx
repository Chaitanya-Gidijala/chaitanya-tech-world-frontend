import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const POPULAR_TAGS = ['React Developer', 'Java', 'Python', 'Remote', 'UI/UX'];

const JobFilters = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ keyword, location });
    };

    const handleTagClick = (tag) => {
        setKeyword(tag);
        onSearch({ keyword: tag, location });
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
                    <Search size={17} className="jp-search-field-icon" aria-hidden="true" />
                    <div className="jp-search-field-inner">
                        <span className="jp-search-field-label">Job Title / Keyword</span>
                        <input
                            id="jp-keyword-input"
                            type="text"
                            placeholder="e.g. Frontend Developer, React"
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
                    <MapPin size={17} className="jp-search-field-icon" aria-hidden="true" />
                    <div className="jp-search-field-inner">
                        <span className="jp-search-field-label">Location</span>
                        <input
                            id="jp-location-input"
                            type="text"
                            placeholder="City, state, or Remote"
                            value={location}
                            autoComplete="off"
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                {/* Button */}
                <button type="submit" className="jp-search-btn" aria-label="Search jobs">
                    <Search size={13} aria-hidden="true" />
                    <span>Search Jobs</span>
                </button>

            </form>

            {/* Popular tags */}
            <div className="jp-popular-tags">
                <span className="jp-popular-label">Trending:</span>
                {POPULAR_TAGS.map(tag => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="jp-popular-tag"
                        aria-label={`Search ${tag}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default JobFilters;
