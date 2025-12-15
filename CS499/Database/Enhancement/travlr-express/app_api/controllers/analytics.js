/**
 * Analytics Controller
 */

const analyticsService = require('../services/analyticsService');
const { asyncHandler } = require('../middleware/errorHandler');

const tripsByResortPerMonth = asyncHandler(async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
    const data = await analyticsService.getTripsByResortPerMonth({ startDate, endDate });
    res.status(200).json({ items: data });
});

const mealPriceStatsByCuisine = asyncHandler(async (_req, res) => {
    const data = await analyticsService.getMealPriceStatsByCuisine();
    res.status(200).json({ items: data });
});

const roomAvailabilityByType = asyncHandler(async (_req, res) => {
    const data = await analyticsService.getRoomAvailabilityByType();
    res.status(200).json({ items: data });
});

module.exports = {
    tripsByResortPerMonth,
    mealPriceStatsByCuisine,
    roomAvailabilityByType
};
