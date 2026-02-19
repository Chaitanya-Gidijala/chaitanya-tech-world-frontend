import config from '../config';
import { getToken } from './authService';

const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const extractTagsFromTitle = (title) => {
    if (!title) return [];
    const tags = [];
    const normalizedTitle = title.toLowerCase();

    if (normalizedTitle.includes('java')) tags.push('Java');
    if (normalizedTitle.includes('react')) tags.push('React');
    if (normalizedTitle.includes('spring')) tags.push('Spring Boot');
    if (normalizedTitle.includes('javascript') || normalizedTitle.includes('js')) tags.push('JavaScript');
    if (normalizedTitle.includes('frontend')) tags.push('Frontend');
    if (normalizedTitle.includes('backend')) tags.push('Backend');
    if (normalizedTitle.includes('design') || normalizedTitle.includes('ui') || normalizedTitle.includes('ux')) tags.push('UI/UX');

    return tags;
};

// Async function to get summary counts
export const getPreparationSummary = async (jobTags) => {
    if (!jobTags || jobTags.length === 0) {
        return { questionCount: 0, testCount: 0, resourceCount: 0, topTechnologies: [] };
    }

    try {
        // We'll search by the first major tag or join them if API supports it.
        // Assuming API supports single tag search for now, getting data for the primary tech.
        // If API supported list of tags, we'd pass it.

        // For accurate counts, we might need a comprehensive search. 
        // Here we iterate or just pick the first tag to avoid over-fetching if API doesn't support OR logic.
        // Let's assume we search for one tag for simplicity of the prompt implementation request.
        const tag = jobTags[0];

        const [questionsRes, resourcesRes, quizzesRes] = await Promise.all([
            fetch(`${config.endpoints.interviewQuestions.search}?tag=${encodeURIComponent(tag)}`, { headers: getHeaders() }),
            fetch(`${config.endpoints.learningResources.search}?tag=${encodeURIComponent(tag)}`, { headers: getHeaders() }),
            fetch(`${config.endpoints.quizzes.search}?tag=${encodeURIComponent(tag)}`, { headers: getHeaders() })
        ]);

        const getData = async (res) => {
            if (!res.ok) return [];
            const json = await res.json();
            // Handle if response is paginated (e.g. spring data rest or custom pagination)
            return json.content || json || [];
        };

        const questions = await getData(questionsRes);
        const resources = await getData(resourcesRes);
        const quizzes = await getData(quizzesRes);

        return {
            questionCount: questions.length,
            testCount: quizzes.length,
            resourceCount: resources.length,
            topTechnologies: jobTags
        };
    } catch (error) {
        console.error("Failed to fetch prep summary:", error);
        return {
            questionCount: 0,
            testCount: 0,
            resourceCount: 0,
            topTechnologies: jobTags
        };
    }
};

