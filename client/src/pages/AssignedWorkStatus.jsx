import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
    FaUser,
    FaProjectDiagram,
    FaCalendarAlt,
    FaDollarSign,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaSpinner,
    FaGraduationCap,
    FaCode,
    FaMobile,
    FaFileAlt,
    FaCube,
    FaPaintBrush,
    FaChartBar,
    FaEdit,
    FaEnvelope,
    FaMapMarkerAlt,
    FaStar,
    FaPaperPlane,
    FaComment,
    FaHistory,
    FaArrowLeft,
    FaPhone,
    FaVideo,
    FaWhatsapp,
    FaEye,
    FaComments,
    FaExclamation,
    FaTimes,
    FaPlay,
    FaRedo,
    FaClipboardList,
    FaSearch,
    FaBolt,
    FaTools,
    FaTrophy,
    FaQuestion,
    FaCreditCard,
    FaReceipt,
    FaDownload,
} from "react-icons/fa";
import { projectAPI, workAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function AssignedWorkStatus() {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("in-review");
    const [communicationMessage, setCommunicationMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const [showCommunication, setShowCommunication] = useState(false);
    const [expandedSkills, setExpandedSkills] = useState(false);

    // Work tracking states
    const [workRecord, setWorkRecord] = useState(null);
    const [workLoading, setWorkLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Objection modal states
    const [showObjectionModal, setShowObjectionModal] = useState(false);
    const [objectionReason, setObjectionReason] = useState("");
    const [objectionMessage, setObjectionMessage] = useState("");
    const [submittingObjection, setSubmittingObjection] = useState(false);

    // Rejection modal states
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [customRejectionReason, setCustomRejectionReason] = useState("");
    const [rejectionMessage, setRejectionMessage] = useState("");
    const [submittingRejection, setSubmittingRejection] = useState(false);

    // Milestone confirmation modal states
    const [showMilestoneConfirm, setShowMilestoneConfirm] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    // Completion submission modal states
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionFiles, setCompletionFiles] = useState([]);
    const [projectLinks, setProjectLinks] = useState([
        { linkType: "github", url: "", description: "" },
    ]);
    const [submissionNotes, setSubmissionNotes] = useState("");
    const [submittingCompletion, setSubmittingCompletion] = useState(false);

    // Payment details modal states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [upiQrFile, setUpiQrFile] = useState(null);
    const [upiQrPreview, setUpiQrPreview] = useState(null);
    const [upiId, setUpiId] = useState("");
    const [upiPhoneNumber, setUpiPhoneNumber] = useState("");
    const [paymentInstructions, setPaymentInstructions] = useState("");
    const [submittingPayment, setSubmittingPayment] = useState(false);

    // Client payment modal states
    const [showClientPaymentModal, setShowClientPaymentModal] = useState(false);
    const [paymentProofFile, setPaymentProofFile] = useState(null);
    const [upiTransactionId, setUpiTransactionId] = useState("");
    const [paymentToName, setPaymentToName] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [submittingClientPayment, setSubmittingClientPayment] =
        useState(false);

    // Image viewer modal states
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState("");
    const [modalImageAlt, setModalImageAlt] = useState("");
    const [imageScale, setImageScale] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [lastTouchDistance, setLastTouchDistance] = useState(0);

    // Student payment verification modal states
    const [showPaymentVerificationModal, setShowPaymentVerificationModal] =
        useState(false);
    const [verificationNotes, setVerificationNotes] = useState("");
    const [submittingVerification, setSubmittingVerification] = useState(false);

    // Client review modal states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [skillsRating, setSkillsRating] = useState(5);
    const [communicationRating, setCommunicationRating] = useState(5);
    const [timelinessRating, setTimelinessRating] = useState(5);
    const [qualityRating, setQualityRating] = useState(5);
    const [problemSolvingRating, setProblemSolvingRating] = useState(5);
    const [teamworkRating, setTeamworkRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    // Student review data (from StudentPerformance model)
    const [studentReview, setStudentReview] = useState(null);
    const [studentPerformance, setStudentPerformance] = useState(null);

    useEffect(() => {
        if (projectId) {
            fetchProjectDetails();
        }
    }, [projectId]);

    useEffect(() => {
        fetchWorkRecord();
    }, [projectId, project?.status]);

    useEffect(() => {
        if (workRecord?._id) {
            fetchStudentPerformance();
        }
    }, [workRecord?._id]);

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (upiQrPreview) {
                URL.revokeObjectURL(upiQrPreview);
            }
        };
    }, [upiQrPreview]);

    // Handle keyboard events for image modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showImageModal) {
                if (e.key === "Escape") {
                    closeImageModal();
                } else if (e.key === "+" || e.key === "=") {
                    e.preventDefault();
                    handleZoomIn();
                } else if (e.key === "-" || e.key === "_") {
                    e.preventDefault();
                    handleZoomOut();
                } else if (e.key === "0") {
                    e.preventDefault();
                    handleResetZoom();
                }
            }
        };

        if (showImageModal) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [showImageModal]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await projectAPI.getProjectById(projectId);
            if (response && response.success && response.project) {
                setProject(response.project);
                // Set active tab based on project status
                if (
                    response.project.status === "submitted" ||
                    response.project.status === "pending"
                ) {
                    setActiveTab("in-review");
                } else {
                    setActiveTab("in-process");
                }
            } else {
                toast.error("Failed to load project details");
                navigate("/assigned-works");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            toast.error("Error loading project details");
            navigate("/assigned-works");
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkRecord = async () => {
        if (!projectId) return;

        setWorkLoading(true);
        try {
            const response = await workAPI.getWorkByProjectId(projectId);
            if (response && response.success) {
                setWorkRecord(response.work);
            }
        } catch (error) {
            console.error("Error fetching work record:", error);
            // Work record might not exist yet if project is not approved
            setWorkRecord(null);
        } finally {
            setWorkLoading(false);
        }
    };

    const fetchStudentPerformance = async () => {
        if (!projectId || !workRecord?._id) return;

        try {
            const response = await workAPI.getStudentPerformance(
                workRecord._id
            );
            if (response && response.success) {
                setStudentReview(response.studentReview);
                setStudentPerformance(response.studentPerformance);
            }
        } catch (error) {
            console.error("Error fetching student performance:", error);
            // Performance data might not exist yet
            setStudentReview(null);
            setStudentPerformance(null);
        }
    };

    const handleWorkStatusChange = async (newStatus, progressUpdate = null) => {
        if (!workRecord || updatingStatus) return;

        setUpdatingStatus(true);
        try {
            const response = await workAPI.updateWorkStatus(workRecord._id, {
                status: newStatus,
                progressUpdate: progressUpdate,
            });
            if (response && response.success) {
                toast.success(
                    `Work status updated to ${newStatus.replace("_", " ")}`
                );
                fetchWorkRecord(); // Refresh work data
            } else {
                toast.error("Failed to update work status");
            }
        } catch (error) {
            console.error("Error updating work status:", error);
            toast.error("Error updating work status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getWorkStatusBadge = (status) => {
        const statusStyles = {
            approved: "bg-green-100 text-green-800",
            in_progress: "bg-blue-100 text-blue-800",
            review_pending: "bg-yellow-100 text-yellow-800",
            completed: "bg-purple-100 text-purple-800",
            awaiting_completion_proof: "bg-orange-100 text-orange-800",
            completion_submitted: "bg-indigo-100 text-indigo-800",
            payment_pending: "bg-red-100 text-red-800",
            payment_submitted: "bg-teal-100 text-teal-800",
            payment_verified: "bg-emerald-100 text-emerald-800",
            delivered: "bg-green-200 text-green-900",
            cancelled: "bg-gray-100 text-gray-800",
            on_hold: "bg-gray-100 text-gray-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusStyles[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {status?.replace(/_/g, " ").toUpperCase()}
            </span>
        );
    };

    const formatWorkDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleProgressMilestone = async (milestone) => {
        if (!workRecord || updatingStatus) return;

        // Special handling for 100% completion
        if (milestone.percentage === 100) {
            setShowCompletionModal(true);
            return;
        }

        setUpdatingStatus(true);
        try {
            // Determine project status based on milestone progress
            let newProjectStatus = project.status;
            const milestoneCount = Math.floor((milestone.percentage / 100) * 7); // Total 7 milestones

            if (milestone.percentage <= 25) {
                // First 2 milestones (10%, 25%)
                newProjectStatus = "pending";
            } else if (milestone.percentage <= 80) {
                // Next 3 milestones (40%, 60%, 80%)
                newProjectStatus = "in_progress";
            } else if (milestone.percentage === 95) {
                // Near completion
                newProjectStatus = "in_progress";
            }

            // Use updateWorkStatus with current status and progress update to avoid parallel saves
            const response = await workAPI.updateWorkStatus(workRecord._id, {
                status: workRecord.workStatus, // Keep current work status
                progressUpdate: {
                    percentage: milestone.percentage,
                    description: milestone.description,
                },
                projectStatus: newProjectStatus, // Update project status
            });

            if (response && response.success) {
                toast.success(`Progress updated: ${milestone.description}`);

                // Update local project state
                setProject((prev) => ({
                    ...prev,
                    status: newProjectStatus,
                }));

                fetchWorkRecord(); // Refresh work data
            } else {
                toast.error("Failed to update progress");
            }
        } catch (error) {
            console.error("Error updating progress:", error);
            toast.error("Error updating progress");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getProgressMilestones = () => {
        return [
            {
                percentage: 10,
                description: "Project Setup & Planning",
                icon: FaClipboardList,
                color: "text-blue-400",
            },
            {
                percentage: 25,
                description: "Initial Development/Research",
                icon: FaSearch,
                color: "text-purple-400",
            },
            {
                percentage: 40,
                description: "Core Work in Progress",
                icon: FaBolt,
                color: "text-yellow-400",
            },
            {
                percentage: 60,
                description: "Major Components Complete",
                icon: FaCode,
                color: "text-green-400",
            },
            {
                percentage: 80,
                description: "Testing & Refinement",
                icon: FaTools,
                color: "text-orange-400",
            },
            {
                percentage: 95,
                description: "Final Review & Polish",
                icon: FaStar,
                color: "text-pink-400",
            },
            {
                percentage: 100,
                description: "Work Complete",
                icon: FaTrophy,
                color: "text-yellow-500",
            },
        ];
    };

    const handleMilestoneClick = (milestone) => {
        setSelectedMilestone(milestone);
        setShowMilestoneConfirm(true);
    };

    const confirmMilestoneUpdate = async () => {
        if (!selectedMilestone) return;

        setShowMilestoneConfirm(false);
        await handleProgressMilestone(selectedMilestone);
        setSelectedMilestone(null);
    };

    const getServiceIcon = (category) => {
        const icons = {
            "web-development": <FaCode className="text-green-400" />,
            "app-development": <FaMobile className="text-purple-400" />,
            "resume-services": <FaFileAlt className="text-blue-400" />,
            "cad-modeling": <FaCube className="text-orange-400" />,
            "ui-ux-design": <FaPaintBrush className="text-pink-400" />,
            "data-analysis": <FaChartBar className="text-cyan-400" />,
            "content-writing": <FaEdit className="text-teal-400" />,
        };
        return (
            icons[category] || <FaProjectDiagram className="text-gray-400" />
        );
    };

    const getStatusIcon = (status) => {
        const icons = {
            submitted: <FaHourglassHalf className="text-yellow-500" />,
            accepted: <FaCheckCircle className="text-green-500" />,
            pending: <FaExclamationTriangle className="text-orange-500" />,
            in_progress: <FaClock className="text-blue-500" />,
            completed: <FaCheckCircle className="text-emerald-600" />,
            cancelled: <FaTimesCircle className="text-red-500" />,
            disputed: <FaExclamationTriangle className="text-red-600" />,
        };
        return icons[status] || <FaHourglassHalf className="text-gray-500" />;
    };

    const getStatusBadge = (status) => {
        const badges = {
            submitted: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
            accepted: "bg-green-500/20 text-green-300 border-green-500/30",
            pending: "bg-orange-500/20 text-orange-300 border-orange-500/30",
            in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            completed:
                "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
            cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
            disputed: "bg-red-500/20 text-red-300 border-red-500/30",
        };
        return (
            badges[status] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleProjectAction = async (action) => {
        try {
            let newStatus = "";
            let reason = "";
            let notes = "";

            if (action === "accept") {
                newStatus = "accepted";
                reason = "Project accepted by student";
                notes =
                    "Student has accepted the project and is ready to start working";
            } else if (action === "reject") {
                newStatus = "cancelled";
                reason = "Project rejected by student";
                notes = "Student has rejected the project";
            }

            const response = await projectAPI.updateProjectStatus(projectId, {
                status: newStatus,
                reason,
                notes,
            });

            if (response && response.success) {
                // If project was accepted, create work record for tracking
                if (action === "accept") {
                    try {
                        const workResponse =
                            await workAPI.createWorkFromProject(projectId);
                        if (workResponse && workResponse.success) {
                            toast.success(
                                `Project accepted successfully! Work tracking started.`
                            );
                        } else {
                            toast.success(`Project accepted successfully!`);
                            toast.warning(
                                "Work tracking could not be initialized automatically."
                            );
                        }
                    } catch (workError) {
                        console.error("Error creating work record:", workError);
                        toast.success(`Project accepted successfully!`);
                        toast.warning(
                            "Work tracking could not be initialized automatically."
                        );
                    }
                } else {
                    toast.success(`Project ${action}ed successfully`);
                }

                fetchProjectDetails(); // Refresh project data
            } else {
                toast.error(`Failed to ${action} project`);
            }
        } catch (error) {
            console.error(`Error ${action}ing project:`, error);
            toast.error(`Error ${action}ing project`);
        }
    };

    const handleSendMessage = async () => {
        if (!communicationMessage.trim()) {
            toast.error("Please enter a message");
            return;
        }

        try {
            setSendingMessage(true);
            const response = await projectAPI.addCommunication(projectId, {
                message: communicationMessage,
                messageType: "general",
            });

            if (response && response.success) {
                toast.success("Message sent successfully");
                setCommunicationMessage("");
                fetchProjectDetails(); // Refresh to get new messages
            } else {
                toast.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Error sending message");
        } finally {
            setSendingMessage(false);
        }
    };

    const handleObjection = async () => {
        if (!objectionReason.trim() || !objectionMessage.trim()) {
            toast.error("Please provide both objection reason and message");
            return;
        }

        try {
            setSubmittingObjection(true);
            const response = await projectAPI.raiseObjection(projectId, {
                objectionReason: objectionReason,
                objectionMessage: objectionMessage,
            });

            if (response && response.success) {
                toast.success("Objection raised successfully");
                setShowObjectionModal(false);
                setObjectionReason("");
                setObjectionMessage("");
                fetchProjectDetails(); // Refresh project data
            } else {
                toast.error("Failed to raise objection");
            }
        } catch (error) {
            console.error("Error raising objection:", error);
            toast.error("Error raising objection");
        } finally {
            setSubmittingObjection(false);
        }
    };

    const handleRejection = async () => {
        if (!rejectionReason || !rejectionMessage.trim()) {
            toast.error(
                "Please select a rejection reason and provide a message"
            );
            return;
        }

        if (rejectionReason === "other" && !customRejectionReason.trim()) {
            toast.error("Please specify the custom rejection reason");
            return;
        }

        try {
            setSubmittingRejection(true);
            const response = await projectAPI.rejectProjectWithReasons(
                projectId,
                {
                    rejectionReason,
                    customRejectionReason:
                        rejectionReason === "other"
                            ? customRejectionReason
                            : undefined,
                    rejectionMessage,
                }
            );

            if (response && response.success) {
                toast.success("Project rejected successfully");
                setShowRejectionModal(false);
                setRejectionReason("");
                setCustomRejectionReason("");
                setRejectionMessage("");
                fetchProjectDetails(); // Refresh project data
            } else {
                toast.error("Failed to reject project");
            }
        } catch (error) {
            console.error("Error rejecting project:", error);
            toast.error("Error rejecting project");
        } finally {
            setSubmittingRejection(false);
        }
    };

    const getRejectionReasonLabel = (reason) => {
        const labels = {
            budget_too_low: "Budget too low",
            timeline_too_tight: "Timeline too tight",
            scope_unclear: "Scope unclear",
            technical_complexity: "Technical complexity",
            resource_unavailable: "Resource unavailable",
            skill_mismatch: "Skill mismatch",
            communication_issues: "Communication issues",
            other: "Other",
        };
        return labels[reason] || reason;
    };

    // Handle completion file selection
    const handleCompletionFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setCompletionFiles(files);
    };

    // Handle project links change
    const handleProjectLinksChange = (index, field, value) => {
        const updatedLinks = [...projectLinks];
        updatedLinks[index][field] = value;
        setProjectLinks(updatedLinks);
    };

    // Add new project link
    const addProjectLink = () => {
        setProjectLinks([
            ...projectLinks,
            { linkType: "github", url: "", description: "" },
        ]);
    };

    // Remove project link
    const removeProjectLink = (index) => {
        if (projectLinks.length > 1) {
            setProjectLinks(projectLinks.filter((_, i) => i !== index));
        }
    };

    // Submit work completion with payment details (combined)
    const handleSubmitCompletion = async () => {
        if (!workRecord) return;

        // Validate based on service category
        const isDocumentService = [
            "resume-services",
            "content-writing",
        ].includes(project?.serviceCategory);

        // Validate completion proof
        if (isDocumentService && completionFiles.length === 0) {
            toast.error(
                "Please upload completion files for document-based services"
            );
            return;
        }

        if (
            !isDocumentService &&
            !projectLinks.some((link) => link.url && link.url.trim())
        ) {
            toast.error("Please provide at least one valid project link");
            return;
        }

        // Validate payment details
        if (!upiQrFile) {
            toast.error("Please upload your UPI QR code");
            return;
        }

        if (!upiId || upiId.trim().length === 0) {
            toast.error("Please provide your UPI ID");
            return;
        }

        if (!upiPhoneNumber || !/^\d{10}$/.test(upiPhoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        setSubmittingCompletion(true);
        try {
            // Step 1: Submit work completion
            const completionFormData = new FormData();

            // Add files for document-based services
            if (isDocumentService) {
                completionFiles.forEach((file) => {
                    completionFormData.append("completionFiles", file);
                });
            }

            // Add project links data
            const filteredLinks = projectLinks.filter(
                (link) => link.url && link.url.trim()
            );
            console.log("Frontend submission data:", {
                workId: workRecord._id,
                isDocumentService,
                serviceCategory: project?.serviceCategory,
                completionFilesCount: completionFiles.length,
                projectLinksCount: projectLinks.length,
                filteredLinksCount: filteredLinks.length,
                filteredLinks,
                submissionNotes: submissionNotes || "",
            });

            completionFormData.append(
                "projectLinks",
                JSON.stringify(filteredLinks)
            );
            completionFormData.append("submissionNotes", submissionNotes || "");

            const completionResponse = await workAPI.submitWorkCompletion(
                workRecord._id,
                completionFormData
            );

            if (!completionResponse || !completionResponse.success) {
                toast.error("Failed to submit work completion");
                return;
            }

            // Step 2: Submit payment details immediately after
            toast.loading("Uploading UPI QR code and payment details...", {
                id: "payment-upload",
            });

            const paymentFormData = new FormData();
            paymentFormData.append("upiQrCode", upiQrFile);
            paymentFormData.append("upiId", upiId.trim());
            paymentFormData.append("upiPhoneNumber", upiPhoneNumber);
            paymentFormData.append("paymentInstructions", paymentInstructions);

            console.log("Submitting payment details:", {
                workId: workRecord._id,
                upiId: upiId.trim(),
                upiPhoneNumber,
                upiQrFileSize: upiQrFile?.size,
                upiQrFileName: upiQrFile?.name,
            });

            const paymentResponse = await workAPI.submitStudentPaymentDetails(
                workRecord._id,
                paymentFormData
            );

            toast.dismiss("payment-upload");

            if (paymentResponse && paymentResponse.success) {
                toast.success(
                    "Work completion and payment details submitted successfully!"
                );
                setShowCompletionModal(false);

                // Reset form
                setCompletionFiles([]);
                setProjectLinks([
                    { linkType: "github", url: "", description: "" },
                ]);
                setSubmissionNotes("");
                setUpiQrFile(null);
                setUpiQrPreview(null);
                setUpiId("");
                setUpiPhoneNumber("");
                setPaymentInstructions("");

                fetchWorkRecord(); // Refresh work data
            } else {
                toast.error(
                    "Work completion submitted but failed to submit payment details"
                );
            }
        } catch (error) {
            toast.dismiss("payment-upload"); // Dismiss loading toast

            console.error("Error submitting completion:", error);
            console.error("Error details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                code: error.code,
                config: error.config,
                request: error.request ? "Request made" : "Request not made",
            });
            console.error("Full error object:", error);

            // Handle timeout errors specifically
            if (
                error.code === "ECONNABORTED" ||
                error.message.includes("timeout")
            ) {
                toast.error(
                    "Upload timeout: Please check your internet connection and try again. Large files may take longer to upload."
                );
            } else if (error.response?.status === 413) {
                toast.error(
                    "File too large: Please compress your UPI QR code image and try again."
                );
            } else if (error.response?.status === 400) {
                toast.error(
                    error.response?.data?.message ||
                        "Invalid file format or missing data. Please check your UPI QR code and details."
                );
            } else {
                toast.error(
                    error.response?.data?.message ||
                        `Error submitting work completion: ${error.message}`
                );
            }
        } finally {
            setSubmittingCompletion(false);
        }
    };

    // Handle UPI QR file selection
    const handleUpiQrChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setUpiQrFile(file);

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setUpiQrPreview(previewUrl);
        }
    };

    // Submit student payment details
    const handleSubmitPaymentDetails = async () => {
        if (!workRecord || !upiQrFile || !upiPhoneNumber) {
            toast.error("Please provide UPI QR code and phone number");
            return;
        }

        if (!/^\d{10}$/.test(upiPhoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        setSubmittingPayment(true);
        try {
            const formData = new FormData();
            formData.append("upiQrCode", upiQrFile);
            formData.append("upiPhoneNumber", upiPhoneNumber);
            formData.append("paymentInstructions", paymentInstructions);

            const response = await workAPI.submitStudentPaymentDetails(
                workRecord._id,
                formData
            );

            if (response && response.success) {
                toast.success("Payment details submitted successfully!");
                setShowPaymentModal(false);
                fetchWorkRecord(); // Refresh work data
            } else {
                toast.error("Failed to submit payment details");
            }
        } catch (error) {
            console.error("Error submitting payment details:", error);
            toast.error(
                error.response?.data?.message ||
                    "Error submitting payment details"
            );
        } finally {
            setSubmittingPayment(false);
        }
    };

    // Handle payment proof file selection
    const handlePaymentProofChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentProofFile(file);
        }
    };

    // Submit client payment proof
    const handleSubmitClientPayment = async () => {
        if (
            !workRecord ||
            !paymentProofFile ||
            !upiTransactionId ||
            !paymentToName ||
            !paymentAmount
        ) {
            toast.error(
                "Please fill all required fields and upload payment proof"
            );
            return;
        }

        setSubmittingClientPayment(true);
        try {
            const formData = new FormData();
            formData.append("paymentProof", paymentProofFile);
            formData.append("upiTransactionId", upiTransactionId);
            formData.append("paymentToName", paymentToName);
            formData.append("paymentAmount", paymentAmount);
            if (paymentDate) {
                formData.append("paymentDate", paymentDate);
            }

            const response = await workAPI.submitClientPaymentProof(
                workRecord._id,
                formData
            );

            if (response && response.success) {
                toast.success("Payment proof submitted successfully!");
                setShowClientPaymentModal(false);
                fetchWorkRecord(); // Refresh work data
            } else {
                toast.error("Failed to submit payment proof");
            }
        } catch (error) {
            console.error("Error submitting payment proof:", error);
            toast.error(
                error.response?.data?.message ||
                    "Error submitting payment proof"
            );
        } finally {
            setSubmittingClientPayment(false);
        }
    };

    const getCommunicationIcon = (preference) => {
        const icons = {
            whatsapp: <FaWhatsapp className="text-green-500" />,
            phone: <FaPhone className="text-blue-500" />,
            email: <FaEnvelope className="text-purple-500" />,
            meeting: <FaVideo className="text-red-500" />,
            mixed: <FaComments className="text-orange-500" />,
        };
        return icons[preference] || <FaComments className="text-gray-500" />;
    };

    const getProfileImage = (profilePicture) => {
        if (!profilePicture) return null;
        return profilePicture.startsWith("data:")
            ? profilePicture
            : `data:image/jpeg;base64,${profilePicture}`;
    };

    // Image modal functions
    const openImageModal = (imageSrc, imageAlt = "Image") => {
        console.log("openImageModal called with:", { imageSrc, imageAlt });
        console.log("Current showImageModal state:", showImageModal);
        setModalImageSrc(imageSrc);
        setModalImageAlt(imageAlt);
        setImageScale(1);
        setImagePosition({ x: 0, y: 0 });
        setShowImageModal(true);
        console.log("Modal state set to true");

        // Additional debugging
        setTimeout(() => {
            console.log("showImageModal after setState:", showImageModal);
        }, 100);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setModalImageSrc("");
        setModalImageAlt("");
        setImageScale(1);
        setImagePosition({ x: 0, y: 0 });
    };

    const handleZoomIn = () => {
        setImageScale((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setImageScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleResetZoom = () => {
        setImageScale(1);
        setImagePosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (imageScale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - imagePosition.x,
                y: e.clientY - imagePosition.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && imageScale > 1) {
            setImagePosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch event handlers for mobile support
    const handleTouchStart = (e) => {
        if (imageScale > 1 && e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - imagePosition.x,
                y: e.touches[0].clientY - imagePosition.y,
            });
        }
    };

    const handleTouchMove = (e) => {
        if (isDragging && imageScale > 1 && e.touches.length === 1) {
            e.preventDefault();
            setImagePosition({
                x: e.touches[0].clientX - dragStart.x,
                y: e.touches[0].clientY - dragStart.y,
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Pinch-to-zoom for mobile
    const getTouchDistance = (touches) => {
        if (touches.length < 2) return 0;
        const touch1 = touches[0];
        const touch2 = touches[1];
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };

    const handleTouchStartPinch = (e) => {
        if (e.touches.length === 2) {
            setLastTouchDistance(getTouchDistance(e.touches));
        } else if (e.touches.length === 1 && imageScale > 1) {
            handleTouchStart(e);
        }
    };

    const handleTouchMovePinch = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getTouchDistance(e.touches);
            if (lastTouchDistance > 0) {
                const deltaScale = currentDistance / lastTouchDistance;
                const newScale = Math.max(
                    0.5,
                    Math.min(3, imageScale * deltaScale)
                );
                setImageScale(newScale);
            }
            setLastTouchDistance(currentDistance);
        } else if (e.touches.length === 1) {
            handleTouchMove(e);
        }
    };

    const handleTouchEndPinch = () => {
        setLastTouchDistance(0);
        handleTouchEnd();
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    // Handle student payment verification
    const handleStudentPaymentVerification = async () => {
        if (!workRecord) return;

        setSubmittingVerification(true);
        try {
            const response = await workAPI.studentVerifyPaymentAndComplete(
                workRecord._id,
                { verificationNotes }
            );

            if (response && response.success) {
                toast.success(
                    "Payment verified and work completed successfully!"
                );
                setShowPaymentVerificationModal(false);
                setVerificationNotes("");
                fetchWorkRecord(); // Refresh work data
            } else {
                toast.error("Failed to verify payment");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error(
                error.response?.data?.message || "Error verifying payment"
            );
        } finally {
            setSubmittingVerification(false);
        }
    };

    // Handle file download using new API
    const handleDownloadFile = async (
        fileUrl,
        fileName,
        fileType = "completion"
    ) => {
        try {
            if (!workRecord) {
                toast.error("Work record not found");
                return;
            }

            // Use the new download API
            const response = await workAPI.downloadFile(
                workRecord._id,
                fileType,
                fileName
            );

            if (response.success && response.downloadUrl) {
                // Create temporary link and trigger download
                const link = document.createElement("a");
                link.href = response.downloadUrl;
                link.download = response.fileName || fileName || "download";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Download started!");
            } else {
                throw new Error("Failed to generate download URL");
            }
        } catch (error) {
            console.error("Download error:", error);

            // Fallback: try the old method with Cloudinary attachment flag
            try {
                const downloadUrl = fileUrl.includes("cloudinary.com")
                    ? fileUrl.replace("/upload/", "/upload/fl_attachment/")
                    : fileUrl;

                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = fileName || "download";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Download started (fallback)!");
            } catch (fallbackError) {
                console.error("Fallback download error:", fallbackError);
                // Final fallback: open in new tab
                window.open(fileUrl, "_blank");
                toast.info("File opened in new tab");
            }
        }
    };

    // Helper function to download UPI QR code
    const handleDownloadUpiQr = async () => {
        if (
            workRecord?.completionSubmission?.studentPaymentDetails
                ?.upiQrCodeUrl
        ) {
            await handleDownloadFile(
                workRecord.completionSubmission.studentPaymentDetails
                    .upiQrCodeUrl,
                `upi-qr-${workRecord._id}.jpg`,
                "upi-qr"
            );
        }
    };

    // Helper function to download payment proof
    const handleDownloadPaymentProof = async () => {
        if (workRecord?.paymentVerification?.paymentProofUrl) {
            await handleDownloadFile(
                workRecord.paymentVerification.paymentProofUrl,
                `payment-proof-${workRecord._id}.jpg`,
                "payment-proof"
            );
        }
    };

    // Handle client review submission
    const handleSubmitReview = async () => {
        if (!workRecord) return;

        if (!reviewText.trim() || reviewText.trim().length < 10) {
            toast.error("Please provide review text (minimum 10 characters)");
            return;
        }

        setSubmittingReview(true);
        try {
            const reviewData = {
                rating: reviewRating,
                reviewText: reviewText.trim(),
                skills: skillsRating,
                communication: communicationRating,
                timeliness: timelinessRating,
                quality: qualityRating,
                problemSolving: problemSolvingRating,
                teamwork: teamworkRating,
            };

            console.log("Submitting review with data:", {
                workId: workRecord._id,
                reviewData,
                workStatus: workRecord.workStatus,
            });

            const response = await workAPI.addClientReview(
                workRecord._id,
                reviewData
            );

            if (response && response.success) {
                const isUpdate = studentReview ? true : false;
                toast.success(
                    isUpdate
                        ? "Review updated successfully!"
                        : "Review submitted successfully!"
                );
                setShowReviewModal(false);
                // Reset form
                setReviewRating(5);
                setReviewText("");
                setSkillsRating(5);
                setCommunicationRating(5);
                setTimelinessRating(5);
                setQualityRating(5);
                setProblemSolvingRating(5);
                setTeamworkRating(5);

                // Update student performance data from response (prioritize backend data)
                if (response.studentReview) {
                    setStudentReview(response.studentReview);
                } else {
                    // Fallback: Create immediate review data for instant UI update
                    const immediateReviewData = {
                        reviewId: workRecord._id.toString(),
                        reviewedBy: user._id,
                        reviewerName: user.username,
                        reviewerRole: "client",
                        rating: reviewRating,
                        comment: reviewText.trim(),
                        projectRelated: workRecord._id.toString(),
                        reviewDate: new Date(),
                        tags: ["work-completion", "client-feedback"],
                    };
                    setStudentReview(immediateReviewData);
                }

                if (response.studentPerformance) {
                    setStudentPerformance(response.studentPerformance);
                } else {
                    // Fallback: Create immediate performance data
                    const immediatePerformanceData = {
                        overallRating: reviewRating,
                        totalReviews:
                            (studentPerformance?.totalReviews || 0) +
                            (studentReview ? 0 : 1),
                        technicalSkills: skillsRating,
                        communicationSkills: communicationRating,
                        punctuality: timelinessRating,
                        qualityOfWork: qualityRating,
                        problemSolving: problemSolvingRating,
                        teamwork: teamworkRating,
                    };
                    setStudentPerformance(immediatePerformanceData);
                }

                console.log("State updated with:", {
                    studentReview: response.studentReview || "fallback data",
                    studentPerformance:
                        response.studentPerformance || "fallback data",
                });

                // Refresh both work data and student performance data
                fetchWorkRecord();
                fetchStudentPerformance();
            } else {
                toast.error("Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            console.error("Error details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                url: error.config?.url,
                method: error.config?.method,
            });

            let errorMessage = "Error submitting review";

            if (error.response?.status === 400) {
                errorMessage =
                    error.response?.data?.message ||
                    "Invalid review data. Please check all fields.";
            } else if (error.response?.status === 403) {
                errorMessage = "You don't have permission to review this work.";
            } else if (error.response?.status === 404) {
                errorMessage = "Work record not found.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);

            // Refresh work record to get latest status
            fetchWorkRecord();
        } finally {
            setSubmittingReview(false);
        }
    };

    // Render star rating component
    const renderStarRating = (rating, setRating, label) => {
        return (
            <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                    {label}
                </label>
                <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl transition-colors ${
                                star <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                            } hover:text-yellow-300`}
                        >
                            <FaStar />
                        </button>
                    ))}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                    {rating} out of 5 stars
                </p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <FaSpinner className="text-6xl text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-xl text-gray-300">
                            Loading project details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-950 text-white">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                        <p className="text-xl text-gray-300">
                            Project not found
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => navigate("/assigned-works")}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                            <FaArrowLeft className="text-gray-300" />
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                {getServiceIcon(project.serviceCategory)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    {project.projectName}
                                </h1>
                                <p className="text-gray-400 mt-1 capitalize">
                                    {project.serviceCategory.replace("-", " ")}{" "}
                                    •{" "}
                                    {project.status
                                        .replace("_", " ")
                                        .toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Tabs */}
                    <div className="flex space-x-4 bg-gray-900 p-2 rounded-xl border border-gray-800">
                        <button
                            onClick={() => setActiveTab("in-review")}
                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "in-review"
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            <FaEye className="inline mr-2" />
                            In Review
                        </button>
                        <button
                            onClick={() => setActiveTab("in-process")}
                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "in-process"
                                    ? "bg-green-500 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            <FaClock className="inline mr-2" />
                            In Process
                        </button>
                    </div>
                </div>

                {/* In Review Tab Content */}
                {activeTab === "in-review" && (
                    <div className="space-y-6">
                        {/* Project Overview Card */}
                        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">
                                    Project Overview
                                </h2>
                                <div
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusBadge(
                                        project.status
                                    )}`}
                                >
                                    {getStatusIcon(project.status)}
                                    <span className="ml-2">
                                        {project.status
                                            .replace("_", " ")
                                            .toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Project Details Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* Financial Info */}
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <FaDollarSign className="text-green-400 text-xl" />
                                        <h3 className="text-lg font-semibold text-white">
                                            Budget
                                        </h3>
                                    </div>
                                    <p className="text-2xl font-bold text-green-400">
                                        {formatCurrency(project.quotedPrice)}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Payment on {project.paymentTerms}
                                    </p>
                                </div>

                                {/* Timeline Info */}
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <FaClock className="text-blue-400 text-xl" />
                                        <h3 className="text-lg font-semibold text-white">
                                            Timeline
                                        </h3>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {project.completionTime} days
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Due:{" "}
                                        {formatDate(
                                            project.expectedCompletionDate
                                        )}
                                    </p>
                                </div>

                                {/* Priority Info */}
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <FaExclamationTriangle
                                            className={`text-xl ${
                                                project.urgency === "urgent"
                                                    ? "text-red-400"
                                                    : "text-yellow-400"
                                            }`}
                                        />
                                        <h3 className="text-lg font-semibold text-white">
                                            Priority
                                        </h3>
                                    </div>
                                    <p
                                        className={`text-2xl font-bold capitalize ${
                                            project.urgency === "urgent"
                                                ? "text-red-400"
                                                : "text-yellow-400"
                                        }`}
                                    >
                                        {project.urgency}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Created: {formatDate(project.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Project Description */}
                            <div className="bg-gray-800/30 rounded-lg p-5 mb-6">
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    Project Description
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {project.projectDescription}
                                </p>
                            </div>

                            {/* Requirements */}
                            <div className="bg-gray-800/30 rounded-lg p-5 mb-6">
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    Requirements
                                </h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                    {project.requirements}
                                </p>
                            </div>

                            {/* Communication Preferences */}
                            <div className="bg-gray-800/30 rounded-lg p-5 mb-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Communication Preferences
                                </h3>
                                <div className="flex items-center space-x-4 mb-4">
                                    {getCommunicationIcon(
                                        project.communicationPreference
                                    )}
                                    <span className="text-white font-medium capitalize">
                                        {project.communicationPreference.replace(
                                            "-",
                                            " "
                                        )}
                                    </span>
                                </div>

                                {project.contactDetails && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {project.contactDetails.phoneNumber && (
                                            <div className="flex items-center space-x-3 text-gray-300">
                                                <FaPhone className="text-blue-400" />
                                                <span>
                                                    {
                                                        project.contactDetails
                                                            .phoneNumber
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {project.contactDetails
                                            .emailAddress && (
                                            <div className="flex items-center space-x-3 text-gray-300">
                                                <FaEnvelope className="text-purple-400" />
                                                <span>
                                                    {
                                                        project.contactDetails
                                                            .emailAddress
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {project.contactDetails.meetingLink && (
                                            <div className="flex items-center space-x-3 text-gray-300 md:col-span-2">
                                                <FaVideo className="text-red-400" />
                                                <a
                                                    href={
                                                        project.contactDetails
                                                            .meetingLink
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    {
                                                        project.contactDetails
                                                            .meetingLink
                                                    }
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Client Information Card */}
                        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Client Information
                            </h2>
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 flex-shrink-0">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                        {getProfileImage(
                                            project.assignedBy.profilePicture
                                        ) ? (
                                            <img
                                                src={getProfileImage(
                                                    project.assignedBy
                                                        .profilePicture
                                                )}
                                                alt={
                                                    project.assignedBy.username
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-gray-400 text-2xl" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white">
                                        {project.assignedBy.username}
                                    </h3>
                                    <p className="text-gray-400">
                                        {project.assignedBy.email}
                                    </p>
                                    {project.assignedBy.phone && (
                                        <p className="text-gray-400">
                                            {project.assignedBy.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status History */}
                        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <FaHistory className="mr-2" />
                                Status History
                            </h2>
                            <div className="space-y-4">
                                {project.statusHistory.map((history, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-lg"
                                    >
                                        <div className="flex-shrink-0">
                                            {getStatusIcon(history.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-white capitalize">
                                                    {history.status.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </h4>
                                                <span className="text-sm text-gray-400">
                                                    {formatDate(
                                                        history.changedAt
                                                    )}
                                                </span>
                                            </div>
                                            {history.reason && (
                                                <p className="text-gray-300 text-sm mb-1">
                                                    {history.reason}
                                                </p>
                                            )}
                                            {history.notes && (
                                                <p className="text-gray-400 text-sm">
                                                    {history.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Communication Section */}
                        <div
                            className={`bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-6 ${
                                project.status === "cancelled"
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <FaComment className="mr-2" />
                                    Communication
                                    {project.status === "cancelled" && (
                                        <span className="ml-2 text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                                            Disabled
                                        </span>
                                    )}
                                </h2>
                                <button
                                    onClick={() =>
                                        setShowCommunication(!showCommunication)
                                    }
                                    disabled={project.status === "cancelled"}
                                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                        project.status === "cancelled"
                                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                                >
                                    {showCommunication ? "Hide" : "Show"}{" "}
                                    Messages
                                </button>
                            </div>

                            {showCommunication && (
                                <div className="space-y-4">
                                    {project.status === "cancelled" && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <FaTimesCircle className="text-red-400" />
                                                <span className="text-red-300 font-medium">
                                                    Communication Disabled
                                                </span>
                                            </div>
                                            <p className="text-red-300/80 text-sm mt-2">
                                                Communication is disabled for
                                                cancelled projects. You can view
                                                previous messages but cannot
                                                send new ones.
                                            </p>
                                        </div>
                                    )}
                                    {/* Messages Display */}
                                    <div className="max-h-96 overflow-y-auto space-y-3 mb-4">
                                        {project.communications &&
                                        project.communications.length > 0 ? (
                                            project.communications.map(
                                                (communication, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-start space-x-3 p-4 rounded-lg ${
                                                            communication.sender
                                                                ._id ===
                                                            user?.userId
                                                                ? "bg-blue-500/10 border border-blue-500/20 ml-8"
                                                                : "bg-gray-800/30 mr-8"
                                                        }`}
                                                    >
                                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 flex-shrink-0">
                                                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                                                {getProfileImage(
                                                                    communication
                                                                        .sender
                                                                        .profilePicture
                                                                ) ? (
                                                                    <img
                                                                        src={getProfileImage(
                                                                            communication
                                                                                .sender
                                                                                .profilePicture
                                                                        )}
                                                                        alt={
                                                                            communication
                                                                                .sender
                                                                                .username
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <FaUser className="text-white text-sm" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-medium text-white">
                                                                        {
                                                                            communication
                                                                                .sender
                                                                                .username
                                                                        }
                                                                    </span>
                                                                    {communication.messageType !==
                                                                        "general" && (
                                                                        <span
                                                                            className={`text-xs px-2 py-1 rounded-full ${
                                                                                communication.messageType ===
                                                                                "objection"
                                                                                    ? "bg-red-500/20 text-red-300"
                                                                                    : communication.messageType ===
                                                                                      "clarification"
                                                                                    ? "bg-yellow-500/20 text-yellow-300"
                                                                                    : communication.messageType ===
                                                                                      "approval"
                                                                                    ? "bg-green-500/20 text-green-300"
                                                                                    : communication.messageType ===
                                                                                      "rejection"
                                                                                    ? "bg-red-500/20 text-red-300"
                                                                                    : "bg-gray-500/20 text-gray-300"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                communication.messageType
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-gray-400">
                                                                    {formatDate(
                                                                        communication.timestamp
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                                {
                                                                    communication.message
                                                                }
                                                            </p>
                                                            {!communication.isRead &&
                                                                communication
                                                                    .receiver
                                                                    ._id ===
                                                                    user?.userId && (
                                                                    <div className="mt-2">
                                                                        <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                                                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                                                            New
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-gray-400 text-center py-4">
                                                No messages yet
                                            </p>
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    {project.status !== "cancelled" && (
                                        <div className="flex space-x-3">
                                            <input
                                                type="text"
                                                value={communicationMessage}
                                                onChange={(e) =>
                                                    setCommunicationMessage(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Type your message..."
                                                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                onKeyPress={(e) => {
                                                    if (
                                                        e.key === "Enter" &&
                                                        !sendingMessage
                                                    ) {
                                                        handleSendMessage();
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={
                                                    sendingMessage ||
                                                    !communicationMessage.trim()
                                                }
                                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                            >
                                                {sendingMessage ? (
                                                    <FaSpinner className="animate-spin" />
                                                ) : (
                                                    <FaPaperPlane />
                                                )}
                                                <span>Send</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {(project.status === "submitted" ||
                            project.status === "pending") &&
                            user.role === "student" &&
                            !project.rejectionDetails?.isRejected && (
                                <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">
                                        Project Actions
                                    </h2>

                                    {/* Show objection details if exists */}
                                    {project.objectionDetails?.hasObjection &&
                                        !project.objectionDetails
                                            ?.isObjectionResolved && (
                                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <FaExclamation className="text-yellow-500" />
                                                    <span className="text-yellow-300 font-medium">
                                                        Objection Raised
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-1">
                                                    <strong>Reason:</strong>{" "}
                                                    {
                                                        project.objectionDetails
                                                            .objectionReason
                                                    }
                                                </p>
                                                <p className="text-gray-300 text-sm">
                                                    <strong>Message:</strong>{" "}
                                                    {
                                                        project.objectionDetails
                                                            .objectionMessage
                                                    }
                                                </p>
                                                <p className="text-gray-400 text-xs mt-2">
                                                    Waiting for client
                                                    response...
                                                </p>
                                            </div>
                                        )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Accept Button */}
                                        <button
                                            onClick={() =>
                                                handleProjectAction("accept")
                                            }
                                            disabled={
                                                project.objectionDetails
                                                    ?.hasObjection &&
                                                !project.objectionDetails
                                                    ?.isObjectionResolved
                                            }
                                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${
                                                project.objectionDetails
                                                    ?.hasObjection &&
                                                !project.objectionDetails
                                                    ?.isObjectionResolved
                                                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                            }`}
                                        >
                                            <FaCheckCircle />
                                            <span>Accept Project</span>
                                        </button>

                                        {/* Objection Button */}
                                        <button
                                            onClick={() =>
                                                setShowObjectionModal(true)
                                            }
                                            disabled={
                                                project.objectionDetails
                                                    ?.hasObjection &&
                                                !project.objectionDetails
                                                    ?.isObjectionResolved
                                            }
                                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${
                                                project.objectionDetails
                                                    ?.hasObjection &&
                                                !project.objectionDetails
                                                    ?.isObjectionResolved
                                                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                                            }`}
                                        >
                                            <FaExclamation />
                                            <span>Raise Objection</span>
                                        </button>

                                        {/* Reject Button */}
                                        <button
                                            onClick={() =>
                                                setShowRejectionModal(true)
                                            }
                                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                        >
                                            <FaTimesCircle />
                                            <span>Reject Project</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                )}

                {/* In Process Tab Content */}
                {activeTab === "in-process" && (
                    <div className="space-y-6">
                        {workLoading ? (
                            <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-8">
                                <div className="flex items-center justify-center">
                                    <FaSpinner className="animate-spin text-blue-500 text-2xl mr-3" />
                                    <span className="text-white">
                                        Loading work details...
                                    </span>
                                </div>
                            </div>
                        ) : !workRecord ? (
                            <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-8">
                                <div className="text-center">
                                    <FaClock className="text-6xl text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-semibold text-white mb-2">
                                        No Work Record Found
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        Work tracking will be available once the
                                        project is approved.
                                    </p>
                                    {project?.status === "submitted" && (
                                        <p className="text-blue-300 text-sm">
                                            Please approve the project first to
                                            start work tracking.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Work Overview */}
                                <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-semibold text-white flex items-center">
                                            <FaProjectDiagram className="mr-3 text-green-500" />
                                            Work Progress
                                        </h2>
                                        {getWorkStatusBadge(
                                            workRecord.workStatus
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-300 font-medium">
                                                Overall Progress
                                            </span>
                                            <span className="text-white font-semibold">
                                                {workRecord.progress
                                                    ?.percentage || 0}
                                                %
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        workRecord.progress
                                                            ?.percentage || 0
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Work Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                                            <FaCalendarAlt className="text-blue-400 mx-auto mb-2 text-lg" />
                                            <p className="text-xs text-gray-400 mb-1">
                                                Started Date
                                            </p>
                                            <p className="text-sm font-semibold text-white">
                                                {formatWorkDate(
                                                    workRecord.startedDate
                                                )}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                                            <FaClock className="text-orange-400 mx-auto mb-2 text-lg" />
                                            <p className="text-xs text-gray-400 mb-1">
                                                Expected Completion
                                            </p>
                                            <p className="text-sm font-semibold text-white">
                                                {formatWorkDate(
                                                    workRecord.expectedCompletionDate
                                                )}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                                            <FaDollarSign className="text-green-400 mx-auto mb-2 text-lg" />
                                            <p className="text-xs text-gray-400 mb-1">
                                                Project Value
                                            </p>
                                            <p className="text-sm font-semibold text-white">
                                                {formatCurrency(
                                                    workRecord.quotedPrice
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Milestone Buttons - Only for students */}
                                    {user?.role === "student" &&
                                        workRecord.workStatus !== "completed" &&
                                        workRecord.workStatus !==
                                            "delivered" && (
                                            <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
                                                <h3 className="text-lg font-semibold text-white mb-4">
                                                    Update Progress Milestones
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                                    {getProgressMilestones().map(
                                                        (milestone, index) => {
                                                            const isCompleted =
                                                                (workRecord
                                                                    .progress
                                                                    ?.percentage ||
                                                                    0) >=
                                                                milestone.percentage;
                                                            const isNext =
                                                                (workRecord
                                                                    .progress
                                                                    ?.percentage ||
                                                                    0) <
                                                                    milestone.percentage &&
                                                                (index === 0 ||
                                                                    (workRecord
                                                                        .progress
                                                                        ?.percentage ||
                                                                        0) >=
                                                                        getProgressMilestones()[
                                                                            index -
                                                                                1
                                                                        ]
                                                                            .percentage);

                                                            return (
                                                                <button
                                                                    key={index}
                                                                    onClick={() =>
                                                                        handleMilestoneClick(
                                                                            milestone
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updatingStatus ||
                                                                        isCompleted ||
                                                                        (!isNext &&
                                                                            milestone.percentage !==
                                                                                100)
                                                                    }
                                                                    className={`p-3 rounded-lg text-xs font-medium transition-all duration-200 flex flex-col items-center space-y-1 ${
                                                                        isCompleted
                                                                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                                                            : isNext
                                                                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                                                                            : "bg-gray-700/50 text-gray-500 border border-gray-600/30 cursor-not-allowed"
                                                                    }`}
                                                                >
                                                                    <milestone.icon
                                                                        className={`text-lg ${milestone.color}`}
                                                                    />
                                                                    <span className="font-bold">
                                                                        {
                                                                            milestone.percentage
                                                                        }
                                                                        %
                                                                    </span>
                                                                    <span className="text-center leading-tight">
                                                                        {
                                                                            milestone.description
                                                                        }
                                                                    </span>
                                                                    {isCompleted && (
                                                                        <FaCheckCircle className="text-green-400 text-sm" />
                                                                    )}
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-4">
                                                    <div className="flex items-center space-x-2">
                                                        <FaExclamationTriangle className="text-yellow-500 text-sm" />
                                                        <p className="text-xs text-yellow-300 font-medium">
                                                            Warning: Only click
                                                            on milestones when
                                                            you have actually
                                                            completed that stage
                                                            of work. This will
                                                            update your progress
                                                            permanently.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {/* Payment Section for Clients */}
                                    {user?.role !== "student" &&
                                        workRecord.workStatus ===
                                            "payment_pending" && (
                                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                    <FaCreditCard className="text-green-400 mr-2" />
                                                    Payment Required
                                                </h3>

                                                {/* Student Payment Details Display */}
                                                {workRecord.completionSubmission
                                                    ?.studentPaymentDetails && (
                                                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                                                        <h4 className="text-white font-medium mb-3">
                                                            Student Payment
                                                            Details:
                                                        </h4>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {workRecord
                                                                .completionSubmission
                                                                .studentPaymentDetails
                                                                .upiId && (
                                                                <div>
                                                                    <p className="text-gray-400 text-sm mb-1">
                                                                        UPI ID:
                                                                    </p>
                                                                    <p className="text-white font-mono break-all">
                                                                        {
                                                                            workRecord
                                                                                .completionSubmission
                                                                                .studentPaymentDetails
                                                                                .upiId
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    UPI Phone
                                                                    Number:
                                                                </p>
                                                                <p className="text-white font-mono">
                                                                    {
                                                                        workRecord
                                                                            .completionSubmission
                                                                            .studentPaymentDetails
                                                                            .upiPhoneNumber
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Amount to
                                                                    Pay:
                                                                </p>
                                                                <p className="text-green-400 font-bold text-lg">
                                                                    {formatCurrency(
                                                                        workRecord.quotedPrice
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {workRecord
                                                            .completionSubmission
                                                            .studentPaymentDetails
                                                            .upiQrCodeUrl && (
                                                            <div className="mt-4">
                                                                <p className="text-gray-400 text-sm mb-2">
                                                                    UPI QR Code:
                                                                </p>
                                                                <div className="relative inline-block group w-48 h-48">
                                                                    <img
                                                                        src={
                                                                            workRecord
                                                                                .completionSubmission
                                                                                .studentPaymentDetails
                                                                                .upiQrCodeUrl
                                                                        }
                                                                        alt="UPI QR Code"
                                                                        className="w-full h-full object-contain bg-white rounded-lg p-2 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                                                        onClick={() => {
                                                                            console.log(
                                                                                "QR Code clicked, opening modal..."
                                                                            );
                                                                            openImageModal(
                                                                                workRecord
                                                                                    .completionSubmission
                                                                                    .studentPaymentDetails
                                                                                    .upiQrCodeUrl,
                                                                                "UPI QR Code"
                                                                            );
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 rounded-lg pointer-events-none">
                                                                        <FaEye className="text-white text-2xl" />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={
                                                                        handleDownloadUpiQr
                                                                    }
                                                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                                                                >
                                                                    <FaDownload className="w-3 h-3" />
                                                                    <span>
                                                                        Download
                                                                        QR
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {workRecord
                                                            .completionSubmission
                                                            .studentPaymentDetails
                                                            .paymentInstructions && (
                                                            <div className="mt-4">
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Payment
                                                                    Instructions:
                                                                </p>
                                                                <p className="text-gray-300 text-sm">
                                                                    {
                                                                        workRecord
                                                                            .completionSubmission
                                                                            .studentPaymentDetails
                                                                            .paymentInstructions
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        setShowClientPaymentModal(
                                                            true
                                                        )
                                                    }
                                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                                >
                                                    <FaReceipt />
                                                    <span>
                                                        Upload Payment Proof
                                                    </span>
                                                </button>
                                            </div>
                                        )}

                                    {/* Payment Submitted Status for Clients */}
                                    {user?.role !== "student" &&
                                        workRecord.workStatus ===
                                            "payment_submitted" && (
                                            <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                    <FaReceipt className="text-blue-400 mr-2" />
                                                    Payment Proof Submitted
                                                </h3>
                                                <p className="text-gray-300 mb-4">
                                                    Your payment proof has been
                                                    submitted and is being
                                                    verified by the admin. You
                                                    will be notified once the
                                                    verification is complete.
                                                </p>
                                                <div className="bg-gray-800/50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-400">
                                                        Transaction ID:{" "}
                                                        <span className="text-white font-mono">
                                                            {
                                                                workRecord
                                                                    .paymentVerification
                                                                    ?.upiTransactionId
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Amount:{" "}
                                                        <span className="text-white font-semibold">
                                                            {formatCurrency(
                                                                workRecord
                                                                    .paymentVerification
                                                                    ?.paymentAmount
                                                            )}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Status:{" "}
                                                        <span className="text-yellow-400 font-semibold">
                                                            Pending Verification
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    {/* Student Payment Verification Section */}
                                    {user?.role === "student" &&
                                        workRecord.workStatus ===
                                            "payment_submitted" && (
                                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                    <FaReceipt className="text-green-400 mr-2" />
                                                    Verify Payment & Complete
                                                    Work
                                                </h3>
                                                <p className="text-gray-300 mb-4">
                                                    Client has submitted payment
                                                    proof. Please verify the
                                                    payment details and complete
                                                    the work.
                                                </p>

                                                {/* Payment Details Display */}
                                                {workRecord.paymentVerification && (
                                                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                                                        <h4 className="text-white font-medium mb-3">
                                                            Payment Details:
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Transaction
                                                                    ID:
                                                                </p>
                                                                <p className="text-white font-mono">
                                                                    {
                                                                        workRecord
                                                                            .paymentVerification
                                                                            .upiTransactionId
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Amount:
                                                                </p>
                                                                <p className="text-green-400 font-semibold">
                                                                    {formatCurrency(
                                                                        workRecord
                                                                            .paymentVerification
                                                                            .paymentAmount
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Paid To:
                                                                </p>
                                                                <p className="text-white">
                                                                    {
                                                                        workRecord
                                                                            .paymentVerification
                                                                            .paymentToName
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Payment
                                                                    Date:
                                                                </p>
                                                                <p className="text-white">
                                                                    {formatDate(
                                                                        workRecord
                                                                            .paymentVerification
                                                                            .paymentDate
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Payment Proof Image */}
                                                        {workRecord
                                                            .paymentVerification
                                                            .paymentProofUrl && (
                                                            <div className="mt-4">
                                                                <p className="text-gray-400 text-sm mb-2">
                                                                    Payment
                                                                    Proof:
                                                                </p>
                                                                <div className="relative inline-block group w-48 h-48">
                                                                    <img
                                                                        src={
                                                                            workRecord
                                                                                .paymentVerification
                                                                                .paymentProofUrl
                                                                        }
                                                                        alt="Payment Proof"
                                                                        className="w-full h-full object-contain bg-white rounded-lg p-2 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                                                        onClick={() =>
                                                                            openImageModal(
                                                                                workRecord
                                                                                    .paymentVerification
                                                                                    .paymentProofUrl,
                                                                                "Payment Proof"
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 rounded-lg pointer-events-none">
                                                                        <FaEye className="text-white text-2xl" />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={
                                                                        handleDownloadPaymentProof
                                                                    }
                                                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                                                                >
                                                                    <FaDownload className="w-3 h-3" />
                                                                    <span>
                                                                        Download
                                                                        Proof
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        setShowPaymentVerificationModal(
                                                            true
                                                        )
                                                    }
                                                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                                >
                                                    <FaCheckCircle />
                                                    <span>
                                                        Verify Payment &
                                                        Complete Work
                                                    </span>
                                                </button>
                                            </div>
                                        )}

                                    {/* Client Review Section */}
                                    {user?.role !== "student" &&
                                        workRecord.workStatus ===
                                            "completed" && (
                                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                    <FaStar className="text-purple-400 mr-2" />
                                                    {studentReview
                                                        ? "Update Your Review"
                                                        : "Rate Your Experience"}
                                                </h3>
                                                <p className="text-gray-300 mb-4">
                                                    {studentReview
                                                        ? "You can update your review and rating for this student."
                                                        : "The work has been completed successfully! Please rate your experience with the student."}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        // Pre-fill form if review exists
                                                        if (studentReview) {
                                                            setReviewRating(
                                                                studentReview.rating ||
                                                                    5
                                                            );
                                                            setReviewText(
                                                                studentReview.comment ||
                                                                    ""
                                                            );
                                                            setSkillsRating(
                                                                studentPerformance?.technicalSkills ||
                                                                    5
                                                            );
                                                            setCommunicationRating(
                                                                studentPerformance?.communicationSkills ||
                                                                    5
                                                            );
                                                            setTimelinessRating(
                                                                studentPerformance?.punctuality ||
                                                                    5
                                                            );
                                                            setQualityRating(
                                                                studentPerformance?.qualityOfWork ||
                                                                    5
                                                            );
                                                            setProblemSolvingRating(
                                                                studentPerformance?.problemSolving ||
                                                                    5
                                                            );
                                                            setTeamworkRating(
                                                                studentPerformance?.teamwork ||
                                                                    5
                                                            );
                                                        }
                                                        setShowReviewModal(
                                                            true
                                                        );
                                                    }}
                                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                                >
                                                    <FaStar />
                                                    <span>
                                                        {studentReview
                                                            ? "Update Review & Rating"
                                                            : "Add Review & Rating"}
                                                    </span>
                                                </button>
                                            </div>
                                        )}

                                    {/* Display Client Review */}
                                    {studentReview && (
                                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <FaStar className="text-purple-400 mr-2" />
                                                Client Review
                                                <span className="text-xs text-gray-400 ml-2">
                                                    (Debug:{" "}
                                                    {studentPerformance?.totalReviews ||
                                                        0}{" "}
                                                    reviews)
                                                </span>
                                            </h3>

                                            <div className="bg-gray-800/50 rounded-lg p-4">
                                                {/* Overall Rating */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-white font-medium">
                                                            Overall Rating:
                                                        </span>
                                                        <div className="flex space-x-1">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <FaStar
                                                                    key={star}
                                                                    className={`text-lg ${
                                                                        star <=
                                                                        studentReview.rating
                                                                            ? "text-yellow-400"
                                                                            : "text-gray-600"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-yellow-400 font-semibold">
                                                            {
                                                                studentReview.rating
                                                            }
                                                            /5
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-400 text-sm">
                                                        {formatDate(
                                                            studentReview.reviewDate
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Detailed Ratings */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                                                    <div className="text-center">
                                                        <p className="text-gray-400 text-sm">
                                                            Skills
                                                        </p>
                                                        <p className="text-white font-semibold">
                                                            {studentPerformance?.technicalSkills !==
                                                            undefined
                                                                ? studentPerformance.technicalSkills
                                                                : "N/A"}
                                                            /5
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-gray-400 text-sm">
                                                            Communication
                                                        </p>
                                                        <p className="text-white font-semibold">
                                                            {studentPerformance?.communicationSkills !==
                                                            undefined
                                                                ? studentPerformance.communicationSkills
                                                                : "N/A"}
                                                            /5
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-gray-400 text-sm">
                                                            Timeliness
                                                        </p>
                                                        <p className="text-white font-semibold">
                                                            {studentPerformance?.punctuality !==
                                                            undefined
                                                                ? studentPerformance.punctuality
                                                                : "N/A"}
                                                            /5
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-gray-400 text-sm">
                                                            Quality
                                                        </p>
                                                        <p className="text-white font-semibold">
                                                            {studentPerformance?.qualityOfWork !==
                                                            undefined
                                                                ? studentPerformance.qualityOfWork
                                                                : "N/A"}
                                                            /5
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-gray-400 text-sm">
                                                            Problem Solving
                                                        </p>
                                                        <p className="text-white font-semibold">
                                                            {studentPerformance?.problemSolving !==
                                                            undefined
                                                                ? studentPerformance.problemSolving
                                                                : "N/A"}
                                                            /5
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-gray-400 text-sm">
                                                            Teamwork
                                                        </p>
                                                        <p className="text-white font-semibold">
                                                            {studentPerformance?.teamwork !==
                                                            undefined
                                                                ? studentPerformance.teamwork
                                                                : "N/A"}
                                                            /5
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Review Text */}
                                                <div className="border-t border-gray-700 pt-4">
                                                    <p className="text-gray-300 leading-relaxed">
                                                        "{studentReview.comment}
                                                        "
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Deliverables Access Section */}
                                    {(workRecord.workStatus ===
                                        "payment_verified" ||
                                        workRecord.workStatus === "completed" ||
                                        workRecord.workStatus ===
                                            "delivered") &&
                                        user?.role !== "student" && (
                                            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg p-6 mb-6">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                    <FaTrophy className="text-emerald-400 mr-2" />
                                                    Project Completed -
                                                    Deliverables Available
                                                </h3>
                                                <p className="text-gray-300 mb-4">
                                                    {workRecord.workStatus ===
                                                    "completed"
                                                        ? "Work has been completed and payment verified by the student. You can now access all project deliverables."
                                                        : "Payment has been verified! You can now access all project deliverables."}
                                                </p>

                                                {/* Completion Summary */}
                                                {workRecord.completionSubmission && (
                                                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                                                        <h4 className="text-white font-medium mb-3 flex items-center">
                                                            <FaCheckCircle className="text-green-400 mr-2" />
                                                            Completion Summary
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Completed
                                                                    On:
                                                                </p>
                                                                <p className="text-white">
                                                                    {formatDate(
                                                                        workRecord
                                                                            .completionSubmission
                                                                            .submittedAt
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Work
                                                                    Progress:
                                                                </p>
                                                                <p className="text-green-400 font-semibold">
                                                                    {workRecord
                                                                        .progress
                                                                        ?.percentage ||
                                                                        100}
                                                                    % Complete
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {workRecord
                                                            .completionSubmission
                                                            .submissionNotes && (
                                                            <div className="border-t border-gray-700 pt-3">
                                                                <p className="text-gray-400 text-sm mb-1">
                                                                    Student
                                                                    Notes:
                                                                </p>
                                                                <p className="text-gray-300 italic">
                                                                    "
                                                                    {
                                                                        workRecord
                                                                            .completionSubmission
                                                                            .submissionNotes
                                                                    }
                                                                    "
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Display Completion Files */}
                                                {workRecord.completionSubmission
                                                    ?.completionFiles?.length >
                                                    0 && (
                                                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                                                        <h4 className="text-white font-medium mb-3">
                                                            Project Files:
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {workRecord.completionSubmission.completionFiles.map(
                                                                (
                                                                    file,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-center justify-between bg-gray-700/50 p-3 rounded"
                                                                    >
                                                                        <div className="flex items-center space-x-3">
                                                                            <FaFileAlt className="text-blue-400" />
                                                                            <div>
                                                                                <p className="text-white font-medium">
                                                                                    {
                                                                                        file.fileName
                                                                                    }
                                                                                </p>
                                                                                <p className="text-gray-400 text-xs">
                                                                                    {(
                                                                                        file.fileSize /
                                                                                        1024 /
                                                                                        1024
                                                                                    ).toFixed(
                                                                                        2
                                                                                    )}{" "}
                                                                                    MB
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDownloadFile(
                                                                                    file.fileUrl,
                                                                                    file.fileName
                                                                                )
                                                                            }
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                        >
                                                                            Download
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Display Project Links */}
                                                {workRecord.completionSubmission
                                                    ?.projectLinks?.length >
                                                    0 && (
                                                    <div className="bg-gray-800/50 rounded-lg p-4">
                                                        <h4 className="text-white font-medium mb-3">
                                                            Project Links:
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {workRecord.completionSubmission.projectLinks.map(
                                                                (
                                                                    link,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-center justify-between bg-gray-700/50 p-3 rounded"
                                                                    >
                                                                        <div className="flex items-center space-x-3">
                                                                            <FaCode className="text-green-400" />
                                                                            <div>
                                                                                <p className="text-white font-medium">
                                                                                    {link.linkType
                                                                                        .replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )
                                                                                        .toUpperCase()}
                                                                                </p>
                                                                                {link.description && (
                                                                                    <p className="text-gray-400 text-sm">
                                                                                        {
                                                                                            link.description
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <a
                                                                            href={
                                                                                link.url
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                        >
                                                                            Visit
                                                                        </a>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>

                                {/* Work Updates History */}
                                <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                        <FaHistory className="mr-2 text-blue-500" />
                                        Work Updates History
                                    </h2>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {workRecord.workUpdates &&
                                        workRecord.workUpdates.length > 0 ? (
                                            workRecord.workUpdates
                                                .slice()
                                                .reverse()
                                                .map((update, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gray-800/30 rounded-lg p-4 border-l-4 border-blue-500"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <span className="text-sm font-medium text-blue-300 bg-blue-500/20 px-2 py-1 rounded">
                                                                        {update.updateType
                                                                            .replace(
                                                                                "_",
                                                                                " "
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        {formatWorkDate(
                                                                            update.createdAt
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-300 text-sm">
                                                                    {
                                                                        update.description
                                                                    }
                                                                </p>
                                                                {update.metadata && (
                                                                    <div className="mt-2 text-xs text-gray-400">
                                                                        {update
                                                                            .metadata
                                                                            .percentage && (
                                                                            <span>
                                                                                Progress:{" "}
                                                                                {
                                                                                    update
                                                                                        .metadata
                                                                                        .percentage
                                                                                }

                                                                                %
                                                                            </span>
                                                                        )}
                                                                        {update
                                                                            .metadata
                                                                            .oldStatus &&
                                                                            update
                                                                                .metadata
                                                                                .newStatus && (
                                                                                <span>
                                                                                    Status:{" "}
                                                                                    {
                                                                                        update
                                                                                            .metadata
                                                                                            .oldStatus
                                                                                    }{" "}
                                                                                    →{" "}
                                                                                    {
                                                                                        update
                                                                                            .metadata
                                                                                            .newStatus
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <FaHistory className="text-4xl text-gray-500 mx-auto mb-3" />
                                                <p className="text-gray-400">
                                                    No work updates yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Milestone Confirmation Modal */}
            {showMilestoneConfirm && selectedMilestone && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <FaQuestion className="text-blue-500 mr-2" />
                                    Confirm Progress Update
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowMilestoneConfirm(false);
                                        setSelectedMilestone(null);
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <selectedMilestone.icon
                                            className={`text-2xl ${selectedMilestone.color}`}
                                        />
                                        <div>
                                            <h4 className="text-lg font-semibold text-white">
                                                {selectedMilestone.percentage}%
                                                -{" "}
                                                {selectedMilestone.description}
                                            </h4>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        Are you sure you want to mark this
                                        milestone as completed? This will update
                                        your progress to{" "}
                                        {selectedMilestone.percentage}%.
                                    </p>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                                    <div className="flex items-start space-x-2">
                                        <FaExclamationTriangle className="text-yellow-500 text-sm mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-yellow-300">
                                            <strong>Important:</strong> Only
                                            confirm if you have actually
                                            completed this stage of work. This
                                            action cannot be easily undone.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowMilestoneConfirm(false);
                                        setSelectedMilestone(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmMilestoneUpdate}
                                    disabled={updatingStatus}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {updatingStatus ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaCheckCircle />
                                    )}
                                    <span>
                                        {updatingStatus
                                            ? "Updating..."
                                            : "Confirm Update"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Objection Modal */}
            {showObjectionModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <FaExclamation className="text-yellow-500 mr-2" />
                                    Raise Objection
                                </h3>
                                <button
                                    onClick={() => setShowObjectionModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Objection Reason *
                                    </label>
                                    <input
                                        type="text"
                                        value={objectionReason}
                                        onChange={(e) =>
                                            setObjectionReason(e.target.value)
                                        }
                                        placeholder="e.g., Budget concerns, Timeline issues, etc."
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Detailed Message *
                                    </label>
                                    <textarea
                                        value={objectionMessage}
                                        onChange={(e) =>
                                            setObjectionMessage(e.target.value)
                                        }
                                        placeholder="Please provide detailed explanation of your objection..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() =>
                                            setShowObjectionModal(false)
                                        }
                                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleObjection}
                                        disabled={
                                            submittingObjection ||
                                            !objectionReason.trim() ||
                                            !objectionMessage.trim()
                                        }
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        {submittingObjection ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <FaExclamation />
                                        )}
                                        <span>Raise Objection</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <FaTimesCircle className="text-red-500 mr-2" />
                                    Reject Project
                                </h3>
                                <button
                                    onClick={() => setShowRejectionModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Rejection Reason *
                                    </label>
                                    <select
                                        value={rejectionReason}
                                        onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                        }
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">
                                            Select a reason
                                        </option>
                                        <option value="budget_too_low">
                                            Budget too low
                                        </option>
                                        <option value="timeline_too_tight">
                                            Timeline too tight
                                        </option>
                                        <option value="scope_unclear">
                                            Scope unclear
                                        </option>
                                        <option value="technical_complexity">
                                            Technical complexity
                                        </option>
                                        <option value="resource_unavailable">
                                            Resource unavailable
                                        </option>
                                        <option value="skill_mismatch">
                                            Skill mismatch
                                        </option>
                                        <option value="communication_issues">
                                            Communication issues
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {rejectionReason === "other" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Custom Reason *
                                        </label>
                                        <input
                                            type="text"
                                            value={customRejectionReason}
                                            onChange={(e) =>
                                                setCustomRejectionReason(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Please specify the reason..."
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Detailed Message *
                                    </label>
                                    <textarea
                                        value={rejectionMessage}
                                        onChange={(e) =>
                                            setRejectionMessage(e.target.value)
                                        }
                                        placeholder="Please provide detailed explanation for rejection..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() =>
                                            setShowRejectionModal(false)
                                        }
                                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRejection}
                                        disabled={
                                            submittingRejection ||
                                            !rejectionReason ||
                                            !rejectionMessage.trim() ||
                                            (rejectionReason === "other" &&
                                                !customRejectionReason.trim())
                                        }
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        {submittingRejection ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <FaTimesCircle />
                                        )}
                                        <span>Reject Project</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Work Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaTrophy className="text-yellow-500" />
                                    <span>
                                        Complete Work & Submit Payment Details
                                    </span>
                                </h3>
                                <button
                                    onClick={() =>
                                        setShowCompletionModal(false)
                                    }
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Service Type Indicator */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <p className="text-blue-400 text-sm">
                                    Service Type:{" "}
                                    <span className="font-medium text-blue-300">
                                        {project?.serviceCategory
                                            ?.replace("-", " ")
                                            .replace(/\b\w/g, (l) =>
                                                l.toUpperCase()
                                            )}
                                    </span>
                                </p>
                            </div>

                            {/* Document Upload Section - for resume and content writing */}
                            {["resume-services", "content-writing"].includes(
                                project?.serviceCategory
                            ) && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white font-medium mb-2">
                                            Upload Completion Files *
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                                            onChange={
                                                handleCompletionFilesChange
                                            }
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                        />
                                        <p className="text-gray-400 text-sm mt-2">
                                            Supported formats: PDF, DOC, DOCX,
                                            TXT, ZIP, RAR (Max: 50MB per file)
                                        </p>
                                        {completionFiles.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {completionFiles.map(
                                                    (file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between bg-gray-800 p-2 rounded"
                                                        >
                                                            <span className="text-sm text-gray-300">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {(
                                                                    file.size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(
                                                                    2
                                                                )}{" "}
                                                                MB
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Project Links Section - for other project types */}
                            {!["resume-services", "content-writing"].includes(
                                project?.serviceCategory
                            ) && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white font-medium mb-2">
                                            Project Links *
                                        </label>
                                        {projectLinks.map((link, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3"
                                            >
                                                <select
                                                    value={link.linkType}
                                                    onChange={(e) =>
                                                        handleProjectLinksChange(
                                                            index,
                                                            "linkType",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                                >
                                                    <option value="github">
                                                        GitHub Repository
                                                    </option>
                                                    <option value="live_demo">
                                                        Live Demo
                                                    </option>
                                                    <option value="documentation">
                                                        Documentation
                                                    </option>
                                                    <option value="other">
                                                        Other
                                                    </option>
                                                </select>
                                                <input
                                                    type="url"
                                                    placeholder="Enter URL..."
                                                    value={link.url}
                                                    onChange={(e) =>
                                                        handleProjectLinksChange(
                                                            index,
                                                            "url",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                                                />
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Description..."
                                                        value={link.description}
                                                        onChange={(e) =>
                                                            handleProjectLinksChange(
                                                                index,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                                                    />
                                                    {projectLinks.length >
                                                        1 && (
                                                        <button
                                                            onClick={() =>
                                                                removeProjectLink(
                                                                    index
                                                                )
                                                            }
                                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={addProjectLink}
                                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                        >
                                            <span>+ Add another link</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Submission Notes */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Submission Notes
                                </label>
                                <textarea
                                    value={submissionNotes}
                                    onChange={(e) =>
                                        setSubmissionNotes(e.target.value)
                                    }
                                    placeholder="Add any additional notes about your work completion..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Payment Details Section */}
                            <div className="border-t border-gray-700 pt-6">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <FaCreditCard className="text-green-400 mr-2" />
                                    Payment Details Required
                                </h4>

                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                                    <p className="text-green-400 text-sm">
                                        Complete your work submission by
                                        providing payment details. Your progress
                                        will be updated to 100% once both
                                        completion proof and payment details are
                                        submitted.
                                    </p>
                                </div>

                                {/* UPI QR Code Upload with Preview */}
                                <div className="mb-4">
                                    <label className="block text-white font-medium mb-2">
                                        Upload UPI QR Code *
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleUpiQrChange}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                                            />
                                            <p className="text-gray-400 text-xs mt-1">
                                                Upload clear image of your UPI
                                                QR code (Max 5MB)
                                            </p>
                                            {upiQrFile && (
                                                <p className="text-green-400 text-sm mt-2">
                                                    ✓ {upiQrFile.name}
                                                </p>
                                            )}
                                        </div>
                                        {/* Image Preview */}
                                        {upiQrPreview && (
                                            <div className="flex justify-center">
                                                <div className="relative group">
                                                    <img
                                                        src={upiQrPreview}
                                                        alt="UPI QR Code Preview"
                                                        className="w-32 h-32 object-cover rounded-lg border-2 border-green-500 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                                        onClick={() =>
                                                            openImageModal(
                                                                upiQrPreview,
                                                                "UPI QR Code Preview"
                                                            )
                                                        }
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 rounded-lg pointer-events-none">
                                                        <FaEye className="text-white text-lg" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUpiQrFile(null);
                                                            setUpiQrPreview(
                                                                null
                                                            );
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* UPI Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* UPI ID */}
                                    <div>
                                        <label className="block text-white font-medium mb-2">
                                            UPI ID *
                                        </label>
                                        <input
                                            type="text"
                                            value={upiId}
                                            onChange={(e) =>
                                                setUpiId(e.target.value)
                                            }
                                            placeholder="e.g., yourname@paytm, yourname@googlepy"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>

                                    {/* UPI Phone Number */}
                                    <div>
                                        <label className="block text-white font-medium mb-2">
                                            UPI Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={upiPhoneNumber}
                                            onChange={(e) =>
                                                setUpiPhoneNumber(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 10)
                                                )
                                            }
                                            placeholder="Enter 10-digit phone number"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                {/* Payment Instructions */}
                                <div className="mt-4">
                                    <label className="block text-white font-medium mb-2">
                                        Payment Instructions (Optional)
                                    </label>
                                    <textarea
                                        value={paymentInstructions}
                                        onChange={(e) =>
                                            setPaymentInstructions(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Any special instructions for payment..."
                                        rows={2}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() =>
                                        setShowCompletionModal(false)
                                    }
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitCompletion}
                                    disabled={submittingCompletion}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {submittingCompletion ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaPaperPlane />
                                    )}
                                    <span>Submit Work & Payment Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Payment Details Modal - Now integrated into completion modal */}
            {false && showPaymentModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-700 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaCreditCard className="text-green-500" />
                                    <span>Payment Details</span>
                                </h3>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <p className="text-green-400 text-sm">
                                    Work completed! Now provide your payment
                                    details for the client.
                                </p>
                            </div>

                            {/* UPI QR Code Upload */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Upload UPI QR Code *
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpiQrChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    Upload clear image of your UPI QR code
                                </p>
                            </div>

                            {/* UPI Phone Number */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    UPI Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={upiPhoneNumber}
                                    onChange={(e) =>
                                        setUpiPhoneNumber(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 10)
                                        )
                                    }
                                    placeholder="Enter 10-digit phone number"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Payment Instructions */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Payment Instructions (Optional)
                                </label>
                                <textarea
                                    value={paymentInstructions}
                                    onChange={(e) =>
                                        setPaymentInstructions(e.target.value)
                                    }
                                    placeholder="Any special instructions for payment..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitPaymentDetails}
                                    disabled={
                                        submittingPayment ||
                                        !upiQrFile ||
                                        !upiPhoneNumber
                                    }
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {submittingPayment ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaCreditCard />
                                    )}
                                    <span>Submit Payment Details</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Client Payment Proof Modal */}
            {showClientPaymentModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-700 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaReceipt className="text-blue-500" />
                                    <span>Upload Payment Proof</span>
                                </h3>
                                <button
                                    onClick={() =>
                                        setShowClientPaymentModal(false)
                                    }
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Payment Proof Upload */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Payment Screenshot *
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePaymentProofChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    Upload screenshot of successful payment
                                </p>
                            </div>

                            {/* UPI Transaction ID */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    UPI Transaction ID *
                                </label>
                                <input
                                    type="text"
                                    value={upiTransactionId}
                                    onChange={(e) =>
                                        setUpiTransactionId(e.target.value)
                                    }
                                    placeholder="Enter UPI Transaction ID"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Payment To Name */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Payment To Name *
                                </label>
                                <input
                                    type="text"
                                    value={paymentToName}
                                    onChange={(e) =>
                                        setPaymentToName(e.target.value)
                                    }
                                    placeholder="Name of the recipient"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Payment Amount */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Payment Amount *
                                </label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) =>
                                        setPaymentAmount(e.target.value)
                                    }
                                    placeholder="Enter payment amount"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Payment Date */}
                            <div>
                                <label className="block text-white font-medium mb-2">
                                    Payment Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) =>
                                        setPaymentDate(e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() =>
                                        setShowClientPaymentModal(false)
                                    }
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitClientPayment}
                                    disabled={
                                        submittingClientPayment ||
                                        !paymentProofFile ||
                                        !upiTransactionId ||
                                        !paymentToName ||
                                        !paymentAmount
                                    }
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {submittingClientPayment ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaReceipt />
                                    )}
                                    <span>Submit Payment Proof</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Debug indicator */}
            {showImageModal && (
                <div className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded z-[10000]">
                    Modal should be visible:{" "}
                    {modalImageSrc ? "Has image" : "No image"}
                </div>
            )}

            {/* Image Viewer Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
                    {/* Modal Controls */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                        <div className="bg-black/50 rounded-lg px-3 py-1">
                            <span className="text-white text-sm">
                                {Math.round(imageScale * 100)}%
                            </span>
                        </div>
                        <button
                            onClick={handleZoomOut}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                            title="Zoom Out"
                        >
                            <span className="text-lg font-bold">-</span>
                        </button>
                        <button
                            onClick={handleZoomIn}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                            title="Zoom In"
                        >
                            <span className="text-lg font-bold">+</span>
                        </button>
                        <button
                            onClick={handleResetZoom}
                            className="px-3 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors text-sm"
                            title="Reset Zoom"
                        >
                            Reset
                        </button>
                        <button
                            onClick={closeImageModal}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                            title="Close"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    </div>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStartPinch}
                        onTouchMove={handleTouchMovePinch}
                        onTouchEnd={handleTouchEndPinch}
                    >
                        <img
                            src={modalImageSrc}
                            alt={modalImageAlt}
                            className="max-w-none select-none"
                            style={{
                                transform: `scale(${imageScale}) translate(${
                                    imagePosition.x / imageScale
                                }px, ${imagePosition.y / imageScale}px)`,
                                transition: isDragging
                                    ? "none"
                                    : "transform 0.2s ease-out",
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-lg px-4 py-2">
                        <p className="text-white text-sm text-center">
                            <span className="hidden md:inline">
                                Scroll to zoom • Drag to pan •{" "}
                            </span>
                            Click outside or press ESC to close
                        </p>
                    </div>

                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={closeImageModal}
                    />
                </div>
            )}

            {/* Student Payment Verification Modal */}
            {showPaymentVerificationModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-700 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Verify Payment</span>
                                </h3>
                                <button
                                    onClick={() =>
                                        setShowPaymentVerificationModal(false)
                                    }
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                                <p className="text-green-400 text-sm">
                                    By verifying this payment, you confirm that
                                    you have received the payment and the work
                                    will be marked as completed.
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-white font-medium mb-2">
                                    Verification Notes (Optional)
                                </label>
                                <textarea
                                    value={verificationNotes}
                                    onChange={(e) =>
                                        setVerificationNotes(e.target.value)
                                    }
                                    placeholder="Add any notes about the payment verification..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() =>
                                        setShowPaymentVerificationModal(false)
                                    }
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStudentPaymentVerification}
                                    disabled={submittingVerification}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {submittingVerification ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaCheckCircle />
                                    )}
                                    <span>Verify & Complete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Client Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-700 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaStar className="text-purple-500" />
                                    <span>
                                        {studentReview
                                            ? "Update Your Review"
                                            : "Rate Your Experience"}
                                    </span>
                                </h3>
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
                                <p className="text-purple-400 text-sm">
                                    Please rate your experience working with
                                    this student. Your feedback helps improve
                                    our platform.
                                </p>
                            </div>

                            {/* Overall Rating */}
                            {renderStarRating(
                                reviewRating,
                                setReviewRating,
                                "Overall Rating"
                            )}

                            {/* Detailed Ratings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {renderStarRating(
                                    skillsRating,
                                    setSkillsRating,
                                    "Technical Skills"
                                )}
                                {renderStarRating(
                                    communicationRating,
                                    setCommunicationRating,
                                    "Communication"
                                )}
                                {renderStarRating(
                                    timelinessRating,
                                    setTimelinessRating,
                                    "Timeliness"
                                )}
                                {renderStarRating(
                                    qualityRating,
                                    setQualityRating,
                                    "Work Quality"
                                )}
                                {renderStarRating(
                                    problemSolvingRating,
                                    setProblemSolvingRating,
                                    "Problem Solving"
                                )}
                                {renderStarRating(
                                    teamworkRating,
                                    setTeamworkRating,
                                    "Teamwork"
                                )}
                            </div>

                            {/* Review Text */}
                            <div className="mb-6">
                                <label className="block text-white font-medium mb-2">
                                    Written Review *
                                </label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) =>
                                        setReviewText(e.target.value)
                                    }
                                    placeholder="Share your experience working with this student..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    Minimum 10 characters required
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={
                                        submittingReview ||
                                        !reviewText.trim() ||
                                        reviewText.trim().length < 10
                                    }
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    {submittingReview ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaStar />
                                    )}
                                    <span>Submit Review</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignedWorkStatus;
