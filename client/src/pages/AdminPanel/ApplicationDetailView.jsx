import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaFileAlt,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaSpinner,
  FaIdCard,
  FaTools,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../utils/api";

const ApplicationDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: "", title: "" });
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching application details for ID:", id);
      const response = await api.get(`/admin/applications/${id}`);
      if (response.data.success) {
        console.log("Application data received:", response.data.data);
        setApplication(response.data.data);
      } else {
        toast.error("Failed to fetch application details");
        navigate("/admin/student-applications");
      }
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast.error("Failed to fetch application details");
      navigate("/admin/student-applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === "rejected") {
      setShowRejectModal(true);
      setRejectionReason("");
      return;
    }

    try {
      setUpdating(true);
      const response = await api.put(`/admin/applications/${id}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        setApplication({ ...application, status: newStatus });
        toast.success(
          `Application ${newStatus.replace("_", " ")} successfully`
        );
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setUpdating(true);
      const response = await api.put(`/admin/applications/${id}/status`, {
        status: "rejected",
        reviewComments: rejectionReason,
      });

      if (response.data.success) {
        setApplication({
          ...application,
          status: "rejected",
          reviewComments: rejectionReason,
        });
        toast.success("Application rejected successfully");
        setShowRejectModal(false);
        setRejectionReason("");
      } else {
        toast.error("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    } finally {
      setUpdating(false);
    }
  };

  const openImageModal = (imageSrc, imageTitle) => {
    console.log("Opening image modal:", imageTitle);
    setSelectedImage({ src: imageSrc, title: imageTitle });
    setShowImageModal(true);
    // Reset zoom and position
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage({ src: "", title: "" });
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Zoom functions
  const handleZoomIn = () => {
    setImageScale((prev) => Math.min(prev * 1.2, 5)); // Max zoom 5x
  };

  const handleZoomOut = () => {
    setImageScale((prev) => Math.max(prev / 1.2, 0.5)); // Min zoom 0.5x
  };

  const handleResetZoom = () => {
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setImageScale((prev) => Math.min(Math.max(prev * delta, 0.5), 5));
    }
  };

  // Touch/Pinch zoom handling
  const getTouchDistance = (touches) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setLastPinchDistance(distance);
      e.preventDefault();
    } else if (e.touches.length === 1) {
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      if (lastPinchDistance > 0) {
        const scale = distance / lastPinchDistance;
        setImageScale((prev) => Math.min(Math.max(prev * scale, 0.5), 5));
      }
      setLastPinchDistance(distance);
    } else if (e.touches.length === 1 && isDragging && imageScale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (touch.clientX - rect.left - rect.width / 2) / imageScale;
      const y = (touch.clientY - rect.top - rect.height / 2) / imageScale;
      setImagePosition({ x: -x, y: -y });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setLastPinchDistance(0);
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  // Mouse drag for panning when zoomed
  const handleMouseDown = (e) => {
    if (imageScale > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && imageScale > 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / imageScale;
      const y = (e.clientY - rect.top - rect.height / 2) / imageScale;
      setImagePosition({ x: -x, y: -y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && showImageModal) {
        closeImageModal();
      }
    };

    if (showImageModal) {
      document.addEventListener("keydown", handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [showImageModal]);

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-900 bg-opacity-50 text-blue-300 border-blue-700";
      case "under_review":
        return "bg-yellow-900 bg-opacity-50 text-yellow-300 border-yellow-700";
      case "approved":
        return "bg-green-900 bg-opacity-50 text-green-300 border-green-700";
      case "rejected":
        return "bg-red-900 bg-opacity-50 text-red-300 border-red-700";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <FaFileAlt className="w-3 h-3" />;
      case "under_review":
        return <FaClock className="w-3 h-3" />;
      case "approved":
        return <FaCheck className="w-3 h-3" />;
      case "rejected":
        return <FaTimes className="w-3 h-3" />;
      default:
        return <FaFileAlt className="w-3 h-3" />;
    }
  };

  const DocumentPreview = ({ document, title, type }) => {
    if (!document || typeof document !== "string") return null;

    const isImage = document.startsWith("data:image/");
    const isPdf = document.startsWith("data:application/pdf");

    return (
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <FaIdCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="truncate">{title}</span>
          </h3>
          <button
            onClick={() =>
              isImage
                ? openImageModal(document, title)
                : window.open(document, "_blank")
            }
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            <FaEye className="w-3 h-3" />
            <span className="hidden sm:inline">View</span>
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-3 sm:p-4 bg-gray-750">
          {isImage ? (
            <div
              className="cursor-pointer group"
              onClick={() => openImageModal(document, title)}
            >
              <img
                src={document}
                alt={title}
                className="max-w-full h-auto rounded-lg shadow-lg max-h-48 sm:max-h-64 mx-auto transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div className="text-center mt-2">
                <p className="text-xs text-gray-400">Click to view full size</p>
              </div>
            </div>
          ) : isPdf ? (
            <div className="text-center">
              <FaFileAlt className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm sm:text-base">PDF Document</p>
              <p className="text-xs sm:text-sm text-gray-500">
                Click view to open in new tab
              </p>
            </div>
          ) : (
            <div className="text-center">
              <FaFileAlt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm sm:text-base">
                Document not available
              </p>
            </div>
          )}
          {/* Fallback for broken images */}
          <div className="text-center" style={{ display: "none" }}>
            <FaFileAlt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm sm:text-base">
              Failed to load document
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              The document may be corrupted or unavailable
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-400">
            Loading application details...
          </span>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FaFileAlt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            Application Not Found
          </h3>
          <p className="text-gray-500 mb-6">
            The requested application could not be found.
          </p>
          <button
            onClick={() => navigate("/admin/student-applications")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate("/admin/student-applications")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Applications</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Application Details
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Review comprehensive student application information
            </p>
          </div>

          {/* Status Badge */}
          <div className="mt-4 lg:mt-0">
            <span
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border shadow-sm ${getStatusColor(
                application.status
              )}`}
            >
              {getStatusIcon(application.status)}
              {application.status.charAt(0).toUpperCase() +
                application.status.slice(1).replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column - Student Profile */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 shadow-lg overflow-hidden">
                {application.profilePicture ? (
                  <img
                    src={
                      application.profilePicture.startsWith("data:")
                        ? application.profilePicture
                        : `data:image/jpeg;base64,${application.profilePicture}`
                    }
                    alt={application.name || "Profile"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
                    application.profilePicture ? "hidden" : "flex"
                  }`}
                >
                  <span className="text-white font-bold text-xl sm:text-2xl">
                    {application.name?.charAt(0) || "N"}
                  </span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {application.name || "N/A"}
              </h2>
              <div className="text-gray-400 text-sm sm:text-base space-y-1">
                {application.address ? (
                  <>
                    <p className="leading-relaxed">
                      {application.address.street}
                    </p>
                  </>
                ) : (
                  <p>Address not provided</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400">Email</p>
                  <p className="text-white text-sm sm:text-base truncate">
                    {application.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaPhone className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400">Phone</p>
                  <p className="text-white text-sm sm:text-base truncate">
                    {application.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400">Location</p>
                  <p className="text-white text-sm sm:text-base truncate">
                    {application.location || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Date of Birth
                  </p>
                  <p className="text-white text-sm sm:text-base">
                    {application.dateOfBirth
                      ? new Date(application.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Applied Date
                  </p>
                  <p className="text-white text-sm sm:text-base">
                    {application.appliedDate
                      ? new Date(application.appliedDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
              Update Status
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => handleStatusUpdate("under_review")}
                disabled={updating || application.status === "under_review"}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaClock className="w-4 h-4" />
                )}
                Under Review
              </button>

              <button
                onClick={() => handleStatusUpdate("approved")}
                disabled={updating || application.status === "approved"}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaCheck className="w-4 h-4" />
                )}
                Approve
              </button>

              <button
                onClick={() => handleStatusUpdate("rejected")}
                disabled={updating || application.status === "rejected"}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaTimes className="w-4 h-4" />
                )}
                Reject
              </button>
            </div>
          </div>

          {/* Rejection Reason Display */}
          {application.status === "rejected" && application.reviewComments && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                Rejection Reason
              </h3>
              <div className="bg-red-800 bg-opacity-50 border border-red-600 rounded-lg p-4">
                <p className="text-red-200 text-sm sm:text-base leading-relaxed">
                  {application.reviewComments}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Education Details */}
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              Education Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">College/University</p>
                <p className="text-white font-medium">
                  {application.college || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Degree</p>
                <p className="text-white font-medium">
                  {application.degree || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Course</p>
                <p className="text-white font-medium">
                  {application.course || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Year of Study</p>
                <p className="text-white font-medium">
                  {application.year || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">CGPA</p>
                <p className="text-white font-medium">
                  {application.cgpa && application.cgpa !== "N/A"
                    ? `${application.cgpa}/10`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Percentage</p>
                <p className="text-white font-medium">
                  {application.percentage && application.percentage !== "N/A"
                    ? `${application.percentage}%`
                    : "N/A"}
                </p>
              </div>
              {application.specialization &&
                application.specialization !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Specialization</p>
                    <p className="text-white font-medium">
                      {application.specialization}
                    </p>
                  </div>
                )}
              {application.expectedGraduation &&
                application.expectedGraduation !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      Expected Graduation
                    </p>
                    <p className="text-white font-medium">
                      {new Date(
                        application.expectedGraduation
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Skills & Technical Information */}
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FaTools className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              Technical Skills & Information
            </h3>

            <div className="space-y-4">
              {/* Skills */}
              {application.skills && application.skills !== "N/A" && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-300 rounded-full text-sm border border-blue-700"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Programming Languages */}
              {application.programmingLanguages &&
                application.programmingLanguages !== "N/A" && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Programming Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {application.programmingLanguages
                        .split(",")
                        .map((lang, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-600 bg-opacity-20 text-green-300 rounded-full text-sm border border-green-700"
                          >
                            {lang.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

              {/* Frameworks */}
              {application.frameworks && application.frameworks !== "N/A" && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Frameworks
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {application.frameworks
                      .split(",")
                      .map((framework, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-600 bg-opacity-20 text-purple-300 rounded-full text-sm border border-purple-700"
                        >
                          {framework.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {application.tools && application.tools !== "N/A" && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {application.tools.split(",").map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-600 bg-opacity-20 text-yellow-300 rounded-full text-sm border border-yellow-700"
                      >
                        {tool.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                {application.github && application.github !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">GitHub</p>
                    <a
                      href={
                        application.github.startsWith("http")
                          ? application.github
                          : `https://${application.github}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm underline truncate block"
                    >
                      {application.github}
                    </a>
                  </div>
                )}
                {application.linkedin && application.linkedin !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">LinkedIn</p>
                    <a
                      href={
                        application.linkedin.startsWith("http")
                          ? application.linkedin
                          : `https://${application.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm underline truncate block"
                    >
                      {application.linkedin}
                    </a>
                  </div>
                )}
                {application.portfolio && application.portfolio !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Portfolio</p>
                    <a
                      href={
                        application.portfolio.startsWith("http")
                          ? application.portfolio
                          : `https://${application.portfolio}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm underline truncate block"
                    >
                      {application.portfolio}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <DocumentPreview
                document={application.identityProof}
                title="Identity Proof"
                type="identity"
              />

              <DocumentPreview
                document={application.collegeIdProof}
                title="College ID Proof"
                type="college"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div
              className="relative w-full max-w-5xl max-h-full bg-gray-800 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
              >
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Modal Header with Zoom Controls */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate flex-1">
                  {selectedImage.title}
                </h3>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={handleZoomOut}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                    title="Zoom Out"
                  >
                    <span className="text-sm font-bold">−</span>
                  </button>
                  <span className="text-xs text-gray-400 min-w-[3rem] text-center">
                    {Math.round(imageScale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                    title="Zoom In"
                  >
                    <span className="text-sm font-bold">+</span>
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable Image Container */}
              <div className="relative max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-hidden bg-gray-900">
                <div
                  className="w-full h-full overflow-auto flex items-center justify-center p-4"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#4B5563 #1F2937",
                  }}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div
                    className="relative inline-block"
                    style={{
                      transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                      transformOrigin: "center center",
                      transition: isDragging
                        ? "none"
                        : "transform 0.1s ease-out",
                      cursor:
                        imageScale > 1
                          ? isDragging
                            ? "grabbing"
                            : "grab"
                          : "default",
                    }}
                  >
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.title}
                      className="max-w-none h-auto rounded-lg shadow-lg select-none"
                      style={{
                        maxHeight: "calc(100vh - 250px)",
                        minWidth: "200px",
                        minHeight: "200px",
                      }}
                      draggable={false}
                      onLoad={(e) => {
                        // Ensure image is properly centered
                        const img = e.target;
                        img.style.display = "block";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer with Image Info */}
              <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-700 bg-gray-750 rounded-b-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-400">
                  <span>
                    {imageScale > 1 ? "Drag to pan • " : ""}
                    Pinch or Ctrl+Wheel to zoom • ESC to close
                  </span>
                  <span className="mt-1 sm:mt-0">
                    Zoom: {Math.round(imageScale * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Reject Application
              </h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">
                You are about to reject the application from:
              </p>
              <p className="text-white font-medium">{application.name}</p>
              <p className="text-gray-400 text-sm">{application.email}</p>
            </div>

            <div className="mb-6">
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
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : null}
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailView;
