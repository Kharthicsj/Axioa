import React, { useState, useEffect } from "react";
import {
  FaProjectDiagram,
  FaTasks,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUser,
  FaCode,
  FaGithub,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import Header from "../../components/Header";

const ProjectDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
  });

  // Sample data for now - replace with API calls later
  useEffect(() => {
    const sampleProjects = [
      {
        id: 1,
        title: "E-commerce Website",
        description: "Full-stack e-commerce platform with React and Node.js",
        status: "active",
        progress: 75,
        dueDate: "2024-12-15",
        technologies: ["React", "Node.js", "MongoDB"],
        mentor: "John Smith",
        createdAt: "2024-10-01",
      },
      {
        id: 2,
        title: "Mobile App UI/UX",
        description: "Design and prototype for a fitness tracking mobile app",
        status: "completed",
        progress: 100,
        dueDate: "2024-09-30",
        technologies: ["Figma", "React Native"],
        mentor: "Sarah Johnson",
        createdAt: "2024-09-01",
      },
      {
        id: 3,
        title: "Data Analytics Dashboard",
        description:
          "Business intelligence dashboard with real-time data visualization",
        status: "pending",
        progress: 25,
        dueDate: "2024-12-30",
        technologies: ["Python", "Django", "Chart.js"],
        mentor: "Mike Chen",
        createdAt: "2024-10-02",
      },
    ];

    setTimeout(() => {
      setProjects(sampleProjects);
      setStats({
        total: sampleProjects.length,
        active: sampleProjects.filter((p) => p.status === "active").length,
        completed: sampleProjects.filter((p) => p.status === "completed")
          .length,
        pending: sampleProjects.filter((p) => p.status === "pending").length,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-blue-400 bg-blue-400/10";
      case "completed":
        return "text-green-400 bg-green-400/10";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaTasks />;
      case "completed":
        return <FaCheckCircle />;
      case "pending":
        return <FaClock />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-4">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-400">
            Track your projects and monitor your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FaProjectDiagram className="text-3xl text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.active}
                </p>
              </div>
              <FaTasks className="text-3xl text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.completed}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.pending}
                </p>
              </div>
              <FaClock className="text-3xl text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Your Projects
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FaPlus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>

          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FaProjectDiagram className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your first project to begin your learning journey
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {project.description}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">
                        Technologies:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FaUser className="text-gray-400" />
                        <span className="text-gray-400">Mentor:</span>
                        <span className="text-white">{project.mentor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-gray-400">Due:</span>
                        <span className="text-white">
                          {formatDate(project.dueDate)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                        <FaEye className="w-4 h-4" />
                        View
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                        <FaGithub className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
