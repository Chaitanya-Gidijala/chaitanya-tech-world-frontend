import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Clock, Plus, X, Star, Calendar, Search, ArrowRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
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

    // Save/Load selected zones and favorites
    useEffect(() => {
        const savedZones = localStorage.getItem('timezone-selected-v2');
        const savedFavs = localStorage.getItem('timezone-favorites-v2');
        if (savedZones) setSelectedZones(JSON.parse(savedZones));
        if (savedFavs) setFavorites(JSON.parse(savedFavs));
    }, []);

    useEffect(() => {
        localStorage.setItem('timezone-selected-v2', JSON.stringify(selectedZones));
    }, [selectedZones]);

    useEffect(() => {
        localStorage.setItem('timezone-favorites-v2', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (zoneValue) => {
        setFavorites(prev =>
            prev.includes(zoneValue)
                ? prev.filter(f => f !== zoneValue)
                : [...prev, zoneValue]
        );
    };

    const handleAddZone = (zone) => {
        if (!selectedZones.find(z => z.value === zone.value)) {
            setSelectedZones(prev => [...prev, zone]);
        }
    };

    const handleRemoveZone = (zoneValue) => {
        setSelectedZones(prev => prev.filter(z => z.value !== zoneValue));
    };

    // Refined Conversion Logic using Temporal-like calculation in vanilla JS
    const displayDate = useMemo(() => {
        if (conversionMode === 'realtime') return now;

        const [hours, minutes] = specificTime.split(':').map(Number);
        const [year, month, day] = specificDate.split('-').map(Number);

        // Create a date object in the source timezone
        // The most reliable way in browsers is to construct a string and parse it as that zone
        // But since we have specific parts, we'll use the offset difference approach
        const tempLocal = new Date(year, month - 1, day, hours, minutes);

        // Calculate the difference in milliseconds between local and fromZone
        const tzDate = new Date(tempLocal.toLocaleString('en-US', { timeZone: fromZone.value }));
        const diff = tzDate.getTime() - tempLocal.getTime();

        return new Date(tempLocal.getTime() - diff);
    }, [conversionMode, now, specificTime, specificDate, fromZone.value]);

    const filteredZones = useMemo(() => {
        if (!searchTerm) return []; // Don't show all initially for professional look
        const lower = searchTerm.toLowerCase();
        return AVAILABLE_ZONES.filter(zone =>
            zone.city.toLowerCase().includes(lower) ||
            zone.region.toLowerCase().includes(lower) ||
            zone.value.toLowerCase().includes(lower)
        ).slice(0, 50); // Limit results for performance
    }, [searchTerm]);

    // Sort zones to show favorites first
    const sortedSelectedZones = useMemo(() => {
        return [...selectedZones].sort((a, b) => {
            const aFav = favorites.includes(a.value);
            const bFav = favorites.includes(b.value);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return a.city.localeCompare(b.city);
        });
    }, [selectedZones, favorites]);

    return (
        <div className="tz-page">
            <div className="tz-grid-bg" />
            <div className="tz-orb tz-orb-1" />
            <div className="tz-orb tz-orb-2" />

            {/* ── Hero section ── */}
            <div className="container tz-hero">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="tz-hero-tag">
                        <Globe size={13} /> Worldwide Sync
                    </div>
                    <h1 className="tz-hero-h1">
                        Global <span className="tz-shimmer">Time Intelligence</span>
                    </h1>
                    <p className="tz-hero-sub">
                        Professional-grade time conversion for digital nomads, global teams, and travelers.
                        Stay synchronized across every timezone on Earth.
                    </p>
                </motion.div>
            </div>

            {/* ── Mode Selection ── */}
            <div className="container tz-controls">
                <div className="tz-mode-tabs">
                    <button
                        className={`tz-mode-btn ${conversionMode === 'realtime' ? 'active' : ''}`}
                        onClick={() => setConversionMode('realtime')}
                    >
                        <Clock size={16} /> Live Clocks
                    </button>
                    <button
                        className={`tz-mode-btn ${conversionMode === 'specific' ? 'active' : ''}`}
                        onClick={() => setConversionMode('specific')}
                    >
                        <Calendar size={16} /> Meeting Planner
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {conversionMode === 'specific' && (
                        <motion.div
                            key="meeting-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="tz-config-panel"
                        >
                            <div className="tz-config-grid">
                                <div className="tz-field">
                                    <label className="tz-label">I am in</label>
                                    <select
                                        className="tz-select"
                                        value={fromZone.value}
                                        onChange={(e) => setFromZone(AVAILABLE_ZONES.find(z => z.value === e.target.value))}
                                    >
                                        {AVAILABLE_ZONES.filter(z => z.region !== 'Etc').map(z => (
                                            <option key={z.value} value={z.value}>{z.city} ({z.region})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="tz-field">
                                    <label className="tz-label">On Date</label>
                                    <input
                                        type="date"
                                        className="tz-input"
                                        value={specificDate}
                                        onChange={(e) => setSpecificDate(e.target.value)}
                                    />
                                </div>
                                <div className="tz-field">
                                    <label className="tz-label">At Time</label>
                                    <input
                                        type="time"
                                        className="tz-input"
                                        value={specificTime}
                                        onChange={(e) => setSpecificTime(e.target.value)}
                                    />
                                </div>
                                <div className="tz-field">
                                    <label className="tz-label">Converting to</label>
                                    <select
                                        className="tz-select"
                                        value={toZone.value}
                                        onChange={(e) => setToZone(AVAILABLE_ZONES.find(z => z.value === e.target.value))}
                                    >
                                        {AVAILABLE_ZONES.filter(z => z.region !== 'Etc').map(z => (
                                            <option key={z.value} value={z.value}>{z.city} ({z.region})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <motion.div className="tz-result-hero">
                                <div className="tz-result-sub">Results for {toZone.city}</div>
                                <div className="tz-result-time">
                                    {formatTime(displayDate, toZone.value)}
                                </div>
                                <div className="tz-result-date">
                                    <Sparkles size={16} /> {formatDate(displayDate, toZone.value)}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Main Clocks Display ── */}
            <div className="container">
                <div className="tz-clocks-header">
                    <h2 className="tz-clocks-title">
                        {conversionMode === 'realtime' ? 'Tracked Locations' : 'Global Comparison'}
                    </h2>
                    <button className="tz-add-btn" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} strokeWidth={3} /> Add City
                    </button>
                </div>

                <motion.div layout className="tz-grid">
                    <AnimatePresence mode="popLayout">
                        {sortedSelectedZones.map(zone => (
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
                </motion.div>
            </div>

            {/* ── Enhanced Add City Modal ── */}
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
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="tz-modal-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Add Global City</h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="tz-remove-btn"
                                        style={{ background: 'var(--bg-body)' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="tz-search-wrap">
                                    <Search size={20} className="tz-search-icon" />
                                    <input
                                        type="text"
                                        className="tz-search-input"
                                        placeholder="Type a city name (e.g. London, Dubai...)"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="tz-modal-list">
                                {!searchTerm && (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        <Globe size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: 600 }}>Start searching for any city in the world</p>
                                    </div>
                                )}
                                {searchTerm && filteredZones.map(zone => {
                                    const isAdded = selectedZones.find(z => z.value === zone.value);
                                    return (
                                        <div
                                            key={zone.value}
                                            className={`tz-zone-item ${isAdded ? 'added' : ''}`}
                                            onClick={() => !isAdded && handleAddZone(zone)}
                                        >
                                            <div className="tz-item-info">
                                                <h4>{zone.city}</h4>
                                                <p>{zone.region} / {zone.value}</p>
                                            </div>
                                            {isAdded ? (
                                                <CheckCircle2 size={20} className="text-gradient" />
                                            ) : (
                                                <ArrowRight size={18} />
                                            )}
                                        </div>
                                    );
                                })}
                                {searchTerm && filteredZones.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        No matches found for "{searchTerm}"
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
