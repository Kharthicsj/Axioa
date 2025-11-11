import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaEdit,
  FaCalendarAlt,
  FaStar,
  FaSort,
  FaDownload,
  FaUserTimes,
  FaSpinner,
  FaChartLine,
  FaProjectDiagram,
  FaComments,
  FaFlag,
  FaTrophy,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaBan,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../utils/api";
import TerminationModal from "../../components/TerminationModal";

const ApprovedStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    suspendedStudents: 0,
    averageRating: 0,
    totalProjects: 0,
    completedProjects: 0,
    averageCompletionRate: 0,
    totalReports: 0,
    pendingReports: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("approvedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTerminationModal, setShowTerminationModal] = useState(false);
  const [selectedStudentForAction, setSelectedStudentForAction] =
    useState(null);

  // Fetch approved students data
  const fetchApprovedStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/students/approved", {
        params: {
          status: filterStatus,
          search: searchTerm,
          sortBy,
          sortOrder,
        },
      });

      if (response.data.success) {
        setStudents(response.data.data.students);
        setStats(response.data.data.stats);
      } else {
        toast.error("Failed to fetch approved students");
      }
    } catch (error) {
      console.error("Error fetching approved students:", error);
      toast.error("Failed to fetch approved students");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchApprovedStudents();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApprovedStudents();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleViewApplication = (student) => {
    navigate(`/admin/student-applications/${student.id}`);
  };

  const handleViewPerformance = (student) => {
    navigate(`/admin/student-tracking/${student.id}`);
  };

  const handleTerminateStudent = (student) => {
    setSelectedStudentForAction(student);
    setShowTerminationModal(true);
  };

  const onTerminationSuccess = () => {
    fetchApprovedStudents();
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "College",
        "Degree",
        "Year",
        "GPA",
        "Total Projects",
        "Completed Projects",
        "Overall Rating",
        "Status",
        "Approved Date",
      ],
      ...students.map((student) => [
        student.name,
        student.email,
        student.college,
        student.degree,
        student.year,
        student.gpa,
        student.projects?.total || 0,
        student.projects?.completed || 0,
        student.overallRating || 0,
        student.status,
        new Date(student.approvedDate).toLocaleDateString(),
      ]),
    ];

    const csvString = csvContent.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `approved_students_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "terminated":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 8.0) return "text-green-400";
    if (gpa >= 7.0) return "text-blue-400";
    if (gpa >= 6.0) return "text-yellow-400";
    return "text-red-400";
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return "text-green-400";
    if (rating >= 4.0) return "text-blue-400";
    if (rating >= 3.0) return "text-yellow-400";
    if (rating >= 2.0) return "text-orange-400";
    return "text-red-400";
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? "text-yellow-400" : "text-gray-600"
            }`}
          />
        ))}
        <span
          className={`ml-1 text-xs font-semibold ${getPerformanceColor(
            rating
          )}`}
        >
          {rating > 0 ? rating.toFixed(1) : "N/A"}
        </span>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Approved Students
            </h1>
            <p className="text-gray-400">
              Manage and monitor approved student accounts
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <FaDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">
                Total Students
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalStudents}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FaGraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">
                Active Students
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.activeStudents}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <FaCheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Avg Rating</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.averageRating}/5
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <FaStar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">
                Total Projects
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalProjects}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-500">
              <FaProjectDiagram className="w-8 h-8 text-white" />
            </div>
          </div>
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
                placeholder="Search students..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="approvedDate">Approved Date</option>
              <option value="name">Name</option>
              <option value="gpa">GPA</option>
              <option value="projects.total">Total Projects</option>
              <option value="overallRating">Performance Rating</option>
              <option value="level">Level</option>
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="w-8 h-8 text-blue-400 animate-spin mr-3" />
          <span className="text-white text-lg">
            Loading approved students...
          </span>
        </div>
      ) : (
        <>
          {/* Students Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {student.profilePicture ? (
                      <img
                        src={student.profilePicture}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {student.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{student.year}</p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.level === "Expert"
                              ? "bg-purple-600 text-purple-100"
                              : student.level === "Advanced"
                              ? "bg-blue-600 text-blue-100"
                              : student.level === "Intermediate"
                              ? "bg-green-600 text-green-100"
                              : "bg-gray-600 text-gray-100"
                          }`}
                        >
                          {student.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </span>
                    <div className="mt-2">
                      {renderStarRating(student.overallRating)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <FaEnvelope className="w-4 h-4 mr-2 text-gray-400" />
                    {student.email}
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <FaGraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                    {student.degree} at {student.college}
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                    {student.location}
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                    Approved:{" "}
                    {new Date(student.approvedDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center bg-gray-700 rounded-lg p-2">
                    <div
                      className={`text-lg font-bold ${getGpaColor(
                        student.gpa
                      )}`}
                    >
                      {student.gpa}
                    </div>
                    <div className="text-gray-400 text-xs">GPA</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-2">
                    <div className="text-lg font-bold text-blue-400">
                      {student.projects?.total || 0}
                    </div>
                    <div className="text-gray-400 text-xs">Projects</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-400">
                      {student.projects?.completed || 0}
                    </div>
                    <div className="text-gray-400 text-xs">Done</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-2">
                    <div
                      className={`text-lg font-bold ${
                        student.totalReports > 0
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {student.totalReports || 0}
                    </div>
                    <div className="text-gray-400 text-xs">Reports</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                        +{student.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewApplication(student)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    title="View Application"
                  >
                    <FaEye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => handleViewPerformance(student)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    title="View Performance"
                  >
                    <FaChartLine className="w-3 h-3" />
                    Track
                  </button>
                  <button
                    onClick={() => handleTerminateStudent(student)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    title="Terminate Student"
                    disabled={student.status === "terminated"}
                  >
                    <FaBan className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {students.length === 0 && !loading && (
              <div className="col-span-full text-center py-20">
                <FaGraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No Approved Students
                </h3>
                <p className="text-gray-500">
                  No students have been approved yet.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Termination Modal */}
      <TerminationModal
        student={selectedStudentForAction}
        isOpen={showTerminationModal}
        onClose={() => {
          setShowTerminationModal(false);
          setSelectedStudentForAction(null);
        }}
        onSuccess={onTerminationSuccess}
      />

      {/* Simple Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-2xl font-semibold text-white">
                Student Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                {selectedStudent.profilePicture ? (
                  <img
                    src={selectedStudent.profilePicture}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-2xl">
                      {selectedStudent.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-semibold text-white">
                    {selectedStudent.name}
                  </h4>
                  <p className="text-gray-400">{selectedStudent.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        selectedStudent.status
                      )}`}
                    >
                      {selectedStudent.status.charAt(0).toUpperCase() +
                        selectedStudent.status.slice(1)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedStudent.level === "Expert"
                          ? "bg-purple-600 text-purple-100"
                          : selectedStudent.level === "Advanced"
                          ? "bg-blue-600 text-blue-100"
                          : selectedStudent.level === "Intermediate"
                          ? "bg-green-600 text-green-100"
                          : "bg-gray-600 text-gray-100"
                      }`}
                    >
                      {selectedStudent.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Phone
                    </label>
                    <p className="text-white">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      College
                    </label>
                    <p className="text-white">{selectedStudent.college}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Degree
                    </label>
                    <p className="text-white">{selectedStudent.degree}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Location
                    </label>
                    <p className="text-white">{selectedStudent.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Approved
                    </label>
                    <p className="text-white">
                      {new Date(
                        selectedStudent.approvedDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Overall Rating
                    </label>
                    {renderStarRating(selectedStudent.overallRating)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div
                    className={`text-2xl font-bold ${getGpaColor(
                      selectedStudent.gpa
                    )}`}
                  >
                    {selectedStudent.gpa}
                  </div>
                  <div className="text-gray-400 text-sm">GPA</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedStudent.projects?.total || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Projects</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-green-400">
                    {selectedStudent.projects?.completed || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Completed</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedStudent.totalPoints || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Points</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleViewApplication(selectedStudent);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaEye className="w-5 h-5" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleViewPerformance(selectedStudent);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaChartLine className="w-5 h-5" />
                  Track Performance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedStudents;
