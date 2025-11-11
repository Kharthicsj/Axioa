import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaFileAlt,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaClock,
    FaDollarSign,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaLinkedin,
    FaBriefcase,
    FaGraduationCap,
    FaEdit,
    FaSearch,
    FaDownload,
} from "react-icons/fa";
import Header from "../../components/Header";

const ResumeServices = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const features = [
        "ATS-Optimized Templates",
        "Keyword Optimization",
        "Industry-Specific Formatting",
        "Professional Summary Writing",
        "Skills & Achievements Highlighting",
        "LinkedIn Profile Optimization",
        "Cover Letter Creation",
        "Multiple Format Options (PDF, DOC)",
        "Unlimited Revisions",
        "Career Consultation",
        "Interview Preparation Tips",
        "Job Search Strategy",
    ];

    const resumeTypes = [
        {
            name: "Freshers",
            icon: <FaGraduationCap className="text-blue-400" />,
            color: "border-blue-400",
        },
        {
            name: "Experienced",
            icon: <FaBriefcase className="text-green-400" />,
            color: "border-green-400",
        },
        {
            name: "Executive",
            icon: <FaStar className="text-yellow-400" />,
            color: "border-yellow-400",
        },
        {
            name: "Technical",
            icon: <FaEdit className="text-purple-400" />,
            color: "border-purple-400",
        },
        {
            name: "Creative",
            icon: <FaEdit className="text-pink-400" />,
            color: "border-pink-400",
        },
        {
            name: "Academic",
            icon: <FaGraduationCap className="text-indigo-400" />,
            color: "border-indigo-400",
        },
    ];

    const packages = [
        {
            name: "Basic Resume",
            price: "₹999",
            duration: "1-2 days",
            features: [
                "1-page professional resume",
                "ATS-friendly format",
                "Basic keyword optimization",
                "2 revisions included",
                "PDF format delivery",
                "24-hour delivery",
                "Email support",
            ],
            popular: false,
        },
        {
            name: "Professional Package",
            price: "₹1,999",
            duration: "2-3 days",
            features: [
                "2-page detailed resume",
                "Custom template design",
                "Advanced keyword optimization",
                "LinkedIn profile optimization",
                "Cover letter included",
                "5 revisions included",
                "Multiple format delivery",
                "Priority support",
            ],
            popular: true,
        },
        {
            name: "Executive Package",
            price: "₹3,999",
            duration: "3-5 days",
            features: [
                "Multi-page executive resume",
                "Premium template design",
                "Industry-specific optimization",
                "LinkedIn profile makeover",
                "Custom cover letter",
                "Thank you letter template",
                "Unlimited revisions",
                "Career consultation call",
                "Interview preparation guide",
            ],
            popular: false,
        },
    ];

    const portfolio = [
        {
            title: "Software Engineer Resume",
            description:
                "ATS-optimized resume for a senior software engineer with 5+ years experience",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
            category: "Technical",
        },
        {
            title: "Marketing Manager Resume",
            description:
                "Executive-level resume highlighting leadership and marketing achievements",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
            category: "Executive",
        },
        {
            title: "Fresh Graduate Resume",
            description:
                "Entry-level resume showcasing academic projects and internship experience",
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
            category: "Fresher",
        },
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Software Developer",
            company: "Microsoft",
            rating: 5,
            feedback:
                "Got 3 interview calls within a week of using my new resume. Highly recommend!",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b412?w=60&h=60&fit=crop&crop=face",
        },
        {
            name: "Rahul Kumar",
            role: "Marketing Manager",
            company: "Amazon",
            rating: 5,
            feedback:
                "Professional service with quick turnaround. Landed my dream job!",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
        },
        {
            name: "Anjali Patel",
            role: "Data Analyst",
            company: "Google",
            rating: 5,
            feedback:
                "ATS-optimized resume helped me pass the initial screening. Excellent work!",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
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
                        <span className="text-white">Resume Development</span>
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

                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                                <FaFileAlt className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                ATS Friendly Resume
                                <span className="block text-2xl md:text-3xl text-blue-400 mt-2">
                                    Professional. Optimized. Results-Driven.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                Land your dream job with professionally crafted,
                                ATS-optimized resumes. Our expert writers create
                                compelling resumes that pass automated screening
                                and impress hiring managers.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/resume-services/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                                >
                                    Order Your Resume
                                </button>
                                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    View Samples
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"></div>
                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-blue-400 mb-2">
                                            500+
                                        </div>
                                        <div className="text-gray-400">
                                            Resumes Created
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-cyan-400 mb-2">
                                            95%
                                        </div>
                                        <div className="text-gray-400">
                                            Success Rate
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-blue-400 mb-2">
                                            300+
                                        </div>
                                        <div className="text-gray-400">
                                            Job Placements
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-cyan-400 mb-2">
                                            24hrs
                                        </div>
                                        <div className="text-gray-400">
                                            Quick Delivery
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
                            Why Choose Our Resume Services?
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional resume writing services that get you
                            noticed by employers and ATS systems
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                            >
                                <FaCheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resume Types Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Resume Types We Create
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Specialized resumes tailored to different career
                            levels and industries
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {resumeTypes.map((type, index) => (
                            <div
                                key={index}
                                className={`p-6 bg-gray-800/50 rounded-xl border-2 ${type.color} hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 text-center`}
                            >
                                <div className="text-4xl mb-3 flex justify-center">
                                    {type.icon}
                                </div>
                                <div className="font-semibold text-gray-300">
                                    {type.name}
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
                            Resume Services Pricing
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional ATS-friendly resume development
                            services for all career levels
                        </p>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    ATS-Friendly Resume Development
                                </h3>
                                <div className="text-5xl font-bold text-blue-400 mb-6">
                                    ₹999 - ₹3,999
                                </div>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Our resume writing services are designed to
                                    help you land your dream job with
                                    ATS-optimized formatting, keyword
                                    optimization, and professional templates. We
                                    create compelling resumes that highlight
                                    your skills and achievements while ensuring
                                    they pass through Applicant Tracking
                                    Systems.
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/resume-services/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                                >
                                    Assign Project
                                </button>
                            </div>

                            {/* Right Visual */}
                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 lg:p-12 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-r-2xl"></div>
                                <div className="text-center relative z-10">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <FaFileAlt className="text-3xl text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-6">
                                        Success Metrics
                                    </h4>
                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaEdit className="text-blue-400" />
                                                Resumes Created
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                2000+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaBriefcase className="text-blue-400" />
                                                Interview Rate
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                85%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaCheckCircle className="text-blue-400" />
                                                ATS Pass Rate
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                95%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaStar className="text-blue-400" />
                                                Job Success Rate
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                78%
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
                            Resume Samples
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Check out some of our professionally crafted resume
                            samples
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {portfolio.map((sample, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div className="aspect-video bg-gray-700 overflow-hidden">
                                    <img
                                        src={sample.image}
                                        alt={sample.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {sample.title}
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        {sample.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                            {sample.category}
                                        </span>
                                        <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                                            <FaDownload className="w-4 h-4" />
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Success Stories
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Hear from our clients who landed their dream jobs
                            with our resumes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {testimonial.role} at{" "}
                                            {testimonial.company}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <FaStar
                                                key={i}
                                                className="w-4 h-4 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>
                                <p className="text-gray-300 italic">
                                    "{testimonial.feedback}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Get your professionally crafted, ATS-optimized resume
                        today and start getting more interviews.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
                            <FaPhone className="w-4 h-4" />
                            Call Now: +91 9876543210
                        </button>
                        <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
                            <FaWhatsapp className="w-4 h-4" />
                            WhatsApp Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeServices;
