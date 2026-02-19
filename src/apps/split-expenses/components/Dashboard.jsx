import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, PieChart, List, MessageCircle,
    AlertCircle, CheckCircle2, IndianRupee, Users, Activity
} from 'lucide-react';
import { splitExpensesConfig } from '../../../config/splitExpensesConfig';
import '../SplitExpenses.css';

/* Avatar colour palette */
const AVATAR_COLORS = [
    '#6366f1', '#ec4899', '#14b8a6', '#f59e0b',
    '#8b5cf6', '#22c55e', '#ef4444', '#3b82f6',
];
const avatarColor = (str) =>
    AVATAR_COLORS[(str?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const Dashboard = ({ expenses, users }) => {
    const { currency, categories } = splitExpensesConfig;

    /* ── Calculations (identical logic, preserved) ── */
    const totalSpending = useMemo(
        () => expenses.reduce((sum, e) => sum + e.amount, 0),
        [expenses]
    );

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
                percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [expenses, totalSpending, categories]);

    const balances = useMemo(() => {
        const bal = {};
        users.forEach(u => { bal[typeof u === 'string' ? u : u.id] = 0; });
        expenses.forEach(expense => {
            const s = expense.amount / expense.involved.length;
            bal[expense.payer] = (bal[expense.payer] || 0) + expense.amount;
            expense.involved.forEach(p => { bal[p] = (bal[p] || 0) - s; });
        });
        return bal;
    }, [expenses, users]);

    const simplifiedDebts = useMemo(() => {
        const debts = [];
        let debtors = [], creditors = [];
        Object.entries(balances).forEach(([user, amount]) => {
            if (amount < -0.01) debtors.push({ user, amount });
            if (amount > 0.01) creditors.push({ user, amount });
        });
        debtors.sort((a, b) => a.amount - b.amount);
        creditors.sort((a, b) => b.amount - a.amount);
        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const d = debtors[i], c = creditors[j];
            const amt = Math.min(Math.abs(d.amount), c.amount);
            debts.push({ from: d.user, to: c.user, amount: parseFloat(amt.toFixed(2)) });
            d.amount += amt; c.amount -= amt;
            if (Math.abs(d.amount) < 0.01) i++;
            if (c.amount < 0.01) j++;
        }
        return debts;
    }, [balances]);

    const getUserDetails = (id) => {
        const u = users.find(u => (typeof u === 'string' ? u : u.id) === id);
        if (!u) return { name: id || 'Unknown', phone: '' };
        return typeof u === 'string' ? { name: u, phone: '' } : { name: u.name, phone: u.phone };
    };

    const getWhatsAppLink = (debt) => {
        const from = getUserDetails(debt.from);
        const to = getUserDetails(debt.to);
        if (!from.phone) return null;
        const text = `Hi ${from.name}, just a reminder that you owe ${to.name} ${currency}${debt.amount} for shared expenses.`;
        return `https://wa.me/${from.phone}?text=${encodeURIComponent(text)}`;
    };

    const handleNotifyAll = () =>
        simplifiedDebts.forEach(d => { const l = getWhatsAppLink(d); if (l) window.open(l, '_blank'); });

    const formatDate = (iso) => {
        if (!iso) return { day: '—', mon: '—' };
        const d = new Date(iso);
        return {
            day: d.toLocaleDateString('en-IN', { day: 'numeric' }),
            mon: d.toLocaleDateString('en-IN', { month: 'short' }),
        };
    };

    const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <div className="se-dashboard">

            {/* ── Quick stats strip ── */}
            <motion.div
                className="se-stats-strip"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden" animate="visible"
            >
                {[
                    { Icon: IndianRupee, label: 'Total Spent', value: `${currency}${totalSpending.toFixed(0)}`, sub: `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}` },
                    { Icon: Users, label: 'Group Size', value: users.length, sub: 'members active' },
                    { Icon: Activity, label: 'Settlements', value: simplifiedDebts.length, sub: 'pending transfers' },
                ].map(({ Icon, label, value, sub }) => (
                    <motion.div key={label} variants={fade} className="se-stat-card">
                        <div className="se-stat-label">
                            <Icon size={13} /> {label}
                        </div>
                        <div className="se-stat-value">{value}</div>
                        <div className="se-stat-sub">{sub}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Main 2-col row ── */}
            <div className="se-dash-row">

                {/* Settlements */}
                <motion.div
                    className="se-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="se-card-header">
                        <div className="se-card-header-left">
                            <div className="se-card-icon"><TrendingUp size={20} strokeWidth={1.8} /></div>
                            <h3 className="se-card-title">Settlements</h3>
                        </div>
                        {simplifiedDebts.length > 0 && (
                            <button className="se-notify-all-btn" onClick={handleNotifyAll}>
                                <MessageCircle size={13} /> Notify All
                            </button>
                        )}
                    </div>

                    {simplifiedDebts.length === 0 ? (
                        <div className="se-empty">
                            <CheckCircle2 size={36} color="#22c55e" />
                            <div className="se-settled-badge">
                                <CheckCircle2 size={15} /> All settled up!
                            </div>
                            <span style={{ fontSize: '0.85rem' }}>No payments needed right now.</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {simplifiedDebts.map((debt, i) => {
                                const from = getUserDetails(debt.from);
                                const to = getUserDetails(debt.to);
                                const link = getWhatsAppLink(debt);
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="se-settlement-item"
                                    >
                                        <div className="se-settlement-left">
                                            <div className="se-avatar" style={{ background: avatarColor(from.name) }}>
                                                {from.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="se-settlement-text">
                                                <p className="se-settlement-name">{from.name}</p>
                                                <p className="se-settlement-sub">owes → {to.name}</p>
                                            </div>
                                        </div>
                                        <span className="se-settlement-amount">{currency}{debt.amount}</span>
                                        {link
                                            ? <a href={link} target="_blank" rel="noopener noreferrer" className="se-wa-btn">
                                                <MessageCircle size={13} /> Notify
                                            </a>
                                            : <span title="No phone" style={{ opacity: 0.3 }}><AlertCircle size={18} /></span>
                                        }
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                    className="se-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="se-card-header">
                        <div className="se-card-header-left">
                            <div className="se-card-icon"><PieChart size={20} strokeWidth={1.8} /></div>
                            <h3 className="se-card-title">Category Breakdown</h3>
                        </div>
                    </div>
                    {categoryStats.length === 0 ? (
                        <div className="se-empty">
                            <span className="se-empty-icon">📊</span>
                            <span>No data yet — add your first expense!</span>
                        </div>
                    ) : (
                        <div>
                            {categoryStats.map((cat, i) => (
                                <div key={cat.id} className="se-breakdown-item">
                                    <div className="se-breakdown-row">
                                        <span>{cat.label}</span>
                                        <span className="se-breakdown-amount">{currency}{cat.amount.toFixed(0)}</span>
                                    </div>
                                    <div className="se-breakdown-bar-bg">
                                        <motion.div
                                            className="se-breakdown-bar-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.percentage}%` }}
                                            transition={{ duration: 0.9, delay: i * 0.1 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>

            {/* ── Activity Feed ── */}
            <motion.div
                className="se-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
            >
                <div className="se-card-header">
                    <div className="se-card-header-left">
                        <div className="se-card-icon"><List size={20} strokeWidth={1.8} /></div>
                        <h3 className="se-card-title">Recent Activity</h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {expenses.length} total
                    </span>
                </div>

                {expenses.length === 0 ? (
                    <div className="se-empty">
                        <span className="se-empty-icon">🧾</span>
                        <span>No expenses recorded yet.</span>
                    </div>
                ) : (
                    <div>
                        {expenses.slice().reverse().map((exp) => {
                            const payer = getUserDetails(exp.payer).name;
                            const { day, mon } = formatDate(exp.date);
                            return (
                                <div key={exp.id} className="se-activity-item">
                                    <div className="se-activity-left">
                                        <div className="se-date-badge">
                                            <span className="se-date-day">{day}</span>
                                            <span className="se-date-mon">{mon}</span>
                                        </div>
                                        <div>
                                            <p className="se-activity-desc">{exp.description}</p>
                                            <p className="se-activity-meta">
                                                {payer} paid · split {exp.involved.length} ways
                                            </p>
                                        </div>
                                    </div>
                                    <span className="se-activity-amount">{currency}{exp.amount}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

        </div>
    );
};

export default Dashboard;
