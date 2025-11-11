import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FaArrowLeft,
    FaUser,
    FaCalendarAlt,
    FaDollarSign,
    FaClock,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaVideo,
    FaCheckCircle,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaTimesCircle,
    FaEdit,
    FaPlus,
    FaComments,
} from "react-icons/fa";
import { projectAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

const ProjectDetailsPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [progressUpdate, setProgressUpdate] = useState({
        message: "",
        percentage: "",
    });

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await projectAPI.getProjectById(projectId);

            if (response.success) {
                setProject(response.project);
            } else {
                setError(response.message || "Failed to fetch project details");
            }
        } catch (err) {
            setError(err.message || "Failed to fetch project details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus, reason = "") => {
        try {
            const response = await projectAPI.updateProjectStatus(projectId, {
                status: newStatus,
                reason: reason,
            });

            if (response.success) {
                setProject(response.project);
                toast.success("Project status updated successfully!", {
                    duration: 3000,
                    style: {
                        background: "#10B981",
                        color: "#ffffff",
                    },
                });
            }
        } catch (err) {
            toast.error(err.message || "Failed to update project status", {
                duration: 4000,
                style: {
                    background: "#EF4444",
                    color: "#ffffff",
                },
            });
        }
    };

    const handleProgressUpdate = async () => {
        try {
            const response = await projectAPI.addProgressUpdate(
                projectId,
                progressUpdate
            );

            if (response.success) {
                setProject(response.project);
                setShowProgressModal(false);
                setProgressUpdate({ message: "", percentage: "" });
                toast.success("Progress update added successfully!", {
                    duration: 3000,
                    style: {
                        background: "#10B981",
                        color: "#ffffff",
                    },
                });
            }
        } catch (err) {
            toast.error(err.message || "Failed to add progress update", {
                duration: 4000,
                style: {
                    background: "#EF4444",
                    color: "#ffffff",
                },
            });
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
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "accepted":
                return "bg-green-100 text-green-800 border-green-200";
            case "pending":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getCommunicationIcon = (type) => {
        switch (type) {
            case "whatsapp":
                return <FaWhatsapp className="text-green-600" />;
            case "phone":
                return <FaPhone className="text-blue-600" />;
            case "email":
                return <FaEnvelope className="text-red-600" />;
            case "meeting":
                return <FaVideo className="text-purple-600" />;
            default:
                return <FaComments className="text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                        Error
                    </h2>
                    <p className="text-gray-600 text-center mb-4">
                        {error || "Project not found"}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const isStudent = user?.role === "student";
    const isOwner =
        project.assignedBy._id === user?.id ||
        project.assignedTo._id === user?.id;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Projects
                    </button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {project.projectName}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {project.projectDescription}
                            </p>
                        </div>

                        <div
                            className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                                project.status
                            )}`}
                        >
                            {getStatusIcon(project.status)}
                            <span className="ml-2">
                                {project.status.replace("_", " ").toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Details */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Project Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Service Category
                                    </h3>
                                    <p className="text-gray-900 capitalize">
                                        {project.serviceCategory.replace(
                                            "-",
                                            " "
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Quoted Price
                                    </h3>
                                    <p className="text-gray-900 font-semibold">
                                        {formatCurrency(project.quotedPrice)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Completion Time
                                    </h3>
                                    <p className="text-gray-900">
                                        {project.completionTime} days
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Urgency
                                    </h3>
                                    <p
                                        className={`capitalize ${
                                            project.urgency === "urgent"
                                                ? "text-red-600 font-medium"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {project.urgency}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Created Date
                                    </h3>
                                    <p className="text-gray-900">
                                        {formatDate(project.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Expected Completion
                                    </h3>
                                    <p className="text-gray-900">
                                        {formatDate(
                                            project.expectedCompletionDate
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Requirements
                            </h2>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {project.requirements}
                            </p>
                        </div>

                        {/* Additional Notes */}
                        {project.additionalNotes && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Additional Notes
                                </h2>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {project.additionalNotes}
                                </p>
                            </div>
                        )}

                        {/* Progress Updates */}
                        {project.progress.updates.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Progress Updates
                                    </h2>
                                    {isOwner && (
                                        <button
                                            onClick={() =>
                                                setShowProgressModal(true)
                                            }
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Add Update
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {project.progress.updates.map(
                                        (update, index) => (
                                            <div
                                                key={index}
                                                className="border-l-4 border-blue-500 pl-4 py-2"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-gray-900">
                                                            {update.message}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            by{" "}
                                                            {
                                                                update.updateBy
                                                                    .username
                                                            }{" "}
                                                            •{" "}
                                                            {formatDate(
                                                                update.timestamp
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Participants */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Participants
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={
                                            project.assignedBy.profilePicture ||
                                            "/default-avatar.png"
                                        }
                                        alt={project.assignedBy.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {project.assignedBy.username}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Client
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <img
                                        src={
                                            project.assignedTo.profilePicture ||
                                            "/default-avatar.png"
                                        }
                                        alt={project.assignedTo.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {project.assignedTo.username}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Student
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Communication */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Communication
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    {getCommunicationIcon(
                                        project.communicationPreference
                                    )}
                                    <span className="text-gray-900 capitalize">
                                        {project.communicationPreference.replace(
                                            "_",
                                            " "
                                        )}
                                    </span>
                                </div>

                                {project.contactDetails.phoneNumber && (
                                    <div className="flex items-center space-x-3">
                                        <FaPhone className="text-gray-400" />
                                        <span className="text-gray-700">
                                            {project.contactDetails.phoneNumber}
                                        </span>
                                    </div>
                                )}

                                {project.contactDetails.emailAddress && (
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-gray-400" />
                                        <span className="text-gray-700">
                                            {
                                                project.contactDetails
                                                    .emailAddress
                                            }
                                        </span>
                                    </div>
                                )}

                                {project.contactDetails.meetingLink && (
                                    <div className="flex items-center space-x-3">
                                        <FaVideo className="text-gray-400" />
                                        <a
                                            href={
                                                project.contactDetails
                                                    .meetingLink
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Meeting Link
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {isOwner && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Actions
                                </h2>

                                <div className="space-y-3">
                                    {isStudent &&
                                        project.status === "submitted" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            "accepted",
                                                            "Project accepted by student"
                                                        )
                                                    }
                                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Accept Project
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt(
                                                            "Reason for marking as pending:"
                                                        );
                                                        if (reason) {
                                                            handleStatusUpdate(
                                                                "pending",
                                                                reason
                                                            );
                                                        }
                                                    }}
                                                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                                                >
                                                    Mark as Pending
                                                </button>
                                            </>
                                        )}

                                    {project.status === "accepted" && (
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    "in_progress",
                                                    "Work started on project"
                                                )
                                            }
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Start Work
                                        </button>
                                    )}

                                    {project.status === "in_progress" &&
                                        isStudent && (
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        "completed",
                                                        "Project completed"
                                                    )
                                                }
                                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Mark as Completed
                                            </button>
                                        )}

                                    <button
                                        onClick={() =>
                                            setShowProgressModal(true)
                                        }
                                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                                    >
                                        <FaPlus className="mr-2" />
                                        Add Progress Update
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Update Modal */}
            {showProgressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Add Progress Update
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Message
                                </label>
                                <textarea
                                    value={progressUpdate.message}
                                    onChange={(e) =>
                                        setProgressUpdate({
                                            ...progressUpdate,
                                            message: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Describe the progress made..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Progress Percentage (Optional)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={progressUpdate.percentage}
                                    onChange={(e) =>
                                        setProgressUpdate({
                                            ...progressUpdate,
                                            percentage: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0-100"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowProgressModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProgressUpdate}
                                disabled={!progressUpdate.message.trim()}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsPage;
