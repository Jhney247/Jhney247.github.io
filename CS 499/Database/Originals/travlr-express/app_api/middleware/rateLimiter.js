/**
 * Rate Limiting Middleware
 * Prevent abuse by limiting request rates
 * @module middleware/rateLimiter
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * Limits all API requests to 100 per 15 minutes per IP
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        message: 'Too many requests from this IP, please try again later.',
        error: 'RATE_LIMIT_EXCEEDED',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Authentication rate limiter
 * Limits login/register attempts to 5 per 15 minutes per IP
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        message: 'Too many authentication attempts, please try again later.',
        error: 'AUTH_RATE_LIMIT_EXCEEDED',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests
});

/**
 * Create/Update/Delete rate limiter
 * Limits write operations to 20 per hour per IP
 */
const writeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 write requests per hour
    message: {
        message: 'Too many write operations, please try again later.',
        error: 'WRITE_RATE_LIMIT_EXCEEDED',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    writeLimiter
};
