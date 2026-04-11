import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, List, Settings, BarChart3,
    Globe, HelpCircle, Book, ClipboardCheck,
    Hash, Home, Moon, Sun, MessageSquare,
    LogOut, X, ShieldCheck, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const navGroups = [
    {
        label: 'Main',
        items: [
            { id: 'overview',  label: 'Overview',       icon: Home },
        ]
    },
    {
        label: 'Job Management',
        items: [
            { id: 'create',    label: 'Post a Job',     icon: PlusCircle },
            { id: 'manage',    label: 'Manage Jobs',    icon: List },
        ]
    },
    {
        label: 'Prep Hub',
        items: [
            { id: 'questions', label: 'Questions',      icon: HelpCircle },
            { id: 'topics',    label: 'Topics',         icon: Hash },
            { id: 'resources', label: 'Resources',      icon: Book },
            { id: 'quizzes',   label: 'Quizzes',        icon: ClipboardCheck },
        ]
    },
    {
        label: 'Insights',
        items: [
            { id: 'analytics', label: 'Analytics',      icon: BarChart3 },
            { id: 'inquiries', label: 'Inquiries',       icon: MessageSquare },
        ]
    },
    {
        label: 'System',
        items: [
            { id: 'settings',  label: 'Settings',       icon: Settings },
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
        localStorage.setItem('jp-theme', newTheme);
    };

    const handleTabClick = (id) => {
        onTabChange(id);
        if (window.innerWidth <= 768) onToggle();
    };

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`adm-backdrop ${isOpen ? 'visible' : ''}`}
                onClick={onToggle}
            />

            {/* Sidebar */}
            <motion.aside
                className={`adm-sidebar ${isOpen ? 'is-open' : 'is-closed'}`}
                initial={false}
            >
                {/* Brand Header */}
                <div className="adm-sidebar-header">
                    <div className="adm-sidebar-brand">
                        <div className="adm-sidebar-logo">
                            <img src="/CTW.svg" alt="CTW" />
                        </div>
                        <div>
                            <h2 className="adm-sidebar-title">Admin Portal</h2>
                        </div>
                    </div>
                    <p className="adm-sidebar-subtitle">Chaitanya Tech World</p>
                </div>

                {/* Navigation */}
                <nav className="adm-sidebar-nav">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            <p className="adm-nav-section-label">{group.label}</p>
                            {group.items.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    className={`adm-nav-item ${activeTab === id ? 'active' : ''}`}
                                    onClick={() => handleTabClick(id)}
                                >
                                    <span className="adm-nav-icon">
                                        <Icon size={16} />
                                    </span>
                                    <span className="adm-nav-label">{label}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="adm-sidebar-footer">
                    <button className="adm-theme-btn" onClick={toggleTheme} title="Toggle Theme">
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        className="adm-logout-btn"
                        onClick={() => { localStorage.clear(); navigate('/job-portal'); }}
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
