import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        // Project Basic Information
        projectName: {
            type: String,
            required: true,
            trim: true,
        },
        serviceCategory: {
            type: String,
            required: true,
            enum: [
                "web-development",
                "app-development",
                "resume-services",
                "cad-modeling",
                "ui-ux-design",
                "data-analysis",
                "content-writing",
            ],
        },
        projectDescription: {
            type: String,
            required: true,
            maxlength: 2000,
        },
        requirements: {
            type: String,
            required: true,
            maxlength: 1500,
        },

        // Financial Information
        quotedPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        budget: {
            type: String,
            required: true,
            enum: ["fixed"],
            default: "fixed",
        },
        paymentTerms: {
            type: String,
            required: true,
            enum: ["completion"],
            default: "completion",
        },

        // Timeline Information
        completionTime: {
            type: Number,
            required: true,
            min: 1,
        },
        urgency: {
            type: String,
            required: true,
            enum: ["normal", "urgent"],
            default: "normal",
        },
        estimatedStartDate: {
            type: Date,
            default: Date.now,
        },
        expectedCompletionDate: {
            type: Date,
        },
        actualCompletionDate: {
            type: Date,
        },

        // Project Status
        status: {
            type: String,
            required: true,
            enum: [
                "submitted",
                "accepted",
                "pending",
                "in_progress",
                "completed",
                "cancelled",
                "disputed",
            ],
            default: "submitted",
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    required: true,
                },
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
                reason: {
                    type: String,
                    maxlength: 500,
                },
                notes: {
                    type: String,
                    maxlength: 1000,
                },
            },
        ],

        // Assignment Information
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedDate: {
            type: Date,
            default: Date.now,
        },

        // Communication Preferences
        communicationPreference: {
            type: String,
            required: true,
            enum: ["whatsapp", "phone", "email", "meeting", "mixed"],
        },
        contactDetails: {
            phoneNumber: {
                type: String,
                trim: true,
            },
            emailAddress: {
                type: String,
                trim: true,
                lowercase: true,
            },
            meetingLink: {
                type: String,
                trim: true,
            },
        },

        // Project Progress
        progress: {
            percentage: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },
            milestones: [
                {
                    title: {
                        type: String,
                        required: true,
                    },
                    description: {
                        type: String,
                    },
                    dueDate: {
                        type: Date,
                    },
                    completedDate: {
                        type: Date,
                    },
                    status: {
                        type: String,
                        enum: [
                            "pending",
                            "in_progress",
                            "completed",
                            "overdue",
                        ],
                        default: "pending",
                    },
                },
            ],
            updates: [
                {
                    updateBy: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                    message: {
                        type: String,
                        required: true,
                        maxlength: 1000,
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now,
                    },
                    attachments: [
                        {
                            fileName: String,
                            filePath: String,
                            fileSize: Number,
                            mimeType: String,
                        },
                    ],
                },
            ],
        },

        // Communication Messages
        communications: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                receiver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                    maxlength: 1000,
                },
                messageType: {
                    type: String,
                    enum: [
                        "general",
                        "objection",
                        "clarification",
                        "approval",
                        "rejection",
                    ],
                    default: "general",
                },
                isRead: {
                    type: Boolean,
                    default: false,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                attachments: [
                    {
                        fileName: String,
                        filePath: String,
                        fileSize: Number,
                        mimeType: String,
                    },
                ],
            },
        ],

        // Reviews and Feedback
        reviews: {
            clientReview: {
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                    maxlength: 1000,
                },
                reviewDate: {
                    type: Date,
                },
            },
            studentReview: {
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                    maxlength: 1000,
                },
                reviewDate: {
                    type: Date,
                },
            },
        },

        // Objection and Rejection Details
        objectionDetails: {
            hasObjection: {
                type: Boolean,
                default: false,
            },
            objectionReason: {
                type: String,
                maxlength: 500,
            },
            objectionMessage: {
                type: String,
                maxlength: 1000,
            },
            objectionDate: {
                type: Date,
            },
            objectionBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            isObjectionResolved: {
                type: Boolean,
                default: false,
            },
            resolutionMessage: {
                type: String,
                maxlength: 1000,
            },
            resolutionDate: {
                type: Date,
            },
        },

        rejectionDetails: {
            isRejected: {
                type: Boolean,
                default: false,
            },
            rejectionReason: {
                type: String,
                enum: [
                    "budget_too_low",
                    "timeline_too_tight",
                    "scope_unclear",
                    "technical_complexity",
                    "resource_unavailable",
                    "skill_mismatch",
                    "communication_issues",
                    "other",
                ],
            },
            customRejectionReason: {
                type: String,
                maxlength: 500,
            },
            rejectionMessage: {
                type: String,
                maxlength: 1000,
            },
            rejectionDate: {
                type: Date,
            },
            rejectedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },

        // Additional Information
        additionalNotes: {
            type: String,
            maxlength: 1000,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        // Dispute Information
        disputes: [
            {
                raisedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                reason: {
                    type: String,
                    required: true,
                    maxlength: 500,
                },
                description: {
                    type: String,
                    required: true,
                    maxlength: 1500,
                },
                status: {
                    type: String,
                    enum: ["open", "investigating", "resolved", "closed"],
                    default: "open",
                },
                resolvedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                resolution: {
                    type: String,
                    maxlength: 1000,
                },
                raisedDate: {
                    type: Date,
                    default: Date.now,
                },
                resolvedDate: {
                    type: Date,
                },
            },
        ],

        // Metadata
        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        archived: {
            type: Boolean,
            default: false,
        },
        archivedDate: {
            type: Date,
        },
    },
    {
        timestamps: true, // This adds createdAt and updatedAt automatically
    }
);

