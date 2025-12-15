/**
 * Room Model
 * Defines the schema for hotel rooms in the Travlr application
 * @module models/room
 */

const mongoose = require('mongoose');

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
        uppercase: true
    },
    name: { 
        type: String, 
        required: [true, 'Room name is required'],
        index: true,
        trim: true
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
        min: [1, 'Minimum occupancy is 1']
    },
    pricePerNight: { 
        type: String, 
        required: [true, 'Price per night is required']
    },
    image: { 
        type: String, 
        required: [true, 'Room image is required']
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
        default: true
    }
}, {
    timestamps: true
});

/**
 * Room Model
 * @class Room
 */
const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
