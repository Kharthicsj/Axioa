import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaCube,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaClock,
    FaDollarSign,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaCog,
    FaIndustry,
    FaRuler,
    FaTools,
    FaDownload,
    FaEye,
} from "react-icons/fa";
import Header from "../../components/Header";

const CADModelling = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const features = [
        "3D Product Design & Modeling",
        "Technical Drawing & Blueprints",
        "Mechanical Component Design",
        "Assembly Modeling",
        "Rendering & Visualization",
        "Prototype Development",
        "Engineering Analysis (FEA)",
        "Sheet Metal Design",
        "Surface Modeling",
        "Parametric Design",
        "CAD File Conversion",
        "Manufacturing Drawings",
    ];

    const software = [
        {
            name: "SolidWorks",
            icon: <FaCube className="text-red-400" />,
            color: "border-red-400",
        },
        {
            name: "AutoCAD",
            icon: <FaRuler className="text-blue-400" />,
            color: "border-blue-400",
        },
        {
            name: "Fusion 360",
            icon: <FaCog className="text-orange-400" />,
            color: "border-orange-400",
        },
        {
            name: "Inventor",
            icon: <FaTools className="text-yellow-400" />,
            color: "border-yellow-400",
        },
        {
            name: "CATIA",
            icon: <FaIndustry className="text-purple-400" />,
            color: "border-purple-400",
        },
        {
            name: "Creo",
            icon: <FaCube className="text-green-400" />,
            color: "border-green-400",
        },
    ];

    const packages = [
        {
            name: "Basic Design",
            price: "₹2,000",
            duration: "2-3 days",
            features: [
                "Simple 3D model",
                "Basic technical drawing",
                "2-3 design iterations",
                "Standard rendering",
                "CAD file delivery",
                "Basic documentation",
                "Email support",
            ],
            popular: false,
        },
        {
            name: "Professional Design",
            price: "₹5,000",
            duration: "5-7 days",
            features: [
                "Complex 3D assembly",
                "Detailed technical drawings",
                "5-6 design iterations",
                "High-quality rendering",
                "Multiple file formats",
                "Manufacturing drawings",
                "Engineering analysis",
                "Priority support",
            ],
            popular: true,
        },
        {
            name: "Enterprise Solution",
            price: "₹12,000",
            duration: "1-2 weeks",
            features: [
                "Complete product design",
                "Multi-part assemblies",
                "Unlimited iterations",
                "Photo-realistic rendering",
                "Prototype consultation",
                "FEA analysis",
                "Manufacturing guidelines",
                "Project management",
                "Dedicated support",
            ],
            popular: false,
        },
    ];

    const portfolio = [
        {
            title: "Mechanical Gear Assembly",
            description:
                "Complex gear mechanism with precise tolerances and engineering analysis",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
            category: "Mechanical Design",
        },
        {
            title: "Product Prototype Design",
            description:
                "Consumer product design with ergonomic considerations and manufacturing feasibility",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
            category: "Product Design",
        },
        {
            title: "Architectural Component",
            description:
                "Structural building component with detailed technical specifications",
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
            category: "Architecture",
        },
    ];

    const industries = [
        {
            name: "Automotive",
            description: "Engine components, chassis parts, body panels",
            icon: <FaCog className="w-8 h-8 text-blue-400" />,
        },
        {
            name: "Aerospace",
            description: "Aircraft parts, structural components, assemblies",
            icon: <FaCube className="w-8 h-8 text-purple-400" />,
        },
        {
            name: "Manufacturing",
            description: "Industrial machinery, tools, production equipment",
            icon: <FaIndustry className="w-8 h-8 text-orange-400" />,
        },
        {
            name: "Consumer Products",
            description: "Electronics, appliances, household items",
            icon: <FaTools className="w-8 h-8 text-green-400" />,
        },
        {
            name: "Architecture",
            description: "Building components, structural elements",
            icon: <FaRuler className="w-8 h-8 text-cyan-400" />,
        },
        {
            name: "Medical Devices",
            description: "Surgical instruments, medical equipment",
            icon: <FaCube className="w-8 h-8 text-red-400" />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            {/* Breadcrumb */}
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Link
                            to="/services"
                            className="hover:text-white transition-colors"
                        >
                            Services
                        </Link>
                        <span>/</span>
                        <span className="text-white">CAD Modelling</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Back to Services
                            </button>

                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                                <FaCube className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                CAD Modelling
                                <span className="block text-2xl md:text-3xl text-orange-400 mt-2">
                                    Precise. Professional. Production-Ready.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                Transform your ideas into precise 3D models and
                                technical drawings. From concept to production,
                                our CAD experts deliver accurate designs that
                                meet industry standards.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/cad-modeling/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                                >
                                    Start Your Design
                                </button>
                                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    View Portfolio
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl"></div>
                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-orange-400 mb-2">
                                            200+
                                        </div>
                                        <div className="text-gray-400">
                                            Models Created
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-red-400 mb-2">
                                            4.9/5
                                        </div>
                                        <div className="text-gray-400">
                                            Client Rating
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-orange-400 mb-2">
                                            50+
                                        </div>
                                        <div className="text-gray-400">
                                            Industries Served
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-red-400 mb-2">
                                            100%
                                        </div>
                                        <div className="text-gray-400">
                                            Accuracy Rate
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            CAD Design Services
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Comprehensive CAD modeling services for all your
                            design and engineering needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300"
                            >
                                <FaCheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Software Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Software We Use
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Industry-standard CAD software for precise and
                            professional results
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {software.map((tool, index) => (
                            <div
                                key={index}
                                className={`p-6 bg-gray-800/50 rounded-xl border-2 ${tool.color} hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 text-center`}
                            >
                                <div className="text-4xl mb-3 flex justify-center">
                                    {tool.icon}
                                </div>
                                <div className="font-semibold text-gray-300">
                                    {tool.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Industries Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Industries We Serve
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Specialized CAD solutions across various industries
                            and applications
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {industries.map((industry, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105 text-center"
                            >
                                <div className="mb-4 flex justify-center">
                                    {industry.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {industry.name}
                                </h3>
                                <p className="text-gray-400">
                                    {industry.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            CAD Modelling Pricing
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional 3D modeling and technical drawing
                            services for all industries
                        </p>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Professional CAD Design Services
                                </h3>
                                <div className="text-5xl font-bold text-orange-400 mb-6">
                                    ₹2,000 - ₹12,000
                                </div>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Our CAD modeling services include 3D product
                                    design, technical drawings, mechanical
                                    component design, and engineering analysis.
                                    We use industry-standard software like
                                    SolidWorks, AutoCAD, and Fusion 360 to
                                    deliver precise models and drawings for
                                    manufacturing, prototyping, and
                                    visualization.
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/cad-modeling/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                                >
                                    Assign Project
                                </button>
                            </div>

                            {/* Right Visual */}
                            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-8 lg:p-12 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-r-2xl"></div>
                                <div className="text-center relative z-10">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <FaCube className="text-3xl text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-6">
                                        3D Design Excellence
                                    </h4>
                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaCog className="text-orange-400" />
                                                SolidWorks Models
                                            </span>
                                            <span className="text-orange-400 font-bold text-lg">
                                                500+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaRuler className="text-orange-400" />
                                                Technical Drawings
                                            </span>
                                            <span className="text-orange-400 font-bold text-lg">
                                                1000+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaIndustry className="text-orange-400" />
                                                Industries Served
                                            </span>
                                            <span className="text-orange-400 font-bold text-lg">
                                                15+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaCheckCircle className="text-orange-400" />
                                                Design Accuracy
                                            </span>
                                            <span className="text-orange-400 font-bold text-lg">
                                                99.9%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Portfolio Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our CAD Portfolio
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Explore our recent CAD modeling and design projects
                            across various industries
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {portfolio.map((project, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div className="aspect-video bg-gray-700 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                                            {project.category}
                                        </span>
                                        <button className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2">
                                            <FaEye className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-900/20 to-red-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Bring Your Design to Life?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Get professional CAD modeling services that meet your
                        exact specifications and industry standards.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
                            <FaPhone className="w-4 h-4" />
                            Call Now: +91 9876543210
                        </button>
                        <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
                            <FaWhatsapp className="w-4 h-4" />
                            WhatsApp Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CADModelling;
