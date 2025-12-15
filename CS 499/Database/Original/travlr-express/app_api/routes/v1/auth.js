/**
 * Authentication Routes (API v1)
 * @module routes/v1/auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const { authValidation } = require('../../middleware/validation');
const { authLimiter } = require('../../middleware/rateLimiter');
const { authenticate } = require('../../middleware/auth');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, authValidation.register, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, authValidation.login, authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refresh);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
