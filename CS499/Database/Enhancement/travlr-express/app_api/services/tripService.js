/**
 * Trip Service Layer
 * Business logic for trip operations
 * @module services/tripService
 */

const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const { paginate } = require('./pagination');

/**
 * Get all trips from database
 * @async
 * @function getAllTrips
 * @returns {Promise<Array>} Array of all trips
 * @throws {Error} Database error
 */
const getAllTrips = async ({ limit = 20, cursor, search } = {}) => {
    const filter = {};

    if (search) {
        filter.$text = { $search: search };
    }

    return paginate(Trip, {
        filter,
        sort: { createdAt: -1 },
        limit,
        cursorField: 'createdAt',
        cursorValue: cursor
    });
};

/**
 * Get a single trip by code
 * @async
 * @function getTripByCode
 * @param {string} tripCode - Unique trip code
 * @returns {Promise<Object|null>} Trip object or null if not found
 * @throws {Error} Database error
 */
const getTripByCode = async (tripCode) => {
    return await Trip.findOne({ code: tripCode }).exec();
};

/**
 * Create a new trip
 * @async
 * @function createTrip
 * @param {Object} tripData - Trip data object
 * @returns {Promise<Object>} Created trip object
 * @throws {Error} Validation or database error
 */
const createTrip = async (tripData) => {
    const trip = new Trip(tripData);
    return await trip.save();
};

/**
 * Update an existing trip by code
 * @async
 * @function updateTrip
 * @param {string} tripCode - Unique trip code
 * @param {Object} tripData - Updated trip data
 * @returns {Promise<Object|null>} Updated trip object or null if not found
 * @throws {Error} Validation or database error
 */
const updateTrip = async (tripCode, tripData) => {
    return await Trip.findOneAndUpdate(
        { code: tripCode },
        tripData,
        { new: true, runValidators: true }
    ).exec();
};

/**
 * Delete a trip by code
 * @async
 * @function deleteTrip
 * @param {string} tripCode - Unique trip code
 * @returns {Promise<Object|null>} Deleted trip object or null if not found
 * @throws {Error} Database error
 */
const deleteTrip = async (tripCode) => {
    return await Trip.findOneAndDelete({ code: tripCode }).exec();
};

/**
 * Example transactional operation (placeholder for future booking logic)
 * Demonstrates multi-document transaction pattern using Mongoose sessions.
 */
const performTripRelatedTransaction = async (operationsFn) => {
    const session = await mongoose.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            result = await operationsFn(session);
        });
        return result;
    } finally {
        await session.endSession();
    }
};

module.exports = {
    getAllTrips,
    getTripByCode,
    createTrip,
    updateTrip,
    deleteTrip,
    performTripRelatedTransaction
};
