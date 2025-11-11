import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
    FaUser,
    FaProjectDiagram,
    FaCalendarAlt,
    FaDollarSign,
    FaClock,
    FaSearch,
    FaFilter,
    FaEye,
    FaCheckCircle,
    FaHourglassHalf,
    FaExclamationTriangle,
    FaTimesCircle,
    FaSpinner,
    FaGraduationCap,
    FaCode,
    FaMobile,
    FaFileAlt,
    FaCube,
    FaPaintBrush,
    FaChartBar,
    FaEdit,
    FaSyncAlt,
    FaChevronLeft,
    FaChevronRight,
    FaEnvelope,
    FaMapMarkerAlt,
    FaStar,
    FaExclamation,
} from "react-icons/fa";
import { projectAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import ProjectDetailsPopup from "../components/ProjectDetailsPopup";

const AssignedWorks = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProjects: 0,
    });
    const [expandedSkills, setExpandedSkills] = useState({});
    const [showProjectPopup, setShowProjectPopup] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, [statusFilter, sortBy, sortOrder, pagination.currentPage]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectAPI.getUserProjects({
                status: statusFilter === "all" ? "" : statusFilter,
                page: pagination.currentPage,
                limit: 12,
                sortBy,
                sortOrder,
            });

            if (response.success) {
                setProjects(response.projects);
                setPagination(response.pagination);
            } else {
                toast.error("Failed to fetch projects");
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    const getServiceIcon = (category) => {
        const icons = {
            "web-development": <FaCode className="text-green-400" />,
            "app-development": <FaMobile className="text-purple-400" />,
            "resume-services": <FaFileAlt className="text-blue-400" />,
            "cad-modeling": <FaCube className="text-orange-400" />,
            "ui-ux-design": <FaPaintBrush className="text-pink-400" />,
            "data-analysis": <FaChartBar className="text-cyan-400" />,
            "content-writing": <FaEdit className="text-teal-400" />,
        };
        return (
            icons[category] || <FaProjectDiagram className="text-gray-400" />
        );
    };

    const getStatusIcon = (status) => {
        const icons = {
            submitted: <FaHourglassHalf className="text-yellow-500" />,
            accepted: <FaCheckCircle className="text-green-500" />,
            pending: <FaExclamationTriangle className="text-orange-500" />,
            in_progress: <FaClock className="text-blue-500" />,
            completed: <FaCheckCircle className="text-emerald-600" />,
            cancelled: <FaTimesCircle className="text-red-500" />,
            disputed: <FaExclamationTriangle className="text-red-600" />,
        };
        return icons[status] || <FaHourglassHalf className="text-gray-500" />;
    };

    const getStatusBadge = (status) => {
        const badges = {
            submitted: "bg-yellow-100 text-yellow-800 border-yellow-200",
            accepted: "bg-green-100 text-green-800 border-green-200",
            pending: "bg-orange-100 text-orange-800 border-orange-200",
            in_progress: "bg-blue-100 text-blue-800 border-blue-200",
            completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
            disputed: "bg-red-100 text-red-800 border-red-200",
        };
        return badges[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const getStatusColor = (status) => {
        const colors = {
            submitted: "bg-gradient-to-r from-yellow-400 to-yellow-500",
            accepted: "bg-gradient-to-r from-green-400 to-green-500",
            pending: "bg-gradient-to-r from-orange-400 to-orange-500",
            in_progress: "bg-gradient-to-r from-blue-400 to-blue-500",
            completed: "bg-gradient-to-r from-emerald-400 to-emerald-500",
            cancelled: "bg-gradient-to-r from-red-400 to-red-500",
            disputed: "bg-gradient-to-r from-red-500 to-red-600",
        };
        return colors[status] || "bg-gradient-to-r from-gray-400 to-gray-500";
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleViewProject = (projectId) => {
        navigate(`/assigned-works/${projectId}`);
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const toggleSkills = (projectId) => {
        setExpandedSkills((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }));
    };

    const handleResolveObjection = (project) => {
        setSelectedProject(project);
        setShowProjectPopup(true);
    };

    const handleProjectUpdate = async (updatedData) => {
        try {
            // First, resolve the objection with the updated project data
            const objectionResponse = await projectAPI.resolveObjection(
                selectedProject._id,
                {
                    resolutionMessage:
                        "Project details have been updated to address the objection",
                    updatedProjectData: {
                        projectName: updatedData.projectName,
                        serviceCategory: updatedData.serviceCategory,
                        projectDescription: updatedData.projectDescription,
                        requirements: updatedData.requirements,
                        quotedPrice: updatedData.quotedPrice,
                        completionTime: updatedData.completionTime,
                        urgency: updatedData.urgency,
                        communicationPreference:
                            updatedData.communicationPreference,
                        contactDetails: {
                            phoneNumber: updatedData.phoneNumber,
                            emailAddress: updatedData.emailAddress,
                            meetingLink: updatedData.meetingLink,
                        },
                        additionalNotes: updatedData.additionalNotes,
                    },
                }
            );

            if (objectionResponse && objectionResponse.success) {
                toast.success(
                    "Objection resolved and project updated successfully"
                );
                setShowProjectPopup(false);
                setSelectedProject(null);
                fetchProjects(); // Refresh the projects list
            } else {
                toast.error("Failed to resolve objection and update project");
            }
        } catch (error) {
            console.error("Error resolving objection:", error);
            toast.error("Error resolving objection");
        }
    };

    const filteredProjects = projects.filter(
        (project) =>
            project.projectName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            project.assignedTo.username
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            project.serviceCategory
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const getProfileImage = (profilePicture) => {
        if (!profilePicture) return null;
        return profilePicture.startsWith("data:")
            ? profilePicture
            : `data:image/jpeg;base64,${profilePicture}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <FaSpinner className="text-6xl text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-xl text-gray-300">
                            Loading your assigned works...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                <FaProjectDiagram className="text-2xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Assigned Works
                                </h1>
                                <p className="text-gray-400 mt-1">
                                    Track and manage your project assignments
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={fetchProjects}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 border border-gray-700"
                            >
                                <FaSyncAlt className="text-sm" />
                                <span>Refresh</span>
                            </button>
                            <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
                                <span className="text-gray-400 text-sm">
                                    Total:{" "}
                                </span>
                                <span className="text-white font-semibold">
                                    {pagination.totalProjects}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects, students..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                                >
                                    <option value="all" className="bg-gray-800">
                                        All Status
                                    </option>
                                    <option
                                        value="submitted"
                                        className="bg-gray-800"
                                    >
                                        Submitted
                                    </option>
                                    <option
                                        value="accepted"
                                        className="bg-gray-800"
                                    >
                                        Accepted
                                    </option>
                                    <option
                                        value="pending"
                                        className="bg-gray-800"
                                    >
                                        Pending
                                    </option>
                                    <option
                                        value="in_progress"
                                        className="bg-gray-800"
                                    >
                                        In Progress
                                    </option>
                                    <option
                                        value="completed"
                                        className="bg-gray-800"
                                    >
                                        Completed
                                    </option>
                                    <option
                                        value="cancelled"
                                        className="bg-gray-800"
                                    >
                                        Cancelled
                                    </option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                            >
                                <option value="createdAt">Created Date</option>
                                <option value="expectedCompletionDate">
                                    Due Date
                                </option>
                                <option value="quotedPrice">Price</option>
                                <option value="projectName">Name</option>
                            </select>

                            {/* Sort Order */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-16">
                        <FaProjectDiagram className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-white mb-2">
                            No Projects Found
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "You haven't assigned any projects yet"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {filteredProjects.map((project) => (
                            <div
                                key={project._id}
                                className={`bg-gray-900 rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] overflow-hidden ${
                                    project.status === "cancelled"
                                        ? "border-red-500/30 opacity-75"
                                        : "border-gray-800"
                                }`}
                            >
                                {/* Project Header */}
                                <div className="p-6 border-b border-gray-800">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-800 rounded-lg">
                                                {getServiceIcon(
                                                    project.serviceCategory
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white leading-tight">
                                                    {project.projectName}
                                                </h3>
                                                <p className="text-sm text-gray-400 capitalize">
                                                    {project.serviceCategory.replace(
                                                        "-",
                                                        " "
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                project.status
                                            )}`}
                                        >
                                            {getStatusIcon(project.status)}
                                            <span className="ml-1">
                                                {project.status
                                                    .replace("_", " ")
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Content */}
                                <div className="p-6">
                                    {/* Project Details */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center p-3 bg-gray-800 rounded-lg">
                                            <FaDollarSign className="text-green-400 mx-auto mb-1" />
                                            <p className="text-xs text-gray-400">
                                                Budget
                                            </p>
                                            <p className="text-sm font-semibold text-white">
                                                {formatCurrency(
                                                    project.quotedPrice
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-800 rounded-lg">
                                            <FaClock className="text-blue-400 mx-auto mb-1" />
                                            <p className="text-xs text-gray-400">
                                                Duration
                                            </p>
                                            <p className="text-sm font-semibold text-white">
                                                {project.completionTime} days
                                            </p>
                                        </div>
                                    </div>

                                    {/* Assigned Student */}
                                    <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-5 mb-4 border border-white/20 shadow-lg">
                                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                            Assigned Student
                                        </h4>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 flex-shrink-0">
                                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                                    {getProfileImage(
                                                        project.assignedTo
                                                            .profilePicture
                                                    ) ? (
                                                        <img
                                                            src={getProfileImage(
                                                                project
                                                                    .assignedTo
                                                                    .profilePicture
                                                            )}
                                                            alt={
                                                                project
                                                                    .assignedTo
                                                                    .username
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <FaUser className="text-gray-400 text-xl" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="text-white font-semibold text-base truncate pr-2">
                                                        {
                                                            project.assignedTo
                                                                .username
                                                        }
                                                    </h5>
                                                    {project.assignedTo
                                                        .email && (
                                                        <div className="flex items-center text-gray-400">
                                                            <FaEnvelope className="text-xs" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Student Details Grid */}
                                                <div className="space-y-2">
                                                    {project.assignedTo
                                                        .college && (
                                                        <div className="flex items-center space-x-2 text-xs text-purple-200">
                                                            <FaGraduationCap className="flex-shrink-0" />
                                                            <span
                                                                className="truncate flex-1"
                                                                title={
                                                                    project
                                                                        .assignedTo
                                                                        .college
                                                                }
                                                            >
                                                                {project
                                                                    .assignedTo
                                                                    .college
                                                                    .length > 35
                                                                    ? `${project.assignedTo.college.substring(
                                                                          0,
                                                                          35
                                                                      )}...`
                                                                    : project
                                                                          .assignedTo
                                                                          .college}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {project.assignedTo
                                                        .location && (
                                                        <div className="flex items-center space-x-2 text-xs text-blue-200">
                                                            <FaMapMarkerAlt className="flex-shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    project
                                                                        .assignedTo
                                                                        .location
                                                                }
                                                            </span>
                                                        </div>
                                                    )}

                                                    {project.assignedTo
                                                        .experience && (
                                                        <div className="flex items-center space-x-2 text-xs text-green-200">
                                                            <FaStar className="flex-shrink-0" />
                                                            <span>
                                                                {
                                                                    project
                                                                        .assignedTo
                                                                        .experience
                                                                }{" "}
                                                                years experience
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Skills Section */}
                                                {project.assignedTo.skills &&
                                                    project.assignedTo.skills
                                                        .length > 0 && (
                                                        <div className="mt-3">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {(expandedSkills[
                                                                    project._id
                                                                ]
                                                                    ? project
                                                                          .assignedTo
                                                                          .skills
                                                                    : project.assignedTo.skills.slice(
                                                                          0,
                                                                          3
                                                                      )
                                                                ).map(
                                                                    (
                                                                        skill,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="bg-purple-500/20 text-purple-200 text-xs px-2.5 py-1 rounded-full transition-all duration-200 hover:bg-purple-500/30 border border-purple-500/30"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                                {project
                                                                    .assignedTo
                                                                    .skills
                                                                    .length >
                                                                    3 && (
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleSkills(
                                                                                project._id
                                                                            )
                                                                        }
                                                                        className="text-purple-300 hover:text-purple-200 text-xs font-medium transition-all duration-200 cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/40 hover:border-purple-500/60"
                                                                    >
                                                                        {expandedSkills[
                                                                            project
                                                                                ._id
                                                                        ]
                                                                            ? "Show less"
                                                                            : `+${
                                                                                  project
                                                                                      .assignedTo
                                                                                      .skills
                                                                                      .length -
                                                                                  3
                                                                              } more`}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Description */}
                                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                                        <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                                            Project Description
                                        </h5>
                                        <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                                            {project.projectDescription}
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    {project.progress &&
                                        project.progress.percentage > 0 && (
                                            <div className="mb-4 bg-gray-800/30 rounded-lg p-3">
                                                <div className="flex items-center justify-between text-sm mb-3">
                                                    <span className="text-gray-400 font-medium">
                                                        Project Progress
                                                    </span>
                                                    <span className="text-white font-semibold bg-blue-500/20 px-2 py-1 rounded-full text-xs">
                                                        {
                                                            project.progress
                                                                .percentage
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2.5 shadow-inner">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 shadow-lg"
                                                        style={{
                                                            width: `${project.progress.percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                {project.progress
                                                    .lastUpdated && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Last updated:{" "}
                                                        {formatDate(
                                                            project.progress
                                                                .lastUpdated
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                    {/* Project Timeline */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                            <FaCalendarAlt className="text-blue-400 mx-auto mb-1 text-sm" />
                                            <p className="text-xs text-gray-400">
                                                Created
                                            </p>
                                            <p className="text-xs font-semibold text-white">
                                                {formatDate(project.createdAt)}
                                            </p>
                                        </div>
                                        {project.expectedCompletionDate && (
                                            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                                                <FaClock className="text-orange-400 mx-auto mb-1 text-sm" />
                                                <p className="text-xs text-gray-400">
                                                    Due Date
                                                </p>
                                                <p className="text-xs font-semibold text-white">
                                                    {formatDate(
                                                        project.expectedCompletionDate
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        {/* Show objection alert and resolve button if objection exists */}
                                        {project.objectionDetails
                                            ?.hasObjection &&
                                            !project.objectionDetails
                                                ?.isObjectionResolved && (
                                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <FaExclamation className="text-yellow-500 text-sm" />
                                                        <span className="text-yellow-300 font-medium text-sm">
                                                            Objection Raised
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-xs mb-1">
                                                        <strong>Reason:</strong>{" "}
                                                        {
                                                            project
                                                                .objectionDetails
                                                                .objectionReason
                                                        }
                                                    </p>
                                                    <p className="text-gray-300 text-xs mb-3">
                                                        <strong>
                                                            Message:
                                                        </strong>{" "}
                                                        {
                                                            project
                                                                .objectionDetails
                                                                .objectionMessage
                                                        }
                                                    </p>
                                                    <button
                                                        onClick={() =>
                                                            handleResolveObjection(
                                                                project
                                                            )
                                                        }
                                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                                                    >
                                                        <FaExclamation className="text-xs" />
                                                        <span>
                                                            Resolve Objection
                                                        </span>
                                                    </button>
                                                </div>
                                            )}

                                        {/* Default View Details Button */}
                                        <button
                                            onClick={() =>
                                                handleViewProject(project._id)
                                            }
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                        >
                                            <FaEye className="text-sm" />
                                            <span>View Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                            }
                            disabled={!pagination.hasPrevPage}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg border border-gray-700 transition-all duration-200 flex items-center space-x-1"
                        >
                            <FaChevronLeft className="text-sm" />
                            <span>Previous</span>
                        </button>

                        <div className="flex space-x-1">
                            {[...Array(Math.min(5, pagination.totalPages))].map(
                                (_, index) => {
                                    const pageNumber =
                                        Math.max(
                                            1,
                                            pagination.currentPage - 2
                                        ) + index;
                                    if (pageNumber > pagination.totalPages)
                                        return null;

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() =>
                                                handlePageChange(pageNumber)
                                            }
                                            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                                pageNumber ===
                                                pagination.currentPage
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                                    : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                            }
                            disabled={!pagination.hasNextPage}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg border border-gray-700 transition-all duration-200 flex items-center space-x-1"
                        >
                            <span>Next</span>
                            <FaChevronRight className="text-sm" />
                        </button>
                    </div>
                )}
            </div>

            {/* Project Details Popup for Objection Resolution */}
            {showProjectPopup && selectedProject && (
                <ProjectDetailsPopup
                    isOpen={showProjectPopup}
                    onClose={() => {
                        setShowProjectPopup(false);
                        setSelectedProject(null);
                    }}
                    onSubmit={handleProjectUpdate}
                    initialData={{
                        projectName: selectedProject.projectName,
                        serviceCategory: selectedProject.serviceCategory,
                        projectDescription: selectedProject.projectDescription,
                        requirements: selectedProject.requirements,
                        quotedPrice: selectedProject.quotedPrice,
                        completionTime: selectedProject.completionTime,
                        urgency: selectedProject.urgency,
                        communicationPreference:
                            selectedProject.communicationPreference,
                        phoneNumber:
                            selectedProject.contactDetails?.phoneNumber || "",
                        emailAddress:
                            selectedProject.contactDetails?.emailAddress || "",
                        meetingLink:
                            selectedProject.contactDetails?.meetingLink || "",
                        additionalNotes: selectedProject.additionalNotes || "",
                        assignedTo: selectedProject.assignedTo._id,
                    }}
                    isEditMode={true}
                    title="Update Data"
                />
            )}
        </div>
    );
};

export default AssignedWorks;
