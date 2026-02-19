import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', showText = false }) => {
    const sizes = {
        small: { width: 32, fontSize: '0.9rem' },
        medium: { width: 40, fontSize: '1.1rem' },
        large: { width: 56, fontSize: '1.5rem' }
    };

    const { width, fontSize } = sizes[size] || sizes.medium;

    return (
        <div className="logo-container" style={{ gap: showText ? '0.75rem' : '0' }}>
            <svg
                width={width}
                height={width}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="logo-icon"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(260, 100%, 60%)" />
                        <stop offset="100%" stopColor="hsl(320, 100%, 50%)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer Circle with gradient border */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#logoGradient)"
                    strokeWidth="3"
                    fill="none"
                    className="logo-circle"
                />

                {/* CTW Text */}
                <text
                    x="50"
                    y="62"
                    textAnchor="middle"
                    fill="url(#logoGradient)"
                    fontSize="36"
                    fontWeight="800"
                    fontFamily="Outfit, sans-serif"
                    filter="url(#glow)"
                    className="logo-text"
                >
                    CTW
                </text>

                {/* Decorative dots */}
                <circle cx="50" cy="20" r="3" fill="url(#logoGradient)" className="logo-dot" />
                <circle cx="80" cy="50" r="3" fill="url(#logoGradient)" className="logo-dot" />
                <circle cx="20" cy="50" r="3" fill="url(#logoGradient)" className="logo-dot" />
            </svg>

            {showText && (
                <span className="logo-brand-text" style={{ fontSize }}>
                    Chaitanya Tech World
                </span>
            )}
        </div>
    );
};

export default Logo;
