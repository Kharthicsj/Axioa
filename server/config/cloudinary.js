import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    auth_token: {
        key: process.env.CLOUDINARY_API_KEY,
        duration: 3600,
    },
    timeout: 60000, // 60 second timeout for uploads
});

// Storage configuration for work deliverables
const workDeliverableStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const workId = req.params.workId || "unknown";
        const timestamp = Date.now();
        const originalName = file.originalname.split(".")[0];
        return {
            folder: "axion/work-deliverables",
            resource_type: "auto",
            public_id: `work-${workId}-${originalName}-${timestamp}`,
            access_mode: "public", // Ensure public access
            moderation: "manual", // Disable auto-moderation
            quality_analysis: false, // Disable quality analysis that might trigger blocks
        };
    },
});

// Storage configuration for payment proofs
const paymentProofStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const workId = req.params.workId || "unknown";
        const timestamp = Date.now();
        const type = req.body.proofType || "payment";
        return {
            folder: "axion/payment-proofs",
            resource_type: "image",
            public_id: `${type}-proof-${workId}-${timestamp}`,
        };
    },
});

// Storage configuration for UPI QR codes
const upiQrStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const workId = req.params.workId || "unknown";
        const timestamp = Date.now();
        return {
            folder: "axion/upi-qr-codes",
            resource_type: "image",
            public_id: `upi-qr-${workId}-${timestamp}`,
        };
    },
});

// Multer configurations
export const uploadWorkDeliverables = multer({
    storage: workDeliverableStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file types
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "application/zip",
            "application/x-rar-compressed",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only documents, images, and archives are allowed."
                ),
                false
            );
        }
    },
});

export const uploadPaymentProof = multer({
    storage: paymentProofStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only images are allowed for payment proofs."
                ),
                false
            );
        }
    },
});

export const uploadUpiQr = multer({
    storage: upiQrStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only images are allowed for UPI QR codes."
                ),
                false
            );
        }
    },
});

// Function to delete files from cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Error deleting from cloudinary:", error);
        throw error;
    }
};

export default cloudinary;
