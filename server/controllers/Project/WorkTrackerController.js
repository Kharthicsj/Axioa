import Work from "../../models/Work.js";
import Project from "../../models/Project.js";
import User from "../../models/User.js";
import StudentPerformance from "../../models/StudentPerformance.js";
import mongoose from "mongoose";
import {
    uploadWorkDeliverables,
    uploadPaymentProof,
    uploadUpiQr,
} from "../../config/cloudinary.js";

// Create work record from approved project
export const createWorkFromProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Get the project
        const project = await Project.findById(projectId)
            .populate("assignedTo", "username email")
            .populate("assignedBy", "username email");

        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check if user has permission (only assigned student can create work record)
        if (project.assignedTo._id.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to create work record for this project",
            });
        }

        // Check if project is in accepted status
        if (project.status !== "accepted") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Can only create work record for accepted projects",
            });
        }

        // Check if work record already exists
        const existingWork = await Work.findOne({ projectId });
        if (existingWork) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Work record already exists for this project",
                work: existingWork,
            });
        }

        // Calculate expected completion date
        const expectedCompletionDate = new Date();
        expectedCompletionDate.setDate(
            expectedCompletionDate.getDate() + project.completionTime
        );

        // Create work record
        const newWork = new Work({
            projectId: project._id,
            projectName: project.projectName,
            serviceCategory: project.serviceCategory,
            projectDescription: project.projectDescription,
            requirements: project.requirements,
            quotedPrice: project.quotedPrice,
            completionTime: project.completionTime,
            urgency: project.urgency,
            assignedTo: project.assignedTo._id,
            assignedBy: project.assignedBy._id,
            workStatus: "approved",
            expectedCompletionDate,
            communicationPreference: project.communicationPreference,
            contactDetails: project.contactDetails,
            additionalNotes: project.additionalNotes,
        });

        // Add initial work update
        newWork.workUpdates.push({
            updateType: "status_change",
            description: "Work record created from approved project",
            updatedBy: userId,
            metadata: {
                originalProjectId: project._id,
                approvedDate: new Date(),
            },
        });

        await newWork.save();

        // Populate the created work record
        const populatedWork = await Work.findById(newWork._id)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(201).json({
            error: false,
            success: true,
            message: "Work record created successfully",
            work: populatedWork,
        });
    } catch (error) {
        console.error("Create work from project error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to create work record",
            details: error.message,
        });
    }
};

// Get work record by project ID
export const getWorkByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Get work record
        const work = await Work.findOne({ projectId })
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username profilePicture");

        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions
        const hasPermission =
            work.assignedTo._id.toString() === userId ||
            work.assignedBy._id.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You don't have permission to view this work record",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work record retrieved successfully",
            work,
        });
    } catch (error) {
        console.error("Get work by project ID error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve work record",
        });
    }
};

// Get all work records for a user
export const getUserWorks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            status,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Determine user role to know which field to query
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        // Build query based on user role
        let query = { isActive: true };
        if (user.role === "student") {
            query.assignedTo = userId;
        } else {
            query.assignedBy = userId;
        }

        // Add status filter if provided
        if (status) {
            query.workStatus = status;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get works with pagination
        const works = await Work.find(query)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("projectId", "status")
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalWorks = await Work.countDocuments(query);

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work records retrieved successfully",
            works,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalWorks / parseInt(limit)),
                totalWorks,
                hasNextPage: skip + works.length < totalWorks,
                hasPrevPage: parseInt(page) > 1,
            },
        });
    } catch (error) {
        console.error("Get user works error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve work records",
        });
    }
};

