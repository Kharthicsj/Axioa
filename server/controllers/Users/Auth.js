import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../models/User.js";
import nodemailer from "nodemailer";

async function Signup(req, res) {
    try {
        const { username, email, password, profilePicture, college, city } =
            req.body;

        const isExistingUser = await userModel.findOne({ email: email });

        if (isExistingUser) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User Already Exists",
            });
        } else {
            const hashedPassword = await bcryptjs.hash(password, 12);
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                profilePicture: profilePicture || null,
                college,
                city,
                role: "user", // Default role assignment
            });
            const result = await newUser.save();

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: result._id,
                    email: result.email,
                    username: result.username,
                    role: result.role,
                },
                process.env.JWT_SECRET || "fallback_secret_key",
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                error: false,
                success: true,
                message: "User Account Created Successfully",
                token,
                user: {
                    id: result._id,
                    username: result.username,
                    email: result.email,
                    profilePicture: result.profilePicture,
                    college: result.college,
                    city: result.city,
                    location: result.location || result.city,
                    role: result.role,
                    bio: result.bio || "",
                    phone: result.phone || "",
                    dateOfBirth: result.dateOfBirth,
                    course: result.course || "",
                    degree: result.degree || "",
                    year: result.year || "",
                    skills: result.skills || [],
                    socialLinks: result.socialLinks || {
                        linkedin: "",
                        github: "",
                    },
                    emailNotifications: result.emailNotifications,
                    marketingEmails: result.marketingEmails,
                    profileCompletion: result.profileCompletion,
                },
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: "Internal Server Error code 500",
        });
    }
}

async function Signin(req, res) {
    try {
        const { email, password } = req.body;
        const isRegisteredUser = await userModel.findOne({ email: email });

        if (!isRegisteredUser) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User Account does not exist",
            });
        }

        const registeredPassword = isRegisteredUser.password;
        const validate = await bcryptjs.compare(password, registeredPassword);

        if (validate) {
            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: isRegisteredUser._id,
                    email: isRegisteredUser.email,
                    username: isRegisteredUser.username,
                    role: isRegisteredUser.role,
                },
                process.env.JWT_SECRET || "fallback_secret_key",
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                error: false,
                success: true,
                message: "Login Successful",
                token,
                user: {
                    id: isRegisteredUser._id,
                    username: isRegisteredUser.username,
                    email: isRegisteredUser.email,
                    profilePicture: isRegisteredUser.profilePicture,
                    college: isRegisteredUser.college || "",
                    city: isRegisteredUser.city || "",
                    location:
                        isRegisteredUser.location ||
                        isRegisteredUser.city ||
                        "",
                    role: isRegisteredUser.role,
                    bio: isRegisteredUser.bio || "",
                    phone: isRegisteredUser.phone || "",
                    dateOfBirth: isRegisteredUser.dateOfBirth,
                    course: isRegisteredUser.course || "",
                    degree: isRegisteredUser.degree || "",
                    year: isRegisteredUser.year || "",
                    skills: isRegisteredUser.skills || [],
                    socialLinks: isRegisteredUser.socialLinks || {
                        linkedin: "",
                        github: "",
                    },
                    emailNotifications: isRegisteredUser.emailNotifications,
                    marketingEmails: isRegisteredUser.marketingEmails,
                    profileCompletion: isRegisteredUser.profileCompletion,
                },
            });
        } else {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Incorrect Password",
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: "Internal Server Error",
        });
    }
}

// Get user profile
async function GetProfile(req, res) {
    try {
        const userId = req.user.userId;
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Profile retrieved successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                college: user.college || "",
                city: user.city || "",
                location: user.location || user.city || "",
                role: user.role,
                bio: user.bio || "",
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth,
                course: user.course || "",
                degree: user.degree || "",
                year: user.year || "",
                skills: user.skills || [],
                socialLinks: user.socialLinks || { linkedin: "", github: "" },
                emailNotifications: user.emailNotifications,
                marketingEmails: user.marketingEmails,
                profileCompletion: user.profileCompletion,
            },
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: "Internal Server Error",
        });
    }
}

