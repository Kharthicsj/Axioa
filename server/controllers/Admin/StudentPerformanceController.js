import StudentPerformance from "../../models/StudentPerformance.js";
import StudentApplication from "../../models/StudentApplication.js";
import User from "../../models/User.js";
import Project from "../../models/Project.js";
import Work from "../../models/Work.js";

// Get all approved students with their performance data
const getApprovedStudents = async (req, res) => {
    try {
        const {
            status,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Find all approved student applications
        let query = { status: "approved" };

        let applications = await StudentApplication.find(query)
            .populate(
                "userId",
                "username email phone profilePicture profilepic role"
            )
            .sort({ reviewedAt: -1 });

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

        // Get performance data for each student
        const studentsWithPerformance = await Promise.all(
            applications.map(async (application) => {
                let performance = await StudentPerformance.findOne({
                    userId: application.userId._id,
                });

                // Create default performance record if doesn't exist
                if (!performance) {
                    performance = new StudentPerformance({
                        userId: application.userId._id,
                        status: "active",
                    });
                    await performance.save();
                }

                // Get profile picture - prioritize profilePicture, then profilepic
                let profilePicture = null;
                if (application.userId.profilePicture) {
                    profilePicture = application.userId.profilePicture;
                } else if (application.userId.profilepic) {
                    profilePicture = application.userId.profilepic;
                }

                return {
                    id: application._id,
                    userId: application.userId._id,
                    name: application.personalInfo.fullName,
                    email: application.personalInfo.email,
                    phone: application.personalInfo.phone,
                    college: application.education.college,
                    degree: application.education.degree,
                    year: `${application.education.year}${getOrdinalSuffix(
                        application.education.year
                    )} Year`,
                    location: `${application.personalInfo.address.city}, ${application.personalInfo.address.state}`,
                    approvedDate: application.reviewedAt,
                    joinedDate: application.createdAt,
                    profilePicture,

                    // Performance data
                    gpa: application.education.cgpa || 0,
                    projects: {
                        total: performance.projects.totalAssigned,
                        completed: performance.projects.totalCompleted,
                        inProgress: performance.projects.totalInProgress,
                        overdue: performance.projects.totalOverdue,
                        completionRate: performance.projects.completionRate,
                        averageGrade: performance.projects.averageGrade,
                    },
                    performance: performance.performance,
                    status: performance.status,
                    overallRating: performance.performance.overallRating,
                    level: performance.level,
                    totalPoints: performance.totalPoints,
                    totalReviews: performance.reviews.length,
                    totalReports: performance.reports.totalReports,
                    pendingReports: performance.reports.pendingReports,
                    lastActive: performance.engagement.lastActive,
                    engagementScore: performance.engagement.engagementScore,

                    // Skills from application
                    skills: application.technical.skills || [],

                    // Recent activity summary
                    recentActivity: {
                        recentProjects: performance.projects.assigned
                            .slice(-3)
                            .map((p) => ({
                                title: p.title,
                                status: p.status,
                                dueDate: p.dueDate,
                            })),
                        recentReviews: performance.reviews
                            .slice(-2)
                            .map((r) => ({
                                rating: r.rating,
                                comment: r.comment.substring(0, 100) + "...",
                                reviewDate: r.reviewDate,
                                reviewerName: r.reviewerName,
                            })),
                    },
                };
            })
        );

        // Apply additional filtering
        let filteredStudents = studentsWithPerformance;
        if (status && status !== "all") {
            filteredStudents = filteredStudents.filter(
                (student) => student.status === status
            );
        }

        // Apply sorting
        filteredStudents.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle nested properties
            if (sortBy.includes(".")) {
                const keys = sortBy.split(".");
                aValue = keys.reduce((obj, key) => obj[key], a);
                bValue = keys.reduce((obj, key) => obj[key], b);
            }

            if (sortBy.includes("Date")) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // Calculate summary statistics
        const stats = {
            totalStudents: filteredStudents.length,
            activeStudents: filteredStudents.filter(
                (s) => s.status === "active"
            ).length,
            inactiveStudents: filteredStudents.filter(
                (s) => s.status === "inactive"
            ).length,
            suspendedStudents: filteredStudents.filter(
                (s) => s.status === "suspended"
            ).length,
            averageRating:
                filteredStudents.length > 0
                    ? (
                          filteredStudents.reduce(
                              (sum, s) => sum + s.overallRating,
                              0
                          ) / filteredStudents.length
                      ).toFixed(2)
                    : 0,
            totalProjects: filteredStudents.reduce(
                (sum, s) => sum + s.projects.total,
                0
            ),
            completedProjects: filteredStudents.reduce(
                (sum, s) => sum + s.projects.completed,
                0
            ),
            averageCompletionRate:
                filteredStudents.length > 0
                    ? (
                          filteredStudents.reduce(
                              (sum, s) => sum + s.projects.completionRate,
                              0
                          ) / filteredStudents.length
                      ).toFixed(1)
                    : 0,
            totalReports: filteredStudents.reduce(
                (sum, s) => sum + s.totalReports,
                0
            ),
            pendingReports: filteredStudents.reduce(
                (sum, s) => sum + s.pendingReports,
                0
            ),
        };

        res.status(200).json({
            error: false,
            success: true,
            message: "Approved students retrieved successfully",
            data: {
                students: filteredStudents,
                stats,
                pagination: {
                    total: filteredStudents.length,
                    page: 1,
                    limit: filteredStudents.length,
                },
            },
        });
    } catch (error) {
        console.error("Get approved students error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve approved students",
            details: error.message,
        });
    }
};

