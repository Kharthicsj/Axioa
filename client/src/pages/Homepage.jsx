import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

function Homepage() {
    const [email, setEmail] = useState("");
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            // Navigate based on user role
            if (user?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/profile");
            }
        } else {
            // Redirect to signup with the email pre-filled
            navigate("/signup", { state: { email } });
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
            {/* Gradient bars background using reference styling */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="flex h-full"
                    style={{
                        width: "100%",
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        WebkitFontSmoothing: "antialiased",
                    }}
                >
                    {Array.from({ length: 15 }).map((_, index) => {
                        const position = index / 14;
                        const center = 0.5;
                        const distanceFromCenter = Math.abs(position - center);
                        const heightPercentage = Math.pow(
                            distanceFromCenter * 2,
                            1.2
                        );
                        const height = 30 + (100 - 30) * heightPercentage;

                        return (
                            <div
                                key={index}
                                style={{
                                    flex: "1 0 calc(100% / 15)",
                                    maxWidth: "calc(100% / 15)",
                                    height: "100%",
                                    background:
                                        "linear-gradient(to top, rgb(59, 130, 246), transparent)",
                                    transform: `scaleY(${height / 100})`,
                                    transformOrigin: "bottom",
                                    transition: "transform 0.5s ease-in-out",
                                    outline: "1px solid rgba(0, 0, 0, 0)",
                                    boxSizing: "border-box",
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Header Component */}
            <Header />

            {/* Main Content with proper spacing */}
            <main className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16">
                <div className="w-full max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
                    {/* Main heading with responsive text */}
                    <div className="space-y-2 sm:space-y-4">
                        <h1 className="text-white leading-tight tracking-tight px-2 sm:px-0">
                            <span className="block font-bold text-[clamp(1.75rem,7vw,4rem)] sm:text-[clamp(2rem,8vw,4rem)] animate-fadeInUp animation-delay-1000">
                                AXION - Digital services
                            </span>
                            <span className="block font-bold italic text-[clamp(1.75rem,7vw,4rem)] sm:text-[clamp(2rem,8vw,4rem)] animate-fadeInUp animation-delay-1500 mt-1 sm:mt-0">
                                for students, by students.
                            </span>
                        </h1>
                    </div>

                    {/* Description with improved spacing */}
                    <div className="animate-fadeInUp animation-delay-2000 px-4 sm:px-0">
                        <p className="text-[clamp(0.9rem,4vw,1.25rem)] text-gray-300 leading-relaxed mb-2 sm:mb-3">
                            Professional resumes, stunning portfolios, and
                            comprehensive reports
                        </p>
                        <p className="text-[clamp(0.9rem,4vw,1.25rem)] text-gray-300 leading-relaxed">
                            with templates customized for every college across
                            India.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="w-full max-w-4xl mx-auto animate-fadeInUp animation-delay-2500 px-4 sm:px-0">
                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                            <button
                                onClick={handleGetStarted}
                                className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 text-white rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 font-bold text-base sm:text-lg overflow-hidden border border-cyan-400/20 hover:border-cyan-300/40 w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                                    <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    Start Building Now
                                </span>
                            </button>
                            <button
                                onClick={() => navigate("/services")}
                                className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border-2 border-slate-600/50 hover:border-cyan-400/60 text-white rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-slate-400/30 font-bold text-base sm:text-lg backdrop-blur-xl overflow-hidden w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-800/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                                    <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                    Explore Services
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Social Media Icons with reference styling */}
                    <div className="flex justify-center space-x-4 sm:space-x-6 pt-2 sm:pt-4 animate-fadeInUp animation-delay-3000">
                        <a
                            href="#"
                            className="text-white/70 hover:text-gray-300 transition-colors duration-300"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.120.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.756-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-white/70 hover:text-gray-300 transition-colors duration-300"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-white/70 hover:text-gray-300 transition-colors duration-300"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Homepage;
