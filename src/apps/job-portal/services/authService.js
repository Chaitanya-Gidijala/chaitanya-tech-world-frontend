import config from '../config';

const AUTH_KEY = 'jp_admin_token';

export const login = async (usernameOrEmail, password) => {
    const response = await fetch(`${config.AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Login failed with status:', response.status, errorText);
        throw new Error('Invalid credentials');
    }

    // Capture the response as text since the backend returns a raw JWT string
    const token = await response.text();
    console.log('Login successful, token received');

    if (token && token.length > 20) { // Basic check to ensure it looks like a token
        localStorage.setItem(AUTH_KEY, token);
        console.log('Token saved to localStorage');
    } else {
        console.warn('Response received but it does not look like a valid token string.');
    }
    return token;
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const getToken = () => {
    return localStorage.getItem(AUTH_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};
