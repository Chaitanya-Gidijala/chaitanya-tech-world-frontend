import config from '../../../config/apiConfig';

import { getToken } from './authService';
 
const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Increment the visitor count with metadata
export const incrementVisitorCount = async (metadata = {}) => {
    try {
        const response = await fetch(config.endpoints.analytics.visit, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(metadata)
        });
        if (!response.ok) throw new Error('Failed to increment visit count');
        return await response.json();
    } catch (error) {
        console.warn("Backend analytics failed, using local fallback:", error);

        // Mock fallback logic for demo purposes
        let count = parseInt(localStorage.getItem('jp_visitor_count') || '0');
        count++;
        localStorage.setItem('jp_visitor_count', count.toString());

        // Track browser stats in fallback
        if (metadata.browser) {
            let browserStats = JSON.parse(localStorage.getItem('jp_browser_stats') || '{}');
            browserStats[metadata.browser] = (browserStats[metadata.browser] || 0) + 1;
            localStorage.setItem('jp_browser_stats', JSON.stringify(browserStats));
        }

        return { count };
    }
};

// Get the total visitor count and insights
export const getVisitorStats = async () => {
    try {
        const response = await fetch(config.endpoints.analytics.stats, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to ensure analytics stats');
        const apiResponse = await response.json();
        return apiResponse.data || { totalViews: 0, uniqueVisitors: 0, browserStats: {} };
    } catch (error) {
        console.warn("Backend analytics fetch failed, using local fallback:", error);
        return {
            totalViews: parseInt(localStorage.getItem('jp_visitor_count') || '0'),
            uniqueVisitors: parseInt(localStorage.getItem('jp_unique_visitors') || '0'),
            browserStats: JSON.parse(localStorage.getItem('jp_browser_stats') || '{}')
        };
    }
};
