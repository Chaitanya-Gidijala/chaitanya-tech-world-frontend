import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Meh, Frown, ThumbsUp, Heart, Book, Calendar } from 'lucide-react';

const MOODS = [
    { value: 5, label: 'Amazing', icon: Heart, color: '#ec4899' },
    { value: 4, label: 'Good', icon: ThumbsUp, color: '#8b5cf6' },
    { value: 3, label: 'Average', icon: Smile, color: '#f59e0b' },
    { value: 2, label: 'Tired', icon: Meh, color: '#64748b' },
    { value: 1, label: 'Bad', icon: Frown, color: '#ef4444' },
];

const MoodTracker = () => {
    // Helper to get local date string YYYY-MM-DD
    const getLocalToday = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [moodLog, setMoodLog] = useState(() => {
        const saved = localStorage.getItem('mood-log-v2');
        return saved ? JSON.parse(saved) : {};
    });

    const [journalEntry, setJournalEntry] = useState('');
    const [isEditingJournal, setIsEditingJournal] = useState(false);

    const today = getLocalToday();
    const activeEntry = moodLog[today] || {};
    const selectedMood = activeEntry.mood || null;

    useEffect(() => {
        // Init journal input from saved state on mount or date change
        setJournalEntry(activeEntry.note || '');
    }, [today, activeEntry.note]);

    useEffect(() => {
        localStorage.setItem('mood-log-v2', JSON.stringify(moodLog));
    }, [moodLog]);

    const handleLogMood = (value) => {
        setMoodLog({
            ...moodLog,
            [today]: {
                ...activeEntry,
                mood: value,
                date: today
            }
        });
    };

    const handleSaveJournal = () => {
        setMoodLog({
            ...moodLog,
            [today]: {
                ...activeEntry,
                note: journalEntry,
                date: today
            }
        });
        setIsEditingJournal(false);
    };

    // Generate last 7 days history
    const getHistory = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            days.push({
                date: dateStr,
                entry: moodLog[dateStr] || {},
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                isToday: dateStr === today
            });
        }
        return days;
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '800', marginBottom: '0.5rem' }}>How are you feeling?</h2>
                <div style={{ background: 'var(--bg-body)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px', marginBottom: '3rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                    {MOODS.map((mood) => {
                        const Icon = mood.icon;
                        const isSelected = selectedMood === mood.value;

                        return (
                            <motion.button
                                key={mood.value}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleLogMood(mood.value)}
                                style={{
                                    border: 'none',
                                    background: isSelected ? mood.color : 'var(--bg-body)',
                                    padding: '1.5rem',
                                    borderRadius: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    minWidth: 'clamp(80px, 20vw, 100px)',
                                    color: isSelected ? 'white' : 'var(--text-muted)',
                                    transition: 'background 0.3s',
                                    boxShadow: isSelected ? `0 8px 20px -5px ${mood.color}80` : 'none'
                                }}
                            >
                                <Icon size={32} />
                                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{mood.label}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Journal Section */}
                <div style={{ textAlign: 'left', marginBottom: '3rem', background: 'var(--bg-body)', padding: '1.5rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Book size={20} className="text-gradient" /> Daily Journal
                        </h3>
                        {!isEditingJournal && journalEntry && (
                            <button onClick={() => setIsEditingJournal(true)} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }}>
                                Edit Note
                            </button>
                        )}
                    </div>

                    {isEditingJournal || !activeEntry.note ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <textarea
                                value={journalEntry}
                                onChange={(e) => setJournalEntry(e.target.value)}
                                placeholder="Write a few thoughts about your day..."
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-light)',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-main)',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                {activeEntry.note && (
                                    <button
                                        onClick={() => { setJournalEntry(activeEntry.note); setIsEditingJournal(false); }}
                                        style={{ padding: '0.5rem 1rem', borderRadius: '12px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleSaveJournal}
                                    style={{ padding: '0.5rem 1.5rem', borderRadius: '12px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                                >
                                    Save Note
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: 1.6 }}>
                            {activeEntry.note}
                        </p>
                    )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'left' }}>Weekly Overview</h3>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    background: 'var(--bg-body)',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    overflowX: 'auto'
                }}>
                    {getHistory().map((day) => {
                        const moodData = MOODS.find(m => m.value === day.entry.mood);
                        const Icon = moodData ? moodData.icon : null;
                        const hasNote = !!day.entry.note;

                        return (
                            <div key={day.date} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
                                opacity: day.entry.mood ? 1 : 0.4,
                                flex: 1,
                                minWidth: '50px'
                            }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: day.isToday ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                                    {day.label}
                                </div>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    background: moodData ? moodData.color : 'var(--bg-card)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    border: day.isToday ? '2px solid var(--color-primary)' : 'none',
                                    position: 'relative'
                                }}>
                                    {Icon ? <Icon size={20} /> : <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>•</span>}
                                    {hasNote && day.entry.mood && (
                                        <div style={{
                                            position: 'absolute', bottom: -2, right: -2,
                                            width: '14px', height: '14px', borderRadius: '50%',
                                            background: 'var(--bg-body)', border: '2px solid var(--bg-body)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-main)' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
