import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { toast } from "react-hot-toast";
import idCardHelp from "../assets/idCardHelp.png";
import api from "../utils/api";
import {
    FaUser,
    FaGraduationCap,
    FaCode,
    FaIdCard,
    FaFileAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaUpload,
    FaEdit,
    FaEye,
    FaSave,
    FaPaperPlane,
    FaTimes,
    FaInfoCircle,
    FaPlus,
    FaTrash,
    FaClock,
    FaEnvelope,
    FaSignOutAlt,
} from "react-icons/fa";

const ApplyForStudent = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Check authentication on component mount - but wait for loading to complete
    useEffect(() => {
        // Don't redirect while still loading authentication state
        if (authLoading) return;

        if (!isAuthenticated || !user) {
            toast.error("Please log in to access this page");
            navigate("/signin", { replace: true });
            return;
        }

        // Initial profile completion calculation
        calculateLocalCompletion();
    }, [isAuthenticated, user, navigate, authLoading]);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [applicationData, setApplicationData] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState({
        percentage: 0,
        missingFields: [],
    });
    const [identityPreview, setIdentityPreview] = useState(null);
    const [selectedIdentityFile, setSelectedIdentityFile] = useState(null);
    const [collegeIdPreview, setCollegeIdPreview] = useState(null);
    const [selectedCollegeIdFile, setSelectedCollegeIdFile] = useState(null);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [showForm, setShowForm] = useState(true);

    // Form states for different sections
    const [personalInfo, setPersonalInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
        },
    });

    const [education, setEducation] = useState({
        college: "",
        course: "",
        degree: "",
        year: new Date().getFullYear(),
        cgpa: "",
        percentage: "",
        specialization: "",
        expectedGraduation: "",
    });

    const [technical, setTechnical] = useState({
        skills: [],
        programmingLanguages: [],
        frameworks: [],
        tools: [],
        projects: [],
        github: "",
        linkedin: "",
        portfolio: "",
    });

    const [identityProof, setIdentityProof] = useState({
        documentType: "",
        documentNumber: "",
        documentImage: null,
    });

    const [collegeIdProof, setCollegeIdProof] = useState({
        documentNumber: "",
        documentImage: null,
    });

    const [applicationDetails, setApplicationDetails] = useState({
        reasonForApplying: "",
        careerGoals: "",
        experience: "",
        achievements: [],
        references: [],
    });

    // Input states for dynamic arrays
    const [skillInput, setSkillInput] = useState("");
    const [achievementInput, setAchievementInput] = useState("");
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        technologies: [],
        githubLink: "",
        liveLink: "",
    });

    const tabs = [
        { id: "personal", label: "Personal Info", icon: FaUser },
        { id: "education", label: "Education", icon: FaGraduationCap },
        { id: "technical", label: "Technical", icon: FaCode },
        { id: "identity", label: "Identity Proof", icon: FaIdCard },
        { id: "application", label: "Application Details", icon: FaFileAlt },
    ];

    const documentTypes = [
        { value: "aadhar", label: "Aadhar Card" },
        { value: "driving_license", label: "Driving License" },
        { value: "pan_card", label: "PAN Card" },
        { value: "passport", label: "Passport" },
        { value: "voter_id", label: "Voter ID" },
    ];

    const degreeOptions = [
        {
            label: "Bachelor's Degrees",
            options: [
                {
                    value: "B.E. (Bachelor of Engineering)",
                    label: "B.E. (Bachelor of Engineering)",
                },
                {
                    value: "B.Tech (Bachelor of Technology)",
                    label: "B.Tech (Bachelor of Technology)",
                },
                {
                    value: "B.Sc (Bachelor of Science)",
                    label: "B.Sc (Bachelor of Science)",
                },
                {
                    value: "B.A (Bachelor of Arts)",
                    label: "B.A (Bachelor of Arts)",
                },
                {
                    value: "B.Com (Bachelor of Commerce)",
                    label: "B.Com (Bachelor of Commerce)",
                },
                {
                    value: "BBA (Bachelor of Business Administration)",
                    label: "BBA (Bachelor of Business Administration)",
                },
                {
                    value: "BCA (Bachelor of Computer Applications)",
                    label: "BCA (Bachelor of Computer Applications)",
                },
                {
                    value: "B.Arch (Bachelor of Architecture)",
                    label: "B.Arch (Bachelor of Architecture)",
                },
                {
                    value: "MBBS (Bachelor of Medicine)",
                    label: "MBBS (Bachelor of Medicine)",
                },
                {
                    value: "LLB (Bachelor of Law)",
                    label: "LLB (Bachelor of Law)",
                },
            ],
        },
        {
            label: "Master's Degrees",
            options: [
                {
                    value: "M.E. (Master of Engineering)",
                    label: "M.E. (Master of Engineering)",
                },
                {
                    value: "M.Tech (Master of Technology)",
                    label: "M.Tech (Master of Technology)",
                },
                {
                    value: "M.Sc (Master of Science)",
                    label: "M.Sc (Master of Science)",
                },
                {
                    value: "M.A (Master of Arts)",
                    label: "M.A (Master of Arts)",
                },
                {
                    value: "M.Com (Master of Commerce)",
                    label: "M.Com (Master of Commerce)",
                },
                {
                    value: "MBA (Master of Business Administration)",
                    label: "MBA (Master of Business Administration)",
                },
                {
                    value: "MCA (Master of Computer Applications)",
                    label: "MCA (Master of Computer Applications)",
                },
                {
                    value: "M.Arch (Master of Architecture)",
                    label: "M.Arch (Master of Architecture)",
                },
                { value: "LLM (Master of Law)", label: "LLM (Master of Law)" },
            ],
        },
        {
            label: "Doctoral Degrees",
            options: [
                {
                    value: "Ph.D (Doctor of Philosophy)",
                    label: "Ph.D (Doctor of Philosophy)",
                },
                {
                    value: "D.Sc (Doctor of Science)",
                    label: "D.Sc (Doctor of Science)",
                },
                {
                    value: "D.Litt (Doctor of Literature)",
                    label: "D.Litt (Doctor of Literature)",
                },
            ],
        },
        {
            label: "Other Qualifications",
            options: [
                { value: "Diploma", label: "Diploma" },
                { value: "Certificate", label: "Certificate" },
                { value: "Associate Degree", label: "Associate Degree" },
                {
                    value: "Professional Certificate",
                    label: "Professional Certificate",
                },
                {
                    value: "ITI (Industrial Training Institute)",
                    label: "ITI (Industrial Training Institute)",
                },
                { value: "Polytechnic", label: "Polytechnic" },
                { value: "Other", label: "Other" },
            ],
        },
    ];
    const genders = ["male", "female", "other"];

    // Populate form from user profile data
    const populateFromUserProfile = () => {
        if (!user) return;

        // Pre-populate personal info
        setPersonalInfo((prev) => ({
            ...prev,
            fullName: user.username || prev.fullName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            dateOfBirth: user.dateOfBirth
                ? typeof user.dateOfBirth === "string"
                    ? user.dateOfBirth.split("T")[0]
                    : new Date(user.dateOfBirth).toISOString().split("T")[0]
                : prev.dateOfBirth,
            gender: user.gender || prev.gender,
            address: {
                ...prev.address,
                city: user.city || user.location || prev.address.city,
                state: user.state || prev.address.state,
                street: user.address?.street || prev.address.street,
                pincode: user.address?.pincode || prev.address.pincode,
                country: user.address?.country || prev.address.country,
            },
        }));

        // Pre-populate education info
        setEducation((prev) => ({
            ...prev,
            college: user.college || prev.college,
            course: user.course || prev.course,
            degree: user.degree || prev.degree,
            year: user.year || prev.year,
            cgpa: user.cgpa || prev.cgpa,
            percentage: user.percentage || prev.percentage,
            specialization: user.specialization || prev.specialization,
            expectedGraduation: user.expectedGraduation
                ? typeof user.expectedGraduation === "string"
                    ? user.expectedGraduation.split("T")[0]
                    : new Date(user.expectedGraduation)
                          .toISOString()
                          .split("T")[0]
                : prev.expectedGraduation,
        }));

        // Pre-populate technical info
        const userSkills = Array.isArray(user.skills)
            ? user.skills
            : typeof user.skills === "string"
            ? user.skills.split(",").map((s) => s.trim())
            : [];

        setTechnical((prev) => ({
            ...prev,
            skills: userSkills.length > 0 ? userSkills : prev.skills,
            github: user.socialLinks?.github || user.github || prev.github,
            linkedin:
                user.socialLinks?.linkedin || user.linkedin || prev.linkedin,
            portfolio:
                user.socialLinks?.portfolio || user.portfolio || prev.portfolio,
        }));

        // Trigger profile completion calculation after populating data
        calculateLocalCompletion();
    };

    // Calculate profile completion locally
    const calculateLocalCompletion = useCallback(() => {
        const fieldChecks = [
            // Personal Information (9 fields)
            { name: "Full Name", value: personalInfo.fullName, required: true },
            { name: "Email", value: personalInfo.email, required: true },
            { name: "Phone", value: personalInfo.phone, required: true },
            {
                name: "Date of Birth",
                value: personalInfo.dateOfBirth,
                required: true,
            },
            { name: "Gender", value: personalInfo.gender, required: true },
            {
                name: "Street Address",
                value: personalInfo.address.street,
                required: true,
            },
            { name: "City", value: personalInfo.address.city, required: true },
            {
                name: "State",
                value: personalInfo.address.state,
                required: true,
            },
            {
                name: "PIN Code",
                value: personalInfo.address.pincode,
                required: true,
            },

            // Education Information (5 fields)
            { name: "College", value: education.college, required: true },
            { name: "Course", value: education.course, required: true },
            { name: "Degree", value: education.degree, required: true },
            { name: "Year", value: education.year, required: true },
            {
                name: "Expected Graduation",
                value: education.expectedGraduation,
                required: true,
            },

            // Technical Information (3 fields)
            {
                name: "Skills",
                value: technical.skills.length > 0,
                required: true,
            },
            { name: "GitHub Profile", value: technical.github, required: true },
            {
                name: "LinkedIn Profile",
                value: technical.linkedin,
                required: true,
            },

            // Identity Proof (3 fields)
            {
                name: "Document Type",
                value: identityProof.documentType,
                required: true,
            },
            {
                name: "Document Number",
                value: identityProof.documentNumber,
                required: true,
            },
            { name: "Document Image", value: identityPreview, required: true },

            // College ID Proof (2 fields)
            {
                name: "College ID Number",
                value: collegeIdProof.documentNumber,
                required: true,
            },
            {
                name: "College ID Image",
                value: collegeIdPreview,
                required: true,
            },

            // Application Details (2 fields)
            {
                name: "Reason for Applying",
                value: applicationDetails.reasonForApplying,
                required: true,
            },
            {
                name: "Career Goals",
                value: applicationDetails.careerGoals,
                required: true,
            },
        ];

        const completedFields = fieldChecks.filter((field) => {
            if (typeof field.value === "boolean") return field.value;
            if (typeof field.value === "number") return field.value > 0;
            return field.value && field.value.toString().trim() !== "";
        });

        const missingFields = fieldChecks
            .filter((field) => {
                if (typeof field.value === "boolean") return !field.value;
                if (typeof field.value === "number") return field.value <= 0;
                return !field.value || field.value.toString().trim() === "";
            })
            .map((field) => field.name);

        const percentage = Math.round(
            (completedFields.length / fieldChecks.length) * 100
        );

        setProfileCompletion({
            percentage,
            missingFields,
            completedFields: completedFields.length,
            totalFields: fieldChecks.length,
        });
    }, [
        personalInfo,
        education,
        technical,
        identityProof,
        collegeIdProof,
        applicationDetails,
        identityPreview,
        collegeIdPreview,
    ]);

    // Fetch existing application data
    useEffect(() => {
        fetchApplicationData();
    }, []);

    // Recalculate completion when form data changes
    useEffect(() => {
        calculateLocalCompletion();
    }, [calculateLocalCompletion]);

    const fetchApplicationData = async () => {
        try {
            setLoading(true);

            // Try to fetch existing application data first
            if (!isAuthenticated || !user) {
                toast.error("Please log in to access this page");
                navigate("/signin");
                return;
            }

            const response = await api.get("/student/application");
            const result = response.data;
            if (result.success && result.data) {
                const app = result.data;
                setApplicationData(app);

                // Update form states with application data (prioritizing database data over profile data)
                if (app.personalInfo) {
                    const formattedPersonalInfo = {
                        ...app.personalInfo,
                        dateOfBirth: app.personalInfo.dateOfBirth
                            ? typeof app.personalInfo.dateOfBirth === "string"
                                ? app.personalInfo.dateOfBirth.split("T")[0]
                                : new Date(app.personalInfo.dateOfBirth)
                                      .toISOString()
                                      .split("T")[0]
                            : "",
                    };
                    setPersonalInfo(formattedPersonalInfo);
                }
                if (app.education) {
                    const formattedEducation = {
                        ...app.education,
                        expectedGraduation: app.education.expectedGraduation
                            ? typeof app.education.expectedGraduation ===
                              "string"
                                ? app.education.expectedGraduation.split("T")[0]
                                : new Date(app.education.expectedGraduation)
                                      .toISOString()
                                      .split("T")[0]
                            : "",
                    };
                    setEducation(formattedEducation);
                }
                if (app.technical) {
                    setTechnical((prev) => ({ ...prev, ...app.technical }));
                }
                if (app.identityProof) {
                    setIdentityProof((prev) => ({
                        ...prev,
                        ...app.identityProof,
                    }));
                }
                if (app.collegeIdProof) {
                    setCollegeIdProof((prev) => ({
                        ...prev,
                        ...app.collegeIdProof,
                    }));
                }
                if (app.applicationDetails) {
                    setApplicationDetails((prev) => ({
                        ...prev,
                        ...app.applicationDetails,
                    }));
                }

                // Set identity preview if exists
                if (app.identityProof?.documentImage) {
                    setIdentityPreview(app.identityProof.documentImage);
                }

                // Set college ID preview if exists
                if (app.collegeIdProof?.documentImage) {
                    setCollegeIdPreview(app.collegeIdProof.documentImage);
                }

                // Set application status and determine if form should be shown
                setApplicationStatus(app.status || "draft");

                // Hide form if application is submitted, under_review, or approved
                // Allow form to show for rejected applications while keeping status visible
                if (
                    app.status === "submitted" ||
                    app.status === "under_review" ||
                    app.status === "approved"
                ) {
                    setShowForm(false);
                } else {
                    setShowForm(true);
                }

                // Show appropriate message only for existing applications
                if (!result.isNew && app.status !== "submitted") {
                    toast.success("Application data loaded successfully.");
                }
            } else {
                // Only populate from user profile if no application data exists
                if (user) {
                    populateFromUserProfile();
                }
            }

            // Calculate profile completion based on current form state
            calculateLocalCompletion();
        } catch (error) {
            console.error("Error fetching application:", error);
            if (!navigator.onLine) {
                toast.error(
                    "No internet connection. Please check your network."
                );
            } else {
                toast.error(
                    "Failed to load application data. Using profile data instead."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const checkProfileCompletion = async () => {
        try {
            if (!isAuthenticated || !user) {
                calculateLocalCompletion();
                return;
            }

            const response = await api.get("/student/application/completion");
            const result = response.data;
            if (result.success) {
                setProfileCompletion(result.data);
            } else {
                calculateLocalCompletion();
            }
        } catch (error) {
            console.error("Error checking completion:", error);
            // Fall back to local calculation if server is unavailable
            calculateLocalCompletion();
        }
    };

    const saveApplication = async () => {
        try {
            setLoading(true);

            // Clean data to remove empty strings from enum fields
            const cleanPersonalInfo = {
                ...personalInfo,
                gender: personalInfo.gender || undefined, // Convert empty string to undefined
            };

            const cleanEducation = {
                ...education,
                degree: education.degree || undefined, // Convert empty string to undefined
            };

            const cleanIdentityProof = {
                ...identityProof,
                documentType: identityProof.documentType || undefined, // Convert empty string to undefined
                documentImage: identityPreview, // Use preview URL
            };

            const cleanCollegeIdProof = {
                ...collegeIdProof,
                documentImage: collegeIdPreview, // Use preview URL
            };

            const applicationPayload = {
                personalInfo: cleanPersonalInfo,
                education: cleanEducation,
                technical,
                identityProof: cleanIdentityProof,
                collegeIdProof: cleanCollegeIdProof,
                applicationDetails,
            };

            const response = await api.put(
                "/student/application",
                applicationPayload
            );
            const result = response.data;
            if (result.success) {
                toast.success("Application saved successfully!");
                setApplicationData(result.data);
                await checkProfileCompletion();
            } else {
                toast.error(result.message || "Failed to save application");
            }
        } catch (error) {
            console.error("Error saving application:", error);

            if (
                error.response?.status === 400 &&
                error.response?.data?.validationErrors
            ) {
                // Handle validation errors with user-friendly messages
                const errors = error.response.data.validationErrors;
                const errorCount = Object.keys(errors).length;

                if (errorCount <= 3) {
                    // Show specific errors if not too many
                    const friendlyMessages = Object.values(errors).map((msg) =>
                        msg
                            .replace("Path `", "")
                            .replace("` is required.", " is required")
                            .replace("education.", "")
                            .replace("personalInfo.", "")
                            .replace("identityProof.", "")
                            .replace("collegeIdProof.", "College ID ")
                            .replace("applicationDetails.", "")
                    );
                    toast.error(
                        `Please complete: ${friendlyMessages.join(", ")}`
                    );
                } else {
                    // Show general message if too many errors
                    toast.error(
                        `Please complete ${errorCount} required fields to save your application.`
                    );
                }
            } else if (!navigator.onLine) {
                toast.error("No internet connection. Changes saved locally.");
                // Here you could implement local storage fallback with cleaned data
                const cleanPersonalInfo = {
                    ...personalInfo,
                    gender: personalInfo.gender || undefined,
                };

                const cleanEducation = {
                    ...education,
                    degree: education.degree || undefined,
                };

                const cleanIdentityProof = {
                    ...identityProof,
                    documentType: identityProof.documentType || undefined,
                };

                const cleanCollegeIdProof = {
                    ...collegeIdProof,
                };

                localStorage.setItem(
                    "draftApplication",
                    JSON.stringify({
                        personalInfo: cleanPersonalInfo,
                        education: cleanEducation,
                        technical,
                        identityProof: cleanIdentityProof,
                        collegeIdProof: cleanCollegeIdProof,
                        applicationDetails,
                        identityPreview, // Save identity preview
                        collegeIdPreview, // Save college ID preview
                        timestamp: new Date().toISOString(),
                    })
                );
            } else {
                toast.error("Failed to save application. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleIdentityUpload = (file) => {
        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please upload image files only (JPG, PNG, WEBP, GIF)");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            // 2MB limit
            toast.error("File size must be less than 2MB");
            return;
        }

        // Store the selected file for later upload
        setSelectedIdentityFile(file);

        // Create local preview for images using FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result;
            setIdentityPreview(base64String);

            // Update identity proof with base64 data
            setIdentityProof((prev) => ({
                ...prev,
                documentImage: base64String,
            }));
        };
        reader.readAsDataURL(file);

        toast.success(
            "Document selected! It will be uploaded when you submit the application."
        );
    };

    // Upload identity document to server
    const uploadIdentityDocument = async () => {
        if (!selectedIdentityFile || !identityPreview) {
            throw new Error("No identity document selected");
        }

        const formData = new FormData();
        formData.append("identityDocument", selectedIdentityFile);
        formData.append("documentType", identityProof.documentType);
        formData.append("documentNumber", identityProof.documentNumber);

        const response = await api.post(
            "/student/application/upload-identity",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const result = response.data;
        if (!result.success) {
            throw new Error(
                result.message || "Failed to upload identity document"
            );
        }

        return result.data.documentImage;
    };

    const handleCollegeIdUpload = (file) => {
        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please upload image files only (JPG, PNG, WEBP, GIF)");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            // 2MB limit
            toast.error("File size must be less than 2MB");
            return;
        }

        // Store the selected file for later upload
        setSelectedCollegeIdFile(file);

        // Create local preview for images using FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result;
            setCollegeIdPreview(base64String);

            // Update college ID proof with base64 data
            setCollegeIdProof((prev) => ({
                ...prev,
                documentImage: base64String,
            }));
        };
        reader.readAsDataURL(file);

        toast.success(
            "College ID selected! It will be uploaded when you submit the application."
        );
    };

    // Upload college ID document to server
    const uploadCollegeIdDocument = async () => {
        if (!selectedCollegeIdFile || !collegeIdPreview) {
            throw new Error("No college ID document selected");
        }

        const formData = new FormData();
        formData.append("collegeIdDocument", selectedCollegeIdFile);
        formData.append("documentNumber", collegeIdProof.documentNumber);

        const response = await api.post(
            "/student/application/upload-college-id",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const result = response.data;
        if (!result.success) {
            throw new Error(
                result.message || "Failed to upload college ID document"
            );
        }

        return result.data.documentImage;
    };

    const submitApplication = async () => {
        if (profileCompletion.percentage < 100) {
            toast.error(
                "Please complete all required fields before submitting"
            );
            return;
        }

        try {
            setLoading(true);

            // Validate identity document
            if (
                !identityProof.documentImage ||
                !identityProof.documentImage.startsWith("data:")
            ) {
                toast.error("Please upload a valid identity document");
                return;
            }

            // Validate college ID document
            if (
                !collegeIdProof.documentImage ||
                !collegeIdProof.documentImage.startsWith("data:")
            ) {
                toast.error("Please upload a valid college ID document");
                return;
            }

            // Create the complete application data with base64 documents
            const applicationData = {
                personalInfo,
                education,
                technical,
                identityProof: {
                    ...identityProof,
                    documentImage: identityProof.documentImage, // Already base64
                },
                collegeIdProof: {
                    ...collegeIdProof,
                    documentImage: collegeIdProof.documentImage, // Already base64
                },
                applicationDetails,
            };

            // Submit the application with all data including base64 identity document
            const response = await api.post(
                "/student/application/submit",
                applicationData
            );

            const result = response.data;
            if (result.success) {
                toast.success(
                    "Application submitted successfully! Redirecting to homepage..."
                );
                // Clear local storage draft
                localStorage.removeItem("studentApplicationDraft");
                // Clean up local file references
                setSelectedIdentityFile(null);
                setSelectedCollegeIdFile(null);

                // Wait for 3 seconds before redirecting to homepage
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                toast.error(result.message || "Failed to submit application");
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error("Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    // Helper functions for dynamic arrays
    const addSkill = () => {
        if (
            skillInput.trim() &&
            !technical.skills.includes(skillInput.trim())
        ) {
            setTechnical({
                ...technical,
                skills: [...technical.skills, skillInput.trim()],
            });
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setTechnical({
            ...technical,
            skills: technical.skills.filter((skill) => skill !== skillToRemove),
        });
    };

    const addAchievement = () => {
        if (achievementInput.trim()) {
            setApplicationDetails({
                ...applicationDetails,
                achievements: [
                    ...applicationDetails.achievements,
                    achievementInput.trim(),
                ],
            });
            setAchievementInput("");
        }
    };

    const removeAchievement = (index) => {
        const newAchievements = [...applicationDetails.achievements];
        newAchievements.splice(index, 1);
        setApplicationDetails({
            ...applicationDetails,
            achievements: newAchievements,
        });
    };

    const renderPersonalInfoTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
                Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) =>
                            setPersonalInfo({
                                ...personalInfo,
                                fullName: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) =>
                            setPersonalInfo({
                                ...personalInfo,
                                email: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) =>
                            setPersonalInfo({
                                ...personalInfo,
                                phone: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Date of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) =>
                            setPersonalInfo({
                                ...personalInfo,
                                dateOfBirth: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Gender <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={personalInfo.gender}
                        onChange={(e) =>
                            setPersonalInfo({
                                ...personalInfo,
                                gender: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Gender</option>
                        {genders.map((gender) => (
                            <option key={gender} value={gender}>
                                {gender.charAt(0).toUpperCase() +
                                    gender.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Address</h4>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Street Address <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={personalInfo.address.street}
                        onChange={(e) =>
                            setPersonalInfo({
                                ...personalInfo,
                                address: {
                                    ...personalInfo.address,
                                    street: e.target.value,
                                },
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your street address"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            City <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={personalInfo.address.city}
                            onChange={(e) =>
                                setPersonalInfo({
                                    ...personalInfo,
                                    address: {
                                        ...personalInfo.address,
                                        city: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="City"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            State <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={personalInfo.address.state}
                            onChange={(e) =>
                                setPersonalInfo({
                                    ...personalInfo,
                                    address: {
                                        ...personalInfo.address,
                                        state: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="State"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            PIN Code <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={personalInfo.address.pincode}
                            onChange={(e) =>
                                setPersonalInfo({
                                    ...personalInfo,
                                    address: {
                                        ...personalInfo.address,
                                        pincode: e.target.value,
                                    },
                                })
                            }
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="PIN Code"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEducationTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
                Educational Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        College/University{" "}
                        <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={education.college}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                college: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your college/university name"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Course/Program <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={education.course}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                course: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Computer Science, Mechanical Engineering"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Degree Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={education.degree}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                degree: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Degree</option>
                        {degreeOptions.map((group, groupIndex) => (
                            <optgroup key={groupIndex} label={group.label}>
                                {group.options.map((degree) => (
                                    <option
                                        key={degree.value}
                                        value={degree.value}
                                    >
                                        {degree.label}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Current Year <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="8"
                        value={education.year}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                year: parseInt(e.target.value),
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Current academic year"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        CGPA (out of 10)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={education.cgpa}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                cgpa: parseFloat(e.target.value),
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your CGPA"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Percentage (%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={education.percentage}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                percentage: parseFloat(e.target.value),
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your percentage"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Specialization
                    </label>
                    <input
                        type="text"
                        value={education.specialization}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                specialization: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Artificial Intelligence, Data Science"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Expected Graduation{" "}
                        <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="date"
                        value={education.expectedGraduation}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                expectedGraduation: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );

    const renderTechnicalTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
                Technical Information
            </h3>

            {/* Skills Section */}
            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Skills <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a skill and press Enter"
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                        <FaPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {technical.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                        >
                            {skill}
                            <button
                                onClick={() => removeSkill(skill)}
                                className="text-blue-200 hover:text-white"
                            >
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        GitHub Profile <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="url"
                        value={technical.github}
                        onChange={(e) =>
                            setTechnical({
                                ...technical,
                                github: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://github.com/yourusername"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        LinkedIn Profile <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="url"
                        value={technical.linkedin}
                        onChange={(e) =>
                            setTechnical({
                                ...technical,
                                linkedin: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourusername"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Portfolio Website
                    </label>
                    <input
                        type="url"
                        value={technical.portfolio}
                        onChange={(e) =>
                            setTechnical({
                                ...technical,
                                portfolio: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourportfolio.com"
                    />
                </div>
            </div>
        </div>
    );

    const renderIdentityTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
                Identity Verification
            </h3>

            {/* Guidelines with Visual Example */}
            <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="text-blue-300 font-medium mb-3">
                                Document Upload Guidelines
                            </h4>
                            <ul className="text-blue-200 text-sm space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Upload clear, readable images of your
                                    identity document
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Accepted formats:{" "}
                                    <strong>JPG, PNG, WEBP, GIF only</strong>{" "}
                                    (max 2MB)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Document should be valid and not expired
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Ensure all text is clearly visible and not
                                    blurred
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Personal details should match your profile
                                    information
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h5 className="text-blue-300 font-medium mb-3 text-center">
                            Example: How to Upload Your ID Card
                        </h5>
                        <img
                            src={idCardHelp}
                            alt="ID Card Upload Guidelines"
                            className="max-w-full h-auto rounded-lg shadow-lg border border-blue-600"
                        />
                        <p className="text-blue-200 text-xs mt-2 text-center">
                            📸 Take a clear photo like the examples above
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Document Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={identityProof.documentType}
                        onChange={(e) =>
                            setIdentityProof({
                                ...identityProof,
                                documentType: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Document Type</option>
                        {documentTypes.map((doc) => (
                            <option key={doc.value} value={doc.value}>
                                {doc.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Document Number <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={identityProof.documentNumber}
                        onChange={(e) =>
                            setIdentityProof({
                                ...identityProof,
                                documentNumber: e.target.value,
                            })
                        }
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter document number"
                    />
                </div>
            </div>

            {/* File Upload */}
            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Upload Document <span className="text-red-400">*</span>
                </label>

                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8">
                    {identityPreview || selectedIdentityFile ? (
                        <div className="text-center">
                            {selectedIdentityFile ? (
                                // Show preview for locally selected file
                                <>
                                    <img
                                        src={identityPreview}
                                        alt="Identity Document Preview"
                                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-4"
                                    />
                                    <p className="text-blue-400 mb-4">
                                        <FaInfoCircle className="inline mr-2" />
                                        Image selected. Will be uploaded when
                                        you submit the application.
                                    </p>
                                </>
                            ) : identityPreview ? (
                                // Show preview for already uploaded file
                                <>
                                    <img
                                        src={identityPreview}
                                        alt="Identity Document"
                                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-4"
                                    />
                                    <p className="text-green-400 mb-4">
                                        <FaCheckCircle className="inline mr-2" />
                                        Document uploaded successfully
                                    </p>
                                </>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                            >
                                <FaUpload className="inline mr-2" />
                                {selectedIdentityFile || identityPreview
                                    ? "Replace Document"
                                    : "Upload Document"}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <FaUpload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">
                                Drag and drop your document here, or click to
                                browse
                            </p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={
                                    !identityProof.documentType ||
                                    !identityProof.documentNumber
                                }
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                            >
                                <FaUpload className="inline mr-2" />
                                Choose File
                            </button>
                            {(!identityProof.documentType ||
                                !identityProof.documentNumber) && (
                                <p className="text-yellow-400 text-sm mt-2">
                                    Please select document type and enter
                                    document number first
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleIdentityUpload(e.target.files[0])}
                    className="hidden"
                />
            </div>

            {/* College ID Proof Section */}
            <div className="border-t border-gray-700 pt-6 mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">
                    College ID Verification
                </h4>

                {/* College ID Guidelines */}
                <div className="bg-green-900 bg-opacity-50 border border-green-700 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-green-400 mt-1 flex-shrink-0" />
                        <div>
                            <h5 className="text-green-300 font-medium mb-2">
                                College ID Guidelines
                            </h5>
                            <ul className="text-green-200 text-sm space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Upload a clear, readable image of your
                                    college ID card
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Accepted formats:{" "}
                                    <strong>JPG, PNG, WEBP, GIF only</strong>{" "}
                                    (max 2MB)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    ID should be current and valid
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Ensure all text and photo are clearly
                                    visible
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    College name and your details should be
                                    legible
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            College ID Number (Roll. No){" "}
                            <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={collegeIdProof.documentNumber}
                            onChange={(e) =>
                                setCollegeIdProof({
                                    ...collegeIdProof,
                                    documentNumber: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your college ID number"
                        />
                    </div>

                    {/* College ID File Upload */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Upload College ID{" "}
                            <span className="text-red-400">*</span>
                        </label>

                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8">
                            {collegeIdPreview || selectedCollegeIdFile ? (
                                <div className="text-center">
                                    {selectedCollegeIdFile ? (
                                        // Show preview for locally selected file
                                        <>
                                            <img
                                                src={collegeIdPreview}
                                                alt="College ID Preview"
                                                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-4"
                                            />
                                            <p className="text-blue-400 mb-4">
                                                <FaInfoCircle className="inline mr-2" />
                                                College ID image selected. Will
                                                be uploaded when you submit the
                                                application.
                                            </p>
                                        </>
                                    ) : collegeIdPreview ? (
                                        // Show preview for already uploaded file
                                        <>
                                            <img
                                                src={collegeIdPreview}
                                                alt="College ID"
                                                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-4"
                                            />
                                            <p className="text-green-400 mb-4">
                                                <FaCheckCircle className="inline mr-2" />
                                                College ID uploaded successfully
                                            </p>
                                        </>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input =
                                                document.createElement("input");
                                            input.type = "file";
                                            input.accept = "image/*";
                                            input.onchange = (e) =>
                                                handleCollegeIdUpload(
                                                    e.target.files[0]
                                                );
                                            input.click();
                                        }}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                    >
                                        <FaUpload className="inline mr-2" />
                                        {selectedCollegeIdFile ||
                                        collegeIdPreview
                                            ? "Replace College ID"
                                            : "Upload College ID"}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <FaUpload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400 mb-4">
                                        Drag and drop your college ID here, or
                                        click to browse
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input =
                                                document.createElement("input");
                                            input.type = "file";
                                            input.accept = "image/*";
                                            input.onchange = (e) =>
                                                handleCollegeIdUpload(
                                                    e.target.files[0]
                                                );
                                            input.click();
                                        }}
                                        disabled={
                                            !collegeIdProof.documentNumber
                                        }
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                                    >
                                        <FaUpload className="inline mr-2" />
                                        Choose College ID File
                                    </button>
                                    {!collegeIdProof.documentNumber && (
                                        <p className="text-yellow-400 text-sm mt-2">
                                            Please enter college ID number first
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderApplicationStatus = () => {
        if (!applicationData || !applicationStatus) return null;

        const getStatusColor = (status) => {
            switch (status) {
                case "approved":
                    return "text-green-400 bg-green-900 border-green-700";
                case "rejected":
                    return "text-red-400 bg-red-900 border-red-700";
                case "under_review":
                    return "text-blue-400 bg-blue-900 border-blue-700";
                case "submitted":
                    return "text-blue-400 bg-blue-900 border-blue-700";
                default:
                    return "text-gray-400 bg-gray-900 border-gray-700";
            }
        };

        const getStatusIcon = (status) => {
            switch (status) {
                case "approved":
                    return <FaCheckCircle className="w-8 h-8" />;
                case "rejected":
                    return <FaTimes className="w-8 h-8" />;
                case "under_review":
                    return <FaClock className="w-8 h-8" />;
                case "submitted":
                    return <FaPaperPlane className="w-8 h-8" />;
                default:
                    return <FaFileAlt className="w-8 h-8" />;
            }
        };

        const getStatusMessage = (status) => {
            switch (status) {
                case "approved":
                    return "Application Accepted! Kindly sign out and login again to continue with student role.";
                case "rejected":
                    return "Your application has been rejected. You can submit a new application.";
                case "under_review":
                    return "Your application is currently under review.";
                case "submitted":
                    return "Your application has been submitted successfully and is being reviewed.";
                default:
                    return "Your application is in draft status.";
            }
        };

        return (
            <div className="max-w-4xl mx-auto">
                <div
                    className={`border-2 rounded-xl p-8 text-center relative ${getStatusColor(
                        applicationStatus
                    )}`}
                >
                    {/* Status Badge in Top Right */}
                    <div className="absolute top-4 right-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(
                                applicationStatus
                            )} border`}
                        >
                            {applicationStatus}
                        </span>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        {getStatusIcon(applicationStatus)}
                        <h2 className="text-2xl font-bold capitalize">
                            Application {applicationStatus}
                        </h2>
                        <p className="text-lg">
                            {getStatusMessage(applicationStatus)}
                        </p>

                        {/* Additional Information for Submitted/Under Review Applications */}
                        {(applicationStatus === "submitted" ||
                            applicationStatus === "under_review") && (
                            <div className="mt-4 max-w-md">
                                <div className="text-sm space-y-3">
                                    <p className="font-medium flex items-center justify-center">
                                        <FaClock className="mr-2 text-blue-300" />
                                        Maximum Review Time: 3 days
                                    </p>
                                    <p className="font-medium flex items-center justify-center">
                                        <FaEnvelope className="mr-2 text-blue-300" />
                                        For queries contact:
                                        <a
                                            href="mailto:axiondigitaltech@gmail.com"
                                            className="text-blue-300 hover:text-blue-200 underline ml-1"
                                        >
                                            axiondigitaltech@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Approved Application Message */}
                        {applicationStatus === "approved" && (
                            <div className="mt-4 max-w-md">
                                <div className="text-sm space-y-3">
                                    <p className="font-medium flex items-center justify-center text-green-300">
                                        <FaCheckCircle className="mr-2" />
                                        Welcome to AXION as a Student!
                                    </p>
                                    <p className="font-medium flex items-center justify-center">
                                        <FaSignOutAlt className="mr-2 text-green-300" />
                                        Please log out and log back in to access
                                        student features
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Rejected Application Details */}
                        {applicationStatus === "rejected" &&
                            applicationData.reviewComments && (
                                <div className="mt-4 max-w-md">
                                    <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4">
                                        <h4 className="text-red-300 font-medium mb-2">
                                            Rejection Reason:
                                        </h4>
                                        <p className="text-red-200 text-sm">
                                            {applicationData.reviewComments}
                                        </p>
                                    </div>
                                </div>
                            )}

                        {applicationData.submittedAt && (
                            <p className="text-sm opacity-80">
                                Submitted on:{" "}
                                {new Date(
                                    applicationData.submittedAt
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        )}

                        {applicationStatus === "rejected" && (
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setShowForm(true);
                                        setApplicationStatus("draft");
                                        // Reset form data for new application
                                        setPersonalInfo({
                                            fullName: "",
                                            email: "",
                                            phone: "",
                                            dateOfBirth: "",
                                            gender: "",
                                            address: {
                                                street: "",
                                                city: "",
                                                state: "",
                                                pincode: "",
                                                country: "India",
                                            },
                                        });
                                        setEducation({
                                            college: "",
                                            course: "",
                                            degree: "",
                                            year: new Date().getFullYear(),
                                            cgpa: "",
                                            percentage: "",
                                            specialization: "",
                                            expectedGraduation: "",
                                        });
                                        setTechnical({
                                            skills: [],
                                            programmingLanguages: [],
                                            frameworks: [],
                                            tools: [],
                                            projects: [],
                                            github: "",
                                            linkedin: "",
                                            portfolio: "",
                                        });
                                        setIdentityProof({
                                            documentType: "",
                                            documentNumber: "",
                                            documentImage: null,
                                        });
                                        setApplicationDetails({
                                            reasonForApplying: "",
                                            careerGoals: "",
                                            experience: "",
                                            achievements: [],
                                            references: [],
                                        });
                                        setIdentityPreview(null);
                                        setSelectedIdentityFile(null);
                                        populateFromUserProfile();
                                        toast.success(
                                            "You can now submit a new application."
                                        );
                                    }}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Submit New Application
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {applicationData && applicationStatus !== "rejected" && (
                    <div className="mt-8 bg-gray-800 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Application Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                            <div>
                                <h4 className="font-medium text-white mb-2">
                                    Personal Information
                                </h4>
                                <p>
                                    Name:{" "}
                                    {applicationData.personalInfo?.fullName}
                                </p>
                                <p>
                                    Email: {applicationData.personalInfo?.email}
                                </p>
                                <p>
                                    Phone: {applicationData.personalInfo?.phone}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-2">
                                    Education
                                </h4>
                                <p>
                                    College:{" "}
                                    {applicationData.education?.college}
                                </p>
                                <p>
                                    Course: {applicationData.education?.course}
                                </p>
                                <p>
                                    Degree: {applicationData.education?.degree}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderApplicationTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
                Application Details
            </h3>

            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Why do you want to join as a student?{" "}
                    <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={applicationDetails.reasonForApplying}
                    onChange={(e) =>
                        setApplicationDetails({
                            ...applicationDetails,
                            reasonForApplying: e.target.value,
                        })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Explain your motivation and reasons for applying..."
                />
            </div>

            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Career Goals <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={applicationDetails.careerGoals}
                    onChange={(e) =>
                        setApplicationDetails({
                            ...applicationDetails,
                            careerGoals: e.target.value,
                        })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe your short-term and long-term career goals..."
                />
            </div>

            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Previous Experience (Optional)
                </label>
                <textarea
                    value={applicationDetails.experience}
                    onChange={(e) =>
                        setApplicationDetails({
                            ...applicationDetails,
                            experience: e.target.value,
                        })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe any relevant work experience, internships, or projects..."
                />
            </div>

            {/* Achievements Section */}
            <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Achievements & Awards
                </label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={achievementInput}
                        onChange={(e) => setAchievementInput(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && addAchievement()
                        }
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add an achievement and press Enter"
                    />
                    <button
                        type="button"
                        onClick={addAchievement}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                        <FaPlus />
                    </button>
                </div>
                <div className="space-y-2">
                    {applicationDetails.achievements.map(
                        (achievement, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"
                            >
                                <span className="flex-1 text-gray-300">
                                    {achievement}
                                </span>
                                <button
                                    onClick={() => removeAchievement(index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case "personal":
                return renderPersonalInfoTab();
            case "education":
                return renderEducationTab();
            case "technical":
                return renderTechnicalTab();
            case "identity":
                return renderIdentityTab();
            case "application":
                return renderApplicationTab();
            default:
                return renderPersonalInfoTab();
        }
    };

    // Check if user is logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Please Log In
                    </h2>
                    <p className="text-gray-400 mb-6">
                        You need to be logged in to access the student
                        application form.
                    </p>
                    <button
                        onClick={() => navigate("/signin")}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your application...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Show status page if application is submitted, under review, approved, or rejected (but rejected can still show form) */}
                {!showForm &&
                applicationStatus &&
                applicationStatus !== "draft" ? (
                    <div>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Student Application Status
                            </h1>
                            <p className="text-gray-400">
                                Track your application progress
                            </p>
                        </div>
                        {renderApplicationStatus()}
                    </div>
                ) : (
                    <div>
                        {/* Header Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Apply for Student Status
                            </h1>
                            <p className="text-gray-400">
                                Complete your profile to apply for student
                                membership
                            </p>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-300">
                                        Profile Completion
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                        {profileCompletion.percentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-300 ${
                                            profileCompletion.percentage === 100
                                                ? "bg-green-500"
                                                : profileCompletion.percentage >=
                                                  75
                                                ? "bg-yellow-500"
                                                : "bg-blue-500"
                                        }`}
                                        style={{
                                            width: `${profileCompletion.percentage}%`,
                                        }}
                                    ></div>
                                </div>

                                {profileCompletion.percentage < 100 && (
                                    <div className="mt-4 p-4 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-lg">
                                        <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                                            <FaExclamationTriangle />
                                            <span>
                                                Complete all required fields to
                                                submit your application
                                            </span>
                                        </div>
                                        {profileCompletion.missingFields &&
                                        profileCompletion.missingFields.length >
                                            0 ? (
                                            <div className="text-yellow-200 text-xs">
                                                <strong>Missing fields:</strong>{" "}
                                                {profileCompletion.missingFields.join(
                                                    ", "
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-yellow-200 text-xs">
                                                <strong>
                                                    Required fields include:
                                                </strong>{" "}
                                                Personal information, education
                                                details, at least one skill,
                                                identity document upload, reason
                                                for applying, and career goals.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {profileCompletion.percentage === 100 && (
                                    <div className="mt-4 p-4 bg-green-900 bg-opacity-50 border border-green-700 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-400 text-sm">
                                            <FaCheckCircle />
                                            <span>
                                                Your application is complete and
                                                ready to submit!
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rejection Status Banner - Always visible when rejected */}
                        {applicationStatus === "rejected" && (
                            <div className="mb-8 p-6 bg-red-900 bg-opacity-50 border border-red-700 rounded-xl">
                                <div className="flex items-start gap-4">
                                    <FaTimes className="text-red-400 text-2xl mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="text-red-300 font-semibold mb-2">
                                            Previous Application Rejected
                                        </h3>
                                        <p className="text-red-200 mb-3">
                                            Your previous application was not
                                            approved. You can submit a new
                                            application below.
                                        </p>
                                        {applicationData?.reviewComments && (
                                            <div className="bg-red-800 bg-opacity-50 border border-red-600 rounded-lg p-4">
                                                <h4 className="text-red-300 font-medium mb-2">
                                                    Rejection Reason:
                                                </h4>
                                                <p className="text-red-200 text-sm">
                                                    {
                                                        applicationData.reviewComments
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar Navigation */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800 rounded-xl p-6 sticky top-8">
                                    <nav className="space-y-2">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() =>
                                                        setActiveTab(tab.id)
                                                    }
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                                                        activeTab === tab.id
                                                            ? "bg-blue-600 text-white"
                                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">
                                                        {tab.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </nav>

                                    {/* Action Buttons */}
                                    <div className="mt-6 space-y-3">
                                        {/* Save Application */}
                                        <button
                                            onClick={saveApplication}
                                            disabled={loading || isAutoSaving}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white rounded-lg transition-colors duration-200"
                                        >
                                            {loading || isAutoSaving ? (
                                                <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full"></div>
                                            ) : (
                                                <FaSave />
                                            )}
                                            {loading || isAutoSaving
                                                ? "Saving..."
                                                : "Save Application"}
                                        </button>

                                        <button
                                            onClick={submitApplication}
                                            disabled={
                                                loading ||
                                                profileCompletion.percentage <
                                                    100
                                            }
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                                        >
                                            <FaPaperPlane />
                                            Submit Application
                                        </button>

                                        {profileCompletion.percentage ===
                                            100 && (
                                            <div className="flex items-center gap-2 text-green-400 text-sm">
                                                <FaCheckCircle />
                                                <span>Ready to submit!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                <div className="bg-gray-800 rounded-xl p-8">
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyForStudent;
