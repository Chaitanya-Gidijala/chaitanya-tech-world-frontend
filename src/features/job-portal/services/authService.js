import config from '../../../config/apiConfig';

const AUTH_KEY = 'jp_admin_token';

/**
 * Handle user login via backend
 */
export const login = async (usernameOrEmail, password) => {
    const response = await fetch(config.endpoints.auth.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('Login failed:', response.status, result);
        // Throw the real message from the backend if available
        throw new Error(result.message || 'Invalid credentials');
    }

    // Backend returns ApiResponse<JwtAuthResponse>
    // Token is inside result.data.accessToken
    const token = result.data?.accessToken;
    
    if (token) {
        localStorage.setItem(AUTH_KEY, token);
        // Optional: save user info if needed
        if (result.data.user) {
            localStorage.setItem('jp_user', JSON.stringify(result.data.user));
        }
        console.log('Login successful, session initialized');
    } else {
        console.error('Login succeeded but no token was provided in response');
        throw new Error('Authentication failed: No token received');
    }

    return token;
};

/**
 * Handle user registration via backend
 */
export const register = async (name, email, password) => {
    const response = await fetch(config.endpoints.auth.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name, 
            email, 
            password,
            username: email.split('@')[0]
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('Registration failed:', response.status, result);
        throw new Error(result.message || 'Registration failed');
    }

    return result;
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('jp_user');
};

export const getToken = () => {
    return localStorage.getItem(AUTH_KEY);
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('jp_user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const isAdmin = () => {
    const user = getCurrentUser();
    // Roles are typically stored as strings in an array/set like ['ROLE_ADMIN', 'ROLE_USER']
    return user && user.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ADMIN'));
};
export const getUserCount = async () => {
    try {
        const response = await fetch(config.endpoints.users.count, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch user count');
        const result = await response.json();
        return result.data || 0;
    } catch (error) {
        console.error('Error fetching user count:', error);
        return 0;
    }
};