// Pre-save middleware to calculate expected completion date
projectSchema.pre("save", function () {
    if (this.isNew && this.completionTime) {
        const startDate = this.estimatedStartDate || new Date();
        this.expectedCompletionDate = new Date(
            startDate.getTime() + this.completionTime * 24 * 60 * 60 * 1000
        );
    }

    // Set priority based on urgency
    if (this.urgency === "urgent" && this.priority === "medium") {
        this.priority = "high";
    }
});

// Instance methods
projectSchema.methods.updateStatus = function (
    newStatus,
    changedBy,
    reason = "",
    notes = ""
) {
    // Add to status history
    this.statusHistory.push({
        status: newStatus,
        changedBy: changedBy,
        reason: reason,
        notes: notes,
    });

    // Update current status
    this.status = newStatus;

    // Update completion date if completed
    if (newStatus === "completed") {
        this.actualCompletionDate = new Date();
        this.progress.percentage = 100;
    }

    return this.save();
};

projectSchema.methods.addProgressUpdate = function (
    updateBy,
    message,
    attachments = []
) {
    this.progress.updates.push({
        updateBy: updateBy,
        message: message,
        attachments: attachments,
    });

    return this.save();
};

projectSchema.methods.addMilestone = function (milestoneData) {
    this.progress.milestones.push(milestoneData);
    return this.save();
};

projectSchema.methods.updateProgress = function (percentage) {
    this.progress.percentage = Math.min(100, Math.max(0, percentage));
    return this.save();
};

projectSchema.methods.addReview = function (reviewType, rating, comment) {
    if (reviewType === "client") {
        this.reviews.clientReview = {
            rating: rating,
            comment: comment,
            reviewDate: new Date(),
        };
    } else if (reviewType === "student") {
        this.reviews.studentReview = {
            rating: rating,
            comment: comment,
            reviewDate: new Date(),
        };
    }

    return this.save();
};

projectSchema.methods.raiseDispute = function (disputeData) {
    this.disputes.push(disputeData);
    this.status = "disputed";
    return this.save();
};

