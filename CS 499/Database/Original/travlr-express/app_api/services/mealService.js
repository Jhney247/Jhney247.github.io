/**
 * Meal Service Layer
 * Business logic for meal operations
 * @module services/mealService
 */

const Meal = require('../models/meal');

/**
 * Get all meals from database
 * @async
 * @function getAllMeals
 * @returns {Promise<Array>} Array of all meals
 * @throws {Error} Database error
 */
const getAllMeals = async () => {
    return await Meal.find({}).exec();
};

/**
 * Get a single meal by code
 * @async
 * @function getMealByCode
 * @param {string} mealCode - Unique meal code
 * @returns {Promise<Object|null>} Meal object or null if not found
 * @throws {Error} Database error
 */
const getMealByCode = async (mealCode) => {
    return await Meal.findOne({ code: mealCode }).exec();
};

/**
 * Create a new meal
 * @async
 * @function createMeal
 * @param {Object} mealData - Meal data object
 * @returns {Promise<Object>} Created meal object
 * @throws {Error} Validation or database error
 */
const createMeal = async (mealData) => {
    const meal = new Meal(mealData);
    return await meal.save();
};

/**
 * Update an existing meal by code
 * @async
 * @function updateMeal
 * @param {string} mealCode - Unique meal code
 * @param {Object} mealData - Updated meal data
 * @returns {Promise<Object|null>} Updated meal object or null if not found
 * @throws {Error} Validation or database error
 */
const updateMeal = async (mealCode, mealData) => {
    return await Meal.findOneAndUpdate(
        { code: mealCode },
        mealData,
        { new: true, runValidators: true }
    ).exec();
};

/**
 * Delete a meal by code
 * @async
 * @function deleteMeal
 * @param {string} mealCode - Unique meal code
 * @returns {Promise<Object|null>} Deleted meal object or null if not found
 * @throws {Error} Database error
 */
const deleteMeal = async (mealCode) => {
    return await Meal.findOneAndDelete({ code: mealCode }).exec();
};

module.exports = {
    getAllMeals,
    getMealByCode,
    createMeal,
    updateMeal,
    deleteMeal
};
