import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowLeft,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Header from "../components/Header";
import api from "../utils/api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });

    // Countdown timer for resend OTP
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Step 1: Send OTP to email
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            toast.error("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/forgot-password?action=send",
                {
                    email: formData.email,
                }
            );

            if (response.data.message) {
                toast.success("OTP sent to your email successfully!");
                setStep(2);
                setCountdown(60); // 60 seconds countdown
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to send OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Validate OTP
    const handleValidateOTP = async (e) => {
        e.preventDefault();

        if (!formData.otp || formData.otp.length !== 6) {
            toast.error("Please enter the 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/forgot-password?action=validate",
                {
                    otp: formData.otp,
                }
            );

            if (response.data.message === "OTP is valid") {
                toast.success("OTP verified successfully!");
                setStep(3);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Invalid OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!formData.newPassword || formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/reset-password", {
                email: formData.email,
                newPassword: formData.newPassword,
            });

            if (response.data.success) {
                toast.success(
                    "Password reset successfully! Please sign in with your new password."
                );
                navigate("/signin");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to reset password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setLoading(true);
        try {
            await api.post("/auth/forgot-password?action=send", {
                email: formData.email,
            });
            toast.success("New OTP sent to your email!");
            setCountdown(60);
        } catch (error) {
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                step >= stepNumber
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                    : "bg-gray-700 text-gray-400"
                            }`}
                        >
                            {step > stepNumber ? (
                                <FaCheckCircle className="w-5 h-5" />
                            ) : (
                                stepNumber
                            )}
                        </div>
                        {stepNumber < 3 && (
                            <div
                                className={`w-16 h-1 mx-2 transition-all duration-300 ${
                                    step > stepNumber
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                        : "bg-gray-700"
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    {/* Back to Sign In */}
                    <Link
                        to="/signin"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 mb-6"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>

                    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaLock className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Reset Your Password
                            </h1>
                            <p className="text-gray-400">
                                {step === 1 &&
                                    "Enter your email address to receive a verification code"}
                                {step === 2 &&
                                    "Enter the 6-digit code sent to your email"}
                                {step === 3 &&
                                    "Create a new secure password for your account"}
                            </p>
                        </div>

                        {/* Step Indicator */}
                        {renderStepIndicator()}

                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <form
                                onSubmit={handleSendOTP}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800/80 transition-all duration-300"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="w-5 h-5 animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            <FaEnvelope className="w-5 h-5" />
                                            Send Verification Code
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form
                                onSubmit={handleValidateOTP}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        maxLength={6}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800/80 transition-all duration-300 text-center text-2xl tracking-widest font-mono"
                                        placeholder="xxxxxx"
                                        required
                                    />
                                    <p className="text-gray-400 text-sm mt-2 text-center">
                                        Code sent to{" "}
                                        <span className="text-blue-400">
                                            {formData.email}
                                        </span>
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="w-5 h-5" />
                                            Verify Code
                                        </>
                                    )}
                                </button>

                                {/* Resend OTP */}
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-2">
                                        Didn't receive the code?
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={countdown > 0 || loading}
                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {countdown > 0
                                            ? `Resend in ${countdown}s`
                                            : "Resend Code"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <form
                                onSubmit={handleResetPassword}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={
                                                showPassword.new
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800/80 transition-all duration-300"
                                            placeholder="Enter new password"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility("new")
                                            }
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            {showPassword.new ? (
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={
                                                showPassword.confirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800/80 transition-all duration-300"
                                            placeholder="Confirm new password"
                                            required
                                            minLength={6}
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
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                                    <div className="flex items-start gap-2">
                                        <FaExclamationTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-300 font-medium mb-1">
                                                Password Requirements:
                                            </p>
                                            <ul className="text-xs text-gray-400 space-y-1">
                                                <li
                                                    className={
                                                        formData.newPassword
                                                            .length >= 6
                                                            ? "text-green-400"
                                                            : ""
                                                    }
                                                >
                                                    • At least 6 characters long
                                                </li>
                                                <li
                                                    className={
                                                        formData.newPassword ===
                                                            formData.confirmPassword &&
                                                        formData.newPassword
                                                            ? "text-green-400"
                                                            : ""
                                                    }
                                                >
                                                    • Passwords must match
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="w-5 h-5 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="w-5 h-5" />
                                            Reset Password
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
                            <p className="text-gray-400 text-sm">
                                Remember your password?{" "}
                                <Link
                                    to="/signin"
                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
