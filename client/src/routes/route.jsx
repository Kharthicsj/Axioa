import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../pages/Homepage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthGuard from "../components/AuthGuard";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/AdminPanel/AdminDashboard";
import StudentApplications from "../pages/AdminPanel/StudentApplications";
import ApprovedStudents from "../pages/AdminPanel/ApprovedStudents";
import AllUsers from "../pages/AdminPanel/AllUsers";
import Projects from "../pages/AdminPanel/Projects";
import Works from "../pages/AdminPanel/Works";

import ApplicationDetailView from "../pages/AdminPanel/ApplicationDetailView";
import StudentTracking from "../pages/AdminPanel/StudentTracking";
import ApplyForStudent from "../pages/ApplyforStudent";
import ForgotPassword from "../pages/ForgotPassword";
import Services from "../pages/Services/Services";
import WebDevelopment from "../pages/Services/WebDevelopment";
import AppDevelopment from "../pages/Services/AppDevelopment";
import ResumeServices from "../pages/Services/ResumeServices";
import CADModelling from "../pages/Services/CADModelling";
import UIUXDesign from "../pages/Services/UIUXDesign";
import DataAnalysis from "../pages/Services/DataAnalysis";
import ContentWriting from "../pages/Services/ContentWriting";
import StudentSelection from "../pages/Services/StudentSelection";
import ErrorBoundary from "../components/ErrorBoundary";
import NotFound from "../pages/NotFound";
import StudentProtectedRoute from "../components/StudentProtectedRoute";
import ProjectDashboard from "../pages/Students/ProjectDashboard";
import MyWorks from "../pages/Students/MyWorks";
import AssignedWorks from "../pages/AssignedWorks";
import AssignedWorkStatus from "../pages/AssignedWorkStatus";
import ProjectsList from "../components/ProjectsList";
import ProjectDetailsPage from "../pages/ProjectDetailsPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Homepage />,
            },
            {
                path: "signin",
                element: (
                    <AuthGuard>
                        <Signin />
                    </AuthGuard>
                ),
            },
            {
                path: "signup",
                element: (
                    <AuthGuard>
                        <Signup />
                    </AuthGuard>
                ),
            },
            {
                path: "forgot-password",
                element: (
                    <AuthGuard>
                        <ForgotPassword />
                    </AuthGuard>
                ),
            },
            {
                path: "services",
                element: <Services />,
            },
            {
                path: "services/web-development",
                element: <WebDevelopment />,
            },
            {
                path: "services/app-development",
                element: <AppDevelopment />,
            },
            {
                path: "services/resume-services",
                element: <ResumeServices />,
            },
            {
                path: "services/cad-modeling",
                element: <CADModelling />,
            },
            {
                path: "services/ui-ux-design",
                element: <UIUXDesign />,
            },
            {
                path: "services/data-analysis",
                element: <DataAnalysis />,
            },
            {
                path: "services/content-writing",
                element: <ContentWriting />,
            },
            {
                path: "services/:service/students",
                element: <StudentSelection />,
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "apply-for-student",
                element: (
                    <ProtectedRoute>
                        <ApplyForStudent />
                    </ProtectedRoute>
                ),
            },
            {
                path: "assigned-works",
                element: (
                    <ProtectedRoute>
                        <AssignedWorks />
                    </ProtectedRoute>
                ),
            },
            {
                path: "assigned-works/:id",
                element: (
                    <ProtectedRoute>
                        <AssignedWorkStatus />
                    </ProtectedRoute>
                ),
            },
            // Project Management Routes
            {
                path: "projects",
                element: (
                    <ProtectedRoute>
                        <ProjectsList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "projects/:projectId",
                element: (
                    <ProtectedRoute>
                        <ErrorBoundary>
                            <ProjectDetailsPage />
                        </ErrorBoundary>
                    </ProtectedRoute>
                ),
            },
            // Student Panel Routes
            {
                path: "student/projects",
                element: (
                    <StudentProtectedRoute>
                        <ProjectDashboard />
                    </StudentProtectedRoute>
                ),
            },
            {
                path: "student/my-works",
                element: (
                    <StudentProtectedRoute>
                        <MyWorks />
                    </StudentProtectedRoute>
                ),
            },
            // Admin Panel Routes
            {
                path: "admin",
                element: (
                    <AdminProtectedRoute>
                        <AdminLayout />
                    </AdminProtectedRoute>
                ),
                children: [
                    {
                        path: "dashboard",
                        element: <AdminDashboard />,
                    },
                    {
                        path: "student-applications",
                        element: <StudentApplications />,
                    },
                    {
                        path: "student-applications/:id",
                        element: (
                            <ErrorBoundary>
                                <ApplicationDetailView />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        path: "approved-students",
                        element: <ApprovedStudents />,
                    },
                    {
                        path: "student-tracking/:id",
                        element: (
                            <ErrorBoundary>
                                <StudentTracking />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        path: "all-users",
                        element: <AllUsers />,
                    },
                    {
                        path: "projects",
                        element: (
                            <ErrorBoundary>
                                <Projects />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        path: "works",
                        element: (
                            <ErrorBoundary>
                                <Works />
                            </ErrorBoundary>
                        ),
                    },
                ],
            },
            // Catch-all route for 404 Not Found
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

export default router;
