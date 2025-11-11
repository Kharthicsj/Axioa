import React, { createContext, useContext, useEffect, useState } from "react";
import {
    isAuthenticated,
    getUserData,
    setUserData,
    logout as authLogout,
} from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated on app load
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        setIsLoading(true);
        try {
            if (isAuthenticated()) {
                const userData = getUserData();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData, token) => {
        // Map legacy fields to new structure for backward compatibility
        const mappedUser = {
            ...userData,
            name: userData.name || userData.username,
            profilePicture: userData.profilePicture || userData.profilepic,
            location: userData.location || userData.city,
        };
        setUser(mappedUser);

        // Also store user data in localStorage
        try {
            setUserData(mappedUser);
            console.log("Stored user data on login:", mappedUser);
        } catch (error) {
            console.error("Failed to store user data on login:", error);
        }
        // Token is already stored by the login components
    };

    const logout = () => {
        authLogout();
        setUser(null);
    };

    const updateUser = (userData) => {
        // Map legacy fields to new structure for backward compatibility
        const mappedUser = {
            ...userData,
            name: userData.name || userData.username,
            profilePicture: userData.profilePicture || userData.profilepic,
            location: userData.location || userData.city,
        };
        setUser(mappedUser);

        // Also update localStorage to persist the changes
        try {
            setUserData(mappedUser);
            console.log("Updated user data in localStorage:", mappedUser);
        } catch (error) {
            console.error("Failed to update localStorage:", error);
        }
    };

    const value = {
        user,
        loading: isLoading, // Add loading as an alias for consistency
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthContext;
