import React from "react";
import { FaFileAlt, FaDownload, FaTimes, FaCheck } from "react-icons/fa";

// Enhanced Modal Component for Student Application Details
const ApplicationDetailModal = ({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  getStatusColor,
  getStatusIcon,
}) => {
  if (!isOpen || !application) return null;

  const DocumentPreview = ({ document, title }) => {
    if (!document || !document.documentImage) {
      return (
        <div className="border border-gray-600 rounded-lg p-4 text-center">
          <FaFileAlt className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No {title} uploaded</p>
        </div>
      );
    }

    const isImage = document.documentImage.startsWith("data:image/");
    const isPDF = document.documentImage.startsWith("data:application/pdf");

    return (
      <div className="border border-gray-600 rounded-lg p-4">
        <h5 className="text-white font-medium mb-3">{title}</h5>
        {document.documentNumber && (
          <p className="text-gray-400 text-sm mb-3">
            Document Number: {document.documentNumber}
          </p>
        )}
        {document.documentType && (
          <p className="text-gray-400 text-sm mb-3">
            Type: {document.documentType.replace("_", " ").toUpperCase()}
          </p>
        )}

        {isImage ? (
          <img
            src={document.documentImage}
            alt={title}
            className="w-full max-h-64 object-contain rounded border border-gray-700"
          />
        ) : isPDF ? (
          <div className="text-center p-8 bg-gray-700 rounded">
            <FaFileAlt className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="text-white mb-3">PDF Document</p>
            <a
              href={document.documentImage}
              download={`${title}.pdf`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Download PDF
            </a>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-700 rounded">
            <FaFileAlt className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500">Document available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">
              Application Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Basic Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-2xl">
                  {application.personalInfo?.fullName?.charAt(0) ||
                    application.userId?.username?.charAt(0) ||
                    "U"}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white">
                  {application.personalInfo?.fullName ||
                    application.userId?.username}
                </h4>
                <p className="text-gray-400">
                  {application.personalInfo?.email || application.userId?.email}
                </p>
                <p className="text-gray-400">
                  {application.personalInfo?.phone}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(application.status)}
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Date of Birth
                    </label>
                    <p className="text-white">
                      {application.personalInfo?.dateOfBirth
                        ? new Date(
                            application.personalInfo.dateOfBirth
                          ).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Gender
                    </label>
                    <p className="text-white capitalize">
                      {application.personalInfo?.gender || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Address
                    </label>
                    <p className="text-white">
                      {application.personalInfo?.address
                        ? `${application.personalInfo.address.street}, ${application.personalInfo.address.city}, 
                         ${application.personalInfo.address.state} - ${application.personalInfo.address.pincode}, 
                         ${application.personalInfo.address.country}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Education
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      College
                    </label>
                    <p className="text-white">
                      {application.education?.college || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Course & Degree
                    </label>
                    <p className="text-white">
                      {application.education?.course || "Not provided"} -{" "}
                      {application.education?.degree || "Not provided"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Year
                      </label>
                      <p className="text-white">
                        {application.education?.year || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        CGPA
                      </label>
                      <p className="text-white">
                        {application.education?.cgpa || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Expected Graduation
                    </label>
                    <p className="text-white">
                      {application.education?.expectedGraduation
                        ? new Date(
                            application.education.expectedGraduation
                          ).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Technical Information
              </h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {application.technical?.skills?.length > 0 ? (
                      application.technical.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No skills listed</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      GitHub
                    </label>
                    <p className="text-white">
                      {application.technical?.github || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      LinkedIn
                    </label>
                    <p className="text-white">
                      {application.technical?.linkedin || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">
                      Portfolio
                    </label>
                    <p className="text-white">
                      {application.technical?.portfolio || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Projects */}
              {application.technical?.projects?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Projects
                  </label>
                  <div className="space-y-3">
                    {application.technical.projects.map((project, index) => (
                      <div key={index} className="p-3 bg-gray-700 rounded-lg">
                        <h6 className="text-white font-medium">
                          {project.title}
                        </h6>
                        <p className="text-gray-400 text-sm mt-1">
                          {project.description}
                        </p>
                        {project.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {(project.githubLink || project.liveLink) && (
                          <div className="flex gap-2 mt-2">
                            {project.githubLink && (
                              <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                GitHub
                              </a>
                            )}
                            {project.liveLink && (
                              <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 text-sm"
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Documents
              </h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DocumentPreview
                  document={application.identityProof}
                  title="Identity Proof"
                />
                <DocumentPreview
                  document={application.collegeIdProof}
                  title="College ID Proof"
                />
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Application Details
              </h5>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Reason for Applying
                  </label>
                  <p className="text-white bg-gray-700 p-3 rounded">
                    {application.applicationDetails?.reasonForApplying ||
                      "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Career Goals
                  </label>
                  <p className="text-white bg-gray-700 p-3 rounded">
                    {application.applicationDetails?.careerGoals ||
                      "Not provided"}
                  </p>
                </div>
                {application.applicationDetails?.experience && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Experience
                    </label>
                    <p className="text-white bg-gray-700 p-3 rounded">
                      {application.applicationDetails.experience}
                    </p>
                  </div>
                )}
                {application.applicationDetails?.achievements?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Achievements
                    </label>
                    <ul className="list-disc list-inside text-white bg-gray-700 p-3 rounded">
                      {application.applicationDetails.achievements.map(
                        (achievement, index) => (
                          <li key={index}>{achievement}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Application Timeline */}
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Timeline
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Submitted:</span>
                  <span className="text-white">
                    {application.submittedAt
                      ? new Date(application.submittedAt).toLocaleString()
                      : "Not submitted"}
                  </span>
                </div>
                {application.reviewedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reviewed:</span>
                    <span className="text-white">
                      {new Date(application.reviewedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Profile Completion:</span>
                  <span className="text-white">
                    {application.profileCompletion?.percentage || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {(application.status === "submitted" ||
              application.status === "under_review") && (
              <div className="flex gap-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => onApprove(application._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaCheck className="w-5 h-5" />
                  Approve Application
                </button>
                <button
                  onClick={() => onReject(application._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaTimes className="w-5 h-5" />
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
