import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, Shield, User, Smartphone, Palette, Save, LogOut } from 'lucide-react';
import { useToast } from '../common/Toast';

const AdminSettings = () => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('general');

    const [settings, setSettings] = useState({
        siteName: 'FindSharp Portal',
        adminEmail: 'admin@findsharp.com',
        notifications: true,
        darkMode: true,
        maintenanceMode: false,
        twoFactorAuth: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            showToast('Settings saved successfully!', 'success');
        }, 800);
    };

    const sections = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notify', label: 'Notifications', icon: Bell },
        { id: 'active', label: 'Display', icon: Palette },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '240px 1fr' : '1fr', gap: '2rem' }}>
            {/* Sidebar Navigation */}
            <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'column' : 'row', gap: '0.50rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {sections.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeSection === s.id ? 'var(--jp-primary)' : 'var(--jp-bg-secondary)',
                            color: activeSection === s.id ? 'white' : 'var(--jp-text-main)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flex: window.innerWidth > 768 ? 'none' : '1'
                        }}
                    >
                        <s.icon size={18} />
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="glass-panel" style={{ padding: window.innerWidth > 768 ? '2.5rem' : '1.5rem' }}>
                <form onSubmit={handleSave}>
                    {activeSection === 'general' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>General Settings</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Portal Name</label>
                                <input
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Admin Email</label>
                                <input
                                    required
                                    type="email"
                                    value={settings.adminEmail}
                                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Maintenance Mode</h4>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>Disable public access to the portal</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('maintenanceMode')}
                                    style={{
                                        width: '50px', height: '26px', borderRadius: '13px', background: settings.maintenanceMode ? 'var(--jp-primary)' : 'var(--jp-border)',
                                        border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                        position: 'absolute', top: '3px', left: settings.maintenanceMode ? '27px' : '3px', transition: '0.3s'
                                    }} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'security' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Security Configuration</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Two-Factor Authentication</h4>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>Required for all admin accounts</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('twoFactorAuth')}
                                    style={{
                                        width: '50px', height: '26px', borderRadius: '13px', background: settings.twoFactorAuth ? 'var(--jp-primary)' : 'var(--jp-border)',
                                        border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                        position: 'absolute', top: '3px', left: settings.twoFactorAuth ? '27px' : '3px', transition: '0.3s'
                                    }} />
                                </button>
                            </div>
                            <button
                                type="button"
                                style={{ padding: '0.8rem', borderRadius: '10px', background: 'var(--jp-bg-secondary)', border: '1px solid var(--jp-border)', color: 'var(--jp-text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}
                            >
                                <Lock size={16} /> Reset Admin Password
                            </button>
                        </motion.div>
                    )}

                    {activeSection === 'notify' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Notification Preferences</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Email Alerts</h4>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>Get notified on new job applications</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('notifications')}
                                    style={{
                                        width: '50px', height: '26px', borderRadius: '13px', background: settings.notifications ? 'var(--jp-primary)' : 'var(--jp-border)',
                                        border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                        position: 'absolute', top: '3px', left: settings.notifications ? '27px' : '3px', transition: '0.3s'
                                    }} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'active' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Display Settings</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>System Dark Mode</h4>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>Override user theme preference</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('darkMode')}
                                    style={{
                                        width: '50px', height: '26px', borderRadius: '13px', background: settings.darkMode ? 'var(--jp-primary)' : 'var(--jp-border)',
                                        border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                    }}
                                >
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                        position: 'absolute', top: '3px', left: settings.darkMode ? '27px' : '3px', transition: '0.3s'
                                    }} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--jp-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '1rem 2rem', borderRadius: '12px', background: 'var(--jp-primary)', color: 'white', border: 'none',
                                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem'
                            }}
                        >
                            {isLoading ? <Smartphone className="jp-spin" size={20} /> : <Save size={20} />}
                            {isLoading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
