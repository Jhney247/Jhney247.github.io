/**
 * Main API Routes
 * Handles API versioning and route delegation
 * @module routes/index
 */

const express = require('express');
const router = express.Router();

// Import versioned routes
const v1Routes = require('./v1');

// Mount versioned routes
router.use('/v1', v1Routes);

// Default route - redirect to latest version
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Travlr API',
        currentVersion: 'v1',
        availableVersions: ['v1'],
        documentation: '/api-docs',
        endpoints: {
            v1: '/api/v1'
        }
    });
});

module.exports = router;