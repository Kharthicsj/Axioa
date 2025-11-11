import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaImage,
  FaCode,
  FaFilePdf,
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaTags,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import Header from "../../components/Header";

const MyWorks = () => {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    projects: 0,
    documents: 0,
    certificates: 0,
  });

  // Sample data for now - replace with API calls later
  useEffect(() => {
    const sampleWorks = [
      {
        id: 1,
        title: "React Portfolio Website",
        description:
          "Personal portfolio website built with React and Tailwind CSS",
        type: "project",
        tags: ["React", "Tailwind", "JavaScript"],
        thumbnail: null,
        liveUrl: "https://portfolio-example.com",
        githubUrl: "https://github.com/user/portfolio",
        createdAt: "2024-09-15",
        status: "published",
      },
      {
        id: 2,
        title: "JavaScript Fundamentals Certificate",
        description:
          "Certificate of completion for JavaScript fundamentals course",
        type: "certificate",
        tags: ["JavaScript", "Certificate"],
        fileUrl: "/documents/js-certificate.pdf",
        issuer: "AXION Academy",
        createdAt: "2024-09-10",
        status: "verified",
      },
      {
        id: 3,
        title: "E-commerce API Documentation",
        description:
          "Complete API documentation for e-commerce backend project",
        type: "document",
        tags: ["API", "Documentation", "Node.js"],
        fileUrl: "/documents/api-docs.pdf",
        createdAt: "2024-08-25",
        status: "draft",
      },
      {
        id: 4,
        title: "Task Manager App",
        description:
          "Full-stack task management application with real-time updates",
        type: "project",
        tags: ["React", "Node.js", "Socket.io"],
        thumbnail: null,
        liveUrl: "https://taskmanager-demo.com",
        githubUrl: "https://github.com/user/task-manager",
        createdAt: "2024-08-20",
        status: "published",
      },
    ];

    setTimeout(() => {
      setWorks(sampleWorks);
      setStats({
        total: sampleWorks.length,
        projects: sampleWorks.filter((w) => w.type === "project").length,
        documents: sampleWorks.filter((w) => w.type === "document").length,
        certificates: sampleWorks.filter((w) => w.type === "certificate")
          .length,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const filteredWorks = works.filter(
    (work) => filter === "all" || work.type === filter
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "project":
        return <FaCode className="text-blue-400" />;
      case "document":
        return <FaFileAlt className="text-green-400" />;
      case "certificate":
        return <FaFilePdf className="text-yellow-400" />;
      default:
        return <FaFileAlt className="text-gray-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "project":
        return "text-blue-400 bg-blue-400/10";
      case "document":
        return "text-green-400 bg-green-400/10";
      case "certificate":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
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
          <p className="text-gray-400 mt-4">Loading your works...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">My Works</h1>
          <p className="text-gray-400">
            Showcase your projects, documents, and achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Works</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FaFileAlt className="text-3xl text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Projects</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.projects}
                </p>
              </div>
              <FaCode className="text-3xl text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Documents</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.documents}
                </p>
              </div>
              <FaFileAlt className="text-3xl text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Certificates</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.certificates}
                </p>
              </div>
              <FaFilePdf className="text-3xl text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filter and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            {["all", "project", "document", "certificate"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType !== "all" && (
                  <span className="ml-2 bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    {stats[filterType === "all" ? "total" : filterType + "s"] ||
                      stats[filterType]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaPlus className="w-4 h-4" />
            Add New Work
          </button>
        </div>

        {/* Works Grid */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            {filteredWorks.length === 0 ? (
              <div className="text-center py-12">
                <FaFileAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  No works found
                </h3>
                <p className="text-gray-500 mb-6">
                  {filter === "all"
                    ? "Start adding your projects and documents to build your portfolio"
                    : `No ${filter}s found. Try selecting a different filter.`}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                  Add Your First Work
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorks.map((work) => (
                  <div
                    key={work.id}
                    className="bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors overflow-hidden"
                  >
                    {/* Thumbnail/Preview */}
                    <div className="h-48 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                      {work.thumbnail ? (
                        <img
                          src={work.thumbnail}
                          alt={work.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl text-gray-500">
                          {getTypeIcon(work.type)}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Work Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {work.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {work.description}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(
                            work.type
                          )}`}
                        >
                          {getTypeIcon(work.type)}
                          <span className="capitalize">{work.type}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {work.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded flex items-center gap-1"
                            >
                              <FaTags className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <FaCalendarAlt className="w-4 h-4" />
                        {formatDate(work.createdAt)}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                          <FaEye className="w-4 h-4" />
                          View
                        </button>

                        {work.type === "project" && work.githubUrl && (
                          <button
                            onClick={() =>
                              window.open(work.githubUrl, "_blank")
                            }
                            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                          >
                            <FaGithub className="w-4 h-4" />
                          </button>
                        )}

                        {work.type === "project" && work.liveUrl && (
                          <button
                            onClick={() => window.open(work.liveUrl, "_blank")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                          >
                            <FaExternalLinkAlt className="w-4 h-4" />
                          </button>
                        )}

                        {(work.type === "document" ||
                          work.type === "certificate") &&
                          work.fileUrl && (
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                              <FaDownload className="w-4 h-4" />
                            </button>
                          )}
                      </div>
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

export default MyWorks;
