import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // Basic Information
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "student", "admin"],
        },

        // Profile Information
        profilePicture: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxlength: 500,
            default: "",
        },
        phone: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        location: {
            type: String,
            trim: true,
        },

        // Academic Information
        college: {
            type: String,
            trim: true,
        },
        degree: {
            type: String,
            trim: true,
        },
        course: {
            type: String,
            trim: true,
        },
        year: {
            type: String,
            enum: [
                "1st Year",
                "2nd Year",
                "3rd Year",
                "4th Year",
                "Graduate",
                "Post Graduate",
                "Not specified",
                "",
            ],
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        // Social Links
        socialLinks: {
            linkedin: {
                type: String,
                trim: true,
            },
            github: {
                type: String,
                trim: true,
            },
            portfolio: {
                type: String,
                trim: true,
            },
        },

        // Legacy fields (for backward compatibility)
        city: String,

        // Account Settings
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        marketingEmails: {
            type: Boolean,
            default: false,
        },

        // Timestamps
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // This adds createdAt and updatedAt automatically
    }
);

// Index for better query performance
// Note: email index is created automatically by unique: true
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

// Virtual for profile completion percentage
userSchema.virtual("profileCompletion").get(function () {
    const fields = [
        "phone",
        "dateOfBirth",
        "location",
        "college",
        "degree",
        "course",
        "bio",
    ];
    const completedFields = fields.filter(
        (field) => this[field] && this[field].toString().trim() !== ""
    );
    return Math.round((completedFields.length / fields.length) * 100);
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true });

const userModel = new mongoose.model("User", userSchema);
export default userModel;
