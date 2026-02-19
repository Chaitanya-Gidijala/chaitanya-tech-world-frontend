import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Phone, Users, AlertCircle } from 'lucide-react';
import '../SplitExpenses.css';

const AVATAR_COLORS = [
    '#6366f1', '#ec4899', '#14b8a6', '#f59e0b',
    '#8b5cf6', '#22c55e', '#ef4444', '#3b82f6',
];
const avatarColor = (str) =>
    AVATAR_COLORS[(str?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const validateIndianPhone = (p) =>
    /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/.test(p);

const GroupManage = ({ users, onAddUser, onRemoveUser }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const trimName = name.trim();
        const trimPhone = phone.trim();
        if (!trimName) return;
        if (trimPhone && !validateIndianPhone(trimPhone)) {
            setError('Please enter a valid Indian phone number (10 digits starting with 6-9).');
            return;
        }
        onAddUser({ id: Date.now().toString(), name: trimName, phone: trimPhone });
        setName(''); setPhone('');
    };

    const getUserName = (u) => typeof u === 'string' ? u : u.name;
    const getUserPhone = (u) => typeof u === 'object' ? u.phone : '';
    const getUserKey = (u) => typeof u === 'string' ? u : u.id;

    return (
        <div className="se-group-wrap">
            <div className="se-card">
                {/* Header */}
                <div className="se-card-header">
                    <div className="se-card-header-left">
                        <div className="se-card-icon"><Users size={20} strokeWidth={1.8} /></div>
                        <h3 className="se-card-title">
                            Group Members
                            {users.length > 0 && (
                                <span style={{
                                    marginLeft: '0.6rem',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    color: 'var(--color-primary)',
                                    background: 'hsla(260,100%,65%,0.12)',
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: '50px',
                                }}>
                                    {users.length}
                                </span>
                            )}
                        </h3>
                    </div>
                </div>

                {/* Add member form */}
                {error && (
                    <div className="se-error-msg">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}
                <form className="se-add-member-form" onSubmit={handleSubmit}>
                    <div className="se-field">
                        <label className="se-label">Name *</label>
                        <input
                            type="text"
                            className="se-input"
                            placeholder="e.g. Alice"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="se-field">
                        <label className="se-label">Phone (optional)</label>
                        <div className="se-input-icon-wrap">
                            <Phone size={16} className="se-input-icon" />
                            <input
                                type="tel"
                                className={`se-input se-input-with-icon ${error ? 'se-input-error' : ''}`}
                                placeholder="+91 XXXXX XXXXX"
                                value={phone}
                                onChange={e => { setPhone(e.target.value); setError(''); }}
                            />
                        </div>
                    </div>
                    <div className="se-field">
                        <label className="se-label" style={{ visibility: 'hidden' }}>Add</label>
                        <button type="submit" className="se-add-member-btn" disabled={!name.trim()}>
                            <UserPlus size={17} /> Add
                        </button>
                    </div>
                </form>

                {/* Members grid */}
                {users.length === 0 ? (
                    <div className="se-empty" style={{ padding: '2.5rem 1rem' }}>
                        <Users size={36} color="var(--text-muted)" />
                        <span>No members yet.</span>
                        <span style={{ fontSize: '0.82rem' }}>Add people above to start splitting expenses!</span>
                    </div>
                ) : (
                    <div className="se-members-grid">
                        <AnimatePresence>
                            {users.map(u => {
                                const uName = getUserName(u);
                                const uPhone = getUserPhone(u);
                                const uKey = getUserKey(u);
                                return (
                                    <motion.div
                                        key={uKey}
                                        initial={{ opacity: 0, scale: 0.88 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                                        className="se-member-card"
                                    >
                                        <div className="se-member-info">
                                            <div
                                                className="se-avatar"
                                                style={{ background: avatarColor(uName) }}
                                            >
                                                {uName.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p className="se-member-name">{uName}</p>
                                                {uPhone && (
                                                    <p className="se-member-phone">
                                                        <Phone size={10} /> {uPhone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className="se-remove-btn"
                                            onClick={() => onRemoveUser(u)}
                                            title="Remove member"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupManage;
