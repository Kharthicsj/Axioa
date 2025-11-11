import Project from "../../models/Project.js";
import User from "../../models/User.js";
import StudentPerformance from "../../models/StudentPerformance.js";
import mongoose from "mongoose";

// Helper function to normalize service category
const normalizeServiceCategory = (category) => {
    const categoryMap = {
        "Web Development": "web-development",
        "App Development": "app-development",
        "Resume Services": "resume-services",
        "CAD Modeling": "cad-modeling",
        "UI/UX Design": "ui-ux-design",
        "Data Analysis": "data-analysis",
        "Content Writing": "content-writing",
    };

    // Return mapped value or original if already in correct format
    return categoryMap[category] || category;
};

// Create a new project
export const createProject = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const {
            projectName,
            serviceCategory,
            projectDescription,
            requirements,
            quotedPrice,
            completionTime,
            urgency,
            communicationPreference,
            phoneNumber,
            emailAddress,
            meetingLink,
            additionalNotes,
            assignedTo, // Student ID to assign the project to
        } = req.body;

        // Validate required fields
        if (
            !projectName ||
            !serviceCategory ||
            !projectDescription ||
            !requirements ||
            !quotedPrice ||
            !completionTime ||
            !communicationPreference ||
            !assignedTo
        ) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Missing required fields",
            });
        }

        // Validate assigned student exists and is a student
        const assignedStudent = await User.findById(assignedTo);
        if (!assignedStudent || assignedStudent.role !== "student") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid student assignment",
            });
        }

        // Validate client exists
        const client = await User.findById(clientId);
        if (!client) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Client not found",
            });
        }

        // Prepare contact details based on communication preference
        const contactDetails = {};
        if (
            communicationPreference === "phone" ||
            communicationPreference === "whatsapp" ||
            communicationPreference === "mixed"
        ) {
            if (!phoneNumber) {
                return res.status(400).json({
                    error: true,
                    success: false,
                    message:
                        "Phone number is required for selected communication preference",
                });
            }
            contactDetails.phoneNumber = phoneNumber;
        }

        if (
            communicationPreference === "email" ||
            communicationPreference === "mixed"
        ) {
            contactDetails.emailAddress = emailAddress || client.email;
        }

        if (communicationPreference === "meeting") {
            if (!meetingLink) {
                return res.status(400).json({
                    error: true,
                    success: false,
                    message:
                        "Meeting link is required for online meeting preference",
                });
            }
            contactDetails.meetingLink = meetingLink;
        }

        // Create new project
        const newProject = new Project({
            projectName,
            serviceCategory: normalizeServiceCategory(serviceCategory),
            projectDescription,
            requirements,
            quotedPrice: parseFloat(quotedPrice),
            completionTime: parseInt(completionTime),
            urgency: urgency || "normal",
            communicationPreference,
            contactDetails,
            additionalNotes,
            assignedTo,
            assignedBy: clientId,
            status: "submitted",
            statusHistory: [
                {
                    status: "submitted",
                    changedBy: clientId,
                    reason: "Initial project submission",
                    notes: "Project created and submitted to student",
                },
            ],
        });

        await newProject.save();

        // Update student performance - add project to assigned projects
        let studentPerformance = await StudentPerformance.findOne({
            userId: assignedTo,
        });
        if (!studentPerformance) {
            // Create new performance record if doesn't exist
            studentPerformance = new StudentPerformance({
                userId: assignedTo,
                projects: {
                    assigned: [],
                    totalAssigned: 0,
                    totalCompleted: 0,
                    totalInProgress: 0,
                    totalOverdue: 0,
                    completionRate: 0,
                    averageGrade: 0,
                },
            });
        }

        // Add project to student's assigned projects
        studentPerformance.projects.assigned.push({
            projectId: newProject._id.toString(),
            title: projectName,
            description: projectDescription,
            assignedDate: new Date(),
            dueDate: newProject.expectedCompletionDate,
            priority: urgency === "urgent" ? "high" : "medium",
            status: "assigned",
            assignedBy: clientId,
        });

        await studentPerformance.save();

        // Populate the created project with user details
        const populatedProject = await Project.findById(newProject._id)
            .populate(
                "assignedTo",
                "username email profilePicture skills college"
            )
            .populate("assignedBy", "username email profilePicture");

        return res.status(201).json({
            error: false,
            success: true,
            message: "Project created and assigned successfully",
            project: populatedProject,
        });
    } catch (error) {
        console.error("Create project error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to create project",
            details: error.message,
        });
    }
};

