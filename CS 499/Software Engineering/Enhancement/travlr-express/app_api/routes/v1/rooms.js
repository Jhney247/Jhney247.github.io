/**
 * Room Routes (API v1)
 * @module routes/v1/rooms
 */

const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/rooms');
const { roomValidation } = require('../../middleware/validation');
const { authenticate, authorize } = require('../../middleware/auth');
const { writeLimiter } = require('../../middleware/rateLimiter');

/**
 * @route   GET /api/v1/rooms
 * @desc    Get all rooms
 * @access  Public
 */
router.get('/', roomController.roomsList);

/**
 * @route   GET /api/v1/rooms/:roomCode
 * @desc    Get room by code
 * @access  Public
 */
router.get('/:roomCode', roomController.roomsFindByCode);

/**
 * @route   POST /api/v1/rooms
 * @desc    Create a new room
 * @access  Private (Admin only)
 */
router.post(
    '/',
    authenticate,
    authorize('admin'),
    writeLimiter,
    roomValidation.create,
    roomController.roomsAddRoom
);

/**
 * @route   PUT /api/v1/rooms/:roomCode
 * @desc    Update room by code
 * @access  Private (Admin only)
 */
router.put(
    '/:roomCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    roomValidation.update,
    roomController.roomsUpdateRoom
);

/**
 * @route   DELETE /api/v1/rooms/:roomCode
 * @desc    Delete room by code
 * @access  Private (Admin only)
 */
router.delete(
    '/:roomCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    roomController.roomsDeleteRoom
);

module.exports = router;
