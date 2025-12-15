/**
 * Input Validation Middleware
 * Validation rules for API endpoints using express-validator
 * @module middleware/validation
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Handle validation errors
 * @function handleValidationErrors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Validation failed',
            error: 'VALIDATION_ERROR',
            errors: errors.array()
        });
    }
    
    next();
};

/**
 * Trip validation rules
 */
const tripValidation = {
    create: [
        body('code')
            .trim()
            .notEmpty().withMessage('Trip code is required')
            .isLength({ min: 2, max: 10 }).withMessage('Trip code must be 2-10 characters')
            .matches(/^[A-Z0-9]+$/).withMessage('Trip code must contain only uppercase letters and numbers'),
        body('name')
            .trim()
            .notEmpty().withMessage('Trip name is required')
            .isLength({ min: 3, max: 100 }).withMessage('Trip name must be 3-100 characters'),
        body('length')
            .trim()
            .notEmpty().withMessage('Trip length is required'),
        body('start')
            .notEmpty().withMessage('Start date is required')
            .isISO8601().withMessage('Start date must be a valid date'),
        body('resort')
            .trim()
            .notEmpty().withMessage('Resort name is required'),
        body('perPerson')
            .trim()
            .notEmpty().withMessage('Price per person is required')
            .matches(/^\d+\.?\d{0,2}$/).withMessage('Price must be a valid number'),
        body('image')
            .trim()
            .notEmpty().withMessage('Image URL is required'),
        body('description')
            .trim()
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
        handleValidationErrors
    ],
    update: [
        param('tripCode')
            .trim()
            .notEmpty().withMessage('Trip code is required'),
        body('name')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 }).withMessage('Trip name must be 3-100 characters'),
        body('length')
            .optional()
            .trim()
            .notEmpty().withMessage('Trip length cannot be empty'),
        body('start')
            .optional()
            .isISO8601().withMessage('Start date must be a valid date'),
        body('perPerson')
            .optional()
            .matches(/^\d+\.?\d{0,2}$/).withMessage('Price must be a valid number'),
        body('description')
            .optional()
            .trim()
            .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
        handleValidationErrors
    ]
};

/**
 * Room validation rules
 */
const roomValidation = {
    create: [
        body('code')
            .trim()
            .notEmpty().withMessage('Room code is required')
            .isLength({ min: 2, max: 10 }).withMessage('Room code must be 2-10 characters')
            .matches(/^[A-Z0-9]+$/).withMessage('Room code must contain only uppercase letters and numbers'),
        body('name')
            .trim()
            .notEmpty().withMessage('Room name is required'),
        body('type')
            .trim()
            .notEmpty().withMessage('Room type is required')
            .isIn(['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Family']).withMessage('Invalid room type'),
        body('beds')
            .notEmpty().withMessage('Number of beds is required')
            .isInt({ min: 1 }).withMessage('Beds must be at least 1'),
        body('maxOccupancy')
            .notEmpty().withMessage('Max occupancy is required')
            .isInt({ min: 1 }).withMessage('Max occupancy must be at least 1'),
        body('pricePerNight')
            .trim()
            .notEmpty().withMessage('Price per night is required')
            .matches(/^\d+\.?\d{0,2}$/).withMessage('Price must be a valid number'),
        body('image')
            .trim()
            .notEmpty().withMessage('Image URL is required'),
        body('description')
            .trim()
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
        handleValidationErrors
    ],
    update: [
        param('roomCode')
            .trim()
            .notEmpty().withMessage('Room code is required'),
        body('type')
            .optional()
            .isIn(['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Family']).withMessage('Invalid room type'),
        body('beds')
            .optional()
            .isInt({ min: 1 }).withMessage('Beds must be at least 1'),
        body('maxOccupancy')
            .optional()
            .isInt({ min: 1 }).withMessage('Max occupancy must be at least 1'),
        handleValidationErrors
    ]
};

/**
 * Meal validation rules
 */
const mealValidation = {
    create: [
        body('code')
            .trim()
            .notEmpty().withMessage('Meal code is required')
            .isLength({ min: 2, max: 10 }).withMessage('Meal code must be 2-10 characters')
            .matches(/^[A-Z0-9]+$/).withMessage('Meal code must contain only uppercase letters and numbers'),
        body('name')
            .trim()
            .notEmpty().withMessage('Meal name is required'),
        body('cuisine')
            .trim()
            .notEmpty().withMessage('Cuisine type is required'),
        body('mealType')
            .trim()
            .notEmpty().withMessage('Meal type is required')
            .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']).withMessage('Invalid meal type'),
        body('price')
            .trim()
            .notEmpty().withMessage('Price is required')
            .matches(/^\d+\.?\d{0,2}$/).withMessage('Price must be a valid number'),
        body('image')
            .trim()
            .notEmpty().withMessage('Image URL is required'),
        body('description')
            .trim()
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
        handleValidationErrors
    ],
    update: [
        param('mealCode')
            .trim()
            .notEmpty().withMessage('Meal code is required'),
        body('mealType')
            .optional()
            .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']).withMessage('Invalid meal type'),
        handleValidationErrors
    ]
};

/**
 * News validation rules
 */
const newsValidation = {
    create: [
        body('code')
            .trim()
            .notEmpty().withMessage('News code is required')
            .isLength({ min: 2, max: 10 }).withMessage('News code must be 2-10 characters')
            .matches(/^[A-Z0-9]+$/).withMessage('News code must contain only uppercase letters and numbers'),
        body('title')
            .trim()
            .notEmpty().withMessage('Title is required')
            .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
        body('category')
            .trim()
            .notEmpty().withMessage('Category is required')
            .isIn(['Travel Tips', 'Destination Guide', 'Company News', 'Special Offers', 'Events', 'General'])
            .withMessage('Invalid category'),
        body('author')
            .trim()
            .notEmpty().withMessage('Author name is required'),
        body('publishDate')
            .optional()
            .isISO8601().withMessage('Publish date must be a valid date'),
        body('image')
            .trim()
            .notEmpty().withMessage('Image URL is required'),
        body('summary')
            .trim()
            .notEmpty().withMessage('Summary is required')
            .isLength({ max: 500 }).withMessage('Summary cannot exceed 500 characters'),
        body('content')
            .trim()
            .notEmpty().withMessage('Content is required')
            .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
        handleValidationErrors
    ],
    update: [
        param('newsCode')
            .trim()
            .notEmpty().withMessage('News code is required'),
        body('category')
            .optional()
            .isIn(['Travel Tips', 'Destination Guide', 'Company News', 'Special Offers', 'Events', 'General'])
            .withMessage('Invalid category'),
        handleValidationErrors
    ]
};

/**
 * User/Authentication validation rules
 */
const authValidation = {
    register: [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Must be a valid email address')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
        body('role')
            .optional()
            .isIn(['user', 'admin']).withMessage('Invalid role'),
        handleValidationErrors
    ],
    login: [
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Must be a valid email address')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password is required'),
        handleValidationErrors
    ]
};

module.exports = {
    tripValidation,
    roomValidation,
    mealValidation,
    newsValidation,
    authValidation,
    handleValidationErrors
};
