import express from "express";
import {
    Signin,
    Signup,
    GetProfile,
    UpdateProfile,
    ChangePassword,
    DeleteAccount,
    UpdateSettings,
    ForgotPasswordOTPController,
    ResetPassword,
} from "../controllers/Users/Auth.js";
import {
    authenticateToken,
    requireAdmin,
    requireStudentOrAdmin,
} from "../middlewares/auth.js";
import {
    uploadProfilePicture,
    handleUploadError,
} from "../middlewares/upload.js";
import {
    getStudentApplication,
    saveStudentApplication,
    uploadIdentityDocument,
    uploadCollegeIdDocument,
    submitApplication,
    checkProfileCompletion,
} from "../controllers/Students/StudentController.js";
import {
    getAllStudentApplications,
    getStudentApplicationById,
    updateApplicationStatus,
    getApplicationsStats,
} from "../controllers/Admin/AdminController.js";
import {
    getApprovedStudents,
    getStudentPerformance,
    getStudentWorkRecords,
    terminateStudent,
    assignProject,
    addReview,
    updatePerformanceMetrics,
} from "../controllers/Admin/StudentPerformanceController.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
    deleteUser,
    updateUserRole,
    getUserStats,
} from "../controllers/Admin/UserManagementController.js";
import {
    getDashboardStats,
    getRecentActivity,
    getSystemHealth,
} from "../controllers/Admin/AdminDashboardController.js";
import { fetchAvailableStudents } from "../controllers/Project/FetchAvailableStudents.js";
import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProjectStatus,
    addProgressUpdate,
    addCommunication,
    getProjectCommunications,
    markCommunicationAsRead,
    raiseObjection,
    resolveObjection,
    rejectProject,
    getProjectStats,
    searchProjects,
    deleteProject,
} from "../controllers/Project/ProjectsController.js";
import {
    createWorkFromProject,
    getWorkByProjectId,
    getUserWorks,
    updateWorkStatus,
    updateWorkProgress,
    addWorkUpdate,
    getWorkStats,
    submitWorkCompletion,
    submitStudentPaymentDetails,
    submitClientPaymentProof,
    verifyPaymentAndUnlock,
    studentVerifyPaymentAndComplete,
    addClientReview,
    getSecuredDeliverables,
    getStudentPerformanceForWork,
    getAllStudentReviews,
    downloadFile,
} from "../controllers/Project/WorkTrackerController.js";
import {
    uploadWorkDeliverables,
    uploadPaymentProof,
    uploadUpiQr,
} from "../config/cloudinary.js";
import {
    getAllProjects as adminGetAllProjects,
    getAllWorks as adminGetAllWorks,
    getProjectDetails as adminGetProjectDetails,
    getWorkDetails as adminGetWorkDetails,
    updateProjectStatus as adminUpdateProjectStatus,
    updateWorkStatus as adminUpdateWorkStatus,
    getProjectWorkMetrics,
} from "../controllers/Admin/AdminProjectWorkController.js";
import path from "path";

const router = express.Router();

// Public routes
router.get("/", (req, res) => {
    res.send("Server Set up successfully...");
});

router.post("/signup", Signup);
router.post("/signin", Signin);

// Forgot Password routes
router.post("/auth/forgot-password", ForgotPasswordOTPController);
router.post("/auth/reset-password", ResetPassword);

// Auth routes - Profile Management
router.get("/auth/profile", authenticateToken, GetProfile);
router.put(
    "/auth/profile",
    authenticateToken,
    uploadProfilePicture,
    handleUploadError,
    UpdateProfile
);
router.put("/auth/change-password", authenticateToken, ChangePassword);
router.delete("/auth/delete-account", authenticateToken, DeleteAccount);
router.put("/auth/settings", authenticateToken, UpdateSettings);

// Static file serving for uploads
router.use("/uploads", express.static("uploads"));

// Admin - Dashboard
router.get(
    "/admin/dashboard/stats",
    authenticateToken,
    requireAdmin,
    getDashboardStats
);
router.get(
    "/admin/dashboard/activity",
    authenticateToken,
    requireAdmin,
    getRecentActivity
);
router.get(
    "/admin/dashboard/health",
    authenticateToken,
    requireAdmin,
    getSystemHealth
);

// Admin - User Management
router.get("/admin/users", authenticateToken, requireAdmin, getAllUsers);
router.get("/admin/users/stats", authenticateToken, requireAdmin, getUserStats);
router.get("/admin/users/:id", authenticateToken, requireAdmin, getUserById);
router.put("/admin/users/:id", authenticateToken, requireAdmin, updateUser);
router.patch(
    "/admin/users/:id/toggle-status",
    authenticateToken,
    requireAdmin,
    toggleUserStatus
);
router.patch(
    "/admin/users/:id/role",
    authenticateToken,
    requireAdmin,
    updateUserRole
);
router.delete("/admin/users/:id", authenticateToken, requireAdmin, deleteUser);

// Admin - Student Applications Management
router.get(
    "/admin/applications",
    authenticateToken,
    requireAdmin,
    getAllStudentApplications
);
router.get(
    "/admin/applications/stats",
    authenticateToken,
    requireAdmin,
    getApplicationsStats
);
router.get(
    "/admin/applications/:id",
    authenticateToken,
    requireAdmin,
    getStudentApplicationById
);
router.put(
    "/admin/applications/:id/status",
    authenticateToken,
    requireAdmin,
    updateApplicationStatus
);

