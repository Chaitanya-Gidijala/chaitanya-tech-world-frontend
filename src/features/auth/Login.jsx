import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { login, isAuthenticated, isAdmin } from '../job-portal/services/authService';
import './styles/login.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            if (isAdmin()) {
                navigate('/AdminPortal/admin/dashboard', { replace: true });
            } else {
                navigate('/profile', { replace: true });
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleVerify = () => {
        if (isVerified) return;
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
        }, 1200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) return;
        setIsLoading(true);
        try {
            await login(credentials.usernameOrEmail, credentials.password);
            if (isAdmin()) {
                navigate('/AdminPortal/admin/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.message || 'Invalid login credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-clean">
            <div className="auth-card-split">

                {/* ── LEFT PANEL: Screenshot-inspired Design ── */}
                <div className="auth-side-branding">
                    {/* Decorative Background Icon */}
                    <div className="branding-decor-icon">
                        <User size={240} strokeWidth={1} />
                    </div>

                    <div className="branding-content">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="branding-logo-box"
                        >
                            C
                        </motion.div>

                        <h1 className="branding-title">Welcome Back</h1>
                        <p className="branding-subtitle">
                            Enter your credentials to access your professional dashboard
                            and continue your career journey with Find Sharp.
                        </p>

                        <div className="branding-benefit-card">
                            <div className="benefit-row">
                                <div className="benefit-check"><CheckCircle size={14} fill="white" color="var(--color-primary)" /></div>
                                <span>Global AI Resume Builder Access</span>
                            </div>
                            <div className="benefit-row">
                                <div className="benefit-check"><CheckCircle size={14} fill="white" color="var(--color-primary)" /></div>
                                <span>Advanced Career Preparation Hub</span>
                            </div>
                            <div className="benefit-row">
                                <div className="benefit-check"><CheckCircle size={14} fill="white" color="var(--color-primary)" /></div>
                                <span>Priority Support & Insights</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL: Form Area ── */}
                <div className="auth-side-form">
                    <div className="form-wrapper-clean">
                        <header className="auth-header-min">
                            <h2>Sign In</h2>
                            <p>Good to see you again!</p>
                        </header>

                        <div className="auth-oauth-min">
                            <button className="oa-btn-min">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" />
                                Google
                            </button>
                            <button className="oa-btn-min">
                                <img src="https://www.svgrepo.com/show/475654/github-color.svg" alt="GH" />
                                GitHub
                            </button>
                        </div>

                        <div className="auth-sep-min">
                            <span className="line" />
                            <span className="txt">or sign in manually</span>
                            <span className="line" />
                        </div>

                        {error && <div className="auth-err-min"><AlertCircle size={14} /> {error}</div>}

                        <form className="auth-form-min" onSubmit={handleSubmit}>
                            <div className="form-group-min">
                                <label>Email or Username</label>
                                <div className="input-wrap-min">
                                    <User className="input-icon" size={16} />
                                    <input
                                        type="text"
                                        name="usernameOrEmail"
                                        placeholder="user@example.com"
                                        value={credentials.usernameOrEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group-min">
                                <label>Password</label>
                                <div className="input-wrap-min">
                                    <Lock className="input-icon" size={16} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-pass"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className={`auth-verify-min ${isVerified ? 'is-verified' : ''}`} onClick={handleVerify}>
                                <div className="v-left">
                                    {isVerifying ? <Loader2 size={16} className="spin" /> : isVerified ? <CheckCircle size={16} /> : <div className="dot" />}
                                    <span>{isVerified ? 'Trusted Identity Verified' : 'Verify Humanity'}</span>
                                </div>
                                <ShieldCheck size={14} />
                            </div>

                            <button className="auth-submit-min" type="submit" disabled={isLoading || !isVerified}>
                                {isLoading ? <Loader2 className="spin" size={18} /> : 'Login Account'}
                                {!isLoading && <ChevronRight size={16} />}
                            </button>
                        </form>

                        <footer className="auth-foot-min">
                            Don't have an account? <Link to="/signup">Sign up free</Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