// Get detailed performance data for a specific student
const getStudentPerformance = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get student application data
        const application = await StudentApplication.findById(
            studentId
        ).populate(
            "userId",
            "username email phone profilePicture profilepic role"
        );

        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Get or create performance data
        let performance = await StudentPerformance.findOne({
            userId: application.userId._id,
        })
            .populate("projects.assigned.assignedBy", "username email")
            .populate("reviews.reviewedBy", "username email role")
            .populate(
                "reports.behavioralReports.reportedBy",
                "username email role"
            )
            .populate("terminationInfo.terminatedBy", "username email");

        if (!performance) {
            performance = new StudentPerformance({
                userId: application.userId._id,
                status: "active",
            });
            await performance.save();
        }

        // Get all projects assigned to this student from Project collection
        const assignedProjects = await Project.find({
            assignedTo: application.userId._id,
            isActive: true,
        })
            .populate("assignedBy", "username email profilePicture")
            .sort({ assignedDate: -1 });

        // Get all work records for this student from Work collection
        const workRecords = await Work.find({
            assignedTo: application.userId._id,
            isActive: true,
        })
            .populate("projectId")
            .populate("assignedBy", "username email profilePicture")
            .sort({ createdAt: -1 });

        // Create a map of project IDs to work records for easy lookup
        const workMap = new Map();
        workRecords.forEach((work) => {
            workMap.set(work.projectId._id.toString(), work);
        });

        // Calculate comprehensive project statistics
        const projectStats = {
            totalAssigned: assignedProjects.length,
            totalCompleted: 0,
            totalInProgress: 0,
            totalOverdue: 0,
            totalCancelled: 0,
            completionRate: 0,
            averageGrade: 0,
            totalEarnings: 0,
            currentMonthEarnings: 0,
            averageProjectValue: 0,
            highestEarningProject: 0,
            earningsByCategory: {},
        };

        let totalGrades = 0;
        let gradedProjects = 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Process each project and its corresponding work
        const detailedProjectList = assignedProjects.map((project) => {
            const work = workMap.get(project._id.toString());

            // Determine actual status from work record if available
            let actualStatus = project.status;
            let actualEarnings = 0;
            let isCompleted = false;

            if (work) {
                // Map work status to project status for better understanding
                switch (work.workStatus) {
                    case "completed":
                    case "delivered":
                    case "payment_verified":
                        actualStatus = "completed";
                        isCompleted = true;
                        actualEarnings =
                            work.finalAmount || work.quotedPrice || 0;
                        projectStats.totalCompleted++;
                        break;
                    case "in_progress":
                    case "review_pending":
                    case "revision_requested":
                    case "awaiting_completion_proof":
                    case "completion_submitted":
                    case "payment_pending":
                    case "payment_submitted":
                        actualStatus = "in_progress";
                        projectStats.totalInProgress++;
                        break;
                    case "cancelled":
                        actualStatus = "cancelled";
                        projectStats.totalCancelled++;
                        break;
                    default:
                        if (project.status === "completed") {
                            projectStats.totalCompleted++;
                            isCompleted = true;
                            actualEarnings = project.quotedPrice || 0;
                        } else if (project.status === "in_progress") {
                            projectStats.totalInProgress++;
                        }
                }
            } else {
                // No work record, use project status
                if (project.status === "completed") {
                    projectStats.totalCompleted++;
                    isCompleted = true;
                    actualEarnings = project.quotedPrice || 0;
                } else if (project.status === "in_progress") {
                    projectStats.totalInProgress++;
                }
            }

            // Check if overdue
            const isOverdue =
                project.expectedCompletionDate &&
                new Date() > new Date(project.expectedCompletionDate) &&
                !isCompleted;
            if (isOverdue) {
                projectStats.totalOverdue++;
            }

            // Calculate earnings
            if (actualEarnings > 0) {
                projectStats.totalEarnings += actualEarnings;
                projectStats.highestEarningProject = Math.max(
                    projectStats.highestEarningProject,
                    actualEarnings
                );

                // Current month earnings
                const completedDate =
                    work?.actualCompletionDate || project.actualCompletionDate;
                if (completedDate) {
                    const completedMonth = new Date(completedDate).getMonth();
                    const completedYear = new Date(completedDate).getFullYear();
                    if (
                        completedMonth === currentMonth &&
                        completedYear === currentYear
                    ) {
                        projectStats.currentMonthEarnings += actualEarnings;
                    }
                }

                // Earnings by category
                const category = project.serviceCategory || "other";
                projectStats.earningsByCategory[category] =
                    (projectStats.earningsByCategory[category] || 0) +
                    actualEarnings;
            }

            // Calculate grades if available
            if (work && work.finalGrade) {
                totalGrades += work.finalGrade;
                gradedProjects++;
            }

            // Calculate days until due
            let daysUntilDue = null;
            if (project.expectedCompletionDate) {
                const diffTime =
                    new Date(project.expectedCompletionDate) - new Date();
                daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            return {
                _id: project._id,
                title: project.projectName,
                description: project.projectDescription,
                serviceCategory: project.serviceCategory,
                status: actualStatus,
                quotedPrice: project.quotedPrice,
                actualEarnings: actualEarnings,
                assignedDate: project.assignedDate,
                dueDate: project.expectedCompletionDate,
                completedDate:
                    work?.actualCompletionDate || project.actualCompletionDate,
                assignedBy: project.assignedBy,
                assignedByName: project.assignedBy?.username || "Unknown",
                progress:
                    work?.progress?.percentage ||
                    project.progress?.percentage ||
                    0,
                workStatus: work?.workStatus || "not_started",
                grade: work?.finalGrade || null,
                isOverdue: isOverdue,
                daysUntilDue: daysUntilDue,
                workId: work?._id || null,
                // Additional work details if available
                workDetails: work
                    ? {
                          workStatus: work.workStatus,
                          startDate: work.startDate,
                          actualCompletionDate: work.actualCompletionDate,
                          totalTimeSpent:
                              work.timeTracking?.totalTimeSpent || 0,
                          finalAmount: work.finalAmount,
                          paymentStatus: work.paymentStatus,
                      }
                    : null,
            };
        });

        // Calculate final statistics
        if (projectStats.totalAssigned > 0) {
            projectStats.completionRate = Math.round(
                (projectStats.totalCompleted / projectStats.totalAssigned) * 100
            );
            projectStats.averageProjectValue = Math.round(
                projectStats.totalEarnings /
                    Math.max(projectStats.totalCompleted, 1)
            );
        }

        if (gradedProjects > 0) {
            projectStats.averageGrade = Math.round(
                totalGrades / gradedProjects
            );
        }

        // Get profile picture
        let profilePicture = null;
        if (application.userId.profilePicture) {
            profilePicture = application.userId.profilePicture;
        } else if (application.userId.profilepic) {
            profilePicture = application.userId.profilepic;
        }

        const detailedData = {
            // Basic student info
            studentInfo: {
                id: application._id,
                userId: application.userId._id,
                name: application.personalInfo.fullName,
                email: application.personalInfo.email,
                phone: application.personalInfo.phone,
                profilePicture,
                college: application.education.college,
                degree: application.education.degree,
                year: application.education.year,
                cgpa: application.education.cgpa,
                location: `${application.personalInfo.address.city}, ${application.personalInfo.address.state}`,
                skills: application.technical.skills || [],
                approvedDate: application.reviewedAt,
                joinedDate: application.createdAt,
            },

            // Performance metrics
            performance: {
                ...performance.performance,
                level: performance.level,
                totalPoints: performance.totalPoints,
                status: performance.status,
            },

            // Enhanced projects details with actual data from Project and Work collections
            projects: {
                statistics: {
                    totalAssigned: projectStats.totalAssigned,
                    totalCompleted: projectStats.totalCompleted,
                    totalInProgress: projectStats.totalInProgress,
                    totalOverdue: projectStats.totalOverdue,
                    totalCancelled: projectStats.totalCancelled,
                    completionRate: projectStats.completionRate,
                    averageGrade: projectStats.averageGrade,
                    totalEarnings: projectStats.totalEarnings,
                    currentMonthEarnings: projectStats.currentMonthEarnings,
                    averageProjectValue: projectStats.averageProjectValue,
                    highestEarningProject: projectStats.highestEarningProject,
                    earningsByCategory: projectStats.earningsByCategory,
                },
                list: detailedProjectList,
            },

            // Work records for detailed tracking
            workRecords: workRecords.map((work) => ({
                _id: work._id,
                projectId: work.projectId._id,
                projectName: work.projectName,
                workStatus: work.workStatus,
                progress: work.progress,
                quotedPrice: work.quotedPrice,
                finalAmount: work.finalAmount,
                startDate: work.startDate,
                actualCompletionDate: work.actualCompletionDate,
                paymentStatus: work.paymentStatus,
                timeTracking: work.timeTracking,
                assignedBy: work.assignedBy,
                createdAt: work.createdAt,
                updatedAt: work.updatedAt,
            })),

            // Reviews and ratings
            reviews: performance.reviews.map((review) => ({
                ...review.toObject(),
                reviewerInfo: review.reviewedBy
                    ? {
                          name: review.reviewedBy.username,
                          email: review.reviewedBy.email,
                          role: review.reviewedBy.role,
                      }
                    : null,
            })),

            // Reports and incidents
            reports: {
                statistics: {
                    totalReports: performance.reports.totalReports,
                    resolvedReports: performance.reports.resolvedReports,
                    pendingReports: performance.reports.pendingReports,
                },
                list: performance.reports.behavioralReports.map((report) => ({
                    ...report.toObject(),
                    reporterInfo: report.reportedBy
                        ? {
                              name: report.reportedBy.username,
                              email: report.reportedBy.email,
                              role: report.reportedBy.role,
                          }
                        : null,
                })),
            },

            // Engagement data
            engagement: performance.engagement,

            // Achievements
            achievements: performance.achievements,

            // Termination info (if applicable)
            terminationInfo: performance.terminationInfo,
        };

        res.status(200).json({
            error: false,
            success: true,
            message: "Student performance data retrieved successfully",
            data: detailedData,
        });
    } catch (error) {
        console.error("Get student performance error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve student performance data",
            details: error.message,
        });
    }
};

