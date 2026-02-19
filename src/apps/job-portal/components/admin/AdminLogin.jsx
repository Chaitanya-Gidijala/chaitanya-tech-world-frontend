import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { login } from '../../services/authService';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(credentials.usernameOrEmail, credentials.password);
            navigate('/job-portal/admin/dashboard');
        } catch (err) {
            setError('Invalid username or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="jp-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{
                    padding: '3rem',
                    maxWidth: '450px',
                    width: '90%',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--jp-primary)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: 'white'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Access</h2>
                    <p style={{ color: 'var(--jp-text-muted)' }}>Sign in to manage job listings</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={18} />
                        <input
                            type="text"
                            name="usernameOrEmail"
                            placeholder="Username or Email"
                            className="jp-search-field"
                            value={credentials.usernameOrEmail}
                            onChange={handleChange}
                            required
                            style={{
                                paddingLeft: '3rem',
                                background: 'var(--jp-bg-secondary)',
                                borderRadius: '12px',
                                border: '1px solid var(--jp-border)',
                                height: '50px'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--jp-text-muted)' }} size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="jp-search-field"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={{
                                paddingLeft: '3rem',
                                background: 'var(--jp-bg-secondary)',
                                borderRadius: '12px',
                                border: '1px solid var(--jp-border)',
                                height: '50px'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="jp-search-btn"
                        style={{
                            width: '100%',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            marginTop: '1rem'
                        }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>
                    Protected by Spring Security & JWT
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
