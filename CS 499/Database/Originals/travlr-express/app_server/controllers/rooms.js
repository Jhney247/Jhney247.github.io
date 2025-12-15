/**
 * Rooms Controller (Server-Side Rendering)
 * Handles rendering rooms pages with dynamic data from API
 * @module controllers/rooms
 */

const axios = require('axios');

/**
 * GET rooms page
 * Fetches room data from API and renders rooms page
 * @async
 */
module.exports.rooms = async function(req, res, next) {
    try {
        // Fetch rooms from API
        const apiUrl = process.env.API_URL || 'http://localhost:3000/api/v1';
        const response = await axios.get(`${apiUrl}/rooms`);
        
        res.render('rooms', { 
            title: 'Travlr Getaways - Rooms',
            rooms: response.data 
        });
    } catch (error) {
        console.error('Error fetching rooms:', error.message);
        // Fallback to empty array or error page
        res.render('rooms', { 
            title: 'Travlr Getaways - Rooms',
            rooms: [],
            error: 'Unable to load rooms at this time'
        });
    }
};
