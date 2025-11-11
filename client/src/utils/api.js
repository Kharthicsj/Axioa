import axios from "axios";
import { getAuthToken, logout } from "./auth";
import config from "../config/config";

// Create axios instance
const api = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token is invalid or expired
            logout();
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);

// Project API functions
export const projectAPI = {
    // Create a new project
    createProject: async (projectData) => {
        const response = await api.post("/projects", projectData);
        return response.data;
    },

    // Get user's projects
    getUserProjects: async (params = {}) => {
        const response = await api.get("/projects", { params });
        return response.data;
    },

    // Get project by ID
    getProjectById: async (projectId) => {
        const response = await api.get(`/projects/${projectId}`);
        return response.data;
    },

    // Update project status
    updateProjectStatus: async (projectId, statusData) => {
        const response = await api.put(
            `/projects/${projectId}/status`,
            statusData
        );
        return response.data;
    },

    // Add progress update
    addProgressUpdate: async (projectId, updateData) => {
        const response = await api.post(
            `/projects/${projectId}/progress`,
            updateData
        );
        return response.data;
    },

    // Add communication message
    addCommunication: async (projectId, messageData) => {
        const response = await api.post(
            `/projects/${projectId}/communications`,
            messageData
        );
        return response.data;
    },

    // Get project communications
    getProjectCommunications: async (projectId) => {
        const response = await api.get(`/projects/${projectId}/communications`);
        return response.data;
    },

    // Mark communication as read
    markCommunicationAsRead: async (projectId, communicationId) => {
        const response = await api.patch(
            `/projects/${projectId}/communications/${communicationId}/read`
        );
        return response.data;
    },

    // Raise objection for project
    raiseObjection: async (projectId, objectionData) => {
        const response = await api.post(
            `/projects/${projectId}/objection`,
            objectionData
        );
        return response.data;
    },

    // Resolve objection for project
    resolveObjection: async (projectId, resolutionData) => {
        const response = await api.patch(
            `/projects/${projectId}/objection/resolve`,
            resolutionData
        );
        return response.data;
    },

    // Reject project with reasons
    rejectProjectWithReasons: async (projectId, rejectionData) => {
        const response = await api.post(
            `/projects/${projectId}/reject`,
            rejectionData
        );
        return response.data;
    },

    // Get project statistics
    getProjectStats: async (params = {}) => {
        const response = await api.get("/projects/stats", { params });
        return response.data;
    },

    // Search projects
    searchProjects: async (params = {}) => {
        const response = await api.get("/projects/search", { params });
        return response.data;
    },

    // Delete project
    deleteProject: async (projectId) => {
        const response = await api.delete(`/projects/${projectId}`);
        return response.data;
    },

    // Get available students
    getAvailableStudents: async (params = {}) => {
        const response = await api.get("/students/available", { params });
        return response.data;
    },
};

// Work Tracking API functions
export const workAPI = {
    // Create work record from project
    createWorkFromProject: async (projectId) => {
        const response = await api.post(`/projects/${projectId}/work`);
        return response.data;
    },

    // Get work record by project ID
    getWorkByProjectId: async (projectId) => {
        const response = await api.get(`/projects/${projectId}/work`);
        return response.data;
    },

    // Get user's work records
    getUserWorks: async (params = {}) => {
        const response = await api.get("/works", { params });
        return response.data;
    },

    // Get work statistics
    getWorkStats: async () => {
        const response = await api.get("/works/stats");
        return response.data;
    },

    // Update work status
    updateWorkStatus: async (workId, statusData) => {
        const response = await api.put(`/works/${workId}/status`, statusData);
        return response.data;
    },

    // Update work progress
    updateWorkProgress: async (workId, progressData) => {
        const response = await api.put(
            `/works/${workId}/progress`,
            progressData
        );
        return response.data;
    },

    // Add work update
    addWorkUpdate: async (workId, updateData) => {
        const response = await api.post(`/works/${workId}/updates`, updateData);
        return response.data;
    },

    // Submit work completion with proof
    submitWorkCompletion: async (workId, formData) => {
        const response = await api.post(
            `/works/${workId}/completion`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 60000, // 60 seconds for file upload
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(
                        `Work completion upload progress: ${percentCompleted}%`
                    );
                },
            }
        );
        return response.data;
    },

    // Submit student payment details
    submitStudentPaymentDetails: async (workId, formData) => {
        const response = await api.post(
            `/works/${workId}/payment-details`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 60000, // 60 seconds for file upload
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`UPI QR Upload progress: ${percentCompleted}%`);
                },
            }
        );
        return response.data;
    },

    // Submit client payment proof
    submitClientPaymentProof: async (workId, formData) => {
        const response = await api.post(
            `/works/${workId}/payment-proof`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },

    // Verify payment and unlock deliverables (Admin only)
    verifyPaymentAndUnlock: async (workId, verificationData) => {
        const response = await api.put(
            `/works/${workId}/verify-payment`,
            verificationData
        );
        return response.data;
    },

    // Student verify payment and complete work
    studentVerifyPaymentAndComplete: async (workId, verificationData) => {
        const response = await api.put(
            `/works/${workId}/student-verify-payment`,
            verificationData
        );
        return response.data;
    },

    // Add client review
    addClientReview: async (workId, reviewData) => {
        const response = await api.post(
            `/works/${workId}/client-review`,
            reviewData
        );
        return response.data;
    },

    // Get secured deliverables
    getSecuredDeliverables: async (workId) => {
        const response = await api.get(`/works/${workId}/deliverables`);
        return response.data;
    },

    // Get student performance data including reviews
    getStudentPerformance: async (workId) => {
        const response = await api.get(`/works/${workId}/student-performance`);
        return response.data;
    },

    // Get all student reviews from multiple clients
    getAllStudentReviews: async (workId) => {
        const response = await api.get(`/works/${workId}/all-student-reviews`);
        return response.data;
    },

    // Download file with proper authentication
    downloadFile: async (workId, fileType, fileName) => {
        const response = await api.get(
            `/works/${workId}/download/${fileType}/${encodeURIComponent(
                fileName
            )}`
        );
        return response.data;
    },
};

// Admin API functions for Projects and Works
export const adminAPI = {
    // Projects Management
    getAllProjects: async (params = {}) => {
        const response = await api.get("/admin/projects", { params });
        return response.data;
    },

    getProjectDetails: async (projectId) => {
        const response = await api.get(`/admin/projects/${projectId}`);
        return response.data;
    },

    updateProjectStatus: async (projectId, statusData) => {
        const response = await api.put(
            `/admin/projects/${projectId}/status`,
            statusData
        );
        return response.data;
    },

    // Works Management
    getAllWorks: async (params = {}) => {
        const response = await api.get("/admin/works", { params });
        return response.data;
    },

    getWorkDetails: async (workId) => {
        const response = await api.get(`/admin/works/${workId}`);
        return response.data;
    },

    updateWorkStatus: async (workId, statusData) => {
        const response = await api.put(
            `/admin/works/${workId}/status`,
            statusData
        );
        return response.data;
    },

    // Metrics and Analytics
    getProjectWorkMetrics: async () => {
        const response = await api.get("/admin/metrics/projects-works");
        return response.data;
    },
};

export default api;
