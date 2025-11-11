import User from "../../models/User.js";

// Get all users with filtering and pagination
const getAllUsers = async (req, res) => {
  try {
    const {
      role,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    let query = {};

    // Filter by role
    if (role && role !== "all") {
      query.role = role;
    }

    // Filter by status (active/inactive)
    if (status && status !== "all") {
      query.isActive = status === "active";
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { college: searchRegex },
        { location: searchRegex },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with sorting and pagination
    const users = await User.find(query)
      .select("-password") // Exclude password field
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    // Transform data for frontend
    const transformedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      college: user.college || "Not specified",
      degree: user.degree || "Not specified",
      course: user.course || "Not specified",
      year: user.year || "Not specified",
      location: user.location || "Not specified",
      phone: user.phone || "Not provided",
      joinedDate: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive,
      profileCompletion: user.profileCompletion || 0,
      profilePicture: user.profilePicture || user.profilepic || null,
      bio: user.bio || "",
      skills: user.skills || [],
      socialLinks: user.socialLinks || {},
      emailNotifications: user.emailNotifications,
      marketingEmails: user.marketingEmails,
    }));

    // Calculate statistics
    const allUsers = await User.find({}).select("role isActive");
    const stats = {
      total: allUsers.length,
      admins: allUsers.filter((u) => u.role === "admin").length,
      students: allUsers.filter((u) => u.role === "student").length,
      regularUsers: allUsers.filter((u) => u.role === "user").length,
      active: allUsers.filter((u) => u.isActive).length,
      inactive: allUsers.filter((u) => !u.isActive).length,
    };

    res.json({
      error: false,
      success: true,
      message: "Users retrieved successfully",
      data: {
        users: transformedUsers,
        stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / parseInt(limit)),
          totalUsers,
          hasNext: skip + users.length < totalUsers,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to retrieve users",
      details: error.message,
    });
  }
};

// Get single user details
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    // Transform user data
    const transformedUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      college: user.college || "Not specified",
      degree: user.degree || "Not specified",
      course: user.course || "Not specified",
      year: user.year || "Not specified",
      location: user.location || "Not specified",
      phone: user.phone || "Not provided",
      dateOfBirth: user.dateOfBirth || null,
      joinedDate: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive,
      profileCompletion: user.profileCompletion || 0,
      profilePicture: user.profilePicture || user.profilepic || null,
      bio: user.bio || "",
      skills: user.skills || [],
      socialLinks: user.socialLinks || {},
      emailNotifications: user.emailNotifications,
      marketingEmails: user.marketingEmails,
    };

    res.json({
      error: false,
      success: true,
      message: "User details retrieved successfully",
      data: transformedUser,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to retrieve user details",
      details: error.message,
    });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated through this endpoint
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Handle "Not specified" values by converting them to empty strings
    if (updateData.year === "Not specified") {
      updateData.year = "";
    }
    if (updateData.college === "Not specified") {
      updateData.college = "";
    }
    if (updateData.degree === "Not specified") {
      updateData.degree = "";
    }
    if (updateData.course === "Not specified") {
      updateData.course = "";
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    // Update user
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    await user.save();

    res.json({
      error: false,
      success: true,
      message: "User updated successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to update user",
      details: error.message,
    });
  }
};

// Toggle user status (active/inactive)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.userId;

    // Prevent admin from deactivating themselves
    if (id === currentUserId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Cannot change your own status",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    // Toggle status
    user.isActive = !user.isActive;
    await user.save();

    res.json({
      error: false,
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      data: {
        id: user._id,
        username: user.username,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to toggle user status",
      details: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.userId;

    // Prevent admin from deleting themselves
    if (id === currentUserId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      error: false,
      success: true,
      message: "User deleted successfully",
      data: {
        id: id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to delete user",
      details: error.message,
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const currentUserId = req.user.userId;

    // Validate role
    if (!["user", "student", "admin"].includes(role)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Invalid role specified",
      });
    }

    // Prevent admin from changing their own role
    if (id === currentUserId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Cannot change your own role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      error: false,
      success: true,
      message: "User role updated successfully",
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to update user role",
      details: error.message,
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const users = await User.find({}).select("role isActive createdAt");

    // Calculate various statistics
    const stats = {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      students: users.filter((u) => u.role === "student").length,
      regularUsers: users.filter((u) => u.role === "user").length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,

      // Monthly registrations for the last 6 months
      monthlyRegistrations: await getMonthlyRegistrations(),
    };

    res.json({
      error: false,
      success: true,
      message: "User statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to retrieve user statistics",
      details: error.message,
    });
  }
};

// Helper function to get monthly registrations
const getMonthlyRegistrations = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
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
  ]);

  return monthlyStats.map((stat) => ({
    year: stat._id.year,
    month: stat._id.month,
    count: stat.count,
  }));
};

export {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  updateUserRole,
  getUserStats,
};
