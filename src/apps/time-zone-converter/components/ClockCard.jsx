import React from 'react';
import { X, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime, formatDate, getTimeOffset } from '../utils';

const ClockCard = ({ zone, date, onRemove }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel"
            style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                minHeight: '180px',
                border: '1px solid var(--color-primary-glow)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                        {zone.city}
                    </h3>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {getTimeOffset(zone.value)}
                    </span>
                </div>
                <button
                    onClick={() => onRemove(zone.value)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                    }}
                >
                    <X size={18} />
                </button>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    letterSpacing: '-1px',
                    fontVariantNumeric: 'tabular-nums'
                }}>
                    {formatTime(date, zone.value)}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                }}>
                    <Clock size={14} />
                    {formatDate(date, zone.value)}
                </div>
            </div>
        </motion.div>
    );
};

export default ClockCard;
