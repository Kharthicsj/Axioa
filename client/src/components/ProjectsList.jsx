import React, { useState, useEffect } from "react";
import {
    FaEye,
    FaEdit,
    FaTrash,
    FaClock,
    FaDollarSign,
    FaUser,
    FaCalendarAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaTimesCircle,
} from "react-icons/fa";
import { projectAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

const ProjectsList = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchProjects();
    }, [filter, currentPage]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...(filter !== "all" && { status: filter }),
            };

            const response = await projectAPI.getUserProjects(params);

            if (response.success) {
                setProjects(response.projects);
                setPagination(response.pagination);
            } else {
                setError(response.message || "Failed to fetch projects");
            }
        } catch (err) {
            setError(err.message || "Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (projectId, newStatus, reason = "") => {
        try {
            const response = await projectAPI.updateProjectStatus(projectId, {
                status: newStatus,
                reason: reason,
            });

            if (response.success) {
                // Refresh projects list
                fetchProjects();
                alert("Project status updated successfully!");
            }
        } catch (err) {
            alert(err.message || "Failed to update project status");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "submitted":
                return <FaHourglassHalf className="text-yellow-500" />;
            case "accepted":
                return <FaCheckCircle className="text-green-500" />;
            case "pending":
                return <FaExclamationTriangle className="text-orange-500" />;
            case "in_progress":
                return <FaClock className="text-blue-500" />;
            case "completed":
                return <FaCheckCircle className="text-green-600" />;
            case "cancelled":
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaHourglassHalf className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "submitted":
                return "bg-yellow-100 text-yellow-800";
            case "accepted":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-orange-100 text-orange-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                    <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3" />
                    <div>
                        <h3 className="text-red-800 font-medium">Error</h3>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                        <button
                            onClick={fetchProjects}
                            className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {user?.role === "student"
                        ? "My Assigned Projects"
                        : "My Projects"}
                </h2>

                {/* Status Filter */}
                <div className="flex space-x-2">
                    {[
                        "all",
                        "submitted",
                        "accepted",
                        "pending",
                        "in_progress",
                        "completed",
                    ].map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                setFilter(status);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                filter === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {status === "all"
                                ? "All"
                                : status.replace("_", " ").toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12">
                    <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No projects found
                    </h3>
                    <p className="text-gray-500">
                        {filter === "all"
                            ? "You haven't created or been assigned any projects yet."
                            : `No projects with status "${filter}" found.`}
                    </p>
                </div>
            ) : (
                <>
                    {/* Projects Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {project.projectName}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <FaCalendarAlt className="mr-1" />
                                                {formatDate(project.createdAt)}
                                            </span>
                                            <span className="flex items-center">
                                                <FaDollarSign className="mr-1" />
                                                {formatCurrency(
                                                    project.quotedPrice
                                                )}
                                            </span>
                                            <span className="flex items-center">
                                                <FaClock className="mr-1" />
                                                {project.completionTime} days
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                project.status
                                            )}`}
                                        >
                                            {getStatusIcon(project.status)}
                                            <span className="ml-1">
                                                {project.status
                                                    .replace("_", " ")
                                                    .toUpperCase()}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                    {project.projectDescription}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaUser className="mr-1" />
                                            {user?.role === "student"
                                                ? project.assignedBy?.username
                                                : project.assignedTo?.username}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {project.serviceCategory
                                                .replace("-", " ")
                                                .toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                window.open(
                                                    `/projects/${project._id}`,
                                                    "_blank"
                                                )
                                            }
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>

                                        {/* Status update buttons for students */}
                                        {user?.role === "student" &&
                                            project.status === "submitted" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                project._id,
                                                                "accepted",
                                                                "Project accepted by student"
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const reason =
                                                                prompt(
                                                                    "Reason for marking as pending:"
                                                                );
                                                            if (reason) {
                                                                handleStatusUpdate(
                                                                    project._id,
                                                                    "pending",
                                                                    reason
                                                                );
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                                                    >
                                                        Mark Pending
                                                    </button>
                                                </>
                                            )}

                                        {/* Progress update for accepted projects */}
                                        {project.status === "accepted" && (
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        project._id,
                                                        "in_progress",
                                                        "Project started"
                                                    )
                                                }
                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                            >
                                                Start Work
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={!pagination.hasPrevPage}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-gray-700">
                                Page {pagination.currentPage} of{" "}
                                {pagination.totalPages}
                            </span>

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(
                                            prev + 1,
                                            pagination.totalPages
                                        )
                                    )
                                }
                                disabled={!pagination.hasNextPage}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProjectsList;
