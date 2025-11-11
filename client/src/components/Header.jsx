import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    FaUser,
    FaCog,
    FaUsers,
    FaCheckCircle,
    FaChartBar,
    FaFileAlt,
    FaGraduationCap,
    FaEdit,
    FaSignOutAlt,
    FaInfoCircle,
    FaPen,
    FaTasks,
} from "react-icons/fa";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();

    // Refs for click outside detection
    const userMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/");
        setShowUserMenu(false);
    };

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close user dropdown if clicked outside
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false);
            }

            // Close mobile menu if clicked outside
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="relative z-50 bg-transparent py-6 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">
                                A
                            </span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tighter">
                            AXION
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            Home
                        </Link>
                        <a
                            href="#about"
                            className="text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            About
                        </a>
                        <Link
                            to="/services"
                            className="text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            Services
                        </Link>
                        <a
                            href="#contact"
                            className="text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            Contact
                        </a>

                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                                        {user?.profilePicture ? (
                                            <img
                                                src={
                                                    user.profilePicture.startsWith(
                                                        "data:"
                                                    )
                                                        ? user.profilePicture
                                                        : `${
                                                              import.meta.env
                                                                  .VITE_API_BASE_URL
                                                          }${
                                                              user.profilePicture
                                                          }`
                                                }
                                                alt={user.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white text-sm font-medium">
                                                {user?.username
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm">
                                        {user?.username}
                                    </span>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-700">
                                            <p className="text-sm text-gray-300">
                                                {user?.email}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {user?.college}
                                            </p>
                                            <p className="text-xs text-blue-400 capitalize font-medium">
                                                {user?.role}
                                            </p>
                                        </div>

                                        {/* Profile & Settings */}
                                        <button
                                            onClick={() => {
                                                navigate("/profile");
                                                setShowUserMenu(false);
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                        >
                                            <FaUser className="w-4 h-4" />
                                            Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/assigned-works");
                                                setShowUserMenu(false);
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                        >
                                            <FaTasks className="w-4 h-4" />
                                            Assigned Works
                                        </button>

                                        {/* Role-based menu items */}
                                        {user?.role === "admin" && (
                                            <>
                                                <div className="border-t border-gray-700 mt-2 pt-2">
                                                    <p className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wide">
                                                        Admin Panel
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                "/admin/dashboard"
                                                            );
                                                            setShowUserMenu(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    >
                                                        <FaChartBar className="w-4 h-4" />
                                                        Admin Panel
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                "/admin/all-users"
                                                            );
                                                            setShowUserMenu(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    >
                                                        <FaUsers className="w-4 h-4" />
                                                        Manage Users
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                "/admin/student-applications"
                                                            );
                                                            setShowUserMenu(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    >
                                                        <FaCheckCircle className="w-4 h-4" />
                                                        Student Applications
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {user?.role === "student" && (
                                            <>
                                                <div className="border-t border-gray-700 mt-2 pt-2">
                                                    <p className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wide">
                                                        Student Dashboard
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                "/student/projects"
                                                            );
                                                            setShowUserMenu(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    >
                                                        <FaGraduationCap className="w-4 h-4" />
                                                        Project Dashboard
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                "/student/my-works"
                                                            );
                                                            setShowUserMenu(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    >
                                                        <FaFileAlt className="w-4 h-4" />
                                                        My Works
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {user?.role === "user" && (
                                            <>
                                                <div className="border-t border-gray-700 mt-2 pt-2">
                                                    <p className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wide">
                                                        Get Started
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            navigate(
                                                                "/apply-for-student"
                                                            );
                                                            setShowUserMenu(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    >
                                                        <FaPen className="w-4 h-4" />
                                                        Apply as Student
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowUserMenu(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    >
                                                        <FaInfoCircle className="w-4 h-4" />
                                                        How it Works
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        <div className="border-t border-gray-700 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                                            >
                                                <FaSignOutAlt className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/signin"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-5 py-2 rounded-full text-white transition-all duration-300 transform hover:scale-105"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-300 transition-colors duration-300"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div
                        className="md:hidden mt-4 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg p-4"
                        ref={mobileMenuRef}
                    >
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                            >
                                Home
                            </Link>
                            <a
                                href="#about"
                                className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                            >
                                About
                            </a>
                            <Link
                                to="/services"
                                className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <a
                                href="#contact"
                                className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                            >
                                Contact
                            </a>

                            {isAuthenticated ? (
                                <div className="border-t border-gray-700 pt-4">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                                            {user?.profilePicture ? (
                                                <img
                                                    src={
                                                        user.profilePicture.startsWith(
                                                            "data:"
                                                        )
                                                            ? user.profilePicture
                                                            : `${
                                                                  import.meta
                                                                      .env
                                                                      .VITE_API_BASE_URL
                                                              }${
                                                                  user.profilePicture
                                                              }`
                                                    }
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white font-medium">
                                                    {user?.username
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">
                                                {user?.username}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {user?.email}
                                            </p>
                                            <p className="text-blue-400 text-xs capitalize font-medium">
                                                {user?.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Profile & Settings */}
                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                    >
                                        <FaUser className="w-4 h-4" />
                                        Profile
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/assigned-works");
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                    >
                                        <FaTasks className="w-4 h-4" />
                                        Assigned Works
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                    >
                                        <FaCog className="w-4 h-4" />
                                        Settings
                                    </button>

                                    {/* Role-based menu items */}
                                    {user?.role === "admin" && (
                                        <>
                                            <div className="border-t border-gray-700 my-2 pt-2">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                                                    Admin Panel
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            "/admin/dashboard"
                                                        );
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                                >
                                                    <FaChartBar className="w-4 h-4" />
                                                    Admin Panel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            "/admin/all-users"
                                                        );
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                                >
                                                    <FaUsers className="w-4 h-4" />
                                                    Manage Users
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            "/admin/student-applications"
                                                        );
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                                >
                                                    <FaCheckCircle className="w-4 h-4" />
                                                    Student Applications
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {user?.role === "student" && (
                                        <>
                                            <div className="border-t border-gray-700 my-2 pt-2">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                                                    Student Dashboard
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            "/student/projects"
                                                        );
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                                >
                                                    <FaGraduationCap className="w-4 h-4" />
                                                    Project Dashboard
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            "/student/my-works"
                                                        );
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                                >
                                                    <FaFileAlt className="w-4 h-4" />
                                                    My Works
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {user?.role === "user" && (
                                        <>
                                            <div className="border-t border-gray-700 my-2 pt-2">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                                                    Get Started
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        navigate(
                                                            "/apply-for-student"
                                                        );
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                                >
                                                    <FaPen className="w-4 h-4" />
                                                    Apply as Student
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2 w-full text-left"
                                                >
                                                    <FaInfoCircle className="w-4 h-4" />
                                                    How it Works
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    <div className="border-t border-gray-700 mt-2 pt-2">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-300 py-2 w-full text-left"
                                        >
                                            <FaSignOutAlt className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-gray-700 pt-4">
                                    <Link
                                        to="/signin"
                                        className="block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2 rounded-full transition-all duration-300 w-full text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Header;
