import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import api from "../utils/api";
import toast from "react-hot-toast";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePicture: "",
        college: "",
        city: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Pre-fill email if passed from homepage
    useEffect(() => {
        if (location.state?.email) {
            setFormData((prev) => ({
                ...prev,
                email: location.state.email,
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleImageSelect = (e) => {
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

    const handleCropComplete = () => {
        if (imageRef.current && originalImage) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = imageRef.current;

            // Set canvas size to crop dimensions
            canvas.width = cropData.width;
            canvas.height = cropData.height;

            // Calculate scale factor
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;

            // Draw cropped image
            ctx.drawImage(
                img,
                cropData.x * scaleX,
                cropData.y * scaleY,
                cropData.width * scaleX,
                cropData.height * scaleY,
                0,
                0,
                cropData.width,
                cropData.height
            );

            // Convert to base64
            const croppedBase64 = canvas.toDataURL("image/jpeg", 0.8);

            setFormData((prev) => ({
                ...prev,
                profilePicture: croppedBase64,
            }));
            setImagePreview(croppedBase64);
            setShowCropModal(false);
        }
    };

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

    const handleNewCropComplete = async () => {
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

            setFormData((prev) => ({
                ...prev,
                profilePicture: croppedBase64,
            }));
            setImagePreview(croppedBase64);
            setShowCropModal(false);
        }
    };

    const removePicture = () => {
        setFormData((prev) => ({
            ...prev,
            profilePicture: "",
        }));
        setImagePreview(null);
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email format is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.college.trim()) {
            newErrors.college = "College is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post("/signup", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                profilePicture: formData.profilePicture,
                college: formData.college,
                city: formData.city,
            });

            if (response.data.success) {
                // Store token and user data in localStorage
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem(
                    "userData",
                    JSON.stringify(response.data.user)
                );

                // Update auth context
                login(response.data.user, response.data.token);

                // Show success message
                toast.success(
                    "Account created successfully! Welcome to AXION!"
                );
                navigate("/"); // Navigate to homepage after successful signup
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Join thousands of students who trust AXION
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-xl shadow-xl p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Profile Picture Upload */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg
                                                className="w-12 h-12 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                ></path>
                                            </svg>
                                        )}
                                    </div>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={removePicture}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
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
                                                    d="M6 18L18 6M6 6l12 12"
                                                ></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                        <svg
                                            className="w-4 h-4 inline mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            ></path>
                                        </svg>
                                        Upload Photo
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    Recommended: Square image, at least
                                    400x400px
                                    <br />
                                    Max file size: 5MB
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Username */}
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        Username *
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your username"
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword.password
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "password"
                                                )
                                            }
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            {showPassword.password ? (
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showPassword.confirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "confirmPassword"
                                                )
                                            }
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            {showPassword.confirmPassword ? (
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* College */}
                                <div>
                                    <label
                                        htmlFor="college"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        College/University *
                                    </label>
                                    <input
                                        id="college"
                                        name="college"
                                        type="text"
                                        value={formData.college}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your college name"
                                    />
                                    {errors.college && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.college}
                                        </p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="block text-sm font-medium text-gray-300 mb-2"
                                    >
                                        City *
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your city"
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center pt-4 border-t border-gray-700">
                                <p className="text-gray-400">
                                    Already have an account?{" "}
                                    <Link
                                        to="/signin"
                                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </form>

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
                                                rotation to get the perfect
                                                profile picture
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setShowCropModal(false)
                                            }
                                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mb-4 flex justify-center">
                                        <div className="relative">
                                            <ReactCrop
                                                crop={crop}
                                                onChange={(_, percentCrop) =>
                                                    setCrop(percentCrop)
                                                }
                                                onComplete={(c) =>
                                                    setCompletedCrop(c)
                                                }
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
                                                        Scale (
                                                        {Math.round(
                                                            scale * 100
                                                        )}
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
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                onClick={() =>
                                                    setShowCropModal(false)
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 font-medium"
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
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleNewCropComplete}
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
            </div>
        </div>
    );
};

export default Signup;
