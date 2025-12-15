/**
 * Travel Controller (Server-Side Rendering)
 * Handles rendering travel pages with dynamic data from API
 * @module controllers/travel
 */

const axios = require('axios');

/**
 * GET travel page
 * Fetches trip data from API and renders travel page
 * @async
 */
module.exports.travel = async function(req, res, next) {
    try {
        // Fetch trips from API instead of static file
        const apiUrl = process.env.API_URL || 'http://localhost:3000/api/v1';
        const response = await axios.get(`${apiUrl}/trips`);
        
        res.render('travel', { 
            title: 'Travlr Getaways',
            trips: response.data 
        });
    } catch (error) {
        console.error('Error fetching trips:', error.message);
        // Fallback to empty array or error page
        res.render('travel', { 
            title: 'Travlr Getaways',
            trips: [],
            error: 'Unable to load trips at this time'
        });
    }
};