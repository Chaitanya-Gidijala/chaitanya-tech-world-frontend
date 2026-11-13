import axios from 'axios';

import apiConfig from '../../../config/apiConfig';

const PROMPTS_URL = `${apiConfig.API_BASE_URL}/prompts`;
const REQUEST_TIMEOUT_MS = 15000;

// Helper to get auth header if using JWT
const getAuthHeaders = () => {
    const token = localStorage.getItem('jp_admin_token'); // Match the key used by authService
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

/**
 * Unwraps the various response envelopes the backend has used
 * (`[]`, `{ data: [] }`, `{ content: [] }`, `{ data: { content: [] } }`).
 */
export function normalizePromptList(res) {
    const payload = res?.data ?? res;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.content)) return payload.data.content;
    return [];
}

/** Unwraps a single prompt from `{ data: {...} }` or a bare object. */
export function normalizePrompt(res) {
    if (!res) return null;
    return res.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : res;
}

export const promptService = {
    getAllPrompts: async (page = 0, size = 20) => {
        const response = await axios.get(PROMPTS_URL, {
            params: { page, size },
            timeout: REQUEST_TIMEOUT_MS
        });
        return response.data; // Expecting { success: true, message: "...", data: { content: [...], totalPages: N } } format from backend
    },
    
    getPromptById: async (id) => {
        const response = await axios.get(`${PROMPTS_URL}/${id}`, { timeout: REQUEST_TIMEOUT_MS });
        return response.data;
    },
    
    createPrompt: async (promptData) => {
        const response = await axios.post(PROMPTS_URL, promptData, getAuthHeaders());
        return response.data;
    },
    
    updatePrompt: async (id, promptData) => {
        const response = await axios.put(`${PROMPTS_URL}/${id}`, promptData, getAuthHeaders());
        return response.data;
    },
    
    deletePrompt: async (id) => {
        const response = await axios.delete(`${PROMPTS_URL}/${id}`, getAuthHeaders());
        return response.data;
    }
};
