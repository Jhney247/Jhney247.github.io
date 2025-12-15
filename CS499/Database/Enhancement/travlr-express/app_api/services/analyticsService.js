/**
 * Analytics and reporting aggregations
 */

const Trip = require('../models/travlr');
const Room = require('../models/room');
const Meal = require('../models/meal');

/**
 * Trips grouped by resort and month.
 */
const getTripsByResortPerMonth = async ({ startDate, endDate } = {}) => {
    const match = {};
    if (startDate || endDate) {
        match.start = {};
        if (startDate) match.start.$gte = startDate;
        if (endDate) match.start.$lte = endDate;
    }

    const pipeline = [
        Object.keys(match).length ? { $match: match } : null,
        {
            $group: {
                _id: {
                    resort: '$resort',
                    year: { $year: '$start' },
                    month: { $month: '$start' }
                },
                tripCount: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.resort': 1,
                '_id.year': 1,
                '_id.month': 1
            }
        }
    ].filter(Boolean);

    return Trip.aggregate(pipeline).exec();
};

/**
 * Simple meal price distribution per cuisine.
 */
const getMealPriceStatsByCuisine = async () => {
    const pipeline = [
        {
            $group: {
                _id: '$cuisine',
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                avgPrice: -1
            }
        }
    ];

    return Meal.aggregate(pipeline).exec();
};

/**
 * Rooms by type and availability.
 */
const getRoomAvailabilityByType = async () => {
    const pipeline = [
        {
            $group: {
                _id: { type: '$type', available: '$available' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.type': 1,
                '_id.available': -1
            }
        }
    ];

    return Room.aggregate(pipeline).exec();
};

module.exports = {
    getTripsByResortPerMonth,
    getMealPriceStatsByCuisine,
    getRoomAvailabilityByType
};
