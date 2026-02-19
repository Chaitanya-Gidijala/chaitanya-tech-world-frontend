import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Users, Sparkles } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import GroupManage from './components/GroupManage';
import { getStoredExpenses, getStoredUsers, saveExpenses, saveUsers } from './utils/storage';
import './SplitExpenses.css';

/* ── Tab config ─────────────────────────────────────────── */
const TABS = [
    { id: 'dashboard', label: 'Overview', Icon: LayoutDashboard },
    { id: 'add', label: 'Add Expense', Icon: PlusCircle },
    { id: 'group', label: 'Group', Icon: Users },
];

const SplitExpensesApp = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [expenses, setExpenses] = useState([]);

    /* Load persisted data */
    useEffect(() => {
        setUsers(getStoredUsers());
        setExpenses(getStoredExpenses());
    }, []);

    const handleAddUser = (user) => {
        // Prevent duplicates by id or name
        const id = typeof user === 'string' ? user : user.id;
        if (users.some(u => (typeof u === 'string' ? u : u.id) === id)) return;
        const next = [...users, user];
        setUsers(next); saveUsers(next);
    };

    const handleRemoveUser = (user) => {
        const id = typeof user === 'string' ? user : user.id;
        const next = users.filter(u => (typeof u === 'string' ? u : u.id) !== id);
        setUsers(next); saveUsers(next);
    };

    const handleAddExpense = (expense) => {
        const next = [...expenses, expense];
        setExpenses(next); saveExpenses(next);
    };

    return (
        <div className="se-page">
            {/* Decorative background */}
            <div className="se-grid-bg" />
            <div className="se-orb se-orb-1" />
            <div className="se-orb se-orb-2" />

            {/* ── Hero ── */}
            <div className="container se-hero">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="se-hero-tag">
                        <Sparkles size={12} /> Split Expenses
                    </div>
                    <h1 className="se-hero-h1">
                        Split Fairly,{' '}
                        <span className="se-shimmer">Stay Friends</span>
                    </h1>
                    <p className="se-hero-sub">
                        Track shared expenses, settle debts with one tap, and notify
                        friends instantly via WhatsApp.
                    </p>
                </motion.div>
            </div>

            {/* ── Tab navigation ── */}
            <div className="container se-tabs">
                <div className="se-tabs-inner">
                    {TABS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            className={`se-tab-btn ${activeTab === id ? 'active' : ''}`}
                            onClick={() => setActiveTab(id)}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="container se-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.28 }}
                    >
                        {activeTab === 'dashboard' && (
                            <Dashboard expenses={expenses} users={users} />
                        )}
                        {activeTab === 'add' && (
                            <AddExpense users={users} onAddExpense={handleAddExpense} />
                        )}
                        {activeTab === 'group' && (
                            <GroupManage
                                users={users}
                                onAddUser={handleAddUser}
                                onRemoveUser={handleRemoveUser}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SplitExpensesApp;
