import React, { useState } from 'react';
import { Plus, Users, DollarSign, Tag, Share2, Clipboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { splitExpensesConfig } from '../../../config/splitExpensesConfig';

const AddExpense = ({ users, onAddExpense }) => {
    // Config
    const { currency, categories } = splitExpensesConfig;

    // State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0].id);
    const [payer, setPayer] = useState('');
    const [involved, setInvolved] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default today
    const [showShareModal, setShowShareModal] = useState(false);
    const [lastExpense, setLastExpense] = useState(null);

    // Handlers
    const handleInvolvedChange = (user) => {
        // Handle both string and object users for backward compatibility
        const userId = typeof user === 'string' ? user : user.id;

        setInvolved(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return [...prev, userId];
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !payer || involved.length === 0) return;

        const expense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            category,
            payer, // ID or Name depending on data
            involved, // IDs or Names
            date: new Date(date).toISOString()
        };

        onAddExpense(expense);
        setLastExpense(expense);
        setShowShareModal(true);

        // Reset
        setDescription('');
        setAmount('');
        setInvolved([]);
        setPayer('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    // Select all helper
    const selectAll = () => {
        if (involved.length === users.length) {
            setInvolved([]);
        } else {
            // Map to IDs or Names
            setInvolved(users.map(u => typeof u === 'string' ? u : u.id));
        }
    };

    // Generate WhatsApp Share Link
    const getWhatsAppLink = () => {
        if (!lastExpense) return '';
        const payerName = users.find(u => (typeof u === 'string' ? u : u.id) === lastExpense.payer);
        const name = typeof payerName === 'string' ? payerName : payerName?.name || 'Someone';
        const splitAmount = (lastExpense.amount / lastExpense.involved.length).toFixed(2);

        const text = `💸 *New Expense Shared*\n\n"${lastExpense.description}"\nTotal: ${currency}${lastExpense.amount}\n\nPaid by: ${name}\nSplit: ${currency}${splitAmount} / person\n\nPlease settle up soon!`;
        return `https://wa.me/?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>
                Add <span className="text-gradient">Expense</span>
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Large Amount Input */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                        position: 'absolute', left: '25%', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)'
                    }}>{currency}</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '2px solid var(--border-light)',
                            fontSize: '3rem',
                            fontWeight: '800',
                            textAlign: 'center',
                            width: '50%',
                            color: 'var(--text-main)',
                            outline: 'none',
                            padding: '0.5rem'
                        }}
                    />
                </div>

                {/* Description & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.8rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What was this for?"
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 2.8rem',
                                background: 'var(--bg-body)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '12px',
                                color: 'var(--text-main)',
                                fontSize: '1.1rem',
                                outline: 'none'
                            }}
                        />
                        <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--bg-body)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '12px',
                                color: 'var(--text-main)',
                                fontSize: '1rem',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            padding: '1rem',
                            background: 'var(--bg-body)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '12px',
                            color: 'var(--text-main)',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>
                </div>

                {/* Payer Selection */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Who paid?</label>
                    <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {users.map(u => {
                            const uId = typeof u === 'string' ? u : u.id;
                            const uName = typeof u === 'string' ? u : u.name;
                            const isSelected = payer === uId;

                            return (
                                <motion.button
                                    key={uId}
                                    type="button"
                                    onClick={() => setPayer(uId)}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                                        background: isSelected ? 'hsla(var(--primary-base), 100%, 60%, 0.1)' : 'var(--bg-body)',
                                        color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)',
                                        fontWeight: isSelected ? '700' : '500',
                                        minWidth: 'auto',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {uName}
                                </motion.button>
                            )
                        })}
                        {users.length === 0 && <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Add members first</span>}
                    </div>
                </div>

                {/* Involved Members */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <label style={{ fontWeight: '600', color: 'var(--text-muted)' }}>split with whom?</label>
                        <button type="button" onClick={selectAll} style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: '600' }}>
                            {involved.length === users.length ? 'Clear All' : 'Select All'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.8rem' }}>
                        {users.map(u => {
                            const uId = typeof u === 'string' ? u : u.id;
                            const uName = typeof u === 'string' ? u : u.name;
                            const isSelected = involved.includes(uId);

                            return (
                                <motion.div
                                    key={uId}
                                    onClick={() => handleInvolvedChange(u)}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                                        background: isSelected ? 'var(--color-primary)' : 'var(--bg-body)',
                                        color: isSelected ? '#fff' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {uName}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!payer || !amount || !description || involved.length === 0}
                    style={{
                        marginTop: '1rem',
                        padding: '1.2rem',
                        borderRadius: '16px',
                        background: 'var(--gradient-brand)',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        boxShadow: 'var(--shadow-glow)',
                        opacity: (!payer || !amount || !description || involved.length === 0) ? 0.5 : 1,
                        cursor: (!payer || !amount || !description || involved.length === 0) ? 'not-allowed' : 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Plus size={24} /> Add Expense
                </motion.button>

            </form>

            {/* Share Modal (Simple Inline for now) */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            background: '#25D366', /* WhatsApp Green */
                            borderRadius: '16px',
                            color: '#fff',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: '800', fontSize: '1.2rem' }}>Expense Added!</h3>
                            <button onClick={() => setShowShareModal(false)} style={{ color: '#fff' }}><X size={20} /></button>
                        </div>
                        <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Value split successfully. Notify the group now?</p>

                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#fff',
                                color: '#25D366',
                                padding: '0.8rem 2rem',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Share2 size={18} /> Share on WhatsApp
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddExpense;
