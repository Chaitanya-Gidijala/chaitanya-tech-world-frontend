import config from '../config';
import { JOB_RESOURCES } from '../data/jobResources';

import { getToken } from './authService';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log('Current headers:', headers); // Uncomment for deep debugging
    return headers;
};

export const postJob = async (jobData) => {
    const response = await fetch(`${config.API_BASE_URL}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobData),
    });
    if (!response.ok) throw new Error('Failed to post job');
    return await response.json();
};

export const postBatchJobs = async (jobsArray) => {
    const response = await fetch(`${config.API_BASE_URL}/batch`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobsArray),
    });
    if (!response.ok) throw new Error('Failed to post batch jobs');
    return await response.json();
};

export const getJobByTitle = async (title) => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/title/${title}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch job by title');
        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error) {
        console.warn("Backend fetch by title failed:", error);
        return null;
    }
};

export const getJobByTitleAndId = async (title, id) => {
    try {
        // New API endpoint: /api/jobs/title/{jobTitle}/id/{id}
        const response = await fetch(`${config.API_BASE_URL}/title/${title}/id/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch job by title and id');
        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error) {
        console.warn("Backend fetch by title and id failed:", error);
        // Fallback to getJobById if the combined endpoint fails
        return getJobById(id);
    }
};

// Mock data for fallback testing or when backend is offline
const MOCK_JOBS = [
    {
        id: 1,
        jobTitle: "Senior React Developer",
        company: "TechNova Solutions",
        location: "Remote",
        jobDetails: "We are looking for an experienced React developer to lead our frontend team. You will be responsible for...",
        experienceRequired: "5+ years",
        salary: "₹3,20,000 - ₹5,50,000",
        jobType: "Full-time",
        postedAt: "2025-12-15T10:00:00",
        companyLogo: "https://ui-avatars.com/api/?name=Tech+Nova&background=6366f1&color=fff"
    },
    {
        id: 2,
        jobTitle: "Java Backend Engineer",
        company: "DataSystems Inc",
        location: "New York, NY",
        jobDetails: "Join our backend team to build scalable microservices using Spring Boot...",
        experienceRequired: "3-5 years",
        salary: "₹4,10,000 - ₹6,40,000",
        jobType: "Hybrid",
        postedAt: "2025-12-16T14:30:00",
        companyLogo: "https://ui-avatars.com/api/?name=Data+Systems&background=10b981&color=fff"
    },
    {
        id: 3,
        jobTitle: "UI/UX Designer",
        company: "Creative Studio",
        location: "Austin, TX",
        jobDetails: "We need a visionary designer to craft beautiful user experiences...",
        experienceRequired: "2+ years",
        salary: "₹2,80,000 - ₹3,50,000",
        jobType: "Contract",
        postedAt: "2025-12-18T09:15:00",
        companyLogo: "https://ui-avatars.com/api/?name=Creative+Studio&background=f43f5e&color=fff"
    }
];

export const getAllJobs = async () => {
    try {
        const response = await fetch(`${config.API_BASE_URL}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const apiResponse = await response.json();

        // Extract jobs array and sort by latest first (ID descending)
        const jobs = apiResponse.data || [];
        return [...jobs].sort((a, b) => b.id - a.id);
    } catch (error) {
        console.warn("Backend fetch failed, using mock data:", error);
        return MOCK_JOBS;
    }
};

export const getJobById = async (id) => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch job');
        const apiResponse = await response.json();

        // Extract job data from ApiResponse structure
        const jobData = apiResponse.data;

        // Merge with job resources (MCQ, interview questions, resources)
        return {
            ...jobData,
            ...(JOB_RESOURCES[jobData.id] || {})
        };
    } catch (error) {
        console.warn("Backend fetch failed, using mock data:", error);
        const jobRaw = MOCK_JOBS.find(j => j.id === parseInt(id));
        if (jobRaw) {
            return {
                ...jobRaw,
                ...(JOB_RESOURCES[jobRaw.id] || {})
            };
        }
        return null;
    }
};

export const searchJobs = async (criteria) => {
    try {
        const params = new URLSearchParams();
        if (criteria.keyword) params.append('keyword', criteria.keyword);
        if (criteria.location) params.append('location', criteria.location);
        // Add other criteria as needed

        const response = await fetch(`${config.API_BASE_URL}/search?${params.toString()}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to search jobs');
        const apiResponse = await response.json();

        // Handle paginated response and sort by latest
        const pageData = apiResponse.data;
        const jobs = pageData.content || pageData || [];
        return [...jobs].sort((a, b) => b.id - a.id);
    } catch (error) {
        console.warn("Backend search failed, using mock data filter:", error);
        return MOCK_JOBS.filter(j =>
            (!criteria.keyword || j.jobTitle.toLowerCase().includes(criteria.keyword.toLowerCase())) &&
            (!criteria.location || j.location.toLowerCase().includes(criteria.location.toLowerCase()))
        );
    }
};

export const getLatestJobs = async () => {
    try {
        const response = await fetch(`${config.API_BASE_URL}/latest`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch latest jobs');
        const apiResponse = await response.json();

        // Extract jobs array from ApiResponse structure
        return apiResponse.data || [];
    } catch (error) {
        console.error("Error fetching latest jobs:", error);
        return MOCK_JOBS.slice(0, 2);
    }
};

export const updateJob = async (id, jobData) => {
    const response = await fetch(`${config.API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(jobData),
    });
    if (!response.ok) throw new Error('Failed to update job');
    const apiResponse = await response.json();
    return apiResponse.data;
};

export const deleteJob = async (id) => {
    const response = await fetch(`${config.API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete job');

    // Handle 204 No Content or empty responses
    if (response.status === 204) return null;

    try {
        return await response.json();
    } catch (e) {
        return null;
    }
};

