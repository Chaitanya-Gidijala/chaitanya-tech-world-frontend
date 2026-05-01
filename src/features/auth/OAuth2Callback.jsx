import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { loadUserProfile } from '../job-portal/services/authService';

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get token from URL query parameters
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (token) {
                    // Store token in localStorage
                    localStorage.setItem('jp_admin_token', token);
                    
                    // Fetch user profile to ensure session is fully initialized
                    const user = await loadUserProfile();
                    
                    console.log('OAuth2 login successful, redirecting...');
                    
                    // Redirect based on user role
                    if (user && (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ADMIN'))) {
                        navigate('/AdminPortal/admin/dashboard', { replace: true });
                    } else {
                        navigate('/profile', { replace: true });
                    }
                } else {
                    console.error('No token found in OAuth2 callback URL');
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('Error during OAuth2 callback processing:', error);
                navigate('/login', { replace: true });
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--iq-auth-bg)',
            color: 'var(--iq-text)'
        }}>
            <Loader2 className="animate-spin" size={48} style={{ color: 'var(--iq-primary)', marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Authenticating...</h2>
            <p style={{ color: 'var(--iq-text-muted)', marginTop: '0.5rem' }}>Please wait while we secure your session.</p>
        </div>
    );
};

export default OAuth2Callback;