// Update work status
export const updateWorkStatus = async (req, res) => {
    try {
        const { workId } = req.params;
        const { status, reason, progressUpdate, projectStatus } = req.body;
        const userId = req.user.userId;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Validate status
        const validStatuses = [
            "approved",
            "in_progress",
            "review_pending",
            "revision_requested",
            "completed",
            "awaiting_completion_proof",
            "completion_submitted",
            "payment_pending",
            "payment_submitted",
            "payment_verified",
            "delivered",
            "cancelled",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work status",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions
        const hasPermission =
            work.assignedTo.toString() === userId ||
            work.assignedBy.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You don't have permission to update this work record",
            });
        }

        // Check if status is actually changing
        const statusChanged = work.workStatus !== status;

        // Update progress if provided
        if (progressUpdate && progressUpdate.percentage !== undefined) {
            const previousPercentage = work.progress.percentage || 0;
            work.progress.percentage = progressUpdate.percentage;
            work.progress.lastUpdated = new Date();

            // Add progress update to work updates (without saving)
            work.workUpdates.push({
                updateType: "progress_update",
                description:
                    progressUpdate.description ||
                    `Progress updated to ${progressUpdate.percentage}%`,
                updatedBy: userId,
                metadata: {
                    percentage: progressUpdate.percentage,
                    previousPercentage: previousPercentage,
                },
                createdAt: new Date(),
            });
        }

        // Only change status if it's actually different
        if (statusChanged) {
            // changeStatus will handle the save operation
            await work.changeStatus(status, userId, reason);
        } else {
            // If only updating progress or no status change, save once
            await work.save();
        }

        // Update project status if provided
        if (projectStatus) {
            const validProjectStatuses = [
                "submitted",
                "accepted",
                "pending",
                "in_progress",
                "completed",
                "cancelled",
                "disputed",
            ];

            if (validProjectStatuses.includes(projectStatus)) {
                try {
                    // Use findByIdAndUpdate to avoid parallel save issues
                    const project = await Project.findById(work.projectId);
                    if (project && project.status !== projectStatus) {
                        // Update project status atomically to prevent parallel save issues
                        await Project.findByIdAndUpdate(
                            work.projectId,
                            {
                                status: projectStatus,
                                $push: {
                                    statusHistory: {
                                        status: projectStatus,
                                        changedBy: userId,
                                        reason: `Status updated via work progress to ${projectStatus}`,
                                        changedAt: new Date(),
                                    },
                                },
                            },
                            { new: true }
                        );
                    }
                } catch (projectUpdateError) {
                    console.error(
                        "Error updating project status:",
                        projectUpdateError
                    );
                    // Don't fail the entire request if project status update fails
                }
            }
        }

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work status updated successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Update work status error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update work status",
        });
    }
};

// Update work progress
export const updateWorkProgress = async (req, res) => {
    try {
        const { workId } = req.params;
        const { percentage, description } = req.body;
        const userId = req.user.userId;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Validate percentage
        if (percentage < 0 || percentage > 100) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Progress percentage must be between 0 and 100",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions (only assigned student can update progress)
        if (work.assignedTo.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Only assigned student can update work progress",
            });
        }

        // Update progress using instance method
        await work.updateProgress(percentage, userId, description);

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work progress updated successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Update work progress error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update work progress",
        });
    }
};

// Add work update/note
export const addWorkUpdate = async (req, res) => {
    try {
        const { workId } = req.params;
        const { updateType, description, metadata } = req.body;
        const userId = req.user.userId;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions
        const hasPermission =
            work.assignedTo.toString() === userId ||
            work.assignedBy.toString() === userId;

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to add updates to this work record",
            });
        }

        // Add work update using instance method
        await work.addWorkUpdate(updateType, description, userId, metadata);

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work update added successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Add work update error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to add work update",
        });
    }
};

// Get work statistics
export const getWorkStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Determine user role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        let query = { isActive: true };
        if (user.role === "student") {
            query.assignedTo = userId;
        } else {
            query.assignedBy = userId;
        }

        // Get work statistics
        const stats = await Work.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$workStatus",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$quotedPrice" },
                    avgProgress: { $avg: "$progress.percentage" },
                },
            },
        ]);

        // Calculate total statistics
        const totalWorks = await Work.countDocuments(query);
        const completedWorks = await Work.countDocuments({
            ...query,
            workStatus: "completed",
        });
        const inProgressWorks = await Work.countDocuments({
            ...query,
            workStatus: "in_progress",
        });

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work statistics retrieved successfully",
            stats: {
                byStatus: stats,
                totalWorks,
                completedWorks,
                inProgressWorks,
                completionRate:
                    totalWorks > 0 ? (completedWorks / totalWorks) * 100 : 0,
            },
        });
    } catch (error) {
        console.error("Get work stats error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve work statistics",
        });
    }
};

