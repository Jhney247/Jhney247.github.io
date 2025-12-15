/**
 * Meal Model
 * Defines the schema for meals/dining options in the Travlr application
 * @module models/meal
 */

const mongoose = require('mongoose');
const { auditPlugin } = require('../middleware/audit');

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
        uppercase: true,
        minlength: [3, 'Meal code must be at least 3 characters'],
        maxlength: [20, 'Meal code cannot exceed 20 characters']
    },
    name: { 
        type: String, 
        required: [true, 'Meal name is required'],
        index: true,
        trim: true,
        minlength: [3, 'Meal name must be at least 3 characters'],
        maxlength: [200, 'Meal name cannot exceed 200 characters']
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
        type: Number, 
        required: [true, 'Meal price is required'],
        min: [0, 'Meal price cannot be negative'],
        validate: {
            validator: Number.isFinite,
            message: 'Meal price must be a valid number'
        }
    },
    image: { 
        type: String, 
        required: [true, 'Meal image is required'],
        trim: true
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
        default: false,
        validate: {
            validator: function(value) {
                if (!value) return true;
                return this.vegetarian === true;
            },
            message: 'Vegan meals must also be marked as vegetarian'
        }
    },
    glutenFree: {
        type: Boolean,
        default: false
    },
    available: {
        type: Boolean,
        default: true,
        index: true
    },
    // optional relationship to a trip
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trips',
        index: true,
        required: false
    },
    schemaVersion: {
        type: Number,
        required: true,
        default: 1,
        index: true,
        min: 1
    }
}, {
    timestamps: true
});

mealSchema.plugin(auditPlugin, { collection: 'meals' });

mealSchema.index({ available: 1, mealType: 1, cuisine: 1 });
mealSchema.index({ createdAt: -1 });
mealSchema.index({ name: 'text', description: 'text', ingredients: 'text' });

mealSchema.pre('validate', function(next) {
    if (typeof this.price === 'string') {
        const parsed = parseFloat(this.price.replace(/[^0-9.]/g, ''));
        if (!Number.isNaN(parsed)) {
            this.price = parsed;
        }
    }
    if (!this.schemaVersion) {
        this.schemaVersion = 1;
    }
    next();
});

/**
 * Meal Model
 * @class Meal
 */
const Meal = mongoose.model('meals', mealSchema);

module.exports = Meal;