export const getQuestionsByTags = async (tags, page = 0, size = 10) => {
    if (!tags || tags.length === 0) return { content: [], totalPages: 0, totalElements: 0 };
    try {
        const tag = tags[0];
        const response = await fetch(`${config.endpoints.interviewQuestions.search}?tag=${encodeURIComponent(tag)}&page=${page}&size=${size}`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        return data.content ? data : { content: data, totalPages: 1, totalElements: data.length };
    } catch (error) {
        console.warn("API fetch questions failed:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};


export const getQuizzesByTags = async (tags, page = 0, size = 10) => {
    if (!tags || tags.length === 0) return { content: [], totalPages: 0, totalElements: 0 };
    try {
        const tag = tags[0];
        const response = await fetch(`${config.endpoints.quizzes.search}?tag=${encodeURIComponent(tag)}&page=${page}&size=${size}`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const data = await response.json();
        return data.content ? data : { content: data, totalPages: 1, totalElements: data.length };
    } catch (error) {
        console.warn("API fetch quizzes failed:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};

export const getResourcesByTags = async (tags, page = 0, size = 10) => {
    if (!tags || tags.length === 0) return { content: [], totalPages: 0, totalElements: 0 };
    try {
        const tag = tags[0];
        const response = await fetch(`${config.endpoints.learningResources.search}?tag=${encodeURIComponent(tag)}&page=${page}&size=${size}`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        return data.content ? data : { content: data, totalPages: 1, totalElements: data.length };
    } catch (error) {
        console.warn("API fetch resources failed:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};



// --- Topics ---
export const getTopics = async () => {
    try {
        const response = await fetch(config.endpoints.topics.base, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch topics');
        const data = await response.json();
        // Return array directly if it's an array, or content if it's a page
        return Array.isArray(data) ? data : (data.content || []);
    } catch (error) {
        console.warn("API fetch topics failed:", error);
        return [];
    }
};

export const createTopic = async (data) => {
    const response = await fetch(config.endpoints.topics.base, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create topic');
    return await response.json();
};

export const updateTopic = async (id, data) => {
    const payload = { ...data, id };
    const response = await fetch(`${config.endpoints.topics.base}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to update topic');
    return await response.json();
};

export const deleteTopic = async (id) => {
    const response = await fetch(`${config.endpoints.topics.base}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete topic');
};

export const createTopicsBatch = async (data) => {
    const response = await fetch(config.endpoints.topics.batch, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create topics batch');
    return await response.json();
};

// --- Interview Questions ---
export const getAllQuestions = async (page = 0, size = 10, tag = '', difficulty = '') => {
    try {
        let url;
        const hasTag = tag && tag !== 'All';
        const hasDifficulty = difficulty && difficulty !== 'All';

        if (hasTag || hasDifficulty) {
            // Use combined search endpoint
            url = `${config.endpoints.interviewQuestions.search}?page=${page}&size=${size}`;
            if (hasTag) url += `&tag=${encodeURIComponent(tag)}`;
            if (hasDifficulty) url += `&difficulty=${encodeURIComponent(difficulty)}`;
        } else {
            // No filters: Use base endpoint
            url = `${config.endpoints.interviewQuestions.base}?page=${page}&size=${size}`;
        }

        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        return data.content ? data : { content: data, totalPages: 1, totalElements: data.length };
    } catch (error) {
        console.warn("❌ API fetch all questions failed:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};




export const createQuestion = async (data) => {
    const response = await fetch(config.endpoints.interviewQuestions.base, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create question');
    return await response.json();
};

export const updateQuestion = async (id, data) => {
    const payload = { ...data, id };
    const response = await fetch(`${config.endpoints.interviewQuestions.base}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to update question');
    return await response.json();
};

export const deleteQuestion = async (id) => {
    const response = await fetch(`${config.endpoints.interviewQuestions.base}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete question');
};

export const createQuestionsBatch = async (data) => {
    const response = await fetch(config.endpoints.interviewQuestions.batch, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.text(); // or .json() depending on backend error format
        throw new Error(`Batch create failed: ${err}`);
    }
    return await response.json();
};

// --- Learning Resources ---
export const getAllResources = async (page = 0, size = 10, tag = '', type = '') => {
    try {
        let url = `${config.endpoints.learningResources.base}?page=${page}&size=${size}`;
        if ((tag && tag !== 'All') || (type && type !== 'All')) {
            url = `${config.endpoints.learningResources.search}?page=${page}&size=${size}`;
            if (tag && tag !== 'All') url += `&tag=${encodeURIComponent(tag)}`;
            if (type && type !== 'All') url += `&type=${encodeURIComponent(type)}`;
        }
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        return data.content ? data : { content: data, totalPages: 1, totalElements: data.length };
    } catch (error) {
        console.warn("API fetch all resources failed:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};



export const createResource = async (data) => {
    const response = await fetch(config.endpoints.learningResources.base, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create resource');
    return await response.json();
};

export const updateResource = async (id, data) => {
    // Ensure the id is included in the payload, some backends require it for JPA updates
    const payload = { ...data, id };

    console.log(`🌐 API Call (Update Resource - ID: ${id}):`, {
        url: `${config.endpoints.learningResources.base}/${id}`,
        payload: payload
    });
    const response = await fetch(`${config.endpoints.learningResources.base}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        console.error('❌ Update Resource failed:', response.status, response.statusText);
        throw new Error('Failed to update resource');
    }
    return await response.json();
};

export const deleteResource = async (id) => {
    const response = await fetch(`${config.endpoints.learningResources.base}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete resource');
};

export const createResourcesBatch = async (data) => {
    // Assuming backend endpoint for batch exists or we loop. 
    // Plan assumes a batch endpoint:
    const response = await fetch(config.endpoints.learningResources.batch, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create resources batch');
    return await response.json();
};

// --- Quizzes ---
export const getAllQuizzes = async (page = 0, size = 10, tag = '') => {
    try {
        let url = `${config.endpoints.quizzes.base}?page=${page}&size=${size}`;
        if (tag && tag !== 'All') {
            url = `${config.endpoints.quizzes.search}?page=${page}&size=${size}&tag=${encodeURIComponent(tag)}`;
        }
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const data = await response.json();
        return data.content ? data : { content: data, totalPages: 1, totalElements: data.length };
    } catch (error) {
        console.warn("API fetch all quizzes failed:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};



export const getQuizById = async (id) => {
    try {
        const response = await fetch(`${config.endpoints.quizzes.base}/${id}`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch quiz');
        return await response.json();
    } catch (error) {
        console.warn("API fetch quiz by id failed:", error);
        return null;
    }
};

export const createQuiz = async (data) => {
    const response = await fetch(config.endpoints.quizzes.base, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create quiz');
    return await response.json();
};

export const updateQuiz = async (id, data) => {
    const payload = { ...data, id };
    const response = await fetch(`${config.endpoints.quizzes.base}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to update quiz');
    return await response.json();
};

export const deleteQuiz = async (id) => {
    const response = await fetch(`${config.endpoints.quizzes.base}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete quiz');
};


