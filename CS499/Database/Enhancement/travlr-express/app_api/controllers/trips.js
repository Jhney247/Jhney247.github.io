/**
 * Trip Controller
 * Handles HTTP requests for trip-related operations
 * @module controllers/trips
 */

const tripService = require('../services/tripService');
const { asyncHandler, notFound } = require('../middleware/errorHandler');

/**
 * Get all trips
 * @route GET /api/v1/trips
 * @access Public
 */
const tripsList = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const cursor = req.query.cursor || undefined;
    const search = req.query.q || undefined;

    const result = await tripService.getAllTrips({ limit, cursor, search });
    res.status(200).json(result);
});

/**
 * Get a single trip by code
 * @route GET /api/v1/trips/:tripCode
 * @access Public
 */
const tripsFindByCode = asyncHandler(async (req, res) => {
    const trip = await tripService.getTripByCode(req.params.tripCode);
    
    if (!trip) {
        throw notFound('Trip');
    }
    
    res.status(200).json(trip);
});

/**
 * Create a new trip
 * @route POST /api/v1/trips
 * @access Private (Admin only)
 */
const tripsAddTrip = asyncHandler(async (req, res) => {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json(trip);
});

/**
 * Update an existing trip
 * @route PUT /api/v1/trips/:tripCode
 * @access Private (Admin only)
 */
const tripsUpdateTrip = asyncHandler(async (req, res) => {
    const trip = await tripService.updateTrip(req.params.tripCode, req.body);
    
    if (!trip) {
        throw notFound('Trip');
    }
    
    res.status(200).json(trip);
});

/**
 * Delete a trip
 * @route DELETE /api/v1/trips/:tripCode
 * @access Private (Admin only)
 */
const tripsDeleteTrip = asyncHandler(async (req, res) => {
    const trip = await tripService.deleteTrip(req.params.tripCode);
    
    if (!trip) {
        throw notFound('Trip');
    }
    
    res.status(200).json({ 
        message: 'Trip deleted successfully',
        trip: trip 
    });
});

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};