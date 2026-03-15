import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Lock, Shield, User, Smartphone, Palette, Save, Webhook, Key, Mail, Moon, Monitor } from 'lucide-react';
import { useToast } from '../common/Toast';

const AdminSettings = () => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('general');

    const [settings, setSettings] = useState({
        siteName: 'Chaitanya Tech World',
        adminEmail: 'admin@chaitanya.com',
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
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notify', label: 'Notifications', icon: Bell },
        { id: 'display', label: 'Display & Theme', icon: Palette },
    ];

    const SettingRowUI = ({ icon: Icon, title, subtitle, children }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--jp-border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--jp-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '1rem' }}>{title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--jp-text-muted)' }}>{subtitle}</p>
                </div>
            </div>
            <div style={{ paddingLeft: '1rem' }}>
                {children}
            </div>
        </div>
    );

    const CustomToggle = ({ state, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            style={{
                width: '46px', height: '26px', borderRadius: '13px', background: state ? 'var(--jp-primary)' : 'var(--jp-border)',
                border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', padding: 0
            }}
        >
            <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                position: 'absolute', top: '3px', left: state ? '23px' : '3px', transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
        </button>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header Area that matches Dashboard */}
            <div style={{ display: 'flex', gap: '2rem', flexDirection: window.innerWidth > 768 ? 'row' : 'column' }}>
                {/* Left Navigation */}
                <div style={{ width: window.innerWidth > 768 ? '260px' : '100%', flexShrink: 0 }}>
                    <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.85rem',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid transparent',
                                    background: activeSection === s.id ? 'var(--jp-primary)' : 'transparent',
                                    color: activeSection === s.id ? 'white' : 'var(--jp-text-main)',
                                    fontWeight: activeSection === s.id ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: activeSection === s.id ? '0 4px 15px rgba(99, 102, 241, 0.25)' : 'none',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeSection !== s.id) {
                                        e.currentTarget.style.background = 'var(--jp-bg-secondary)';
                                        e.currentTarget.style.borderColor = 'var(--jp-border)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeSection !== s.id) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }
                                }}
                            >
                                <s.icon size={20} style={{ opacity: activeSection === s.id ? 1 : 0.6 }} />
                                <span>{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Areas */}
                <form onSubmit={handleSave} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
                    <AnimatePresence mode="wait">
                        {activeSection === 'general' && (
                            <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                <div className="glass-panel" style={{ padding: '2rem', background: 'var(--jp-glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--jp-glass-border)', boxShadow: 'var(--jp-shadow)', borderRadius: '16px' }}>
                                    
                                    <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800, borderBottom: '2px solid var(--jp-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Webhook style={{ color: 'var(--jp-primary)' }} /> Core Settings
                                    </h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                                        <div className="jp-input-group">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--jp-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                <Monitor size={14} /> Portal Brand Name
                                            </label>
                                            <input
                                                value={settings.siteName}
                                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                                style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'var(--jp-bg-secondary)', border: '1.5px solid var(--jp-border)', color: 'var(--jp-text-main)', fontSize: '1rem', transition: 'border-color 0.2s' }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--jp-primary)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--jp-border)'}
                                            />
                                        </div>
                                        <div className="jp-input-group">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--jp-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                <Mail size={14} /> System Admin Email
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                value={settings.adminEmail}
                                                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                                style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'var(--jp-bg-secondary)', border: '1.5px solid var(--jp-border)', color: 'var(--jp-text-main)', fontSize: '1rem', transition: 'border-color 0.2s' }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--jp-primary)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--jp-border)'}
                                            />
                                        </div>
                                    </div>

                                    <SettingRowUI icon={AlertTriangle} title="Maintenance Mode" subtitle="Temporarily disable public access while deploying updates.">
                                        <CustomToggle state={settings.maintenanceMode} onClick={() => handleToggle('maintenanceMode')} />
                                    </SettingRowUI>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'security' && (
                            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                <div className="glass-panel" style={{ padding: '2rem', background: 'var(--jp-glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--jp-glass-border)', boxShadow: 'var(--jp-shadow)', borderRadius: '16px' }}>
                                    <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800, borderBottom: '2px solid var(--jp-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Lock style={{ color: 'var(--jp-primary)' }} /> Authentication & Access
                                    </h3>
                                    
                                    <SettingRowUI icon={Smartphone} title="Two-Factor Authentication (2FA)" subtitle="Require OTP in addition to password for all admin logins. Highly recommended.">
                                        <CustomToggle state={settings.twoFactorAuth} onClick={() => handleToggle('twoFactorAuth')} />
                                    </SettingRowUI>

                                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Key size={18} /> Administrative Password
                                        </h4>
                                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--jp-text-main)', opacity: 0.8 }}>Send a secure reset link to the system admin email.</p>
                                        <button type="button" style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', background: 'transparent', border: '1.5px solid #ef4444', color: '#ef4444', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white' }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444' }}>
                                            Reset Access Keys
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'notify' && (
                            <motion.div key="notify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                <div className="glass-panel" style={{ padding: '2rem', background: 'var(--jp-glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--jp-glass-border)', boxShadow: 'var(--jp-shadow)', borderRadius: '16px' }}>
                                    <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800, borderBottom: '2px solid var(--jp-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Bell style={{ color: 'var(--jp-primary)' }} /> Alert Configuration
                                    </h3>
                                    
                                    <SettingRowUI icon={Mail} title="System Delivery Alerts" subtitle="Send daily summaries and critical workflow notifications directly to your inbox.">
                                        <CustomToggle state={settings.notifications} onClick={() => handleToggle('notifications')} />
                                    </SettingRowUI>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'display' && (
                            <motion.div key="display" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                <div className="glass-panel" style={{ padding: '2rem', background: 'var(--jp-glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--jp-glass-border)', boxShadow: 'var(--jp-shadow)', borderRadius: '16px' }}>
                                    <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800, borderBottom: '2px solid var(--jp-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Palette style={{ color: 'var(--jp-primary)' }} /> Theming & Appearance
                                    </h3>
                                    
                                    <SettingRowUI icon={Moon} title="Force Global Dark Theme" subtitle="If active, overrides the user's OS preference and enforces the portal's dark aesthetic everywhere.">
                                        <CustomToggle state={settings.darkMode} onClick={() => handleToggle('darkMode')} />
                                    </SettingRowUI>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Global Save Action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '1rem 2.5rem', borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--jp-primary), var(--jp-secondary))', color: 'white', border: 'none',
                                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.05rem',
                                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)', opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {isLoading ? <Smartphone className="jp-spin" size={20} /> : <Save size={20} />}
                            {isLoading ? 'Synchronizing...' : 'Save Configuration'}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Simple AlertTriangle polyfill since it wasn't originally imported but makes sense contextually.
const AlertTriangle = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size||24} height={props.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export default AdminSettings;
