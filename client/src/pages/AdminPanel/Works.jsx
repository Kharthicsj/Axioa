import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { adminAPI } from "../../utils/api";
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaEdit,
    FaChartBar,
    FaCalendarAlt,
    FaDollarSign,
    FaUser,
    FaClock,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner,
    FaDownload,
    FaChevronLeft,
    FaChevronRight,
    FaTasks,
    FaPercent,
    FaPaypal,
    FaFileAlt,
} from "react-icons/fa";

const AdminWorks = () => {
    const [works, setWorks] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedWork, setSelectedWork] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });

    // Filters and search
    const [filters, setFilters] = useState({
        search: "",
        workStatus: "",
        serviceCategory: "",
        dateFrom: "",
        dateTo: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
        limit: 10,
    });

    const workStatusOptions = [
        {
            value: "approved",
            label: "Approved",
            color: "blue",
            icon: FaCheckCircle,
        },
        {
            value: "in_progress",
            label: "In Progress",
            color: "purple",
            icon: FaClock,
        },
        {
            value: "review_pending",
            label: "Review Pending",
            color: "yellow",
            icon: FaExclamationTriangle,
        },
        {
            value: "revision_requested",
            label: "Revision Requested",
            color: "orange",
            icon: FaEdit,
        },
        {
            value: "completed",
            label: "Completed",
            color: "green",
            icon: FaCheckCircle,
        },
        {
            value: "awaiting_completion_proof",
            label: "Awaiting Proof",
            color: "indigo",
            icon: FaFileAlt,
        },
        {
            value: "completion_submitted",
            label: "Completion Submitted",
            color: "teal",
            icon: FaFileAlt,
        },
        {
            value: "payment_pending",
            label: "Payment Pending",
            color: "yellow",
            icon: FaPaypal,
        },
        {
            value: "payment_submitted",
            label: "Payment Submitted",
            color: "blue",
            icon: FaPaypal,
        },
        {
            value: "payment_verified",
            label: "Payment Verified",
            color: "green",
            icon: FaCheckCircle,
        },
        {
            value: "delivered",
            label: "Delivered",
            color: "emerald",
            icon: FaCheckCircle,
        },
        {
            value: "cancelled",
            label: "Cancelled",
            color: "red",
            icon: FaTimesCircle,
        },
    ];

    const serviceCategories = [
        "Web Development",
        "Mobile App Development",
        "UI/UX Design",
        "Data Analysis",
        "Content Writing",
        "Resume Services",
        "CAD Modeling",
    ];

    // Status update state
    const [statusUpdate, setStatusUpdate] = useState({
        status: "",
        reason: "",
        adminNotes: "",
    });

    useEffect(() => {
        fetchWorks();
    }, [filters]);

    const fetchWorks = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllWorks(filters);

            if (response.success) {
                setWorks(response.data.works);
                setStats(response.data.stats);
                setPagination(response.data.pagination);
            } else {
                toast.error(response.message || "Failed to fetch works");
            }
        } catch (error) {
            console.error("Error fetching works:", error);
            toast.error("Failed to fetch works");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleViewDetails = async (workId) => {
        try {
            const response = await adminAPI.getWorkDetails(workId);
            if (response.success) {
                setSelectedWork(response.data);
                setShowDetailsModal(true);
            } else {
                toast.error("Failed to load work details");
            }
        } catch (error) {
            console.error("Error loading work details:", error);
            toast.error("Failed to load work details");
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedWork || !statusUpdate.status) {
            toast.error("Please select a status");
            return;
        }

        try {
            const response = await adminAPI.updateWorkStatus(
                selectedWork._id,
                statusUpdate
            );

            if (response.success) {
                toast.success("Work status updated successfully");
                setShowStatusModal(false);
                setStatusUpdate({ status: "", reason: "", adminNotes: "" });
                fetchWorks(); // Refresh the list
            } else {
                toast.error(response.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        const statusOption = workStatusOptions.find(
            (option) => option.value === status
        );
        return statusOption ? statusOption.color : "gray";
    };

    const getStatusIcon = (status) => {
        const statusOption = workStatusOptions.find(
            (option) => option.value === status
        );
        return statusOption ? statusOption.icon : FaClock;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return "bg-green-500";
        if (percentage >= 70) return "bg-blue-500";
        if (percentage >= 50) return "bg-yellow-500";
        if (percentage >= 25) return "bg-orange-500";
        return "bg-red-500";
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Works Management
                    </h1>
                    <p className="text-gray-400">
                        Monitor and manage all work progress in the system
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">
                                    Total Works
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {stats.total || 0}
                                </p>
                            </div>
                            <FaTasks className="h-8 w-8 text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">
                                    In Progress
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {stats.byStatus?.in_progress?.count || 0}
                                </p>
                            </div>
                            <FaClock className="h-8 w-8 text-purple-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {(stats.byStatus?.completed?.count || 0) +
                                        (stats.byStatus?.delivered?.count || 0)}
                                </p>
                            </div>
                            <FaCheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">
                                    Avg Progress
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {Math.round(
                                        Object.values(
                                            stats.byStatus || {}
                                        ).reduce(
                                            (sum, status) =>
                                                sum + (status.avgProgress || 0),
                                            0
                                        ) /
                                            Math.max(
                                                Object.keys(
                                                    stats.byStatus || {}
                                                ).length,
                                                1
                                            )
                                    )}
                                    %
                                </p>
                            </div>
                            <FaPercent className="h-8 w-8 text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search works..."
                                    value={filters.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Work Status
                            </label>
                            <select
                                value={filters.workStatus}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "workStatus",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                {workStatusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Service Category
                            </label>
                            <select
                                value={filters.serviceCategory}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "serviceCategory",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                {serviceCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sort By
                            </label>
                            <select
                                value={`${filters.sortBy}-${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] =
                                        e.target.value.split("-");
                                    handleFilterChange("sortBy", sortBy);
                                    handleFilterChange("sortOrder", sortOrder);
                                }}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="createdAt-desc">
                                    Newest First
                                </option>
                                <option value="createdAt-asc">
                                    Oldest First
                                </option>
                                <option value="updatedAt-desc">
                                    Recently Updated
                                </option>
                                <option value="quotedPrice-desc">
                                    Price High to Low
                                </option>
                                <option value="quotedPrice-asc">
                                    Price Low to High
                                </option>
                                <option value="progress.percentage-desc">
                                    Progress High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date From
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "dateFrom",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date To
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) =>
                                    handleFilterChange("dateTo", e.target.value)
                                }
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Works Table */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Project
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Value
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Updated
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center"
                                        >
                                            <FaSpinner className="animate-spin h-8 w-8 text-blue-400 mx-auto mb-4" />
                                            <p className="text-gray-400">
                                                Loading works...
                                            </p>
                                        </td>
                                    </tr>
                                ) : works.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center"
                                        >
                                            <p className="text-gray-400">
                                                No works found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    works.map((work) => {
                                        const StatusIcon = getStatusIcon(
                                            work.workStatus
                                        );
                                        return (
                                            <tr
                                                key={work._id}
                                                className="hover:bg-gray-700 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {work.projectName}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {
                                                                work.serviceCategory
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {work.assignedTo
                                                            ?.profilePicture ? (
                                                            <img
                                                                className="h-8 w-8 rounded-full mr-3"
                                                                src={
                                                                    work
                                                                        .assignedTo
                                                                        .profilePicture
                                                                }
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                                                <FaUser className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-white">
                                                                {work.assignedTo
                                                                    ?.username ||
                                                                    "N/A"}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                {
                                                                    work
                                                                        .assignedTo
                                                                        ?.email
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {work.assignedBy
                                                            ?.profilePicture ? (
                                                            <img
                                                                className="h-8 w-8 rounded-full mr-3"
                                                                src={
                                                                    work
                                                                        .assignedBy
                                                                        .profilePicture
                                                                }
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                                                <FaUser className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-white">
                                                                {work.assignedBy
                                                                    ?.username ||
                                                                    "N/A"}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                {
                                                                    work
                                                                        .assignedBy
                                                                        ?.email
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <StatusIcon
                                                            className={`h-4 w-4 text-${getStatusColor(
                                                                work.workStatus
                                                            )}-400 mr-2`}
                                                        />
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(
                                                                work.workStatus
                                                            )}-100 text-${getStatusColor(
                                                                work.workStatus
                                                            )}-800`}
                                                        >
                                                            {workStatusOptions.find(
                                                                (opt) =>
                                                                    opt.value ===
                                                                    work.workStatus
                                                            )?.label ||
                                                                work.workStatus}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                                                            <div
                                                                className={`h-2 rounded-full ${getProgressColor(
                                                                    work
                                                                        .progress
                                                                        ?.percentage ||
                                                                        0
                                                                )}`}
                                                                style={{
                                                                    width: `${
                                                                        work
                                                                            .progress
                                                                            ?.percentage ||
                                                                        0
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-white min-w-0 w-12">
                                                            {work.progress
                                                                ?.percentage ||
                                                                0}
                                                            %
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    {formatCurrency(
                                                        work.quotedPrice
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {formatDate(work.updatedAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    work._id
                                                                )
                                                            }
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <FaEye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedWork(
                                                                    work
                                                                );
                                                                setShowStatusModal(
                                                                    true
                                                                );
                                                            }}
                                                            className="text-green-400 hover:text-green-300 transition-colors"
                                                            title="Update Status"
                                                        >
                                                            <FaEdit className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-t border-gray-700">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.currentPage - 1
                                        )
                                    }
                                    disabled={!pagination.hasPrevPage}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.currentPage + 1
                                        )
                                    }
                                    disabled={!pagination.hasNextPage}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Showing{" "}
                                        <span className="font-medium">
                                            {(pagination.currentPage - 1) *
                                                filters.limit +
                                                1}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {Math.min(
                                                pagination.currentPage *
                                                    filters.limit,
                                                pagination.totalItems
                                            )}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {pagination.totalItems}
                                        </span>{" "}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.currentPage - 1
                                                )
                                            }
                                            disabled={!pagination.hasPrevPage}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaChevronLeft className="h-4 w-4" />
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-800 text-sm font-medium text-white">
                                            {pagination.currentPage} of{" "}
                                            {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.currentPage + 1
                                                )
                                            }
                                            disabled={!pagination.hasNextPage}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaChevronRight className="h-4 w-4" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Work Details Modal */}
                {showDetailsModal && selectedWork && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
                        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl transform transition-all duration-500 ease-out animate-slideUp">
                            {/* Header with glass effect */}
                            <div className="flex-shrink-0 relative bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-sm p-4 sm:p-6 border-b border-gray-600/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                                            Work Details
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowDetailsModal(false)
                                        }
                                        className="group relative p-2 rounded-full bg-gray-700/50 hover:bg-red-500/20 border border-gray-600/30 hover:border-red-400/30 transition-all duration-300"
                                    >
                                        <FaTimesCircle className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-10">
                                        {/* Left Column - Work Information */}
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-3 mb-6">
                                                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                                                <h4 className="text-xl font-bold text-white">
                                                    Work Information
                                                </h4>
                                            </div>
                                            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-600/30 space-y-4 sm:space-y-6">
                                                <div className="bg-gray-800/40 rounded-xl p-3 sm:p-4 border border-gray-600/20">
                                                    <span className="text-xs sm:text-sm font-medium text-blue-300 uppercase tracking-wider">
                                                        Project Name
                                                    </span>
                                                    <p className="text-white font-semibold text-base sm:text-lg mt-1">
                                                        {
                                                            selectedWork.projectName
                                                        }
                                                    </p>
                                                </div>
                                                <div className="bg-gray-800/40 rounded-xl p-3 sm:p-4 border border-gray-600/20">
                                                    <span className="text-xs sm:text-sm font-medium text-blue-300 uppercase tracking-wider">
                                                        Description
                                                    </span>
                                                    <p className="text-gray-100 mt-2 leading-relaxed">
                                                        {
                                                            selectedWork.projectDescription
                                                        }
                                                    </p>
                                                </div>
                                                <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-600/20">
                                                    <span className="text-sm font-medium text-blue-300 uppercase tracking-wider">
                                                        Service Category
                                                    </span>
                                                    <p className="text-white">
                                                        {
                                                            selectedWork.serviceCategory
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <span className="text-sm text-gray-400">
                                                            Status:
                                                        </span>
                                                        <div className="flex items-center mt-1">
                                                            {React.createElement(
                                                                getStatusIcon(
                                                                    selectedWork.workStatus
                                                                ),
                                                                {
                                                                    className: `h-4 w-4 text-${getStatusColor(
                                                                        selectedWork.workStatus
                                                                    )}-400 mr-2`,
                                                                }
                                                            )}
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(
                                                                    selectedWork.workStatus
                                                                )}-100 text-${getStatusColor(
                                                                    selectedWork.workStatus
                                                                )}-800`}
                                                            >
                                                                {workStatusOptions.find(
                                                                    (opt) =>
                                                                        opt.value ===
                                                                        selectedWork.workStatus
                                                                )?.label ||
                                                                    selectedWork.workStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-400">
                                                            Progress:
                                                        </span>
                                                        <div className="flex items-center mt-1">
                                                            <div className="flex-1 bg-gray-700 rounded-full h-3 mr-3 w-24">
                                                                <div
                                                                    className={`h-3 rounded-full ${getProgressColor(
                                                                        selectedWork
                                                                            .progress
                                                                            ?.percentage ||
                                                                            0
                                                                    )}`}
                                                                    style={{
                                                                        width: `${
                                                                            selectedWork
                                                                                .progress
                                                                                ?.percentage ||
                                                                            0
                                                                        }%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-white">
                                                                {selectedWork
                                                                    .progress
                                                                    ?.percentage ||
                                                                    0}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-sm text-gray-400">
                                                            Quoted Price:
                                                        </span>
                                                        <p className="text-white font-medium">
                                                            {formatCurrency(
                                                                selectedWork.quotedPrice
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-400">
                                                            Completion Time:
                                                        </span>
                                                        <p className="text-white">
                                                            {
                                                                selectedWork.completionTime
                                                            }{" "}
                                                            days
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-400">
                                                        Expected Completion:
                                                    </span>
                                                    <p className="text-white">
                                                        {formatDate(
                                                            selectedWork.expectedCompletionDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - People and Timeline */}
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-4">
                                                People Involved
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-sm text-gray-400">
                                                        Student:
                                                    </span>
                                                    <div className="flex items-center mt-2">
                                                        {selectedWork.assignedTo
                                                            ?.profilePicture ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full mr-3"
                                                                src={
                                                                    selectedWork
                                                                        .assignedTo
                                                                        .profilePicture
                                                                }
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                                                <FaUser className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-white font-medium">
                                                                {
                                                                    selectedWork
                                                                        .assignedTo
                                                                        ?.username
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-400">
                                                                {
                                                                    selectedWork
                                                                        .assignedTo
                                                                        ?.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <span className="text-sm text-gray-400">
                                                        Client:
                                                    </span>
                                                    <div className="flex items-center mt-2">
                                                        {selectedWork.assignedBy
                                                            ?.profilePicture ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full mr-3"
                                                                src={
                                                                    selectedWork
                                                                        .assignedBy
                                                                        .profilePicture
                                                                }
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                                                <FaUser className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-white font-medium">
                                                                {
                                                                    selectedWork
                                                                        .assignedBy
                                                                        ?.username
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-400">
                                                                {
                                                                    selectedWork
                                                                        .assignedBy
                                                                        ?.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Information */}
                                            {(selectedWork.completionSubmission
                                                ?.studentPaymentDetails ||
                                                selectedWork.paymentVerification) && (
                                                <div className="mt-6">
                                                    <h4 className="text-lg font-medium text-white mb-4">
                                                        Payment Information
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {selectedWork
                                                            .completionSubmission
                                                            ?.studentPaymentDetails && (
                                                            <div>
                                                                <span className="text-sm text-gray-400">
                                                                    Student UPI
                                                                    ID:
                                                                </span>
                                                                <p className="text-white">
                                                                    {
                                                                        selectedWork
                                                                            .completionSubmission
                                                                            .studentPaymentDetails
                                                                            .upiId
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                        {selectedWork.paymentVerification && (
                                                            <div>
                                                                <span className="text-sm text-gray-400">
                                                                    Payment
                                                                    Status:
                                                                </span>
                                                                <p className="text-white capitalize">
                                                                    {
                                                                        selectedWork
                                                                            .paymentVerification
                                                                            .verificationStatus
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedWork.requirements && (
                                        <div className="mt-8">
                                            <h4 className="text-lg font-medium text-white mb-4">
                                                Requirements
                                            </h4>
                                            <div className="bg-gray-700 rounded-lg p-4">
                                                <p className="text-gray-300 whitespace-pre-wrap">
                                                    {selectedWork.requirements}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Work Updates */}
                                    {selectedWork.workUpdates &&
                                        selectedWork.workUpdates.length > 0 && (
                                            <div className="mt-8">
                                                <h4 className="text-lg font-medium text-white mb-4">
                                                    Work Updates (
                                                    {
                                                        selectedWork.workUpdates
                                                            .length
                                                    }
                                                    )
                                                </h4>
                                                <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                                                    <div className="space-y-3">
                                                        {selectedWork.workUpdates
                                                            .slice(-5)
                                                            .reverse()
                                                            .map(
                                                                (
                                                                    update,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="border-l-2 border-blue-500 pl-4"
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs text-gray-400 uppercase font-medium">
                                                                                {update.updateType.replace(
                                                                                    "_",
                                                                                    " "
                                                                                )}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                {formatDate(
                                                                                    update.createdAt
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-gray-300 text-sm mt-1">
                                                                            {
                                                                                update.description
                                                                            }
                                                                        </p>
                                                                        {update
                                                                            .updatedBy
                                                                            ?.username && (
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                by{" "}
                                                                                {
                                                                                    update
                                                                                        .updatedBy
                                                                                        .username
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Footer with action buttons */}
                            <div className="flex-shrink-0 bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-gray-600/30">
                                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                                    <button
                                        onClick={() =>
                                            setShowDetailsModal(false)
                                        }
                                        className="group relative w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 hover:border-gray-500/50 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
                                    >
                                        <span className="relative z-10">
                                            Close
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            setShowStatusModal(true);
                                        }}
                                        className="group relative w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-500/30 rounded-xl text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <span className="relative z-10">
                                            Update Status
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Update Modal */}
                {showStatusModal && selectedWork && !showDetailsModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl w-full max-w-lg h-[75vh] sm:h-[70vh] flex flex-col shadow-2xl transform transition-all duration-500 ease-out animate-slideUp">
                            {/* Header */}
                            <div className="flex-shrink-0 relative bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-sm p-3 sm:p-4 border-b border-gray-600/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                            Update Work Status
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowStatusModal(false)
                                        }
                                        className="group relative p-2 rounded-full bg-gray-700/50 hover:bg-red-500/20 border border-gray-600/30 hover:border-red-400/30 transition-all duration-300"
                                    >
                                        <FaTimesCircle className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5">
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-600/20">
                                        <label className="block text-xs sm:text-sm font-medium text-blue-300 uppercase tracking-wider mb-2">
                                            Current Status
                                        </label>
                                        <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                                            <span className="text-blue-200 font-medium">
                                                {
                                                    workStatusOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            selectedWork.workStatus
                                                    )?.label
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-600/30">
                                        <label className="block text-xs sm:text-sm font-medium text-green-300 uppercase tracking-wider mb-3">
                                            New Status
                                        </label>
                                        <select
                                            value={statusUpdate.status}
                                            onChange={(e) =>
                                                setStatusUpdate({
                                                    ...statusUpdate,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-gray-800/60 border border-gray-600/40 rounded-lg text-sm text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                                        >
                                            <option value="">
                                                Select Status
                                            </option>
                                            {workStatusOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-600/30">
                                        <label className="block text-xs sm:text-sm font-medium text-green-300 uppercase tracking-wider mb-3">
                                            Reason
                                        </label>
                                        <input
                                            type="text"
                                            value={statusUpdate.reason}
                                            onChange={(e) =>
                                                setStatusUpdate({
                                                    ...statusUpdate,
                                                    reason: e.target.value,
                                                })
                                            }
                                            placeholder="Reason for status change"
                                            className="w-full px-3 py-2 bg-gray-800/60 border border-gray-600/40 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-600/30">
                                        <label className="block text-xs sm:text-sm font-medium text-green-300 uppercase tracking-wider mb-3">
                                            Admin Notes
                                        </label>
                                        <textarea
                                            value={statusUpdate.adminNotes}
                                            onChange={(e) =>
                                                setStatusUpdate({
                                                    ...statusUpdate,
                                                    adminNotes: e.target.value,
                                                })
                                            }
                                            placeholder="Additional notes for this status change"
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-800/60 border border-gray-600/40 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-600/30">
                                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                                    <button
                                        onClick={() =>
                                            setShowStatusModal(false)
                                        }
                                        className="group relative w-full sm:w-auto px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 hover:border-gray-500/50 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={!statusUpdate.status}
                                        className="group relative w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border border-green-500/30 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                    >
                                        <span className="relative z-10">
                                            Update Status
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWorks;
