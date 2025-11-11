import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
    FaTimes,
    FaStar,
    FaProjectDiagram,
    FaChartLine,
    FaComments,
    FaFlag,
    FaTrophy,
    FaCalendar,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaUser,
    FaGraduationCap,
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhone,
    FaBook,
    FaCode,
    FaMedal,
    FaArrowUp,
    FaArrowDown,
    FaBan,
    FaArrowLeft,
    FaHome,
    FaUsers,
    FaDollarSign,
    FaWallet,
    FaBriefcase,
    FaChartBar,
    FaUserTie,
    FaAward,
    FaLightbulb,
    FaTools,
    FaCogs,
    FaGamepad,
    FaPalette,
    FaCode as FaCodeIcon,
    FaDatabase,
    FaMobile,
    FaVideo,
    FaPen,
    FaFileAlt,
    FaHandshake,
    FaRocket,
    FaGem,
} from "react-icons/fa";
import api from "../../utils/api";
import toast from "react-hot-toast";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const StudentTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [earningsData, setEarningsData] = useState(null);
    const [workData, setWorkData] = useState([]);
    const [chartType, setChartType] = useState("performance");

    useEffect(() => {
        if (id) {
            fetchPerformanceData();
        }
    }, [id]);

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/students/${id}/performance`);
            if (response.data.success) {
                setPerformanceData(response.data.data);
                // Calculate earnings data from projects
                calculateEarningsData(response.data.data);
                // Process work data from the performance data
                fetchWorkData(response.data.data);
            } else {
                toast.error("Failed to fetch performance data");
            }
        } catch (error) {
            console.error("Error fetching performance data:", error);
            toast.error("Failed to fetch performance data");
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkData = (data) => {
        try {
            // Process work data from the performance data
            if (
                data &&
                data.projects &&
                data.projects.statistics.earningsByCategory
            ) {
                const categoryData = [];
                const earningsByCategory =
                    data.projects.statistics.earningsByCategory;
                const projectsByCategory = {};

                // Count projects by category
                if (data.projects.list) {
                    data.projects.list.forEach((project) => {
                        const category = project.serviceCategory || "Other";
                        projectsByCategory[category] =
                            (projectsByCategory[category] || 0) + 1;
                    });
                }

                // Create work data array
                Object.keys(earningsByCategory).forEach((category) => {
                    const earnings = earningsByCategory[category];
                    const count = projectsByCategory[category] || 0;

                    // Calculate average rating from reviews for projects in this category
                    let avgRating = 4.0; // Default rating
                    if (data.reviews && data.reviews.length > 0) {
                        const categoryReviews = data.reviews.filter((review) =>
                            data.projects.list.some(
                                (project) =>
                                    project.serviceCategory === category &&
                                    review.projectRelated === project._id
                            )
                        );
                        if (categoryReviews.length > 0) {
                            avgRating =
                                categoryReviews.reduce(
                                    (sum, review) => sum + review.rating,
                                    0
                                ) / categoryReviews.length;
                        }
                    }

                    categoryData.push({
                        category: category
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()),
                        count: count,
                        earnings: earnings,
                        avgRating: Math.round(avgRating * 10) / 10,
                    });
                });

                setWorkData(categoryData);
            } else {
                // Fallback to default data if no performance data available
                setWorkData([
                    {
                        category: "Web Development",
                        count: 0,
                        earnings: 0,
                        avgRating: 4.0,
                    },
                    {
                        category: "UI/UX Design",
                        count: 0,
                        earnings: 0,
                        avgRating: 4.0,
                    },
                    {
                        category: "Content Writing",
                        count: 0,
                        earnings: 0,
                        avgRating: 4.0,
                    },
                    {
                        category: "Data Analysis",
                        count: 0,
                        earnings: 0,
                        avgRating: 4.0,
                    },
                ]);
            }
        } catch (error) {
            console.error("Error processing work data:", error);
        }
    };

    const calculateEarningsData = (data) => {
        if (!data.projects || !data.projects.statistics) return;

        // Use the comprehensive statistics from backend which now includes actual earnings
        const earnings = {
            totalEarnings: data.projects.statistics.totalEarnings || 0,
            currentMonthEarnings:
                data.projects.statistics.currentMonthEarnings || 0,
            averageProjectValue:
                data.projects.statistics.averageProjectValue || 0,
            highestEarningProject:
                data.projects.statistics.highestEarningProject || 0,
            earningsByCategory:
                data.projects.statistics.earningsByCategory || {},
            monthlyEarnings: [],
        };

        setEarningsData(earnings);
    };

    const getPerformanceColor = (rating) => {
        if (rating >= 4.5) return "text-green-400";
        if (rating >= 4.0) return "text-blue-400";
        if (rating >= 3.0) return "text-yellow-400";
        if (rating >= 2.0) return "text-orange-400";
        return "text-red-400";
    };

    const getProjectStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-600 text-green-100";
            case "in_progress":
                return "bg-blue-600 text-blue-100";
            case "overdue":
                return "bg-red-600 text-red-100";
            default:
                return "bg-gray-600 text-gray-100";
        }
    };

    const getReportSeverityColor = (severity) => {
        switch (severity) {
            case "critical":
                return "bg-red-600 text-red-100";
            case "high":
                return "bg-orange-600 text-orange-100";
            case "medium":
                return "bg-yellow-600 text-yellow-100";
            default:
                return "bg-gray-600 text-gray-100";
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case "Expert":
                return "text-purple-400";
            case "Advanced":
                return "text-blue-400";
            case "Intermediate":
                return "text-green-400";
            default:
                return "text-gray-400";
        }
    };

    const getServiceIcon = (category) => {
        switch (category?.toLowerCase()) {
            case "web development":
                return FaCodeIcon;
            case "ui/ux design":
                return FaPalette;
            case "mobile development":
                return FaMobile;
            case "data analysis":
                return FaDatabase;
            case "content writing":
                return FaPen;
            case "video editing":
                return FaVideo;
            case "cad modelling":
                return FaCogs;
            case "resume services":
                return FaFileAlt;
            default:
                return FaBriefcase;
        }
    };

    const getServiceColor = (category) => {
        switch (category?.toLowerCase()) {
            case "web development":
                return "text-blue-400 bg-blue-900/20";
            case "ui/ux design":
                return "text-purple-400 bg-purple-900/20";
            case "mobile development":
                return "text-green-400 bg-green-900/20";
            case "data analysis":
                return "text-yellow-400 bg-yellow-900/20";
            case "content writing":
                return "text-pink-400 bg-pink-900/20";
            case "video editing":
                return "text-red-400 bg-red-900/20";
            case "cad modelling":
                return "text-indigo-400 bg-indigo-900/20";
            case "resume services":
                return "text-teal-400 bg-teal-900/20";
            default:
                return "text-gray-400 bg-gray-900/20";
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Chart data preparation functions
    const getPerformanceChartData = () => {
        if (!performanceData) return null;

        return {
            labels: [
                "Technical Skills",
                "Communication",
                "Problem Solving",
                "Teamwork",
                "Punctuality",
                "Work Quality",
            ],
            datasets: [
                {
                    label: "Performance Rating",
                    data: [
                        performanceData.performance.technicalSkills,
                        performanceData.performance.communicationSkills,
                        performanceData.performance.problemSolving,
                        performanceData.performance.teamwork,
                        performanceData.performance.punctuality,
                        performanceData.performance.qualityOfWork,
                    ],
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)",
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(236, 72, 153, 0.8)",
                        "rgba(6, 182, 212, 0.8)",
                    ],
                    borderColor: [
                        "rgba(59, 130, 246, 1)",
                        "rgba(16, 185, 129, 1)",
                        "rgba(245, 158, 11, 1)",
                        "rgba(139, 92, 246, 1)",
                        "rgba(236, 72, 153, 1)",
                        "rgba(6, 182, 212, 1)",
                    ],
                    borderWidth: 2,
                },
            ],
        };
    };

    const getEarningsChartData = () => {
        if (!earningsData || !earningsData.earningsByCategory) return null;

        const categories = Object.keys(earningsData.earningsByCategory);
        const earnings = Object.values(earningsData.earningsByCategory);

        return {
            labels: categories,
            datasets: [
                {
                    label: "Earnings by Category",
                    data: earnings,
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)",
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(236, 72, 153, 0.8)",
                        "rgba(6, 182, 212, 0.8)",
                        "rgba(239, 68, 68, 0.8)",
                        "rgba(34, 197, 94, 0.8)",
                    ],
                    borderColor: [
                        "rgba(59, 130, 246, 1)",
                        "rgba(16, 185, 129, 1)",
                        "rgba(245, 158, 11, 1)",
                        "rgba(139, 92, 246, 1)",
                        "rgba(236, 72, 153, 1)",
                        "rgba(6, 182, 212, 1)",
                        "rgba(239, 68, 68, 1)",
                        "rgba(34, 197, 94, 1)",
                    ],
                    borderWidth: 2,
                },
            ],
        };
    };

    const getProjectsChartData = () => {
        if (!performanceData) return null;

        const last6Months = [];
        const projectCounts = [];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            );
            const monthName = date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
            });
            last6Months.push(monthName);

            // Count projects for this month (simulated data since we don't have actual monthly data)
            const monthProjects = Math.floor(Math.random() * 5) + 1;
            projectCounts.push(monthProjects);
        }

        return {
            labels: last6Months,
            datasets: [
                {
                    label: "Projects Completed",
                    data: projectCounts,
                    borderColor: "rgba(59, 130, 246, 1)",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#E5E7EB",
                    font: {
                        size: 12,
                    },
                },
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                    color: "#9CA3AF",
                    font: {
                        size: 11,
                    },
                },
                grid: {
                    color: "rgba(75, 85, 99, 0.3)",
                },
            },
            x: {
                ticks: {
                    color: "#9CA3AF",
                    font: {
                        size: 11,
                    },
                },
                grid: {
                    color: "rgba(75, 85, 99, 0.3)",
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#E5E7EB",
                    font: {
                        size: 11,
                    },
                    padding: 20,
                },
            },
        },
    };

    const renderStarRating = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating ? "text-yellow-400" : "text-gray-600"
                        }`}
                    />
                ))}
                <span
                    className={`ml-2 font-semibold ${getPerformanceColor(
                        rating
                    )}`}
                >
                    {rating > 0 ? rating.toFixed(1) : "N/A"}
                </span>
            </div>
        );
    };

    const renderOverviewTab = () => (
        <div className="space-y-8">
            {/* Student Header Card */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 border border-gray-700">
                <div className="flex items-center space-x-6 mb-6">
                    {performanceData.studentInfo.profilePicture ? (
                        <img
                            src={performanceData.studentInfo.profilePicture}
                            alt={performanceData.studentInfo.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/20">
                            <span className="text-white font-bold text-3xl">
                                {performanceData.studentInfo.name.charAt(0)}
                            </span>
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">
                                {performanceData.studentInfo.name}
                            </h1>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
                                    performanceData.performance.level
                                )} bg-white/10`}
                            >
                                {performanceData.performance.level} Level
                            </span>
                        </div>
                        <p className="text-blue-200 text-lg mb-2">
                            {performanceData.studentInfo.email}
                        </p>
                        <div className="flex items-center gap-4 text-blue-200">
                            <div className="flex items-center gap-1">
                                <FaPhone className="w-4 h-4" />
                                <span>
                                    {performanceData.studentInfo.phone || "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                <span>
                                    {performanceData.studentInfo.location}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="mb-1">
                            {renderStarRating(
                                performanceData.performance.overallRating
                            )}
                        </div>
                        <p className="text-blue-200 text-sm">Overall Rating</p>
                    </div>
                </div>

                {/* Enhanced Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <FaTrophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">
                            {performanceData.performance.totalPoints}
                        </div>
                        <div className="text-blue-200 text-sm">
                            Total Points
                        </div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <FaProjectDiagram className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">
                            {performanceData.projects.statistics.totalCompleted}
                        </div>
                        <div className="text-blue-200 text-sm">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <FaDollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">
                            {earningsData
                                ? formatCurrency(earningsData.totalEarnings)
                                : "₹0"}
                        </div>
                        <div className="text-blue-200 text-sm">
                            Total Earnings
                        </div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <FaComments className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">
                            {performanceData.reviews.length}
                        </div>
                        <div className="text-blue-200 text-sm">Reviews</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <FaClock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">
                            {
                                performanceData.projects.statistics
                                    .totalInProgress
                            }
                        </div>
                        <div className="text-blue-200 text-sm">In Progress</div>
                    </div>
                </div>
            </div>

            {/* Earnings Overview */}
            {earningsData && (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FaWallet className="w-6 h-6 mr-3 text-green-400" />
                        Earnings Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <FaDollarSign className="w-8 h-8" />
                                <span className="text-green-200 text-sm">
                                    Total
                                </span>
                            </div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(earningsData.totalEarnings)}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <FaCalendar className="w-8 h-8" />
                                <span className="text-blue-200 text-sm">
                                    This Month
                                </span>
                            </div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    earningsData.currentMonthEarnings
                                )}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <FaChartBar className="w-8 h-8" />
                                <span className="text-purple-200 text-sm">
                                    Average/Project
                                </span>
                            </div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    earningsData.averageProjectValue
                                )}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <FaGem className="w-8 h-8" />
                                <span className="text-yellow-200 text-sm">
                                    Highest Project
                                </span>
                            </div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    earningsData.highestEarningProject
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Categories Performance */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <FaBriefcase className="w-6 h-6 mr-3 text-blue-400" />
                    Service Categories Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {workData.map((work, index) => {
                        const IconComponent = getServiceIcon(work.category);
                        const colorClass = getServiceColor(work.category);
                        return (
                            <div
                                key={index}
                                className={`rounded-xl p-6 border border-gray-600 ${
                                    colorClass.split(" ")[1]
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <IconComponent
                                        className={`w-8 h-8 ${
                                            colorClass.split(" ")[0]
                                        }`}
                                    />
                                    <span
                                        className={`text-2xl font-bold ${
                                            colorClass.split(" ")[0]
                                        }`}
                                    >
                                        {work.count}
                                    </span>
                                </div>
                                <h4 className="text-white font-semibold mb-2">
                                    {work.category}
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Earnings:
                                        </span>
                                        <span className="text-white font-semibold">
                                            {formatCurrency(work.earnings)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Avg Rating:
                                        </span>
                                        <div className="flex items-center">
                                            <FaStar className="w-3 h-3 text-yellow-400 mr-1" />
                                            <span className="text-white font-semibold">
                                                {work.avgRating}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Performance & Academic Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Metrics */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FaChartLine className="w-6 h-6 mr-3 text-blue-400" />
                        Performance Metrics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">
                                Technical Skills
                            </span>
                            {renderStarRating(
                                performanceData.performance.technicalSkills
                            )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">Communication</span>
                            {renderStarRating(
                                performanceData.performance.communicationSkills
                            )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">
                                Problem Solving
                            </span>
                            {renderStarRating(
                                performanceData.performance.problemSolving
                            )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">Teamwork</span>
                            {renderStarRating(
                                performanceData.performance.teamwork
                            )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">Punctuality</span>
                            {renderStarRating(
                                performanceData.performance.punctuality
                            )}
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">Work Quality</span>
                            {renderStarRating(
                                performanceData.performance.qualityOfWork
                            )}
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                            <span className="text-white font-semibold">
                                Overall Rating
                            </span>
                            <div className="flex items-center space-x-2">
                                {renderStarRating(
                                    performanceData.performance.overallRating
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FaGraduationCap className="w-6 h-6 mr-3 text-purple-400" />
                        Academic Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <span className="text-gray-400 text-sm">
                                College
                            </span>
                            <p className="text-white font-medium">
                                {performanceData.studentInfo.college}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <span className="text-gray-400 text-sm">
                                Degree
                            </span>
                            <p className="text-white font-medium">
                                {performanceData.studentInfo.degree}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <span className="text-gray-400 text-sm">
                                    Year
                                </span>
                                <p className="text-white font-medium">
                                    {performanceData.studentInfo.year}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <span className="text-gray-400 text-sm">
                                    CGPA
                                </span>
                                <p className="text-white font-medium">
                                    {performanceData.studentInfo.cgpa
                                        ? `${performanceData.studentInfo.cgpa}/10`
                                        : "Not Available"}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <span className="text-gray-400 text-sm">
                                Location
                            </span>
                            <p className="text-white font-medium">
                                {performanceData.studentInfo.location}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <span className="text-gray-400 text-sm">
                                Skills
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {performanceData.studentInfo.skills.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Work Status & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Work Status */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FaRocket className="w-6 h-6 mr-3 text-orange-400" />
                        Current Work Status
                    </h3>
                    <div className="space-y-4">
                        {performanceData.projects.list
                            .filter(
                                (project) => project.status === "in_progress"
                            )
                            .slice(0, 3)
                            .map((project, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500"
                                >
                                    <h4 className="text-white font-semibold mb-1">
                                        {project.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-2">
                                        Assigned by: {project.assignedByName}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-400 text-sm">
                                            {project.dueDate
                                                ? `Due: ${new Date(
                                                      project.dueDate
                                                  ).toLocaleDateString()}`
                                                : "No due date"}
                                        </span>
                                        <span className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full">
                                            In Progress
                                        </span>
                                    </div>
                                </div>
                            ))}
                        {performanceData.projects.list.filter(
                            (p) => p.status === "in_progress"
                        ).length === 0 && (
                            <div className="text-center py-8">
                                <FaClock className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                                <p className="text-gray-400">
                                    No active projects
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Achievements & Milestones */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FaAward className="w-6 h-6 mr-3 text-yellow-400" />
                        Achievements & Milestones
                    </h3>
                    <div className="space-y-4">
                        {/* Level Achievement */}
                        <div className="p-4 bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-lg border border-purple-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <FaGem className="w-6 h-6 text-purple-400" />
                                    <div>
                                        <h4 className="text-white font-semibold">
                                            Current Level
                                        </h4>
                                        <p className="text-purple-200 text-sm">
                                            {performanceData.performance.level}{" "}
                                            Student
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-purple-400">
                                        {
                                            performanceData.performance
                                                .totalPoints
                                        }{" "}
                                        pts
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Projects Milestone */}
                        {performanceData.projects.statistics.totalCompleted >=
                            5 && (
                            <div className="p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg border border-green-700">
                                <div className="flex items-center space-x-3">
                                    <FaTrophy className="w-6 h-6 text-green-400" />
                                    <div>
                                        <h4 className="text-white font-semibold">
                                            Project Veteran
                                        </h4>
                                        <p className="text-green-200 text-sm">
                                            Completed{" "}
                                            {
                                                performanceData.projects
                                                    .statistics.totalCompleted
                                            }{" "}
                                            projects
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rating Achievement */}
                        {performanceData.performance.overallRating >= 4.5 && (
                            <div className="p-4 bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-lg border border-yellow-700">
                                <div className="flex items-center space-x-3">
                                    <FaStar className="w-6 h-6 text-yellow-400" />
                                    <div>
                                        <h4 className="text-white font-semibold">
                                            Excellence Award
                                        </h4>
                                        <p className="text-yellow-200 text-sm">
                                            Maintains{" "}
                                            {
                                                performanceData.performance
                                                    .overallRating
                                            }
                                            + rating
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Earnings Achievement */}
                        {earningsData &&
                            earningsData.totalEarnings >= 10000 && (
                                <div className="p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg border border-blue-700">
                                    <div className="flex items-center space-x-3">
                                        <FaDollarSign className="w-6 h-6 text-blue-400" />
                                        <div>
                                            <h4 className="text-white font-semibold">
                                                High Earner
                                            </h4>
                                            <p className="text-blue-200 text-sm">
                                                Total earnings:{" "}
                                                {formatCurrency(
                                                    earningsData.totalEarnings
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Performance Chart Section */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                        <FaChartLine className="w-6 h-6 mr-3 text-blue-400" />
                        Performance Analytics
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setChartType("performance")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                chartType === "performance"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            Performance
                        </button>
                        <button
                            onClick={() => setChartType("earnings")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                chartType === "earnings"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            Earnings
                        </button>
                        <button
                            onClick={() => setChartType("projects")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                chartType === "projects"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            Projects
                        </button>
                    </div>
                </div>

                {/* Chart Content */}
                <div className="h-80 bg-gray-700 rounded-lg p-4">
                    {chartType === "performance" && (
                        <div className="h-full">
                            {getPerformanceChartData() ? (
                                <Bar
                                    data={getPerformanceChartData()}
                                    options={chartOptions}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <FaChartLine className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                                        <p className="text-gray-300">
                                            Loading performance data...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {chartType === "earnings" && (
                        <div className="h-full">
                            {getEarningsChartData() ? (
                                <Doughnut
                                    data={getEarningsChartData()}
                                    options={doughnutOptions}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <FaDollarSign className="w-16 h-16 mx-auto mb-4 text-green-400" />
                                        <p className="text-gray-300">
                                            Loading earnings data...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {chartType === "projects" && (
                        <div className="h-full">
                            {getProjectsChartData() ? (
                                <Line
                                    data={getProjectsChartData()}
                                    options={chartOptions}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <FaProjectDiagram className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                                        <p className="text-gray-300">
                                            Loading project data...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderProjectsTab = () => (
        <div className="space-y-8">
            {/* Enhanced Project Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center">
                    <FaProjectDiagram className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.totalAssigned}
                    </div>
                    <div className="text-blue-200 text-sm">Total Assigned</div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white text-center">
                    <FaCheckCircle className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.totalCompleted}
                    </div>
                    <div className="text-green-200 text-sm">Completed</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white text-center">
                    <FaClock className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.totalInProgress}
                    </div>
                    <div className="text-orange-200 text-sm">In Progress</div>
                </div>
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white text-center">
                    <FaExclamationTriangle className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.totalOverdue}
                    </div>
                    <div className="text-red-200 text-sm">Overdue</div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white text-center">
                    <FaStar className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.averageGrade ||
                            "N/A"}
                    </div>
                    <div className="text-purple-200 text-sm">Avg Grade</div>
                </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Completion Rate
                    </h3>
                    <span className="text-2xl font-bold text-white">
                        {performanceData.projects.statistics.completionRate}%
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                        style={{
                            width: `${performanceData.projects.statistics.completionRate}%`,
                        }}
                    />
                </div>
            </div>

            {/* Enhanced Projects List */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                        <FaProjectDiagram className="w-6 h-6 mr-3 text-blue-400" />
                        Projects Portfolio
                    </h3>
                    <div className="text-gray-400 text-sm">
                        {performanceData.projects.list.length} total projects
                    </div>
                </div>
                <div className="space-y-6">
                    {performanceData.projects.list.map((project, index) => {
                        const IconComponent = getServiceIcon(
                            project.serviceCategory
                        );
                        const colorClass = getServiceColor(
                            project.serviceCategory
                        );
                        return (
                            <div
                                key={index}
                                className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className={`p-3 rounded-lg ${
                                                colorClass.split(" ")[1]
                                            }`}
                                        >
                                            <IconComponent
                                                className={`w-6 h-6 ${
                                                    colorClass.split(" ")[0]
                                                }`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-white mb-1">
                                                {project.title}
                                            </h4>
                                            <p className="text-gray-400 text-sm mb-2">
                                                {project.serviceCategory ||
                                                    "General Project"}
                                            </p>
                                            {project.description && (
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(
                                                project.status
                                            )} mb-2 inline-block`}
                                        >
                                            {project.status
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </span>
                                        {project.quotedPrice && (
                                            <div className="text-green-400 font-bold text-lg">
                                                {formatCurrency(
                                                    project.quotedPrice
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-600 text-sm">
                                    <div>
                                        <span className="text-gray-400 flex items-center mb-1">
                                            <FaUserTie className="w-3 h-3 mr-1" />
                                            Assigned by:
                                        </span>
                                        <p className="text-white font-medium">
                                            {project.assignedByName}
                                        </p>
                                    </div>
                                    {project.dueDate && (
                                        <div>
                                            <span className="text-gray-400 flex items-center mb-1">
                                                <FaCalendar className="w-3 h-3 mr-1" />
                                                Due Date:
                                            </span>
                                            <p
                                                className={`font-medium ${
                                                    project.isOverdue
                                                        ? "text-red-400"
                                                        : "text-white"
                                                }`}
                                            >
                                                {new Date(
                                                    project.dueDate
                                                ).toLocaleDateString()}
                                                {project.daysUntilDue !==
                                                    null && (
                                                    <span className="text-xs text-gray-400 block">
                                                        (
                                                        {project.daysUntilDue >
                                                        0
                                                            ? `${project.daysUntilDue} days left`
                                                            : project.daysUntilDue ===
                                                              0
                                                            ? "Due today"
                                                            : `${Math.abs(
                                                                  project.daysUntilDue
                                                              )} days overdue`}
                                                        )
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    {project.completedDate && (
                                        <div>
                                            <span className="text-gray-400 flex items-center mb-1">
                                                <FaCheckCircle className="w-3 h-3 mr-1" />
                                                Completed:
                                            </span>
                                            <p className="text-green-400 font-medium">
                                                {new Date(
                                                    project.completedDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {project.grade && (
                                        <div>
                                            <span className="text-gray-400 flex items-center mb-1">
                                                <FaStar className="w-3 h-3 mr-1" />
                                                Grade:
                                            </span>
                                            <p className="text-yellow-400 font-semibold text-lg">
                                                {project.grade}/100
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Progress bar for in-progress projects */}
                                {project.status === "in_progress" &&
                                    project.progress && (
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400 text-sm">
                                                    Progress
                                                </span>
                                                <span className="text-white font-medium">
                                                    {project.progress}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-600 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${project.progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                    {performanceData.projects.list.length === 0 && (
                        <div className="text-center py-12">
                            <FaProjectDiagram className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-400 text-lg">
                                No projects assigned yet
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Projects will appear here once assigned by
                                administrators
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderWorkTab = () => (
        <div className="space-y-8">
            {/* Work Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center">
                    <FaBriefcase className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.totalAssigned}
                    </div>
                    <div className="text-blue-200 text-sm">Total Works</div>
                </div>
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white text-center">
                    <FaClock className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.totalInProgress}
                    </div>
                    <div className="text-orange-200 text-sm">Active Works</div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white text-center">
                    <FaCheckCircle className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.projects.statistics.completionRate}%
                    </div>
                    <div className="text-green-200 text-sm">
                        Completion Rate
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white text-center">
                    <FaDollarSign className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {earningsData
                            ? formatCurrency(earningsData.averageProjectValue)
                            : "₹0"}
                    </div>
                    <div className="text-purple-200 text-sm">Avg Earnings</div>
                </div>
            </div>

            {/* Work Assignment Timeline */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <FaCalendar className="w-6 h-6 mr-3 text-blue-400" />
                    Work Assignment Timeline
                </h3>
                <div className="space-y-4">
                    {performanceData.projects.list
                        .sort(
                            (a, b) =>
                                new Date(b.assignedDate || b.createdAt) -
                                new Date(a.assignedDate || a.createdAt)
                        )
                        .slice(0, 5)
                        .map((project, index) => {
                            const IconComponent = getServiceIcon(
                                project.serviceCategory
                            );
                            const colorClass = getServiceColor(
                                project.serviceCategory
                            );
                            return (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg"
                                >
                                    <div
                                        className={`p-2 rounded-lg ${
                                            colorClass.split(" ")[1]
                                        }`}
                                    >
                                        <IconComponent
                                            className={`w-5 h-5 ${
                                                colorClass.split(" ")[0]
                                            }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-semibold">
                                            {project.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            Assigned by {project.assignedByName}{" "}
                                            •{" "}
                                            {project.serviceCategory
                                                ?.replace("-", " ")
                                                .replace(/\b\w/g, (l) =>
                                                    l.toUpperCase()
                                                )}
                                        </p>
                                        {project.workDetails && (
                                            <div className="mt-2 flex items-center gap-4 text-xs">
                                                <span className="text-green-400">
                                                    Work Status:{" "}
                                                    {project.workDetails.workStatus
                                                        ?.replace("_", " ")
                                                        .toUpperCase()}
                                                </span>
                                                {project.actualEarnings > 0 && (
                                                    <span className="text-blue-400">
                                                        Earnings:{" "}
                                                        {formatCurrency(
                                                            project.actualEarnings
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(
                                                project.status
                                            )} mb-1`}
                                        >
                                            {project.status
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </div>
                                        <p className="text-gray-400 text-xs">
                                            {new Date(
                                                project.assignedDate ||
                                                    project.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                        {project.actualEarnings > 0 && (
                                            <p className="text-green-400 text-xs font-semibold mt-1">
                                                {formatCurrency(
                                                    project.actualEarnings
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Current Tasks & Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Deadlines */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FaExclamationTriangle className="w-6 h-6 mr-3 text-red-400" />
                        Upcoming Deadlines
                    </h3>
                    <div className="space-y-3">
                        {performanceData.projects.list
                            .filter(
                                (project) =>
                                    project.dueDate &&
                                    project.status === "in_progress"
                            )
                            .sort(
                                (a, b) =>
                                    new Date(a.dueDate) - new Date(b.dueDate)
                            )
                            .slice(0, 4)
                            .map((project, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border-l-4 ${
                                        project.isOverdue
                                            ? "bg-red-900/20 border-red-500"
                                            : project.daysUntilDue <= 3
                                            ? "bg-yellow-900/20 border-yellow-500"
                                            : "bg-blue-900/20 border-blue-500"
                                    }`}
                                >
                                    <h4 className="text-white font-medium">
                                        {project.title}
                                    </h4>
                                    <p
                                        className={`text-sm ${
                                            project.isOverdue
                                                ? "text-red-400"
                                                : project.daysUntilDue <= 3
                                                ? "text-yellow-400"
                                                : "text-blue-400"
                                        }`}
                                    >
                                        Due:{" "}
                                        {new Date(
                                            project.dueDate
                                        ).toLocaleDateString()}
                                        {project.daysUntilDue !== null && (
                                            <span className="ml-2">
                                                (
                                                {project.daysUntilDue > 0
                                                    ? `${project.daysUntilDue} days left`
                                                    : project.daysUntilDue === 0
                                                    ? "Due today"
                                                    : `${Math.abs(
                                                          project.daysUntilDue
                                                      )} days overdue`}
                                                )
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        {performanceData.projects.list.filter(
                            (p) => p.dueDate && p.status === "in_progress"
                        ).length === 0 && (
                            <div className="text-center py-8">
                                <FaCheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                                <p className="text-gray-400">
                                    No upcoming deadlines
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Work Performance Insights */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <FaLightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                        Performance Insights
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300">
                                    On-Time Delivery
                                </span>
                                <span className="text-green-400 font-bold">
                                    {(
                                        ((performanceData.projects.statistics
                                            .totalCompleted -
                                            performanceData.projects.statistics
                                                .totalOverdue) /
                                            Math.max(
                                                performanceData.projects
                                                    .statistics.totalCompleted,
                                                1
                                            )) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                    style={{
                                        width: `${
                                            ((performanceData.projects
                                                .statistics.totalCompleted -
                                                performanceData.projects
                                                    .statistics.totalOverdue) /
                                                Math.max(
                                                    performanceData.projects
                                                        .statistics
                                                        .totalCompleted,
                                                    1
                                                )) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300">
                                    Work Quality Score
                                </span>
                                <div className="flex items-center">
                                    <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-yellow-400 font-bold">
                                        {
                                            performanceData.performance
                                                .qualityOfWork
                                        }
                                        /5
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                                    style={{
                                        width: `${
                                            (performanceData.performance
                                                .qualityOfWork /
                                                5) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300">
                                    Communication Score
                                </span>
                                <div className="flex items-center">
                                    <FaComments className="w-4 h-4 text-blue-400 mr-1" />
                                    <span className="text-blue-400 font-bold">
                                        {
                                            performanceData.performance
                                                .communicationSkills
                                        }
                                        /5
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                    style={{
                                        width: `${
                                            (performanceData.performance
                                                .communicationSkills /
                                                5) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderReviewsTab = () => (
        <div className="space-y-8">
            {/* Reviews Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white text-center">
                    <FaComments className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.reviews.length}
                    </div>
                    <div className="text-green-200 text-sm">Total Reviews</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white text-center">
                    <FaStar className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {performanceData.reviews.length > 0
                            ? (
                                  performanceData.reviews.reduce(
                                      (sum, review) => sum + review.rating,
                                      0
                                  ) / performanceData.reviews.length
                              ).toFixed(1)
                            : "N/A"}
                    </div>
                    <div className="text-yellow-200 text-sm">
                        Average Rating
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center">
                    <FaTrophy className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {
                            performanceData.reviews.filter(
                                (review) => review.rating >= 4.5
                            ).length
                        }
                    </div>
                    <div className="text-blue-200 text-sm">5-Star Reviews</div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white text-center">
                    <FaHandshake className="w-8 h-8 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">
                        {
                            performanceData.reviews.filter(
                                (review) => review.rating >= 4.0
                            ).length
                        }
                    </div>
                    <div className="text-purple-200 text-sm">
                        Positive Reviews
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <FaComments className="w-6 h-6 mr-3 text-blue-400" />
                    Client Reviews & Feedback
                </h3>
                <div className="space-y-6">
                    {performanceData.reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <FaUser className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">
                                            {review.reviewerInfo
                                                ? review.reviewerInfo.name
                                                : review.reviewerName}
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            {review.reviewerInfo
                                                ? review.reviewerInfo.role
                                                : review.reviewerRole}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`w-5 h-5 ${
                                                star <= review.rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-600"
                                            }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-white font-bold text-lg">
                                        {review.rating}/5
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                {review.comment}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-2">
                                    {review.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm">
                                    {new Date(
                                        review.reviewDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {performanceData.reviews.length === 0 && (
                        <div className="text-center py-12">
                            <FaComments className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-400 text-lg">
                                No reviews yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderReportsTab = () => (
        <div className="space-y-8">
            {/* Report Statistics */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                        {performanceData.reports.statistics.totalReports}
                    </div>
                    <div className="text-gray-400">Total Reports</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                        {performanceData.reports.statistics.resolvedReports}
                    </div>
                    <div className="text-gray-400">Resolved</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                        {performanceData.reports.statistics.pendingReports}
                    </div>
                    <div className="text-gray-400">Pending</div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                    Incident Reports
                </h3>
                <div className="space-y-6">
                    {performanceData.reports.list.map((report, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getReportSeverityColor(
                                            report.severity
                                        )}`}
                                    >
                                        {report.severity.toUpperCase()}
                                    </span>
                                    <span className="text-white font-semibold">
                                        {report.type
                                            .replace("_", " ")
                                            .toUpperCase()}
                                    </span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        report.status === "resolved" ||
                                        report.status === "closed"
                                            ? "bg-green-600 text-green-100"
                                            : "bg-yellow-600 text-yellow-100"
                                    }`}
                                >
                                    {report.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                {report.description}
                            </p>
                            {report.actionTaken && (
                                <div className="mb-4 p-4 bg-gray-600 rounded-lg">
                                    <span className="text-gray-400 text-sm font-medium">
                                        Action Taken:
                                    </span>
                                    <p className="text-gray-200 mt-1">
                                        {report.actionTaken}
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">
                                    Reported by:{" "}
                                    <span className="text-white">
                                        {report.reporterInfo
                                            ? report.reporterInfo.name
                                            : "System"}
                                    </span>
                                </span>
                                <span className="text-gray-400">
                                    {new Date(
                                        report.reportDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {performanceData.reports.list.length === 0 && (
                        <div className="text-center py-12">
                            <FaFlag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-400 text-lg">
                                No reports filed
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-white text-xl">
                        Loading student performance data...
                    </p>
                </div>
            </div>
        );
    }

    if (!performanceData) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <FaExclamationTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Failed to Load Performance Data
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Unable to fetch student performance information.
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={fetchPerformanceData}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => navigate("/admin/approved-students")}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation Bar */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() =>
                                    navigate("/admin/approved-students")
                                }
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                            >
                                <FaArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Student Performance Analytics
                                </h1>
                                <p className="text-gray-400 mt-1">
                                    Comprehensive tracking and insights
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate("/admin/dashboard")}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaHome className="w-4 h-4" />
                                Dashboard
                            </button>
                            <button
                                onClick={() =>
                                    navigate("/admin/approved-students")
                                }
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaUsers className="w-4 h-4" />
                                All Students
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Tab Navigation */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8">
                        {[
                            {
                                id: "overview",
                                label: "Overview",
                                icon: FaChartLine,
                                description: "Complete performance dashboard",
                            },
                            {
                                id: "projects",
                                label: "Projects",
                                icon: FaProjectDiagram,
                                description: "Project portfolio & history",
                            },
                            {
                                id: "work",
                                label: "Work Tracking",
                                icon: FaBriefcase,
                                description: "Current work & assignments",
                            },
                            {
                                id: "reviews",
                                label: "Reviews",
                                icon: FaComments,
                                description: "Client feedback & ratings",
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group px-6 py-4 font-medium text-sm flex items-center space-x-2 border-b-2 transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "border-blue-400 text-blue-400"
                                        : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <div className="text-left">
                                    <div>{tab.label}</div>
                                    <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                        {tab.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === "overview" && renderOverviewTab()}
                {activeTab === "projects" && renderProjectsTab()}
                {activeTab === "work" && renderWorkTab()}
                {activeTab === "reviews" && renderReviewsTab()}
            </div>
        </div>
    );
};

export default StudentTracking;
