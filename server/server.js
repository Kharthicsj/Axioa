import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Create upload directories
ensureDirectoryExists("uploads/profiles");
ensureDirectoryExists("uploads/documents");

app.use(
    cors({
        origin: ["http://localhost:5173", "https://axioa-j1kn.onrender.com"],
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Set timeout for requests (especially file uploads)
app.use((req, res, next) => {
    // Increase timeout for file upload routes
    if (
        req.url.includes("/submit-payment-details") ||
        req.url.includes("/complete-work")
    ) {
        req.setTimeout(120000); // 2 minutes for file uploads
        res.setTimeout(120000); // 2 minutes for file uploads
    }
    next();
});

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

app.use(router);

mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