// Submit work completion with proof of completion
export const submitWorkCompletion = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;
        const { projectLinks, submissionNotes } = req.body;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        console.log("Work lookup result:", {
            workId,
            workFound: !!work,
            workStatus: work?.workStatus,
            serviceCategory: work?.serviceCategory,
            assignedTo: work?.assignedTo?.toString(),
        });

        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions (only assigned student can submit completion)
        if (work.assignedTo.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to submit completion for this work",
            });
        }

        // Check if work status allows completion submission
        const allowedStatuses = [
            "approved", // Initial status - student can submit completion
            "in_progress", // Work is in progress
            "review_pending", // Work submitted for review
            "revision_requested", // Client requested revisions
            "awaiting_completion_proof", // Waiting for completion proof
        ];

        console.log("Work status validation:", {
            currentStatus: work.workStatus,
            allowedStatuses,
            isAllowed: allowedStatuses.includes(work.workStatus),
        });

        if (!allowedStatuses.includes(work.workStatus)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: `Work status '${
                    work.workStatus
                }' does not allow completion submission. Allowed: ${allowedStatuses.join(
                    ", "
                )}`,
            });
        }

        // Process uploaded files (for document-based services)
        const completionFiles = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                completionFiles.push({
                    fileName: file.originalname,
                    fileUrl: file.path,
                    fileType: file.mimetype,
                    fileSize: file.size,
                    cloudinaryPublicId: file.filename,
                    uploadedAt: new Date(),
                });
            });
        }

        // Process project links (for project-based services)
        const processedLinks = [];
        if (projectLinks) {
            try {
                // Parse JSON string if it's a string, otherwise use as array
                const linksArray =
                    typeof projectLinks === "string"
                        ? JSON.parse(projectLinks)
                        : projectLinks;

                if (Array.isArray(linksArray)) {
                    linksArray.forEach((link) => {
                        if (link.url && link.url.trim() && link.linkType) {
                            processedLinks.push({
                                linkType: link.linkType,
                                url: link.url.trim(),
                                description: link.description || "",
                                addedAt: new Date(),
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("Error parsing project links:", error);
                return res.status(400).json({
                    error: true,
                    success: false,
                    message: "Invalid project links format",
                });
            }
        }

        // Validate that we have appropriate completion proof
        const isDocumentService = [
            "resume-services",
            "content-writing",
        ].includes(work.serviceCategory);

        console.log("Service validation:", {
            serviceCategory: work.serviceCategory,
            isDocumentService,
            completionFilesCount: completionFiles.length,
            processedLinksCount: processedLinks.length,
        });

        if (isDocumentService && completionFiles.length === 0) {
            console.log("Rejecting: No completion files for document service");
            return res.status(400).json({
                error: true,
                success: false,
                message:
                    "Completion files are required for document-based services",
            });
        }

        if (!isDocumentService && processedLinks.length === 0) {
            console.log("Rejecting: No project links for non-document service");
            return res.status(400).json({
                error: true,
                success: false,
                message:
                    "At least one valid project link is required for project-based services",
            });
        }

        // Update work record with completion submission
        work.completionSubmission = {
            completionFiles,
            projectLinks: processedLinks,
            submittedAt: new Date(),
            submittedBy: userId,
            submissionNotes: submissionNotes || "",
        };

        // Update work status
        work.workStatus = "completion_submitted";

        // Add work update
        work.workUpdates.push({
            updateType: "status_change",
            description: "Work completion submitted with proof",
            updatedBy: userId,
            metadata: {
                filesCount: completionFiles.length,
                linksCount: processedLinks.length,
            },
            createdAt: new Date(),
        });

        await work.save();

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work completion submitted successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Submit work completion error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            workId: req.params.workId,
            userId: req.user?.userId,
            projectLinks: req.body.projectLinks,
            submissionNotes: req.body.submissionNotes,
            fileCount: req.files?.length || 0,
        });
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to submit work completion",
            details: error.message,
        });
    }
};

// Submit student payment details (UPI QR and phone number)
export const submitStudentPaymentDetails = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;
        const { upiId, upiPhoneNumber, paymentInstructions } = req.body;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions
        if (work.assignedTo.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to submit payment details for this work",
            });
        }

        // Check if completion was already submitted
        if (work.workStatus !== "completion_submitted") {
            return res.status(400).json({
                error: true,
                success: false,
                message:
                    "Work completion must be submitted before adding payment details",
            });
        }

        // Check if UPI QR file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "UPI QR code image is required",
            });
        }

        // Validate UPI ID
        if (!upiId || upiId.trim().length === 0) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "UPI ID is required",
            });
        }

        // Validate phone number
        if (!upiPhoneNumber || !/^\d{10}$/.test(upiPhoneNumber)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Valid 10-digit phone number is required",
            });
        }

        // Update work record with student payment details
        work.completionSubmission.studentPaymentDetails = {
            upiQrCodeUrl: req.file.path,
            upiQrPublicId: req.file.filename,
            upiId: upiId.trim(),
            upiPhoneNumber,
            paymentInstructions: paymentInstructions || "",
            submittedAt: new Date(),
        };

        // Update progress to 100% now that payment details are submitted
        const oldProgress = work.progress.percentage;
        work.progress.percentage = 100;
        work.progress.lastUpdated = new Date();

        // Update work status to payment pending
        work.workStatus = "payment_pending";

        // Add progress update to work history
        if (oldProgress < 100) {
            work.workUpdates.push({
                updateType: "progress_update",
                description: `Work progress completed to 100% with payment details submission (was ${oldProgress}%)`,
                updatedBy: userId,
                metadata: {
                    oldProgress,
                    newProgress: 100,
                    reason: "payment_details_submission",
                },
                createdAt: new Date(),
            });
        }

        // Add work update for payment details
        work.workUpdates.push({
            updateType: "status_change",
            description:
                "Student payment details submitted - Work fully completed",
            updatedBy: userId,
            metadata: {
                upiId: upiId.trim(),
                upiPhoneNumber,
                qrCodeUrl: req.file.path,
                progressUpdated: oldProgress < 100,
            },
            createdAt: new Date(),
        });

        await work.save();

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Student payment details submitted successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Submit student payment details error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to submit student payment details",
            details: error.message,
        });
    }
};

