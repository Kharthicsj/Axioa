import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSort,
  FaEye,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaFileAlt,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../utils/api";

const StudentApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch applications from API
  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filterStatus, sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/applications", {
        params: {
          status: filterStatus,
          search: searchTerm,
          sortBy,
          sortOrder,
        },
      });

      if (response.data.success) {
        setApplications(response.data.data);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/applications/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Search functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleApprove = async (id) => {
    try {
      const response = await api.put(`/admin/applications/${id}/status`, {
        status: "approved",
      });

      if (response.data.success) {
        toast.success("Application approved successfully");
        fetchApplications();
        fetchStats();
      } else {
        toast.error("Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    }
  };

  const handleReject = (application) => {
    setSelectedApplication(application);
    setShowRejectModal(true);
    setRejectionReason("");
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const response = await api.put(
        `/admin/applications/${selectedApplication.id}/status`,
        {
          status: "rejected",
          reviewComments: rejectionReason,
        }
      );

      if (response.data.success) {
        toast.success("Application rejected successfully");
        fetchApplications();
        fetchStats();
        setShowRejectModal(false);
        setSelectedApplication(null);
        setRejectionReason("");
      } else {
        toast.error("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    }
  };

  const handleUnderReview = async (id) => {
    try {
      const response = await api.put(`/admin/applications/${id}/status`, {
        status: "under_review",
      });
      if (response.data.success) {
        toast.success("Application moved to under review");
        fetchApplications();
        fetchStats();
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleViewDetails = (application) => {
    navigate(`/admin/student-applications/${application.id}`);
  };

  // Applications are already filtered and sorted by the backend
  const filteredApplications = applications;

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-900 text-green-300 border-green-700";
      case "rejected":
        return "bg-red-900 text-red-300 border-red-700";
      case "submitted":
        return "bg-blue-900 text-blue-300 border-blue-700";
      case "under_review":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      default:
        return "bg-gray-900 text-gray-300 border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="w-4 h-4" />;
      case "rejected":
        return <FaTimes className="w-4 h-4" />;
      case "submitted":
        return <FaFileAlt className="w-4 h-4" />;
      case "under_review":
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Student Applications
        </h1>
        <p className="text-gray-400">Review and manage student applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total Applications</div>
        </div>
        <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 border border-blue-700">
          <div className="text-2xl font-bold text-blue-300">
            {stats.submitted}
          </div>
          <div className="text-blue-400 text-sm">Submitted</div>
        </div>
        <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-4 border border-yellow-700">
          <div className="text-2xl font-bold text-yellow-300">
            {stats.under_review}
          </div>
          <div className="text-yellow-400 text-sm">Under Review</div>
        </div>
        <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 border border-green-700">
          <div className="text-2xl font-bold text-green-300">
            {stats.approved}
          </div>
          <div className="text-green-400 text-sm">Approved</div>
        </div>
        <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 border border-red-700">
          <div className="text-2xl font-bold text-red-300">
            {stats.rejected}
          </div>
          <div className="text-red-400 text-sm">Rejected</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="submittedAt">Applied Date</option>
              <option value="personalInfo.fullName">Name</option>
              <option value="education.cgpa">CGPA</option>
              <option value="profileCompletion.percentage">Completion</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors duration-200"
            >
              <FaSort className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-400">Loading applications...</span>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <FaFileAlt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No Applications Found
          </h3>
          <p className="text-gray-500">
            No applications match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl shadow-lg overflow-hidden">
                        {(() => {
                          console.log(
                            `Profile picture for ${application.name}:`,
                            {
                              hasProfilePicture: !!application.profilePicture,
                              profilePictureType:
                                typeof application.profilePicture,
                              profilePictureLength:
                                application.profilePicture?.length || 0,
                              startsWithData:
                                application.profilePicture?.startsWith(
                                  "data:"
                                ) || false,
                            }
                          );
                          return application.profilePicture ? (
                            <img
                              src={
                                application.profilePicture.startsWith("data:")
                                  ? application.profilePicture
                                  : `data:image/jpeg;base64,${application.profilePicture}`
                              }
                              alt={application.name || "Profile"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.log(
                                  `Image load error for ${application.name}:`,
                                  e
                                );
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                              onLoad={() => {
                                console.log(
                                  `Image loaded successfully for ${application.name}`
                                );
                              }}
                            />
                          ) : null;
                        })()}
                        <div
                          className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
                            application.profilePicture ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-white font-bold text-lg">
                            {application.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {application.name}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium">
                        {application.year}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(application.status)}
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1).replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300 text-sm hover:text-white transition-colors">
                    <div className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      <FaEnvelope className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="truncate">{application.email}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm hover:text-white transition-colors">
                    <div className="w-8 h-8 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      <FaGraduationCap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">
                        {application.degree}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {application.college}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm hover:text-white transition-colors">
                    <div className="w-8 h-8 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-400" />
                    </div>
                    <span>{application.location}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm hover:text-white transition-colors">
                    <div className="w-8 h-8 bg-yellow-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      <FaCalendarAlt className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span>
                      Applied:{" "}
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleViewDetails(application)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaEye className="w-4 h-4" />
                    View Details
                  </button>

                  {/* Action buttons based on status */}
                  {application.status === "submitted" && (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleUnderReview(application.id)}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaClock className="w-3 h-3" />
                        Review
                      </button>
                      <button
                        onClick={() => handleApprove(application.id)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaCheck className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(application)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaTimes className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  )}

                  {application.status === "under_review" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleApprove(application.id)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaCheck className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(application)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaTimes className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Reject Application
              </h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedApplication(null);
                  setRejectionReason("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {selectedApplication && (
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">
                  You are about to reject the application from:
                </p>
                <p className="text-white font-medium">
                  {selectedApplication.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {selectedApplication.email}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Reason for Rejection <span className="text-red-400">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Please provide a clear reason for rejecting this application..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedApplication(null);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
