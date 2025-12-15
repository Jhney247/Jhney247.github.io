/**
 * Room Model
 * Defines the schema for hotel rooms in the Travlr application
 * @module models/room
 */

const mongoose = require('mongoose');
const { auditPlugin } = require('../middleware/audit');

/**
 * Room Schema
 * @typedef {Object} RoomSchema
 * @property {string} code - Unique room code identifier (required, indexed)
 * @property {string} name - Room name/title (required)
 * @property {string} type - Room type (e.g., Single, Double, Suite) (required)
 * @property {number} beds - Number of beds in the room (required, min: 1)
 * @property {number} maxOccupancy - Maximum number of guests (required, min: 1)
 * @property {string} pricePerNight - Price per night in USD (required)
 * @property {string} image - Image URL/path for the room (required)
 * @property {string} description - Detailed room description (required)
 * @property {string[]} amenities - List of room amenities
 * @property {boolean} available - Room availability status (default: true)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
const roomSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: [true, 'Room code is required'],
        unique: true,
        index: true,
        trim: true,
        uppercase: true,
        minlength: [3, 'Room code must be at least 3 characters'],
        maxlength: [20, 'Room code cannot exceed 20 characters']
    },
    name: { 
        type: String, 
        required: [true, 'Room name is required'],
        index: true,
        trim: true,
        minlength: [3, 'Room name must be at least 3 characters'],
        maxlength: [200, 'Room name cannot exceed 200 characters']
    },
    type: { 
        type: String, 
        required: [true, 'Room type is required'],
        enum: ['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Family'],
        trim: true
    },
    beds: { 
        type: Number, 
        required: [true, 'Number of beds is required'],
        min: [1, 'Minimum 1 bed required']
    },
    maxOccupancy: { 
        type: Number, 
        required: [true, 'Max occupancy is required'],
        min: [1, 'Minimum occupancy is 1'],
        validate: {
            validator: function(value) {
                if (value == null) return false;
                return value >= this.beds;
            },
            message: 'Max occupancy must be greater than or equal to number of beds'
        }
    },
    pricePerNight: { 
        type: Number, 
        required: [true, 'Price per night is required'],
        min: [0, 'Price per night cannot be negative'],
        validate: {
            validator: Number.isFinite,
            message: 'Price per night must be a valid number'
        }
    },
    image: { 
        type: String, 
        required: [true, 'Room image is required'],
        trim: true
    },
    description: { 
        type: String, 
        required: [true, 'Room description is required']
    },
    amenities: [{
        type: String,
        trim: true
    }],
    available: {
        type: Boolean,
        default: true,
        index: true
    },
    // optional relationship to a primary trip (can be extended to many-to-many later)
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

roomSchema.plugin(auditPlugin, { collection: 'rooms' });

roomSchema.index({ available: 1, type: 1, pricePerNight: 1 });
roomSchema.index({ createdAt: -1 });
roomSchema.index({ name: 'text', description: 'text', amenities: 'text' });

roomSchema.pre('validate', function(next) {
    if (typeof this.pricePerNight === 'string') {
        const parsed = parseFloat(this.pricePerNight.replace(/[^0-9.]/g, ''));
        if (!Number.isNaN(parsed)) {
            this.pricePerNight = parsed;
        }
    }
    if (!this.schemaVersion) {
        this.schemaVersion = 1;
    }
    next();
});

/**
 * Room Model
 * @class Room
 */
const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
