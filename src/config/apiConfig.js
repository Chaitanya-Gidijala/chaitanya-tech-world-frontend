// Dynamically determine the local backend IP if testing on a local network (e.g., from a mobile phone)
let defaultApiHost = 'https://job-portal-backend-world-4ay3.onrender.com/api';
let defaultAuthHost = 'https://security-service-chaitanyatechworld.onrender.com/api/v1/auth';

if (import.meta.env.DEV && window.location.hostname !== 'localhost') {
    defaultApiHost = `http://${window.location.hostname}:8080/api`;
    defaultAuthHost = `http://${window.location.hostname}:8085/api/v1/auth`;
}

const API_HOST = import.meta.env.VITE_API_HOST || defaultApiHost;
const AUTH_HOST = import.meta.env.VITE_AUTH_HOST || defaultAuthHost;

const config = {
    API_BASE_URL: API_HOST,
    AUTH_API_URL: AUTH_HOST,


    endpoints: {
        jobs: {
            base: `${API_HOST}/jobs`,
            search: `${API_HOST}/jobs/search`,
            latest: `${API_HOST}/jobs/latest`,
            batch: `${API_HOST}/jobs/batch`,
            byTitle: (title) => `${API_HOST}/jobs/title/${title}`,
            byTitleAndId: (title, id) => `${API_HOST}/jobs/title/${title}/id/${id}`,
            byId: (id) => `${API_HOST}/jobs/${id}`
        },
        interviewQuestions: {
            base: `${API_HOST}/interview-questions`,
            batch: `${API_HOST}/interview-questions/batch`,
            byJob: (jobId) => `${API_HOST}/interview-questions/job/${jobId}`,
            byDifficulty: (difficulty) => `${API_HOST}/interview-questions/difficulty/${difficulty}`,
            search: `${API_HOST}/interview-questions/search`,
            byId: (id) => `${API_HOST}/interview-questions/${id}`
        },
        learningResources: {
            base: `${API_HOST}/learning-resources`,
            batch: `${API_HOST}/learning-resources/batch`,
            byJob: (jobId) => `${API_HOST}/learning-resources/job/${jobId}`,
            search: `${API_HOST}/learning-resources/search`,
            byId: (id) => `${API_HOST}/learning-resources/${id}`
        },
        quizzes: {
            base: `${API_HOST}/quizzes`,
            byJob: (jobId) => `${API_HOST}/quizzes/job/${jobId}`,
            search: `${API_HOST}/quizzes/search`,
            byId: (id) => `${API_HOST}/quizzes/${id}`
        },
        topics: {
            base: `${API_HOST}/topics`,
            batch: `${API_HOST}/topics/batch`,
            byId: (id) => `${API_HOST}/topics/${id}`
        },
        contact: {
            submit: `${API_HOST}/contact/submit`,
            all: `${API_HOST}/contact/all`,
            byId: (id) => `${API_HOST}/contact/${id}`
        },
        analytics: {
            visit: `${API_HOST}/analytics/visit`,
            stats: `${API_HOST}/analytics/stats`
        },
        auth: {
            login: `${AUTH_HOST}/login`,
            register: `${AUTH_HOST}/register`,
            me: `${AUTH_HOST.replace('/auth', '/users')}/me`
        },
        users: {
            base: `${AUTH_HOST.replace('/auth', '/users')}`,
            count: `${AUTH_HOST.replace('/auth', '/users')}/count`
        },
        userProfile: {
            resumes: `${API_HOST}/user/profile/resumes`,
            payments: `${API_HOST}/user/profile/payments`
        },
        payments: {
            createOrder: `${API_HOST}/payments/create-order`,
            verifyPayment: `${API_HOST}/payments/verify-payment`
        }
    }
};

export default config;
