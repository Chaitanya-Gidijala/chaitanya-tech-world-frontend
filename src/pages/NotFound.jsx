import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
    // Generate random positions and animations for background squares
    const squares = useMemo(() => {
        return [...Array(30)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 15 + 5,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
    }, []);

    return (
        <div className="not-found-wrapper">
            {/* Animated Background */}
            <div className="not-found-bg">
                {squares.map((s) => (
                    <motion.div
                        key={s.id}
                        className="background-square"
                        style={{
                            left: `${s.x}%`,
                            top: `${s.y}%`,
                            width: s.size,
                            height: s.size
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            rotate: [0, 90, 0],
                            opacity: [0.05, 0.15, 0.05]
                        }}
                        transition={{
                            duration: s.duration,
                            repeat: Infinity,
                            delay: s.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Content Section */}
            <motion.div 
                className="not-found-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.span 
                    className="not-found-label"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    404
                </motion.span>
                
                <motion.h1 
                    className="not-found-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Page Not Found
                </motion.h1>

                <motion.p 
                    className="not-found-desc"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    The page you are looking for doesn't exist or has been moved
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link to="/" className="not-found-btn">
                        Go Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;
