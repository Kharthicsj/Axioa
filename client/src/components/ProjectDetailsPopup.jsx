import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
    FaTimes,
    FaUser,
    FaStar,
    FaTag,
    FaClock,
    FaDollarSign,
    FaFileAlt,
    FaCalendarAlt,
    FaExclamationCircle,
    FaInfoCircle,
    FaPaperPlane,
    FaCode,
    FaMobile,
    FaCube,
    FaPaintBrush,
    FaChartBar,
    FaEdit,
    FaWhatsapp,
    FaPhone,
    FaVideo,
    FaEnvelope,
    FaComments,
    FaLink,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { projectAPI } from "../utils/api";

const ProjectDetailsPopup = ({
    isOpen,
    onClose,
    student,
    service,
    title,
    initialData,
    isEditMode = false,
    onSubmit,
}) => {
    // Service configurations with pricing and timeframes
    const serviceConfigurations = {
        "web-development": {
            title: "Web Development",
            icon: <FaCode className="text-green-400" />,
            color: "from-green-500 to-emerald-500",
            minPrice: 5000,
            maxPrice: 50000,
            minDays: 7,
            maxDays: 90,
            urgencyMultiplier: 1.5,
        },
        "app-development": {
            title: "App Development",
            icon: <FaMobile className="text-purple-400" />,
            color: "from-purple-500 to-pink-500",
            minPrice: 8000,
            maxPrice: 75000,
            minDays: 14,
            maxDays: 120,
            urgencyMultiplier: 1.6,
        },
        "resume-services": {
            title: "Resume Services",
            icon: <FaFileAlt className="text-blue-400" />,
            color: "from-blue-500 to-cyan-500",
            minPrice: 500,
            maxPrice: 5000,
            minDays: 1,
            maxDays: 7,
            urgencyMultiplier: 1.3,
        },
        "cad-modeling": {
            title: "CAD Modeling",
            icon: <FaCube className="text-orange-400" />,
            color: "from-orange-500 to-red-500",
            minPrice: 2000,
            maxPrice: 30000,
            minDays: 3,
            maxDays: 60,
            urgencyMultiplier: 1.4,
        },
        "ui-ux-design": {
            title: "UI/UX Design",
            icon: <FaPaintBrush className="text-pink-400" />,
            color: "from-purple-500 to-pink-500",
            minPrice: 3000,
            maxPrice: 40000,
            minDays: 5,
            maxDays: 45,
            urgencyMultiplier: 1.4,
        },
        "data-analysis": {
            title: "Data Analysis",
            icon: <FaChartBar className="text-cyan-400" />,
            color: "from-blue-500 to-cyan-500",
            minPrice: 2500,
            maxPrice: 25000,
            minDays: 3,
            maxDays: 30,
            urgencyMultiplier: 1.3,
        },
        "content-writing": {
            title: "Content Writing",
            icon: <FaEdit className="text-teal-400" />,
            color: "from-green-500 to-teal-500",
            minPrice: 1000,
            maxPrice: 15000,
            minDays: 2,
            maxDays: 21,
            urgencyMultiplier: 1.2,
        },
    };

    // Memoize currentService to prevent infinite re-renders
    const currentService = useMemo(() => {
        return (
            serviceConfigurations[service] ||
            serviceConfigurations["web-development"]
        );
    }, [service]);

    // Get current user for pre-filling email
    const { user } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        serviceCategory: "",
        projectName: "",
        quotedPrice: "",
        completionTime: "",
        urgency: "normal",
        projectDescription: "",
        requirements: "",
        budget: "fixed",
        paymentTerms: "completion",
        communicationPreference: initialData?.communicationPreference || "",
        // Conditional communication fields
        phoneNumber: initialData?.phoneNumber || "",
        emailAddress: initialData?.emailAddress || "",
        meetingLink: initialData?.meetingLink || "",
        additionalNotes: initialData?.additionalNotes || "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when popup opens or service changes
    useEffect(() => {
        if (isOpen && currentService) {
            setFormData({
                serviceCategory: initialData?.serviceCategory || service,
                projectName: initialData?.projectName || "",
                quotedPrice: initialData?.quotedPrice || "",
                completionTime: initialData?.completionTime || "",
                urgency: initialData?.urgency || "normal",
                projectDescription: initialData?.projectDescription || "",
                requirements: initialData?.requirements || "",
                budget: "fixed",
                paymentTerms: "completion",
                communicationPreference:
                    initialData?.communicationPreference || "",
                // Conditional communication fields
                phoneNumber: initialData?.phoneNumber || "",
                emailAddress: initialData?.emailAddress || user?.email || "",
                meetingLink: initialData?.meetingLink || "",
                additionalNotes: initialData?.additionalNotes || "",
            });
            setErrors({});
        }
    }, [
        isOpen,
        currentService.title,
        currentService.minPrice,
        currentService.minDays,
        user?.email,
        initialData,
    ]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }

        // Handle price validation
        if (field === "quotedPrice") {
            const price = parseInt(value);
            if (value && !isNaN(price)) {
                if (price < currentService.minPrice) {
                    setErrors((prev) => ({
                        ...prev,
                        quotedPrice: `Minimum price is ₹${currentService.minPrice}`,
                    }));
                } else if (price > currentService.maxPrice) {
                    setErrors((prev) => ({
                        ...prev,
                        quotedPrice: `Maximum price is ₹${currentService.maxPrice}`,
                    }));
                }
            }
        }

        // Handle completion time validation
        if (field === "completionTime") {
            const days = parseInt(value);
            if (value && !isNaN(days)) {
                if (days < currentService.minDays) {
                    setErrors((prev) => ({
                        ...prev,
                        completionTime: `Minimum duration is ${currentService.minDays} days`,
                    }));
                } else if (days > currentService.maxDays) {
                    setErrors((prev) => ({
                        ...prev,
                        completionTime: `Maximum duration is ${currentService.maxDays} days`,
                    }));
                }
            }
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.projectName.trim()) {
            newErrors.projectName = "Project name is required";
        }

        if (!formData.projectDescription.trim()) {
            newErrors.projectDescription = "Project description is required";
        }

        if (!formData.requirements.trim()) {
            newErrors.requirements = "Project requirements are required";
        }

        const price = parseInt(formData.quotedPrice);
        if (!formData.quotedPrice || isNaN(price)) {
            newErrors.quotedPrice = "Price is required";
        } else if (
            price < currentService.minPrice ||
            price > currentService.maxPrice
        ) {
            newErrors.quotedPrice = `Price must be between ₹${currentService.minPrice} and ₹${currentService.maxPrice}`;
        }

        const days = parseInt(formData.completionTime);
        if (!formData.completionTime || isNaN(days)) {
            newErrors.completionTime = "Completion time is required";
        } else if (
            days < currentService.minDays ||
            days > currentService.maxDays
        ) {
            newErrors.completionTime = `Duration must be between ${currentService.minDays} and ${currentService.maxDays} days`;
        }

        // Conditional validation based on communication preference
        if (
            formData.communicationPreference === "whatsapp" ||
            formData.communicationPreference === "phone"
        ) {
            if (!formData.phoneNumber.trim()) {
                newErrors.phoneNumber =
                    "Phone number is required for WhatsApp/Phone communication";
            } else if (
                !/^[0-9+\-\s()]{10,15}$/.test(formData.phoneNumber.trim())
            ) {
                newErrors.phoneNumber = "Please enter a valid phone number";
            }
        }

        if (formData.communicationPreference === "email") {
            if (!formData.emailAddress.trim()) {
                newErrors.emailAddress =
                    "Email address is required for email communication";
            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress.trim())
            ) {
                newErrors.emailAddress = "Please enter a valid email address";
            }
        }

        if (formData.communicationPreference === "online-meeting") {
            if (!formData.meetingLink.trim()) {
                newErrors.meetingLink =
                    "Meeting link is required for online meetings";
            } else if (!/^https?:\/\/.+/.test(formData.meetingLink.trim())) {
                newErrors.meetingLink =
                    "Please enter a valid meeting link (must start with http:// or https://)";
            }
        }

        if (formData.communicationPreference === "mixed") {
            if (!formData.phoneNumber.trim()) {
                newErrors.phoneNumber =
                    "Phone number is required for mixed communication";
            } else if (
                !/^[0-9+\-\s()]{10,15}$/.test(formData.phoneNumber.trim())
            ) {
                newErrors.phoneNumber = "Please enter a valid phone number";
            }
            // Meeting link is optional for mixed communication
        }

        // Validate communication preference is selected
        if (!formData.communicationPreference) {
            newErrors.communicationPreference =
                "Please select a communication preference";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const projectData = {
                projectName: formData.projectName,
                serviceCategory: initialData?.serviceCategory || service,
                projectDescription: formData.projectDescription,
                requirements: formData.requirements,
                quotedPrice: parseFloat(formData.quotedPrice),
                completionTime: parseInt(formData.completionTime),
                urgency: formData.urgency,
                communicationPreference: formData.communicationPreference,
                phoneNumber: formData.phoneNumber || null,
                emailAddress: formData.emailAddress || user?.email,
                meetingLink: formData.meetingLink || null,
                additionalNotes: formData.additionalNotes || null,
                assignedTo: initialData?.assignedTo || student?.userId,
            };

            // Use custom onSubmit if in edit mode, otherwise create project
            if (isEditMode && onSubmit) {
                await onSubmit(projectData);
            } else {
                const result = await projectAPI.createProject(projectData);

                if (result.success) {
                    toast.success("Project request sent successfully!", {
                        duration: 4000,
                        style: {
                            background: "#10B981",
                            color: "#ffffff",
                        },
                    });

                    // Delay closing the popup to allow toast to show
                    setTimeout(() => {
                        onClose();
                        // Optionally trigger a refresh of parent component
                        if (window.location.pathname.includes("students")) {
                            window.location.reload();
                        }
                    }, 1500); // 1.5 second delay
                } else {
                    throw new Error(
                        result.message || "Failed to create project"
                    );
                }
            }

            // Close popup for edit mode (success toast will be handled by parent)
            if (isEditMode) {
                onClose();
            }
        } catch (error) {
            console.error("Error processing project:", error);
            toast.error(
                error.message ||
                    `Failed to ${
                        isEditMode ? "update" : "create"
                    } project. Please try again.`,
                {
                    duration: 5000,
                    style: {
                        background: "#EF4444",
                        color: "#ffffff",
                    },
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate estimated price based on urgency
    const getEstimatedPrice = () => {
        const price = parseInt(formData.quotedPrice);
        if (isNaN(price) || !formData.quotedPrice) return 0;

        let finalPrice = price;
        if (formData.urgency === "urgent") {
            finalPrice = Math.round(price * currentService.urgencyMultiplier);
        }
        return Math.min(finalPrice, currentService.maxPrice);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div
                    className={`bg-gradient-to-r ${currentService.color} px-6 py-4 flex items-center justify-between`}
                >
                    <div className="flex items-center gap-3">
                        {currentService.icon}
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {title ||
                                    (isEditMode
                                        ? "Update Data"
                                        : "Start New Project")}
                            </h2>
                            <p className="text-white/80 text-sm">
                                {isEditMode
                                    ? `Update project details`
                                    : `Create project with ${student?.name}`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {/* Student Info */}
                    <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                                {student?.profilePicture ? (
                                    <img
                                        src={
                                            student.profilePicture.startsWith(
                                                "data:"
                                            )
                                                ? student.profilePicture
                                                : `data:image/jpeg;base64,${student.profilePicture}`
                                        }
                                        alt={student.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FaUser className="text-gray-400 w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold">
                                    {student?.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <FaStar className="text-yellow-400 w-3 h-3" />
                                        {student?.rating || 0}/5
                                    </span>
                                    <span>
                                        {student?.completedProjects || 0}{" "}
                                        projects completed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Core Project Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Service Category (Auto-filled, non-editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaTag className="inline w-4 h-4 mr-2" />
                                    Service Category
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.serviceCategory}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-400 cursor-not-allowed"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {currentService.icon}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-selected based on service type
                                </p>
                            </div>

                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaFileAlt className="inline w-4 h-4 mr-2" />
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.projectName}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "projectName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your project name"
                                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                                        errors.projectName
                                            ? "border-red-500"
                                            : "border-gray-600/50 focus:border-blue-500/50"
                                    }`}
                                />
                                {errors.projectName && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.projectName}
                                    </p>
                                )}
                            </div>

                            {/* Quoted Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaDollarSign className="inline w-4 h-4 mr-2" />
                                    Quoted Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.quotedPrice}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "quotedPrice",
                                            e.target.value
                                        )
                                    }
                                    placeholder={`e.g., ${currentService.minPrice}`}
                                    min={currentService.minPrice}
                                    max={currentService.maxPrice}
                                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                                        errors.quotedPrice
                                            ? "border-red-500"
                                            : "border-gray-600/50 focus:border-blue-500/50"
                                    }`}
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>
                                        Range: ₹
                                        {currentService.minPrice.toLocaleString()}{" "}
                                        - ₹
                                        {currentService.maxPrice.toLocaleString()}
                                    </span>
                                    {formData.urgency === "urgent" &&
                                        formData.quotedPrice && (
                                            <span className="text-orange-400">
                                                Estimated: ₹
                                                {getEstimatedPrice().toLocaleString()}
                                            </span>
                                        )}
                                </div>
                                {errors.quotedPrice && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.quotedPrice}
                                    </p>
                                )}
                            </div>

                            {/* Completion Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaClock className="inline w-4 h-4 mr-2" />
                                    Expected Completion Time (Days) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.completionTime}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "completionTime",
                                            e.target.value
                                        )
                                    }
                                    placeholder={`e.g., ${currentService.minDays}`}
                                    min={currentService.minDays}
                                    max={currentService.maxDays}
                                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                                        errors.completionTime
                                            ? "border-red-500"
                                            : "border-gray-600/50 focus:border-blue-500/50"
                                    }`}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Range: {currentService.minDays} -{" "}
                                    {currentService.maxDays} days
                                </p>
                                {errors.completionTime && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.completionTime}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Project Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FaInfoCircle className="inline w-4 h-4 mr-2" />
                                Project Description *
                            </label>
                            <textarea
                                value={formData.projectDescription}
                                onChange={(e) =>
                                    handleInputChange(
                                        "projectDescription",
                                        e.target.value
                                    )
                                }
                                placeholder="Describe your project in detail..."
                                rows={4}
                                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 resize-none ${
                                    errors.projectDescription
                                        ? "border-red-500"
                                        : "border-gray-600/50 focus:border-blue-500/50"
                                }`}
                            />
                            {errors.projectDescription && (
                                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                    <FaExclamationCircle className="w-3 h-3" />
                                    {errors.projectDescription}
                                </p>
                            )}
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Requirements & Specifications *
                            </label>
                            <textarea
                                value={formData.requirements}
                                onChange={(e) =>
                                    handleInputChange(
                                        "requirements",
                                        e.target.value
                                    )
                                }
                                placeholder="List your specific requirements, features, and specifications..."
                                rows={4}
                                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 resize-none ${
                                    errors.requirements
                                        ? "border-red-500"
                                        : "border-gray-600/50 focus:border-blue-500/50"
                                }`}
                            />
                            {errors.requirements && (
                                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                    <FaExclamationCircle className="w-3 h-3" />
                                    {errors.requirements}
                                </p>
                            )}
                        </div>

                        {/* Additional Options */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Urgency Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Priority Level
                                </label>
                                <select
                                    value={formData.urgency}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "urgency",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="urgent">
                                        Urgent (Price may increase)
                                    </option>
                                </select>
                            </div>

                            {/* Budget Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Budget Type
                                </label>
                                <input
                                    type="text"
                                    value="Fixed Price"
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Only fixed price projects are available
                                </p>
                            </div>

                            {/* Payment Terms */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Payment Terms
                                </label>
                                <input
                                    type="text"
                                    value="Payment on Completion"
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Payment will be made upon project completion
                                </p>
                            </div>
                        </div>

                        {/* Communication Preference */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FaComments className="inline w-4 h-4 mr-2" />
                                Preferred Communication *
                            </label>
                            <select
                                value={formData.communicationPreference}
                                onChange={(e) =>
                                    handleInputChange(
                                        "communicationPreference",
                                        e.target.value
                                    )
                                }
                                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                                    errors.communicationPreference
                                        ? "border-red-500"
                                        : "border-gray-600/50 focus:border-blue-500/50"
                                }`}
                            >
                                <option value="">
                                    Select communication method
                                </option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="phone">Phone Call</option>
                                <option value="email">Email</option>
                                <option value="online-meeting">
                                    Online Meeting
                                </option>
                                <option value="mixed">
                                    Mixed (WhatsApp + Platform)
                                </option>
                            </select>
                            {errors.communicationPreference && (
                                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                    <FaExclamationCircle className="w-3 h-3" />
                                    {errors.communicationPreference}
                                </p>
                            )}
                        </div>

                        {/* Conditional Communication Fields */}
                        {(formData.communicationPreference === "whatsapp" ||
                            formData.communicationPreference === "phone" ||
                            formData.communicationPreference === "mixed") && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaWhatsapp className="inline w-4 h-4 mr-2 text-green-400" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "phoneNumber",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your phone number (e.g., +91 9876543210)"
                                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                                        errors.phoneNumber
                                            ? "border-red-500"
                                            : "border-gray-600/50 focus:border-blue-500/50"
                                    }`}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.phoneNumber}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.communicationPreference ===
                                    "whatsapp"
                                        ? "Required for WhatsApp communication"
                                        : formData.communicationPreference ===
                                          "phone"
                                        ? "Required for phone calls"
                                        : "Required for WhatsApp in mixed communication"}
                                </p>
                            </div>
                        )}

                        {formData.communicationPreference === "email" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaEnvelope className="inline w-4 h-4 mr-2 text-blue-400" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.emailAddress}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "emailAddress",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your email address"
                                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                                        errors.emailAddress
                                            ? "border-red-500"
                                            : "border-gray-600/50 focus:border-blue-500/50"
                                    }`}
                                />
                                {errors.emailAddress && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.emailAddress}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Pre-filled with your account email. You can
                                    edit if needed.
                                </p>
                            </div>
                        )}

                        {formData.communicationPreference ===
                            "online-meeting" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaVideo className="inline w-4 h-4 mr-2 text-purple-400" />
                                    Meeting Link *
                                </label>
                                <input
                                    type="url"
                                    value={formData.meetingLink}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "meetingLink",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your meeting link (e.g., https://meet.google.com/xyz-abc-def)"
                                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                                        errors.meetingLink
                                            ? "border-red-500"
                                            : "border-gray-600/50 focus:border-blue-500/50"
                                    }`}
                                />
                                {errors.meetingLink && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.meetingLink}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Provide a static meeting link (Google Meet,
                                    Zoom, etc.)
                                </p>
                            </div>
                        )}

                        {formData.communicationPreference === "mixed" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FaLink className="inline w-4 h-4 mr-2 text-cyan-400" />
                                    Meeting Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.meetingLink}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "meetingLink",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your meeting link for video calls (optional)"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Optional: For video calls in mixed
                                    communication
                                </p>
                            </div>
                        )}

                        {/* Additional Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                value={formData.additionalNotes}
                                onChange={(e) =>
                                    handleInputChange(
                                        "additionalNotes",
                                        e.target.value
                                    )
                                }
                                placeholder="Any additional information or special requests..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 mt-6 border-t border-gray-700/50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3.5 bg-gray-700/80 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 hover:transform hover:scale-[1.02] border border-gray-600/50 hover:border-gray-500/50 shadow-lg hover:shadow-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 px-6 py-3.5 bg-gradient-to-r ${
                                    currentService.color
                                } hover:opacity-90 text-white font-medium rounded-xl transition-all duration-200 hover:transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border border-white/10 ${
                                    isSubmitting
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isEditMode
                                            ? "Updating..."
                                            : "Sending..."}
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="w-4 h-4" />
                                        {isEditMode
                                            ? "Update Project"
                                            : "Submit"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPopup;
