/**
 * Meals Controller (Server-Side Rendering)
 * Handles rendering meals pages with dynamic data from API
 * @module controllers/meals
 */

const axios = require('axios');

/**
 * GET meals page
 * Fetches meal data from API and renders meals page
 * @async
 */
module.exports.meals = async function(req, res, next) {
    try {
        // Fetch meals from API
        const apiUrl = process.env.API_URL || 'http://localhost:3000/api/v1';
        const response = await axios.get(`${apiUrl}/meals`);
        
        res.render('meals', { 
            title: 'Travlr Getaways - Meals',
            meals: response.data 
        });
    } catch (error) {
        console.error('Error fetching meals:', error.message);
        // Fallback to empty array or error page
        res.render('meals', { 
            title: 'Travlr Getaways - Meals',
            meals: [],
            error: 'Unable to load meals at this time'
        });
    }
};
