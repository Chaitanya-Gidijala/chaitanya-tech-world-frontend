import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PlusCircle, List, Settings, BarChart3,
    Globe, HelpCircle, Book, ClipboardCheck,
    Hash, Home, Moon, Sun, MessageSquare, Heart,
    LogOut, X, ShieldCheck, Menu, CreditCard, Users, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { THEME_KEY } from '@/constants/theme';
import './AdminLayout.css';

const navGroups = [
    {
        label: 'Dashboard',
        items: [
            { id: 'overview', label: 'Hub Overview', icon: Home },
            { id: 'analytics', label: 'Traffic Stats', icon: BarChart3 },
        ]
    },
    {
        label: 'Job Center',
        items: [
            { id: 'create', label: 'Post New Job', icon: PlusCircle },
            { id: 'manage', label: 'Manage Jobs', icon: List },
        ]
    },
    {
        label: 'Prep & Learn',
        items: [
            { id: 'questions', label: 'Prep Questions', icon: HelpCircle },
            { id: 'topics', label: 'Core Topics', icon: Hash },
            { id: 'resources', label: 'PDF Library', icon: Book },
            { id: 'quizzes', label: 'Live Quizzes', icon: ClipboardCheck },
        ]
    },
    {
        label: 'Media & Prompts',
        items: [
            { id: 'prompts', label: 'Manage Prompts', icon: MessageSquare },
        ]
    },
    {
        label: 'CRM & Users',
        items: [
            { id: 'users', label: 'User Registry', icon: Users },
            { id: 'inquiries', label: 'Contact Inbox', icon: MessageSquare },
            { id: 'subscribers', label: 'Subscribers', icon: Mail },
        ]
    },
    {
        label: 'Finance',
        items: [
            { id: 'support', label: 'Contributions', icon: Heart },
            { id: 'payments', label: 'Transactions', icon: CreditCard },
        ]
    },
    {
        label: 'System',
        items: [
            { id: 'settings', label: 'Portal Config', icon: Settings },
        ]
    }
];

const AdminSidebar = ({ activeTab, onTabChange, isOpen, onToggle }) => {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const t = document.documentElement.getAttribute('data-theme');
        setIsDark(t === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark ? 'dark' : 'light';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    };

    const handleTabClick = (id) => {
        onTabChange(id);
        if (window.innerWidth <= 768) onToggle();
    };

    return (
        <aside className={`adm-sidebar ${isOpen ? 'is-open' : 'is-closed'}`}>
            <div className="adm-sidebar-header">
                <div className="adm-sidebar-brand">
                    <div className="adm-sidebar-logo">
                        <img src="/CTW.svg" alt="CTW" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 className="adm-sidebar-title">CTW Admin</h2>
                        <p className="adm-sidebar-subtitle">Control Panel</p>
                    </div>
                    <button 
                        className="adm-sidebar-close-mobile" 
                        onClick={onToggle}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <nav className="adm-sidebar-nav">
                {navGroups.map(group => (
                    <div key={group.label} className="adm-nav-group">
                        <p className="adm-nav-section-label">{group.label}</p>
                        {group.items.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                className={`adm-nav-item ${activeTab === id ? 'active' : ''}`}
                                onClick={() => handleTabClick(id)}
                            >
                                <span className="adm-nav-icon">
                                    <Icon size={14} />
                                </span>
                                <span className="adm-nav-label">{label}</span>
                                {id === 'inquiries' && <span className="adm-nav-badge">New</span>}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="adm-sidebar-footer">
                <button className="adm-theme-btn" onClick={toggleTheme} title="Toggle Theme">
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <button
                    className="adm-logout-btn"
                    onClick={() => { localStorage.clear(); navigate('/job-portal'); }}
                >
                    <LogOut size={13} /> Exit Portal
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
