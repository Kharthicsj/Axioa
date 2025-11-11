import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaMobile,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaClock,
    FaDollarSign,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaApple,
    FaAndroid,
    FaReact,
    FaCode,
    FaDatabase,
    FaCloud,
    FaRocket,
} from "react-icons/fa";
import Header from "../../components/Header";

const AppDevelopment = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const features = [
        "Native iOS & Android Development",
        "Cross-Platform Development (React Native, Flutter)",
        "UI/UX Design & Prototyping",
        "Backend API Development",
        "Real-time Features (Chat, Notifications)",
        "Payment Gateway Integration",
        "Social Media Integration",
        "Offline Functionality",
        "App Store Optimization",
        "Analytics & Crash Reporting",
        "Push Notifications",
        "App Store Deployment",
    ];

    const platforms = [
        {
            name: "iOS",
            icon: <FaApple className="text-white" />,
            color: "border-gray-300",
        },
        {
            name: "Android",
            icon: <FaAndroid className="text-green-400" />,
            color: "border-green-400",
        },
        {
            name: "React Native",
            icon: <FaReact className="text-blue-400" />,
            color: "border-blue-400",
        },
        {
            name: "Flutter",
            icon: <FaCode className="text-blue-500" />,
            color: "border-blue-500",
        },
        {
            name: "Firebase",
            icon: <FaDatabase className="text-yellow-400" />,
            color: "border-yellow-400",
        },
        {
            name: "AWS",
            icon: <FaCloud className="text-orange-400" />,
            color: "border-orange-400",
        },
    ];

    const packages = [
        {
            name: "Basic App",
            price: "₹25,000",
            duration: "2-3 weeks",
            features: [
                "Single platform (iOS or Android)",
                "Up to 5 screens",
                "Basic functionality",
                "Simple UI/UX design",
                "Basic backend integration",
                "App store submission",
                "1 month free support",
            ],
            popular: false,
        },
        {
            name: "Business App",
            price: "₹65,000",
            duration: "4-6 weeks",
            features: [
                "Cross-platform (iOS & Android)",
                "Up to 15 screens",
                "Advanced features",
                "Custom UI/UX design",
                "Complete backend solution",
                "Push notifications",
                "Analytics integration",
                "3 months free support",
            ],
            popular: true,
        },
        {
            name: "Enterprise App",
            price: "₹1,50,000",
            duration: "8-12 weeks",
            features: [
                "Multi-platform deployment",
                "Unlimited screens",
                "Complex business logic",
                "Advanced security features",
                "Real-time functionality",
                "Third-party integrations",
                "Admin dashboard",
                "6 months free support",
            ],
            popular: false,
        },
    ];

    const portfolio = [
        {
            title: "Food Delivery App",
            description:
                "Complete food ordering app with real-time tracking and payment integration",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
            tech: ["React Native", "Node.js", "MongoDB"],
        },
        {
            title: "Fitness Tracking App",
            description:
                "Health and fitness app with workout plans and progress tracking",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            tech: ["Flutter", "Firebase", "Healthcare APIs"],
        },
        {
            title: "E-learning Platform",
            description:
                "Educational app with video streaming and interactive quizzes",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
            tech: ["Native iOS/Android", "AWS", "Video SDK"],
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
                        <span className="text-white">App Development</span>
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

                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                                <FaMobile className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                App Development
                                <span className="block text-2xl md:text-3xl text-purple-400 mt-2">
                                    Native. Cross-Platform. Powerful.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                Bring your ideas to mobile with cutting-edge app
                                development. From concept to app store, we
                                create engaging mobile experiences that users
                                love and businesses depend on.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/app-development/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                                >
                                    Start Your App
                                </button>
                                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    View Apps
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-purple-400 mb-2">
                                            35+
                                        </div>
                                        <div className="text-gray-400">
                                            Apps Published
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-pink-400 mb-2">
                                            4.8/5
                                        </div>
                                        <div className="text-gray-400">
                                            App Store Rating
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-purple-400 mb-2">
                                            100K+
                                        </div>
                                        <div className="text-gray-400">
                                            Downloads
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-pink-400 mb-2">
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
                            App Development Services
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            End-to-end mobile app development services for all
                            platforms and business needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                            >
                                <FaCheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Platforms Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Platforms & Technologies
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We develop for all major platforms using the latest
                            technologies and frameworks
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {platforms.map((platform, index) => (
                            <div
                                key={index}
                                className={`p-6 bg-gray-800/50 rounded-xl border-2 ${platform.color} hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 text-center`}
                            >
                                <div className="text-4xl mb-3 flex justify-center">
                                    {platform.icon}
                                </div>
                                <div className="font-semibold text-gray-300">
                                    {platform.name}
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
                            App Development Pricing
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional mobile app development services for iOS
                            and Android
                        </p>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Custom Mobile App Development
                                </h3>
                                <div className="text-5xl font-bold text-purple-400 mb-6">
                                    ₹25,000 - ₹1,50,000
                                </div>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Our mobile app development services cover
                                    both native iOS/Android and cross-platform
                                    solutions using React Native and Flutter. We
                                    create user-friendly mobile applications
                                    with modern UI/UX design, robust backend
                                    integration, and comprehensive app store
                                    optimization.
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/app-development/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                                >
                                    Assign Project
                                </button>
                            </div>

                            {/* Right Visual */}
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 lg:p-12 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-r-2xl"></div>
                                <div className="text-center relative z-10">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <FaMobile className="text-3xl text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-6">
                                        App Performance
                                    </h4>
                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaRocket className="text-purple-400" />
                                                Apps Launched
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                75+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaStar className="text-purple-400" />
                                                App Store Rating
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                4.8⭐
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaCheckCircle className="text-purple-400" />
                                                Crash Rate
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                &lt;0.1%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaUsers className="text-purple-400" />
                                                User Retention
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                85%
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
                            Featured Apps
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Check out some of our successful mobile app projects
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
                                                className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
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
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Launch Your App?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Let's turn your app idea into reality with our expert
                        development team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
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

export default AppDevelopment;
