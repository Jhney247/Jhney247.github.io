/**
 * Meal Controller
 * Handles HTTP requests for meal-related operations
 * @module controllers/meals
 */

const mealService = require('../services/mealService');
const { asyncHandler, notFound } = require('../middleware/errorHandler');

/**
 * Get all meals
 * @route GET /api/v1/meals
 * @access Public
 */
const mealsList = asyncHandler(async (req, res) => {
    const meals = await mealService.getAllMeals();
    res.status(200).json(meals);
});

/**
 * Get a single meal by code
 * @route GET /api/v1/meals/:mealCode
 * @access Public
 */
const mealsFindByCode = asyncHandler(async (req, res) => {
    const meal = await mealService.getMealByCode(req.params.mealCode);
    
    if (!meal) {
        throw notFound('Meal');
    }
    
    res.status(200).json(meal);
});

/**
 * Create a new meal
 * @route POST /api/v1/meals
 * @access Private (Admin only)
 */
const mealsAddMeal = asyncHandler(async (req, res) => {
    const meal = await mealService.createMeal(req.body);
    res.status(201).json(meal);
});

/**
 * Update an existing meal
 * @route PUT /api/v1/meals/:mealCode
 * @access Private (Admin only)
 */
const mealsUpdateMeal = asyncHandler(async (req, res) => {
    const meal = await mealService.updateMeal(req.params.mealCode, req.body);
    
    if (!meal) {
        throw notFound('Meal');
    }
    
    res.status(200).json(meal);
});

/**
 * Delete a meal
 * @route DELETE /api/v1/meals/:mealCode
 * @access Private (Admin only)
 */
const mealsDeleteMeal = asyncHandler(async (req, res) => {
    const meal = await mealService.deleteMeal(req.params.mealCode);
    
    if (!meal) {
        throw notFound('Meal');
    }
    
    res.status(200).json({ 
        message: 'Meal deleted successfully',
        meal: meal 
    });
});

module.exports = {
    mealsList,
    mealsFindByCode,
    mealsAddMeal,
    mealsUpdateMeal,
    mealsDeleteMeal
};
