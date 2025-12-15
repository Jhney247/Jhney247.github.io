/**
 * Trip Service Layer
 * Business logic for trip operations
 * @module services/tripService
 */

const Trip = require('../models/travlr');

/**
 * Get all trips from database
 * @async
 * @function getAllTrips
 * @returns {Promise<Array>} Array of all trips
 * @throws {Error} Database error
 */
const getAllTrips = async () => {
    return await Trip.find({}).exec();
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

module.exports = {
    getAllTrips,
    getTripByCode,
    createTrip,
    updateTrip,
    deleteTrip
};
