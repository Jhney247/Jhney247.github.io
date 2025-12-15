/**
 * Meal Routes (API v1)
 * @module routes/v1/meals
 */

const express = require('express');
const router = express.Router();
const mealController = require('../../controllers/meals');
const { mealValidation } = require('../../middleware/validation');
const { authenticate, authorize } = require('../../middleware/auth');
const { writeLimiter } = require('../../middleware/rateLimiter');

/**
 * @route   GET /api/v1/meals
 * @desc    Get all meals
 * @access  Public
 */
router.get('/', mealController.mealsList);

/**
 * @route   GET /api/v1/meals/:mealCode
 * @desc    Get meal by code
 * @access  Public
 */
router.get('/:mealCode', mealController.mealsFindByCode);

/**
 * @route   POST /api/v1/meals
 * @desc    Create a new meal
 * @access  Private (Admin only)
 */
router.post(
    '/',
    authenticate,
    authorize('admin'),
    writeLimiter,
    mealValidation.create,
    mealController.mealsAddMeal
);

/**
 * @route   PUT /api/v1/meals/:mealCode
 * @desc    Update meal by code
 * @access  Private (Admin only)
 */
router.put(
    '/:mealCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    mealValidation.update,
    mealController.mealsUpdateMeal
);

/**
 * @route   DELETE /api/v1/meals/:mealCode
 * @desc    Delete meal by code
 * @access  Private (Admin only)
 */
router.delete(
    '/:mealCode',
    authenticate,
    authorize('admin'),
    writeLimiter,
    mealController.mealsDeleteMeal
);

module.exports = router;
