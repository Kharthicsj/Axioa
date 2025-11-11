import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaHome,
  FaArrowLeft,
  FaSearch,
  FaRocket,
  FaStar,
  FaHeart,
} from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Floating animation keyframes
  const floatingElements = Array.from({ length: 6 }, (_, index) => (
    <div
      key={index}
      className={`absolute animate-bounce opacity-20 text-blue-400 ${
        index % 2 === 0 ? "animate-pulse" : ""
      }`}
      style={{
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 60 + 20}%`,
        animationDelay: `${index * 0.5}s`,
        animationDuration: `${3 + index * 0.5}s`,
      }}
    >
      {index % 3 === 0 ? (
        <FaStar className="w-4 h-4" />
      ) : index % 3 === 1 ? (
        <FaRocket className="w-6 h-6" />
      ) : (
        <FaHeart className="w-5 h-5" />
      )}
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* 404 Number with Gradient */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse leading-none">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mt-4 animate-pulse"></div>
        </div>

        {/* Icon with Animation */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 border border-gray-700 rounded-full shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <FaExclamationTriangle className="w-10 h-10 text-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Oops! Page Not Found
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-300 mb-6 max-w-lg mx-auto leading-relaxed">
          The page you're looking for seems to have vanished into the digital
          void.
        </p>

        {/* Current Path Display */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-gray-400 text-sm mb-2">You tried to access:</p>
          <code className="text-blue-400 font-mono text-sm bg-gray-900 px-3 py-2 rounded border break-all">
            {location.pathname}
          </code>
        </div>

        {/* Suggestions */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8 max-w-lg mx-auto">
          <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
            <FaSearch className="w-4 h-4 text-blue-400" />
            What you can do:
          </h3>
          <ul className="text-gray-300 space-y-2 text-left">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Check if the URL is spelled correctly
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Go back to the previous page
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              Visit our homepage to explore
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Contact support if you think this is an error
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoHome}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
          >
            <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Go to Homepage
          </button>

          <button
            onClick={handleGoBack}
            className="group bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl border border-gray-600 hover:border-gray-500 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
          >
            <FaArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-gray-500">
          <p className="text-sm">
            Lost in space? Don't worry, even the best explorers get lost
            sometimes.
          </p>
        </div>
      </div>

      {/* Custom CSS for Grid Pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
