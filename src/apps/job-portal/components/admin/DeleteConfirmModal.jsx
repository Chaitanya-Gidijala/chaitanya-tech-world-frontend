import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, jobTitle, isDeleting }) => {
    return (
        <AnimatePresence>
            {isOpen && (

                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 20000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            position: 'fixed',
                            top: '5%',
                            left: '25%',
                            transform: 'translateX(-50%)',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            zIndex: 20001,
                            width: '90%',
                            maxWidth: '500px',
                            background: 'var(--jp-card-bg, #1e293b)', // Fallback to dark color
                            color: 'var(--jp-text-main, #fff)',
                            borderRadius: '24px',
                            padding: '2rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            border: '1px solid var(--jp-border, #334155)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--jp-text-muted, #94a3b8)',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <AlertTriangle size={32} color="#ef4444" />
                        </div>

                        {/* Title */}
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            textAlign: 'center',
                            marginBottom: '0.5rem',
                            color: 'var(--jp-text-main, #fff)'
                        }}>
                            Delete Job?
                        </h2>

                        {/* Message */}
                        <p style={{
                            textAlign: 'center',
                            color: 'var(--jp-text-muted, #94a3b8)',
                            marginBottom: '0.5rem',
                            lineHeight: '1.6'
                        }}>
                            Are you sure you want to delete this job posting?
                        </p>

                        {/* Job Title */}
                        <p style={{
                            textAlign: 'center',
                            color: 'var(--jp-primary, #6366f1)',
                            fontWeight: 600,
                            marginBottom: '2rem',
                            fontSize: '1.1rem',
                            padding: '0 1rem',
                            overflowWrap: 'break-word'
                        }}>
                            "{jobTitle || 'Unknown Job'}"
                        </p>

                        {/* Warning */}
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            padding: '1rem',
                            marginBottom: '2rem'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#ef4444',
                                textAlign: 'center',
                                margin: 0
                            }}>
                                ⚠️ This action cannot be undone
                            </p>
                        </div>

                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={onClose}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--jp-border, #334155)',
                                    background: 'var(--jp-bg-secondary, #0f172a)',
                                    color: 'var(--jp-text-main, #fff)',
                                    fontWeight: 600,
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    opacity: isDeleting ? 0.5 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    opacity: isDeleting ? 0.7 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
