// Application configuration
const config = {
    // API Configuration
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",

    // App Configuration
    APP_NAME: import.meta.env.VITE_APP_NAME || "AXION",

    // Development/Production flags
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,

    // Other configuration can be added here
    // TIMEOUT: import.meta.env.VITE_TIMEOUT || 10000,
    // MAX_FILE_SIZE: import.meta.env.VITE_MAX_FILE_SIZE || 5242880, // 5MB
};

export default config;
