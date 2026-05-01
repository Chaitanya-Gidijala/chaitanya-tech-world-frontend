import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, User, Mail, Calendar, Search,
    RefreshCw, X, Clock, ChevronRight, IndianRupee, CreditCard
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getToken } from '../../services/authService';
import './AdminLayout.css';

const ManageSupport = ({ refreshTrigger }) => {
    const { showToast } = useToast();
    const [contributions, setContributions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Using the existing user/profile/payments endpoint which now returns recorded supports
    // Or we can create a dedicated admin endpoint. For now, let's assume all payments are visible here.
    const loadContributions = async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);
        try {
            // We'll use a fetch directly to the backend to get all payments (Admin only)
            const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080/api';
            const response = await fetch(`${API_HOST}/user/profile/payments/all`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                console.warn(`Contributions fetch failed with status: ${response.status}`);
                setContributions([]);
                return;
            }

            const data = await response.json();
            setContributions(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
        } catch (err) {
            showToast('Failed to load contributions.', 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { loadContributions(); }, [refreshTrigger]);

    const filtered = contributions.filter(c =>
        [c.userName, c.userEmail, c.transactionId]
            .some(v => v?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const totalAmount = contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

    return (
        <div>
            {/* Stats */}
            <div className="adm-stats-grid">
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                        <Heart size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">{contributions.length}</h4>
                        <p className="adm-stat-label">Support Entries</p>
                    </div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                        <IndianRupee size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">₹{totalAmount.toLocaleString('en-IN')}</h4>
                        <p className="adm-stat-label">Total Support</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="adm-toolbar">
                <div className="adm-toolbar-left">
                    <div className="adm-search-wrap">
                        <Search className="adm-search-icon" size={16} />
                        <input
                            className="adm-search-input"
                            type="text"
                            placeholder="Search by name, email, txn id..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="adm-toolbar-right">
                    <button className="adm-btn adm-btn-secondary" onClick={() => loadContributions(true)} disabled={isRefreshing}>
                        <RefreshCw size={16} className={isRefreshing ? 'adm-spinner' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="adm-table-card">
                <div className="adm-table-scroll">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Supporter</th>
                                <th>Amount & ID</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4"><div className="adm-loading-center"><RefreshCw className="adm-spinner" size={28} /></div></td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="4"><div className="adm-empty" style={{ border: 'none', padding: '2rem' }}><p>No contributions found.</p></div></td></tr>
                            ) : (
                                filtered.map((c, i) => (
                                    <motion.tr key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => setSelectedEntry(c)} style={{ cursor: 'pointer' }}>
                                        <td>
                                            <div className="adm-cell-title-group">
                                                <div className="adm-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                                    {c.userName?.charAt(0).toUpperCase() || 'G'}
                                                </div>
                                                <div>
                                                    <span className="adm-cell-primary">{c.userName || 'Guest Supporter'}</span>
                                                    <div className="adm-cell-muted">{c.userEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="adm-service-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700 }}>
                                                ₹{c.amount}
                                            </div>
                                            <div className="adm-type-badge" style={{ 
                                                fontSize: '0.6rem', 
                                                marginTop: '4px', 
                                                background: c.itemType === 'RESUME' ? 'rgba(124,58,237,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: c.itemType === 'RESUME' ? '#7c3aed' : '#ef4444',
                                                padding: '2px 6px',
                                                borderRadius: '100px',
                                                display: 'inline-block',
                                                fontWeight: 800
                                            }}>
                                                {c.itemType || 'SUPPORT'}
                                            </div>
                                            <div className="adm-cell-muted" style={{ fontSize: '0.7rem', marginTop: '2px' }}>{c.transactionId}</div>
                                        </td>
                                        <td><span className="adm-cell-muted">{formatDate(c.createdAt)}</span></td>
                                        <td>
                                            <div className="adm-cell-actions">
                                                <button className="adm-view-btn">Details <ChevronRight size={13} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="adm-card-grid">
                {isLoading ? (
                    <div className="adm-loading-center"><RefreshCw className="adm-spinner" size={28} /></div>
                ) : filtered.length === 0 ? (
                    <div className="adm-empty"><p>No contributions found.</p></div>
                ) : (
                    filtered.map((c, i) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="adm-card"
                            onClick={() => setSelectedEntry(c)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="adm-card-header">
                                <div className="adm-card-title-group">
                                    <div className="adm-avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}>
                                        {c.userName?.charAt(0).toUpperCase() || 'G'}
                                    </div>
                                    <div>
                                        <h3 className="adm-card-title">{c.userName || 'Guest Supporter'}</h3>
                                        <p className="adm-card-subtitle">{c.userEmail}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                            </div>
                            <div className="adm-card-divider" />
                            <div className="adm-card-footer">
                                <div>
                                    <div className="adm-service-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700, marginBottom: '0.25rem' }}>
                                        ₹{c.amount}
                                    </div>
                                    <div className="adm-card-meta-row" style={{ fontSize: '0.7rem' }}><Clock size={12} />{formatDate(c.createdAt)}</div>
                                </div>
                                <div className="adm-mono" style={{ fontSize: '0.65rem', color: 'var(--jp-text-muted)' }}>{c.transactionId?.substring(0, 12)}...</div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <div className="adm-modal-overlay" onClick={() => setSelectedEntry(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 24 }}
                            className="adm-modal"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="adm-modal-header">
                                <div className="adm-modal-title-row">
                                    <div className="adm-modal-icon" style={{ background: '#ef444415', color: '#ef4444' }}><Heart size={18} /></div>
                                    <h3 className="adm-modal-title">Support Details</h3>
                                </div>
                                <button className="adm-modal-close" onClick={() => setSelectedEntry(null)}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="adm-modal-body">
                                <div className="adm-detail-grid">
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Supporter Name</span>
                                        <span className="adm-detail-value"><User size={14} />{selectedEntry.userName || 'Guest'}</span>
                                    </div>
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Email</span>
                                        <span className="adm-detail-value" style={{ wordBreak: 'break-all' }}><Mail size={14} />{selectedEntry.userEmail}</span>
                                    </div>
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Transaction ID</span>
                                        <span className="adm-detail-value"><CreditCard size={14} />{selectedEntry.transactionId}</span>
                                    </div>
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Date & Time</span>
                                        <span className="adm-detail-value"><Clock size={14} />{formatDate(selectedEntry.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="adm-budget-box" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.1)' }}>
                                    <div className="adm-budget-row">
                                        <span className="adm-detail-label" style={{ color: '#10b981' }}>Contribution Amount</span>
                                        <span className="adm-budget-amount" style={{ color: '#10b981' }}>₹{selectedEntry.amount}</span>
                                    </div>
                                </div>

                                <div className="adm-detail-item">
                                    <span className="adm-detail-label">Item Description</span>
                                    <div className="adm-message-box">{selectedEntry.itemName || 'Support Contribution'}</div>
                                </div>
                            </div>
                            <div className="adm-modal-footer">
                                <button className="adm-btn adm-btn-secondary" onClick={() => setSelectedEntry(null)}>Close</button>
                                <a
                                    className="adm-reply-link"
                                    href={`mailto:${selectedEntry.userEmail}?subject=Thank you for your support!`}
                                    style={{ background: '#6366f1', color: 'white' }}
                                >
                                    Send Thank You <Mail size={15} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageSupport;
