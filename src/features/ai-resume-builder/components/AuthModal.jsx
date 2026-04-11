import React, { useState } from 'react';

export function AuthModal({ onClose, onSuccess }) {
    const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState('');
    const [error, setError] = useState('');

    const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (tab === 'signup' && form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        // Simulate async — replace with real auth call
        setTimeout(() => {
            setLoading(false);
            onSuccess?.({ name: form.name || form.email.split('@')[0], email: form.email });
        }, 1200);
    };

    const handleOAuth = (provider) => {
        setOauthLoading(provider);
        // Placeholder — wire up real OAuth redirect here
        setTimeout(() => {
            setOauthLoading('');
            onSuccess?.({ name: `${provider} User`, email: `user@${provider}.com`, provider });
        }, 1500);
    };

    return (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="auth-modal">
                {/* Close */}
                <button className="auth-close" onClick={onClose}>✕</button>

                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-brand-icon">✨</div>
                    <span>Chaitanya Tech World</span>
                </div>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab-btn${tab === 'signin' ? ' active' : ''}`}
                        onClick={() => { setTab('signin'); setError(''); }}
                    >Sign In</button>
                    <button
                        className={`auth-tab-btn${tab === 'signup' ? ' active' : ''}`}
                        onClick={() => { setTab('signup'); setError(''); }}
                    >Create Account</button>
                </div>

                {/* Heading */}
                <div className="auth-heading">
                    <h2>{tab === 'signin' ? 'Welcome back!' : 'Join for free'}</h2>
                    <p>{tab === 'signin'
                        ? 'Sign in to unlock premium resume templates.'
                        : 'Create a free account to access premium templates.'}
                    </p>
                </div>

                {/* OAuth Buttons */}
                <div className="auth-oauth-row">
                    <button
                        className="auth-oauth-btn auth-google"
                        onClick={() => handleOAuth('google')}
                        disabled={!!oauthLoading}
                    >
                        {oauthLoading === 'google' ? (
                            <span className="auth-spinner" />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        )}
                        Continue with Google
                    </button>
                    <button
                        className="auth-oauth-btn auth-github"
                        onClick={() => handleOAuth('github')}
                        disabled={!!oauthLoading}
                    >
                        {oauthLoading === 'github' ? (
                            <span className="auth-spinner" />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                        )}
                        Continue with GitHub
                    </button>
                </div>

                <div className="auth-divider"><span>or continue with email</span></div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {tab === 'signup' && (
                        <div className="auth-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={f('name')}
                                placeholder="Chaitanya Gidijala"
                                required
                            />
                        </div>
                    )}
                    <div className="auth-field">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={f('email')}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={f('password')}
                            placeholder="Min. 8 characters"
                            minLength={8}
                            required
                        />
                    </div>
                    {tab === 'signup' && (
                        <div className="auth-field">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={form.confirm}
                                onChange={f('confirm')}
                                placeholder="Re-enter password"
                                required
                            />
                        </div>
                    )}
                    {error && <div className="auth-error">{error}</div>}
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? <span className="auth-spinner" /> : (tab === 'signin' ? 'Sign In' : 'Create My Account')}
                    </button>
                </form>

                {/* Footer */}
                <p className="auth-footer-note">
                    {tab === 'signin'
                        ? <>Don't have an account? <button onClick={() => setTab('signup')}>Sign up free</button></>
                        : <>Already have an account? <button onClick={() => setTab('signin')}>Sign in</button></>
                    }
                </p>
                <p className="auth-terms">By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
            </div>
        </div>
    );
}
