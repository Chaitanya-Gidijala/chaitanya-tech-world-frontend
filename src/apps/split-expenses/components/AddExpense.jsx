import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag, Share2, X, CalendarDays, Layers } from 'lucide-react';
import { splitExpensesConfig } from '../../../config/splitExpensesConfig';
import '../SplitExpenses.css';

const AVATAR_COLORS = [
    '#6366f1', '#ec4899', '#14b8a6', '#f59e0b',
    '#8b5cf6', '#22c55e', '#ef4444', '#3b82f6',
];
const avatarColor = (str) =>
    AVATAR_COLORS[(str?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const AddExpense = ({ users, onAddExpense }) => {
    const { currency, categories } = splitExpensesConfig;

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0].id);
    const [payer, setPayer] = useState('');
    const [involved, setInvolved] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [lastExpense, setLastExpense] = useState(null);

    const getUserId = (u) => typeof u === 'string' ? u : u.id;
    const getUserName = (u) => typeof u === 'string' ? u : u.name;

    const handleInvolvedToggle = (u) => {
        const id = getUserId(u);
        setInvolved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const selectAll = () =>
        setInvolved(involved.length === users.length ? [] : users.map(getUserId));

    const getWhatsAppLink = () => {
        if (!lastExpense) return '';
        const payerUser = users.find(u => getUserId(u) === lastExpense.payer);
        const payerName = payerUser ? getUserName(payerUser) : 'Someone';
        const split = (lastExpense.amount / lastExpense.involved.length).toFixed(2);
        const text = `💸 *New Expense Shared*\n\n"${lastExpense.description}"\nTotal: ${currency}${lastExpense.amount}\n\nPaid by: ${payerName}\nSplit: ${currency}${split} / person\n\nPlease settle up soon!`;
        return `https://wa.me/?text=${encodeURIComponent(text)}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !payer || involved.length === 0) return;
        const expense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            category,
            payer,
            involved,
            date: new Date(date).toISOString(),
        };
        onAddExpense(expense);
        setLastExpense(expense);
        setShowShareModal(true);
        setDescription(''); setAmount(''); setInvolved([]); setPayer('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const isValid = description && amount && payer && involved.length > 0;

    return (
        <div className="se-add-wrap">
            <div className="se-card">
                {/* Big amount input */}
                <div className="se-amount-hero">
                    <div className="se-amount-label">Amount</div>
                    <div className="se-amount-row">
                        <span className="se-currency-symbol">{currency}</span>
                        <input
                            type="number"
                            className="se-amount-input"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                </div>

                <form className="se-form" onSubmit={handleSubmit}>
                    {/* Description · Date · Category */}
                    <div className="se-form-row-3">
                        <div className="se-field">
                            <label className="se-label">Description</label>
                            <div className="se-input-icon-wrap">
                                <Tag size={16} className="se-input-icon" />
                                <input
                                    type="text"
                                    className="se-input se-input-with-icon"
                                    placeholder="What was this for?"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="se-field">
                            <label className="se-label">Date</label>
                            <div className="se-input-icon-wrap">
                                <CalendarDays size={16} className="se-input-icon" />
                                <input
                                    type="date"
                                    className="se-input se-input-with-icon"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="se-field">
                            <label className="se-label">Category</label>
                            <div className="se-input-icon-wrap">
                                <Layers size={16} className="se-input-icon" />
                                <select
                                    className="se-select se-input-with-icon"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Who paid */}
                    <div className="se-field">
                        <label className="se-label">Who paid?</label>
                        <div className="se-people-pills">
                            {users.length === 0
                                ? <span className="se-no-members">Add members in the Group tab first</span>
                                : users.map(u => {
                                    const id = getUserId(u);
                                    const name = getUserName(u);
                                    const sel = payer === id;
                                    return (
                                        <motion.button
                                            key={id} type="button"
                                            className={`se-person-pill ${sel ? 'selected' : ''}`}
                                            onClick={() => setPayer(id)}
                                            whileTap={{ scale: 0.94 }}
                                        >
                                            <div
                                                className="se-avatar se-avatar-sm"
                                                style={{ background: avatarColor(name) }}
                                            >
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            {name}
                                        </motion.button>
                                    );
                                })
                            }
                        </div>
                    </div>

                    {/* Split with */}
                    <div className="se-field">
                        <div className="se-people-label-row">
                            <label className="se-label">Split with</label>
                            {users.length > 0 && (
                                <button type="button" className="se-select-all-btn" onClick={selectAll}>
                                    {involved.length === users.length ? 'Clear All' : 'Select All'}
                                </button>
                            )}
                        </div>
                        <div className="se-people-pills">
                            {users.length === 0
                                ? <span className="se-no-members">No members yet</span>
                                : users.map(u => {
                                    const id = getUserId(u);
                                    const name = getUserName(u);
                                    const sel = involved.includes(id);
                                    return (
                                        <motion.button
                                            key={id} type="button"
                                            className={`se-person-pill ${sel ? 'selected' : ''}`}
                                            onClick={() => handleInvolvedToggle(u)}
                                            whileTap={{ scale: 0.94 }}
                                        >
                                            <div
                                                className="se-avatar se-avatar-sm"
                                                style={{ background: avatarColor(name) }}
                                            >
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            {name}
                                        </motion.button>
                                    );
                                })
                            }
                        </div>
                    </div>

                    {/* Per-person split preview */}
                    {amount && involved.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '0.85rem 1.25rem',
                                borderRadius: '12px',
                                background: 'hsla(260, 100%, 65%, 0.08)',
                                border: '1px solid hsla(260, 100%, 65%, 0.2)',
                                fontSize: '0.88rem',
                                color: 'var(--text-muted)',
                                textAlign: 'center',
                            }}
                        >
                            Each person pays{' '}
                            <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>
                                {splitExpensesConfig.currency}{(parseFloat(amount) / involved.length).toFixed(2)}
                            </strong>
                            {' '}— split {involved.length} ways
                        </motion.div>
                    )}

                    <button type="submit" className="se-submit-btn" disabled={!isValid}>
                        <Plus size={20} /> Add Expense
                    </button>
                </form>
            </div>

            {/* WhatsApp share toast */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="se-wa-toast"
                    >
                        <div className="se-wa-toast-header">
                            <h3 className="se-wa-toast-title">🎉 Expense Added!</h3>
                            <button className="se-wa-toast-close" onClick={() => setShowShareModal(false)}>
                                <X size={14} />
                            </button>
                        </div>
                        <p className="se-wa-toast-sub">
                            Expense split successfully. Want to notify the group on WhatsApp?
                        </p>
                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="se-wa-share-btn"
                        >
                            <Share2 size={17} /> Share on WhatsApp
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddExpense;