// Update user profile
async function UpdateProfile(req, res) {
    try {
        const userId = req.user.userId;
        const updateData = { ...req.body };

        // Handle skills array
        if (updateData.skills && typeof updateData.skills === "string") {
            try {
                updateData.skills = JSON.parse(updateData.skills);
            } catch (e) {
                updateData.skills = updateData.skills
                    .split(",")
                    .map((skill) => skill.trim());
            }
        }

        // Handle social links
        if (
            updateData.socialLinks &&
            typeof updateData.socialLinks === "string"
        ) {
            try {
                updateData.socialLinks = JSON.parse(updateData.socialLinks);
            } catch (e) {
                // Handle individual social link fields
                const socialLinks = {};
                if (updateData.linkedin)
                    socialLinks.linkedin = updateData.linkedin;
                if (updateData.github) socialLinks.github = updateData.github;
                if (updateData.portfolio)
                    socialLinks.portfolio = updateData.portfolio;
                updateData.socialLinks = socialLinks;
            }
        }

        // Handle file upload for profile picture
        if (req.file) {
            updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
        }

        // Map frontend field names to database field names
        if (updateData.name) {
            updateData.username = updateData.name;
            delete updateData.name;
        }

        if (updateData.location) {
            updateData.city = updateData.location;
            // Keep location field as well for consistency
        }

        // Remove fields that shouldn't be updated this way
        delete updateData.password;
        delete updateData.email;
        delete updateData.role;

        const updatedUser = await userModel
            .findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true,
            })
            .select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                college: updatedUser.college || "",
                city: updatedUser.city || "",
                location: updatedUser.location || updatedUser.city || "",
                role: updatedUser.role,
                bio: updatedUser.bio || "",
                phone: updatedUser.phone || "",
                dateOfBirth: updatedUser.dateOfBirth,
                course: updatedUser.course || "",
                degree: updatedUser.degree || "",
                year: updatedUser.year || "",
                skills: updatedUser.skills || [],
                socialLinks: updatedUser.socialLinks || {
                    linkedin: "",
                    github: "",
                },
                emailNotifications: updatedUser.emailNotifications,
                marketingEmails: updatedUser.marketingEmails,
                profileCompletion: updatedUser.profileCompletion,
            },
        });
    } catch (err) {
        console.error("Profile update error:", err);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to update profile",
        });
    }
}

// Change password
async function ChangePassword(req, res) {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Current password and new password are required",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        // Verify current password
        const isValidPassword = await bcryptjs.compare(
            currentPassword,
            user.password
        );
        if (!isValidPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Hash new password
        const hashedNewPassword = await bcryptjs.hash(newPassword, 12);

        // Update password
        await userModel.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
        });

        return res.status(200).json({
            error: false,
            success: true,
            message: "Password changed successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: "Internal Server Error",
        });
    }
}

// Delete account
async function DeleteAccount(req, res) {
    try {
        const userId = req.user.userId;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Password is required to delete account",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        // Verify password
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Password is incorrect",
            });
        }

        // Delete user account
        await userModel.findByIdAndDelete(userId);

        return res.status(200).json({
            error: false,
            success: true,
            message: "Account deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: "Internal Server Error",
        });
    }
}

// Update account settings
async function UpdateSettings(req, res) {
    try {
        const userId = req.user.userId;
        const { emailNotifications, marketingEmails } = req.body;

        const updateData = {};
        if (typeof emailNotifications === "boolean") {
            updateData.emailNotifications = emailNotifications;
        }
        if (typeof marketingEmails === "boolean") {
            updateData.marketingEmails = marketingEmails;
        }

        const updatedUser = await userModel
            .findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true,
            })
            .select("-password");

        return res.status(200).json({
            error: false,
            success: true,
            message: "Settings updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: "Internal Server Error",
        });
    }
}

let generatedOtp = null;
let otpExpiration = null;

async function ForgotPasswordOTPController(req, res) {
    const { action } = req.query;

    try {
        if (action === "send") {
            const { email } = req.body;

            // Check if email is provided
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            // Fetch user from the database using the email
            const user = await userModel.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: "No user found with this email address" });
            }

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000);

            // Store the generated OTP globally and set expiration time
            generatedOtp = otp;
            otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

            // Create nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            // Prepare email content
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your OTP for Password Reset",
                html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2>Hi ${user.name},</h2>
            <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
            <h3 style="color: #e63946;">${otp}</h3>
            <p>This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Team</p>
          </div>
        `,
            };

            // Send OTP email
            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: "OTP sent successfully" });
        } else if (action === "validate") {
            const { otp } = req.body;

            // Check if the OTP exists and is not expired
            if (!generatedOtp) {
                return res.status(400).json({
                    message: "No OTP found. Please request a new OTP.",
                });
            }

            if (Date.now() > otpExpiration) {
                generatedOtp = null; // Clear expired OTP
                otpExpiration = null;
                return res.status(400).json({
                    message: "OTP has expired. Please request a new one.",
                });
            }

            // Validate the entered OTP
            if (otp === String(generatedOtp)) {
                generatedOtp = null; // Clear OTP after successful validation
                otpExpiration = null;
                return res.status(200).json({ message: "OTP is valid" });
            } else {
                return res
                    .status(400)
                    .json({ message: "Invalid OTP. Please try again." });
            }
        } else {
            return res
                .status(400)
                .json({ message: 'Invalid action. Use "send" or "validate".' });
        }
    } catch (error) {
        console.error("Error in ForgotPasswordOTPController:", error);
        return res
            .status(500)
            .json({ message: "An error occurred. Please try again later." });
    }
}

// Reset password with email and new password
async function ResetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Email and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found",
            });
        }

        // Hash new password
        const hashedNewPassword = await bcryptjs.hash(newPassword, 12);

        // Update password
        await userModel.findByIdAndUpdate(user._id, {
            password: hashedNewPassword,
        });

        return res.status(200).json({
            error: false,
            success: true,
            message: "Password reset successfully",
        });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Internal Server Error",
        });
    }
}

export {
    Signup,
    Signin,
    GetProfile,
    UpdateProfile,
    ChangePassword,
    DeleteAccount,
    UpdateSettings,
    ForgotPasswordOTPController,
    ResetPassword,
};
