import React, { useState } from 'react';
import { UserPlus, X, Users, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GroupManage = ({ users, onAddUser, onRemoveUser }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const validateIndianPhone = (phoneNum) => {
        // Regex for Indian phone numbers:
        // Optional country code (+91 or 91)
        // Optional space or hyphen
        // Starts with 6, 7, 8, or 9
        // Total 10 digits
        const regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
        return regex.test(phoneNum);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const trimmedPhone = phone.trim();
        const trimmedName = name.trim();

        if (trimmedName) {
            // Validate Phone if provided
            if (trimmedPhone && !validateIndianPhone(trimmedPhone)) {
                setError('Please enter a valid Indian phone number');
                return;
            }

            // Create user object instead of string
            const newUser = {
                id: Date.now().toString(),
                name: trimmedName,
                phone: trimmedPhone
            };
            onAddUser(newUser); // Parent app needs to handle object or string check
            setName('');
            setPhone('');
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    background: 'hsla(var(--primary-base), 100%, 60%, 0.1)',
                    padding: '0.75rem', borderRadius: '50%', color: 'var(--color-primary)'
                }}>
                    <Users size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Group Members</h2>
            </div>

            <form onSubmit={handleSubmit} style={{
                display: 'grid',
                gap: '1rem',
                marginBottom: '2rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
            }}>
                <div style={{ gridColumn: '1/-1' }}>
                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                            {error}
                        </p>
                    )}
                </div>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name (e.g. Alice)"
                    style={{
                        background: 'var(--bg-body)',
                        border: '1px solid var(--border-light)',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <div style={{ position: 'relative' }}>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setError('');
                        }}
                        placeholder="Phone (Optional)"
                        style={{
                            width: '100%',
                            background: 'var(--bg-body)',
                            border: error ? '1px solid #ef4444' : '1px solid var(--border-light)',
                            padding: '1rem 1rem 1rem 2.5rem',
                            borderRadius: '12px',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                    <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>

                <button
                    type="submit"
                    disabled={!name.trim()}
                    style={{
                        background: 'var(--color-primary)',
                        color: '#fff',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontWeight: '600',
                        opacity: name.trim() ? 1 : 0.5,
                        cursor: name.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <UserPlus size={20} /> Add Member
                </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                <AnimatePresence>
                    {users.map((user) => {
                        // Handle both legacy string format and new object format
                        const userName = typeof user === 'string' ? user : user.name;
                        const userPhone = typeof user === 'object' ? user.phone : '';

                        return (
                            <motion.div
                                key={typeof user === 'string' ? user : user.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-panel"
                                style={{
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'var(--bg-body)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '50%',
                                        background: `hsl(${Math.random() * 360}, 70%, 80%)`, // Dynamic avatar color
                                        color: '#333',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '1.2rem'
                                    }}>
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{userName}</span>
                                        {userPhone && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Phone size={10} /> {userPhone}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onRemoveUser(user)}
                                    title="Remove Member"
                                    style={{
                                        color: 'var(--text-muted)',
                                        padding: '6px',
                                        borderRadius: '50%',
                                        transition: 'background 0.2s',
                                        hover: { background: 'rgba(255,0,0,0.1)', color: 'red' }
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {users.length === 0 && (
                    <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        No members yet. Add people to start splitting!
                    </p>
                )}
            </div>
        </div>
    );
};

export default GroupManage;
