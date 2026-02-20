const API_HOST = 'https://job-portal-backend-world.onrender.com/api';
const AUTH_HOST = 'https://job-portal-backend-world.onrender.com/api/auth';

const config = {
    // Legacy support (careful not to break existing jobService)
    API_BASE_URL: `${API_HOST}/jobs`,
    AUTH_API_URL: AUTH_HOST,

    // Unified API Config
    endpoints: {
        jobs: {
            base: `${API_HOST}/jobs`,
            search: `${API_HOST}/jobs/search`,
            latest: `${API_HOST}/jobs/latest`,
            batch: `${API_HOST}/jobs/batch`
        },
        interviewQuestions: {
            base: `${API_HOST}/interview-questions`,
            batch: `${API_HOST}/interview-questions/batch`,
            byJob: (jobId) => `${API_HOST}/interview-questions/job/${jobId}`,
            byDifficulty: (difficulty) => `${API_HOST}/interview-questions/difficulty/${difficulty}`,
            search: `${API_HOST}/interview-questions/search`
        },
        learningResources: {
            base: `${API_HOST}/learning-resources`,
            batch: `${API_HOST}/learning-resources/batch`,
            byJob: (jobId) => `${API_HOST}/learning-resources/job/${jobId}`,
            search: `${API_HOST}/learning-resources/search`
        },
        quizzes: {
            base: `${API_HOST}/quizzes`,
            byJob: (jobId) => `${API_HOST}/quizzes/job/${jobId}`,
            search: `${API_HOST}/quizzes/search`
        },
        topics: {
            base: `${API_HOST}/topics`,
            batch: `${API_HOST}/topics/batch`
        }
    }
};

export default config;