projectSchema.methods.addCommunication = function (
    sender,
    receiver,
    message,
    messageType = "general",
    attachments = []
) {
    this.communications.push({
        sender: sender,
        receiver: receiver,
        message: message,
        messageType: messageType,
        attachments: attachments,
    });

    return this.save();
};

projectSchema.methods.markCommunicationAsRead = function (communicationId) {
    const communication = this.communications.id(communicationId);
    if (communication) {
        communication.isRead = true;
    }
    return this.save();
};

projectSchema.methods.raiseObjection = function (
    objectionBy,
    objectionReason,
    objectionMessage
) {
    this.objectionDetails = {
        hasObjection: true,
        objectionReason: objectionReason,
        objectionMessage: objectionMessage,
        objectionDate: new Date(),
        objectionBy: objectionBy,
        isObjectionResolved: false,
    };

    // Update status to pending for objection review
    this.status = "pending";

    // Add to status history
    this.statusHistory.push({
        status: "pending",
        changedBy: objectionBy,
        reason: "Student raised objection",
        notes: `Objection: ${objectionReason} - ${objectionMessage}`,
    });

    return this.save();
};

projectSchema.methods.resolveObjection = function (
    resolvedBy,
    resolutionMessage
) {
    this.objectionDetails.isObjectionResolved = true;
    this.objectionDetails.resolutionMessage = resolutionMessage;
    this.objectionDetails.resolutionDate = new Date();

    // Change status back to submitted for student review
    this.status = "submitted";

    // Add to status history
    this.statusHistory.push({
        status: "submitted",
        changedBy: resolvedBy,
        reason: "Objection resolved by client",
        notes: resolutionMessage,
    });

    return this.save();
};

projectSchema.methods.rejectProject = function (
    rejectedBy,
    rejectionReason,
    customRejectionReason,
    rejectionMessage
) {
    this.rejectionDetails = {
        isRejected: true,
        rejectionReason: rejectionReason,
        customRejectionReason: customRejectionReason,
        rejectionMessage: rejectionMessage,
        rejectionDate: new Date(),
        rejectedBy: rejectedBy,
    };

    // Update status to cancelled
    this.status = "cancelled";

    // Add to status history
    this.statusHistory.push({
        status: "cancelled",
        changedBy: rejectedBy,
        reason: "Project rejected by student",
        notes: `Rejection reason: ${rejectionReason}${
            customRejectionReason ? ` - ${customRejectionReason}` : ""
        } - ${rejectionMessage}`,
    });

    return this.save();
};

// Static methods
projectSchema.statics.getProjectsByStatus = function (status) {
    return this.find({ status: status, isActive: true })
        .populate("assignedTo", "username email profilePicture")
        .populate("assignedBy", "username email profilePicture")
        .sort({ createdAt: -1 });
};

projectSchema.statics.getProjectsByUser = function (
    userId,
    userRole = "client"
) {
    const query =
        userRole === "student"
            ? { assignedTo: userId, isActive: true }
            : { assignedBy: userId, isActive: true };

    return this.find(query)
        .populate("assignedTo", "username email profilePicture skills")
        .populate("assignedBy", "username email profilePicture")
        .sort({ createdAt: -1 });
};

projectSchema.statics.getProjectStats = function (userId = null) {
    const matchStage = userId
        ? {
              $match: {
                  $or: [{ assignedTo: userId }, { assignedBy: userId }],
                  isActive: true,
              },
          }
        : { $match: { isActive: true } };

    return this.aggregate([
        matchStage,
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalValue: { $sum: "$quotedPrice" },
            },
        },
    ]);
};

// Indexes for better query performance
projectSchema.index({ assignedTo: 1, status: 1 });
projectSchema.index({ assignedBy: 1, status: 1 });
projectSchema.index({ serviceCategory: 1, status: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ expectedCompletionDate: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
