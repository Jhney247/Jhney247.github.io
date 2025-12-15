/**
 * Authentication and Authorization Middleware
 * JWT verification and role-based access control
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from Authorization header
 * @function authenticate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ 
            message: 'Access denied. No token provided.',
            error: 'UNAUTHORIZED'
        });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ 
            message: 'Invalid authorization header format. Expected: Bearer <token>',
            error: 'INVALID_TOKEN_FORMAT'
        });
    }
    
    const token = parts[1];
    
    if (!token) {
        return res.status(401).json({ 
            message: 'Access denied. No token provided.',
            error: 'UNAUTHORIZED'
        });
    }
    
    try {
        const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
        const decoded = jwt.verify(token, accessSecret);
        req.auth = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired. Please refresh your token.',
                error: 'TOKEN_EXPIRED'
            });
        }
        
        return res.status(401).json({ 
            message: 'Invalid token.',
            error: 'INVALID_TOKEN'
        });
    }
};

/**
 * Check if user has required role(s)
 * @function authorize
 * @param {...string} allowedRoles - Allowed roles for the endpoint
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).json({ 
                message: 'Authentication required.',
                error: 'UNAUTHORIZED'
            });
        }
        
        const userRole = req.auth.role;
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.',
                error: 'FORBIDDEN',
                requiredRoles: allowedRoles,
                userRole: userRole
            });
        }
        
        next();
    };
};

/**
 * Optional authentication - adds auth data if token exists but doesn't require it
 * @function optionalAuth
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return next();
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        
        try {
            const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
            const decoded = jwt.verify(token, accessSecret);
            req.auth = decoded;
        } catch (err) {
            // Token invalid or expired - continue without auth
        }
    }
    
    next();
};

module.exports = {
    authenticate,
    authorize,
    optionalAuth
};
