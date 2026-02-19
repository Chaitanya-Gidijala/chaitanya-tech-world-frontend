import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Users } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import GroupManage from './components/GroupManage';
import { getStoredExpenses, getStoredUsers, saveExpenses, saveUsers } from './utils/storage';
import { splitExpensesConfig } from '../../config/splitExpensesConfig';
import LandingFooter from '../../components/LandingFooter';
import './SplitExpensesApp.css';

const SplitExpensesApp = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load Data
    useEffect(() => {
        setUsers(getStoredUsers());
        setExpenses(getStoredExpenses());
    }, []);

    // Save Helpers
    const handleAddUser = (name) => {
        if (users.includes(name)) return;
        const newUsers = [...users, name];
        setUsers(newUsers);
        saveUsers(newUsers);
    };

    const handleRemoveUser = (name) => {
        const newUsers = users.filter(u => u !== name);
        setUsers(newUsers);
        saveUsers(newUsers);
    };

    const handleAddExpense = (expense) => {
        const newExpenses = [...expenses, expense];
        setExpenses(newExpenses);
        saveExpenses(newExpenses);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)', padding: 'clamp(1rem, 3vw, 2rem) 0' }}>
            <div className="container" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)' }}>
                <header style={{ marginBottom: 'clamp(1.5rem, 4vw, 3rem)', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '800', marginBottom: '0.5rem' }}>
                        Split <span className="text-gradient">Expenses</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>Minimalist expense sharing with friends.</p>
                </header>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'clamp(0.5rem, 2vw, 1rem)',
                    marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
                    background: 'var(--bg-card)',
                    padding: 'clamp(0.4rem, 1vw, 0.5rem)',
                    borderRadius: '50px',
                    width: 'fit-content',
                    margin: '0 auto clamp(1.5rem, 4vw, 3rem) auto',
                    border: '1px solid var(--border-light)',
                    flexWrap: 'wrap',
                    maxWidth: '100%'
                }}>
                    <TabButton id="dashboard" label="Overview" icon={LayoutDashboard} active={activeTab} set={setActiveTab} />
                    <TabButton id="add" label="Add Expense" icon={PlusCircle} active={activeTab} set={setActiveTab} />
                    <TabButton id="group" label="Group" icon={Users} active={activeTab} set={setActiveTab} />
                </div>

                {/* Main Content - Centered Dashboard */}
                {activeTab === 'dashboard' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ maxWidth: '1200px', margin: '0 auto' }}
                    >
                        <Dashboard expenses={expenses} users={users} />
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ maxWidth: '800px', margin: '0 auto' }}
                        >
                            {activeTab === 'add' && <AddExpense users={users} onAddExpense={handleAddExpense} />}
                            {activeTab === 'group' && <GroupManage users={users} onAddUser={handleAddUser} onRemoveUser={handleRemoveUser} />}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon: Icon, active, set }) => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 480);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 480);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <button
            onClick={() => set(id)}
            className="tab-button"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.3rem, 1vw, 0.5rem)',
                padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '50px',
                background: active === id ? 'var(--color-primary)' : 'transparent',
                color: active === id ? '#fff' : 'var(--text-muted)',
                fontWeight: '600',
                transition: 'all 0.3s',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                whiteSpace: 'nowrap'
            }}
        >
            <Icon size={isSmallScreen ? 16 : 18} />
            {!isSmallScreen && <span>{label}</span>}
        </button>
    );
};
export default SplitExpensesApp;