// Get all projects for a user (client or student)
export const getUserProjects = async (req, res) => {
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
            query.status = status;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get projects with pagination
        const projects = await Project.find(query)
            .populate(
                "assignedTo",
                "username email profilePicture skills college"
            )
            .populate("assignedBy", "username email profilePicture")
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalProjects = await Project.countDocuments(query);

        return res.status(200).json({
            error: false,
            success: true,
            message: "Projects retrieved successfully",
            projects,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalProjects / parseInt(limit)),
                totalProjects,
                hasNextPage: skip + projects.length < totalProjects,
                hasPrevPage: parseInt(page) > 1,
            },
        });
    } catch (error) {
        console.error("Get user projects error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve projects",
        });
    }
};

// Get project by ID
export const getProjectById = async (req, res) => {
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

        // Get project with populated user details
        const project = await Project.findById(projectId)
            .populate(
                "assignedTo",
                "username email profilePicture skills college phone"
            )
            .populate("assignedBy", "username email profilePicture phone")
            .populate("statusHistory.changedBy", "username")
            .populate("progress.updates.updateBy", "username profilePicture")
            .populate("communications.sender", "username profilePicture")
            .populate("communications.receiver", "username profilePicture")
            .populate("disputes.raisedBy", "username")
            .populate("disputes.resolvedBy", "username");

        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check if user has permission to view this project
        const hasPermission =
            project.assignedTo._id.toString() === userId ||
            project.assignedBy._id.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Access denied",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Project retrieved successfully",
            project,
        });
    } catch (error) {
        console.error("Get project by ID error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve project",
        });
    }
};

// Update project status
export const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, reason, notes } = req.body;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Validate status
        const validStatuses = [
            "submitted",
            "accepted",
            "pending",
            "in_progress",
            "completed",
            "cancelled",
            "disputed",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid status value",
            });
        }

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions
        const hasPermission =
            project.assignedTo.toString() === userId ||
            project.assignedBy.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Access denied",
            });
        }

        // Update project status using instance method
        await project.updateStatus(status, userId, reason, notes);

        // Update student performance if status changed to in_progress or completed
        if (status === "in_progress" || status === "completed") {
            const studentPerformance = await StudentPerformance.findOne({
                userId: project.assignedTo,
            });
            if (studentPerformance) {
                const projectIndex =
                    studentPerformance.projects.assigned.findIndex(
                        (p) => p.projectId === projectId
                    );

                if (projectIndex !== -1) {
                    studentPerformance.projects.assigned[projectIndex].status =
                        status === "in_progress" ? "in_progress" : "completed";

                    if (status === "completed") {
                        studentPerformance.projects.assigned[
                            projectIndex
                        ].completedDate = new Date();
                    }

                    await studentPerformance.save();
                }
            }
        }

        // Get updated project with populated data
        const updatedProject = await Project.findById(projectId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("statusHistory.changedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Project status updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Update project status error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update project status",
        });
    }
};

// Add progress update to project
export const addProgressUpdate = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { message, percentage } = req.body;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions (only assigned student or client can add updates)
        const hasPermission =
            project.assignedTo.toString() === userId ||
            project.assignedBy.toString() === userId;

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Access denied",
            });
        }

        // Add progress update
        await project.addProgressUpdate(userId, message);

        // Update progress percentage if provided
        if (percentage !== undefined) {
            await project.updateProgress(percentage);
        }

        // Get updated project
        const updatedProject = await Project.findById(projectId).populate(
            "progress.updates.updateBy",
            "username profilePicture"
        );

        return res.status(200).json({
            error: false,
            success: true,
            message: "Progress update added successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Add progress update error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to add progress update",
        });
    }
};

// Add communication message to project
export const addCommunication = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { message, messageType = "general" } = req.body;
        const senderId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Validate message
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Message is required",
            });
        }

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check if project is cancelled - disable communication
        if (project.status === "cancelled") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Communication is disabled for cancelled projects",
            });
        }

        // Check permissions (only assigned student or client can send messages)
        const hasPermission =
            project.assignedTo.toString() === senderId ||
            project.assignedBy.toString() === senderId;

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to send messages for this project",
            });
        }

        // Determine receiver
        const receiverId =
            project.assignedTo.toString() === senderId
                ? project.assignedBy.toString()
                : project.assignedTo.toString();

        // Add communication message
        await project.addCommunication(
            senderId,
            receiverId,
            message.trim(),
            messageType
        );

        // Get updated project with populated communications
        const updatedProject = await Project.findById(projectId)
            .populate("communications.sender", "username profilePicture")
            .populate("communications.receiver", "username profilePicture");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Communication message sent successfully",
            project: updatedProject,
            communication:
                updatedProject.communications[
                    updatedProject.communications.length - 1
                ],
        });
    } catch (error) {
        console.error("Add communication error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to send communication message",
        });
    }
};

