
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, BookOpen, FileText, ChevronRight, Award, Compass, Zap } from 'lucide-react';
import { getPreparationSummary } from '../../services/prepService';

const JobPreparationSection = ({ jobTitle, tags, onNavigate }) => {
    const [summary, setSummary] = useState({
        questionCount: 0,
        testCount: 0,
        resourceCount: 0,
        topTechnologies: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchSummary = async () => {
            setLoading(true);
            const data = await getPreparationSummary(tags);
            if (isMounted) {
                setSummary(data);
                setLoading(false);
            }
        };

        if (tags && tags.length > 0) {
            fetchSummary();
        } else {
            setLoading(false);
        }

        return () => { isMounted = false; };
    }, [tags]);

    if (loading) {
        return (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', textAlign: 'center', background: 'var(--jp-card-bg)', borderRadius: '20px', border: '1px solid var(--jp-border)' }}>
                <div className="jp-spinner" style={{ width: '30px', height: '30px', margin: '0 auto' }}></div>
            </div>
        );
    }

    const CompactPrepItem = ({ icon: Icon, title, count, color, onClick }) => (
        <motion.div
            whileHover={{ background: 'var(--jp-bg-secondary)', borderColor: color }}
            onClick={onClick}
            style={{
                flex: 1,
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                background: 'var(--jp-bg)',
                borderRadius: '16px',
                border: '1px solid var(--jp-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                <Icon size={22} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--jp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{title}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--jp-text-main)' }}>{count} Available</div>
            </div>

            <ChevronRight size={18} style={{ color: 'var(--jp-text-muted)', opacity: 0.5 }} />
        </motion.div>
    );

    return (
        <div style={{
            marginTop: '1rem',
            padding: '1.5rem',
            background: 'var(--jp-card-bg)',
            borderRadius: '24px',
            border: '1px solid var(--jp-border)',
            boxShadow: 'var(--jp-shadow-sm)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--jp-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, paddingLeft: '8px' }}>
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--jp-text-main)', letterSpacing: '-0.01em' }}>Preparation Hub</h2>
                        <p style={{ color: 'var(--jp-text-muted)', fontSize: '0.85rem', margin: 0 }}>Smart tools for <span style={{ color: 'var(--jp-primary)', fontWeight: 700 }}>{jobTitle}</span></p>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('hub')}
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: 'transparent',
                        color: 'var(--jp-primary)',
                        borderRadius: '10px',
                        border: '1px solid var(--jp-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                    Expand All <Compass size={14} />
                </button>
            </div>

            <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <CompactPrepItem
                    icon={BookOpen}
                    color="#db2777"
                    title="Interview Qs"
                    count={summary.questionCount}
                    onClick={() => onNavigate('questions')}
                />

                <CompactPrepItem
                    icon={Target}
                    color="var(--jp-primary)"
                    title="Assessments"
                    count={summary.testCount}
                    onClick={() => onNavigate('mcq-start')}
                />

                <CompactPrepItem
                    icon={FileText}
                    color="#10b981"
                    title="Resources"
                    count={summary.resourceCount}
                    onClick={() => onNavigate('resources')}
                />
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'var(--jp-bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--jp-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.8rem',
                color: 'var(--jp-text-muted)',
                fontWeight: 600
            }}>
                <Award size={14} color="var(--jp-primary)" />
                <span style={{ opacity: 0.8 }}>Tailored Tech:</span>
                <span style={{ color: 'var(--jp-text-main)' }}>{summary.topTechnologies.join(', ')}</span>
            </div>
        </div>
    );
};

export default JobPreparationSection;
