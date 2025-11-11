import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaCode,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaClock,
    FaDollarSign,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaReact,
    FaNodeJs,
    FaDatabase,
    FaMobile,
    FaSearch,
    FaRocket,
} from "react-icons/fa";
import Header from "../../components/Header";

const WebDevelopment = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const features = [
        "Custom Website Design",
        "Responsive Mobile-First Design",
        "Modern JavaScript Frameworks (React, Next.js, Vue.js)",
        "Backend Development (Node.js, Express, MongoDB)",
        "E-commerce Integration",
        "Content Management Systems",
        "SEO Optimization",
        "Progressive Web Apps (PWA)",
        "API Development & Integration",
        "Database Design & Management",
        "Payment Gateway Integration",
        "Cloud Hosting & Deployment",
    ];

    const technologies = [
        {
            name: "React.js",
            icon: <FaReact className="text-blue-400" />,
            color: "border-blue-400",
        },
        {
            name: "Node.js",
            icon: <FaNodeJs className="text-green-400" />,
            color: "border-green-400",
        },
        {
            name: "MongoDB",
            icon: <FaDatabase className="text-green-500" />,
            color: "border-green-500",
        },
        {
            name: "Next.js",
            icon: <FaCode className="text-white" />,
            color: "border-white",
        },
        {
            name: "Express.js",
            icon: <FaCode className="text-yellow-400" />,
            color: "border-yellow-400",
        },
        {
            name: "Tailwind CSS",
            icon: <FaCode className="text-cyan-400" />,
            color: "border-cyan-400",
        },
    ];

    const packages = [
        {
            name: "Basic Website",
            price: "₹15,000",
            duration: "1-2 weeks",
            features: [
                "5-page responsive website",
                "Modern design",
                "Mobile optimization",
                "Basic SEO setup",
                "Contact form integration",
                "1 month free support",
            ],
            popular: false,
        },
        {
            name: "Business Website",
            price: "₹35,000",
            duration: "2-3 weeks",
            features: [
                "10-page responsive website",
                "Custom design & branding",
                "CMS integration",
                "Advanced SEO optimization",
                "E-commerce ready",
                "Analytics integration",
                "3 months free support",
            ],
            popular: true,
        },
        {
            name: "E-commerce Platform",
            price: "₹75,000",
            duration: "4-6 weeks",
            features: [
                "Full e-commerce solution",
                "Product catalog management",
                "Payment gateway integration",
                "Inventory management",
                "Customer dashboard",
                "Admin panel",
                "6 months free support",
            ],
            popular: false,
        },
    ];

    const portfolio = [
        {
            title: "E-commerce Fashion Store",
            description:
                "Modern online store with advanced filtering and payment integration",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
            tech: ["React", "Node.js", "MongoDB"],
        },
        {
            title: "Restaurant Management System",
            description:
                "Complete restaurant website with online ordering and table booking",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
            tech: ["Next.js", "Express", "PostgreSQL"],
        },
        {
            title: "Real Estate Platform",
            description:
                "Property listing website with advanced search and filters",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
            tech: ["Vue.js", "Laravel", "MySQL"],
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
                        <span className="text-white">Web Development</span>
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

                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                                <FaCode className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Web Development
                                <span className="block text-2xl md:text-3xl text-green-400 mt-2">
                                    Modern. Responsive. Scalable.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                Transform your business with custom web
                                applications built using cutting-edge
                                technologies. From simple websites to complex
                                web platforms, we deliver solutions that drive
                                results.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/web-development/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                                >
                                    Start Your Project
                                </button>
                                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    View Portfolio
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-3xl"></div>
                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-green-400 mb-2">
                                            50+
                                        </div>
                                        <div className="text-gray-400">
                                            Projects Completed
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-emerald-400 mb-2">
                                            4.9/5
                                        </div>
                                        <div className="text-gray-400">
                                            Client Rating
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-green-400 mb-2">
                                            30+
                                        </div>
                                        <div className="text-gray-400">
                                            Happy Clients
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-emerald-400 mb-2">
                                            24/7
                                        </div>
                                        <div className="text-gray-400">
                                            Support
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
                            What We Offer
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Comprehensive web development services to bring your
                            vision to life
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                            >
                                <FaCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Technologies Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Technologies We Use
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We work with the latest and most reliable
                            technologies to ensure your project's success
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {technologies.map((tech, index) => (
                            <div
                                key={index}
                                className={`p-6 bg-gray-800/50 rounded-xl border-2 ${tech.color} hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 text-center`}
                            >
                                <div className="text-4xl mb-3 flex justify-center">
                                    {tech.icon}
                                </div>
                                <div className="font-semibold text-gray-300">
                                    {tech.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Web Development Pricing
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional web development services tailored to
                            your business needs
                        </p>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Custom Web Development
                                </h3>
                                <div className="text-5xl font-bold text-green-400 mb-6">
                                    ₹15,000 - ₹75,000
                                </div>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Our web development services range from
                                    simple business websites to complex
                                    e-commerce platforms. We create modern,
                                    responsive, and SEO-optimized websites using
                                    the latest technologies like React, Next.js,
                                    and Node.js. Every project includes mobile
                                    optimization and fast loading times.
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/web-development/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                                >
                                    Assign Project
                                </button>
                            </div>

                            {/* Right Visual */}
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 lg:p-12 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-r-2xl"></div>
                                <div className="text-center relative z-10">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <FaCode className="text-3xl text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-6">
                                        Development Stats
                                    </h4>
                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaRocket className="text-green-400" />
                                                Websites Built
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                150+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaReact className="text-green-400" />
                                                Technologies Used
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                25+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaRocket className="text-green-400" />
                                                Page Load Speed
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                &lt;2s
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaStar className="text-green-400" />
                                                Client Satisfaction
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                98%
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
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our Recent Work
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Take a look at some of our successful web
                            development projects
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
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-900/20 to-emerald-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Build Your Website?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Let's discuss your project and create something amazing
                        together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
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

export default WebDevelopment;
