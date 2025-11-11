import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaStar,
    FaEnvelope,
    FaClock,
    FaCheckCircle,
    FaCode,
    FaMobile,
    FaFileAlt,
    FaCube,
    FaPaintBrush,
    FaChartBar,
    FaEdit,
    FaPhone,
    FaGraduationCap,
    FaMapMarkerAlt,
    FaUser,
    FaFilter,
    FaSearch,
    FaSort,
    FaTimes,
    FaSpinner,
    FaCalendarAlt,
} from "react-icons/fa";
import Header from "../../components/Header";
import ProjectDetailsPopup from "../../components/ProjectDetailsPopup";
import api from "../../utils/api";

const StudentSelection = () => {
    const navigate = useNavigate();
    const { service } = useParams();

    // State management
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({});
    const [expandedSkills, setExpandedSkills] = useState({}); // Track which student's skills are expanded
    const [filterSkillsArray, setFilterSkillsArray] = useState([]); // Skills filter array
    const [skillFilterInput, setSkillFilterInput] = useState(""); // Input for adding skills to filter
    const [loadingMore, setLoadingMore] = useState(false); // Loading more students
    const [hasMoreStudents, setHasMoreStudents] = useState(true); // Whether more students are available
    const [displayedStudents, setDisplayedStudents] = useState([]); // Students currently displayed
    const [currentPage, setCurrentPage] = useState(1); // Current page for load more
    const [showProjectPopup, setShowProjectPopup] = useState(false); // Project details popup
    const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for project

    // Filter states
    const [filters, setFilters] = useState({
        search: "",
        skills: "",
        location: "",
        college: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
        limit: 6, // Reduced for better performance
    });

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Service configuration
    const serviceConfig = {
        "web-development": {
            title: "Web Development",
            icon: <FaCode className="text-white" />,
            color: "from-green-500 to-emerald-500",
            description: "Choose from our skilled web developers",
        },
        "app-development": {
            title: "App Development",
            icon: <FaMobile className="text-white" />,
            color: "from-purple-500 to-pink-500",
            description: "Select from our mobile app development experts",
        },
        "resume-services": {
            title: "Resume Services",
            icon: <FaFileAlt className="text-white" />,
            color: "from-blue-500 to-cyan-500",
            description: "Connect with our professional resume writers",
        },
        "cad-modeling": {
            title: "CAD Modeling",
            icon: <FaCube className="text-white" />,
            color: "from-orange-500 to-red-500",
            description: "Work with our skilled CAD designers",
        },
        "ui-ux-design": {
            title: "UI/UX Design",
            icon: <FaPaintBrush className="text-white" />,
            color: "from-purple-500 to-pink-500",
            description: "Partner with our creative UI/UX designers",
        },
        "data-analysis": {
            title: "Data Analysis",
            icon: <FaChartBar className="text-white" />,
            color: "from-blue-500 to-cyan-500",
            description: "Get insights from our data analysis experts",
        },
        "content-writing": {
            title: "Content Writing",
            icon: <FaEdit className="text-white" />,
            color: "from-green-500 to-teal-500",
            description: "Collaborate with our content writing specialists",
        },
    };

    // Service-specific skill mappings for filtering
    const serviceSkillMappings = {
        "web-development": [
            "JavaScript",
            "React",
            "Node.js",
            "HTML",
            "CSS",
            "MongoDB",
            "Express",
            "Vue",
            "Angular",
            "PHP",
            "Python",
        ],
        "app-development": [
            "Flutter",
            "React Native",
            "Swift",
            "Kotlin",
            "Java",
            "Dart",
            "Firebase",
            "iOS",
            "Android",
            "Mobile",
        ],
        "resume-services": [
            "Writing",
            "Resume",
            "CV",
            "LinkedIn",
            "Career",
            "Professional Writing",
            "Content",
        ],
        "cad-modeling": [
            "AutoCAD",
            "SolidWorks",
            "Fusion 360",
            "3D Modeling",
            "CAD",
            "Technical Drawing",
            "Design",
        ],
        "ui-ux-design": [
            "Figma",
            "Adobe XD",
            "Sketch",
            "Photoshop",
            "UI Design",
            "UX Design",
            "Prototyping",
            "Design",
        ],
        "data-analysis": [
            "Python",
            "R",
            "SQL",
            "Excel",
            "Tableau",
            "Power BI",
            "Data Science",
            "Statistics",
            "Analytics",
        ],
        "content-writing": [
            "Content Writing",
            "SEO",
            "Copywriting",
            "Blog Writing",
            "Creative Writing",
            "Marketing",
        ],
    };

    // Fetch students data
    const fetchStudents = async (isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setCurrentPage(1);
            }
            setError(null);

            // Get service-specific skills for filtering
            const serviceSkills = serviceSkillMappings[service] || [];

            const queryParams = new URLSearchParams({
                service: service,
                skills: serviceSkills.join(","),
                ...filters,
                page: isLoadMore ? currentPage + 1 : 1,
            });

            const response = await api.get(
                `/students/available?${queryParams}`
            );

            if (response.data.success) {
                const newStudents = response.data.data.students;
                const pagination = response.data.data.pagination;

                if (isLoadMore) {
                    // Append new students to existing ones
                    setStudents((prev) => [...prev, ...newStudents]);
                    setFilteredStudents((prev) => [...prev, ...newStudents]);
                    setDisplayedStudents((prev) => [...prev, ...newStudents]);
                    setCurrentPage((prev) => prev + 1);
                } else {
                    // Replace with new students
                    setStudents(newStudents);
                    setFilteredStudents(newStudents);
                    setDisplayedStudents(newStudents);
                    setCurrentPage(1);
                }

                setPagination(pagination);
                setHasMoreStudents(pagination.hasNextPage);
            } else {
                setError(response.data.message || "Failed to fetch students");
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setError(
                error.response?.data?.message ||
                    "Failed to fetch students. Please try again."
            );
            if (!isLoadMore) {
                setStudents([]);
                setFilteredStudents([]);
                setDisplayedStudents([]);
            }
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    // Fetch students on component mount and when filters change
    useEffect(() => {
        fetchStudents();
    }, [service, filters.sortBy, filters.sortOrder, filters.page]);

    // Handle local filtering (search, skills, location, college filters)
    useEffect(() => {
        let filtered = [...students];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(
                (student) =>
                    student.name
                        .toLowerCase()
                        .includes(filters.search.toLowerCase()) ||
                    student.skills.some((skill) =>
                        skill
                            .toLowerCase()
                            .includes(filters.search.toLowerCase())
                    ) ||
                    student.college
                        ?.toLowerCase()
                        .includes(filters.search.toLowerCase()) ||
                    student.location
                        ?.toLowerCase()
                        .includes(filters.search.toLowerCase())
            );
        }

        // Skills filter
        if (filterSkillsArray.length > 0) {
            const skillsArrayLower = filterSkillsArray.map((skill) =>
                skill.toLowerCase()
            );
            filtered = filtered.filter((student) =>
                skillsArrayLower.some((filterSkill) =>
                    student.skills?.some((studentSkill) =>
                        studentSkill.toLowerCase().includes(filterSkill)
                    )
                )
            );
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter((student) =>
                student.location
                    ?.toLowerCase()
                    .includes(filters.location.toLowerCase())
            );
        }

        // College filter
        if (filters.college) {
            filtered = filtered.filter((student) =>
                student.college
                    ?.toLowerCase()
                    .includes(filters.college.toLowerCase())
            );
        }

        setFilteredStudents(filtered);
        setDisplayedStudents(filtered);
    }, [
        students,
        filters.search,
        filterSkillsArray,
        filters.location,
        filters.college,
    ]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1, // Reset page when filters change
        }));
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            search: "",
            skills: "",
            location: "",
            college: "",
            sortBy: "createdAt",
            sortOrder: "desc",
            page: 1,
            limit: 6,
        });
        setFilterSkillsArray([]);
        setSkillFilterInput("");
        setShowFilters(false);
        setCurrentPage(1);
        setHasMoreStudents(true);
    };

    // Toggle skills expansion for a specific student
    const toggleSkillsExpansion = (studentId) => {
        setExpandedSkills((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    };

    // Skills filter management functions (similar to Profile.jsx)
    const addSkillToFilter = () => {
        const skill = skillFilterInput.trim();
        if (skill && !filterSkillsArray.includes(skill)) {
            const updatedSkills = [...filterSkillsArray, skill];
            setFilterSkillsArray(updatedSkills);
            setFilters((prev) => ({
                ...prev,
                skills: updatedSkills.join(", "),
                page: 1,
            }));
            setSkillFilterInput("");
        }
    };

    const removeSkillFromFilter = (skillToRemove) => {
        const updatedSkills = filterSkillsArray.filter(
            (skill) => skill !== skillToRemove
        );
        setFilterSkillsArray(updatedSkills);
        setFilters((prev) => ({
            ...prev,
            skills: updatedSkills.join(", "),
            page: 1,
        }));
    };

    const handleSkillFilterInputKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkillToFilter();
        }
    };

    // Add predefined skill to filter (from service-specific skills)
    const addPredefinedSkill = (skill) => {
        if (!filterSkillsArray.includes(skill)) {
            const updatedSkills = [...filterSkillsArray, skill];
            setFilterSkillsArray(updatedSkills);
            setFilters((prev) => ({
                ...prev,
                skills: updatedSkills.join(", "),
                page: 1,
            }));
        }
    };

    // Load more students
    const loadMoreStudents = () => {
        if (!loadingMore && hasMoreStudents) {
            fetchStudents(true);
        }
    };

    const currentService =
        serviceConfig[service] || serviceConfig["web-development"];

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setShowProjectPopup(true);
    };

    // Close project popup
    const closeProjectPopup = () => {
        setShowProjectPopup(false);
        setSelectedStudent(null);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            {/* Hero Section */}
            <div className="relative py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Service
                    </button>

                    <div className="text-center mb-12">
                        <div
                            className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${currentService.color} rounded-2xl flex items-center justify-center`}
                        >
                            <div className="text-3xl text-white">
                                {currentService.icon}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Choose Your{" "}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                                {currentService.title}
                            </span>{" "}
                            Expert
                        </h1>
                        <p className="text-xl text-gray-400 mb-6 max-w-3xl mx-auto">
                            {currentService.description}. Browse through our
                            talented students and find the perfect match for
                            your project.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    {/* Search Bar and Filter Toggle */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search students by name, skills, college, or location..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                                className="w-full pl-12 pr-4 py-3 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white hover:border-gray-600/50 transition-colors"
                        >
                            <FaFilter className="w-4 h-4" />
                            Filters
                        </button>
                        <div className="flex items-center gap-2">
                            <FaSort className="w-4 h-4 text-gray-400" />
                            <select
                                value={`${filters.sortBy}-${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] =
                                        e.target.value.split("-");
                                    handleFilterChange("sortBy", sortBy);
                                    handleFilterChange("sortOrder", sortOrder);
                                }}
                                className="px-4 py-3 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="createdAt-desc">
                                    Newest First
                                </option>
                                <option value="createdAt-asc">
                                    Oldest First
                                </option>
                                <option value="rating-desc">
                                    Highest Rated
                                </option>
                                <option value="rating-asc">Lowest Rated</option>
                                <option value="completionRate-desc">
                                    Best Completion Rate
                                </option>
                                <option value="averageGrade-desc">
                                    Best Average Grade
                                </option>
                                <option value="totalPoints-desc">
                                    Most Points
                                </option>
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="lastActive-desc">
                                    Recently Active
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-white">
                                    Advanced Filters
                                </h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                    Reset All
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Skills */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Skills
                                    </label>

                                    {/* Skills Input */}
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            placeholder="e.g. React, Python, JavaScript"
                                            value={skillFilterInput}
                                            onChange={(e) =>
                                                setSkillFilterInput(
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={
                                                handleSkillFilterInputKeyPress
                                            }
                                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkillToFilter}
                                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* Selected Skills Tags */}
                                    {filterSkillsArray.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {filterSkillsArray.map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full font-medium"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeSkillFromFilter(
                                                                    skill
                                                                )
                                                            }
                                                            className="hover:text-blue-200 ml-1"
                                                        >
                                                            <FaTimes className="w-2 h-2" />
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {/* Predefined Skills for this Service */}
                                    <div className="text-xs text-gray-400 mb-2">
                                        Quick add:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {serviceSkillMappings[service]
                                            ?.slice(0, 6)
                                            .map((skill, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() =>
                                                        addPredefinedSkill(
                                                            skill
                                                        )
                                                    }
                                                    disabled={filterSkillsArray.includes(
                                                        skill
                                                    )}
                                                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                                                        filterSkillsArray.includes(
                                                            skill
                                                        )
                                                            ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed"
                                                            : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                                                    }`}
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="City or State"
                                        value={filters.location}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "location",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                {/* College */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        College
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="College or University"
                                        value={filters.college}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "college",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                {/* Apply Filters Button */}
                                <div className="flex items-end">
                                    <button
                                        onClick={fetchStudents}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Filters Display */}
                    {(filters.search ||
                        filterSkillsArray.length > 0 ||
                        filters.location ||
                        filters.college) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-sm text-gray-400">
                                Active filters:
                            </span>
                            {filters.search && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                    Search: {filters.search}
                                    <button
                                        onClick={() =>
                                            handleFilterChange("search", "")
                                        }
                                        className="hover:text-blue-100"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filterSkillsArray.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                                >
                                    {skill}
                                    <button
                                        onClick={() =>
                                            removeSkillFromFilter(skill)
                                        }
                                        className="hover:text-blue-100"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            {filters.location && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                                    Location: {filters.location}
                                    <button
                                        onClick={() =>
                                            handleFilterChange("location", "")
                                        }
                                        className="hover:text-green-100"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.college && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                                    College: {filters.college}
                                    <button
                                        onClick={() =>
                                            handleFilterChange("college", "")
                                        }
                                        className="hover:text-purple-100"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Students Grid */}
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <FaSpinner className="w-8 h-8 text-blue-400 animate-spin" />
                                <p className="text-gray-400">
                                    Loading students...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <div className="text-red-400 text-lg mb-2">
                                    Error loading students
                                </div>
                                <p className="text-gray-400 mb-4">{error}</p>
                                <button
                                    onClick={fetchStudents}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No Students Found */}
                    {!loading && !error && displayedStudents.length === 0 && (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <div className="text-gray-400 text-lg mb-2">
                                    No students found
                                </div>
                                <p className="text-gray-500 mb-4">
                                    Try adjusting your filters or search
                                    criteria
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Students Grid */}
                    {!loading && !error && displayedStudents.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 group"
                                    >
                                        {/* Header with Badge and Rating */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                {student.badge && (
                                                    <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                        {student.badge}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Rating - Top Right */}
                                            <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-lg">
                                                <FaStar className="w-3 h-3 text-yellow-400" />
                                                <span className="text-white font-semibold text-sm">
                                                    {student.rating || 0}
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                    ({student.reviews || 0})
                                                </span>
                                            </div>
                                        </div>

                                        {/* Student Info */}
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="relative">
                                                <div className="relative w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center border-2 border-gray-600/50 overflow-hidden">
                                                    {student.profilePicture &&
                                                    student.profilePicture.trim() !==
                                                        "" ? (
                                                        <img
                                                            src={
                                                                student.profilePicture.startsWith(
                                                                    "data:"
                                                                )
                                                                    ? student.profilePicture
                                                                    : `${
                                                                          import.meta
                                                                              .env
                                                                              .VITE_API_BASE_URL
                                                                      }${
                                                                          student.profilePicture
                                                                      }`
                                                            }
                                                            alt={student.name}
                                                            className="w-full h-full rounded-2xl object-cover"
                                                            onError={(e) => {
                                                                // Hide the image and show the initials fallback
                                                                e.target.style.display =
                                                                    "none";
                                                                // Show the fallback text
                                                                const fallbackSpan =
                                                                    e.target.parentElement.querySelector(
                                                                        ".fallback-initials"
                                                                    );
                                                                if (
                                                                    fallbackSpan
                                                                ) {
                                                                    fallbackSpan.style.display =
                                                                        "block";
                                                                }
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span
                                                        className="fallback-initials text-white text-xl font-medium absolute inset-0 flex items-center justify-center"
                                                        style={{
                                                            display:
                                                                student.profilePicture &&
                                                                student.profilePicture.trim() !==
                                                                    ""
                                                                    ? "none"
                                                                    : "flex",
                                                        }}
                                                    >
                                                        {student.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                {student.level &&
                                                    student.level !==
                                                        "Beginner" && (
                                                        <div className="absolute -top-1 -right-1">
                                                            <span
                                                                className={`inline-block px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
                                                                    student.level ===
                                                                    "Expert"
                                                                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                                                                        : student.level ===
                                                                          "Advanced"
                                                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                                                        : "bg-gradient-to-r from-green-600 to-green-700 text-white"
                                                                }`}
                                                            >
                                                                {student.level}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white mb-1 truncate">
                                                    {student.name}
                                                </h3>
                                                {student.email && (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FaEnvelope className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                                        <span className="text-gray-300 text-xs truncate">
                                                            {student.email}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">
                                                            {student.city ||
                                                                student.location ||
                                                                "Location not specified"}
                                                        </span>
                                                    </div>
                                                    {student.college && (
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <FaGraduationCap className="w-3 h-3 flex-shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    student.college
                                                                }
                                                                {student.year &&
                                                                    ` • ${student.year}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-400 mb-3 text-xs leading-relaxed line-clamp-2">
                                            {student.description ||
                                                "No description available"}
                                        </p>

                                        {/* Skills */}
                                        {student.skills &&
                                            student.skills.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                                            <FaCode className="w-3 h-3" />
                                                            Skills
                                                        </h4>
                                                        {student.skills.length >
                                                            5 && (
                                                            <button
                                                                onClick={() =>
                                                                    toggleSkillsExpansion(
                                                                        student.id
                                                                    )
                                                                }
                                                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                                            >
                                                                {expandedSkills[
                                                                    student.id
                                                                ]
                                                                    ? "View Less"
                                                                    : `View All (${student.skills.length})`}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(expandedSkills[
                                                            student.id
                                                        ]
                                                            ? student.skills
                                                            : student.skills.slice(
                                                                  0,
                                                                  5
                                                              )
                                                        ).map(
                                                            (skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            )
                                                        )}
                                                        {!expandedSkills[
                                                            student.id
                                                        ] &&
                                                            student.skills
                                                                .length > 5 && (
                                                                <span className="bg-gray-700/50 text-gray-400 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-600/50">
                                                                    +
                                                                    {student
                                                                        .skills
                                                                        .length -
                                                                        5}{" "}
                                                                    more
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="bg-gray-800/50 rounded-lg p-2.5 text-center">
                                                <div className="text-gray-400 text-xs mb-0.5">
                                                    Completion Rate
                                                </div>
                                                <div className="text-white font-bold text-sm">
                                                    {student.completionRate ||
                                                        0}
                                                    %
                                                </div>
                                            </div>
                                            <div className="bg-gray-800/50 rounded-lg p-2.5 text-center">
                                                <div className="text-gray-400 text-xs mb-0.5">
                                                    Projects Done
                                                </div>
                                                <div className="text-white font-bold text-sm">
                                                    {student.completedProjects ||
                                                        0}
                                                </div>
                                            </div>
                                            <div className="bg-gray-800/50 rounded-lg p-2.5 text-center">
                                                <div className="text-gray-400 text-xs mb-0.5">
                                                    Total Points
                                                </div>
                                                <div className="text-blue-400 font-bold text-sm">
                                                    {student.totalPoints || 0}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="mb-4 space-y-3">
                                            {/* Technical Skills */}
                                            {student.performanceMetrics
                                                ?.technicalSkills > 0 && (
                                                <div className="p-3 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-gray-600/30">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FaCode className="w-3 h-3 text-blue-400" />
                                                            <span className="text-gray-300 text-sm font-medium">
                                                                Technical Skills
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">
                                                                {[
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ].map(
                                                                    (star) => (
                                                                        <FaStar
                                                                            key={
                                                                                star
                                                                            }
                                                                            className={`w-3 h-3 ${
                                                                                star <=
                                                                                (student
                                                                                    .performanceMetrics
                                                                                    ?.technicalSkills ||
                                                                                    0)
                                                                                    ? "text-yellow-400"
                                                                                    : "text-gray-600"
                                                                            }`}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                            <span className="text-white font-semibold text-sm">
                                                                {student
                                                                    .performanceMetrics
                                                                    ?.technicalSkills ||
                                                                    0}
                                                                /5
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Join Date */}
                                            {student.createdAt && (
                                                <div className="p-3 bg-gradient-to-r from-green-800/20 to-emerald-800/20 rounded-lg border border-green-500/20">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FaCalendarAlt className="w-3 h-3 text-green-400" />
                                                            <span className="text-gray-300 text-sm font-medium">
                                                                Member Since
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-green-400 font-semibold text-sm">
                                                                {new Date(
                                                                    student.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </span>
                                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Availability */}
                                        <div className="flex items-center justify-between mb-4 p-2.5 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        student.availability ===
                                                        "Available now"
                                                            ? "bg-green-400"
                                                            : student.availability ===
                                                              "Available today"
                                                            ? "bg-yellow-400"
                                                            : student.availability ===
                                                              "Busy"
                                                            ? "bg-red-400"
                                                            : "bg-blue-400"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={`text-sm font-medium ${
                                                        student.availability ===
                                                        "Available now"
                                                            ? "text-green-400"
                                                            : student.availability ===
                                                              "Available today"
                                                            ? "text-yellow-400"
                                                            : student.availability ===
                                                              "Busy"
                                                            ? "text-red-400"
                                                            : "text-blue-400"
                                                    }`}
                                                >
                                                    {student.availability ||
                                                        "Available"}
                                                </span>
                                            </div>
                                            {student.totalPoints > 0 && (
                                                <div className="text-xs text-gray-400">
                                                    <span className="font-semibold text-blue-400">
                                                        {student.totalPoints}
                                                    </span>{" "}
                                                    pts
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-2">
                                            <button
                                                onClick={() =>
                                                    handleStudentSelect(student)
                                                }
                                                className={`w-full bg-gradient-to-r ${currentService.color} hover:opacity-90 text-white py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] font-semibold shadow-lg text-sm`}
                                            >
                                                Select & Start Project
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            <div className="flex flex-col items-center mt-12 space-y-4">
                                {/* Results Info */}
                                {pagination && (
                                    <div className="text-center text-gray-400 text-sm">
                                        Showing {displayedStudents.length} of{" "}
                                        {pagination.totalStudents} students
                                    </div>
                                )}

                                {/* Load More Button */}
                                {hasMoreStudents && !loadingMore && (
                                    <button
                                        onClick={loadMoreStudents}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg flex items-center gap-2"
                                    >
                                        <span>Load More Students</span>
                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-150"></div>
                                    </button>
                                )}

                                {/* Loading More State */}
                                {loadingMore && (
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <FaSpinner className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">
                                            Loading more students...
                                        </span>
                                    </div>
                                )}

                                {/* End of List */}
                                {!hasMoreStudents &&
                                    displayedStudents.length > 0 && (
                                        <div className="flex flex-col items-center space-y-2 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-16"></div>
                                                <FaCheckCircle className="w-4 h-4 text-green-400" />
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent w-16"></div>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                You've reached the end of the
                                                list
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                All available students have been
                                                loaded
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* How It Works */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Simple steps to get your project started with our
                            talented students
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">
                                    1
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Browse Students
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Review profiles, ratings, and specializations of
                                available students
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">
                                    2
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Select & Connect
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Choose your preferred student and initiate
                                contact
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">
                                    3
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Discuss Project
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Share your requirements and finalize project
                                details
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">
                                    4
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Get Results
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Receive your completed project with quality
                                assurance
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Details Popup */}
            <ProjectDetailsPopup
                isOpen={showProjectPopup}
                onClose={closeProjectPopup}
                student={selectedStudent}
                service={service}
            />
        </div>
    );
};

export default StudentSelection;
