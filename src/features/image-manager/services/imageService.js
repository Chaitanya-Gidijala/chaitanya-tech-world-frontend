import config from '../../../config/apiConfig';

const AUTH_KEY = 'jp_admin_token';
const BASE_URL = `${config.API_BASE_URL}/admin/images`;

const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem(AUTH_KEY);
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const imageService = {
    getAllImages: async () => {
        const response = await fetch(BASE_URL, {
            headers: getHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }
        return await response.json();
    },

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload image');
        }
        return await response.json();
    },

    deleteImage: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        return await response.json();
    }
};
