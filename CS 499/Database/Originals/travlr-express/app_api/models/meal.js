/**
 * Meal Model
 * Defines the schema for meals/dining options in the Travlr application
 * @module models/meal
 */

const mongoose = require('mongoose');

/**
 * Meal Schema
 * @typedef {Object} MealSchema
 * @property {string} code - Unique meal code identifier (required, indexed)
 * @property {string} name - Meal name/title (required)
 * @property {string} cuisine - Type of cuisine (required)
 * @property {string} mealType - Meal category (Breakfast, Lunch, Dinner, Snack)
 * @property {string} price - Meal price in USD (required)
 * @property {string} image - Image URL/path for the meal (required)
 * @property {string} description - Detailed meal description (required)
 * @property {string[]} ingredients - List of main ingredients
 * @property {string[]} allergens - List of allergens present
 * @property {boolean} vegetarian - Whether the meal is vegetarian
 * @property {boolean} vegan - Whether the meal is vegan
 * @property {boolean} glutenFree - Whether the meal is gluten-free
 * @property {boolean} available - Meal availability status (default: true)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
const mealSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: [true, 'Meal code is required'],
        unique: true,
        index: true,
        trim: true,
        uppercase: true
    },
    name: { 
        type: String, 
        required: [true, 'Meal name is required'],
        index: true,
        trim: true
    },
    cuisine: { 
        type: String, 
        required: [true, 'Cuisine type is required'],
        trim: true
    },
    mealType: {
        type: String,
        required: [true, 'Meal type is required'],
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
        trim: true
    },
    price: { 
        type: String, 
        required: [true, 'Meal price is required']
    },
    image: { 
        type: String, 
        required: [true, 'Meal image is required']
    },
    description: { 
        type: String, 
        required: [true, 'Meal description is required']
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    allergens: [{
        type: String,
        trim: true
    }],
    vegetarian: {
        type: Boolean,
        default: false
    },
    vegan: {
        type: Boolean,
        default: false
    },
    glutenFree: {
        type: Boolean,
        default: false
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

/**
 * Meal Model
 * @class Meal
 */
const Meal = mongoose.model('meals', mealSchema);

module.exports = Meal;