// Submit client payment proof
export const submitClientPaymentProof = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;
        const { upiTransactionId, paymentToName, paymentAmount, paymentDate } =
            req.body;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions (only client/assignedBy can submit payment proof)
        if (work.assignedBy.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to submit payment proof for this work",
            });
        }

        // Check work status
        if (work.workStatus !== "payment_pending") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Work is not in payment pending status",
            });
        }

        // Check if payment proof file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Payment proof image is required",
            });
        }

        // Validate required fields
        if (!upiTransactionId || !paymentToName || !paymentAmount) {
            return res.status(400).json({
                error: true,
                success: false,
                message:
                    "UPI Transaction ID, Payment To Name, and Payment Amount are required",
            });
        }

        // Update work record with payment verification data
        work.paymentVerification = {
            paymentProofUrl: req.file.path,
            paymentProofPublicId: req.file.filename,
            upiTransactionId,
            paymentToName,
            paymentAmount: parseFloat(paymentAmount),
            paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
            verificationStatus: "pending",
            submittedAt: new Date(),
            submittedBy: userId,
        };

        // Update work status
        work.workStatus = "payment_submitted";

        // Add work update
        work.workUpdates.push({
            updateType: "status_change",
            description: "Client payment proof submitted",
            updatedBy: userId,
            metadata: {
                upiTransactionId,
                paymentAmount: parseFloat(paymentAmount),
                paymentToName,
            },
            createdAt: new Date(),
        });

        await work.save();

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Payment proof submitted successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Submit client payment proof error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to submit payment proof",
            details: error.message,
        });
    }
};

// Verify payment and unlock deliverables (Admin function)
export const verifyPaymentAndUnlock = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;
        const { verificationStatus, verificationNotes } = req.body;

        // Check admin permission
        if (req.user.role !== "admin") {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Only administrators can verify payments",
            });
        }

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check work status
        if (work.workStatus !== "payment_submitted") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Work is not in payment submitted status",
            });
        }

        // Validate verification status
        const validStatuses = ["verified", "disputed", "rejected"];
        if (!validStatuses.includes(verificationStatus)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid verification status",
            });
        }

        // Update payment verification
        work.paymentVerification.verificationStatus = verificationStatus;
        work.paymentVerification.verifiedAt = new Date();
        work.paymentVerification.verifiedBy = userId;
        work.paymentVerification.verificationNotes = verificationNotes || "";

        // Update work status and delivery access based on verification
        if (verificationStatus === "verified") {
            work.workStatus = "payment_verified";
            work.deliveryAccess.isLocked = false;
            work.deliveryAccess.unlockedAt = new Date();
            work.deliveryAccess.unlockedBy = userId;

            // Add access history
            work.deliveryAccess.accessHistory.push({
                accessedBy: userId,
                accessedAt: new Date(),
                action: "unlocked",
            });
        } else {
            work.workStatus = "payment_pending"; // Return to pending if rejected/disputed
        }

        // Add work update
        work.workUpdates.push({
            updateType: "status_change",
            description: `Payment ${verificationStatus} by admin`,
            updatedBy: userId,
            metadata: {
                verificationStatus,
                verificationNotes,
            },
            createdAt: new Date(),
        });

        await work.save();

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: `Payment ${verificationStatus} successfully`,
            work: updatedWork,
        });
    } catch (error) {
        console.error("Verify payment error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to verify payment",
            details: error.message,
        });
    }
};

