/**
 * Error Handling Middleware
 * Centralized error handling for the API
 * @module middleware/errorHandler
 */

/**
 * Custom API Error class
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
    constructor(statusCode, message, error = null, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Create a 400 Bad Request error
 * @function badRequest
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {ApiError}
 */
const badRequest = (message = 'Bad Request', details = null) => {
    return new ApiError(400, message, 'BAD_REQUEST', details);
};

/**
 * Create a 401 Unauthorized error
 * @function unauthorized
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const unauthorized = (message = 'Unauthorized') => {
    return new ApiError(401, message, 'UNAUTHORIZED');
};

/**
 * Create a 403 Forbidden error
 * @function forbidden
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const forbidden = (message = 'Forbidden') => {
    return new ApiError(403, message, 'FORBIDDEN');
};

/**
 * Create a 404 Not Found error
 * @function notFound
 * @param {string} resource - Resource name that was not found
 * @returns {ApiError}
 */
const notFound = (resource = 'Resource') => {
    return new ApiError(404, `${resource} not found`, 'NOT_FOUND');
};

/**
 * Create a 409 Conflict error
 * @function conflict
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const conflict = (message = 'Conflict') => {
    return new ApiError(409, message, 'CONFLICT');
};

/**
 * Create a 500 Internal Server error
 * @function internalServer
 * @param {string} message - Error message
 * @returns {ApiError}
 */
const internalServer = (message = 'Internal Server Error') => {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR');
};

/**
 * Global error handler middleware
 * @function errorHandler
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        
        return res.status(400).json({
            message: 'Validation failed',
            error: 'VALIDATION_ERROR',
            errors: errors
        });
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            message: `${field} already exists`,
            error: 'DUPLICATE_KEY',
            field: field
        });
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID format',
            error: 'INVALID_ID'
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token',
            error: 'INVALID_TOKEN'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired',
            error: 'TOKEN_EXPIRED'
        });
    }

    // Handle custom API errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message,
            error: err.error,
            details: err.details
        });
    }

    // Handle unexpected errors
    res.status(500).json({
        message: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'An unexpected error occurred',
        error: 'INTERNAL_SERVER_ERROR',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @function asyncHandler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    ApiError,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    conflict,
    internalServer,
    errorHandler,
    asyncHandler
};
