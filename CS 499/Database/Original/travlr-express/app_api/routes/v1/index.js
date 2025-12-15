/**
 * API v1 Routes
 * Main router for API version 1
 * @module routes/v1
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const tripRoutes = require('./trips');
const roomRoutes = require('./rooms');
const mealRoutes = require('./meals');
const newsRoutes = require('./news');

// Mount routes
router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/rooms', roomRoutes);
router.use('/meals', mealRoutes);
router.use('/news', newsRoutes);

/**
 * API v1 health check
 * @route GET /api/v1/health
 * @access Public
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Travlr API v1 is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
