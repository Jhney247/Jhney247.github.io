/**
 * Authentication Service Layer
 * Business logic for user authentication and authorization
 * @module services/authService
 */

const User = require('../models/user');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * @async
 * @function registerUser
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User full name
 * @param {string} userData.email - User email address
 * @param {string} userData.password - User password (plain text)
 * @param {string} [userData.role='user'] - User role (user or admin)
 * @returns {Promise<Object>} Object containing access token and refresh token
 * @throws {Error} Validation or database error
 */
const registerUser = async (userData) => {
    const user = new User({
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user'
    });
    
    await user.setPassword(userData.password);
    await user.save();
    
    const token = user.generateJWT();
    const refreshToken = user.generateRefreshToken();
    
    return { token, refreshToken };
};

/**
 * Authenticate user and generate tokens
 * @async
 * @function loginUser
 * @param {string} email - User email
 * @param {string} password - User password (plain text)
 * @returns {Promise<Object>} Object containing user data, access token and refresh token
 * @throws {Error} Authentication error or database error
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
        throw new Error('User not found');
    }
    
    const isValid = await user.validPassword(password);
    
    if (!isValid) {
        throw new Error('Invalid password');
    }
    
    const token = user.generateJWT();
    const refreshToken = user.generateRefreshToken();
    
    return { 
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token, 
        refreshToken 
    };
};

/**
 * Refresh access token using refresh token
 * @async
 * @function refreshAccessToken
 * @param {string} refreshToken - Valid refresh token
 * @returns {Promise<Object>} Object containing new access token
 * @throws {Error} Invalid or expired token error
 */
const refreshAccessToken = async (refreshToken) => {
    try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
        const decoded = jwt.verify(refreshToken, refreshSecret);
        
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        
        const user = await User.findById(decoded._id);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        const token = user.generateJWT();
        
        return { token };
    } catch (err) {
        throw new Error('Invalid or expired refresh token');
    }
};

/**
 * Get user by ID
 * @async
 * @function getUserById
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object (without sensitive data) or null
 * @throws {Error} Database error
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-hash -salt');
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    getUserById
};
