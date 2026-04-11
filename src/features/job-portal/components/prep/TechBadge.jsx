
import React from 'react';

const TechBadge = ({ tech, onClick, active }) => {
    return (
        <span
            onClick={onClick}
            className={`jp-tech-badge ${active ? 'active' : ''}`}
        >
            {tech}
        </span>
    );
};

export default TechBadge;
