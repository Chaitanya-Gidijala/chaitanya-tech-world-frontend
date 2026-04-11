import React from 'react';
import { motion } from 'framer-motion';
import { 
    MonitorSmartphone, Layout, Rocket, Search, 
    Terminal, Database, Globe, Server, Cpu, 
    ShieldCheck, Zap, Layers 
} from 'lucide-react';
import '../styles/OurServices_v1.css';

const features = [
    {
        icon: Layout,
        title: "Modern UI/UX",
        desc: "Pixel-perfect, high-density designs with glassmorphism and smooth animations.",
        color: "hsla(260, 100%, 65%, 0.15)"
    },
    {
        icon: Terminal,
        title: "Clean Code",
        desc: "Scalable architecture using React, Next.js, and best-practice principles.",
        color: "hsla(190, 100%, 45%, 0.15)"
    },
    {
        icon: Database,
        title: "Robust Backends",
        desc: "Secure, high-performance APIs and database architecture.",
        color: "hsla(320, 100%, 60%, 0.15)"
    },
    {
        icon: Search,
        title: "SEO Foundation",
        desc: "Semantic HTML and meta-optimisation built-in to every build.",
        color: "hsla(150, 100%, 45%, 0.15)"
    }
];

const WebDev = () => {
    return (
        <section id="pe-webdev" className="pe-section pe-webdev" style={{ overflow: 'hidden' }}>
            <div className="container">
                <div className="pe-webdev-split">
                    <motion.div 
                        className="pe-webdev-content"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="pe-tag">Professional Development</div>
                        <h2 className="pe-webdev-h2">
                            Full-Stack <span className="text-gradient">Web Solutions</span>
                        </h2>
                        <p className="pe-webdev-desc">
                            I bridge the gap between creative design and complex engineering. 
                            From sleek landing pages to robust web applications, 
                            I build custom solutions that are performant, secure, and beautiful.
                        </p>
                        
                        <div className="pe-webdev-features" style={{ marginTop: '1rem' }}>
                            {features.map((f, i) => (
                                <div key={i} className="pe-webdev-feature">
                                    <div className="pe-webdev-feature-icon" style={{ background: f.color }}>
                                        <f.icon size={20} />
                                    </div>
                                    <div className="pe-webdev-feature-text">
                                        <h4>{f.title}</h4>
                                        <p>{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        className="pe-webdev-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* Abstract Visual Elements */}
                        <div className="pe-webdev-orb" />

                        <div className="pe-webdev-metrics-grid">
                            {[
                                { icon: Cpu, label: "Performance", val: "99+" },
                                { icon: ShieldCheck, label: "Security", val: "SSL" },
                                { icon: Zap, label: "Optimization", val: "Lighthouse" },
                                { icon: Layers, label: "Scalability", val: "Modular" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="pe-webdev-metric-card"
                                >
                                    <div className="pe-metric-icon-box">
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <div className="pe-metric-label">{item.label}</div>
                                        <div className="pe-metric-val">{item.val}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WebDev;
