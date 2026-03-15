import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, User, Phone, Briefcase, Search,
    RefreshCw, MessageSquare, X, Clock, ChevronRight
} from 'lucide-react';
import { getAllInquiries } from '../../services/contactService';
import { useToast } from '../common/Toast';
import './AdminLayout.css';

const ManageInquiries = ({ refreshTrigger }) => {
    const { showToast } = useToast();
    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => { loadInquiries(); }, [refreshTrigger]);

    const loadInquiries = async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);
        try {
            const data = await getAllInquiries();
            setInquiries(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
        } catch (err) {
            showToast('Failed to load inquiries.', 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const filtered = inquiries.filter(iq =>
        [iq.name, iq.email, iq.serviceType]
            .some(v => v?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const budgetLabel = (val) => {
        if (!val) return 'N/A';
        if (val < 2000)  return '< ₹2,000';
        if (val < 5000)  return '₹2,000 – ₹5,000';
        if (val < 15000) return '₹5,000 – ₹15,000';
        if (val < 30000) return '₹15,000 – ₹30,000';
        return '₹30,000+';
    };

    return (
        <div>
            {/* Stats */}
            <div className="adm-stats-grid">
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{background:'rgba(99,102,241,0.1)', color:'var(--jp-primary)'}}>
                        <MessageSquare size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">{inquiries.length}</h4>
                        <p className="adm-stat-label">Total Inquiries</p>
                    </div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{background:'rgba(16,185,129,0.1)', color:'#10b981'}}>
                        <Clock size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">
                            {inquiries.filter(iq => (new Date() - new Date(iq.submittedAt)) / 3600000 < 24).length}
                        </h4>
                        <p className="adm-stat-label">Last 24 Hours</p>
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
                            placeholder="Search by name, email, service..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="adm-toolbar-right">
                    <button className="adm-btn adm-btn-secondary" onClick={() => loadInquiries(true)} disabled={isRefreshing}>
                        <RefreshCw size={16} className={isRefreshing ? 'adm-spinner' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="adm-table-card">
                <div className="adm-table-scroll">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Service & Budget</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4"><div className="adm-loading-center"><RefreshCw className="adm-spinner" size={28} /></div></td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="4"><div className="adm-empty" style={{border:'none',padding:'2rem'}}><p>No inquiries found.</p></div></td></tr>
                            ) : (
                                filtered.map((iq, i) => (
                                    <motion.tr key={iq.id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }} onClick={() => setSelectedInquiry(iq)} style={{cursor:'pointer'}}>
                                        <td>
                                            <div className="adm-cell-title-group">
                                                <div className="adm-avatar">{iq.name?.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <span className="adm-cell-primary">{iq.name}</span>
                                                    <div className="adm-cell-muted">{iq.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="adm-service-badge">{iq.serviceType || 'General'}</div>
                                            <div className="adm-cell-muted">{budgetLabel(iq.budget)}</div>
                                        </td>
                                        <td><span className="adm-cell-muted">{formatDate(iq.submittedAt)}</span></td>
                                        <td>
                                            <div className="adm-cell-actions">
                                                <button className="adm-view-btn">View <ChevronRight size={13} /></button>
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
                    <div className="adm-empty"><p>No inquiries found.</p></div>
                ) : (
                    filtered.map((iq, i) => (
                        <motion.div
                            key={iq.id}
                            initial={{ opacity:0, y:8 }}
                            animate={{ opacity:1, y:0 }}
                            transition={{ delay: i*0.04 }}
                            className="adm-card"
                            onClick={() => setSelectedInquiry(iq)}
                            style={{cursor:'pointer'}}
                        >
                            <div className="adm-card-header">
                                <div className="adm-card-title-group">
                                    <div className="adm-avatar">{iq.name?.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <h3 className="adm-card-title">{iq.name}</h3>
                                        <p className="adm-card-subtitle" style={{wordBreak:'break-all'}}>{iq.email}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} style={{color:'var(--jp-primary)', flexShrink:0}} />
                            </div>
                            <div className="adm-card-divider" />
                            <div className="adm-card-footer">
                                <div>
                                    <div className="adm-service-badge">{iq.serviceType || 'General'}</div>
                                    <div className="adm-card-meta-row" style={{marginTop:'0.35rem'}}><Clock size={12} />{formatDate(iq.submittedAt)}</div>
                                </div>
                                <span className="adm-cell-primary" style={{fontSize:'0.85rem'}}>{budgetLabel(iq.budget)}</span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedInquiry && (
                    <div className="adm-modal-overlay" onClick={() => setSelectedInquiry(null)}>
                        <motion.div
                            initial={{ opacity:0, scale:0.92, y:24 }}
                            animate={{ opacity:1, scale:1, y:0 }}
                            exit={{ opacity:0, scale:0.92, y:24 }}
                            className="adm-modal"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="adm-modal-header">
                                <div className="adm-modal-title-row">
                                    <div className="adm-modal-icon"><MessageSquare size={18} /></div>
                                    <h3 className="adm-modal-title">Inquiry Details</h3>
                                </div>
                                <button className="adm-modal-close" onClick={() => setSelectedInquiry(null)}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="adm-modal-body">
                                <div className="adm-detail-grid">
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Full Name</span>
                                        <span className="adm-detail-value"><User size={14} />{selectedInquiry.name}</span>
                                    </div>
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Email</span>
                                        <span className="adm-detail-value" style={{wordBreak:'break-all'}}><Mail size={14} />{selectedInquiry.email}</span>
                                    </div>
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Phone</span>
                                        <span className="adm-detail-value"><Phone size={14} />{selectedInquiry.phone || 'N/A'}</span>
                                    </div>
                                    <div className="adm-detail-item">
                                        <span className="adm-detail-label">Service</span>
                                        <span className="adm-detail-value"><Briefcase size={14} />{selectedInquiry.serviceType || 'Not specified'}</span>
                                    </div>
                                </div>

                                <div className="adm-budget-box">
                                    <div className="adm-budget-row">
                                        <span className="adm-detail-label">Estimated Budget</span>
                                        <span className="adm-budget-amount">{budgetLabel(selectedInquiry.budget)}</span>
                                    </div>
                                    <div className="adm-budget-bar-bg">
                                        <div
                                            className="adm-budget-bar-fill"
                                            style={{ width: `${Math.min(100, Math.round((selectedInquiry.budget / 50000) * 100))}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="adm-detail-item">
                                    <span className="adm-detail-label">Message</span>
                                    <div className="adm-message-box">{selectedInquiry.message}</div>
                                </div>
                            </div>
                            <div className="adm-modal-footer">
                                <button className="adm-btn adm-btn-secondary" onClick={() => setSelectedInquiry(null)}>Dismiss</button>
                                <a
                                    className="adm-reply-link"
                                    href={`mailto:${selectedInquiry.email}?subject=Reply: ${selectedInquiry.serviceType}`}
                                >
                                    Reply via Email <Mail size={15} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageInquiries;
