import React from 'react';

const AdminFooter = ({ sidebarOpen }) => {
    return (
        <footer style={{
            padding: '1.5rem 2rem',
            background: 'var(--jp-card-bg)',
            borderTop: '1px solid var(--jp-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--jp-text-muted)',
            fontSize: '0.85rem'
        }}>
            <div>
                &copy; {new Date().getFullYear()} <strong>FindSharp</strong> Admin Portal. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Support</a>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    footer {
                        margin-left: 0 !important;
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }
                }
            `}</style>
        </footer>
    );
};

export default AdminFooter;
