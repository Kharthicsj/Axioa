import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/profiles/';
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `profile-${req.user.userId}-${uniqueSuffix}${fileExtension}`);
    }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Create multer upload middleware for profile pictures
export const uploadProfilePicture = multer({
    storage: profileStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file
    }
}).single('profilePicture');

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: true,
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: true,
                success: false,
                message: 'Too many files. Only one file is allowed.'
            });
        } else {
            return res.status(400).json({
                error: true,
                success: false,
                message: 'File upload error: ' + err.message
            });
        }
    } else if (err) {
        return res.status(400).json({
            error: true,
            success: false,
            message: err.message || 'File upload failed'
        });
    }
    next();
};

// General file storage for documents
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/documents/';
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `doc-${req.user.userId}-${uniqueSuffix}${fileExtension}`);
    }
});

// File filter for documents
const documentFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed!'), false);
    }
};

// Create multer upload middleware for documents
export const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for documents
        files: 1
    }
}).single('document');