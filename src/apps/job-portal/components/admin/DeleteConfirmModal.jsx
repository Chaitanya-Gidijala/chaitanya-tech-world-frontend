import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import './AdminLayout.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, jobTitle, isDeleting }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="adm-modal-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="adm-modal adm-modal-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="adm-modal-header">
                            <div className="adm-modal-title-row">
                                <div className="adm-modal-icon adm-modal-icon-danger">
                                    <AlertTriangle size={18} />
                                </div>
                                <h3 className="adm-modal-title">Delete Job?</h3>
                            </div>
                            <button className="adm-modal-close" onClick={onClose}>
                                <X size={16} />
                            </button>
                        </div>

                        <div className="adm-modal-body">
                            <div className="adm-delete-confirm">
                                <div className="adm-delete-confirm-icon">
                                    <AlertTriangle size={28} />
                                </div>
                                <h3>Are you sure?</h3>
                                <p>
                                    You are about to permanently delete:
                                </p>
                                <p className="adm-delete-job-title">"{jobTitle || 'This job posting'}"</p>
                                <div className="adm-delete-warning">
                                    ⚠️ This action cannot be undone.
                                </div>
                            </div>
                        </div>

                        <div className="adm-modal-footer">
                            <button
                                className="adm-btn adm-btn-secondary"
                                onClick={onClose}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="adm-btn adm-btn-delete"
                                onClick={onConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <><RefreshCw size={15} className="adm-spinner" /> Deleting…</>
                                ) : (
                                    'Confirm Delete'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
