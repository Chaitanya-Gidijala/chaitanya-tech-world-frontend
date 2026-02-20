import React from 'react';
import { X, Star, Globe2, MapPin, Calendar } from 'lucide-react';
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`tz-card ${isFavorite ? 'favorite' : ''}`}
        >
            <div className="tz-card-header">
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 className="tz-city">{zone.city}</h3>
                    <div className="tz-offset">
                        <span className="tz-offset-badge">
                            {getTimeOffset(zone.value) || 'UTC'}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                            {zone.region}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem' }}>
                    <button
                        className={`tz-fav-btn ${isFavorite ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(zone.value);
                        }}
                    >
                        <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button
                        className="tz-remove-btn"
                        onClick={() => onRemove(zone.value)}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <div className="tz-time-group">
                    <span className="tz-main-time">{timeString}</span>
                    <span className="tz-ampm">{ampm}</span>
                </div>
                <div className="tz-date-row">
                    <Calendar size={13} style={{ opacity: 0.7 }} />
                    <span>{formatDate(date, zone.value)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ClockCard;