// Student verifies payment and completes work
export const studentVerifyPaymentAndComplete = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;
        const { verificationNotes } = req.body;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions (only assigned student can verify)
        if (work.assignedTo.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to verify payment for this work",
            });
        }

        // Check if payment proof has been submitted by client
        if (work.workStatus !== "payment_submitted") {
            return res.status(400).json({
                error: true,
                success: false,
                message:
                    "Payment proof must be submitted by client before verification",
            });
        }

        // Update payment verification by student
        work.paymentVerification.verificationStatus = "verified";
        work.paymentVerification.verifiedAt = new Date();
        work.paymentVerification.verifiedBy = userId;
        work.paymentVerification.verificationNotes =
            verificationNotes || "Payment verified by student";

        // Update work status to completed
        work.workStatus = "completed";

        // Update project status to completed
        try {
            const project = await Project.findById(work.projectId);
            if (project && project.status !== "completed") {
                // Use atomic update to prevent parallel save issues
                await Project.findByIdAndUpdate(
                    work.projectId,
                    {
                        status: "completed",
                        $push: {
                            statusHistory: {
                                status: "completed",
                                changedBy: userId,
                                reason: "Work completed and payment verified",
                                changedAt: new Date(),
                            },
                        },
                    },
                    { new: true }
                );
            }
        } catch (projectUpdateError) {
            console.error("Error updating project status:", projectUpdateError);
            // Don't fail the entire request if project status update fails
        }

        // Unlock delivery access
        work.deliveryAccess.isLocked = false;
        work.deliveryAccess.unlockedAt = new Date();
        work.deliveryAccess.unlockedBy = userId;

        // Add access history entry
        work.deliveryAccess.accessHistory.push({
            accessedBy: userId,
            accessedAt: new Date(),
            action: "unlocked",
        });

        // Add work update
        work.workUpdates.push({
            updateType: "status_change",
            description: "Payment verified by student - Work completed",
            updatedBy: userId,
            metadata: {
                verificationStatus: "verified",
                workCompleted: true,
                deliveryUnlocked: true,
            },
            createdAt: new Date(),
        });

        await work.save();

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Payment verified and work completed successfully",
            work: updatedWork,
        });
    } catch (error) {
        console.error("Student verify payment error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to verify payment",
            details: error.message,
        });
    }
};

