import StudentApplication from "../../models/StudentApplication.js";
import User from "../../models/User.js";

// Get all student applications for admin
const getAllStudentApplications = async (req, res) => {
    try {
        const {
            status,
            search,
            sortBy = "submittedAt",
            sortOrder = "desc",
        } = req.query;

        // Build query
        let query = { status: { $ne: "draft" } }; // Don't show draft applications

        if (status && status !== "all") {
            query.status = status;
        }

        // Get applications with user data
        let applications = await StudentApplication.find(query)
            .populate(
                "userId",
                "username email phone profilePicture profilepic"
            )
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 });

        // Filter by search term if provided
        if (search) {
            const searchLower = search.toLowerCase();
            applications = applications.filter(
                (app) =>
                    app.personalInfo?.fullName
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    app.personalInfo?.email
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    app.education?.college
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    app.education?.degree?.toLowerCase().includes(searchLower)
            );
        }

        // Transform data for frontend
        const transformedApplications = applications.map((app) => {
            return {
                id: app._id,
                userId: app.userId._id,
                name: app.personalInfo?.fullName || app.userId.username,
                email: app.personalInfo?.email || app.userId.email,
                phone: app.personalInfo?.phone || app.userId.phone,
                college: app.education?.college || "Not specified",
                degree: app.education?.degree || "Not specified",
                course: app.education?.course || "Not specified",
                year: app.education?.year || "Not specified",
                location: app.personalInfo?.address
                    ? `${app.personalInfo.address.city}, ${app.personalInfo.address.state}`
                    : "Not specified",
                appliedDate: app.submittedAt || app.createdAt,
                status: app.status,
                gpa: app.education?.cgpa || 0,
                percentage: app.education?.percentage || 0,
                projects: app.technical?.projects?.length || 0,
                profilePicture:
                    app.userId.profilepic || app.userId.profilePicture || null,
                profileCompletion: app.profileCompletion?.percentage || 0,
                // Full application data for detailed view
                fullData: app,
            };
        });

        res.json({
            error: false,
            success: true,
            message: "Student applications retrieved successfully",
            data: transformedApplications,
            total: transformedApplications.length,
        });
    } catch (error) {
        console.error("Get student applications error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve student applications",
            details: error.message,
        });
    }
};

// Get single student application details
const getStudentApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await StudentApplication.findById(id).populate(
            "userId",
            "username email phone profilePicture profilepic createdAt"
        );

        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Transform the data to match frontend expectations
        const transformedApplication = {
            id: application._id,
            userId: application.userId._id,
            name:
                application.personalInfo?.fullName ||
                application.userId.username ||
                "N/A",
            email:
                application.personalInfo?.email ||
                application.userId.email ||
                "N/A",
            phone:
                application.personalInfo?.phone ||
                application.userId.phone ||
                "N/A",
            location: application.personalInfo?.address
                ? `${application.personalInfo.address.city}, ${application.personalInfo.address.state}`
                : "N/A",
            appliedDate: application.submittedAt || application.createdAt,
            status: application.status,

            // Education details
            degree: application.education?.degree || "N/A",
            college: application.education?.college || "N/A",
            course: application.education?.course || "N/A",
            year: application.education?.year || "N/A",
            cgpa: application.education?.cgpa || "N/A",
            percentage: application.education?.percentage || "N/A",
            specialization: application.education?.specialization || "N/A",
            expectedGraduation:
                application.education?.expectedGraduation || "N/A",

            // Technical details
            skills: application.technical?.skills?.join(", ") || "N/A",
            programmingLanguages:
                application.technical?.programmingLanguages?.join(", ") ||
                "N/A",
            frameworks: application.technical?.frameworks?.join(", ") || "N/A",
            tools: application.technical?.tools?.join(", ") || "N/A",
            projects: application.technical?.projects || [],
            github: application.technical?.github || "N/A",
            linkedin: application.technical?.linkedin || "N/A",
            portfolio: application.technical?.portfolio || "N/A",

            // Documents
            identityProof: application.identityProof?.documentImage || null,
            identityProofType: application.identityProof?.documentType || "N/A",
            identityProofNumber:
                application.identityProof?.documentNumber || "N/A",
            collegeIdProof: application.collegeIdProof?.documentImage || null,
            collegeIdProofNumber:
                application.collegeIdProof?.documentNumber || "N/A",

            // Application details
            reasonForApplying:
                application.applicationDetails?.reasonForApplying || "N/A",
            careerGoals: application.applicationDetails?.careerGoals || "N/A",
            experience: application.applicationDetails?.experience || "N/A",
            achievements: application.applicationDetails?.achievements || [],
            references: application.applicationDetails?.references || [],

            // Personal details
            dateOfBirth: application.personalInfo?.dateOfBirth || "N/A",
            gender: application.personalInfo?.gender || "N/A",
            address: application.personalInfo?.address || {},
            profilePicture:
                application.userId?.profilepic ||
                application.userId?.profilePicture ||
                null,

            // Profile completion
            profileCompletion: application.profileCompletion || {
                percentage: 0,
            },

            // Review details
            reviewComments: application.reviewComments || "",
            reviewedAt: application.reviewedAt || null,
            reviewedBy: application.reviewedBy || null,

            // Languages (if skills contain languages)
            languages:
                application.technical?.programmingLanguages?.join(", ") ||
                "N/A",

            // Additional fields for compatibility
            fullData: application, // Keep original data for any missing mappings
        };

        res.json({
            error: false,
            success: true,
            message: "Student application details retrieved successfully",
            data: transformedApplication,
        });
    } catch (error) {
        console.error("Get student application by ID error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve student application details",
            details: error.message,
        });
    }
};

// Update application status (approve/reject)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewComments } = req.body;
        const adminId = req.user.userId;

        if (!["approved", "rejected", "under_review"].includes(status)) {
            return res.status(400).json({
                error: true,
                success: false,
                message:
                    "Invalid status. Must be 'approved', 'rejected', or 'under_review'",
            });
        }

        const application = await StudentApplication.findById(id);

        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Update application
        application.status = status;
        application.reviewedAt = new Date();
        application.reviewedBy = adminId;
        if (reviewComments) {
            application.reviewComments = reviewComments;
        }

        // If approved, change user role to student
        if (status === "approved") {
            await User.findByIdAndUpdate(
                application.userId,
                { role: "student" },
                { new: true }
            );
        }

        await application.save();

        res.json({
            error: false,
            success: true,
            message: `Application ${status} successfully`,
            data: application,
        });
    } catch (error) {
        console.error("Update application status error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update application status",
            details: error.message,
        });
    }
};

// Get applications statistics
const getApplicationsStats = async (req, res) => {
    try {
        const stats = await StudentApplication.aggregate([
            {
                $match: { status: { $ne: "draft" } },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalApplications = await StudentApplication.countDocuments({
            status: { $ne: "draft" },
        });

        const statsObj = {
            total: totalApplications,
            submitted: 0,
            under_review: 0,
            approved: 0,
            rejected: 0,
        };

        stats.forEach((stat) => {
            statsObj[stat._id] = stat.count;
        });

        res.json({
            error: false,
            success: true,
            message: "Application statistics retrieved successfully",
            data: statsObj,
        });
    } catch (error) {
        console.error("Get applications stats error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve application statistics",
            details: error.message,
        });
    }
};

export {
    getAllStudentApplications,
    getStudentApplicationById,
    updateApplicationStatus,
    getApplicationsStats,
};