// Admin - Student Performance Management
router.get(
    "/admin/students/approved",
    authenticateToken,
    requireAdmin,
    getApprovedStudents
);
router.get(
    "/admin/students/:studentId/performance",
    authenticateToken,
    requireAdmin,
    getStudentPerformance
);
router.get(
    "/admin/students/:studentId/work-records",
    authenticateToken,
    requireAdmin,
    getStudentWorkRecords
);
router.post(
    "/admin/students/:studentId/terminate",
    authenticateToken,
    requireAdmin,
    terminateStudent
);
router.post(
    "/admin/students/:studentId/assign-project",
    authenticateToken,
    requireAdmin,
    assignProject
);
router.post(
    "/admin/students/:studentId/add-review",
    authenticateToken,
    requireAdmin,
    addReview
);
router.put(
    "/admin/students/:studentId/performance-metrics",
    authenticateToken,
    requireAdmin,
    updatePerformanceMetrics
);

// Admin - Projects and Works Management
router.get(
    "/admin/projects",
    authenticateToken,
    requireAdmin,
    adminGetAllProjects
);
router.get(
    "/admin/projects/:projectId",
    authenticateToken,
    requireAdmin,
    adminGetProjectDetails
);
router.put(
    "/admin/projects/:projectId/status",
    authenticateToken,
    requireAdmin,
    adminUpdateProjectStatus
);
router.get("/admin/works", authenticateToken, requireAdmin, adminGetAllWorks);
router.get(
    "/admin/works/:workId",
    authenticateToken,
    requireAdmin,
    adminGetWorkDetails
);
router.put(
    "/admin/works/:workId/status",
    authenticateToken,
    requireAdmin,
    adminUpdateWorkStatus
);
router.get(
    "/admin/metrics/projects-works",
    authenticateToken,
    requireAdmin,
    getProjectWorkMetrics
);

// Student and Admin routes
router.get(
    "/student/dashboard",
    authenticateToken,
    requireStudentOrAdmin,
    (req, res) => {
        res.json({
            error: false,
            success: true,
            message: "Student dashboard data retrieved successfully",
            user: req.user,
        });
    }
);

// Student Application routes
router.get("/student/application", authenticateToken, getStudentApplication);
router.put("/student/application", authenticateToken, saveStudentApplication);
router.post(
    "/student/application/upload-identity",
    authenticateToken,
    uploadIdentityDocument
);
router.post(
    "/student/application/upload-college-id",
    authenticateToken,
    uploadCollegeIdDocument
);
router.post(
    "/student/application/submit",
    authenticateToken,
    submitApplication
);
router.get(
    "/student/application/completion",
    authenticateToken,
    checkProfileCompletion
);

// Project routes - Available Students
router.get("/students/available", authenticateToken, fetchAvailableStudents);

// Project Management routes
router.post("/projects", authenticateToken, createProject);
router.get("/projects", authenticateToken, getUserProjects);
router.get("/projects/search", authenticateToken, searchProjects);
router.get("/projects/stats", authenticateToken, getProjectStats);
router.get("/projects/:projectId", authenticateToken, getProjectById);
router.put(
    "/projects/:projectId/status",
    authenticateToken,
    updateProjectStatus
);
router.post(
    "/projects/:projectId/progress",
    authenticateToken,
    addProgressUpdate
);
router.post(
    "/projects/:projectId/communications",
    authenticateToken,
    addCommunication
);
router.get(
    "/projects/:projectId/communications",
    authenticateToken,
    getProjectCommunications
);
router.patch(
    "/projects/:projectId/communications/:communicationId/read",
    authenticateToken,
    markCommunicationAsRead
);
router.post(
    "/projects/:projectId/objection",
    authenticateToken,
    raiseObjection
);
router.patch(
    "/projects/:projectId/objection/resolve",
    authenticateToken,
    resolveObjection
);
router.post("/projects/:projectId/reject", authenticateToken, rejectProject);
router.delete("/projects/:projectId", authenticateToken, deleteProject);

// Work Tracking routes
router.post(
    "/projects/:projectId/work",
    authenticateToken,
    createWorkFromProject
);
router.get("/projects/:projectId/work", authenticateToken, getWorkByProjectId);
router.get("/works", authenticateToken, getUserWorks);
router.get("/works/stats", authenticateToken, getWorkStats);
router.put("/works/:workId/status", authenticateToken, updateWorkStatus);
router.put("/works/:workId/progress", authenticateToken, updateWorkProgress);
router.post("/works/:workId/updates", authenticateToken, addWorkUpdate);

// Work Completion and Payment routes
router.post(
    "/works/:workId/completion",
    authenticateToken,
    uploadWorkDeliverables.array("completionFiles", 10),
    submitWorkCompletion
);
router.post(
    "/works/:workId/payment-details",
    authenticateToken,
    uploadUpiQr.single("upiQrCode"),
    submitStudentPaymentDetails
);
router.post(
    "/works/:workId/payment-proof",
    authenticateToken,
    uploadPaymentProof.single("paymentProof"),
    submitClientPaymentProof
);
router.put(
    "/works/:workId/verify-payment",
    authenticateToken,
    requireAdmin,
    verifyPaymentAndUnlock
);
router.put(
    "/works/:workId/student-verify-payment",
    authenticateToken,
    studentVerifyPaymentAndComplete
);
router.post("/works/:workId/client-review", authenticateToken, addClientReview);
router.get(
    "/works/:workId/deliverables",
    authenticateToken,
    getSecuredDeliverables
);
router.get(
    "/works/:workId/student-performance",
    authenticateToken,
    getStudentPerformanceForWork
);
router.get(
    "/works/:workId/all-student-reviews",
    authenticateToken,
    getAllStudentReviews
);
router.get(
    "/works/:workId/download/:fileType/:fileName",
    authenticateToken,
    downloadFile
);

export default router;