// Add client review for student
export const addClientReview = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;
        const {
            rating,
            reviewText,
            skills,
            communication,
            timeliness,
            quality,
            problemSolving,
            teamwork,
        } = req.body;

        // Validate required fields
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        if (!reviewText || reviewText.trim().length < 5) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Review text must be at least 5 characters long",
            });
        }

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions (only client who assigned can review)
        if (work.assignedBy.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You don't have permission to review this work",
            });
        }

        // Check if work is completed
        if (work.workStatus !== "completed") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Work must be completed before adding review",
            });
        }

        // Update work status to delivered (only status change, no review in Work model)
        work.workStatus = "delivered";

        // Add work update for review submission (for tracking purposes)
        work.workUpdates.push({
            updateType: "review_added",
            description: `Client review submitted - ${rating} stars`,
            updatedBy: userId,
            metadata: {
                rating: rating,
                reviewLength: reviewText.length,
                categories: { skills, communication, timeliness, quality },
            },
            createdAt: new Date(),
        });

        await work.save();
        console.log("Work status updated successfully");

        // Main review operation - Update StudentPerformance model
        const studentUserId = work.assignedTo;
        const clientUser = await User.findById(userId, "username");

        // Find or create StudentPerformance record
        let studentPerformance = await StudentPerformance.findOne({
            userId: studentUserId,
        });

        if (!studentPerformance) {
            studentPerformance = new StudentPerformance({
                userId: studentUserId,
                projects: {
                    assigned: [],
                    totalAssigned: 0,
                    totalCompleted: 0,
                    totalInProgress: 0,
                    totalOverdue: 0,
                    completionRate: 0,
                    averageGrade: 0,
                },
                performance: {
                    overallRating: 0,
                    technicalSkills: 0,
                    communicationSkills: 0,
                    problemSolving: 0,
                    teamwork: 0,
                    punctuality: 0,
                    qualityOfWork: 0,
                },
                reviews: [],
                reports: {
                    behavioralReports: [],
                    totalReports: 0,
                    resolvedReports: 0,
                    pendingReports: 0,
                },
                engagement: {
                    lastActive: new Date(),
                    totalLoginDays: 0,
                    averageSessionTime: 0,
                    totalTimeSpent: 0,
                    attendanceRate: 100,
                    engagementScore: 0,
                },
                status: "active",
            });
        }

        // Create comprehensive review entry for StudentPerformance
        const reviewEntry = {
            reviewId: workId.toString(),
            reviewedBy: userId,
            reviewerName: clientUser?.username || "Client",
            reviewerRole: "client",
            rating: rating,
            comment: reviewText.trim(),
            projectRelated: workId.toString(),
            reviewDate: new Date(),
            tags: ["work-completion", "client-feedback"],
        };

        // Check if review already exists for this work
        const existingReviewIndex = studentPerformance.reviews.findIndex(
            (review) => review.reviewId === workId.toString()
        );

        if (existingReviewIndex >= 0) {
            // Update existing review
            studentPerformance.reviews[existingReviewIndex] = reviewEntry;
            console.log("Updated existing review in StudentPerformance");
        } else {
            // Add new review
            studentPerformance.reviews.push(reviewEntry);
            console.log("Added new review to StudentPerformance");
        }

        // Update performance metrics based on all reviews
        const allReviews = studentPerformance.reviews;
        if (allReviews.length > 0) {
            // Calculate average overall rating from all reviews
            studentPerformance.performance.overallRating =
                Math.round(
                    (allReviews.reduce(
                        (sum, review) => sum + review.rating,
                        0
                    ) /
                        allReviews.length) *
                        10
                ) / 10;

            // Update specific skill ratings (using current review as latest feedback)
            studentPerformance.performance.technicalSkills = skills || rating;
            studentPerformance.performance.communicationSkills =
                communication || rating;
            studentPerformance.performance.punctuality = timeliness || rating;
            studentPerformance.performance.qualityOfWork = quality || rating;
            studentPerformance.performance.problemSolving =
                problemSolving || rating;
            studentPerformance.performance.teamwork = teamwork || rating;

            console.log("Updated performance metrics:", {
                overallRating: studentPerformance.performance.overallRating,
                totalReviews: allReviews.length,
                latestReview: {
                    rating,
                    skills,
                    communication,
                    timeliness,
                    quality,
                    problemSolving,
                    teamwork,
                },
            });
        }

        await studentPerformance.save();

        // Get updated work with populated data
        const updatedWork = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("workUpdates.updatedBy", "username");

        // Get the student performance data to include review information
        const studentPerformanceData = await StudentPerformance.findOne({
            userId: studentUserId,
        })
            .populate("reviews.reviewedBy", "username email")
            .select("reviews performance");

        // Find the specific review for this work
        const workReview = studentPerformanceData?.reviews?.find(
            (review) => review.reviewId === workId.toString()
        );

        return res.status(200).json({
            error: false,
            success: true,
            message: "Review added successfully to student performance",
            work: updatedWork,
            studentReview: workReview || null,
            studentPerformance: {
                overallRating:
                    studentPerformanceData?.performance?.overallRating || 0,
                totalReviews: studentPerformanceData?.reviews?.length || 0,
                technicalSkills:
                    studentPerformanceData?.performance?.technicalSkills || 0,
                communicationSkills:
                    studentPerformanceData?.performance?.communicationSkills ||
                    0,
                punctuality:
                    studentPerformanceData?.performance?.punctuality || 0,
                qualityOfWork:
                    studentPerformanceData?.performance?.qualityOfWork || 0,
                problemSolving:
                    studentPerformanceData?.performance?.problemSolving || 0,
                teamwork: studentPerformanceData?.performance?.teamwork || 0,
            },
        });
    } catch (error) {
        console.error("Add client review error:", error);
        console.error("Error stack:", error.stack);
        console.error("Mongoose validation errors:", error.errors);

        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to add review",
            details: error.message,
        });
    }
};

// Get secured work deliverables (with access control)
export const getSecuredDeliverables = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record
        const work = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture");

        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions
        const hasPermission =
            work.assignedTo._id.toString() === userId ||
            work.assignedBy._id.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to access this work's deliverables",
            });
        }

        // Check if deliverables are locked
        if (work.deliveryAccess.isLocked && req.user.role !== "admin") {
            return res.status(423).json({
                error: true,
                success: false,
                message: "Deliverables are locked until payment is verified",
                locked: true,
                paymentStatus:
                    work.paymentVerification?.verificationStatus || "pending",
            });
        }

        // Add access history
        work.deliveryAccess.accessHistory.push({
            accessedBy: userId,
            accessedAt: new Date(),
            action: "viewed",
        });

        await work.save();

        // Return deliverables based on service type
        const response = {
            error: false,
            success: true,
            message: "Deliverables retrieved successfully",
            workId: work._id,
            serviceCategory: work.serviceCategory,
            isLocked: work.deliveryAccess.isLocked,
            deliverables: {
                files: work.completionSubmission?.completionFiles || [],
                links: work.completionSubmission?.projectLinks || [],
            },
            submissionInfo: {
                submittedAt: work.completionSubmission?.submittedAt,
                submissionNotes: work.completionSubmission?.submissionNotes,
            },
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Get secured deliverables error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve deliverables",
            details: error.message,
        });
    }
};

