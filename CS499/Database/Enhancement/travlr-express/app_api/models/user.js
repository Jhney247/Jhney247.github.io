/**
 * User Model
 * Defines the schema for users with authentication and authorization
 * @module models/user
 */

const mongoose = require('mongoose');
const { auditPlugin } = require('../middleware/audit');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * User Schema
 * @typedef {Object} UserSchema
 * @property {string} email - User email (unique, required)
 * @property {string} name - User full name (required)
 * @property {string} role - User role for RBAC (default: 'user')
 * @property {string} hash - Password hash
 * @property {string} salt - Password salt (deprecated, keeping for backward compatibility)
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Account last update timestamp
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true,
        index: true
    },
    hash: String,
    salt: String,
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

userSchema.plugin(auditPlugin, { collection: 'users' });

/**
 * Set the password for a user using bcrypt
 * @method setPassword
 * @param {string} password - Plain text password
 * @returns {Promise<void>}
 */
userSchema.methods.setPassword = async function(password){
    const saltRounds = 10;
    this.hash = await bcrypt.hash(password, saltRounds);
    // Keep salt for backward compatibility but not used with bcrypt
    this.salt = '';
};

/**
 * Validate password against stored hash using bcrypt
 * @method validPassword
 * @param {string} password - Plain text password to validate
 * @returns {Promise<boolean>} True if password matches
 */
userSchema.methods.validPassword = async function(password) {
    // Try bcrypt first (new method)
    if (this.hash && !this.salt) {
        return await bcrypt.compare(password, this.hash);
    }
    // Fallback to old crypto method for existing users
    if (this.salt) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return this.hash === hash;
    }
    return false;
};

/**
 * Generate a JSON Web Token for authentication
 * @method generateJWT
 * @returns {string} JWT token
 */
userSchema.methods.generateJWT = function() {
    const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    const accessTtl = process.env.JWT_ACCESS_TTL || '1h';
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        accessSecret,
        { expiresIn: accessTtl }
    );
};

/**
 * Generate a refresh token with longer expiration
 * @method generateRefreshToken
 * @returns {string} Refresh JWT token
 */
userSchema.methods.generateRefreshToken = function() {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const refreshTtl = process.env.JWT_REFRESH_TTL || '7d';
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            type: 'refresh'
        },
        refreshSecret,
        { expiresIn: refreshTtl }
    );
};

const User = mongoose.model('users', userSchema);
module.exports = User;