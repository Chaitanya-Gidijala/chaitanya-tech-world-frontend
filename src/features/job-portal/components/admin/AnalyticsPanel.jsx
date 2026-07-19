import React, { useState, useEffect } from 'react';
import {
    Eye, Users, Briefcase, RefreshCw, TrendingUp, Globe,
    Monitor, Smartphone, Tablet, Clock, Wifi
} from 'lucide-react';
import { getVisitorSessions } from '../../services/analyticsService';

/* ─── helpers ─────────────────────────────────────────────────── */
const fmtNum = (n) => (n == null ? 0 : Number(n)).toLocaleString();

const timeAgo = (isoOrDate) => {
    if (!isoOrDate) return '—';
    const diff = Date.now() - new Date(isoOrDate).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return new Date(isoOrDate).toLocaleDateString();
};

const DevIcon = ({ device }) => {
    const d = (device || '').toLowerCase();
    if (d === 'mobile') return <Smartphone size={13} />;
    if (d === 'tablet') return <Tablet size={13} />;
    return <Monitor size={13} />;
};

/* ─── component ───────────────────────────────────────────────── */
const AnalyticsPanel = ({ stats, overviewStats, refreshTrigger }) => {
    const total    = Number(stats.totalViews   ?? 0);
    const unique   = Number(stats.uniqueVisitors ?? 0);
    const browsers = stats.browserStats || {};
    // dailyStats comes from the backend API now (array of { dateId, totalViews, uniqueVisitors })
    const dailyStats = stats.dailyStats || [];

    const [sessions, setSessions]           = useState([]);
    const [isLoadingSessions, setLoading]   = useState(true);

    useEffect(() => {
        setLoading(true);
        getVisitorSessions(50)
            .then(setSessions)
            .catch(() => setSessions([]))
            .finally(() => setLoading(false));
    }, [refreshTrigger]);

    /* ── 7-day chart data: prefer backend dailyStats, fallback to localStorage ── */
    const buildChartData = () => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();

        // build a date-keyed lookup from backend data
        const apiLookup = {};
        dailyStats.forEach(row => {
            // dateId may be 'YYYY-MM-DD' string or array [Y,M,D]
            let key = '';
            if (typeof row.dateId === 'string') {
                key = row.dateId;
            } else if (Array.isArray(row.dateId)) {
                const [y, m, d] = row.dateId;
                key = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            }
            if (key) apiLookup[key] = row.totalViews || 0;
        });

        // fallback: localStorage daily stats
        let localLookup = {};
        try { localLookup = JSON.parse(localStorage.getItem('jp_daily_stats') || '{}'); } catch {}

        const rows = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const val = apiLookup[dateStr] ?? localLookup[dateStr] ?? 0;
            return { label: dayNames[d.getDay()], val, isToday: i === 6 };
        });

        const max = Math.max(1, ...rows.map(r => r.val));
        return rows.map(r => ({ ...r, pct: Math.max(8, (r.val / max) * 100) }));
    };

    const chartData = buildChartData();

    /* ─── render ──────────────────────────────────────────────────── */
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── stat cards ── */}
            <div className="adm-stats-grid">
                {[
                    { label: 'Total Impressions',  val: fmtNum(total),                    icon: Eye,       color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                    { label: 'Unique Visitors',    val: fmtNum(unique),                   icon: Users,     color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
                    { label: 'Active Jobs',        val: fmtNum(overviewStats?.jobs),       icon: Briefcase, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                    { label: 'Registered Users',   val: fmtNum(overviewStats?.users),      icon: RefreshCw, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                ].map(({ label, val, icon: Icon, color, bg }) => (
                    <div key={label} className="adm-stat-card">
                        <div className="adm-stat-icon" style={{ background: bg, color }}>
                            <Icon size={22} />
                        </div>
                        <div className="adm-stat-info">
                            <h4 className="adm-stat-value">{val}</h4>
                            <p className="adm-stat-label">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── charts row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* 7-day trend */}
                <div className="adm-card-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--jp-border)' }}>
                        <div style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={16} />
                        </div>
                        <h3 className="adm-step-title" style={{ margin: 0 }}>7-Day Traffic Trend</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', height: 140, gap: 6, padding: '20px 4px 0' }}>
                        {chartData.map(({ label, val, isToday, pct }) => (
                            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                {/* count above bar */}
                                <span style={{ fontSize: '0.6rem', fontWeight: 600, color: isToday ? '#6366f1' : 'var(--jp-text-muted)', minHeight: 14 }}>
                                    {val > 0 ? val : ''}
                                </span>
                                <div style={{
                                    width: '100%',
                                    height: `${pct}%`,
                                    background: isToday ? 'linear-gradient(180deg,#6366f1,#a855f7)' : 'rgba(99,102,241,0.18)',
                                    borderRadius: '4px 4px 2px 2px',
                                    transition: 'height 0.6s ease-out',
                                    minHeight: 6,
                                }} />
                                <span style={{ fontSize: '0.65rem', color: 'var(--jp-text-muted)', fontWeight: isToday ? 700 : 400 }}>{label}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--jp-text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                        Daily page impressions — sourced from real session data.
                    </p>
                </div>

                {/* browser distribution */}
                <div className="adm-card-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--jp-border)' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe size={16} />
                        </div>
                        <h3 className="adm-step-title" style={{ margin: 0 }}>Browser Distribution</h3>
                    </div>

                    {Object.keys(browsers).length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--jp-text-muted)', textAlign: 'center', padding: '2.5rem 0' }}>
                            No browser data yet — visit a public page first.
                        </p>
                    ) : (
                        Object.entries(browsers)
                            .sort((a, b) => b[1] - a[1])
                            .map(([name, count]) => {
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={name} style={{ marginBottom: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{name}</span>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--jp-text-muted)' }}>{pct}% ({fmtNum(count)})</span>
                                        </div>
                                        <div style={{ height: 8, background: 'var(--jp-border)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,var(--jp-primary),var(--jp-secondary))', borderRadius: 4, transition: 'width 0.5s' }} />
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>
            </div>

            {/* ── real-time visitor log ── */}
            <div className="adm-card-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--jp-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wifi size={16} />
                        </div>
                        <h3 className="adm-step-title" style={{ margin: 0 }}>Real-Time Visitor Log</h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--jp-text-muted)', background: 'var(--jp-surface-2,#f3f4f6)', padding: '4px 10px', borderRadius: 20 }}>
                        Last 50 sessions
                    </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--jp-border)' }}>
                                {['Time', 'User', 'Page', 'Device', 'OS', 'Browser', 'IP', 'System Info'].map(h => (
                                    <th key={h} style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--jp-text-muted)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingSessions ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                                    <RefreshCw size={22} className="jp-spin" style={{ color: 'var(--jp-primary)' }} />
                                </td></tr>
                            ) : sessions.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--jp-text-muted)' }}>
                                    No sessions recorded yet. Visit a public page to generate data.
                                </td></tr>
                            ) : sessions.map((s, i) => (
                                <tr key={s.id ?? i} style={{ borderBottom: '1px solid var(--jp-border)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--jp-surface-2,rgba(0,0,0,0.03))'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <td style={{ padding: '10px 8px', color: 'var(--jp-text-muted)', whiteSpace: 'nowrap' }}>
                                        {timeAgo(s.timestamp)}
                                    </td>
                                    <td style={{ padding: '10px 8px', fontSize: '0.78rem', color: s.userEmail === 'anonymous' ? 'var(--jp-text-muted)' : 'var(--jp-primary)', fontWeight: s.userEmail === 'anonymous' ? 400 : 500 }}>
                                        {s.userEmail || 'anonymous'}
                                    </td>
                                    <td style={{ padding: '10px 8px', color: 'var(--jp-primary)', fontWeight: 500, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {s.page || '/'}
                                    </td>
                                    <td style={{ padding: '10px 8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--jp-text-muted)' }}>
                                            <DevIcon device={s.device} />
                                            <span style={{ fontSize: '0.78rem' }}>{s.device || '—'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px 8px', fontSize: '0.78rem' }}>{s.os || '—'}</td>
                                    <td style={{ padding: '10px 8px', fontSize: '0.78rem' }}>{s.browser || '—'}</td>
                                    <td style={{ padding: '10px 8px', fontSize: '0.75rem', color: 'var(--jp-text-muted)', fontFamily: 'monospace' }}>
                                        {s.ipAddress || '—'}
                                    </td>
                                    <td style={{ padding: '10px 8px', fontSize: '0.72rem', color: 'var(--jp-text-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.systemInfo}>
                                        {s.systemInfo || '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
