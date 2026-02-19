import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const JobFilters = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ keyword, location });
    };

    return (
        <div className="jp-search-wrapper">
            <form onSubmit={handleSubmit} className="jp-search-bar">
                <div className="jp-search-input-group">
                    <Search className="jp-search-icon" size={20} />
                    <input
                        type="text"
                        className="jp-search-field"
                        placeholder="Job title, keywords, or company..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div className="jp-search-separator"></div>

                <div className="jp-search-input-group">
                    <MapPin className="jp-search-icon" size={20} />
                    <input
                        type="text"
                        className="jp-search-field"
                        placeholder="Location (e.g. Remote, NY)..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <button type="submit" className="jp-search-btn">
                    Find Jobs
                </button>
            </form>
        </div>
    );
};

export default JobFilters;
