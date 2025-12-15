/**
 * Trip Model
 * Defines the schema for travel trips in the Travlr application
 * @module models/trip
 */

const mongoose = require('mongoose');

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
        uppercase: true
    },
    name: { 
        type: String, 
        required: [true, 'Trip name is required'], 
        index: true,
        trim: true
    },
    length: { 
        type: String, 
        required: [true, 'Trip length is required']
    },
    start: { 
        type: Date, 
        required: [true, 'Trip start date is required']
    },
    resort: { 
        type: String, 
        required: [true, 'Resort name is required'],
        trim: true
    },
    perPerson: { 
        type: String, 
        required: [true, 'Price per person is required']
    },
    image: { 
        type: String, 
        required: [true, 'Trip image is required']
    },
    description: { 
        type: String, 
        required: [true, 'Trip description is required']
    }
}, {
    timestamps: true
});

/**
 * Trip Model
 * @class Trip
 */
const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;