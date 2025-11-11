import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUsers,
  FaUserGraduate,
  FaUserShield,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSort,
  FaDownload,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaCheck,
  FaBan,
  FaUser,
} from "react-icons/fa";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    students: 0,
    regularUsers: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users", {
        params: {
          role: filterRole !== "all" ? filterRole : undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
          search: searchTerm || undefined,
          sortBy,
          sortOrder,
          limit: 100,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data.users);
        setStats(response.data.data.stats);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounced search and filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  const handleViewDetails = (user) => {
    console.log("handleViewDetails called with user:", user);
    setSelectedUser(user);
    setShowModal(true);
    console.log("showModal set to true");
  };

  const handleEditUser = (user) => {
    console.log("handleEditUser called with user:", user);
    setEditingUser({ ...user });
    setShowEditModal(true);
    console.log("showEditModal set to true");
  };

  const handleDeleteUser = (user) => {
    console.log("handleDeleteUser called with user:", user);
    setUserToDelete(user);
    setShowDeleteModal(true);
    console.log("showDeleteModal set to true");
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setActionLoading(true);
      const response = await api.delete(
        `/admin/users/${userToDelete?._id || userToDelete?.id}`
      );

      if (response.data.success) {
        toast.success("User deleted successfully");
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(true);
      const response = await api.patch(`/admin/users/${id}/toggle-status`);

      if (response.data.success) {
        toast.success("User status updated successfully");
        fetchUsers();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setActionLoading(true);
      const response = await api.put(
        `/admin/users/${editingUser?._id || editingUser?.id}`,
        editingUser
      );

      if (response.data.success) {
        toast.success("User updated successfully");
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(true);
      const response = await api.patch(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      if (response.data.success) {
        toast.success("User role updated successfully");
        fetchUsers();
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setActionLoading(true);
      toast.loading("Preparing CSV export...", { id: "csv-export" });

      // Fetch all users from database using the existing endpoint
      const response = await api.get("/admin/users", {
        params: {
          limit: 10000, // Get all users
          role: undefined, // Remove any role filter
          status: undefined, // Remove any status filter
          search: undefined, // Remove any search filter
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });

      if (response.data.success) {
        const allUsers = response.data.data.users || response.data.data || [];

        const csvContent = [
          [
            "Username",
            "Email",
            "Role",
            "Status",
            "College",
            "Phone",
            "Location",
            "Degree",
            "Course",
            "Academic Year",
            "Bio",
            "Profile Completion",
            "Joined Date",
            "Last Login",
          ],
          ...allUsers.map((user) => [
            user?.username || "",
            user?.email || "",
            user?.role || "",
            user?.isActive ? "Active" : "Inactive",
            user?.college || "",
            user?.phone || "",
            user?.location || "",
            user?.degree || "",
            user?.course || "",
            user?.year || "",
            user?.bio ? `"${user.bio.replace(/"/g, '""')}"` : "", // Escape quotes in bio
            `${user?.profileCompletion || 0}%`,
            user?.joinedDate || user?.createdAt
              ? new Date(user.joinedDate || user.createdAt)
                  .toISOString()
                  .split("T")[0]
              : "Unknown",
            user?.lastLogin
              ? new Date(user.lastLogin).toISOString().split("T")[0]
              : "Never",
          ]),
        ]
          .map((row) => row.join(","))
          .join("\n");

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().split("T")[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `users-export-${timestamp}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Successfully exported ${allUsers.length} users`, {
          id: "csv-export",
        });
      } else {
        // Fallback to current users if API call fails
        const csvContent = [
          [
            "Username",
            "Email",
            "Role",
            "Status",
            "College",
            "Phone",
            "Last Login",
          ],
          ...users.map((user) => [
            user?.username || "",
            user?.email || "",
            user?.role || "",
            user?.isActive ? "Active" : "Inactive",
            user?.college || "",
            user?.phone || "",
            user?.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString()
              : "Never",
          ]),
        ]
          .map((row) => row.join(","))
          .join("\n");

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().split("T")[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `users-export-${timestamp}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${users.length} users (current view)`, {
          id: "csv-export",
        });
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      // Fallback to current users if everything fails
      try {
        const csvContent = [
          [
            "Username",
            "Email",
            "Role",
            "Status",
            "College",
            "Phone",
            "Last Login",
          ],
          ...users.map((user) => [
            user?.username || "",
            user?.email || "",
            user?.role || "",
            user?.isActive ? "Active" : "Inactive",
            user?.college || "",
            user?.phone || "",
            user?.lastLogin
              ? new Date(user.lastLogin).toISOString().split("T")[0]
              : "Never",
          ]),
        ]
          .map((row) => row.join(","))
          .join("\n");

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().split("T")[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `users-export-${timestamp}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${users.length} users (current view)`, {
          id: "csv-export",
        });
      } catch (fallbackError) {
        console.error("Fallback export also failed:", fallbackError);
        toast.error("Failed to export CSV. Please try again.", {
          id: "csv-export",
        });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="w-4 h-4 text-red-400" />;
      case "student":
        return <FaUserGraduate className="w-4 h-4 text-green-400" />;
      default:
        return <FaUsers className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "student":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading users...</p>
          <p className="text-gray-400 mt-2">
            Please wait while we fetch user data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile-First Container */}
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {/* Title and Description */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                  All Users
                </h1>
                <p className="mt-1 text-sm text-gray-400 sm:text-base">
                  Manage platform users and permissions
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:flex-shrink-0">
                <button
                  onClick={exportToCSV}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors touch-manipulation"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <FaDownload className="w-4 h-4" />
                      <span>Export CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-sm text-gray-400 mt-1">Total Users</p>
                </div>
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <FaUsers className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-red-500 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats.admins}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Admins</p>
                </div>
                <div className="p-3 bg-red-600/20 rounded-lg">
                  <FaUserShield className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-green-500 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats.students}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Students</p>
                </div>
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <FaUserGraduate className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats.regularUsers}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Regular Users</p>
                </div>
                <div className="p-3 bg-gray-600/20 rounded-lg">
                  <FaUser className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search Section */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="user">User</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="joinedDate">Joined Date</option>
                    <option value="username">Username</option>
                    <option value="lastLogin">Last Login</option>
                    <option value="profileCompletion">Profile</option>
                  </select>

                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    title={`Sort ${
                      sortOrder === "asc" ? "Descending" : "Ascending"
                    }`}
                  >
                    <FaSort className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Users List - Responsive Design */}
          {users.length === 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 sm:p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-400 text-sm">
                {searchTerm || filterRole !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No users are registered yet"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {users.map((user) => (
                  <div
                    key={user?._id || user?.id || Math.random()}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {user?.username?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-white font-medium truncate">
                            {user?.username || "No username"}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">
                            {user?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors touch-manipulation"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors touch-manipulation"
                          title="Edit User"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                          disabled={user?.role === "admin"}
                          title={
                            user?.role === "admin"
                              ? "Cannot delete admin"
                              : "Delete User"
                          }
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Role:</span>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                              user?.role
                            )}`}
                          >
                            {getRoleIcon(user?.role)}
                            {user?.role
                              ? user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)
                              : "No role"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400">Status:</span>
                        <div className="mt-1">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              user?.isActive
                            )}`}
                          >
                            {user?.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400">College:</span>
                        <p className="text-white mt-1 truncate">
                          {user?.college || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-400">Profile:</span>
                        <div className="mt-1 flex items-center">
                          <div className="w-12 bg-gray-600 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${getCompletionColor(
                                user?.profileCompletion
                              )}`}
                              style={{
                                width: `${user?.profileCompletion || 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-300">
                            {user?.profileCompletion || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          College
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Profile
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map((user) => (
                        <tr
                          key={user?._id || user?.id || Math.random()}
                          className="hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {user?.username?.charAt(0)?.toUpperCase() ||
                                    "U"}
                                </span>
                              </div>
                              <div className="ml-4 min-w-0 flex-1">
                                <div className="text-sm font-medium text-white truncate">
                                  {user?.username || "No username"}
                                </div>
                                <div className="text-sm text-gray-400 truncate">
                                  {user?.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                                user?.role
                              )}`}
                            >
                              {getRoleIcon(user?.role)}
                              {user?.role
                                ? user.role.charAt(0).toUpperCase() +
                                  user.role.slice(1)
                                : "No role"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {user?.college || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                user?.isActive
                              )}`}
                            >
                              {user?.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                                <div
                                  className={`h-2 rounded-full ${getCompletionColor(
                                    user?.profileCompletion
                                  )}`}
                                  style={{
                                    width: `${user?.profileCompletion || 0}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-300">
                                {user?.profileCompletion || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {user?.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(user)}
                                className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                                title="View Details"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-yellow-400 hover:text-yellow-300 p-1 rounded transition-colors"
                                title="Edit User"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={user?.role === "admin"}
                                title={
                                  user?.role === "admin"
                                    ? "Cannot delete admin"
                                    : "Delete User"
                                }
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div
            className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-6">
            <div className="relative w-full max-w-2xl p-4 sm:p-6 bg-gray-800 shadow-2xl rounded-xl sm:rounded-2xl border border-gray-600 sm:border-2 sm:border-blue-500 transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-semibold text-white">
                  User Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded touch-manipulation"
                >
                  <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-2xl">
                      {selectedUser?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      {selectedUser?.username || "Unknown User"}
                    </h4>
                    <p className="text-gray-400">
                      {selectedUser?.email || "No email"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                          selectedUser?.role || "user"
                        )}`}
                      >
                        {getRoleIcon(selectedUser?.role || "user")}
                        {selectedUser?.role
                          ? selectedUser.role.charAt(0).toUpperCase() +
                            selectedUser.role.slice(1)
                          : "User"}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedUser?.isActive ?? true
                        )}`}
                      >
                        {selectedUser?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        <FaEnvelope className="inline w-4 h-4 mr-2" />
                        Email
                      </label>
                      <p className="text-white">
                        {selectedUser?.email || "No email"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        <FaUser className="inline w-4 h-4 mr-2" />
                        Phone
                      </label>
                      <p className="text-white">
                        {selectedUser?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        <FaUserGraduate className="inline w-4 h-4 mr-2" />
                        College
                      </label>
                      <p className="text-white">
                        {selectedUser?.college || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        <FaMapMarkerAlt className="inline w-4 h-4 mr-2" />
                        Location
                      </label>
                      <p className="text-white">
                        {selectedUser?.location || "Not specified"}
                      </p>
                    </div>
                    {selectedUser?.degree && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Degree
                        </label>
                        <p className="text-white">{selectedUser?.degree}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                        Joined Date
                      </label>
                      <p className="text-white">
                        {selectedUser?.joinedDate
                          ? new Date(
                              selectedUser.joinedDate
                            ).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                        Last Login
                      </label>
                      <p className="text-white">
                        {selectedUser?.lastLogin
                          ? new Date(
                              selectedUser.lastLogin
                            ).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                    {selectedUser?.year && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Academic Year
                        </label>
                        <p className="text-white">{selectedUser?.year}</p>
                      </div>
                    )}
                    {selectedUser?.course && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Course
                        </label>
                        <p className="text-white">{selectedUser?.course}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser?.bio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bio
                    </label>
                    <p className="text-white bg-gray-800 p-3 rounded-lg">
                      {selectedUser?.bio}
                    </p>
                  </div>
                )}

                {selectedUser?.skills && selectedUser?.skills?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Profile Completion
                  </label>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-600 rounded-full h-3 mr-4">
                      <div
                        className={`h-3 rounded-full ${getCompletionColor(
                          selectedUser?.profileCompletion || 0
                        )}`}
                        style={{
                          width: `${selectedUser?.profileCompletion || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold">
                      {selectedUser?.profileCompletion || 0}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => {
                      handleEditUser(selectedUser);
                      setShowModal(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div
            className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="relative w-full max-w-2xl p-6 bg-gray-800 shadow-2xl rounded-2xl border-2 border-green-500 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">Edit User</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editingUser?.username || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingUser?.email || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Role
                    </label>
                    <select
                      value={editingUser?.role || "user"}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Status
                    </label>
                    <select
                      value={editingUser?.isActive ? "active" : "inactive"}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          isActive: e.target.value === "active",
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editingUser?.phone || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      College
                    </label>
                    <input
                      type="text"
                      value={editingUser?.college || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          college: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter college name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingUser?.location || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={editingUser?.degree || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          degree: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter degree"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Course
                    </label>
                    <input
                      type="text"
                      value={editingUser?.course || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          course: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter course"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Academic Year
                    </label>
                    <select
                      value={editingUser?.year || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          year: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editingUser?.bio || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        bio: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user bio"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <FaExclamationTriangle className="w-8 h-8 text-red-600" />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Delete User Account
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete{" "}
                  <strong className="text-white">
                    {userToDelete.username}
                  </strong>
                  ? This action cannot be undone and will permanently remove all
                  user data.
                </p>

                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {userToDelete?.username?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">
                        {userToDelete?.username || "No username"}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {userToDelete?.email || "No email"}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userToDelete?.role === "admin"
                              ? "bg-red-600 text-red-100"
                              : userToDelete?.role === "student"
                              ? "bg-blue-600 text-blue-100"
                              : "bg-gray-600 text-gray-100"
                          }`}
                        >
                          {userToDelete?.role
                            ? userToDelete.role.charAt(0).toUpperCase() +
                              userToDelete.role.slice(1)
                            : "No role"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userToDelete?.isActive
                              ? "bg-green-600 text-green-100"
                              : "bg-gray-600 text-gray-100"
                          }`}
                        >
                          {userToDelete?.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={actionLoading || userToDelete?.role === "admin"}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="w-4 h-4" />
                      Delete User
                    </>
                  )}
                </button>
              </div>

              {userToDelete?.role === "admin" && (
                <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
                  <div className="flex items-center">
                    <FaBan className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-yellow-200 text-sm">
                      Admin accounts cannot be deleted for security reasons.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
