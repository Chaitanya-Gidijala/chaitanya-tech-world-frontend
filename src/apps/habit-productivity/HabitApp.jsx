import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckSquare, Smile, Activity } from 'lucide-react';
import HabitTracker from './components/HabitTracker';
import TaskPomodoro from './components/TaskPomodoro';
import MoodTracker from './components/MoodTracker';

const HabitApp = () => {
    const [activeTab, setActiveTab] = useState('habits'); // habits | tasks | mood

    return (
        <div style={{ minHeight: '100vh', padding: 'clamp(1rem, 3vw, 2rem) 0' }}>
            <div className="container">
                {/* Header */}
                <header style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: '800', marginBottom: '0.5rem' }}>
                        Productivity <span className="text-gradient">Hub</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
                        Build habits, stay focused, and track your well-being.
                    </p>
                </header>

                {/* Navigation Pills */}
                <div style={{
                    display: 'flex', justifyContent: 'center', marginBottom: '3rem',
                    background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '50px',
                    width: 'fit-content', margin: '0 auto 3rem', border: '1px solid var(--border-light)',
                    gap: '0.5rem', flexWrap: 'wrap'
                }}>
                    <TabButton
                        id="habits"
                        label="Habits"
                        icon={Target}
                        isActive={activeTab === 'habits'}
                        onClick={() => setActiveTab('habits')}
                    />
                    <TabButton
                        id="tasks"
                        label="Tasks & Focus"
                        icon={CheckSquare}
                        isActive={activeTab === 'tasks'}
                        onClick={() => setActiveTab('tasks')}
                    />
                    <TabButton
                        id="mood"
                        label="Mood"
                        icon={Smile}
                        isActive={activeTab === 'mood'}
                        onClick={() => setActiveTab('mood')}
                    />
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ maxWidth: '1000px', margin: '0 auto' }}
                    >
                        {activeTab === 'habits' && <HabitTracker />}
                        {activeTab === 'tasks' && <TaskPomodoro />}
                        {activeTab === 'mood' && <MoodTracker />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            border: 'none',
            background: isActive ? 'var(--color-primary)' : 'transparent',
            color: isActive ? 'white' : 'var(--text-muted)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '1rem'
        }}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
);

export default HabitApp;
