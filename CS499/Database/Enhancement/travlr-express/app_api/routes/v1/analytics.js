const express = require('express');
const router = express.Router();

const analyticsCtrl = require('../../controllers/analytics');

// GET /api/v1/analytics/trips-by-resort
router.get('/trips-by-resort', analyticsCtrl.tripsByResortPerMonth);

// GET /api/v1/analytics/meal-price-stats
router.get('/meal-price-stats', analyticsCtrl.mealPriceStatsByCuisine);

// GET /api/v1/analytics/room-availability
router.get('/room-availability', analyticsCtrl.roomAvailabilityByType);

module.exports = router;
