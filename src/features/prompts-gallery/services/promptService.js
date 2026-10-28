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
