import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaPaintBrush,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaClock,
    FaDollarSign,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaDesktop,
    FaMobile,
    FaTablet,
    FaSketch,
    FaFigma,
    FaUser,
    FaEye,
    FaPalette,
} from "react-icons/fa";
import Header from "../../components/Header";

const UIUXDesign = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const services = [
        "User Interface (UI) Design",
        "User Experience (UX) Design",
        "Wireframe & Prototyping",
        "Mobile App Design",
        "Web Application Design",
        "Responsive Design",
        "User Research & Testing",
        "Design System Creation",
        "Brand Identity Design",
        "Landing Page Design",
        "Dashboard Design",
        "Interaction Design",
    ];

    const tools = [
        {
            name: "Figma",
            icon: <FaFigma className="text-purple-400" />,
            color: "border-purple-400",
        },
        {
            name: "Adobe XD",
            icon: <FaPalette className="text-pink-400" />,
            color: "border-pink-400",
        },
        {
            name: "Sketch",
            icon: <FaSketch className="text-yellow-400" />,
            color: "border-yellow-400",
        },
        {
            name: "InVision",
            icon: <FaDesktop className="text-red-400" />,
            color: "border-red-400",
        },
        {
            name: "Principle",
            icon: <FaMobile className="text-blue-400" />,
            color: "border-blue-400",
        },
        {
            name: "Framer",
            icon: <FaTablet className="text-green-400" />,
            color: "border-green-400",
        },
    ];

    const packages = [
        {
            name: "UI Basic",
            price: "₹3,000",
            duration: "3-5 days",
            features: [
                "5-8 screen designs",
                "Mobile-first approach",
                "Basic wireframes",
                "Style guide",
                "2 design revisions",
                "Final design files",
                "Email support",
            ],
            popular: false,
        },
        {
            name: "UX/UI Complete",
            price: "₹8,000",
            duration: "1-2 weeks",
            features: [
                "User research & personas",
                "10-15 screen designs",
                "Interactive prototypes",
                "Responsive design",
                "User flow diagrams",
                "Design system",
                "5 design revisions",
                "Developer handoff",
                "Priority support",
            ],
            popular: true,
        },
        {
            name: "Enterprise Design",
            price: "₹20,000",
            duration: "3-4 weeks",
            features: [
                "Complete UX research",
                "Unlimited screens",
                "Advanced prototyping",
                "User testing sessions",
                "Design system library",
                "Accessibility compliance",
                "Unlimited revisions",
                "Project management",
                "Dedicated designer",
                "Post-launch support",
            ],
            popular: false,
        },
    ];

    const portfolio = [
        {
            title: "E-commerce Mobile App",
            description:
                "Modern shopping app with intuitive navigation and seamless checkout experience",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
            category: "Mobile App",
            screens: "15 Screens",
        },
        {
            title: "SaaS Dashboard Design",
            description:
                "Clean and data-driven dashboard with advanced analytics and reporting features",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
            category: "Web App",
            screens: "25 Screens",
        },
        {
            title: "Healthcare Platform",
            description:
                "User-friendly patient management system with appointment booking and telemedicine",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
            category: "Healthcare",
            screens: "30 Screens",
        },
    ];

    const designProcess = [
        {
            step: "01",
            title: "Research & Discovery",
            description:
                "Understanding user needs, market analysis, and competitor research",
            icon: <FaUser className="w-6 h-6 text-purple-400" />,
        },
        {
            step: "02",
            title: "Wireframing",
            description:
                "Creating low-fidelity layouts and information architecture",
            icon: <FaDesktop className="w-6 h-6 text-blue-400" />,
        },
        {
            step: "03",
            title: "UI Design",
            description:
                "High-fidelity visual designs with brand consistency and aesthetics",
            icon: <FaPaintBrush className="w-6 h-6 text-pink-400" />,
        },
        {
            step: "04",
            title: "Prototyping",
            description:
                "Interactive prototypes for user testing and stakeholder feedback",
            icon: <FaMobile className="w-6 h-6 text-green-400" />,
        },
        {
            step: "05",
            title: "Testing & Iteration",
            description:
                "User testing, feedback incorporation, and design refinement",
            icon: <FaEye className="w-6 h-6 text-orange-400" />,
        },
        {
            step: "06",
            title: "Handoff",
            description:
                "Developer-ready assets, style guides, and documentation",
            icon: <FaCheckCircle className="w-6 h-6 text-teal-400" />,
        },
    ];

    const testimonials = [
        {
            name: "Rahul Sharma",
            company: "TechStart Solutions",
            rating: 5,
            comment:
                "Exceptional UI/UX design that transformed our user engagement. The team understood our vision perfectly and delivered beyond expectations.",
        },
        {
            name: "Priya Patel",
            company: "HealthCare Plus",
            rating: 5,
            comment:
                "Outstanding work on our patient portal design. The user experience is now seamless and patients love the new interface.",
        },
        {
            name: "Amit Kumar",
            company: "E-Shop Pro",
            rating: 5,
            comment:
                "The mobile app design increased our conversion rate by 40%. Professional team with great attention to detail.",
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
                        <span className="text-white">UI/UX Design</span>
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
                                <FaPaintBrush className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                UI/UX Design
                                <span className="block text-2xl md:text-3xl text-purple-400 mt-2">
                                    Beautiful. Intuitive. User-Centered.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                Create stunning user interfaces and exceptional
                                user experiences that engage, convert, and
                                delight your users. From wireframes to final
                                designs.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/ui-ux-design/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                                >
                                    Start Your Design
                                </button>
                                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    View Portfolio
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-purple-400 mb-2">
                                            150+
                                        </div>
                                        <div className="text-gray-400">
                                            Designs Created
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-pink-400 mb-2">
                                            98%
                                        </div>
                                        <div className="text-gray-400">
                                            Client Satisfaction
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-purple-400 mb-2">
                                            50+
                                        </div>
                                        <div className="text-gray-400">
                                            Apps Designed
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-pink-400 mb-2">
                                            24h
                                        </div>
                                        <div className="text-gray-400">
                                            Avg Response
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Design Services
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Comprehensive UI/UX design solutions for web and
                            mobile applications
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                            >
                                <FaCheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-gray-300">{service}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Design Process */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our Design Process
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            A systematic approach to creating exceptional user
                            experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {designProcess.map((process, index) => (
                            <div
                                key={index}
                                className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {process.step}
                                    </div>
                                    <div className="p-2 bg-gray-700/50 rounded-lg">
                                        {process.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {process.title}
                                </h3>
                                <p className="text-gray-400">
                                    {process.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tools Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Design Tools We Use
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Industry-leading design tools for creating
                            exceptional user experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {tools.map((tool, index) => (
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

            {/* Pricing Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            UI/UX Design Pricing
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional user interface and user experience
                            design services
                        </p>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Custom UI/UX Design Services
                                </h3>
                                <div className="text-5xl font-bold text-purple-400 mb-6">
                                    ₹3,000 - ₹20,000
                                </div>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Our UI/UX design services create beautiful,
                                    intuitive, and user-centered digital
                                    experiences. We provide complete design
                                    solutions from user research and wireframing
                                    to high-fidelity prototypes and design
                                    systems. Using tools like Figma, Adobe XD,
                                    and Sketch, we ensure exceptional user
                                    experiences.
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/ui-ux-design/students"
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
                                        <FaPaintBrush className="text-3xl text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-6">
                                        Design Impact
                                    </h4>
                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaDesktop className="text-purple-400" />
                                                Designs Created
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                300+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaUsers className="text-purple-400" />
                                                User Satisfaction
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                92%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaEye className="text-purple-400" />
                                                Conversion Boost
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                +45%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaStar className="text-purple-400" />
                                                Design Awards
                                            </span>
                                            <span className="text-purple-400 font-bold text-lg">
                                                12
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
                            Design Portfolio
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Explore our recent UI/UX design projects across
                            various industries
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
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                                                {project.category}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {project.screens}
                                            </span>
                                        </div>
                                        <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                                            <FaEye className="w-4 h-4" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Client Testimonials
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            What our clients say about our UI/UX design services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <FaStar
                                                key={i}
                                                className="w-4 h-4 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>
                                <p className="text-gray-300 mb-4 italic">
                                    "{testimonial.comment}"
                                </p>
                                <div>
                                    <div className="font-bold text-white">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-purple-400 text-sm">
                                        {testimonial.company}
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
                        Ready to Transform Your User Experience?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Let's create beautiful, intuitive designs that your
                        users will love and remember.
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

export default UIUXDesign;
