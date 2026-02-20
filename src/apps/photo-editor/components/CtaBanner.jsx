import React from 'react';
import { motion } from 'framer-motion';
import '../PhotoEditor.css';
import { Sparkles, Globe, Mail } from 'lucide-react';
import { profileConfig } from '../../../config/profileConfig';

const CtaBanner = () => (
    <section id="pe-cta" className="pe-section pe-cta">
        <div className="container">
            <motion.div
                className="pe-cta-inner"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                {/* Decorative orbs */}
                <div className="pe-cta-orb-1" />
                <div className="pe-cta-orb-2" />

                <h2 className="pe-cta-h2">
                    Let's Design Something<br />
                    <em style={{ fontStyle: 'normal', opacity: 0.9 }}>Beautiful Together</em>
                </h2>
                <p className="pe-cta-sub">
                    Whether you need a stunning invitation, a brand identity, or a fully custom
                    website — I'm here to bring your vision to life with craft and precision.
                </p>

                <div className="pe-cta-btns">
                    <button
                        className="pe-cta-btn-white"
                        onClick={() => window.open('/contact', '_blank')}
                    >
                        <Mail size={16} /> Get Custom Invitation
                    </button>
                    <button
                        className="pe-cta-btn-outline"
                        onClick={() => window.open('/contact', '_blank')}
                    >
                        <Globe size={16} /> Build My Website
                    </button>
                    <button
                        className="pe-cta-btn-outline"
                        onClick={() => window.open('/contact', '_blank')}
                    >
                        <Sparkles size={16} /> Request Custom Quote
                    </button>
                </div>
            </motion.div>
        </div>
    </section>
);

export default CtaBanner;
