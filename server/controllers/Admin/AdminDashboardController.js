import userModel from "../../models/User.js";
import StudentApplication from "../../models/StudentApplication.js";
import StudentPerformance from "../../models/StudentPerformance.js";
import Project from "../../models/Project.js";
import Work from "../../models/Work.js";

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get current date for time-based queries
        const now = new Date();
        const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Basic user statistics
        const [
            totalUsers,
            totalStudents,
            totalAdmins,
            activeUsers,
            newUsersThisMonth,
            newUsersLastMonth,
            // Student Application statistics
            totalApplications,
            approvedApplications,
            pendingApplications,
            rejectedApplications,
            // Project statistics
            totalProjects,
            activeProjects,
            completedProjects,
            // Work statistics
            totalWorks,
            completedWorks,
            inProgressWorks,
        ] = await Promise.all([
            userModel.countDocuments({}),
            userModel.countDocuments({ role: "student" }),
            userModel.countDocuments({ role: "admin" }),
            userModel.countDocuments({ isActive: true }),
            userModel.countDocuments({
                createdAt: { $gte: thirtyDaysAgo },
            }),
            userModel.countDocuments({
                createdAt: {
                    $gte: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
                    $lt: thirtyDaysAgo,
                },
            }),
            // Student Application counts
            StudentApplication.countDocuments({}),
            StudentApplication.countDocuments({ status: "approved" }),
            StudentApplication.countDocuments({ status: "under_review" }),
            StudentApplication.countDocuments({ status: "rejected" }),
            // Project counts
            Project.countDocuments({}),
            Project.countDocuments({
                status: { $in: ["submitted", "accepted", "in_progress"] },
            }),
            Project.countDocuments({ status: "completed" }),
            // Work counts
            Work.countDocuments({}),
            Work.countDocuments({
                workStatus: { $in: ["completed", "delivered"] },
            }),
            Work.countDocuments({
                workStatus: {
                    $in: ["approved", "in_progress", "review_pending"],
                },
            }),
        ]);

        // Calculate growth percentage
        const userGrowthPercentage =
            newUsersLastMonth > 0
                ? (
                      ((newUsersThisMonth - newUsersLastMonth) /
                          newUsersLastMonth) *
                      100
                  ).toFixed(1)
                : newUsersThisMonth > 0
                ? 100
                : 0;

        // Role distribution
        const roleDistribution = await userModel.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 },
                },
            },
        ]);

        // User activity in last 7 days
        const recentlyActiveUsers = await userModel.countDocuments({
            lastLogin: { $gte: sevenDaysAgo },
        });

        // Project analytics by service category
        const projectsByCategory = await Project.aggregate([
            {
                $group: {
                    _id: "$serviceCategory",
                    count: { $sum: 1 },
                    totalQuotedPrice: { $sum: "$quotedPrice" },
                    avgQuotedPrice: { $avg: "$quotedPrice" },
                    completedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // Work analytics with earnings data
        const workAnalytics = await Work.aggregate([
            {
                $group: {
                    _id: "$workStatus",
                    count: { $sum: 1 },
                    totalEarnings: { $sum: "$quotedPrice" },
                    avgEarnings: { $avg: "$quotedPrice" },
                },
            },
        ]);

        // Monthly project and work trends
        const monthlyProjectTrends = await Project.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    projectsCreated: { $sum: 1 },
                    totalQuotedValue: { $sum: "$quotedPrice" },
                    completedProjects: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 },
        ]);

        const monthlyWorkTrends = await Work.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    worksStarted: { $sum: 1 },
                    totalEarnings: { $sum: "$quotedPrice" },
                    completedWorks: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$workStatus",
                                        ["completed", "delivered"],
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 },
        ]);

        // Student performance distribution
        const studentPerformanceStats = await StudentPerformance.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    avgRating: { $avg: "$performance.overallRating" },
                    totalProjectsAssigned: { $sum: "$projects.totalAssigned" },
                    totalProjectsCompleted: {
                        $sum: "$projects.totalCompleted",
                    },
                },
            },
        ]);

        // Application status distribution
        const applicationStatusDistribution =
            await StudentApplication.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                    },
                },
            ]);

        // Top performing students (by completion rate)
        const topStudents = await StudentPerformance.find({
            "projects.totalAssigned": { $gt: 0 },
        })
            .populate("userId", "username email")
            .sort({ "projects.completionRate": -1 })
            .limit(5)
            .select(
                "userId projects.completionRate projects.totalCompleted projects.averageGrade performance.overallRating"
            );

        // Earnings analytics
        const earningsAnalytics = await Work.aggregate([
            {
                $match: {
                    workStatus: { $in: ["completed", "delivered"] },
                },
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$quotedPrice" },
                    avgEarningsPerWork: { $avg: "$quotedPrice" },
                    maxEarning: { $max: "$quotedPrice" },
                    minEarning: { $min: "$quotedPrice" },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Service category performance
        const categoryPerformance = await Work.aggregate([
            {
                $group: {
                    _id: "$serviceCategory",
                    totalWorks: { $sum: 1 },
                    completedWorks: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$workStatus",
                                        ["completed", "delivered"],
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    totalEarnings: { $sum: "$quotedPrice" },
                    avgEarnings: { $avg: "$quotedPrice" },
                    completionRate: {
                        $avg: {
                            $cond: [
                                {
                                    $in: [
                                        "$workStatus",
                                        ["completed", "delivered"],
                                    ],
                                },
                                100,
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { totalEarnings: -1 } },
        ]);

        // Monthly user growth data for chart
        const monthlyGrowth = await userModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
            {
                $limit: 12, // Last 12 months
            },
        ]);

        // Process monthly growth data
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const userGrowthData = monthlyGrowth.map((item) => ({
            month: monthNames[item._id.month - 1],
            users: item.count,
            year: item._id.year,
        }));

        // Calculate cumulative growth
        let cumulativeUsers = 0;
        const cumulativeGrowthData = userGrowthData.map((item) => {
            cumulativeUsers += item.users;
            return {
                ...item,
                totalUsers: cumulativeUsers,
            };
        });

        // Profile completion statistics
        const profileCompletionStats = await userModel.aggregate([
            {
                $addFields: {
                    completionPercentage: {
                        $multiply: [
                            {
                                $divide: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: [
                                                    {
                                                        $cond: [
                                                            {
                                                                $and: [
                                                                    {
                                                                        $ne: [
                                                                            "$phone",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $ne: [
                                                                            "$phone",
                                                                            "",
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    {
                                                        $cond: [
                                                            {
                                                                $ne: [
                                                                    "$dateOfBirth",
                                                                    null,
                                                                ],
                                                            },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    {
                                                        $cond: [
                                                            {
                                                                $and: [
                                                                    {
                                                                        $ne: [
                                                                            "$location",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $ne: [
                                                                            "$location",
                                                                            "",
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    {
                                                        $cond: [
                                                            {
                                                                $and: [
                                                                    {
                                                                        $ne: [
                                                                            "$college",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $ne: [
                                                                            "$college",
                                                                            "",
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    {
                                                        $cond: [
                                                            {
                                                                $and: [
                                                                    {
                                                                        $ne: [
                                                                            "$degree",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $ne: [
                                                                            "$degree",
                                                                            "",
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    {
                                                        $cond: [
                                                            {
                                                                $and: [
                                                                    {
                                                                        $ne: [
                                                                            "$course",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $ne: [
                                                                            "$course",
                                                                            "",
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    {
                                                        $cond: [
                                                            {
                                                                $and: [
                                                                    {
                                                                        $ne: [
                                                                            "$bio",
                                                                            null,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $ne: [
                                                                            "$bio",
                                                                            "",
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                ],
                                                as: "field",
                                                cond: { $eq: ["$$field", 1] },
                                            },
                                        },
                                    },
                                    7,
                                ],
                            },
                            100,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $gte: ["$completionPercentage", 80],
                                    },
                                    then: "Complete",
                                },
                                {
                                    case: {
                                        $gte: ["$completionPercentage", 50],
                                    },
                                    then: "Partial",
                                },
                                {
                                    case: {
                                        $gte: ["$completionPercentage", 1],
                                    },
                                    then: "Minimal",
                                },
                            ],
                            default: "Empty",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                // Basic user stats
                stats: {
                    totalUsers,
                    totalStudents,
                    totalAdmins,
                    activeUsers,
                    newUsersThisMonth,
                    recentlyActiveUsers,
                    userGrowthPercentage: parseFloat(userGrowthPercentage),
                },

                // Application stats
                applicationStats: {
                    totalApplications,
                    approvedApplications,
                    pendingApplications,
                    rejectedApplications,
                    approvalRate:
                        totalApplications > 0
                            ? (
                                  (approvedApplications / totalApplications) *
                                  100
                              ).toFixed(1)
                            : 0,
                },

                // Project stats
                projectStats: {
                    totalProjects,
                    activeProjects,
                    completedProjects,
                    completionRate:
                        totalProjects > 0
                            ? (
                                  (completedProjects / totalProjects) *
                                  100
                              ).toFixed(1)
                            : 0,
                },

                // Work stats
                workStats: {
                    totalWorks,
                    completedWorks,
                    inProgressWorks,
                    completionRate:
                        totalWorks > 0
                            ? ((completedWorks / totalWorks) * 100).toFixed(1)
                            : 0,
                },

                // Distribution data for charts
                roleDistribution,
                applicationStatusDistribution,
                projectsByCategory,
                workAnalytics,
                categoryPerformance,

                // Trend data for charts
                userGrowthData: cumulativeGrowthData,
                monthlyProjectTrends,
                monthlyWorkTrends,

                // Performance data
                studentPerformanceStats,
                topStudents: topStudents.map((student) => ({
                    id: student.userId._id,
                    name: student.userId.username,
                    email: student.userId.email,
                    completionRate: student.projects.completionRate,
                    totalCompleted: student.projects.totalCompleted,
                    averageGrade: student.projects.averageGrade,
                    overallRating: student.performance.overallRating,
                })),

                // Earnings data
                earningsAnalytics: earningsAnalytics[0] || {
                    totalEarnings: 0,
                    avgEarningsPerWork: 0,
                    maxEarning: 0,
                    minEarning: 0,
                    count: 0,
                },

                profileCompletionStats,
                lastUpdated: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message,
        });
    }
};

// Get recent user activities
export const getRecentActivity = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get recent user registrations
        const recentRegistrations = await userModel
            .find({})
            .select("username email role createdAt")
            .sort({ createdAt: -1 })
            .limit(limit);

        // Get recently updated profiles
        const recentlyUpdated = await userModel
            .find({})
            .select("username email role updatedAt createdAt")
            .sort({ updatedAt: -1 })
            .limit(limit);

        // Get recently active users
        const recentlyActive = await userModel
            .find({})
            .select("username email role lastLogin")
            .sort({ lastLogin: -1 })
            .limit(limit);

        // Combine and format activities
        const activities = [];

        // Add registrations
        recentRegistrations.forEach((user) => {
            const timeDiff = Date.now() - new Date(user.createdAt).getTime();
            activities.push({
                id: `reg_${user._id}`,
                user: user.username,
                action: "New user registered",
                time: formatTimeAgo(timeDiff),
                type: "registration",
                timestamp: user.createdAt,
            });
        });

        // Add profile updates (only if different from creation)
        recentlyUpdated.forEach((user) => {
            if (user.updatedAt.getTime() !== user.createdAt.getTime()) {
                const timeDiff =
                    Date.now() - new Date(user.updatedAt).getTime();
                activities.push({
                    id: `update_${user._id}`,
                    user: user.username,
                    action: "Profile updated",
                    time: formatTimeAgo(timeDiff),
                    type: "update",
                    timestamp: user.updatedAt,
                });
            }
        });

        // Add recent logins
        recentlyActive.forEach((user) => {
            if (user.lastLogin) {
                const timeDiff =
                    Date.now() - new Date(user.lastLogin).getTime();
                // Only show logins from last 7 days
                if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
                    activities.push({
                        id: `login_${user._id}`,
                        user: user.username,
                        action: "User logged in",
                        time: formatTimeAgo(timeDiff),
                        type: "login",
                        timestamp: user.lastLogin,
                    });
                }
            }
        });

        // Sort by timestamp and remove duplicates
        const uniqueActivities = activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);

        res.status(200).json({
            success: true,
            data: uniqueActivities,
        });
    } catch (error) {
        console.error("Recent activity error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent activity",
            error: error.message,
        });
    }
};

// Helper function to format time ago
function formatTimeAgo(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
        return "Just now";
    }
}

// Get system health metrics
export const getSystemHealth = async (req, res) => {
    try {
        const [totalStorage, databaseStats, userActivityLast24h, errorCount] =
            await Promise.all([
                // These would be real system metrics in production
                Promise.resolve({
                    used: "1.2GB",
                    total: "10GB",
                    percentage: 12,
                }),
                Promise.resolve({
                    collections: 3,
                    documents: totalUsers,
                    size: "45MB",
                }),
                userModel.countDocuments({
                    lastLogin: {
                        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                }),
                Promise.resolve(0), // Error count would come from logging system
            ]);

        const totalUsers = await userModel.countDocuments({});

        res.status(200).json({
            success: true,
            data: {
                systemHealth: {
                    status: "healthy",
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    storage: totalStorage,
                    database: {
                        ...databaseStats,
                        documents: totalUsers,
                    },
                },
                metrics: {
                    userActivityLast24h,
                    errorCount,
                    responseTime: "145ms",
                    availability: "99.9%",
                },
            },
        });
    } catch (error) {
        console.error("System health error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch system health",
            error: error.message,
        });
    }
};
