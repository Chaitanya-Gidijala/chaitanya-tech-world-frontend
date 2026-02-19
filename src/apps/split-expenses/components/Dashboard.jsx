import React, { useMemo } from 'react';
import { splitExpensesConfig } from '../../../config/splitExpensesConfig';
import { motion } from 'framer-motion';
import { PieChart, List, TrendingUp, MessageCircle, AlertCircle } from 'lucide-react';

const Dashboard = ({ expenses, users }) => {
    const { currency, categories } = splitExpensesConfig;

    // --- Calculations ---

    // 1. Total Spending
    const totalSpending = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

    // 2. Category Breakdown
    const categoryStats = useMemo(() => {
        const stats = {};
        expenses.forEach(e => {
            stats[e.category] = (stats[e.category] || 0) + e.amount;
        });
        return Object.entries(stats)
            .map(([catId, amount]) => ({
                id: catId,
                amount,
                label: categories.find(c => c.id === catId)?.label || catId,
                percentage: (amount / totalSpending) * 100
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [expenses, totalSpending, categories]);

    // 3. Balance Calculation (Who owes whom)
    const balances = useMemo(() => {
        const balances = {};
        // Initialize 0
        users.forEach(u => {
            const uId = typeof u === 'string' ? u : u.id;
            balances[uId] = 0;
        });

        expenses.forEach(expense => {
            const paidBy = expense.payer;
            const amount = expense.amount;
            const splitCount = expense.involved.length;
            const splitAmount = amount / splitCount;

            // Payer gets positive balance (they are owed money)
            balances[paidBy] = (balances[paidBy] || 0) + amount;

            // Involved people lose balance (they owe money)
            expense.involved.forEach(personId => {
                balances[personId] = (balances[personId] || 0) - splitAmount;
            });
        });

        return balances;
    }, [expenses, users]);

    // 4. Simplified Debts (Greedy algorithm for "Who pays whom")
    const simplifiedDebts = useMemo(() => {
        const debts = [];
        let debtors = [];
        let creditors = [];

        Object.entries(balances).forEach(([user, amount]) => {
            if (amount < -0.01) debtors.push({ user, amount });
            if (amount > 0.01) creditors.push({ user, amount });
        });

        debtors.sort((a, b) => a.amount - b.amount);
        creditors.sort((a, b) => b.amount - a.amount);

        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];
            const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

            debts.push({
                from: debtor.user,
                to: creditor.user,
                amount: parseFloat(amount.toFixed(2))
            });

            debtor.amount += amount;
            creditor.amount -= amount;

            if (Math.abs(debtor.amount) < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }

        return debts;
    }, [balances]);

    // Helper to get User Name and Phone
    const getUserDetails = (id) => {
        const user = users.find(u => (typeof u === 'string' ? u : u.id) === id);
        if (!user) return { name: 'Unknown', phone: '' };
        return typeof user === 'string' ? { name: user, phone: '' } : { name: user.name, phone: user.phone };
    };

    const getWhatsAppReminderLink = (debt) => {
        const fromDetails = getUserDetails(debt.from);
        const toDetails = getUserDetails(debt.to);

        // If the 'from' user has a phone number, we can send a message TO them
        if (fromDetails.phone) {
            const text = `Hi ${fromDetails.name}, just a reminder that you owe ${toDetails.name} ${currency}${debt.amount} for our shared expenses.`;
            return `https://wa.me/${fromDetails.phone}?text=${encodeURIComponent(text)}`;
        }
        return null;
    };

    // Notify All Handler
    const handleNotifyAll = () => {
        simplifiedDebts.forEach((debt) => {
            const link = getWhatsAppReminderLink(debt);
            if (link) {
                window.open(link, '_blank');
            }
        });
    };

    // Format Date Helper
    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Top Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Balances / Settle Up */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'hsla(var(--primary-base), 100%, 60%, 0.1)', padding: '0.6rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
                                <TrendingUp size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Settlements</h3>
                        </div>
                    </div>

                    {simplifiedDebts.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                            <p>All settled up! 🎉</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Bulk Actions Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Detected Debts</span>
                                <button
                                    onClick={handleNotifyAll}
                                    style={{
                                        fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                                        fontWeight: '600',
                                        color: '#fff',
                                        background: '#25D366',
                                        padding: 'clamp(0.3rem, 1vw, 0.4rem) clamp(0.6rem, 2vw, 0.8rem)',
                                        borderRadius: '50px',
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                        border: 'none', cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                                    }}
                                >
                                    <MessageCircle size={14} /> Notify All
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {simplifiedDebts.map((debt, idx) => {
                                    const from = getUserDetails(debt.from);
                                    const to = getUserDetails(debt.to);
                                    const waLink = getWhatsAppReminderLink(debt);

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '1rem', borderRadius: '12px', background: 'var(--bg-body)', position: 'relative',
                                                flexWrap: 'wrap', gap: '0.5rem' // Allow wrapping on small screens
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, minWidth: 0 }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff6b6b', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                                    {from.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>owes {to.name}</span>
                                                    <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{currency}{debt.amount}</span>
                                                </div>
                                            </div>

                                            {waLink ? (
                                                <a
                                                    href={waLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: '#fff',
                                                        background: '#25D366',
                                                        padding: 'clamp(4px, 1.5vw, 6px) clamp(8px, 2vw, 12px)',
                                                        borderRadius: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                                                        fontWeight: '600',
                                                        textDecoration: 'none',
                                                        transition: 'transform 0.2s',
                                                        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                                                    }}
                                                >
                                                    <MessageCircle size={16} /> Notify
                                                </a>
                                            ) : (
                                                <div title="No phone number" style={{ opacity: 0.3, padding: '8px' }}><AlertCircle size={20} /></div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Spending Insights */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'hsla(var(--primary-base), 100%, 60%, 0.1)', padding: '0.6rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
                            <PieChart size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Breakdown</h3>
                    </div>

                    {categoryStats.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No data yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {categoryStats.map(cat => (
                                <div key={cat.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                        <span>{cat.label}</span>
                                        <span style={{ fontWeight: '600' }}>{currency}{cat.amount}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.percentage}%` }}
                                            transition={{ duration: 1 }}
                                            style={{ height: '100%', background: 'var(--gradient-brand)', borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'hsla(var(--primary-base), 100%, 60%, 0.1)', padding: '0.6rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
                        <List size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Recent Activity</h3>
                </div>

                {expenses.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No expenses recorded.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {expenses.slice().reverse().map(expense => { // Show newest first
                            const payerName = getUserDetails(expense.payer).name;
                            return (
                                <div key={expense.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1rem', borderBottom: '1px solid var(--border-light)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '12px',
                                            background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', color: 'var(--text-main)', border: '1px solid var(--border-light)'
                                        }}>
                                            <span style={{ fontSize: '0.9rem' }}>{formatDate(expense.date).split(' ')[1]}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{formatDate(expense.date).split(' ')[0]}</span>
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{expense.description}</h4>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payerName} paid for {expense.involved.length} people</span>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                                        {currency}{expense.amount}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;
