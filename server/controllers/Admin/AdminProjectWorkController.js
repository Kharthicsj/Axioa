import Project from "../../models/Project.js";
import Work from "../../models/Work.js";
import User from "../../models/User.js";
import mongoose from "mongoose";

// Get all projects with detailed information for admin
export const getAllProjects = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            serviceCategory,
            sortBy = "createdAt",
            sortOrder = "desc",
            search,
            dateFrom,
            dateTo,
        } = req.query;

        // Build filter query
        const filter = { isActive: true };

        if (status) {
            if (Array.isArray(status)) {
                filter.status = { $in: status };
            } else {
                filter.status = status;
            }
        }

        if (serviceCategory) {
            filter.serviceCategory = serviceCategory;
        }

        if (search) {
            filter.$or = [
                { projectName: { $regex: search, $options: "i" } },
                { projectDescription: { $regex: search, $options: "i" } },
            ];
        }

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get projects with populated data
        const projects = await Project.find(filter)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count
        const totalProjects = await Project.countDocuments(filter);

        // Get project statistics
        const stats = await Project.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$quotedPrice" },
                },
            },
        ]);

        const projectStats = {
            total: totalProjects,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    totalValue: stat.totalValue,
                };
                return acc;
            }, {}),
        };

        return res.status(200).json({
            error: false,
            success: true,
            message: "Projects retrieved successfully",
            data: {
                projects,
                stats: projectStats,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalProjects / parseInt(limit)),
                    totalItems: totalProjects,
                    hasNextPage: skip + projects.length < totalProjects,
                    hasPrevPage: parseInt(page) > 1,
                },
            },
        });
    } catch (error) {
        console.error("Get all projects error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve projects",
            details: error.message,
        });
    }
};

// Get all works with detailed information for admin
export const getAllWorks = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            workStatus,
            serviceCategory,
            sortBy = "createdAt",
            sortOrder = "desc",
            search,
            dateFrom,
            dateTo,
        } = req.query;

        // Build filter query
        const filter = { isActive: true };

        if (workStatus) {
            if (Array.isArray(workStatus)) {
                filter.workStatus = { $in: workStatus };
            } else {
                filter.workStatus = workStatus;
            }
        }

        if (serviceCategory) {
            filter.serviceCategory = serviceCategory;
        }

        if (search) {
            filter.$or = [
                { projectName: { $regex: search, $options: "i" } },
                { projectDescription: { $regex: search, $options: "i" } },
            ];
        }

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get works with populated data
        const works = await Work.find(filter)
            .populate("assignedTo", "username email profilePicture")
            .populate("assignedBy", "username email profilePicture")
            .populate("projectId", "status")
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count
        const totalWorks = await Work.countDocuments(filter);

        // Get work statistics
        const stats = await Work.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$workStatus",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$quotedPrice" },
                    avgProgress: { $avg: "$progress.percentage" },
                },
            },
        ]);

        const workStats = {
            total: totalWorks,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    totalValue: stat.totalValue,
                    avgProgress: stat.avgProgress || 0,
                };
                return acc;
            }, {}),
        };

        return res.status(200).json({
            error: false,
            success: true,
            message: "Works retrieved successfully",
            data: {
                works,
                stats: workStats,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalWorks / parseInt(limit)),
                    totalItems: totalWorks,
                    hasNextPage: skip + works.length < totalWorks,
                    hasPrevPage: parseInt(page) > 1,
                },
            },
        });
    } catch (error) {
        console.error("Get all works error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve works",
            details: error.message,
        });
    }
};

// Get project details by ID for admin
export const getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        const project = await Project.findById(projectId)
            .populate("assignedTo", "username email profilePicture phone")
            .populate("assignedBy", "username email profilePicture phone")
            .lean();

        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        // Get associated work if exists
        const work = await Work.findOne({ projectId })
            .populate("assignedTo", "username email")
            .populate("assignedBy", "username email")
            .lean();

        return res.status(200).json({
            error: false,
            success: true,
            message: "Project details retrieved successfully",
            data: {
                project,
                work,
            },
        });
    } catch (error) {
        console.error("Get project details error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve project details",
            details: error.message,
        });
    }
};

