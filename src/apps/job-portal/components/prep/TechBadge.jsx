
import React from 'react';

const TechBadge = ({ tech, onClick, active }) => {
    return (
        <span
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: onClick ? 'pointer' : 'default',
                backgroundColor: active ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)',
                color: active ? 'white' : 'var(--jp-text-main)',
                border: active ? '1px solid var(--jp-primary)' : '1px solid var(--jp-border)',
                transition: 'all 0.2s ease',
                userSelect: 'none'
            }}
            onMouseEnter={(e) => {
                if (onClick && !active) {
                    e.currentTarget.style.borderColor = 'var(--jp-primary)';
                    e.currentTarget.style.color = 'var(--jp-primary)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick && !active) {
                    e.currentTarget.style.borderColor = 'var(--jp-border)';
                    e.currentTarget.style.color = 'var(--jp-text-main)';
                }
            }}
        >
            {tech}
        </span>
    );
};

export default TechBadge;