// Get student performance data for a specific work
export const getStudentPerformanceForWork = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record to find the student
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions
        const hasPermission =
            work.assignedTo.toString() === userId ||
            work.assignedBy.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to view this performance data",
            });
        }

        // Get student performance data
        const studentPerformance = await StudentPerformance.findOne({
            userId: work.assignedTo,
        })
            .populate("reviews.reviewedBy", "username email")
            .select("reviews performance");

        // Find the specific review for this work
        const workReview = studentPerformance?.reviews?.find(
            (review) => review.reviewId === workId.toString()
        );

        return res.status(200).json({
            error: false,
            success: true,
            message: "Student performance data retrieved successfully",
            studentReview: workReview || null,
            studentPerformance: {
                overallRating:
                    studentPerformance?.performance?.overallRating || 0,
                totalReviews: studentPerformance?.reviews?.length || 0,
                technicalSkills:
                    studentPerformance?.performance?.technicalSkills || 0,
                communicationSkills:
                    studentPerformance?.performance?.communicationSkills || 0,
                punctuality: studentPerformance?.performance?.punctuality || 0,
                qualityOfWork:
                    studentPerformance?.performance?.qualityOfWork || 0,
                problemSolving:
                    studentPerformance?.performance?.problemSolving || 0,
                teamwork: studentPerformance?.performance?.teamwork || 0,
            },
        });
    } catch (error) {
        console.error("Get student performance error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve student performance data",
            details: error.message,
        });
    }
};

// Get all student reviews from multiple clients
export const getAllStudentReviews = async (req, res) => {
    try {
        const { workId } = req.params;
        const userId = req.user.userId;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record to find the student
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions
        const hasPermission =
            work.assignedTo.toString() === userId ||
            work.assignedBy.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You don't have permission to view this data",
            });
        }

        // Get student performance data with all reviews
        const studentPerformance = await StudentPerformance.findOne({
            userId: work.assignedTo,
        })
            .populate("reviews.reviewedBy", "username email profilePicture")
            .select("reviews performance");

        if (!studentPerformance) {
            return res.status(200).json({
                error: false,
                success: true,
                message: "No reviews found for this student",
                allReviews: [],
                studentPerformance: {
                    overallRating: 0,
                    totalReviews: 0,
                    technicalSkills: 0,
                    communicationSkills: 0,
                    punctuality: 0,
                    qualityOfWork: 0,
                    problemSolving: 0,
                    teamwork: 0,
                },
            });
        }

        // Sort reviews by date (most recent first)
        const sortedReviews = studentPerformance.reviews.sort(
            (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
        );

        return res.status(200).json({
            error: false,
            success: true,
            message: "Student reviews retrieved successfully",
            allReviews: sortedReviews,
            studentPerformance: {
                overallRating:
                    studentPerformance.performance.overallRating || 0,
                totalReviews: studentPerformance.reviews.length || 0,
                technicalSkills:
                    studentPerformance.performance.technicalSkills || 0,
                communicationSkills:
                    studentPerformance.performance.communicationSkills || 0,
                punctuality: studentPerformance.performance.punctuality || 0,
                qualityOfWork:
                    studentPerformance.performance.qualityOfWork || 0,
                problemSolving:
                    studentPerformance.performance.problemSolving || 0,
                teamwork: studentPerformance.performance.teamwork || 0,
            },
        });
    } catch (error) {
        console.error("Get all student reviews error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve student reviews",
            details: error.message,
        });
    }
};

