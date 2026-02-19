import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Clock, Plus, X, Star, Calendar, Search, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { AVAILABLE_ZONES, DEFAULT_ZONES } from './config';
import { formatTime, formatDate } from './utils';
import ClockCard from './components/ClockCard';
import './TimeZone.css';

const TimeZoneApp = () => {
    const [now, setNow] = useState(new Date());
    const [selectedZones, setSelectedZones] = useState(DEFAULT_ZONES);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Specific time conversion state
    const [conversionMode, setConversionMode] = useState('realtime'); // 'realtime' or 'specific'
    const [specificTime, setSpecificTime] = useState('12:00');
    const [specificDate, setSpecificDate] = useState(new Date().toISOString().split('T')[0]);
    const [fromZone, setFromZone] = useState(DEFAULT_ZONES[0]);
    const [toZone, setToZone] = useState(DEFAULT_ZONES[1]);

    // Timer for real-time clock
    useEffect(() => {
        if (conversionMode === 'realtime') {
            const timer = setInterval(() => {
                setNow(new Date());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [conversionMode]);

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('timezone-favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const toggleFavorite = (zoneValue) => {
        const newFavorites = favorites.includes(zoneValue)
            ? favorites.filter(f => f !== zoneValue)
            : [...favorites, zoneValue];
        setFavorites(newFavorites);
        localStorage.setItem('timezone-favorites', JSON.stringify(newFavorites));
    };

    const handleAddZone = (zone) => {
        if (!selectedZones.find(z => z.value === zone.value)) {
            setSelectedZones([...selectedZones, zone]);
        }
        setShowAddModal(false);
        setSearchTerm('');
    };

    const handleRemoveZone = (zoneValue) => {
        setSelectedZones(selectedZones.filter(z => z.value !== zoneValue));
    };

    const getConvertedTime = () => {
        if (conversionMode === 'realtime') return now;

        // Parse specific time and date
        const [hours, minutes] = specificTime.split(':');
        const [year, month, day] = specificDate.split('-');

        // We need to create the date in the context of the fromZone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: fromZone.value,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        });

        // This is tricky in vanilla JS without weightly libraries. 
        // A better way: Calculate offset difference
        const d = new Date();
        const fromOffset = new Date(d.toLocaleString('en-US', { timeZone: fromZone.value })).getTime() - d.getTime();

        const localInputDate = new Date(year, month - 1, day, hours, minutes);
        // Correct for the source timezone offset
        return new Date(localInputDate.getTime() - fromOffset);
    };

    const filteredZones = AVAILABLE_ZONES.filter(zone =>
        zone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayDate = getConvertedTime();

    return (
        <div className="tz-page">
            {/* Background elements */}
            <div className="tz-grid-bg" />
            <div className="tz-orb tz-orb-1" />
            <div className="tz-orb tz-orb-2" />

            {/* ── Hero ── */}
            <div className="container tz-hero">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="tz-hero-tag">
                        <Sparkles size={12} /> Global Time Tracker
                    </div>
                    <h1 className="tz-hero-h1">
                        Connect Across <span className="tz-shimmer">Boundaries</span>
                    </h1>
                    <p className="tz-hero-sub">
                        Professional world clock and time zone converter. Track multiple cities
                        simultaneously or plan meetings across different time zones.
                    </p>
                </motion.div>
            </div>

            {/* ── Controls ── */}
            <div className="container tz-controls">
                <div className="tz-mode-tabs">
                    <button
                        className={`tz-mode-btn ${conversionMode === 'realtime' ? 'active' : ''}`}
                        onClick={() => setConversionMode('realtime')}
                    >
                        <Clock size={16} /> Real-time mode
                    </button>
                    <button
                        className={`tz-mode-btn ${conversionMode === 'specific' ? 'active' : ''}`}
                        onClick={() => setConversionMode('specific')}
                    >
                        <Calendar size={16} /> Specific conversion
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {conversionMode === 'specific' && (
                        <motion.div
                            key="specific-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="tz-config-panel"
                        >
                            <div className="tz-config-grid">
                                <div className="tz-field">
                                    <label className="tz-label">Source Zone</label>
                                    <select
                                        className="tz-select"
                                        value={fromZone.value}
                                        onChange={(e) => setFromZone(AVAILABLE_ZONES.find(z => z.value === e.target.value))}
                                    >
                                        {AVAILABLE_ZONES.map(z => (
                                            <option key={z.value} value={z.value}>{z.city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="tz-field">
                                    <label className="tz-label">Date</label>
                                    <input
                                        type="date"
                                        className="tz-input"
                                        value={specificDate}
                                        onChange={(e) => setSpecificDate(e.target.value)}
                                    />
                                </div>
                                <div className="tz-field">
                                    <label className="tz-label">Time</label>
                                    <input
                                        type="time"
                                        className="tz-input"
                                        value={specificTime}
                                        onChange={(e) => setSpecificTime(e.target.value)}
                                    />
                                </div>
                                <div className="tz-field">
                                    <label className="tz-label">Target Zone</label>
                                    <select
                                        className="tz-select"
                                        value={toZone.value}
                                        onChange={(e) => setToZone(AVAILABLE_ZONES.find(z => z.value === e.target.value))}
                                    >
                                        {AVAILABLE_ZONES.map(z => (
                                            <option key={z.value} value={z.value}>{z.city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <motion.div
                                className="tz-result-hero"
                                layoutId="result-hero"
                            >
                                <div className="tz-result-sub">
                                    {specificTime} in {fromZone.city} equals
                                </div>
                                <div className="tz-result-time">
                                    {formatTime(displayDate, toZone.value)}
                                </div>
                                <div className="tz-result-date">
                                    {formatDate(displayDate, toZone.value)} in {toZone.city}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── World Clocks ── */}
            <div className="container">
                <div className="tz-clocks-header">
                    <h2 className="tz-clocks-title">
                        {conversionMode === 'realtime' ? 'Live World Clocks' : 'Time Conversions'}
                    </h2>
                    <button className="tz-add-btn" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} /> Add City
                    </button>
                </div>

                <div className="tz-grid">
                    <AnimatePresence mode="popLayout">
                        {selectedZones.map(zone => (
                            <ClockCard
                                key={zone.value}
                                zone={zone}
                                date={displayDate}
                                onRemove={handleRemoveZone}
                                isFavorite={favorites.includes(zone.value)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Add Modal ── */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="tz-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            className="tz-modal"
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="tz-modal-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Add a New City</h3>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="tz-search-wrap">
                                    <Search size={18} className="tz-search-icon" />
                                    <input
                                        type="text"
                                        className="tz-search-input"
                                        placeholder="Search by city or country..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="tz-modal-list">
                                {filteredZones.map(zone => {
                                    const isAdded = selectedZones.find(z => z.value === zone.value);
                                    return (
                                        <div
                                            key={zone.value}
                                            className={`tz-zone-item ${isAdded ? 'added' : ''}`}
                                            onClick={() => !isAdded && handleAddZone(zone)}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 700 }}>{zone.city}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{zone.label}</div>
                                            </div>
                                            <div style={{ color: 'var(--color-primary)' }}>
                                                {isAdded ? <Plus size={18} style={{ transform: 'rotate(45deg)', opacity: 0.5 }} /> : <ArrowRight size={18} />}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredZones.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        No cities found matching your search.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimeZoneApp;
