import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    FaUsers,
    FaUserGraduate,
    FaClipboardList,
    FaChartBar,
    FaArrowUp,
    FaArrowDown,
    FaEye,
    FaUserCheck,
    FaCalendarAlt,
    FaStar,
    FaSpinner,
    FaExclamationTriangle,
    FaUserShield,
} from "react-icons/fa";
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
import { Bar, Doughnut, Line } from "react-chartjs-2";
import api from "../../utils/api";
import toast from "react-hot-toast";

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

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalAdmins: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        recentlyActiveUsers: 0,
        userGrowthPercentage: 0,
    });

    const [applicationStats, setApplicationStats] = useState({
        totalApplications: 0,
        approvedApplications: 0,
        pendingApplications: 0,
        rejectedApplications: 0,
        approvalRate: 0,
    });

    const [projectStats, setProjectStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        completionRate: 0,
    });

    const [workStats, setWorkStats] = useState({
        totalWorks: 0,
        completedWorks: 0,
        inProgressWorks: 0,
        completionRate: 0,
    });

    const [earningsData, setEarningsData] = useState({
        totalEarnings: 0,
        avgEarningsPerWork: 0,
        maxEarning: 0,
        minEarning: 0,
        count: 0,
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [chartData, setChartData] = useState({
        userGrowth: [],
        roleDistribution: [],
        profileCompletionStats: [],
        projectsByCategory: [],
        workAnalytics: [],
        categoryPerformance: [],
        monthlyProjectTrends: [],
        monthlyWorkTrends: [],
        topStudents: [],
    });
    const [error, setError] = useState(null);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsResponse, activityResponse] = await Promise.all([
                api.get("/admin/dashboard/stats"),
                api.get("/admin/dashboard/activity?limit=10"),
            ]);

            if (statsResponse.data.success) {
                const {
                    stats: fetchedStats,
                    applicationStats: fetchedApplicationStats,
                    projectStats: fetchedProjectStats,
                    workStats: fetchedWorkStats,
                    earningsAnalytics,
                    roleDistribution,
                    userGrowthData,
                    profileCompletionStats,
                    projectsByCategory,
                    workAnalytics,
                    categoryPerformance,
                    monthlyProjectTrends,
                    monthlyWorkTrends,
                    topStudents,
                } = statsResponse.data.data;

                setStats(fetchedStats);
                setApplicationStats(fetchedApplicationStats);
                setProjectStats(fetchedProjectStats);
                setWorkStats(fetchedWorkStats);
                setEarningsData(earningsAnalytics);
                setChartData({
                    userGrowth: userGrowthData || [],
                    roleDistribution: roleDistribution || [],
                    profileCompletionStats: profileCompletionStats || [],
                    projectsByCategory: projectsByCategory || [],
                    workAnalytics: workAnalytics || [],
                    categoryPerformance: categoryPerformance || [],
                    monthlyProjectTrends: monthlyProjectTrends || [],
                    monthlyWorkTrends: monthlyWorkTrends || [],
                    topStudents: topStudents || [],
                });
            }

            if (activityResponse.data.success) {
                setRecentActivity(activityResponse.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data");
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        change,
        changeType,
        color,
        subtitle,
        trend,
    }) => (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 group">
            <div className="flex items-start justify-between mb-4">
                <div
                    className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {change && (
                    <div className="flex items-center space-x-1">
                        {changeType === "increase" ? (
                            <div className="flex items-center bg-green-500/10 px-2 py-1 rounded-full">
                                <FaArrowUp className="w-3 h-3 text-green-400 mr-1" />
                                <span className="text-xs font-medium text-green-400">
                                    +{change}%
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center bg-red-500/10 px-2 py-1 rounded-full">
                                <FaArrowDown className="w-3 h-3 text-red-400 mr-1" />
                                <span className="text-xs font-medium text-red-400">
                                    {change}%
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                    {title}
                </p>
                <p className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {typeof value === "string" ? value : value.toLocaleString()}
                </p>
                {subtitle && (
                    <p className="text-xs text-gray-500">{subtitle}</p>
                )}
            </div>
        </div>
    );

    const UserGrowthChart = ({ data }) => {
        if (!data || data.length === 0) {
            return (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6">
                        User Growth
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-400">
                        <span>No growth data available</span>
                    </div>
                </div>
            );
        }

        const chartData = {
            labels: data.map((item) => `${item.month} ${item.year}`),
            datasets: [
                {
                    label: "Total Users",
                    data: data.map((item) => item.totalUsers || item.users),
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                    borderColor: "rgba(59, 130, 246, 1)",
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    borderWidth: 1,
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: "#9CA3AF",
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    grid: {
                        color: "rgba(75, 85, 99, 0.3)",
                    },
                    ticks: {
                        color: "#9CA3AF",
                        font: {
                            size: 12,
                        },
                    },
                },
            },
        };

        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                    User Growth
                </h3>
                <div className="h-64">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        );
    };

    const RoleDistributionChart = ({ data }) => {
        if (!data || data.length === 0) {
            return (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6">
                        Role Distribution
                    </h3>
                    <div className="flex items-center justify-center h-48 text-gray-400">
                        <span>No data available</span>
                    </div>
                </div>
            );
        }

        const total = data.reduce((sum, item) => sum + item.count, 0);
        const colors = {
            admin: "rgba(239, 68, 68, 0.8)", // Red
            student: "rgba(16, 185, 129, 0.8)", // Green
            user: "rgba(59, 130, 246, 0.8)", // Blue
        };

        const borderColors = {
            admin: "rgba(239, 68, 68, 1)",
            student: "rgba(16, 185, 129, 1)",
            user: "rgba(59, 130, 246, 1)",
        };

        const chartData = {
            labels: data.map(
                (item) => item._id.charAt(0).toUpperCase() + item._id.slice(1)
            ),
            datasets: [
                {
                    data: data.map((item) => item.count),
                    backgroundColor: data.map(
                        (item) => colors[item._id] || "rgba(107, 114, 128, 0.8)"
                    ),
                    borderColor: data.map(
                        (item) =>
                            borderColors[item._id] || "rgba(107, 114, 128, 1)"
                    ),
                    borderWidth: 2,
                    hoverOffset: 10,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            const percentage = (
                                (context.parsed / total) *
                                100
                            ).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        },
                    },
                },
            },
            cutout: "60%",
        };

        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                    Role Distribution
                </h3>
                <div className="flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                        <Doughnut data={chartData} options={options} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {total}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    Total Users
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-4 h-4 rounded-full mr-3`}
                                    style={{
                                        backgroundColor:
                                            colors[item._id] || "#6B7280",
                                    }}
                                ></div>
                                <span className="text-gray-300">
                                    {item._id.charAt(0).toUpperCase() +
                                        item._id.slice(1)}
                                    s
                                </span>
                            </div>
                            <span className="text-white font-semibold">
                                {item.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Projects by Category Chart
    const ProjectsByCategoryChart = ({ data }) => {
        if (!data || data.length === 0) {
            return (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6">
                        Projects by Category
                    </h3>
                    <div className="text-center py-8 text-gray-400">
                        <FaChartBar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No project data available</p>
                    </div>
                </div>
            );
        }

        const formatCategoryName = (category) => {
            return category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        };

        const chartData = {
            labels: data.map((item) => formatCategoryName(item._id)),
            datasets: [
                {
                    label: "Total Projects",
                    data: data.map((item) => item.count),
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                    borderColor: "rgba(59, 130, 246, 1)",
                    borderWidth: 2,
                    borderRadius: 8,
                },
                {
                    label: "Completed Projects",
                    data: data.map((item) => item.completedCount),
                    backgroundColor: "rgba(16, 185, 129, 0.8)",
                    borderColor: "rgba(16, 185, 129, 1)",
                    borderWidth: 2,
                    borderRadius: 8,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff",
                    },
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    borderWidth: 1,
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: "#9CA3AF",
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    grid: {
                        color: "rgba(75, 85, 99, 0.3)",
                    },
                    ticks: {
                        color: "#9CA3AF",
                        font: {
                            size: 12,
                        },
                    },
                },
            },
        };

        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                    Projects by Category
                </h3>
                <div className="h-64">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        );
    };

    // Work Status Distribution Chart
    const WorkStatusChart = ({ data }) => {
        if (!data || data.length === 0) {
            return (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6">
                        Work Status Distribution
                    </h3>
                    <div className="text-center py-8 text-gray-400">
                        <FaChartBar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No work data available</p>
                    </div>
                </div>
            );
        }

        const total = data.reduce((sum, item) => sum + item.count, 0);
        const colors = {
            approved: "rgba(59, 130, 246, 0.8)",
            in_progress: "rgba(245, 158, 11, 0.8)",
            completed: "rgba(16, 185, 129, 0.8)",
            delivered: "rgba(34, 197, 94, 0.8)",
            cancelled: "rgba(239, 68, 68, 0.8)",
            review_pending: "rgba(168, 85, 247, 0.8)",
        };

        const formatStatusName = (status) => {
            return status
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        };

        const chartData = {
            labels: data.map((item) => formatStatusName(item._id)),
            datasets: [
                {
                    data: data.map((item) => item.count),
                    backgroundColor: data.map(
                        (item) => colors[item._id] || "rgba(107, 114, 128, 0.8)"
                    ),
                    borderColor: data.map(
                        (item) =>
                            colors[item._id]?.replace("0.8", "1") ||
                            "rgba(107, 114, 128, 1)"
                    ),
                    borderWidth: 2,
                    hoverOffset: 10,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            const percentage = (
                                (context.parsed / total) *
                                100
                            ).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        },
                    },
                },
            },
            cutout: "60%",
        };

        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                    Work Status Distribution
                </h3>
                <div className="flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                        <Doughnut data={chartData} options={options} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {total}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    Total Works
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <div
                                    className="w-4 h-4 rounded-full mr-3"
                                    style={{
                                        backgroundColor:
                                            colors[item._id] || "#6B7280",
                                    }}
                                ></div>
                                <span className="text-gray-300">
                                    {formatStatusName(item._id)}
                                </span>
                            </div>
                            <span className="text-white font-semibold">
                                {item.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Earnings Analytics Chart
    const EarningsChart = ({ categoryData }) => {
        if (!categoryData || categoryData.length === 0) {
            return (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-6">
                        Earnings by Category
                    </h3>
                    <div className="text-center py-8 text-gray-400">
                        <FaChartBar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No earnings data available</p>
                    </div>
                </div>
            );
        }

        const formatCategoryName = (category) => {
            return category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        };

        const chartData = {
            labels: categoryData.map((item) => formatCategoryName(item._id)),
            datasets: [
                {
                    label: "Total Earnings (₹)",
                    data: categoryData.map((item) => item.totalEarnings),
                    backgroundColor: "rgba(34, 197, 94, 0.8)",
                    borderColor: "rgba(34, 197, 94, 1)",
                    borderWidth: 2,
                    borderRadius: 8,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff",
                    },
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            return `${
                                context.dataset.label
                            }: ₹${context.parsed.y.toLocaleString("en-IN")}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: "#9CA3AF",
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    grid: {
                        color: "rgba(75, 85, 99, 0.3)",
                    },
                    ticks: {
                        color: "#9CA3AF",
                        font: {
                            size: 12,
                        },
                        callback: function (value) {
                            return "₹" + value.toLocaleString("en-IN");
                        },
                    },
                },
            },
        };

        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                    Earnings by Category
                </h3>
                <div className="h-64">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        );
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "application":
                return <FaClipboardList className="w-4 h-4 text-blue-400" />;
            case "update":
                return <FaEye className="w-4 h-4 text-green-400" />;
            case "registration":
                return <FaUsers className="w-4 h-4 text-purple-400" />;
            case "approval":
                return <FaUserCheck className="w-4 h-4 text-emerald-400" />;
            case "project":
                return <FaStar className="w-4 h-4 text-yellow-400" />;
            case "login":
                return <FaEye className="w-4 h-4 text-cyan-400" />;
            default:
                return <FaEye className="w-4 h-4 text-gray-400" />;
        }
    };

    // Loading component
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center">
                    <FaSpinner className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-white text-xl">Loading dashboard...</p>
                    <p className="text-gray-400 mt-2">
                        Please wait while we fetch your data
                    </p>
                </div>
            </div>
        );
    }

    // Error component
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center max-w-md">
                    <FaExclamationTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Dashboard Error
                    </h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            {/* Enhanced Header */}
            <div className="mb-10">
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                                Welcome back, {user?.username}! 👋
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Here's your platform overview and key insights
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl">
                                <FaChartBar className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Overview Cards */}
            <div className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={FaUsers}
                        change={stats.userGrowthPercentage}
                        changeType={
                            stats.userGrowthPercentage >= 0
                                ? "increase"
                                : "decrease"
                        }
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        subtitle="Platform members"
                    />
                    <StatCard
                        title="Active Students"
                        value={stats.totalStudents}
                        icon={FaUserGraduate}
                        color="bg-gradient-to-br from-green-500 to-emerald-600"
                        subtitle="Learning & growing"
                    />
                    <StatCard
                        title="Total Earnings"
                        value={`₹${
                            earningsData.totalEarnings?.toLocaleString(
                                "en-IN"
                            ) || 0
                        }`}
                        icon={FaStar}
                        color="bg-gradient-to-br from-yellow-500 to-orange-600"
                        subtitle="Student earnings"
                    />
                    <StatCard
                        title="Active Projects"
                        value={projectStats.totalProjects}
                        icon={FaChartBar}
                        color="bg-gradient-to-br from-purple-500 to-pink-600"
                        subtitle="In progress"
                    />
                </div>
            </div>

            {/* Application Analytics Section */}
            <div className="mb-10">
                <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/20">
                    <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl mr-4">
                            <FaClipboardList className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Application Pipeline
                            </h2>
                            <p className="text-gray-400">
                                Student application workflow and approval
                                metrics
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <FaClipboardList className="w-8 h-8 text-purple-400" />
                                <div className="bg-purple-500/10 px-3 py-1 rounded-full">
                                    <span className="text-purple-400 text-xs font-medium">
                                        TOTAL
                                    </span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {applicationStats.totalApplications}
                            </div>
                            <div className="text-gray-400 text-sm">
                                Applications Received
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <FaUserCheck className="w-8 h-8 text-green-400" />
                                <div className="bg-green-500/10 px-3 py-1 rounded-full">
                                    <span className="text-green-400 text-xs font-medium">
                                        APPROVED
                                    </span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {applicationStats.approvedApplications}
                            </div>
                            <div className="text-gray-400 text-sm">
                                Students Onboarded
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <FaUsers className="w-8 h-8 text-yellow-400" />
                                <div className="bg-yellow-500/10 px-3 py-1 rounded-full">
                                    <span className="text-yellow-400 text-xs font-medium">
                                        PENDING
                                    </span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {applicationStats.pendingApplications}
                            </div>
                            <div className="text-gray-400 text-sm">
                                Awaiting Review
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <FaStar className="w-8 h-8 text-blue-400" />
                                <div className="bg-blue-500/10 px-3 py-1 rounded-full">
                                    <span className="text-blue-400 text-xs font-medium">
                                        RATE
                                    </span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {applicationStats.approvalRate}%
                            </div>
                            <div className="text-gray-400 text-sm">
                                Approval Success
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project & Work Analytics */}
            <div className="mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Projects Section */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-blue-500/20">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mr-4">
                                <FaChartBar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    Project Management
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Assignment and completion tracking
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-400 text-sm font-medium">
                                        TOTAL
                                    </span>
                                    <FaChartBar className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {projectStats.totalProjects}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Projects Created
                                </div>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-green-400 text-sm font-medium">
                                        DONE
                                    </span>
                                    <FaUserCheck className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {projectStats.completedProjects}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Successfully Completed
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 bg-gray-800/30 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">
                                    Completion Rate
                                </span>
                                <span className="text-blue-400 font-semibold">
                                    {projectStats.completionRate}%
                                </span>
                            </div>
                            <div className="mt-2 bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${projectStats.completionRate}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Works Section */}
                    <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl p-8 border border-emerald-500/20">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl mr-4">
                                <FaUsers className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    Work Execution
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Student work progress and delivery
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-purple-400 text-sm font-medium">
                                        ACTIVE
                                    </span>
                                    <FaUsers className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {workStats.totalWorks}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Works in Pipeline
                                </div>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-emerald-400 text-sm font-medium">
                                        DELIVERED
                                    </span>
                                    <FaStar className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {workStats.completedWorks}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Successfully Delivered
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 bg-gray-800/30 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">
                                    Delivery Rate
                                </span>
                                <span className="text-emerald-400 font-semibold">
                                    {workStats.completionRate}%
                                </span>
                            </div>
                            <div className="mt-2 bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${workStats.completionRate}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="mb-10">
                <div className="bg-gradient-to-r from-yellow-900/30 via-orange-900/30 to-red-900/30 rounded-2xl p-8 border border-yellow-500/20">
                    <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl mr-4">
                            <FaStar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Financial Overview
                            </h2>
                            <p className="text-gray-400">
                                Student earnings and payment analytics
                            </p>
                        </div>
                    </div>

                    {/* Main Earnings Display */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 rounded-2xl p-6 border border-green-500/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-300 mb-1">
                                            Total Student Earnings
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            Cumulative payments to students
                                        </p>
                                    </div>
                                    <div className="bg-green-500/20 p-3 rounded-xl">
                                        <FaStar className="w-8 h-8 text-green-400" />
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">
                                    ₹
                                    {earningsData.totalEarnings?.toLocaleString(
                                        "en-IN"
                                    ) || 0}
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center text-green-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        <span>Active Payments</span>
                                    </div>
                                    <div className="text-gray-400">•</div>
                                    <div className="text-gray-400">
                                        {earningsData.count || 0} completed
                                        works
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-400 text-sm font-medium">
                                        AVG EARNING
                                    </span>
                                    <FaChartBar className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="text-xl font-bold text-white">
                                    ₹
                                    {Math.round(
                                        earningsData.avgEarningsPerWork || 0
                                    ).toLocaleString("en-IN")}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Per completed work
                                </div>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-purple-400 text-sm font-medium">
                                        HIGHEST
                                    </span>
                                    <FaArrowUp className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="text-xl font-bold text-white">
                                    ₹
                                    {earningsData.maxEarning?.toLocaleString(
                                        "en-IN"
                                    ) || 0}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Single work payment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="mb-10">
                <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30">
                    <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-xl mr-4">
                            <FaChartBar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Analytics Dashboard
                            </h2>
                            <p className="text-gray-400">
                                Visual insights and trends analysis
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <UserGrowthChart data={chartData.userGrowth} />
                        <RoleDistributionChart
                            data={chartData.roleDistribution}
                        />
                    </div>
                </div>
            </div>

            {/* Project & Work Insights */}
            <div className="mb-10">
                <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30">
                    <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mr-4">
                            <FaUsers className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Work Distribution & Progress
                            </h2>
                            <p className="text-gray-400">
                                Category breakdown and status tracking
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ProjectsByCategoryChart
                            data={chartData.projectsByCategory}
                        />
                        <WorkStatusChart data={chartData.workAnalytics} />
                    </div>
                </div>
            </div>

            {/* Earnings Analytics Chart */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Financial Analytics
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    <EarningsChart
                        categoryData={chartData.categoryPerformance}
                    />
                </div>
            </div>

            {/* Leaderboard */}
            {chartData.topStudents && chartData.topStudents.length > 0 && (
                <div className="mb-10">
                    <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-8 border border-yellow-500/20">
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl mr-4">
                                <FaStar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    Top Performers 🏆
                                </h3>
                                <p className="text-gray-400">
                                    Our highest achieving students this month
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {chartData.topStudents.map((student, index) => (
                                <div
                                    key={student.id}
                                    className={`relative bg-gradient-to-br ${
                                        index === 0
                                            ? "from-yellow-800/50 to-yellow-900/50 border-yellow-500/30"
                                            : index === 1
                                            ? "from-gray-700/50 to-gray-800/50 border-gray-500/30"
                                            : index === 2
                                            ? "from-orange-800/50 to-orange-900/50 border-orange-500/30"
                                            : "from-gray-800/50 to-gray-900/50 border-gray-600/30"
                                    } rounded-xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                                >
                                    {/* Rank Badge */}
                                    <div
                                        className={`absolute -top-3 -left-3 w-10 h-10 ${
                                            index === 0
                                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                                : index === 1
                                                ? "bg-gradient-to-br from-gray-400 to-gray-600"
                                                : index === 2
                                                ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                                : "bg-gradient-to-br from-blue-400 to-blue-600"
                                        } rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Student Info */}
                                    <div className="pt-2">
                                        <h4 className="text-white font-bold text-lg mb-1">
                                            {student.name}
                                        </h4>
                                        <p className="text-gray-400 text-sm mb-4">
                                            {student.email}
                                        </p>

                                        {/* Stats */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm">
                                                    Completion Rate
                                                </span>
                                                <span className="text-green-400 font-bold">
                                                    {student.completionRate}%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm">
                                                    Projects Done
                                                </span>
                                                <span className="text-blue-400 font-bold">
                                                    {student.totalCompleted}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm">
                                                    Rating
                                                </span>
                                                <div className="flex items-center">
                                                    <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                                                    <span className="text-yellow-400 font-bold">
                                                        {student.overallRating.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${
                                                        index === 0
                                                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                                            : index === 1
                                                            ? "bg-gradient-to-r from-gray-400 to-gray-600"
                                                            : index === 2
                                                            ? "bg-gradient-to-r from-orange-400 to-orange-600"
                                                            : "bg-gradient-to-r from-blue-400 to-blue-600"
                                                    }`}
                                                    style={{
                                                        width: `${student.completionRate}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="mb-10">
                <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl mr-4">
                                <FaEye className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    Recent Activity
                                </h3>
                                <p className="text-gray-400">
                                    Latest platform events and user actions
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            <FaSpinner
                                className={`w-4 h-4 ${
                                    loading ? "animate-spin" : ""
                                }`}
                            />
                            Refresh
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <FaEye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No recent activity to display</p>
                            </div>
                        ) : (
                            recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-600 rounded-lg">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {activity.user}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {activity.action}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                                        {activity.time}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-8 border border-indigo-500/20">
                    <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl mr-4">
                            <FaUsers className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                Quick Actions
                            </h3>
                            <p className="text-gray-400">
                                Common administrative tasks and shortcuts
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button
                            onClick={() =>
                                navigate("/admin/student-applications")
                            }
                            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 transform"
                        >
                            <FaClipboardList className="w-4 h-4" />
                            Review Applications
                        </button>
                        <button
                            onClick={() => navigate("/admin/approved-students")}
                            className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 transform"
                        >
                            <FaUserCheck className="w-4 h-4" />
                            Approved Students
                        </button>
                        <button
                            onClick={() => navigate("/admin/all-users")}
                            className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 transform"
                        >
                            <FaUsers className="w-4 h-4" />
                            Manage Users
                        </button>
                    </div>

                    {/* Additional Quick Actions Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <button
                            onClick={fetchDashboardData}
                            disabled={loading}
                            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                            ) : (
                                <FaChartBar className="w-4 h-4" />
                            )}
                            {loading ? "Refreshing..." : "Refresh Data"}
                        </button>
                        <button
                            onClick={() => {
                                const csvData = `Dashboard Stats Export - ${new Date().toISOString()}\n\nTotal Users: ${
                                    stats.totalUsers
                                }\nTotal Students: ${
                                    stats.totalStudents
                                }\nTotal Admins: ${
                                    stats.totalAdmins
                                }\nActive Users: ${
                                    stats.activeUsers
                                }\nNew Users (30d): ${
                                    stats.newUsersThisMonth
                                }\nRecent Activity (7d): ${
                                    stats.recentlyActiveUsers
                                }`;
                                const blob = new Blob([csvData], {
                                    type: "text/plain",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `dashboard-stats-${
                                    new Date().toISOString().split("T")[0]
                                }.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                                toast.success(
                                    "Dashboard stats exported successfully!"
                                );
                            }}
                            className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FaStar className="w-4 h-4" />
                            Export Stats
                        </button>
                        <button
                            onClick={() => {
                                if (recentActivity.length === 0) {
                                    toast.error("No recent activity to show");
                                    return;
                                }
                                const activitySummary = recentActivity
                                    .map(
                                        (activity) =>
                                            `${activity.user} - ${activity.action} (${activity.time})`
                                    )
                                    .join("\n");
                                navigator.clipboard.writeText(activitySummary);
                                toast.success(
                                    "Recent activity copied to clipboard!"
                                );
                            }}
                            className="p-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FaCalendarAlt className="w-4 h-4" />
                            Copy Activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
