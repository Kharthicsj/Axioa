import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaEdit,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaClock,
    FaDollarSign,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaPen,
    FaNewspaper,
    FaBlog,
    FaSearch,
    FaGlobe,
    FaFileAlt,
    FaEye,
    FaDownload,
} from "react-icons/fa";
import Header from "../../components/Header";

const ContentWriting = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const services = [
        "Blog Writing & Articles",
        "SEO Content Creation",
        "Website Copy & Content",
        "Social Media Content",
        "Product Descriptions",
        "Email Marketing Content",
        "Technical Writing",
        "Creative Writing",
        "Press Releases",
        "Case Studies",
        "White Papers",
        "Content Strategy",
    ];

    const contentTypes = [
        {
            title: "Blog Writing",
            description:
                "Engaging blog posts that drive traffic and build authority",
            icon: <FaBlog className="w-8 h-8 text-blue-400" />,
            features: [
                "SEO optimized",
                "Research-based",
                "Engaging tone",
                "CTA integration",
            ],
        },
        {
            title: "Website Content",
            description:
                "Compelling web copy that converts visitors into customers",
            icon: <FaGlobe className="w-8 h-8 text-green-400" />,
            features: [
                "Conversion focused",
                "Brand voice",
                "User-friendly",
                "Mobile optimized",
            ],
        },
        {
            title: "SEO Articles",
            description:
                "Keyword-rich articles that rank high in search results",
            icon: <FaSearch className="w-8 h-8 text-purple-400" />,
            features: [
                "Keyword research",
                "Meta descriptions",
                "Internal linking",
                "SERP optimization",
            ],
        },
        {
            title: "Technical Writing",
            description: "Clear and concise technical documentation and guides",
            icon: <FaFileAlt className="w-8 h-8 text-orange-400" />,
            features: [
                "User manuals",
                "API documentation",
                "How-to guides",
                "Process documentation",
            ],
        },
    ];

    const packages = [
        {
            name: "Starter Package",
            price: "₹1,500",
            duration: "2-3 days",
            features: [
                "5 blog posts (500 words each)",
                "Basic SEO optimization",
                "Keyword research included",
                "2 revisions per article",
                "Meta descriptions",
                "Plagiarism-free content",
                "Email support",
            ],
            popular: false,
        },
        {
            name: "Professional Package",
            price: "₹4,000",
            duration: "5-7 days",
            features: [
                "10 articles (800 words each)",
                "Advanced SEO optimization",
                "Comprehensive keyword research",
                "5 revisions per article",
                "Social media snippets",
                "Content calendar",
                "Image suggestions",
                "Priority support",
            ],
            popular: true,
        },
        {
            name: "Enterprise Package",
            price: "₹10,000",
            duration: "2-3 weeks",
            features: [
                "25+ articles (1000+ words each)",
                "Complete content strategy",
                "Competitor analysis",
                "Unlimited revisions",
                "Social media content",
                "Email sequences",
                "Content performance tracking",
                "Dedicated content manager",
                "Monthly strategy calls",
            ],
            popular: false,
        },
    ];

    const portfolio = [
        {
            title: "Tech Startup Blog Series",
            description:
                "20-article series on AI and machine learning trends that increased organic traffic by 300%",
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
            category: "Tech Blog",
            wordCount: "15,000+ words",
        },
        {
            title: "E-commerce Product Descriptions",
            description:
                "500+ product descriptions for fashion e-commerce site resulting in 25% higher conversion rates",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
            category: "E-commerce",
            wordCount: "50,000+ words",
        },
        {
            title: "Healthcare Content Hub",
            description:
                "Comprehensive health and wellness content library with medically accurate information",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
            category: "Healthcare",
            wordCount: "30,000+ words",
        },
    ];

    const writingProcess = [
        {
            step: "01",
            title: "Research & Planning",
            description:
                "Thorough research on your industry, audience, and competitors",
            icon: <FaSearch className="w-6 h-6 text-blue-400" />,
        },
        {
            step: "02",
            title: "Content Strategy",
            description:
                "Developing a comprehensive content strategy aligned with your goals",
            icon: <FaFileAlt className="w-6 h-6 text-green-400" />,
        },
        {
            step: "03",
            title: "Writing & Creation",
            description:
                "Crafting high-quality, engaging content that resonates with your audience",
            icon: <FaPen className="w-6 h-6 text-purple-400" />,
        },
        {
            step: "04",
            title: "SEO Optimization",
            description:
                "Optimizing content for search engines while maintaining readability",
            icon: <FaSearch className="w-6 h-6 text-orange-400" />,
        },
        {
            step: "05",
            title: "Review & Revision",
            description:
                "Multiple rounds of editing and client feedback incorporation",
            icon: <FaEdit className="w-6 h-6 text-cyan-400" />,
        },
        {
            step: "06",
            title: "Delivery & Support",
            description:
                "Final content delivery with ongoing support and performance tracking",
            icon: <FaCheckCircle className="w-6 h-6 text-teal-400" />,
        },
    ];

    const industries = [
        "Technology & SaaS",
        "Healthcare & Wellness",
        "Finance & FinTech",
        "E-commerce & Retail",
        "Real Estate",
        "Education & E-learning",
        "Travel & Hospitality",
        "Food & Beverage",
        "Fashion & Lifestyle",
        "B2B Services",
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            company: "TechVenture Inc.",
            rating: 5,
            comment:
                "Outstanding content quality! Our blog traffic increased by 250% within 3 months. The team understands our industry perfectly.",
        },
        {
            name: "Rohit Sharma",
            company: "E-Shop Pro",
            rating: 5,
            comment:
                "The product descriptions were game-changing. Our conversion rate improved significantly, and customers love the detailed content.",
        },
        {
            name: "Lisa Chen",
            company: "HealthFirst Clinic",
            rating: 5,
            comment:
                "Professional, accurate, and engaging healthcare content. They made complex medical topics accessible to our patients.",
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
                        <span className="text-white">Content Writing</span>
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

                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                                <FaEdit className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Content Writing
                                <span className="block text-2xl md:text-3xl text-green-400 mt-2">
                                    Words That Convert. Stories That Engage.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                Professional content writing services that drive
                                traffic, engage audiences, and convert readers
                                into customers. From blogs to web copy, we craft
                                words that work.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/content-writing/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                                >
                                    Start Writing Project
                                </button>
                                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    View Samples
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 blur-3xl"></div>
                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-green-400 mb-2">
                                            1M+
                                        </div>
                                        <div className="text-gray-400">
                                            Words Written
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-teal-400 mb-2">
                                            500+
                                        </div>
                                        <div className="text-gray-400">
                                            Articles Published
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-green-400 mb-2">
                                            98%
                                        </div>
                                        <div className="text-gray-400">
                                            Client Satisfaction
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-teal-400 mb-2">
                                            24h
                                        </div>
                                        <div className="text-gray-400">
                                            Avg Delivery
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
                            Content Writing Services
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Comprehensive content solutions for all your
                            business needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                            >
                                <FaCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-gray-300">{service}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Types */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Content Specializations
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Specialized content types tailored to your specific
                            business needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {contentTypes.map((type, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-gray-700/50 rounded-lg">
                                        {type.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        {type.title}
                                    </h3>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    {type.description}
                                </p>
                                <div className="space-y-2">
                                    {type.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2"
                                        >
                                            <FaCheckCircle className="w-3 h-3 text-green-400" />
                                            <span className="text-gray-300 text-sm">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Writing Process */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our Writing Process
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            A systematic approach to creating content that
                            delivers results
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {writingProcess.map((process, index) => (
                            <div
                                key={index}
                                className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
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

            {/* Industries Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Industries We Serve
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Expert content writing across various industries and
                            niches
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {industries.map((industry, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 text-center"
                            >
                                <span className="text-gray-300 text-sm">
                                    {industry}
                                </span>
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
                            Content Writing Pricing
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional content writing and SEO services
                        </p>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Expert Content Writing Services
                                </h3>
                                <div className="text-5xl font-bold text-green-400 mb-6">
                                    ₹500 - ₹5,000
                                </div>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Elevate your brand with compelling,
                                    SEO-optimized content that drives engagement
                                    and conversions. Our content writing
                                    services include blog posts, website copy,
                                    social media content, product descriptions,
                                    and email campaigns that resonate with your
                                    target audience.
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/content-writing/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                                >
                                    Assign Project
                                </button>
                            </div>

                            {/* Right Visual */}
                            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-8 lg:p-12 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-r-2xl"></div>
                                <div className="text-center relative z-10">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <FaEdit className="text-3xl text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-6">
                                        Content Impact
                                    </h4>
                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaPen className="text-green-400" />
                                                Articles Written
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                1500+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaSearch className="text-green-400" />
                                                SEO Score
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                95+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaEye className="text-green-400" />
                                                Engagement Rate
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                +40%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaUsers className="text-green-400" />
                                                Client Retention
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                90%
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
                            Content Portfolio
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Examples of our successful content writing projects
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
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                                {project.category}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {project.wordCount}
                                            </span>
                                        </div>
                                        <button className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2">
                                            <FaEye className="w-4 h-4" />
                                            Read
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Client Success Stories
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            What our clients say about our content writing
                            services
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
                                    <div className="text-green-400 text-sm">
                                        {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-900/20 to-teal-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Content Strategy?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Let's create compelling content that engages your
                        audience and drives results.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
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

export default ContentWriting;
