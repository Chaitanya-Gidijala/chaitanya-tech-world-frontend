import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Mail, Search, RefreshCw, Trash2, 
    Download, Send, Calendar, CheckCircle2, 
    XCircle, Filter, UserPlus
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import './AdminLayout.css';

const ManageSubscribers = () => {
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Mock data for initial preview
    const [subscribers] = useState([
        { id: 1, email: 'alex.smith@example.com', date: '2024-03-20', status: 'Active', source: 'Landing Page' },
        { id: 2, email: 'sarah.jones@tech.io', date: '2024-03-18', status: 'Active', source: 'Job Portal' },
        { id: 3, email: 'mike.dev@google.com', date: '2024-03-15', status: 'Unsubscribed', source: 'Newsletter' },
        { id: 4, email: 'priya.sharma@ctw.com', date: '2024-03-10', status: 'Active', source: 'Direct' },
        { id: 5, email: 'j.doe@startup.com', date: '2024-03-05', status: 'Active', source: 'Landing Page' },
    ]);

    const filtered = subscribers.filter(s => 
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="adm-view-container">
            {/* Summary */}
            <div className="adm-stats-grid">
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--jp-primary)' }}>
                        <Mail size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">{subscribers.length}</h4>
                        <p className="adm-stat-label">Total Subscribers</p>
                    </div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                        <CheckCircle2 size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">{subscribers.filter(s => s.status === 'Active').length}</h4>
                        <p className="adm-stat-label">Active Audience</p>
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
                            placeholder="Search by email address..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="adm-toolbar-right">
                    <button className="adm-btn adm-btn-secondary" onClick={() => showToast('CSV Export prepared.', 'info')}>
                        <Download size={14} /> Export CSV
                    </button>
                    <button className="adm-btn adm-btn-primary" onClick={() => showToast('Broadcast modal coming soon.', 'info')}>
                        <Send size={14} /> Send Campaign
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="adm-table-card">
                <div className="adm-table-scroll">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Subscriber Email</th>
                                <th>Join Date</th>
                                <th>Acquisition Source</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <motion.tr 
                                    key={s.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <td>
                                        <div className="adm-cell-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div className="adm-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem', background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-muted)', border: '1px solid var(--jp-border)' }}>
                                                {s.email.charAt(0).toUpperCase()}
                                            </div>
                                            {s.email}
                                        </div>
                                    </td>
                                    <td><span className="adm-cell-muted"><Calendar size={13} style={{ marginRight: '0.4rem' }} /> {s.date}</span></td>
                                    <td><span className="adm-tag">{s.source}</span></td>
                                    <td>
                                        {s.status === 'Active' ? 
                                            <span className="adm-badge adm-badge-success">Subscribed</span> : 
                                            <span className="adm-badge adm-badge-neutral">Opted Out</span>
                                        }
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="adm-cell-actions">
                                            <button className="adm-btn-icon delete" title="Unsubscribe User"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="adm-card-grid">
                {filtered.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="adm-card"
                    >
                        <div className="adm-card-header">
                            <div className="adm-card-title-group">
                                <div className="adm-avatar" style={{ background: 'var(--jp-bg-secondary)', color: 'var(--jp-text-muted)', border: '1px solid var(--jp-border)' }}>
                                    {s.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="adm-card-title" style={{ fontSize: '0.85rem' }}>{s.email}</h3>
                                    <p className="adm-card-subtitle">Joined: {s.date}</p>
                                </div>
                            </div>
                            <button className="adm-btn-icon delete"><Trash2 size={14} /></button>
                        </div>
                        <div className="adm-card-divider" />
                        <div className="adm-card-footer">
                            <span className="adm-tag">{s.source}</span>
                            {s.status === 'Active' ? 
                                <span className="adm-badge adm-badge-success">Subscribed</span> : 
                                <span className="adm-badge adm-badge-neutral">Opted Out</span>
                            }
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ManageSubscribers;
