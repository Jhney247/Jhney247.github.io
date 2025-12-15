/**
 * Authentication Controller
 * Handles HTTP requests for user authentication and authorization
 * @module controllers/authentication
 */

const authService = require('../services/authService');
const { asyncHandler, badRequest, unauthorized } = require('../middleware/errorHandler');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    
    const { token, refreshToken } = await authService.registerUser({
        name,
        email,
        password,
        role
    });
    
    res.status(201).json({
        message: 'User registered successfully',
        token,
        refreshToken
    });
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const result = await authService.loginUser(email, password);
        
        res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken
        });
    } catch (err) {
        if (err.message === 'User not found' || err.message === 'Invalid password') {
            throw unauthorized('Invalid email or password');
        }
        throw err;
    }
});

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access Public
 */
const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        throw badRequest('Refresh token is required');
    }
    
    try {
        const { token } = await authService.refreshAccessToken(refreshToken);
        
        res.status(200).json({
            message: 'Token refreshed successfully',
            token
        });
    } catch (err) {
        throw unauthorized(err.message);
    }
});

/**
 * Get current user profile
 * @route GET /api/v1/auth/profile
 * @access Private
 */
const getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.auth._id);
    
    if (!user) {
        throw unauthorized('User not found');
    }
    
    res.status(200).json(user);
});

module.exports = {
    register,
    login,
    refresh,
    getProfile
};