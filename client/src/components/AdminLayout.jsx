import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import Header from "./Header";
import {
    FaChartBar,
    FaUsers,
    FaUserGraduate,
    FaClipboardList,
    FaUserCheck,
    FaCog,
    FaHome,
    FaBars,
    FaTimes,
    FaProjectDiagram,
    FaTasks,
} from "react-icons/fa";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        {
            path: "/admin/dashboard",
            name: "Dashboard",
            icon: FaChartBar,
        },
        {
            path: "/admin/student-applications",
            name: "Student Applications",
            icon: FaClipboardList,
        },
        {
            path: "/admin/approved-students",
            name: "Approved Students",
            icon: FaUserCheck,
        },
        {
            path: "/admin/all-users",
            name: "All Users",
            icon: FaUsers,
        },
        {
            path: "/admin/projects",
            name: "Projects",
            icon: FaProjectDiagram,
        },
        {
            path: "/admin/works",
            name: "Works",
            icon: FaTasks,
        },
    ];

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />

            <div className="flex">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
                    </div>
                )}

                {/* Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 bg-opacity-95 backdrop-blur-sm transform ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
                >
                    <div className="flex items-center justify-between h-16 px-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm lg:hidden">
                        <span className="text-white font-semibold text-lg">
                            Admin Panel
                        </span>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 mb-8">
                            <FaHome className="w-8 h-8 text-blue-400 mr-3" />
                            <span className="text-white font-bold text-xl">
                                Admin Panel
                            </span>
                        </div>

                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                            isActiveRoute(item.path)
                                                ? "bg-gray-800 bg-opacity-80 text-white border-l-4 border-blue-400"
                                                : "text-gray-300 hover:bg-gray-800 hover:bg-opacity-60 hover:text-white"
                                        }`}
                                    >
                                        <Icon
                                            className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                                isActiveRoute(item.path)
                                                    ? "text-blue-400"
                                                    : "text-gray-400 group-hover:text-gray-300"
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-700">
                            <Link
                                to="/"
                                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FaHome className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 lg:ml-0">
                    {/* Mobile menu button */}
                    <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 lg:hidden">
                        <div className="flex items-center justify-between h-16 px-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            >
                                <FaBars className="w-6 h-6" />
                            </button>
                            <span className="text-white font-semibold text-lg">
                                Admin Panel
                            </span>
                            <div></div>
                        </div>
                    </div>

                    {/* Page content */}
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