// Terminate a student with reason
const terminateStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { reason, canReapply = false, reapplyDate } = req.body;
        const adminId = req.user.userId;

        if (!reason || reason.trim().length === 0) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Termination reason is required",
            });
        }

        // Get student application
        const application = await StudentApplication.findById(studentId);
        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Get or create performance record
        let performance = await StudentPerformance.findOne({
            userId: application.userId,
        });
        if (!performance) {
            performance = new StudentPerformance({
                userId: application.userId,
                status: "active",
            });
        }

        // Terminate the student
        await performance.terminate({
            terminatedBy: adminId,
            terminationReason: reason.trim(),
            canReapply,
            reapplyDate: reapplyDate ? new Date(reapplyDate) : null,
        });

        // Update user role back to 'user'
        await User.findByIdAndUpdate(
            application.userId,
            { role: "user" },
            { new: true }
        );

        res.status(200).json({
            error: false,
            success: true,
            message: "Student terminated successfully",
            data: {
                studentId: application._id,
                terminatedDate: performance.terminationInfo.terminatedDate,
                reason: performance.terminationInfo.terminationReason,
            },
        });
    } catch (error) {
        console.error("Terminate student error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to terminate student",
            details: error.message,
        });
    }
};

// Add a project to student
const assignProject = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { title, description, dueDate, priority = "medium" } = req.body;
        const adminId = req.user.userId;

        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Project title is required",
            });
        }

        // Get student application
        const application = await StudentApplication.findById(studentId);
        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Get or create performance record
        let performance = await StudentPerformance.findOne({
            userId: application.userId,
        });
        if (!performance) {
            performance = new StudentPerformance({
                userId: application.userId,
                status: "active",
            });
            await performance.save();
        }

        // Add project
        await performance.addProject({
            title: title.trim(),
            description: description?.trim() || "",
            dueDate: dueDate ? new Date(dueDate) : null,
            priority,
            assignedBy: adminId,
        });

        res.status(200).json({
            error: false,
            success: true,
            message: "Project assigned successfully",
            data: {
                studentId: application._id,
                projectTitle: title.trim(),
            },
        });
    } catch (error) {
        console.error("Assign project error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to assign project",
            details: error.message,
        });
    }
};

