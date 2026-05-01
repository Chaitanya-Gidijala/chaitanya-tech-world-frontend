import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Mail, Shield, ShieldCheck, Search,
    RefreshCw, X, Clock, ChevronRight, UserCheck, 
    UserMinus, Filter, ShieldAlert
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getToken } from '../../services/authService';
import config from '../../../../config/apiConfig';
import './AdminLayout.css';

const ManageUsers = ({ refreshTrigger }) => {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadUsers = async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);
        try {
            const response = await fetch(config.endpoints.users.base, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                console.warn(`Users fetch failed with status: ${response.status}`);
                setUsers([]);
                return;
            }

            const result = await response.json();
            // Assuming result.data is an array of users
            setUsers(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            showToast('Failed to sync user registry.', 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { loadUsers(); }, [refreshTrigger]);

    const filtered = users.filter(u =>
        [u.name, u.email, u.username]
            .some(v => v?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getRoleBadge = (roles) => {
        const isAdmin = roles?.some(r => r.name?.includes('ADMIN') || r.includes('ADMIN'));
        return isAdmin ? 
            <span className="adm-badge adm-badge-pink"><ShieldCheck size={12} /> Admin</span> : 
            <span className="adm-badge adm-badge-primary"><UserCheck size={12} /> User</span>;
    };

    return (
        <div className="adm-view-container">
            {/* Stats */}
            <div className="adm-stats-grid">
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--jp-primary)' }}>
                        <Users size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">{users.length}</h4>
                        <p className="adm-stat-label">Verified Users</p>
                    </div>
                </div>
                <div className="adm-stat-card">
                    <div className="adm-stat-icon" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
                        <ShieldCheck size={22} />
                    </div>
                    <div className="adm-stat-info">
                        <h4 className="adm-stat-value">{users.filter(u => u.roles?.some(r => r.name?.includes('ADMIN'))).length}</h4>
                        <p className="adm-stat-label">Admin Staff</p>
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
                            placeholder="Search by name, email or username..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="adm-toolbar-right">
                    <button className="adm-btn adm-btn-secondary" onClick={() => loadUsers(true)} disabled={isRefreshing}>
                        <RefreshCw size={16} className={isRefreshing ? 'adm-spinner' : ''} />
                        Sync Registry
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="adm-table-card">
                <div className="adm-table-scroll">
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>Identity</th>
                                <th>Username</th>
                                <th>Privileges</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5"><div className="adm-loading-center"><RefreshCw className="adm-spinner" size={28} /></div></td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5"><div className="adm-empty" style={{ border: 'none', padding: '3rem' }}><p>No users found in the registry.</p></div></td></tr>
                            ) : (
                                filtered.map((u, i) => (
                                    <motion.tr key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                                        <td>
                                            <div className="adm-cell-title-group">
                                                <div className="adm-avatar">{u.name?.charAt(0).toUpperCase() || 'U'}</div>
                                                <div>
                                                    <span className="adm-cell-primary">{u.name || 'Anonymous User'}</span>
                                                    <div className="adm-cell-muted">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="adm-mono">{u.username}</span></td>
                                        <td>{getRoleBadge(u.roles)}</td>
                                        <td><span className="adm-badge adm-badge-success">Active</span></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="adm-cell-actions">
                                                <button className="adm-btn-icon" title="Edit Profile"><Shield size={14} /></button>
                                                <button className="adm-btn-icon delete" title="Suspend"><UserMinus size={14} /></button>
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
                    <div className="adm-empty"><p>No users found in the registry.</p></div>
                ) : (
                    filtered.map((u, i) => (
                        <motion.div
                            key={u.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="adm-card"
                            onClick={() => setSelectedUser(u)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="adm-card-header">
                                <div className="adm-card-title-group">
                                    <div className="adm-avatar" style={{ background: 'var(--jp-primary)' }}>
                                        {u.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="adm-card-title">{u.name || 'Anonymous User'}</h3>
                                        <p className="adm-card-subtitle">{u.email}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} style={{ color: 'var(--jp-primary)', flexShrink: 0 }} />
                            </div>
                            <div className="adm-card-divider" />
                            <div className="adm-card-footer">
                                <div>
                                    <div className="adm-mono" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>@{u.username}</div>
                                    {getRoleBadge(u.roles)}
                                </div>
                                <span className="adm-badge adm-badge-success">Active</span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
