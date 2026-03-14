import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { login } from '../../services/authService';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            if (error === 'Please verify that you are human.') setError('');
        }, 1200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isVerified) {
            setError('Please verify that you are human.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await login(credentials.usernameOrEmail, credentials.password);
            navigate('/job-portal/admin/dashboard');
        } catch (err) {
            setError('Invalid username or email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: '#2b2b36'
        }}>
            {/* Left Panel - Branding (Hidden on mobile) */}
            {!isMobile && (
                <div style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #2b32b2 0%, #1488cc 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    color: 'white'
                }}>
                    {/* Decorative Elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        style={{ position: 'absolute', top: '20%', left: '10%', opacity: 0.1 }}
                    >
                        <ShieldCheck size={120} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        style={{ position: 'absolute', bottom: '15%', right: '15%', opacity: 0.1 }}
                    >
                        <Lock size={150} />
                    </motion.div>
                    
                    <div style={{ textAlign: 'center', zIndex: 10, maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}>
                                <ShieldCheck size={40} color="#fff" />
                            </div>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
                            Hello! Welcome to the Admin platform
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem' }}>
                            Securely manage your data and operations from one powerful interface.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Don't have an account yet?</span>
                            <button style={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '12px 32px',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => Object.assign(e.target.style, { background: 'rgba(255,255,255,0.3)', transform: 'translateY(-2px)' })}
                                onMouseLeave={(e) => Object.assign(e.target.style, { background: 'rgba(255,255,255,0.2)', transform: 'translateY(0)' })}
                                onClick={() => navigate('/contact')}
                            >
                                Request Access
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Right Panel - Login Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backgroundColor: '#2b2b36',
                position: 'relative'
            }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
                        <ShieldCheck size={28} color="#4facfe" />
                        <span style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '1px' }}>
                            Admin<span style={{ color: '#4facfe' }}>Portal</span>
                        </span>
                    </div>

                    <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
                        Sign In
                    </h2>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                padding: '1rem',
                                borderRadius: '8px',
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

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        
                        {/* Username/Email Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '0',
                                top: '0',
                                bottom: '0',
                                width: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRight: '1px solid rgba(255,255,255,0.1)',
                                color: '#8a8a98'
                            }}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="usernameOrEmail"
                                placeholder="Login or email *"
                                value={credentials.usernameOrEmail}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    padding: '14px 14px 14px 55px',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => Object.assign(e.target.style, { borderColor: '#4facfe' })}
                                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.1)' })}
                            />
                        </div>

                        {/* Password Input */}
                        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', padding: '0 5px' }}>
                                <span style={{ color: '#8a8a98', fontSize: '0.8rem' }}>Password * <span style={{ opacity: 0.7 }}>(must contain at least 8 symbols)</span></span>
                                <a href="#" style={{ color: '#4facfe', fontSize: '0.8rem', textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '0',
                                    bottom: '0',
                                    width: '45px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRight: '1px solid rgba(255,255,255,0.1)',
                                    color: '#8a8a98'
                                }}>
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '6px',
                                        padding: '14px 50px 14px 55px',
                                        color: 'white',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s ease'
                                    }}
                                    onFocus={(e) => Object.assign(e.target.style, { borderColor: '#4facfe' })}
                                    onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.1)' })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#8a8a98',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Verification Bar */}
                        <div 
                            onClick={handleVerify}
                            style={{
                                background: 'white',
                                borderRadius: '6px',
                                padding: '12px 15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: isVerified ? 'default' : 'pointer',
                                marginTop: '1rem',
                                border: isVerified ? '1px solid #10b981' : '1px solid transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {isVerifying ? (
                                    <Loader2 size={24} className="animate-spin" color="#4facfe" />
                                ) : isVerified ? (
                                    <CheckCircle size={24} color="#10b981" />
                                ) : (
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: '2px solid #e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4facfe' }}></div>
                                    </div>
                                )}
                                <span style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                    {isVerified ? 'Verification successful' : 'Click to verify'}
                                </span>
                            </div>
                            <div style={{ color: '#cbd5e1' }}>
                                {/* Mock logo for verification provider */}
                                <ShieldCheck size={20} />
                            </div>
                        </div>

                        <p style={{ color: '#8a8a98', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            By clicking "Sign In" button, you agree to our <a href="#" style={{ color: '#4facfe', textDecoration: 'none' }}>Terms of use</a>
                        </p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isVerified}
                            style={{
                                background: isVerified ? 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' : '#4a4a5a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '15px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: (isLoading || !isVerified) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginTop: '0.5rem',
                                opacity: (isLoading || !isVerified) ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading && isVerified) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 10px 20px rgba(79, 172, 254, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading && isVerified) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

