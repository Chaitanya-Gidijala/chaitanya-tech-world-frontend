import React from 'react';
import { motion } from 'framer-motion';
import '../PhotoEditor.css';
import {
    MessageCircle, Pencil, Eye, RefreshCcw, CheckCircle2
} from 'lucide-react';

const steps = [
    {
        num: '01',
        Icon: MessageCircle,
        title: 'Consultation',
        desc: 'We discuss your vision, requirements, and style preferences in detail.',
    },
    {
        num: '02',
        Icon: Pencil,
        title: 'Concept Creation',
        desc: 'Initial concepts and mood board crafted based on your brief.',
    },
    {
        num: '03',
        Icon: Eye,
        title: 'Design Preview',
        desc: 'Share the first draft for your review with a visual walkthrough.',
    },
    {
        num: '04',
        Icon: RefreshCcw,
        title: 'Revisions',
        desc: "Refine until it's perfect — up to 3 revision rounds included.",
    },
    {
        num: '05',
        Icon: CheckCircle2,
        title: 'Final Delivery',
        desc: 'Production-ready files delivered in all required formats.',
    },
];

const Process = () => (
    <section className="pe-section pe-process">
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="pe-tag" style={{ margin: '0 auto 1rem' }}>
                    How It Works
                </div>
                <h2 className="pe-section-title">
                    The Design <span className="text-gradient">Process</span>
                </h2>
                <p className="pe-section-subtitle">
                    A transparent, collaborative workflow that delivers premium results every time —
                    on time, on brief, and beyond expectations.
                </p>
            </motion.div>

            <motion.div
                className="pe-process-timeline"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
            >
                {steps.map(({ num, Icon, title, desc }) => (
                    <motion.div
                        key={num}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
                        }}
                        className="pe-process-step"
                    >
                        <div className="pe-process-num">{num}</div>
                        <div className="pe-process-icon">
                            <Icon size={18} strokeWidth={1.8} />
                        </div>
                        <div>
                            <h4 className="pe-process-step-title">{title}</h4>
                            <p className="pe-process-step-desc">{desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default Process;