// Get project communications
export const getProjectCommunications = async (req, res) => {
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

        // Get project
        const project = await Project.findById(projectId)
            .populate("communications.sender", "username profilePicture")
            .populate("communications.receiver", "username profilePicture");

        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions
        const hasPermission =
            project.assignedTo.toString() === userId ||
            project.assignedBy.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to view communications for this project",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Communications retrieved successfully",
            communications: project.communications,
        });
    } catch (error) {
        console.error("Get communications error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve communications",
        });
    }
};

// Mark communication as read
export const markCommunicationAsRead = async (req, res) => {
    try {
        const { projectId, communicationId } = req.params;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions
        const hasPermission =
            project.assignedTo.toString() === userId ||
            project.assignedBy.toString() === userId;

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to mark communications as read",
            });
        }

        // Mark communication as read
        await project.markCommunicationAsRead(communicationId);

        return res.status(200).json({
            error: false,
            success: true,
            message: "Communication marked as read",
        });
    } catch (error) {
        console.error("Mark communication as read error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to mark communication as read",
        });
    }
};

// Raise objection for project
export const raiseObjection = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { objectionReason, objectionMessage } = req.body;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Validate required fields
        if (!objectionReason || !objectionMessage) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Objection reason and message are required",
            });
        }

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions (only assigned student can raise objection)
        if (project.assignedTo.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to raise objection for this project",
            });
        }

        // Check if project is already rejected
        if (project.rejectionDetails.isRejected) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Cannot raise objection for a rejected project",
            });
        }

        // Raise objection using instance method
        await project.raiseObjection(userId, objectionReason, objectionMessage);

        // Get updated project with populated data
        const updatedProject = await Project.findById(projectId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("statusHistory.changedBy", "username")
            .populate("objectionDetails.objectionBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Objection raised successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Raise objection error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to raise objection",
        });
    }
};

// Resolve objection for project
export const resolveObjection = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { resolutionMessage, updatedProjectData } = req.body;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Validate required fields
        if (!resolutionMessage) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Resolution message is required",
            });
        }

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions (only client can resolve objection)
        if (project.assignedBy.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message:
                    "You don't have permission to resolve objection for this project",
            });
        }

        // Check if there's an active objection
        if (
            !project.objectionDetails.hasObjection ||
            project.objectionDetails.isObjectionResolved
        ) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "No active objection found for this project",
            });
        }

        // Update project data if provided
        if (updatedProjectData) {
            // Update project fields with new data
            if (updatedProjectData.projectName)
                project.projectName = updatedProjectData.projectName;
            if (updatedProjectData.serviceCategory)
                project.serviceCategory = updatedProjectData.serviceCategory;
            if (updatedProjectData.projectDescription)
                project.projectDescription =
                    updatedProjectData.projectDescription;
            if (updatedProjectData.requirements)
                project.requirements = updatedProjectData.requirements;
            if (updatedProjectData.quotedPrice)
                project.quotedPrice = updatedProjectData.quotedPrice;
            if (updatedProjectData.completionTime)
                project.completionTime = updatedProjectData.completionTime;
            if (updatedProjectData.urgency)
                project.urgency = updatedProjectData.urgency;
            if (updatedProjectData.communicationPreference)
                project.communicationPreference =
                    updatedProjectData.communicationPreference;
            if (updatedProjectData.additionalNotes)
                project.additionalNotes = updatedProjectData.additionalNotes;

            // Update contact details
            if (updatedProjectData.contactDetails) {
                project.contactDetails = {
                    ...project.contactDetails,
                    ...updatedProjectData.contactDetails,
                };
            }

            // Add status history entry for project update
            project.statusHistory.push({
                status: project.status,
                changedBy: userId,
                reason: "Project updated during objection resolution",
                notes: "Client updated project details to address student's objection",
                changedAt: new Date(),
            });
        }

        // Resolve objection using instance method
        await project.resolveObjection(userId, resolutionMessage);

        // Get updated project with populated data
        const updatedProject = await Project.findById(projectId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("statusHistory.changedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Objection resolved successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Resolve objection error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to resolve objection",
        });
    }
};

