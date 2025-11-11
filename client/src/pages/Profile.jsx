import { useState, useEffect, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import toast from "react-hot-toast";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaGraduationCap,
    FaCamera,
    FaEdit,
    FaSave,
    FaTimes,
    FaEye,
    FaEyeSlash,
    FaLock,
    FaCalendarAlt,
    FaBuilding,
    FaLinkedin,
    FaGithub,
    FaCog,
    FaShieldAlt,
} from "react-icons/fa";
import api from "../utils/api";

function Profile() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        dateOfBirth: "",
        location: "",
        college: "",
        course: "",
        degree: "",
        year: "",
        skills: "",
        linkedin: "",
        github: "",
        profilePicture: null,
    });
    const [skillsArray, setSkillsArray] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);

    // Fetch fresh profile data from backend when component loads
    useEffect(() => {
        const fetchFreshProfileData = async () => {
            try {
                setLoading(true);
                const response = await api.get("/auth/profile");
                const freshUserData = response.data.user;
                console.log("Fresh user data from backend:", freshUserData);

                // Update the user context with fresh data
                updateUser(freshUserData);

                // Initialize profile form with fresh data
                setProfileData({
                    name: freshUserData.username || "",
                    email: freshUserData.email || "",
                    phone: freshUserData.phone || "",
                    bio: freshUserData.bio || "",
                    dateOfBirth: freshUserData.dateOfBirth
                        ? freshUserData.dateOfBirth.split("T")[0]
                        : "",
                    location:
                        freshUserData.location || freshUserData.city || "",
                    college: freshUserData.college || "",
                    course: freshUserData.course || "",
                    degree: freshUserData.degree || "",
                    year: freshUserData.year || "",
                    skills: Array.isArray(freshUserData.skills)
                        ? freshUserData.skills.join(", ")
                        : "",
                    linkedin: freshUserData.socialLinks?.linkedin || "",
                    github: freshUserData.socialLinks?.github || "",
                    profilePicture: freshUserData.profilePicture || null,
                });

                // Initialize skills array for tag-based input
                setSkillsArray(
                    Array.isArray(freshUserData.skills)
                        ? freshUserData.skills
                        : []
                );

                // Handle profile picture URL
                let profileImageUrl = null;
                if (freshUserData.profilePicture) {
                    profileImageUrl = freshUserData.profilePicture.startsWith(
                        "data:"
                    )
                        ? freshUserData.profilePicture
                        : `${import.meta.env.VITE_API_BASE_URL}${
                              freshUserData.profilePicture
                          }`;
                }
                setPreviewImage(profileImageUrl);
            } catch (error) {
                console.error("Failed to fetch fresh profile data:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        // Fetch fresh data on component mount
        fetchFreshProfileData();
    }, []); // Empty dependency array - only run on mount

    // Also initialize from user context if it exists (fallback)
    useEffect(() => {
        if (user) {
            console.log("Fallback - using cached user data:", user);

            setProfileData({
                name: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                bio: user.bio || "",
                dateOfBirth: user.dateOfBirth
                    ? user.dateOfBirth.split("T")[0]
                    : "",
                location: user.location || user.city || "",
                college: user.college || "",
                course: user.course || "",
                degree: user.degree || "",
                year: user.year || "",
                skills: Array.isArray(user.skills)
                    ? user.skills.join(", ")
                    : "",
                linkedin: user.socialLinks?.linkedin || "",
                github: user.socialLinks?.github || "",
                profilePicture: user.profilePicture || null,
            });
            // Initialize skills array for tag-based input
            setSkillsArray(Array.isArray(user.skills) ? user.skills : []);
            // Handle profile picture URL
            let profileImageUrl = null;
            if (user.profilePicture) {
                // Check if it's base64 or file path
                profileImageUrl = user.profilePicture.startsWith("data:")
                    ? user.profilePicture
                    : `${import.meta.env.VITE_API_BASE_URL}${
                          user.profilePicture
                      }`;
            }
            setPreviewImage(profileImageUrl);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith("image/")) {
                toast.error(
                    "Please select a valid image file (JPG, PNG, GIF, or WebP)"
                );
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Please select an image smaller than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result?.toString() || "");
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        setCrop(
            centerCrop(
                makeAspectCrop(
                    {
                        unit: "%",
                        width: 90,
                    },
                    1,
                    width,
                    height
                ),
                width,
                height
            )
        );
    }

    // Canvas utility function for drawing cropped image
    function drawImageOnCanvas(canvas, image, crop, scale = 1, rotate = 0) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = "high";

        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;

        const centerX = image.naturalWidth / 2;
        const centerY = image.naturalHeight / 2;

        ctx.save();

        ctx.translate(-cropX, -cropY);
        ctx.translate(centerX, centerY);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight
        );

        ctx.restore();
    }

    const handleCropComplete = async () => {
        if (
            imageRef.current &&
            previewCanvasRef.current &&
            completedCrop &&
            completedCrop.width &&
            completedCrop.height
        ) {
            drawImageOnCanvas(
                previewCanvasRef.current,
                imageRef.current,
                completedCrop,
                scale,
                rotate
            );

            // Convert to base64
            const croppedBase64 = previewCanvasRef.current.toDataURL(
                "image/jpeg",
                0.8
            );

            setProfileData((prev) => ({
                ...prev,
                profilePicture: croppedBase64,
            }));
            setPreviewImage(croppedBase64);
            setShowCropModal(false);
        }
    };

    const removePicture = () => {
        setProfileData((prev) => ({
            ...prev,
            profilePicture: null,
        }));
        setPreviewImage(null);
        setImageSrc("");
        setCrop(undefined);
        setCompletedCrop(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const makeSquareCrop = () => {
        if (imageRef.current) {
            const { width, height } = imageRef.current;
            setCrop(
                centerCrop(
                    makeAspectCrop(
                        {
                            unit: "%",
                            width: 50,
                        },
                        1, // Square aspect ratio
                        width,
                        height
                    ),
                    width,
                    height
                )
            );
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // Use exact same JSON approach as Signup.jsx
            const updateData = {
                name: profileData.name,
                phone: profileData.phone,
                bio: profileData.bio,
                dateOfBirth: profileData.dateOfBirth,
                location: profileData.location,
                college: profileData.college,
                course: profileData.course,
                degree: profileData.degree,
                year: profileData.year,
                skills: skillsArray, // Use skillsArray instead of parsing comma-separated string
                socialLinks: {
                    linkedin: profileData.linkedin,
                    github: profileData.github,
                },
                profilePicture: profileData.profilePicture, // Send base64 directly like in signup
            };

            const response = await api.put("/auth/profile", updateData);

            updateUser(response.data.user);

            // Re-initialize form data with updated user data
            const updatedUser = response.data.user;
            setProfileData({
                name: updatedUser.username || "",
                email: updatedUser.email || "",
                phone: updatedUser.phone || "",
                bio: updatedUser.bio || "",
                dateOfBirth: updatedUser.dateOfBirth
                    ? updatedUser.dateOfBirth.split("T")[0]
                    : "",
                location: updatedUser.location || updatedUser.city || "",
                college: updatedUser.college || "",
                course: updatedUser.course || "",
                degree: updatedUser.degree || "",
                year: updatedUser.year || "",
                skills: Array.isArray(updatedUser.skills)
                    ? updatedUser.skills.join(", ")
                    : "",
                linkedin: updatedUser.socialLinks?.linkedin || "",
                github: updatedUser.socialLinks?.github || "",
                profilePicture: updatedUser.profilePicture || null,
            });

            // Re-initialize skills array
            setSkillsArray(
                Array.isArray(updatedUser.skills) ? updatedUser.skills : []
            );

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await api.put("/auth/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            toast.success("Password changed successfully!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Skills management functions
    const addSkill = () => {
        if (skillInput.trim() && !skillsArray.includes(skillInput.trim())) {
            const newSkill = skillInput.trim();
            const updatedSkills = [...skillsArray, newSkill];
            setSkillsArray(updatedSkills);
            setProfileData((prev) => ({
                ...prev,
                skills: updatedSkills.join(", "),
            }));
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        const updatedSkills = skillsArray.filter(
            (skill) => skill !== skillToRemove
        );
        setSkillsArray(updatedSkills);
        setProfileData((prev) => ({
            ...prev,
            skills: updatedSkills.join(", "),
        }));
    };

    const handleSkillInputKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const tabs = [
        { id: "profile", label: "Profile Information", icon: FaUser },
        { id: "security", label: "Security", icon: FaShieldAlt },
    ];

    console.log("User Profile Data:", profileData);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="container mx-auto px-4 sm:px-6 pt-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-6 animate-fadeInUp">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                            Profile Settings
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-gray-700/50 animate-fadeInUp animation-delay-200">
                                <div className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                                    activeTab === tab.id
                                                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                                                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                                }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">
                                                    {tab.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {activeTab === "profile" && (
                                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 animate-fadeInUp animation-delay-300">
                                    {/* Profile Header */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                            <div className="relative group">
                                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 p-1">
                                                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                                        {previewImage ? (
                                                            <img
                                                                src={
                                                                    previewImage
                                                                }
                                                                alt="Profile"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <FaUser className="w-8 h-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                </div>
                                                {isEditing && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                            className="absolute -bottom-2 -right-2 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full transition-colors duration-300 shadow-lg"
                                                        >
                                                            <FaCamera className="w-4 h-4" />
                                                        </button>
                                                        {previewImage && (
                                                            <button
                                                                onClick={
                                                                    removePicture
                                                                }
                                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors duration-300 shadow-lg"
                                                            >
                                                                <FaTimes className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                                    {profileData.name ||
                                                        user?.username ||
                                                        "Your Name"}
                                                </h2>
                                                <p className="text-gray-400">
                                                    {user?.role || "User"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            {!isEditing ? (
                                                <button
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                    Edit Profile
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={
                                                            handleSaveProfile
                                                        }
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                                    >
                                                        <FaSave className="w-4 h-4" />
                                                        {loading
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(false);

                                                            // Reset all form data to original user data
                                                            setProfileData({
                                                                name:
                                                                    user?.username ||
                                                                    "",
                                                                email:
                                                                    user?.email ||
                                                                    "",
                                                                phone:
                                                                    user?.phone ||
                                                                    "",
                                                                bio:
                                                                    user?.bio ||
                                                                    "",
                                                                dateOfBirth:
                                                                    user?.dateOfBirth
                                                                        ? user.dateOfBirth.split(
                                                                              "T"
                                                                          )[0]
                                                                        : "",
                                                                location:
                                                                    user?.location ||
                                                                    user?.city ||
                                                                    "",
                                                                college:
                                                                    user?.college ||
                                                                    "",
                                                                course:
                                                                    user?.course ||
                                                                    "",
                                                                degree:
                                                                    user?.degree ||
                                                                    "",
                                                                year:
                                                                    user?.year ||
                                                                    "",
                                                                skills: Array.isArray(
                                                                    user?.skills
                                                                )
                                                                    ? user.skills.join(
                                                                          ", "
                                                                      )
                                                                    : "",
                                                                linkedin:
                                                                    user
                                                                        ?.socialLinks
                                                                        ?.linkedin ||
                                                                    "",
                                                                github:
                                                                    user
                                                                        ?.socialLinks
                                                                        ?.github ||
                                                                    "",
                                                                profilepic:
                                                                    user?.profilePicture ||
                                                                    user?.profilepic ||
                                                                    null,
                                                            });

                                                            // Reset skills array
                                                            setSkillsArray(
                                                                Array.isArray(
                                                                    user?.skills
                                                                )
                                                                    ? user.skills
                                                                    : []
                                                            );

                                                            // Reset profile image
                                                            let profileImageUrl =
                                                                null;
                                                            if (
                                                                user?.profilepic
                                                            ) {
                                                                profileImageUrl =
                                                                    user.profilepic;
                                                            } else if (
                                                                user?.profilePicture
                                                            ) {
                                                                profileImageUrl =
                                                                    user.profilePicture.startsWith(
                                                                        "data:"
                                                                    )
                                                                        ? user.profilePicture
                                                                        : `${
                                                                              import.meta
                                                                                  .env
                                                                                  .VITE_API_BASE_URL
                                                                          }${
                                                                              user.profilePicture
                                                                          }`;
                                                            }
                                                            setPreviewImage(
                                                                profileImageUrl
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300"
                                                    >
                                                        <FaTimes className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Profile Form */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Personal Information */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <FaUser className="w-5 h-5 text-cyan-400" />
                                                Personal Information
                                            </h3>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profileData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={
                                                            profileData.email
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        disabled={true} // Email should not be editable
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 opacity-50"
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={
                                                            profileData.phone
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        disabled={!isEditing}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                        placeholder="+91 9876543210"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Date of Birth
                                                </label>
                                                <div className="relative">
                                                    <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={
                                                            profileData.dateOfBirth
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        disabled={!isEditing}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Location
                                                </label>
                                                <div className="relative">
                                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={
                                                            profileData.location
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        disabled={!isEditing}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                        placeholder="City, State, Country"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic & Professional */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <FaGraduationCap className="w-5 h-5 text-cyan-400" />
                                                Academic Information
                                            </h3>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    College/University
                                                </label>
                                                <div className="relative">
                                                    <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        name="college"
                                                        value={
                                                            profileData.college
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        disabled={!isEditing}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                        placeholder="Your College/University"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Degree
                                                </label>
                                                <select
                                                    name="degree"
                                                    value={profileData.degree}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    <option value="">
                                                        Select Degree
                                                    </option>
                                                    <optgroup label="Bachelor's Degrees">
                                                        <option value="B.E. (Bachelor of Engineering)">
                                                            B.E. (Bachelor of
                                                            Engineering)
                                                        </option>
                                                        <option value="B.Tech (Bachelor of Technology)">
                                                            B.Tech (Bachelor of
                                                            Technology)
                                                        </option>
                                                        <option value="B.Sc (Bachelor of Science)">
                                                            B.Sc (Bachelor of
                                                            Science)
                                                        </option>
                                                        <option value="B.A (Bachelor of Arts)">
                                                            B.A (Bachelor of
                                                            Arts)
                                                        </option>
                                                        <option value="B.Com (Bachelor of Commerce)">
                                                            B.Com (Bachelor of
                                                            Commerce)
                                                        </option>
                                                        <option value="BBA (Bachelor of Business Administration)">
                                                            BBA (Bachelor of
                                                            Business
                                                            Administration)
                                                        </option>
                                                        <option value="BCA (Bachelor of Computer Applications)">
                                                            BCA (Bachelor of
                                                            Computer
                                                            Applications)
                                                        </option>
                                                        <option value="B.Arch (Bachelor of Architecture)">
                                                            B.Arch (Bachelor of
                                                            Architecture)
                                                        </option>
                                                        <option value="MBBS (Bachelor of Medicine)">
                                                            MBBS (Bachelor of
                                                            Medicine)
                                                        </option>
                                                        <option value="LLB (Bachelor of Law)">
                                                            LLB (Bachelor of
                                                            Law)
                                                        </option>
                                                    </optgroup>
                                                    <optgroup label="Master's Degrees">
                                                        <option value="M.E. (Master of Engineering)">
                                                            M.E. (Master of
                                                            Engineering)
                                                        </option>
                                                        <option value="M.Tech (Master of Technology)">
                                                            M.Tech (Master of
                                                            Technology)
                                                        </option>
                                                        <option value="M.Sc (Master of Science)">
                                                            M.Sc (Master of
                                                            Science)
                                                        </option>
                                                        <option value="M.A (Master of Arts)">
                                                            M.A (Master of Arts)
                                                        </option>
                                                        <option value="M.Com (Master of Commerce)">
                                                            M.Com (Master of
                                                            Commerce)
                                                        </option>
                                                        <option value="MBA (Master of Business Administration)">
                                                            MBA (Master of
                                                            Business
                                                            Administration)
                                                        </option>
                                                        <option value="MCA (Master of Computer Applications)">
                                                            MCA (Master of
                                                            Computer
                                                            Applications)
                                                        </option>
                                                        <option value="M.Arch (Master of Architecture)">
                                                            M.Arch (Master of
                                                            Architecture)
                                                        </option>
                                                        <option value="LLM (Master of Law)">
                                                            LLM (Master of Law)
                                                        </option>
                                                    </optgroup>
                                                    <optgroup label="Doctoral Degrees">
                                                        <option value="Ph.D (Doctor of Philosophy)">
                                                            Ph.D (Doctor of
                                                            Philosophy)
                                                        </option>
                                                        <option value="D.Sc (Doctor of Science)">
                                                            D.Sc (Doctor of
                                                            Science)
                                                        </option>
                                                        <option value="D.Litt (Doctor of Literature)">
                                                            D.Litt (Doctor of
                                                            Literature)
                                                        </option>
                                                    </optgroup>
                                                    <optgroup label="Other Qualifications">
                                                        <option value="Diploma">
                                                            Diploma
                                                        </option>
                                                        <option value="Certificate">
                                                            Certificate
                                                        </option>
                                                        <option value="Associate Degree">
                                                            Associate Degree
                                                        </option>
                                                        <option value="Professional Certificate">
                                                            Professional
                                                            Certificate
                                                        </option>
                                                        <option value="ITI (Industrial Training Institute)">
                                                            ITI (Industrial
                                                            Training Institute)
                                                        </option>
                                                        <option value="Polytechnic">
                                                            Polytechnic
                                                        </option>
                                                    </optgroup>
                                                    <option value="Other">
                                                        Other
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Course/Specialization
                                                </label>
                                                <input
                                                    type="text"
                                                    name="course"
                                                    value={profileData.course}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                    placeholder="e.g., Computer Science Engineering, Information Technology"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Year of Study
                                                </label>
                                                <select
                                                    name="year"
                                                    value={profileData.year}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                >
                                                    <option value="">
                                                        Select Year
                                                    </option>
                                                    <option value="1st Year">
                                                        1st Year
                                                    </option>
                                                    <option value="2nd Year">
                                                        2nd Year
                                                    </option>
                                                    <option value="3rd Year">
                                                        3rd Year
                                                    </option>
                                                    <option value="4th Year">
                                                        4th Year
                                                    </option>
                                                    <option value="Graduate">
                                                        Graduate
                                                    </option>
                                                    <option value="Post Graduate">
                                                        Post Graduate
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Skills
                                                </label>

                                                {/* Skills Tags Display */}
                                                {skillsArray.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {skillsArray.map(
                                                            (skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30"
                                                                >
                                                                    {skill}
                                                                    {isEditing && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeSkill(
                                                                                    skill
                                                                                )
                                                                            }
                                                                            className="ml-1 text-cyan-400 hover:text-red-400 transition-colors duration-200"
                                                                        >
                                                                            <FaTimes className="w-3 h-3" />
                                                                        </button>
                                                                    )}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                {/* Skills Input - Only show when editing */}
                                                {isEditing && (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={skillInput}
                                                            onChange={(e) =>
                                                                setSkillInput(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            onKeyPress={
                                                                handleSkillInputKeyPress
                                                            }
                                                            className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300"
                                                            placeholder="Add a skill (Press Enter or click Add)"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={addSkill}
                                                            className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-medium"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Read-only display when not editing */}
                                                {!isEditing &&
                                                    skillsArray.length ===
                                                        0 && (
                                                        <div className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-400">
                                                            No skills added yet
                                                        </div>
                                                    )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    LinkedIn Profile
                                                </label>
                                                <div className="relative">
                                                    <FaLinkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="url"
                                                        name="linkedin"
                                                        value={
                                                            profileData.linkedin
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        disabled={!isEditing}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                        placeholder="https://linkedin.com/in/yourprofile"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    GitHub Profile
                                                </label>
                                                <div className="relative">
                                                    <FaGithub className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="url"
                                                        name="github"
                                                        value={
                                                            profileData.github
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        disabled={!isEditing}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50"
                                                        placeholder="https://github.com/yourusername"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio - Full Width */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                name="bio"
                                                value={profileData.bio}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300 disabled:opacity-50 resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>

                                        {/* Bottom Save/Cancel Buttons - Show only when editing */}
                                        {isEditing && (
                                            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-700/50">
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);

                                                        // Reset all form data to original user data
                                                        setProfileData({
                                                            name:
                                                                user?.username ||
                                                                "",
                                                            email:
                                                                user?.email ||
                                                                "",
                                                            phone:
                                                                user?.phone ||
                                                                "",
                                                            bio:
                                                                user?.bio || "",
                                                            dateOfBirth:
                                                                user?.dateOfBirth
                                                                    ? user.dateOfBirth.split(
                                                                          "T"
                                                                      )[0]
                                                                    : "",
                                                            location:
                                                                user?.location ||
                                                                user?.city ||
                                                                "",
                                                            college:
                                                                user?.college ||
                                                                "",
                                                            course:
                                                                user?.course ||
                                                                "",
                                                            degree:
                                                                user?.degree ||
                                                                "",
                                                            year:
                                                                user?.year ||
                                                                "",
                                                            skills: Array.isArray(
                                                                user?.skills
                                                            )
                                                                ? user.skills.join(
                                                                      ", "
                                                                  )
                                                                : "",
                                                            linkedin:
                                                                user
                                                                    ?.socialLinks
                                                                    ?.linkedin ||
                                                                "",
                                                            github:
                                                                user
                                                                    ?.socialLinks
                                                                    ?.github ||
                                                                "",
                                                            profilepic:
                                                                user?.profilePicture ||
                                                                user?.profilepic ||
                                                                null,
                                                        });

                                                        // Reset skills array
                                                        setSkillsArray(
                                                            Array.isArray(
                                                                user?.skills
                                                            )
                                                                ? user.skills
                                                                : []
                                                        );

                                                        // Reset profile image
                                                        let profileImageUrl =
                                                            null;
                                                        if (user?.profilepic) {
                                                            profileImageUrl =
                                                                user.profilepic;
                                                        } else if (
                                                            user?.profilePicture
                                                        ) {
                                                            profileImageUrl =
                                                                user.profilePicture.startsWith(
                                                                    "data:"
                                                                )
                                                                    ? user.profilePicture
                                                                    : `${
                                                                          import.meta
                                                                              .env
                                                                              .VITE_API_BASE_URL
                                                                      }${
                                                                          user.profilePicture
                                                                      }`;
                                                        }
                                                        setPreviewImage(
                                                            profileImageUrl
                                                        );
                                                    }}
                                                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 font-medium"
                                                >
                                                    <FaTimes className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 font-medium"
                                                >
                                                    <FaSave className="w-4 h-4" />
                                                    {loading
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 animate-fadeInUp animation-delay-300">
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                                        <FaLock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                                        Security Settings
                                    </h2>

                                    <div className="max-w-md space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type={
                                                        showPassword.current
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="currentPassword"
                                                    value={
                                                        passwordData.currentPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        togglePasswordVisibility(
                                                            "current"
                                                        )
                                                    }
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                                >
                                                    {showPassword.current ? (
                                                        <FaEyeSlash className="w-4 h-4" />
                                                    ) : (
                                                        <FaEye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type={
                                                        showPassword.new
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="newPassword"
                                                    value={
                                                        passwordData.newPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300"
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        togglePasswordVisibility(
                                                            "new"
                                                        )
                                                    }
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                                >
                                                    {showPassword.new ? (
                                                        <FaEyeSlash className="w-4 h-4" />
                                                    ) : (
                                                        <FaEye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type={
                                                        showPassword.confirm
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="confirmPassword"
                                                    value={
                                                        passwordData.confirmPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:bg-gray-800/80 transition-all duration-300"
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        togglePasswordVisibility(
                                                            "confirm"
                                                        )
                                                    }
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                                >
                                                    {showPassword.confirm ? (
                                                        <FaEyeSlash className="w-4 h-4" />
                                                    ) : (
                                                        <FaEye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleChangePassword}
                                            disabled={
                                                loading ||
                                                !passwordData.currentPassword ||
                                                !passwordData.newPassword ||
                                                !passwordData.confirmPassword
                                            }
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaLock className="w-4 h-4" />
                                            {loading
                                                ? "Changing Password..."
                                                : "Change Password"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Image Cropping Modal */}
                {showCropModal && imageSrc && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-auto shadow-2xl border border-gray-700 animate-slideUp">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        Crop Your Profile Picture
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Adjust the crop area, scale, and
                                        rotation to get the perfect profile
                                        picture
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCropModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                                >
                                    <FaTimes className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-4 flex justify-center">
                                <div className="relative">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) =>
                                            setCrop(percentCrop)
                                        }
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={1} // Square aspect ratio for profile pictures
                                        minWidth={100}
                                        minHeight={100}
                                        className="max-w-full"
                                    >
                                        <img
                                            ref={imageRef}
                                            alt="Crop me"
                                            src={imageSrc}
                                            style={{
                                                transform: `scale(${scale}) rotate(${rotate}deg)`,
                                                maxWidth: "400px",
                                                maxHeight: "400px",
                                            }}
                                            onLoad={onImageLoad}
                                            className="w-full h-auto object-contain rounded-lg"
                                        />
                                    </ReactCrop>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-gray-600 shadow-lg">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="w-4 h-4 text-indigo-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                                />
                                            </svg>
                                            <label className="block text-sm font-semibold text-white">
                                                Scale ({Math.round(scale * 100)}
                                                %)
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="3"
                                                step="0.1"
                                                value={scale}
                                                onChange={(e) =>
                                                    setScale(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider hover:bg-gray-500 transition-colors"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>10%</span>
                                                <span>300%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className="w-4 h-4 text-purple-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            <label className="block text-sm font-semibold text-white">
                                                Rotate ({rotate}°)
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="-180"
                                                max="180"
                                                value={rotate}
                                                onChange={(e) =>
                                                    setRotate(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider hover:bg-gray-500 transition-colors"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>-180°</span>
                                                <span>180°</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hidden canvas for processing cropped image */}
                            <canvas
                                ref={previewCanvasRef}
                                style={{ display: "none" }}
                            />

                            <div className="space-y-4">
                                {/* Quick Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={makeSquareCrop}
                                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                            />
                                        </svg>
                                        Square Crop
                                    </button>
                                    <button
                                        onClick={() => {
                                            setScale(1);
                                            setRotate(0);
                                        }}
                                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Reset
                                    </button>
                                </div>

                                {/* Primary Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowCropModal(false)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 font-medium"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCropComplete}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Apply Crop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
