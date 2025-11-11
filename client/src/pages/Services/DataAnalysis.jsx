import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaChartBar,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaClock,
    FaDollarSign,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaDatabase,
    FaTable,
    FaChartLine,
    FaChartPie,
    FaBrain,
    FaCalculator,
    FaEye,
    FaDownload,
} from "react-icons/fa";
import Header from "../../components/Header";

const DataAnalysis = () => {
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const services = [
        "Data Collection & Cleaning",
        "Statistical Analysis",
        "Data Visualization",
        "Predictive Modeling",
        "Machine Learning Solutions",
        "Business Intelligence Reports",
        "Market Research Analysis",
        "Performance Analytics",
        "Trend Analysis",
        "Custom Dashboards",
        "A/B Testing Analysis",
        "Data Mining & Insights",
    ];

    const tools = [
        {
            name: "Python",
            icon: <FaDatabase className="text-yellow-400" />,
            color: "border-yellow-400",
        },
        {
            name: "R",
            icon: <FaChartBar className="text-blue-400" />,
            color: "border-blue-400",
        },
        {
            name: "SQL",
            icon: <FaTable className="text-orange-400" />,
            color: "border-orange-400",
        },
        {
            name: "Excel",
            icon: <FaCalculator className="text-green-400" />,
            color: "border-green-400",
        },
        {
            name: "Tableau",
            icon: <FaChartPie className="text-purple-400" />,
            color: "border-purple-400",
        },
        {
            name: "Power BI",
            icon: <FaChartLine className="text-red-400" />,
            color: "border-red-400",
        },
    ];

    const packages = [
        {
            name: "Basic Analysis",
            price: "₹5,000",
            duration: "3-5 days",
            features: [
                "Data cleaning & preparation",
                "Descriptive statistics",
                "Basic visualizations",
                "Summary report (5-10 pages)",
                "2 rounds of revisions",
                "Raw data insights",
                "Email support",
            ],
            popular: false,
        },
        {
            name: "Advanced Analytics",
            price: "₹12,000",
            duration: "1-2 weeks",
            features: [
                "Complete data pipeline",
                "Advanced statistical analysis",
                "Interactive dashboards",
                "Predictive modeling",
                "Comprehensive report (15-25 pages)",
                "Business recommendations",
                "5 rounds of revisions",
                "Video presentation",
                "Priority support",
            ],
            popular: true,
        },
        {
            name: "Enterprise Solution",
            price: "₹25,000",
            duration: "3-4 weeks",
            features: [
                "Multi-source data integration",
                "Machine learning models",
                "Real-time dashboards",
                "Automated reporting",
                "Custom analytics platform",
                "Team training session",
                "Unlimited revisions",
                "6-month support",
                "Dedicated analyst",
                "API integration",
            ],
            popular: false,
        },
    ];

    const portfolio = [
        {
            title: "E-commerce Sales Analysis",
            description:
                "Comprehensive sales performance analysis with customer segmentation and revenue optimization strategies",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
            category: "Sales Analytics",
            dataPoints: "50K+ Records",
        },
        {
            title: "Healthcare Data Insights",
            description:
                "Patient data analysis for treatment effectiveness and operational efficiency improvements",
            image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop",
            category: "Healthcare",
            dataPoints: "100K+ Records",
        },
        {
            title: "Marketing Campaign ROI",
            description:
                "Multi-channel marketing performance analysis with attribution modeling and budget optimization",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
            category: "Marketing",
            dataPoints: "25K+ Records",
        },
    ];

    const analysisTypes = [
        {
            title: "Descriptive Analytics",
            description:
                "What happened? Understanding historical data patterns and trends",
            icon: <FaChartBar className="w-8 h-8 text-blue-400" />,
            features: [
                "Historical reporting",
                "Data summarization",
                "KPI dashboards",
                "Trend analysis",
            ],
        },
        {
            title: "Diagnostic Analytics",
            description:
                "Why did it happen? Deep dive into data to understand root causes",
            icon: <FaBrain className="w-8 h-8 text-purple-400" />,
            features: [
                "Root cause analysis",
                "Correlation studies",
                "Anomaly detection",
                "Pattern recognition",
            ],
        },
        {
            title: "Predictive Analytics",
            description:
                "What will happen? Forecasting future trends and outcomes",
            icon: <FaChartLine className="w-8 h-8 text-green-400" />,
            features: [
                "Machine learning models",
                "Forecasting",
                "Risk assessment",
                "Demand planning",
            ],
        },
        {
            title: "Prescriptive Analytics",
            description:
                "What should we do? Actionable recommendations for optimal decisions",
            icon: <FaCalculator className="w-8 h-8 text-orange-400" />,
            features: [
                "Optimization models",
                "Decision support",
                "Scenario planning",
                "Strategy recommendations",
            ],
        },
    ];

    const industries = [
        "E-commerce & Retail",
        "Healthcare & Pharmaceuticals",
        "Finance & Banking",
        "Marketing & Advertising",
        "Manufacturing & Supply Chain",
        "Education & EdTech",
        "Real Estate",
        "Sports & Entertainment",
        "Government & Non-profit",
        "Technology & SaaS",
    ];

    const testimonials = [
        {
            name: "Rajesh Gupta",
            company: "RetailMax Solutions",
            rating: 5,
            comment:
                "Outstanding data analysis that helped us increase sales by 35%. The insights were actionable and clearly presented.",
        },
        {
            name: "Dr. Meera Shah",
            company: "HealthFirst Clinic",
            rating: 5,
            comment:
                "Excellent work on our patient data analysis. The predictive models have improved our treatment outcomes significantly.",
        },
        {
            name: "Vikram Singh",
            company: "MarketPro Agency",
            rating: 5,
            comment:
                "The marketing ROI analysis saved us ₹2 lakhs in ad spend. Highly recommend their analytical expertise.",
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
                        <span className="text-white">Data Analysis</span>
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
                                <FaChartBar className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Data Analysis
                                <span className="block text-2xl md:text-3xl text-blue-400 mt-2">
                                    Transform Data into Insights.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                Unlock the power of your data with advanced
                                analytics, machine learning, and actionable
                                insights that drive business growth and informed
                                decision-making.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/data-analysis/students"
                                        )
                                    }
                                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                                >
                                    Start Analysis
                                </button>
                                <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    View Portfolio
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
                                            Projects Analyzed
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-cyan-400 mb-2">
                                            10M+
                                        </div>
                                        <div className="text-gray-400">
                                            Data Points
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-blue-400 mb-2">
                                            95%
                                        </div>
                                        <div className="text-gray-400">
                                            Accuracy Rate
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-cyan-400 mb-2">
                                            24h
                                        </div>
                                        <div className="text-gray-400">
                                            Turnaround
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
                            Data Analysis Services
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Comprehensive data analysis solutions to extract
                            meaningful insights from your data
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                            >
                                <FaCheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-300">{service}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Analysis Types */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Types of Analysis
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            From understanding what happened to predicting what
                            will happen next
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {analysisTypes.map((type, index) => (
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
                                            <FaCheckCircle className="w-3 h-3 text-blue-400" />
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

            {/* Tools Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Analytics Tools & Technologies
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Cutting-edge tools and technologies for
                            comprehensive data analysis
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

            {/* Industries Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Industries We Serve
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Data analysis expertise across various industries
                            and business domains
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {industries.map((industry, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 text-center"
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
                            Data Analysis Pricing
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Professional data analysis and business intelligence
                            services
                        </p>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl font-bold text-white mb-6">
                                    Advanced Data Analysis Services
                                </h3>
                                <div className="text-5xl font-bold text-blue-400 mb-6">
                                    ₹5,000 - ₹25,000
                                </div>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Transform your raw data into actionable
                                    insights with our comprehensive data
                                    analysis services. We provide statistical
                                    analysis, data visualization, predictive
                                    modeling, and business intelligence
                                    solutions using Python, R, SQL, and advanced
                                    analytics tools for informed
                                    decision-making.
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/services/data-analysis/students"
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
                                        <FaChartBar className="text-3xl text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-6">
                                        Analytics Power
                                    </h4>
                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaDatabase className="text-blue-400" />
                                                Data Points Analyzed
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                10M+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaCheckCircle className="text-blue-400" />
                                                Accuracy Rate
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                97%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaChartLine className="text-blue-400" />
                                                Insights Generated
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                5000+
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                            <span className="flex items-center gap-2">
                                                <FaChartPie className="text-blue-400" />
                                                ROI Improvement
                                            </span>
                                            <span className="text-blue-400 font-bold text-lg">
                                                +60%
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
                            Analysis Portfolio
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Explore our recent data analysis projects and the
                            insights we've delivered
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
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                {project.category}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {project.dataPoints}
                                            </span>
                                        </div>
                                        <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
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
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Client Success Stories
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            What our clients say about our data analysis
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
                                    <div className="text-blue-400 text-sm">
                                        {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Unlock Your Data's Potential?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Transform your raw data into actionable insights that
                        drive business growth and success.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
                            <FaPhone className="w-4 h-4" />
                            Call Now: +91 9876543210
                        </button>
                        <button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2">
                            <FaWhatsapp className="w-4 h-4" />
                            WhatsApp Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataAnalysis;
