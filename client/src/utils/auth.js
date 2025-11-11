// Authentication utility functions for managing JWT tokens and user sessions

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

/**
 * Store user data in localStorage
 * @param {object} userData - User information object
 */
export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
  } else {
    localStorage.removeItem('userData')
  }
}

/**
 * Get user data from localStorage
 * @returns {object|null} User data object or null if not found
 */
export const getUserData = () => {
  const userData = localStorage.getItem('userData')
  return userData ? JSON.parse(userData) : null
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getAuthToken()
  if (!token) return false
  
  try {
    // Check if token is expired
    const tokenData = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    
    if (tokenData.exp < currentTime) {
      // Token is expired, remove it
      logout()
      return false
    }
    
    return true
  } catch (error) {
    // Invalid token format
    logout()
    return false
  }
}

/**
 * Logout user by clearing all stored data
 */
export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
}

/**
 * Get authorization headers for API requests
 * @returns {object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Decode JWT token to get user information
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token data or null if invalid
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}