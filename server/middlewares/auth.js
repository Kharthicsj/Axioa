import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Access token required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
        
        // Check if user still exists
        const user = await userModel.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "User not found"
            });
        }

        // Add user info to request object
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Token expired"
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Invalid token"
            });
        } else {
            return res.status(500).json({
                error: true,
                success: false,
                message: "Internal Server Error"
            });
        }
    }
};

// Middleware to check if user has admin role
export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            error: true,
            success: false,
            message: "Admin access required"
        });
    }
};

// Middleware to check if user has student or admin role
export const requireStudentOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'student' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({
            error: true,
            success: false,
            message: "Student or Admin access required"
        });
    }
};

// Export default for backward compatibility
export default authenticateToken;