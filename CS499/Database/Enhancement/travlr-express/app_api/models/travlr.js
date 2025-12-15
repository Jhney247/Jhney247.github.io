/**
 * Trip Model
 * Defines the schema for travel trips in the Travlr application
 * @module models/trip
 */

const mongoose = require('mongoose');
const { auditPlugin } = require('../middleware/audit');

/**
 * Trip Schema
 * @typedef {Object} TripSchema
 * @property {string} code - Unique trip code identifier (required, indexed)
 * @property {string} name - Trip name/title (required, indexed)
 * @property {string} length - Trip duration (required)
 * @property {Date} start - Trip start date (required)
 * @property {string} resort - Resort/hotel name (required)
 * @property {string} perPerson - Price per person in USD (required)
 * @property {string} image - Image URL/path for the trip (required)
 * @property {string} description - Detailed trip description (required)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
const tripSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: [true, 'Trip code is required'], 
        index: true,
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [3, 'Trip code must be at least 3 characters'],
        maxlength: [20, 'Trip code cannot exceed 20 characters']
    },
    name: { 
        type: String, 
        required: [true, 'Trip name is required'], 
        index: true,
        trim: true,
        minlength: [3, 'Trip name must be at least 3 characters'],
        maxlength: [200, 'Trip name cannot exceed 200 characters']
    },
    length: { 
        type: Number, 
        required: [true, 'Trip length is required'],
        min: [1, 'Trip length must be at least 1 day']
    },
    start: { 
        type: Date, 
        required: [true, 'Trip start date is required'],
        validate: {
            validator: function(value) {
                if (!value) return false;
                // allow past dates for existing trips (updates), enforce future for new docs
                if (!this.isNew) return true;
                const now = new Date();
                return value >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
            },
            message: 'Trip start date must not be in the past'
        }
    },
    resort: { 
        type: String, 
        required: [true, 'Resort name is required'],
        trim: true,
        minlength: [2, 'Resort name must be at least 2 characters'],
        maxlength: [200, 'Resort name cannot exceed 200 characters']
    },
    perPerson: { 
        type: Number, 
        required: [true, 'Price per person is required'],
        min: [0, 'Price per person cannot be negative'],
        validate: {
            validator: Number.isFinite,
            message: 'Price per person must be a valid number'
        }
    },
    image: { 
        type: String, 
        required: [true, 'Trip image is required'],
        trim: true
    },
    description: { 
        type: String, 
        required: [true, 'Trip description is required']
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

tripSchema.plugin(auditPlugin, { collection: 'trips' });

// Compound indexes for common query patterns
tripSchema.index({ start: 1, resort: 1 });
tripSchema.index({ createdAt: -1 });
tripSchema.index({ name: 'text', description: 'text', resort: 'text' });

// Normalize and enforce schema version
tripSchema.pre('validate', function(next) {
    if (typeof this.perPerson === 'string') {
        const parsed = parseFloat(this.perPerson.replace(/[^0-9.]/g, ''));
        if (!Number.isNaN(parsed)) {
            this.perPerson = parsed;
        }
    }
    if (typeof this.length === 'string') {
        const len = parseInt(this.length, 10);
        if (!Number.isNaN(len)) {
            this.length = len;
        }
    }
    if (!this.schemaVersion) {
        this.schemaVersion = 1;
    }
    next();
});

/**
 * Trip Model
 * @class Trip
 */
const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;