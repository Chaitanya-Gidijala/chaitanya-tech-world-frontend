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

/**
 * Fetches all contact inquiries from the backend.
 * @returns {Promise<Array>} List of contact inquiries.
 */
export const getAllInquiries = async () => {
    try {
        const response = await fetch(`${config.endpoints.contact.all}`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // Assuming ApiResponse structure: { success: true, message: "...", data: [...] }
        return data.data || [];
    } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        throw error;
    }
};

/**
 * Fetches details for a single inquiry.
 * @param {number|string} id Inquiry ID.
 * @returns {Promise<Object>} Inquiry details.
 */
export const getInquiryById = async (id) => {
    try {
        const response = await fetch(`${config.endpoints.contact.byId(id)}`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Failed to fetch inquiry ${id}:`, error);
        throw error;
    }
};