// Add a review for student
const addReview = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { rating, comment, tags = [], projectRelated } = req.body;
        const reviewerId = req.user.userId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Review comment is required",
            });
        }

        // Get reviewer info
        const reviewer = await User.findById(reviewerId);
        if (!reviewer) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Reviewer not found",
            });
        }

        // Get student application
        const application = await StudentApplication.findById(studentId);
        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Get or create performance record
        let performance = await StudentPerformance.findOne({
            userId: application.userId,
        });
        if (!performance) {
            performance = new StudentPerformance({
                userId: application.userId,
                status: "active",
            });
            await performance.save();
        }

        // Add review
        await performance.addReview({
            reviewedBy: reviewerId,
            reviewerName: reviewer.username,
            reviewerRole: reviewer.role,
            rating,
            comment: comment.trim(),
            tags,
            projectRelated,
        });

        res.status(200).json({
            error: false,
            success: true,
            message: "Review added successfully",
            data: {
                studentId: application._id,
                rating,
                reviewerName: reviewer.username,
            },
        });
    } catch (error) {
        console.error("Add review error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to add review",
            details: error.message,
        });
    }
};

// Update performance metrics
const updatePerformanceMetrics = async (req, res) => {
    try {
        const { studentId } = req.params;
        const {
            technicalSkills,
            communicationSkills,
            problemSolving,
            teamwork,
            punctuality,
            qualityOfWork,
        } = req.body;

        // Validate ratings
        const metrics = {
            technicalSkills,
            communicationSkills,
            problemSolving,
            teamwork,
            punctuality,
            qualityOfWork,
        };
        for (const [key, value] of Object.entries(metrics)) {
            if (value !== undefined && (value < 0 || value > 5)) {
                return res.status(400).json({
                    error: true,
                    success: false,
                    message: `${key} rating must be between 0 and 5`,
                });
            }
        }

        // Get student application
        const application = await StudentApplication.findById(studentId);
        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Get or create performance record
        let performance = await StudentPerformance.findOne({
            userId: application.userId,
        });
        if (!performance) {
            performance = new StudentPerformance({
                userId: application.userId,
                status: "active",
            });
        }

        // Update performance metrics
        Object.keys(metrics).forEach((key) => {
            if (metrics[key] !== undefined) {
                performance.performance[key] = metrics[key];
            }
        });

        await performance.save();

        res.status(200).json({
            error: false,
            success: true,
            message: "Performance metrics updated successfully",
            data: {
                studentId: application._id,
                performance: performance.performance,
            },
        });
    } catch (error) {
        console.error("Update performance metrics error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update performance metrics",
            details: error.message,
        });
    }
};

