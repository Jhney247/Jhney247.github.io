/**
 * Trip Routes (API v1)
 * @module routes/v1/trips
 */

const express = require('express');
const router = express.Router();
const tripController = require('../../controllers/trips');
const { tripValidation } = require('../../middleware/validation');
const { authenticate, authorize } = require('../../middleware/auth');
const { writeLimiter } = require('../../middleware/rateLimiter');

/**
 * @route   GET /api/v1/trips
 * @desc    Get all trips
 * @access  Public
 */
router.get('/', tripController.tripsList);

/**
 * @route   GET /api/v1/trips/:tripCode
 * @desc    Get trip by code
 * @access  Public
 */
router.get('/:tripCode', tripController.tripsFindByCode);

/**
 * @route   POST /api/v1/trips
 * @desc    Create a new trip
 * @access  Private (Admin only)
 */
router.post(
    '/',
    authenticate,
    authorize('admin'),
    writeLimiter,
    tripValidation.create,
    tripController.tripsAddTrip
);

/**
 * @route   PUT /api/v1/trips/:tripCode
 * @desc    Update trip by code
 * @access  Private (Admin only)
 */
router.put(
    '/:tripCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    tripValidation.update,
    tripController.tripsUpdateTrip
);

/**
 * @route   DELETE /api/v1/trips/:tripCode
 * @desc    Delete trip by code
 * @access  Private (Admin only)
 */
router.delete(
    '/:tripCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    tripController.tripsDeleteTrip
);

module.exports = router;
