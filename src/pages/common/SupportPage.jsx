import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Heart, Coffee, Shield, Sparkles, Rocket, Users, 
    CheckCircle2, ArrowRight, Star, Coins, Zap, User, 
    Mail, Gift, RefreshCw 
} from 'lucide-react';
import { isAuthenticated, getCurrentUser } from '../../features/job-portal/services/authService';
import { useNavigate } from 'react-router-dom';
import apiConfig from '@/config/apiConfig';
import './SupportPage.css';

const SupportPage = () => {
    const [amount, setAmount] = useState('500');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            const user = getCurrentUser();
            if (user) {
                setName(user.name || '');
                setEmail(user.email || '');
            }
        }
    }, []);

    // Dynamic Razorpay Script Loader
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleSupport = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        if (!name.trim() || !email.trim()) {
            alert('Please provide your name and email to continue.');
            return;
        }

        if (!window.Razorpay) {
            alert('Razorpay SDK failed to load. Please check your internet connection.');
            return;
        }
        
        setIsProcessing(true);
        try {
            const orderResponse = await fetch(apiConfig.endpoints.payments.createOrder, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(parseFloat(amount) * 100),
                    currency: 'INR'
                })
            });

            const orderData = await orderResponse.json();
            if (orderData.error) throw new Error(orderData.error);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SiALmSsHTMvAR2',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Chaitanya Tech World',
                description: 'Support My Work',
                order_id: orderData.order_id,
                prefill: { name: name, email: email },
                theme: { color: '#6366f1' },
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch(apiConfig.endpoints.payments.verifyPayment, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                name: name,
                                email: email,
                                amount: amount,
                                itemName: 'Support Contribution',
                                itemId: 'SUPPORT_GENERAL',
                                itemType: 'SUPPORT'
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            // 🎉 Confetti blast
                            if (typeof window !== 'undefined') {
                                const colors = ['#7c3aed', '#4f46e5', '#10b981', '#f59e0b', '#ec4899'];
                                const canvas = document.createElement('canvas');
                                canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none;';
                                document.body.appendChild(canvas);
                                const ctx = canvas.getContext('2d');
                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;
                                const particles = Array.from({ length: 120 }, () => ({
                                    x: Math.random() * canvas.width,
                                    y: -10,
                                    vx: (Math.random() - 0.5) * 6,
                                    vy: Math.random() * 4 + 2,
                                    color: colors[Math.floor(Math.random() * colors.length)],
                                    size: Math.random() * 8 + 4,
                                    rot: Math.random() * 360,
                                    rotV: (Math.random() - 0.5) * 8
                                }));
                                let frame = 0;
                                const animate = () => {
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    particles.forEach(p => {
                                        p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.vy += 0.05;
                                        ctx.save();
                                        ctx.translate(p.x, p.y);
                                        ctx.rotate(p.rot * Math.PI / 180);
                                        ctx.fillStyle = p.color;
                                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
                                        ctx.restore();
                                    });
                                    frame++;
                                    if (frame < 120) requestAnimationFrame(animate);
                                    else document.body.removeChild(canvas);
                                };
                                requestAnimationFrame(animate);
                            }
                            setTimeout(() => navigate('/profile?tab=billing'), 1800);
                        } else {
                            alert("Payment successful but verification failed. Please contact support with Transaction ID: " + response.razorpay_payment_id);
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Support error:', error);
            alert('Failed to initiate support.');
        } finally {
            setIsProcessing(false);
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <div className="sp-root-v4">
            <div className="sp-ambient-bg">
                <div className="sp-blob blob-1" />
                <div className="sp-blob blob-2" />
            </div>

            <div className="container">
                {/* ── HERO SECTION ── */}
                <section className="sp-hero-v4">
                    <motion.div {...fadeInUp} className="sp-hero-inner">
                        <div className="sp-badge-v4">
                            <Heart size={14} className="text-pink-400" />
                            Supporting Independent Development
                        </div>
                        <h1 className="sp-title-v4">
                            Help Me <span className="shine-text">Build & Grow</span> Chaitanya Tech World
                        </h1>
                        <p className="sp-desc-v4">
                            Your kindness directly enables me to continue creating high-quality digital tools for the community. Every contribution is a helping hand in this journey.
                        </p>
                    </motion.div>
                </section>

                {/* ── MAIN CONTENT GRID ── */}
                <div className="sp-main-grid-v4">
                    
                    {/* LEFT: FORM SECTION */}
                    <motion.div 
                        {...fadeInUp}
                        transition={{ delay: 0.1 }}
                        className="sp-glass-panel sp-form-panel"
                    >
                        <div className="sp-panel-header">
                            <div className="sp-panel-icon"><Gift size={20} /></div>
                            <div>
                                <h3>Send Your Support</h3>
                                <p>Every bit of help matters</p>
                            </div>
                        </div>

                        <div className="sp-input-stack">
                            <div className="sp-field-group">
                                <label>Your Name</label>
                                <div className="sp-input-wrapper">
                                    <User size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sp-field-group">
                                <label>Email Address</label>
                                <div className="sp-input-wrapper">
                                    <Mail size={18} />
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sp-field-group">
                                <label>Support Amount</label>
                                <div className="sp-amount-grid">
                                    <div className="sp-input-wrapper amount-main">
                                        <span className="sp-curr">₹</span>
                                        <input 
                                            type="number" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                    <div className="sp-presets-grid">
                                        {['100', '500', '1000'].map(p => (
                                            <button 
                                                key={p}
                                                className={amount === p ? 'active' : ''}
                                                onClick={() => setAmount(p)}
                                            >
                                                ₹{p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            className="sp-submit-btn-v4"
                            onClick={handleSupport}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <RefreshCw className="animate-spin" />
                            ) : (
                                <>Help Me Grow <ArrowRight size={18} /></>
                            )}
                        </button>

                        <div className="sp-secure-badge">
                            <Shield size={12} /> Secure Payment
                        </div>
                    </motion.div>

                    {/* RIGHT: IMPACT VISUAL */}
                    <motion.div 
                        {...fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="sp-glass-panel sp-impact-panel"
                    >
                        <div className="sp-visual-frame">
                            <img src="/support_community_v2.png" alt="Community Support" />
                            <div className="sp-visual-overlay" />
                        </div>
                        <div className="sp-impact-content">
                            <div className="sp-impact-tag">COMMUNITY SUPPORT</div>
                            <h4>Help Me Keep Building</h4>
                            <p>From helping students build resumes to providing career resources, your support keeps these tools alive and evolving for everyone.</p>
                            <div className="sp-impact-stats">
                                <div className="stat">
                                    <h5>Kindness</h5>
                                    <p>The Fuel</p>
                                </div>
                                <div className="stat">
                                    <h5>Community</h5>
                                    <p>The Heart</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* ── SECONDARY SECTION ── */}
                <section className="sp-secondary-v4">
                    <motion.div {...fadeInUp} className="sp-glass-panel sp-full-width">
                        <div className="sp-split-row">
                            <div className="sp-split-text">
                                <div className="sp-impact-tag">APPRECIATION</div>
                                <h2>Why Your Help Matters</h2>
                                <p>
                                    As an independent developer, I focus on creating value without the distractions of ads or data tracking. 
                                    Your encouragement and help allow me to dedicate more time to research and development.
                                </p>
                                <ul className="sp-feature-list">
                                    <li><CheckCircle2 size={16} /> Continuous Tool Updates</li>
                                    <li><CheckCircle2 size={16} /> Free Resources for Students</li>
                                    <li><CheckCircle2 size={16} /> Honest & Clean Engineering</li>
                                </ul>
                            </div>
                            <div className="sp-split-visual">
                                <img src="/helping_growth_v2.png" alt="Helping Growth" />
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="sp-vision-v4" style={{ marginBottom: '3rem' }}>
                    <motion.div {...fadeInUp} className="sp-glass-panel sp-full-width">
                        <div className="sp-split-row sp-reverse">
                            <div className="sp-split-visual">
                                <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop" alt="Future Vision" />
                            </div>
                            <div className="sp-split-text">
                                <div className="sp-impact-tag">FUTURE VISION</div>
                                <h2>A Roadmap for Innovation</h2>
                                <p>
                                    Your support doesn't just maintain existing tools—it fuels the development of next-generation features. 
                                    I am committed to building a transparent, user-first ecosystem that empowers developers and students alike.
                                </p>
                                <ul className="sp-feature-list">
                                    <li><Zap size={16} /> AI-Powered Portfolio Intelligence</li>
                                    <li><Sparkles size={16} /> Real-time Collaborative Coding Tools</li>
                                    <li><Rocket size={16} /> Global Career Guidance Network</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="sp-values-v4" style={{ marginBottom: '4rem' }}>
                    <div className="sp-values-grid">
                        {[
                            {
                                icon: <Shield className="text-blue-400" />,
                                title: "Privacy First",
                                desc: "No trackers, no ads, no selling your data. Just pure, clean tools built for your benefit."
                            },
                            {
                                icon: <Zap className="text-yellow-400" />,
                                title: "High Performance",
                                desc: "Optimized for speed and efficiency, ensuring you get the best experience without bloat."
                            },
                            {
                                icon: <Users className="text-green-400" />,
                                title: "Open Access",
                                desc: "Committed to keeping essential tools free for students and the developer community."
                            }
                        ].map((v, i) => (
                            <motion.div 
                                key={i}
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                                className="sp-glass-panel sp-value-card"
                            >
                                <div className="sp-panel-icon">{v.icon}</div>
                                <h4>{v.title}</h4>
                                <p>{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <footer className="sp-footer-v4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="sp-heart-wrap"
                    >
                        <Heart className="sp-heart-icon" fill="#ff4757" />
                        <h3>Thank You for Supporting Me</h3>
                        <p>Your generosity makes a real difference in my life and work.</p>
                    </motion.div>
                </footer>

            </div>
        </div>
    );
};

export default SupportPage;
