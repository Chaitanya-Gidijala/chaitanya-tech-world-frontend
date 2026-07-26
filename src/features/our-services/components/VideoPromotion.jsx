import React from 'react';
import { motion } from 'framer-motion';
import { 
    Video, Film, Clapperboard, MonitorPlay, 
    PlayCircle, Megaphone, CheckCircle, TrendingUp
} from 'lucide-react';
import '../styles/OurServices_v1.css';

const videoFeatures = [
    {
        icon: Megaphone,
        title: "Brand Storytelling",
        desc: "Compelling narratives that capture the essence of your business.",
        color: "hsla(15, 100%, 55%, 0.15)"
    },
    {
        icon: MonitorPlay,
        title: "High-Quality Production",
        desc: "Professional-grade 4K filming, lighting, and crystal-clear audio.",
        color: "hsla(210, 100%, 55%, 0.15)"
    },
    {
        icon: Film,
        title: "Dynamic Editing",
        desc: "Cinematic cuts, smooth transitions, and premium color grading.",
        color: "hsla(45, 100%, 50%, 0.15)"
    },
    {
        icon: TrendingUp,
        title: "Social Media Ready",
        desc: "Optimized formats for Instagram, YouTube, and LinkedIn growth.",
        color: "hsla(340, 100%, 55%, 0.15)"
    }
];

const VideoPromotion = () => {
    return (
        <section id="pe-video-promo" className="pe-section pe-webdev" style={{ overflow: 'hidden' }}>
            <div className="container">
                <div className="pe-webdev-split" style={{ flexDirection: 'row-reverse' }}>
                    <motion.div 
                        className="pe-webdev-content"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="pe-tag" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>Visual Media</div>
                        <h2 className="pe-webdev-h2">
                            Promotional <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(90deg, #f97316, #ea580c)' }}>Video Production</span>
                        </h2>
                        <p className="pe-webdev-desc">
                            In today's digital landscape, video is the most powerful tool to engage your audience. 
                            I create stunning promotional videos tailored for companies, local shops, startups, and personal brands 
                            to help you stand out and drive conversions.
                        </p>
                        
                        <div className="pe-webdev-features" style={{ marginTop: '1rem' }}>
                            {videoFeatures.map((f, i) => (
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
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {/* Abstract Visual Elements tailored for Video */}
                        <div className="pe-webdev-orb" style={{ background: 'hsla(15, 100%, 55%, 0.1)' }} />

                        <div className="pe-webdev-metrics-grid">
                            {[
                                { icon: Video, label: "Resolution", val: "4K UHD" },
                                { icon: PlayCircle, label: "Platforms", val: "Omnichannel" },
                                { icon: Clapperboard, label: "Direction", val: "Creative" },
                                { icon: CheckCircle, label: "Delivery", val: "Fast TAT" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="pe-webdev-metric-card"
                                    style={{ borderColor: 'rgba(249,115,22,0.1)' }}
                                >
                                    <div className="pe-metric-icon-box" style={{ color: '#f97316', background: 'rgba(249,115,22,0.1)' }}>
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

export default VideoPromotion;
