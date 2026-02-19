import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle, Circle, Plus, Trash2, Clock, Flag } from 'lucide-react';

const TaskPomodoro = () => {
    // Task State
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('pomodoro-tasks-v2');
        return saved ? JSON.parse(saved) : [];
    });
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('medium'); // low, medium, high

    // Timer State
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // Timer Persistence Ref (to avoid constant re-renders from polling)
    const endTimeRef = useRef(null);

    // Persist Tasks
    useEffect(() => {
        localStorage.setItem('pomodoro-tasks-v2', JSON.stringify(tasks));
    }, [tasks]);

    // Initialize Timer from LocalStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('pomodoro-timer-state');
        if (savedState) {
            const { endTime, active, savedMode, remaining } = JSON.parse(savedState);
            setMode(savedMode);

            if (active && endTime) {
                const now = Date.now();
                const diff = Math.ceil((endTime - now) / 1000);
                if (diff > 0) {
                    setTimeLeft(diff);
                    setIsActive(true);
                    endTimeRef.current = endTime;
                } else {
                    // Timer finished while away
                    setTimeLeft(0);
                    setIsActive(false);
                    // Could notify user here
                }
            } else {
                // Paused state
                setTimeLeft(remaining || (savedMode === 'focus' ? 25 * 60 : 5 * 60));
                setIsActive(false);
            }
        }
    }, []);

    // Timer Tick & Persistence Loop
    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            // Retrieve end time or set it if missing (recovery)
            if (!endTimeRef.current) {
                endTimeRef.current = Date.now() + timeLeft * 1000;
            }

            interval = setInterval(() => {
                const now = Date.now();
                const diff = Math.ceil((endTimeRef.current - now) / 1000);

                if (diff <= 0) {
                    setTimeLeft(0);
                    setIsActive(false);
                    endTimeRef.current = null;
                    // Auto-switch mode logic could go here or wait for user
                    alert(mode === 'focus' ? 'Focus session complete!' : 'Break over!');
                    saveTimerState(false, 0, mode); // Clear running state
                } else {
                    setTimeLeft(diff);
                    // Save running state periodically or on change? 
                    // Saving on every tick is expensive for IO, but fine for localStorage.
                    // Doing it less frequently or on unmount is better, but this ensures crash recovery.
                    // Let's rely on state change for saving via another effect or just update helper.
                }
            }, 1000);
        } else if (!isActive) {
            endTimeRef.current = null;
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    // Save timer state whenever significant things change
    const saveTimerState = (active, remaining, currentMode) => {
        const state = {
            endTime: active ? Date.now() + remaining * 1000 : null,
            active,
            remaining,
            savedMode: currentMode
        };
        localStorage.setItem('pomodoro-timer-state', JSON.stringify(state));
    };

    const toggleTimer = () => {
        const newActive = !isActive;
        setIsActive(newActive);
        if (newActive) {
            endTimeRef.current = Date.now() + timeLeft * 1000;
        }
        saveTimerState(newActive, timeLeft, mode);
    };

    const resetTimer = () => {
        setIsActive(false);
        const newTime = mode === 'focus' ? 25 * 60 : 5 * 60;
        setTimeLeft(newTime);
        endTimeRef.current = null;
        saveTimerState(false, newTime, mode);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        const newTime = newMode === 'focus' ? 25 * 60 : 5 * 60;
        setTimeLeft(newTime);
        endTimeRef.current = null;
        saveTimerState(false, newTime, newMode);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Task Logic
    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([{
            id: Date.now(),
            text: newTask.trim(),
            completed: false,
            priority
        }, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Left: Timer */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <div style={{
                    display: 'flex', gap: '0.5rem',
                    background: 'var(--bg-body)', padding: '0.5rem', borderRadius: '50px',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => switchMode('focus')}
                        style={{
                            padding: '0.5rem 1.5rem', borderRadius: '50px', border: 'none', fontWeight: '600', cursor: 'pointer',
                            background: mode === 'focus' ? 'var(--color-primary)' : 'transparent',
                            color: mode === 'focus' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.3s'
                        }}
                    >
                        Focus
                    </button>
                    <button
                        onClick={() => switchMode('break')}
                        style={{
                            padding: '0.5rem 1.5rem', borderRadius: '50px', border: 'none', fontWeight: '600', cursor: 'pointer',
                            background: mode === 'break' ? '#10b981' : 'transparent',
                            color: mode === 'break' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.3s'
                        }}
                    >
                        Break
                    </button>
                </div>

                <div style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', fontWeight: '800', fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px', lineHeight: 1 }}>
                    {formatTime(timeLeft)}
                </div>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>
                    {isActive ? (mode === 'focus' ? 'Stay focused!' : 'Relax...') : 'Ready to start?'}
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={toggleTimer}
                        style={{
                            width: '64px', height: '64px', borderRadius: '50%', border: 'none',
                            background: isActive ? 'var(--bg-body)' : 'var(--color-primary)',
                            color: isActive ? 'var(--text-main)' : 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '1.2rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isActive ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                    </button>
                    <button
                        onClick={resetTimer}
                        style={{
                            width: '64px', height: '64px', borderRadius: '50%', border: 'none',
                            background: 'var(--bg-body)', color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '1.2rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>
            </div>

            {/* Right: Tasks */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle className="text-gradient" /> Tasks
                </h3>

                <form onSubmit={addTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        style={{
                            flex: 1, padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border-light)',
                            background: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', minWidth: '200px'
                        }}
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        style={{
                            padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-light)',
                            background: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer'
                        }}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <button type="submit" style={{ padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer' }}>
                        <Plus />
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, overflowY: 'auto', maxHeight: '400px', paddingRight: '0.5rem' }}>
                    <AnimatePresence>
                        {tasks.map(task => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '0.8rem', borderRadius: '12px',
                                    background: 'var(--bg-body)', opacity: task.completed ? 0.6 : 1,
                                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                                }}
                            >
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    style={{ background: 'transparent', border: 'none', color: task.completed ? '#10b981' : 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                </button>
                                <span style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>

                                {/* Priority Badge for context */}
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    background: `${getPriorityColor(task.priority)}20`,
                                    color: getPriorityColor(task.priority),
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                }}>
                                    {task.priority}
                                </span>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5 }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {tasks.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                            <Clock size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                            <p>Time to plan your day!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskPomodoro;