// Reject project with reasons
export const rejectProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { rejectionReason, customRejectionReason, rejectionMessage } =
            req.body;
        const userId = req.user.userId;

        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        // Validate required fields
        if (!rejectionReason || !rejectionMessage) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Rejection reason and message are required",
            });
        }

        // Validate custom reason if "other" is selected
        if (rejectionReason === "other" && !customRejectionReason) {
            return res.status(400).json({
                error: true,
                success: false,
                message:
                    "Custom rejection reason is required when 'other' is selected",
            });
        }

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions (only assigned student can reject)
        if (project.assignedTo.toString() !== userId) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You don't have permission to reject this project",
            });
        }

        // Check if project is already rejected
        if (project.rejectionDetails.isRejected) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Project is already rejected",
            });
        }

        // Reject project using instance method
        await project.rejectProject(
            userId,
            rejectionReason,
            customRejectionReason,
            rejectionMessage
        );

        // Get updated project with populated data
        const updatedProject = await Project.findById(projectId)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("statusHistory.changedBy", "username")
            .populate("rejectionDetails.rejectedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Project rejected successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Reject project error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to reject project",
        });
    }
};

// Get project statistics
export const getProjectStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { userType } = req.query; // 'client' or 'student'

        // Get user to determine role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        // Get statistics based on user role
        const stats = await Project.getProjectStats(userId);

        // Get additional metrics
        let additionalMetrics = {};

        if (user.role === "student" || userType === "student") {
            // Student-specific metrics
            const totalEarnings = await Project.aggregate([
                {
                    $match: {
                        assignedTo: new mongoose.Types.ObjectId(userId),
                        status: "completed",
                    },
                },
                { $group: { _id: null, total: { $sum: "$quotedPrice" } } },
            ]);

            const avgRating = await Project.aggregate([
                {
                    $match: {
                        assignedTo: new mongoose.Types.ObjectId(userId),
                        "reviews.clientReview.rating": { $exists: true },
                    },
                },
                {
                    $group: {
                        _id: null,
                        avgRating: { $avg: "$reviews.clientReview.rating" },
                    },
                },
            ]);

            additionalMetrics = {
                totalEarnings: totalEarnings[0]?.total || 0,
                averageRating: avgRating[0]?.avgRating || 0,
            };
        } else {
            // Client-specific metrics
            const totalSpent = await Project.aggregate([
                { $match: { assignedBy: new mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, total: { $sum: "$quotedPrice" } } },
            ]);

            additionalMetrics = {
                totalSpent: totalSpent[0]?.total || 0,
            };
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Project statistics retrieved successfully",
            stats,
            additionalMetrics,
        });
    } catch (error) {
        console.error("Get project stats error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve project statistics",
        });
    }
};

// Search projects
export const searchProjects = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            q, // search query
            category,
            status,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Get user role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        // Build base query based on user role
        let query = { isActive: true };
        if (user.role === "student") {
            query.assignedTo = userId;
        } else {
            query.assignedBy = userId;
        }

        // Add search filters
        if (q) {
            query.$or = [
                { projectName: { $regex: q, $options: "i" } },
                { projectDescription: { $regex: q, $options: "i" } },
                { requirements: { $regex: q, $options: "i" } },
            ];
        }

        if (category) {
            query.serviceCategory = category;
        }

        if (status) {
            query.status = status;
        }

        if (minPrice || maxPrice) {
            query.quotedPrice = {};
            if (minPrice) query.quotedPrice.$gte = parseFloat(minPrice);
            if (maxPrice) query.quotedPrice.$lte = parseFloat(maxPrice);
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute search
        const projects = await Project.find(query)
            .populate("assignedTo", "username email profilePicture skills")
            .populate("assignedBy", "username email profilePicture")
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalProjects = await Project.countDocuments(query);

        return res.status(200).json({
            error: false,
            success: true,
            message: "Search completed successfully",
            projects,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalProjects / parseInt(limit)),
                totalProjects,
                hasNextPage: skip + projects.length < totalProjects,
                hasPrevPage: parseInt(page) > 1,
            },
        });
    } catch (error) {
        console.error("Search projects error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to search projects",
        });
    }
};

// Delete/Archive project
export const deleteProject = async (req, res) => {
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

        // Get project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Check permissions (only project creator or admin can delete)
        const hasPermission =
            project.assignedBy.toString() === userId ||
            req.user.role === "admin";

        if (!hasPermission) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Access denied",
            });
        }

        // Don't allow deletion of active projects, archive instead
        if (["in_progress", "accepted"].includes(project.status)) {
            project.archived = true;
            project.archivedDate = new Date();
            await project.save();

            return res.status(200).json({
                error: false,
                success: true,
                message: "Project archived successfully",
            });
        }

        // Soft delete by marking as inactive
        project.isActive = false;
        await project.save();

        return res.status(200).json({
            error: false,
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to delete project",
        });
    }
};