// Download file from Cloudinary with proper authentication
export const downloadFile = async (req, res) => {
    try {
        const { workId, fileType, fileName } = req.params;
        const userId = req.user.userId;

        // Validate work ID format
        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        // Get work record to check permissions
        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work record not found",
            });
        }

        // Check permissions - only involved parties can download files
        const hasPermission =
            work.assignedTo.toString() === userId ||
            work.assignedBy.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to download files from this work",
            });
        }

        // Find the file information based on fileType
        let fileInfo = null;
        let publicId = null;
        let resourceType = "auto";

        if (fileType === "completion") {
            // Decode the filename to handle URL encoding
            const decodedFileName = decodeURIComponent(fileName);

            // Find completion file with correct field names from Work model
            const completionFile =
                work.completionSubmission?.completionFiles?.find(
                    (file) =>
                        file.fileName === fileName ||
                        file.fileName === decodedFileName ||
                        (file.fileUrl &&
                            file.fileUrl.includes(
                                fileName.replace(/\s+/g, "%20")
                            )) ||
                        (file.cloudinaryPublicId &&
                            file.cloudinaryPublicId.includes(
                                fileName.replace(/\s+/g, "-").replace(/\./g, "")
                            ))
                );
            if (completionFile) {
                publicId = completionFile.cloudinaryPublicId;
                fileInfo = completionFile;

                // Determine resource type based on file extension
                const fileExtension = (
                    completionFile.fileName ||
                    fileName ||
                    ""
                ).toLowerCase();
                if (
                    fileExtension.endsWith(".pdf") ||
                    fileExtension.endsWith(".doc") ||
                    fileExtension.endsWith(".docx") ||
                    fileExtension.endsWith(".txt") ||
                    fileExtension.endsWith(".zip") ||
                    fileExtension.endsWith(".rar")
                ) {
                    resourceType = "raw";
                } else if (
                    fileExtension.endsWith(".jpg") ||
                    fileExtension.endsWith(".jpeg") ||
                    fileExtension.endsWith(".png") ||
                    fileExtension.endsWith(".gif") ||
                    fileExtension.endsWith(".webp") ||
                    fileExtension.endsWith(".svg")
                ) {
                    resourceType = "image";
                } else if (
                    fileExtension.endsWith(".mp4") ||
                    fileExtension.endsWith(".avi") ||
                    fileExtension.endsWith(".mov") ||
                    fileExtension.endsWith(".wmv")
                ) {
                    resourceType = "video";
                } else {
                    resourceType = "raw"; // Default to raw for unknown file types
                }
            }
        } else if (fileType === "payment-proof") {
            // Payment proof file
            if (work.paymentVerification?.paymentProofPublicId) {
                publicId = work.paymentVerification.paymentProofPublicId;
                resourceType = "image";
                fileInfo = {
                    originalName: `payment-proof-${workId}.jpg`,
                    path: work.paymentVerification.paymentProofUrl,
                };
            }
        } else if (fileType === "upi-qr") {
            // UPI QR code file
            if (
                work.completionSubmission?.studentPaymentDetails?.upiQrPublicId
            ) {
                publicId =
                    work.completionSubmission.studentPaymentDetails
                        .upiQrPublicId;
                resourceType = "image";
                fileInfo = {
                    originalName: `upi-qr-${workId}.jpg`,
                    path: work.completionSubmission.studentPaymentDetails
                        .upiQrCodeUrl,
                };
            }
        }

        if (!publicId || !fileInfo) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "File not found",
            });
        }

        // Import cloudinary here to avoid circular imports
        const { v2: cloudinary } = await import("cloudinary");
        const https = await import("https");

        // Generate download URL with attachment flag and custom filename
        const originalName = fileInfo.fileName || fileName || "download";

        try {
            // Get the direct URL without signing first
            const directUrl = cloudinary.url(publicId, {
                resource_type: resourceType,
                secure: true,
                type: "upload",
            });

            // Set response headers for file download
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${originalName}"`
            );

            // Determine content type based on file extension
            const fileExtension = originalName.toLowerCase().split(".").pop();
            let contentType = "application/octet-stream"; // Default

            if (fileExtension === "pdf") contentType = "application/pdf";
            else if (["jpg", "jpeg"].includes(fileExtension))
                contentType = "image/jpeg";
            else if (fileExtension === "png") contentType = "image/png";
            else if (fileExtension === "txt") contentType = "text/plain";
            else if (["doc", "docx"].includes(fileExtension))
                contentType = "application/msword";

            res.setHeader("Content-Type", contentType);

            // Fetch the file from Cloudinary and pipe it to response
            const request = https.get(directUrl, (fileResponse) => {
                if (fileResponse.statusCode === 200) {
                    // Pipe the file directly to the client
                    fileResponse.pipe(res);

                    // Add download tracking when successful
                    fileResponse.on("end", async () => {
                        try {
                            work.workUpdates.push({
                                updateType: "deliverable_submitted",
                                description: `File downloaded: ${originalName}`,
                                updatedBy: userId,
                                metadata: {
                                    fileType,
                                    fileName: originalName,
                                    downloadedAt: new Date(),
                                    action: "file_download_success",
                                },
                                createdAt: new Date(),
                            });
                            await work.save();
                        } catch (trackingError) {
                            // Silently handle tracking errors
                        }
                    });
                } else {
                    return res.status(404).json({
                        error: true,
                        success: false,
                        message: "File not accessible from Cloudinary",
                    });
                }
            });

            request.on("error", (error) => {
                console.error("HTTPS request error:", error);
                return res.status(500).json({
                    error: true,
                    success: false,
                    message: "Failed to fetch file from storage",
                    details: error.message,
                });
            });
        } catch (cloudinaryError) {
            console.error("Cloudinary error:", cloudinaryError);
            return res.status(500).json({
                error: true,
                success: false,
                message: "Failed to process file download",
                details: cloudinaryError.message,
            });
        }
    } catch (error) {
        console.error("Download file error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to generate download URL",
            details: error.message,
        });
    }
};
