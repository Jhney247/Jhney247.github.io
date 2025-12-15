/**
 * Room Controller
 * Handles HTTP requests for room-related operations
 * @module controllers/rooms
 */

const roomService = require('../services/roomService');
const { asyncHandler, notFound } = require('../middleware/errorHandler');

/**
 * Get all rooms
 * @route GET /api/v1/rooms
 * @access Public
 */
const roomsList = asyncHandler(async (req, res) => {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
});

/**
 * Get a single room by code
 * @route GET /api/v1/rooms/:roomCode
 * @access Public
 */
const roomsFindByCode = asyncHandler(async (req, res) => {
    const room = await roomService.getRoomByCode(req.params.roomCode);
    
    if (!room) {
        throw notFound('Room');
    }
    
    res.status(200).json(room);
});

/**
 * Create a new room
 * @route POST /api/v1/rooms
 * @access Private (Admin only)
 */
const roomsAddRoom = asyncHandler(async (req, res) => {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
});

/**
 * Update an existing room
 * @route PUT /api/v1/rooms/:roomCode
 * @access Private (Admin only)
 */
const roomsUpdateRoom = asyncHandler(async (req, res) => {
    const room = await roomService.updateRoom(req.params.roomCode, req.body);
    
    if (!room) {
        throw notFound('Room');
    }
    
    res.status(200).json(room);
});

/**
 * Delete a room
 * @route DELETE /api/v1/rooms/:roomCode
 * @access Private (Admin only)
 */
const roomsDeleteRoom = asyncHandler(async (req, res) => {
    const room = await roomService.deleteRoom(req.params.roomCode);
    
    if (!room) {
        throw notFound('Room');
    }
    
    res.status(200).json({ 
        message: 'Room deleted successfully',
        room: room 
    });
});

module.exports = {
    roomsList,
    roomsFindByCode,
    roomsAddRoom,
    roomsUpdateRoom,
    roomsDeleteRoom
};
