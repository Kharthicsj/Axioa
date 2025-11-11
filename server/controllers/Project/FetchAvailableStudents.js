import StudentPerformance from "../../models/StudentPerformance.js";
import User from "../../models/User.js";
import mongoose from "mongoose";

/**
 * Fetch all available students with their performance data
 * GET /api/students/available
 */
export const fetchAvailableStudents = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Authentication required to access student list",
            });
        }

        const {
            service,
            skills,
            minRating,
            maxRating,
            experience,
            location,
            availability,
            sortBy,
            sortOrder,
            search,
            page = 1,
            limit = 20,
        } = req.query;

        // Build the aggregation pipeline
        const pipeline = [
            // Match only active students
            {
                $match: {
                    status: "active",
                },
            },
            // Lookup user data
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            // Unwind user info
            {
                $unwind: "$userInfo",
            },
            // Match only students with 'student' role and no projects in progress, excluding current user
            {
                $match: {
                    "userInfo.role": "student",
                    "userInfo.isActive": true,
                    "projects.totalInProgress": { $lt: 1 }, // Only students with 0 projects in progress
                    "userInfo._id": {
                        $ne: new mongoose.Types.ObjectId(req.user.userId),
                    }, // Exclude current logged-in user
                },
            },
            // Project the required fields
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    name: "$userInfo.username",
                    email: "$userInfo.email",
                    profilePicture: "$userInfo.profilePicture",
                    bio: "$userInfo.bio",
                    phone: "$userInfo.phone",
                    location: "$userInfo.location",
                    city: "$userInfo.city",
                    college: "$userInfo.college",
                    degree: "$userInfo.degree",
                    course: "$userInfo.course",
                    year: "$userInfo.year",
                    skills: "$userInfo.skills",
                    socialLinks: "$userInfo.socialLinks",

                    // Performance metrics
                    overallRating: "$performance.overallRating",
                    technicalSkills: "$performance.technicalSkills",
                    communicationSkills: "$performance.communicationSkills",
                    problemSolving: "$performance.problemSolving",
                    teamwork: "$performance.teamwork",
                    punctuality: "$performance.punctuality",
                    qualityOfWork: "$performance.qualityOfWork",

                    // Project statistics
                    totalProjects: "$projects.totalAssigned",
                    completedProjects: "$projects.totalCompleted",
                    inProgressProjects: "$projects.totalInProgress",
                    completionRate: "$projects.completionRate",
                    averageGrade: "$projects.averageGrade",

                    // Reviews
                    reviews: "$reviews",
                    totalReviews: { $size: "$reviews" },

                    // Engagement
                    lastActive: "$engagement.lastActive",
                    totalLoginDays: "$engagement.totalLoginDays",
                    attendanceRate: "$engagement.attendanceRate",

                    // Achievements and level
                    achievements: "$achievements",
                    totalPoints: "$totalPoints",
                    level: "$level",

                    // Status
                    status: "$status",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                },
            },
        ];

        // Add search filter if provided
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { college: { $regex: search, $options: "i" } },
                        { course: { $regex: search, $options: "i" } },
                        { skills: { $in: [new RegExp(search, "i")] } },
                    ],
                },
            });
        }

        // Add skills filter if provided
        if (skills) {
            const skillsArray = Array.isArray(skills)
                ? skills
                : skills.split(",");
            pipeline.push({
                $match: {
                    skills: {
                        $in: skillsArray.map((skill) => new RegExp(skill, "i")),
                    },
                },
            });
        }

        // Add rating filter if provided
        if (minRating || maxRating) {
            const ratingMatch = {};
            if (minRating) ratingMatch.$gte = parseFloat(minRating);
            if (maxRating) ratingMatch.$lte = parseFloat(maxRating);
            pipeline.push({
                $match: {
                    overallRating: ratingMatch,
                },
            });
        }

        // Add location filter if provided
        if (location) {
            pipeline.push({
                $match: {
                    location: { $regex: location, $options: "i" },
                },
            });
        }

        // Add sorting
        const sortStage = {};
        switch (sortBy) {
            case "rating":
                sortStage.overallRating = sortOrder === "desc" ? -1 : 1;
                break;
            case "completionRate":
                sortStage.completionRate = sortOrder === "desc" ? -1 : 1;
                break;
            case "averageGrade":
                sortStage.averageGrade = sortOrder === "desc" ? -1 : 1;
                break;
            case "totalPoints":
                sortStage.totalPoints = sortOrder === "desc" ? -1 : 1;
                break;
            case "lastActive":
                sortStage.lastActive = sortOrder === "desc" ? -1 : 1;
                break;
            case "name":
                sortStage.name = sortOrder === "desc" ? -1 : 1;
                break;
            case "createdAt":
                sortStage.createdAt = sortOrder === "desc" ? -1 : 1;
                break;
            default:
                sortStage.createdAt = -1; // Default sort by newest first
        }
        pipeline.push({ $sort: sortStage });

        // Add pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: parseInt(limit) });

        // Execute the aggregation
        const students = await StudentPerformance.aggregate(pipeline);

        // Get total count for pagination
        const totalCountPipeline = pipeline.slice(0, -2); // Remove skip and limit
        totalCountPipeline.push({ $count: "total" });
        const totalCountResult = await StudentPerformance.aggregate(
            totalCountPipeline
        );
        const totalStudents =
            totalCountResult.length > 0 ? totalCountResult[0].total : 0;

        // Transform data using only actual database values
        const transformedStudents = students.map((student) => ({
            id: student._id,
            userId: student.userId,
            name: student.name,
            email: student.email,

            // Use actual profile picture data from user model
            profilePicture: student.profilePicture || null,

            // Contact and location info from user model
            phone: student.phone,
            bio: student.bio,
            location: student.location,
            city: student.city,

            // Academic info from user model
            college: student.college,
            degree: student.degree,
            course: student.course,
            year: student.year,
            skills: student.skills || [],
            socialLinks: student.socialLinks,

            // Performance data from StudentPerformance model
            rating: student.overallRating || 0,
            reviews: student.totalReviews || 0,
            specialization: student.skills?.slice(0, 3) || [],

            // Project statistics (only if available)
            completionRate: student.completionRate || 0,
            averageGrade: student.averageGrade || 0,
            attendanceRate: student.attendanceRate || 100,

            completedProjects: student.completedProjects || 0,
            totalPoints: student.totalPoints || 0,
            description: student.bio,

            // Calculate derived fields only when needed
            availability: calculateAvailability(
                student.lastActive,
                student.inProgressProjects
            ),
            badge: calculateBadge(
                student.overallRating,
                student.completedProjects,
                student.level
            ),

            // Additional performance data
            performanceMetrics: {
                technicalSkills: student.technicalSkills || 0,
                communicationSkills: student.communicationSkills || 0,
                problemSolving: student.problemSolving || 0,
                teamwork: student.teamwork || 0,
                punctuality: student.punctuality || 0,
                qualityOfWork: student.qualityOfWork || 0,
            },

            // Timestamps
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,

            projectStats: {
                total: student.totalProjects || 0,
                completed: student.completedProjects || 0,
                inProgress: student.inProgressProjects || 0,
                completionRate: student.completionRate || 0,
                averageGrade: student.averageGrade || 0,
            },

            engagement: {
                lastActive: student.lastActive,
                totalLoginDays: student.totalLoginDays || 0,
                attendanceRate: student.attendanceRate || 100,
            },

            achievements: student.achievements || [],
            level: student.level,
        }));

        // Return response
        res.status(200).json({
            error: false,
            success: true,
            message: "Available students fetched successfully",
            data: {
                students: transformedStudents,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalStudents / parseInt(limit)),
                    totalStudents,
                    limit: parseInt(limit),
                    hasNextPage:
                        skip + transformedStudents.length < totalStudents,
                    hasPrevPage: parseInt(page) > 1,
                },
                filters: {
                    service,
                    skills,
                    minRating,
                    maxRating,
                    experience,
                    location,
                    availability,
                    sortBy,
                    sortOrder,
                    search,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching available students:", error);
        res.status(500).json({
            error: true,
            success: false,
            message: "Internal server error while fetching students",
            details: error.message,
        });
    }
};

// Helper functions
const calculateAvailability = (lastActive, inProgressProjects) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffHours = Math.abs(now - lastActiveDate) / 36e5;

    if (diffHours <= 2 && inProgressProjects < 3) return "Available now";
    if (diffHours <= 24 && inProgressProjects < 5) return "Available today";
    if (inProgressProjects >= 5) return "Busy";
    return "Available soon";
};

const calculateBadge = (rating, completedProjects, level) => {
    if (rating >= 4.8 && completedProjects >= 20) return "Top Rated";
    if (level === "Expert") return "Expert";
    if (rating >= 4.5 && completedProjects >= 10) return "Verified";
    if (completedProjects >= 5) return "Rising Talent";
    return "New";
};

export default { fetchAvailableStudents };
