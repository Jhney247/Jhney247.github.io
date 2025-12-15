/**
 * Room Service Layer
 * Business logic for room operations
 * @module services/roomService
 */

const Room = require('../models/room');
const { paginate } = require('./pagination');

/**
 * Get all rooms from database
 * @async
 * @function getAllRooms
 * @returns {Promise<Array>} Array of all rooms
 * @throws {Error} Database error
 */
const getAllRooms = async ({ limit = 20, cursor, search, onlyAvailable } = {}) => {
    const filter = {};

    if (onlyAvailable) {
        filter.available = true;
    }

    if (search) {
        filter.$text = { $search: search };
    }

    return paginate(Room, {
        filter,
        sort: { createdAt: -1 },
        limit,
        cursorField: 'createdAt',
        cursorValue: cursor
    });
};

/**
 * Get a single room by code
 * @async
 * @function getRoomByCode
 * @param {string} roomCode - Unique room code
 * @returns {Promise<Object|null>} Room object or null if not found
 * @throws {Error} Database error
 */
const getRoomByCode = async (roomCode) => {
    return await Room.findOne({ code: roomCode }).exec();
};

/**
 * Create a new room
 * @async
 * @function createRoom
 * @param {Object} roomData - Room data object
 * @returns {Promise<Object>} Created room object
 * @throws {Error} Validation or database error
 */
const createRoom = async (roomData) => {
    const room = new Room(roomData);
    return await room.save();
};

/**
 * Update an existing room by code
 * @async
 * @function updateRoom
 * @param {string} roomCode - Unique room code
 * @param {Object} roomData - Updated room data
 * @returns {Promise<Object|null>} Updated room object or null if not found
 * @throws {Error} Validation or database error
 */
const updateRoom = async (roomCode, roomData) => {
    return await Room.findOneAndUpdate(
        { code: roomCode },
        roomData,
        { new: true, runValidators: true }
    ).exec();
};

/**
 * Delete a room by code
 * @async
 * @function deleteRoom
 * @param {string} roomCode - Unique room code
 * @returns {Promise<Object|null>} Deleted room object or null if not found
 * @throws {Error} Database error
 */
const deleteRoom = async (roomCode) => {
    return await Room.findOneAndDelete({ code: roomCode }).exec();
};

module.exports = {
    getAllRooms,
    getRoomByCode,
    createRoom,
    updateRoom,
    deleteRoom
};
