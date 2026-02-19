import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Flame, Trash2, Trophy, Calendar, Info } from 'lucide-react';

const HabitTracker = () => {
    // Helper to get local date string YYYY-MM-DD
    const getLocalToday = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('habit-tracker-data-v2');
        return saved ? JSON.parse(saved) : [];
    });
    const [newHabit, setNewHabit] = useState('');
    const [goal, setGoal] = useState(7); // Check-ins per week target (visual only for now)

    useEffect(() => {
        localStorage.setItem('habit-tracker-data-v2', JSON.stringify(habits));
    }, [habits]);

    const addHabit = (e) => {
        e.preventDefault();
        if (!newHabit.trim()) return;

        const habit = {
            id: Date.now(),
            name: newHabit.trim(),
            streak: 0,
            completedDates: [],
            bestStreak: 0,
            createdAt: getLocalToday()
        };

        setHabits([...habits, habit]);
        setNewHabit('');
    };

    const calculateStreak = (dates) => {
        if (!dates || dates.length === 0) return 0;

        const sortedDates = [...dates].sort((a, b) => new Date(b) - new Date(a)); // Descending
        const today = getLocalToday();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0]; // Using ISO for simple date subtraction check

        // Check if latest completion is today or yesterday to trigger active streak
        const lastDate = sortedDates[0];

        // Simple consecutive check logic
        // Convert strings to epoch days for safer math
        const toDayEpoch = (dateStr) => Math.floor(new Date(dateStr).getTime() / (1000 * 60 * 60 * 24));

        let currentStreak = 0;
        let diff = toDayEpoch(today) - toDayEpoch(lastDate);

        // If last completion was older than yesterday, streak is broken (0), UNLESS it's just today pending
        if (diff > 1) return 0;

        // Iterate backwards
        let expectedDay = toDayEpoch(lastDate);
        currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
            const day = toDayEpoch(sortedDates[i]);
            if (day === expectedDay - 1) {
                currentStreak++;
                expectedDay = day;
            } else {
                break;
            }
        }
        return currentStreak;
    };

    const toggleHabit = (id) => {
        const today = getLocalToday();

        setHabits(habits.map(habit => {
            if (habit.id !== id) return habit;

            const isCompletedToday = habit.completedDates.includes(today);
            let newCompletedDates;

            if (isCompletedToday) {
                newCompletedDates = habit.completedDates.filter(d => d !== today);
            } else {
                newCompletedDates = [...habit.completedDates, today];
            }

            const newStreak = calculateStreak(newCompletedDates);

            return {
                ...habit,
                completedDates: newCompletedDates,
                streak: newStreak,
                bestStreak: Math.max(newStreak, habit.bestStreak)
            };
        }));
    };

    const deleteHabit = (id) => {
        if (window.confirm('Delete this habit?')) {
            setHabits(habits.filter(h => h.id !== id));
        }
    };

    const getCompletionRate = () => {
        if (habits.length === 0) return 0;
        const today = getLocalToday();
        const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
        return Math.round((completedCount / habits.length) * 100);
    };

    return (
        <div className="habit-container">
            {/* Header Stats */}
            <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: '24px',
                padding: 'clamp(1.5rem, 4vw, 2rem)',
                color: 'white',
                marginBottom: '2rem',
                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 'bold', margin: 0 }}>Daily Progress</h2>
                            <p style={{ opacity: 0.9, margin: 0, fontSize: '0.9rem' }}>Consistency is key!</p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.5rem 1rem',
                            borderRadius: '12px',
                            backdropFilter: 'blur(4px)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${getCompletionRate()}%` }}
                                style={{ height: '100%', background: 'white', borderRadius: '4px' }}
                            />
                        </div>
                        <span style={{ fontWeight: 'bold' }}>{getCompletionRate()}%</span>
                    </div>
                </div>
            </div>

            {/* Add Habit Form */}
            <form onSubmit={addHabit} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="New habit (e.g., Read 30 mins)"
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        outline: 'none',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                />
                <button
                    type="submit"
                    disabled={!newHabit.trim()}
                    style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        width: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        flexShrink: 0
                    }}
                >
                    <Plus size={24} />
                </button>
            </form>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {/* Could add filters here later: All, Completed, Pending */}
            </div>

            {/* Habits List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                    {habits.map(habit => {
                        const isCompleted = habit.completedDates.includes(getLocalToday());
                        return (
                            <motion.div
                                key={habit.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                style={{
                                    background: isCompleted ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-card)',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    border: isCompleted ? '1px solid var(--color-primary)' : '1px solid var(--border-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <button
                                    onClick={() => toggleHabit(habit.id)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        border: isCompleted ? 'none' : '2px solid var(--text-muted)',
                                        background: isCompleted ? 'var(--color-primary)' : 'transparent',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        flexShrink: 0
                                    }}
                                >
                                    {isCompleted && <Check size={18} />}
                                </button>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                                        transition: 'all 0.3s',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {habit.name}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: habit.streak > 2 ? '#f59e0b' : 'inherit', fontWeight: habit.streak > 2 ? 'bold' : 'normal' }}>
                                            <Flame size={14} fill={habit.streak > 2 ? '#f59e0b' : 'none'} /> {habit.streak} day streak
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteHabit(habit.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        opacity: 0.5,
                                        transition: 'opacity 0.2s'
                                    }}
                                    className="delete-button"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {habits.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <div style={{ background: 'var(--bg-card)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Calendar size={32} />
                        </div>
                        <p>No habits yet. Start small today!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitTracker;