// Helper function to get ordinal suffix
const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
};

// Get work records for a specific student
const getStudentWorkRecords = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get student application data to find userId
        const application = await StudentApplication.findById(studentId);
        if (!application) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Student application not found",
            });
        }

        // Get all work records for this student
        const workRecords = await Work.find({
            assignedTo: application.userId,
            isActive: true,
        })
            .populate("projectId", "projectName serviceCategory quotedPrice")
            .populate("assignedBy", "username email profilePicture")
            .sort({ createdAt: -1 });

        // Calculate work statistics
        const workStats = {
            totalWorks: workRecords.length,
            completedWorks: workRecords.filter(
                (w) =>
                    w.workStatus === "completed" || w.workStatus === "delivered"
            ).length,
            activeWorks: workRecords.filter((w) =>
                [
                    "in_progress",
                    "review_pending",
                    "revision_requested",
                ].includes(w.workStatus)
            ).length,
            totalEarnings: workRecords.reduce(
                (sum, w) => sum + (w.finalAmount || 0),
                0
            ),
            averageCompletion: 0,
            worksByCategory: {},
        };

        // Calculate completion rate
        if (workStats.totalWorks > 0) {
            workStats.averageCompletion = Math.round(
                (workStats.completedWorks / workStats.totalWorks) * 100
            );
        }

        // Group by category
        workRecords.forEach((work) => {
            const category = work.serviceCategory || "other";
            if (!workStats.worksByCategory[category]) {
                workStats.worksByCategory[category] = {
                    count: 0,
                    earnings: 0,
                    completed: 0,
                };
            }
            workStats.worksByCategory[category].count++;
            workStats.worksByCategory[category].earnings +=
                work.finalAmount || 0;
            if (
                work.workStatus === "completed" ||
                work.workStatus === "delivered"
            ) {
                workStats.worksByCategory[category].completed++;
            }
        });

        res.status(200).json({
            error: false,
            success: true,
            message: "Student work records retrieved successfully",
            data: {
                workRecords: workRecords.map((work) => ({
                    _id: work._id,
                    projectId: work.projectId._id,
                    projectName: work.projectName,
                    serviceCategory: work.serviceCategory,
                    workStatus: work.workStatus,
                    quotedPrice: work.quotedPrice,
                    finalAmount: work.finalAmount,
                    progress: work.progress,
                    startDate: work.startDate,
                    actualCompletionDate: work.actualCompletionDate,
                    assignedBy: work.assignedBy,
                    timeTracking: work.timeTracking,
                    paymentStatus: work.paymentStatus,
                    createdAt: work.createdAt,
                    updatedAt: work.updatedAt,
                })),
                statistics: workStats,
            },
        });
    } catch (error) {
        console.error("Get student work records error:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Failed to retrieve student work records",
            details: error.message,
        });
    }
};

export {
    getApprovedStudents,
    getStudentPerformance,
    getStudentWorkRecords,
    terminateStudent,
    assignProject,
    addReview,
    updatePerformanceMetrics,
};
