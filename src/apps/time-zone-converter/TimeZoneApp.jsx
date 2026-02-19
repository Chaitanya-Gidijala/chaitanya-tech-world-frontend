import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Clock, Plus, X, Star, History, Calendar, Search, ArrowRight } from 'lucide-react';
import { AVAILABLE_ZONES, DEFAULT_ZONES } from './config';
import { formatTime, formatDate, getTimeOffset } from './utils';

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
        const baseDate = new Date(specificDate);
        baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Create date string in source timezone
        const sourceTimeString = baseDate.toLocaleString('en-US', { timeZone: fromZone.value });
        return new Date(sourceTimeString);
    };

    const filteredZones = AVAILABLE_ZONES.filter(zone =>
        zone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayDate = getConvertedTime();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            {/* Hero Section */}
            {/* Hero Section */}
            <section style={{
                padding: '3rem 1rem 2rem', // Reduced side padding for mobile
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginBottom: '2rem' }}
                    >
                        {/* Stacked layout for very small screens */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column', // Stack by default on mobile could be safer, or wrap
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <Globe size={40} className="text-gradient" />
                            <h1 style={{
                                fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                fontWeight: '800',
                                margin: 0,
                                lineHeight: 1.1
                            }}>
                                <span className="text-gradient">World Clock</span>
                            </h1>
                        </div>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                            Professional time zone converter with real-time tracking and specific time conversion
                        </p>
                    </motion.div>

                    {/* Mode Selector */}
                    <div className="glass-panel" style={{ padding: '1.5rem 1rem', marginBottom: '2rem' }}>
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            marginBottom: '1.5rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setConversionMode('realtime')}
                                className={conversionMode === 'realtime' ? 'btn btn-primary' : 'btn-ghost'}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    flex: '1 1 200px', // Allow growing and shrinking, min 200px or full width
                                    width: '100%'
                                }}
                            >
                                <Clock size={18} />
                                Real-time Mode
                            </button>
                            <button
                                onClick={() => setConversionMode('specific')}
                                className={conversionMode === 'specific' ? 'btn btn-primary' : 'btn-ghost'}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    flex: '1 1 200px',
                                    width: '100%'
                                }}
                            >
                                <Calendar size={18} />
                                Specific Time Conversion
                            </button>
                        </div>

                        {/* Specific Time Conversion Controls */}
                        {conversionMode === 'specific' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', // Decreased minmax for better fit
                                    gap: '1rem',
                                    padding: '1rem', // Reduced padding
                                    background: 'var(--bg-main)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border-light)'
                                }}
                            >
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                                        From Zone
                                    </label>
                                    <select
                                        value={fromZone.value}
                                        onChange={(e) => setFromZone(AVAILABLE_ZONES.find(z => z.value === e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            background: 'var(--bg-card-glass)',
                                            color: 'var(--text-main)',
                                            border: '1px solid var(--border-light)'
                                        }}
                                    >
                                        {AVAILABLE_ZONES.map(z => (
                                            <option key={z.value} value={z.value}>{z.city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={specificDate}
                                        onChange={(e) => setSpecificDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            background: 'var(--bg-card-glass)',
                                            color: 'var(--text-main)',
                                            border: '1px solid var(--border-light)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={specificTime}
                                        onChange={(e) => setSpecificTime(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            background: 'var(--bg-card-glass)',
                                            color: 'var(--text-main)',
                                            border: '1px solid var(--border-light)'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                                        To Zone
                                    </label>
                                    <select
                                        value={toZone.value}
                                        onChange={(e) => setToZone(AVAILABLE_ZONES.find(z => z.value === e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            background: 'var(--bg-card-glass)',
                                            color: 'var(--text-main)',
                                            border: '1px solid var(--border-light)'
                                        }}
                                    >
                                        {AVAILABLE_ZONES.map(z => (
                                            <option key={z.value} value={z.value}>{z.city}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Conversion Result */}
                                <div style={{
                                    gridColumn: '1 / -1',
                                    padding: '1.5rem',
                                    background: 'linear-gradient(135deg, var(--color-primary-glow) 0%, var(--color-secondary) 100%)',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    marginTop: '1rem'
                                }}>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                                        {specificTime} in {fromZone.city} equals
                                    </div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                                        {formatTime(displayDate, toZone.value)}
                                    </div>
                                    <div style={{ fontSize: '1rem', opacity: 0.9, marginTop: '0.5rem' }}>
                                        {formatDate(displayDate, toZone.value)} in {toZone.city}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* World Clocks Section */}
            <section style={{ padding: '2rem 1rem' }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700' }}>
                            {conversionMode === 'realtime' ? 'Live World Clocks' : 'Time Zones'}
                        </h2>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                            <Plus size={18} />
                            Add City
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Reduced min-width to accommodate 300px screens better
                        gap: '1rem'
                    }}>
                        <AnimatePresence>
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
            </section>

            {/* Add Zone Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '2rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel"
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                maxHeight: '80vh',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Add City</h3>
                                    <button onClick={() => setShowAddModal(false)} style={{ padding: '0.5rem' }}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search cities..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 3rem',
                                            borderRadius: '12px',
                                            background: 'var(--bg-main)',
                                            border: '1px solid var(--border-light)',
                                            fontSize: '1rem',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ overflowY: 'auto', padding: '1rem' }}>
                                {filteredZones.map(zone => {
                                    const isAdded = selectedZones.find(z => z.value === zone.value);
                                    const isFav = favorites.includes(zone.value);
                                    return (
                                        <motion.div
                                            key={zone.value}
                                            whileHover={{ x: 4 }}
                                            onClick={() => !isAdded && handleAddZone(zone)}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                marginBottom: '0.5rem',
                                                background: isAdded ? 'var(--bg-main)' : 'var(--bg-card-glass)',
                                                border: '1px solid var(--border-light)',
                                                cursor: isAdded ? 'not-allowed' : 'pointer',
                                                opacity: isAdded ? 0.5 : 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{zone.city}</div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{zone.label}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {isFav && <Star size={16} fill="var(--color-primary)" color="var(--color-primary)" />}
                                                {!isAdded && <ArrowRight size={20} color="var(--color-primary)" />}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Clcok Card Component
const ClockCard = ({ zone, date, onRemove, isFavorite, onToggleFavorite }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="glass-panel"
            style={{
                padding: 'clamp(1.2rem, 3vw, 2rem)', // Responsive padding
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                minHeight: '180px',
                border: isFavorite ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                background: isFavorite ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)' : 'var(--bg-card-glass)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '0.5rem' }}>
                <div style={{ minWidth: 0, flex: 1 }}> {/* MinWidth 0 allows text truncation if needed */}
                    <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', fontWeight: '700', marginBottom: '0.25rem', overflowWrap: 'break-word', lineHeight: 1.2 }}>
                        {zone.city}
                    </h3>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {getTimeOffset(zone.value)}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(zone.value);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: isFavorite ? 'var(--color-primary)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <Star size={18} fill={isFavorite ? 'var(--color-primary)' : 'none'} />
                    </button>
                    <button
                        onClick={() => onRemove(zone.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                flexWrap: 'nowrap', // Force single line
                marginBottom: '0.5rem'
            }}>
                <span style={{
                    fontSize: 'clamp(1.8rem, 12vw, 3rem)', // Reduced min size for small screens
                    fontWeight: '300',
                    letterSpacing: '-1px',
                    fontVariantNumeric: 'tabular-nums',
                    background: 'var(--gradient-brand)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1
                }}>
                    {formatTime(date, zone.value).split(' ')[0]}
                </span>
                <span style={{
                    fontSize: 'clamp(1rem, 5vw, 1.5rem)', // Smaller AM/PM
                    fontWeight: '500',
                    color: 'var(--text-muted)' // Distinct color for AM/PM
                }}>
                    {formatTime(date, zone.value).split(' ')[1]}
                </span>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                fontSize: '0.95rem'
            }}>
                <Clock size={14} />
                {formatDate(date, zone.value)}
            </div>
        </motion.div >
    );
};

export default TimeZoneApp;
