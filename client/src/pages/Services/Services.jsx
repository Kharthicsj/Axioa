import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaFileAlt,
    FaCode,
    FaMobile,
    FaCube,
    FaLaptopCode,
    FaPaintBrush,
    FaChartLine,
    FaVideo,
    FaCamera,
    FaEdit,
    FaArrowRight,
    FaStar,
    FaCheckCircle,
    FaClock,
    FaDollarSign,
    FaUsers,
} from "react-icons/fa";
import Header from "../../components/Header";

const Services = () => {
    const mainServices = [
        {
            id: 1,
            title: "ATS Friendly Resume Development",
            description:
                "Professional resumes optimized for Applicant Tracking Systems to help you land your dream job.",
            icon: <FaFileAlt className="w-8 h-8" />,
            features: [
                "ATS-optimized formatting",
                "Keyword optimization",
                "Professional templates",
                "Multiple revisions",
                "LinkedIn profile optimization",
            ],
            price: "Starting from ₹999",
            duration: "2-3 days",
            color: "from-blue-500 to-cyan-500",
        },
        {
            id: 2,
            title: "Web Development",
            description:
                "Custom websites and web applications built with modern technologies and responsive design.",
            icon: <FaCode className="w-8 h-8" />,
            features: [
                "Responsive design",
                "Modern frameworks (React, Next.js)",
                "SEO optimization",
                "Fast loading times",
                "Mobile-first approach",
            ],
            price: "Starting from ₹15,000",
            duration: "1-4 weeks",
            color: "from-green-500 to-emerald-500",
        },
        {
            id: 3,
            title: "App Development",
            description:
                "Native and cross-platform mobile applications for iOS and Android with intuitive user experience.",
            icon: <FaMobile className="w-8 h-8" />,
            features: [
                "iOS & Android apps",
                "Cross-platform development",
                "User-friendly interfaces",
                "Backend integration",
                "App store deployment",
            ],
            price: "Starting from ₹25,000",
            duration: "2-6 weeks",
            color: "from-purple-500 to-pink-500",
        },
        {
            id: 4,
            title: "CAD Modelling",
            description:
                "Professional 3D modeling and technical drawings for engineering and design projects.",
            icon: <FaCube className="w-8 h-8" />,
            features: [
                "3D modeling & rendering",
                "Technical drawings",
                "Product design",
                "Prototype development",
                "Engineering analysis",
            ],
            price: "Starting from ₹2,000",
            duration: "3-7 days",
            color: "from-orange-500 to-red-500",
        },
    ];

    const freelancingServices = [
        {
            id: 5,
            title: "UI/UX Design",
            description:
                "Modern and intuitive user interface designs for websites and mobile applications.",
            icon: <FaPaintBrush className="w-6 h-6" />,
            price: "₹5,000 - ₹20,000",
            students: 15,
        },
        {
            id: 6,
            title: "Data Analysis & Visualization",
            description:
                "Transform your data into meaningful insights with professional analysis and charts.",
            icon: <FaChartLine className="w-6 h-6" />,
            price: "₹3,000 - ₹15,000",
            students: 12,
        },
        {
            id: 7,
            title: "Content Writing",
            description:
                "SEO-optimized content, blogs, articles, and copywriting services.",
            icon: <FaEdit className="w-6 h-6" />,
            price: "₹500 - ₹5,000",
            students: 25,
        },
    ];

    const stats = [
        { label: "Projects Completed", value: "500+", icon: <FaCheckCircle /> },
        { label: "Happy Clients", value: "300+", icon: <FaUsers /> },
        { label: "Student Freelancers", value: "150+", icon: <FaStar /> },
        { label: "Average Rating", value: "4.8/5", icon: <FaStar /> },
    ];

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            {/* Hero Section */}
            <div className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Professional{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            Services
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                        From resume development to full-scale application
                        development, our expert team and talented students
                        deliver high-quality solutions tailored to your needs.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl text-blue-400 mb-2 flex justify-center">
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Services */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our Core Services
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional services delivered by our experienced
                            team with guaranteed quality and timely delivery.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {mainServices.map((service) => {
                            const getServiceLink = (title) => {
                                const linkMap = {
                                    "ATS Friendly Resume Development":
                                        "/services/resume-services",
                                    "Web Development":
                                        "/services/web-development",
                                    "App Development":
                                        "/services/app-development",
                                    "CAD Modelling": "/services/cad-modeling",
                                };
                                return linkMap[title] || "/services";
                            };

                            return (
                                <Link
                                    key={service.id}
                                    to={getServiceLink(service.title)}
                                    className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105 group block"
                                >
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <div className="text-white">
                                            {service.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-400 mb-6">
                                        {service.description}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        {service.features.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3"
                                                >
                                                    <FaCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                    <span className="text-gray-300">
                                                        {feature}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-green-400">
                                                <FaDollarSign className="w-4 h-4" />
                                                <span className="font-semibold">
                                                    {service.price}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <FaClock className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {service.duration}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                                            Get Started
                                            <FaArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Student Freelancing Services */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Student Freelancing Projects
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Affordable services by our talented students.
                            Perfect for startups and small businesses looking
                            for quality work at student-friendly prices.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancingServices.map((service) => {
                            const getFreelancingLink = (title) => {
                                const linkMap = {
                                    "UI/UX Design": "/services/ui-ux-design",
                                    "Data Analysis & Visualization":
                                        "/services/data-analysis",
                                    "Content Writing":
                                        "/services/content-writing",
                                };
                                return linkMap[title] || "/services";
                            };

                            return (
                                <Link
                                    key={service.id}
                                    to={getFreelancingLink(service.title)}
                                    className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105 group h-80 flex flex-col"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-white">
                                            {service.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {service.description}
                                    </p>

                                    <div className="space-y-2 mb-4 flex-grow">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">
                                                Price Range:
                                            </span>
                                            <span className="text-green-400 font-semibold">
                                                {service.price}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-sm">
                                                Available Students:
                                            </span>
                                            <span className="text-blue-400 font-semibold">
                                                {service.students}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mt-auto">
                                        View Details
                                        <FaArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Choose AXION?
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We combine professional expertise with student
                            innovation to deliver exceptional results.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                Quality Guaranteed
                            </h3>
                            <p className="text-gray-400">
                                Every project goes through our quality assurance
                                process to ensure exceptional results.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaClock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                Timely Delivery
                            </h3>
                            <p className="text-gray-400">
                                We respect deadlines and ensure your projects
                                are delivered on time, every time.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaDollarSign className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                Affordable Pricing
                            </h3>
                            <p className="text-gray-400">
                                Competitive rates with flexible payment options
                                to suit your budget.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Start Your Project?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Get in touch with our team and let's bring your ideas to
                        life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                        >
                            Get Started Today
                        </Link>
                        <a
                            href="#contact"
                            className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
