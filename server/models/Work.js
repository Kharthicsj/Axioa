import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
    {
        // Reference to the original project
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            unique: true, // One work record per project
        },

        // Basic project information copied from Project
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
        },

        requirements: {
            type: String,
            required: true,
        },

        quotedPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        completionTime: {
            type: Number,
            required: true,
            min: 1,
        },

        urgency: {
            type: String,
            enum: ["normal", "urgent", "critical"],
            default: "normal",
        },

        // User references
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

        // Work tracking specific fields
        workStatus: {
            type: String,
            enum: [
                "approved", // Student approved the project
                "in_progress", // Work is in progress
                "review_pending", // Work submitted for review
                "revision_requested", // Client requested revisions
                "completed", // Work completed and approved
                "awaiting_completion_proof", // Student needs to upload completion proof
                "completion_submitted", // Student submitted completion proof & payment details
                "payment_pending", // Waiting for client payment
                "payment_submitted", // Client submitted payment proof
                "payment_verified", // Payment verified, work unlocked
                "delivered", // Final delivery completed
                "cancelled", // Work cancelled
            ],
            default: "approved",
        },

        // Work progress tracking
        progress: {
            percentage: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },
            milestones: [
                {
                    title: String,
                    description: String,
                    dueDate: Date,
                    completedDate: Date,
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
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            lastUpdated: {
                type: Date,
                default: Date.now,
            },
        },

        // Work deliverables - Enhanced for completion proof
        deliverables: [
            {
                title: String,
                description: String,
                fileUrl: String,
                fileType: String,
                fileName: String,
                fileSize: Number,
                cloudinaryPublicId: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: ["draft", "submitted", "approved", "rejected"],
                    default: "draft",
                },
                feedback: String,
            },
        ],

        // Completion submission data
        completionSubmission: {
            // For document-based services (resume, content writing)
            completionFiles: [
                {
                    fileName: String,
                    fileUrl: String,
                    fileType: String,
                    fileSize: Number,
                    cloudinaryPublicId: String,
                    uploadedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],

            // For project-based services (web dev, app dev, etc.)
            projectLinks: [
                {
                    linkType: {
                        type: String,
                        enum: ["github", "live_demo", "documentation", "other"],
                        required: true,
                    },
                    url: {
                        type: String,
                        required: true,
                    },
                    description: String,
                    addedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],

            // Student payment details
            studentPaymentDetails: {
                upiQrCodeUrl: String,
                upiQrPublicId: String,
                upiId: String,
                upiPhoneNumber: String,
                paymentInstructions: String,
                submittedAt: Date,
            },

            // Submission metadata
            submittedAt: Date,
            submittedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            submissionNotes: String,
        },

        // Payment verification data
        paymentVerification: {
            // Client payment proof
            paymentProofUrl: String,
            paymentProofPublicId: String,
            upiTransactionId: String,
            paymentToName: String,
            paymentAmount: Number,
            paymentDate: Date,

            // Verification status
            verificationStatus: {
                type: String,
                enum: ["pending", "verified", "disputed", "rejected"],
                default: "pending",
            },

            verifiedAt: Date,
            verifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            verificationNotes: String,

            // Payment submission by client
            submittedAt: Date,
            submittedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },

        // Client review and rating
        clientReview: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            reviewText: String,
            skills: {
                type: Number,
                min: 1,
                max: 5,
            },
            communication: {
                type: Number,
                min: 1,
                max: 5,
            },
            timeliness: {
                type: Number,
                min: 1,
                max: 5,
            },
            quality: {
                type: Number,
                min: 1,
                max: 5,
            },
            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            reviewedAt: Date,
        },

        // Access control for secure delivery
        deliveryAccess: {
            isLocked: {
                type: Boolean,
                default: true, // Files/links are locked until payment is verified
            },
            unlockedAt: Date,
            unlockedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            accessHistory: [
                {
                    accessedBy: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    accessedAt: {
                        type: Date,
                        default: Date.now,
                    },
                    action: {
                        type: String,
                        enum: ["viewed", "downloaded", "unlocked", "locked"],
                    },
                },
            ],
        },

        // Time tracking
        timeTracking: {
            totalHoursWorked: {
                type: Number,
                default: 0,
            },
            sessions: [
                {
                    startTime: Date,
                    endTime: Date,
                    duration: Number, // in minutes
                    description: String,
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },

        // Work history/updates
        workUpdates: [
            {
                updateType: {
                    type: String,
                    enum: [
                        "status_change",
                        "progress_update",
                        "milestone_completed",
                        "deliverable_submitted",
                        "revision_requested",
                        "feedback_provided",
                        "time_logged",
                        "review_added",
                    ],
                },
                description: String,
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                metadata: mongoose.Schema.Types.Mixed, // For additional data
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Important dates
        approvedDate: {
            type: Date,
            default: Date.now,
        },

        startedDate: Date,

        expectedCompletionDate: Date,

        actualCompletionDate: Date,

        deliveredDate: Date,

        // Communication preference (copied from project)
        communicationPreference: {
            type: String,
            enum: ["email", "phone", "whatsapp", "meeting", "mixed"],
            required: true,
        },

        contactDetails: {
            phoneNumber: String,
            emailAddress: String,
            meetingLink: String,
        },

        additionalNotes: String,

        // Status tracking
        isActive: {
            type: Boolean,
            default: true,
        },

        // Reviews and ratings (for completed work)
        clientReview: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            feedback: String,
            reviewDate: Date,
        },

        studentSelfAssessment: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            notes: String,
            assessmentDate: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better performance
// Note: projectId already has unique index from unique: true
workSchema.index({ assignedTo: 1 });
workSchema.index({ assignedBy: 1 });
workSchema.index({ workStatus: 1 });
workSchema.index({ createdAt: -1 });

// Virtual for calculating work duration
workSchema.virtual("workDuration").get(function () {
    if (this.startedDate && this.actualCompletionDate) {
        return Math.ceil(
            (this.actualCompletionDate - this.startedDate) /
                (1000 * 60 * 60 * 24)
        );
    }
    return null;
});

// Method to add work update
workSchema.methods.addWorkUpdate = function (
    updateType,
    description,
    updatedBy,
    metadata = null,
    shouldSave = true
) {
    this.workUpdates.push({
        updateType,
        description,
        updatedBy,
        metadata,
        createdAt: new Date(),
    });

    if (shouldSave) {
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to update progress
workSchema.methods.updateProgress = function (
    percentage,
    updatedBy,
    description = null
) {
    this.progress.percentage = Math.min(100, Math.max(0, percentage));
    this.progress.lastUpdated = new Date();

    if (description) {
        this.workUpdates.push({
            updateType: "progress_update",
            description,
            updatedBy,
            metadata: { percentage },
            createdAt: new Date(),
        });
    }

    return this.save();
};

// Method to change work status
workSchema.methods.changeStatus = function (
    newStatus,
    updatedBy,
    reason = null
) {
    const oldStatus = this.workStatus;
    this.workStatus = newStatus;

    // Update relevant dates
    if (newStatus === "in_progress" && !this.startedDate) {
        this.startedDate = new Date();
    } else if (newStatus === "completed" && !this.actualCompletionDate) {
        this.actualCompletionDate = new Date();
    } else if (newStatus === "delivered" && !this.deliveredDate) {
        this.deliveredDate = new Date();
    }

    // Add status change update directly (without saving)
    this.workUpdates.push({
        updateType: "status_change",
        description:
            reason || `Status changed from ${oldStatus} to ${newStatus}`,
        updatedBy,
        metadata: { oldStatus, newStatus },
        createdAt: new Date(),
    });

    return this.save();
};

// Method to add milestone
workSchema.methods.addMilestone = function (
    title,
    description,
    dueDate,
    updatedBy
) {
    this.progress.milestones.push({
        title,
        description,
        dueDate,
    });

    this.workUpdates.push({
        updateType: "milestone_completed",
        description: `Milestone added: ${title}`,
        updatedBy,
        metadata: { title, dueDate },
        createdAt: new Date(),
    });

    return this.save();
};

// Method to complete milestone
workSchema.methods.completeMilestone = function (milestoneId, updatedBy) {
    const milestone = this.progress.milestones.id(milestoneId);
    if (milestone) {
        milestone.status = "completed";
        milestone.completedDate = new Date();

        this.workUpdates.push({
            updateType: "milestone_completed",
            description: `Milestone completed: ${milestone.title}`,
            updatedBy,
            metadata: { milestoneId, title: milestone.title },
            createdAt: new Date(),
        });
    }

    return this.save();
};

// Method to add time tracking session
workSchema.methods.addTimeSession = function (
    startTime,
    endTime,
    description,
    updatedBy
) {
    const duration = Math.ceil((endTime - startTime) / (1000 * 60)); // in minutes

    this.timeTracking.sessions.push({
        startTime,
        endTime,
        duration,
        description,
    });

    this.timeTracking.totalHoursWorked += duration / 60; // convert to hours

    this.workUpdates.push({
        updateType: "time_logged",
        description: `Time logged: ${(duration / 60).toFixed(2)} hours`,
        updatedBy,
        metadata: { duration, description },
        createdAt: new Date(),
    });

    return this.save();
};

const Work = mongoose.model("Work", workSchema);

export default Work;