// Get work details by ID for admin
export const getWorkDetails = async (req, res) => {
    try {
        const { workId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

        const work = await Work.findById(workId)
            .populate("assignedTo", "username email profilePicture phone")
            .populate("assignedBy", "username email profilePicture phone")
            .populate("projectId")
            .populate("workUpdates.updatedBy", "username")
            .lean();

        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work not found",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work details retrieved successfully",
            data: work,
        });
    } catch (error) {
        console.error("Get work details error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve work details",
            details: error.message,
        });
    }
};

// Update project status (admin override)
export const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, reason, adminNotes } = req.body;
        const adminId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project ID format",
            });
        }

        const validStatuses = [
            "submitted",
            "accepted",
            "pending",
            "in_progress",
            "completed",
            "cancelled",
            "disputed",
            "rejected",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid project status",
            });
        }

        const project = await Project.findByIdAndUpdate(
            projectId,
            {
                status,
                $push: {
                    statusHistory: {
                        status,
                        changedBy: adminId,
                        changedAt: new Date(),
                        reason: reason || `Status updated by admin`,
                        adminNotes,
                    },
                },
                updatedAt: new Date(),
            },
            { new: true }
        ).populate("assignedTo assignedBy", "username email");

        if (!project) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Project status updated successfully",
            data: project,
        });
    } catch (error) {
        console.error("Update project status error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update project status",
            details: error.message,
        });
    }
};

// Update work status (admin override)
export const updateWorkStatus = async (req, res) => {
    try {
        const { workId } = req.params;
        const { status, reason, adminNotes } = req.body;
        const adminId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid work ID format",
            });
        }

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

        const work = await Work.findById(workId);
        if (!work) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Work not found",
            });
        }

        // Update work status using the instance method
        await work.changeStatus(
            status,
            adminId,
            reason || "Status updated by admin"
        );

        // Add admin notes if provided
        if (adminNotes) {
            work.workUpdates.push({
                updateType: "admin_note",
                description: adminNotes,
                updatedBy: adminId,
                metadata: {
                    isAdminUpdate: true,
                },
                createdAt: new Date(),
            });
            await work.save();
        }

        const updatedWork = await Work.findById(workId)
            .populate("assignedTo assignedBy", "username email")
            .populate("workUpdates.updatedBy", "username");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Work status updated successfully",
            data: updatedWork,
        });
    } catch (error) {
        console.error("Update work status error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update work status",
            details: error.message,
        });
    }
};

// Get dashboard metrics for projects and works
export const getProjectWorkMetrics = async (req, res) => {
    try {
        // Project metrics
        const projectMetrics = await Project.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalProjects: { $sum: 1 },
                    totalValue: { $sum: "$quotedPrice" },
                    avgQuotedPrice: { $avg: "$quotedPrice" },
                    statusBreakdown: {
                        $push: {
                            status: "$status",
                            value: "$quotedPrice",
                        },
                    },
                },
            },
        ]);

        // Work metrics
        const workMetrics = await Work.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalWorks: { $sum: 1 },
                    totalValue: { $sum: "$quotedPrice" },
                    avgProgress: { $avg: "$progress.percentage" },
                    avgQuotedPrice: { $avg: "$quotedPrice" },
                    statusBreakdown: {
                        $push: {
                            status: "$workStatus",
                            value: "$quotedPrice",
                            progress: "$progress.percentage",
                        },
                    },
                },
            },
        ]);

        // Recent activities
        const recentProjects = await Project.find({ isActive: true })
            .populate("assignedTo assignedBy", "username")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const recentWorks = await Work.find({ isActive: true })
            .populate("assignedTo assignedBy", "username")
            .sort({ updatedAt: -1 })
            .limit(5)
            .lean();

        return res.status(200).json({
            error: false,
            success: true,
            message: "Metrics retrieved successfully",
            data: {
                projects: projectMetrics[0] || {
                    totalProjects: 0,
                    totalValue: 0,
                    avgQuotedPrice: 0,
                    statusBreakdown: [],
                },
                works: workMetrics[0] || {
                    totalWorks: 0,
                    totalValue: 0,
                    avgProgress: 0,
                    avgQuotedPrice: 0,
                    statusBreakdown: [],
                },
                recentActivities: {
                    projects: recentProjects,
                    works: recentWorks,
                },
            },
        });
    } catch (error) {
        console.error("Get metrics error:", error);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve metrics",
            details: error.message,
        });
    }
};
