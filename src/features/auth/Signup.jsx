import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, ShieldCheck, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { register, isAuthenticated, isAdmin } from '../job-portal/services/authService';
import './styles/signup.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        if (!isVerified) {
            setError('Please verify you are human.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed. Try a different email.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-clean">
            <div className="auth-card-split">
                
                {/* ── LEFT PANEL: Branded Hero (Screenshot Style) ── */}
                <div className="auth-side-branding">
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
                        
                        <h1 className="branding-title">Join the Platform</h1>
                        <p className="branding-subtitle">
                            Unlock elite AI tools, premium resume templates, and curated
                            job opportunities optimized for your career growth.
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

                {/* ── RIGHT PANEL: Logic Hub ── */}
                <div className="auth-side-form">
                    <div className="form-wrapper-clean">
                        <header className="auth-header-min">
                            <h2>Create Account</h2>
                            <p>Join thousands of professionals</p>
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
                            <span className="txt">or register manually</span>
                            <span className="line" />
                        </div>

                        {error && (
                            <div style={{ 
                                color: '#ef4444', 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                padding: '10px', 
                                borderRadius: '8px', 
                                fontSize: '0.8rem', 
                                marginBottom: '1rem',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <form className="auth-form-min" onSubmit={handleSubmit}>
                            <div className="form-group-min">
                                <label>Full Name</label>
                                <div className="input-wrap-min">
                                    <User className="input-icon" size={16} />
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group-min">
                                <label>Email Address</label>
                                <div className="input-wrap-min">
                                    <Mail className="input-icon" size={16} />
                                    <input 
                                        type="email" 
                                        name="email"
                                        placeholder="user@example.com"
                                        value={formData.email}
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
                                        type="password" 
                                        name="password"
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={`auth-verify-min ${isVerified ? 'is-verified' : ''}`} onClick={handleVerify}>
                                <div className="v-left">
                                    {isVerifying ? <Loader2 size={16} className="spin" /> : isVerified ? <CheckCircle size={16} /> : <div className="dot" />}
                                    <span>{isVerified ? 'Human Identity Verified' : 'Confirm Humanity'}</span>
                                </div>
                                <ShieldCheck size={14} />
                            </div>

                            <button className="auth-submit-min" type="submit" disabled={isLoading || !isVerified}>
                                {isLoading ? <Loader2 className="spin" size={18} /> : 'Create Account Now'}
                                {!isLoading && <ChevronRight size={16} />}
                            </button>
                        </form>

                        <footer className="auth-foot-min">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </footer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SignupPage;
