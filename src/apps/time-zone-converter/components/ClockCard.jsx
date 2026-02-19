import React from 'react';
import { X, Clock, Star, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime, formatDate, getTimeOffset } from '../utils';
import '../TimeZone.css';

const ClockCard = ({ zone, date, onRemove, isFavorite, onToggleFavorite }) => {
    const timeParts = formatTime(date, zone.value).split(' ');
    const timeString = timeParts[0];
    const ampm = timeParts[1];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`tz-card ${isFavorite ? 'favorite' : ''}`}
        >
            <div className="tz-card-header">
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 className="tz-city">{zone.city}</h3>
                    <div className="tz-offset">
                        <Globe2 size={13} />
                        <span className="tz-offset-badge">{getTimeOffset(zone.value) || zone.value}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                        className={`tz-fav-btn ${isFavorite ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(zone.value);
                        }}
                        title={isFavorite ? "Remove from Favorites" : "Mark as Favorite"}
                    >
                        <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button
                        className="tz-remove-btn"
                        onClick={() => onRemove(zone.value)}
                        title="Remove City"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <div className="tz-time-group">
                    <span className="tz-main-time">{timeString}</span>
                    <span className="tz-ampm">{ampm}</span>
                </div>
                <div className="tz-date-row">
                    <Clock size={14} />
                    <span>{formatDate(date, zone.value)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ClockCard;
