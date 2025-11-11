import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const StudentProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 mt-4">
                        Verifying student access...
                    </p>
                </div>
            </div>
        );
    }

    // Only redirect after we've confirmed the user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    // Only redirect after we've confirmed the user is not a student
    if (user?.role !== "student") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default StudentProtectedRoute;
