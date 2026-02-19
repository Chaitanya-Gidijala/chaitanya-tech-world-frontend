
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, BookOpen, User, Bell } from 'lucide-react';

const Header = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Jobs', path: '/job-portal', icon: <Briefcase size={20} /> },
        { name: 'Preparation', path: '/job-portal/prep', icon: <BookOpen size={20} /> }
    ];

    return (
        <header style={{
            height: '80px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5%',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <Link to="/job-portal" style={{ textDecoration: 'none', color: 'var(--jp-primary)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px' }}>
                    JOB PORTAL
                </Link>

                <nav style={{ display: 'flex', gap: '2rem' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                color: location.pathname === item.path ? 'var(--jp-primary)' : 'var(--jp-text-main)',
                                fontWeight: 600,
                                fontSize: '1rem',
                                transition: 'all 0.2s',
                                borderBottom: location.pathname === item.path ? '2px solid var(--jp-primary)' : '2px solid transparent',
                                padding: '0.5rem 0'
                            }}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--jp-text-muted)', cursor: 'pointer' }}>
                    <Bell size={22} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: '#f8fafc', borderRadius: '50px', cursor: 'pointer' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--jp-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        JD
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>John Doe</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
