/**
 * News Controller (Server-Side Rendering)
 * Handles rendering news pages with dynamic data from API
 * @module controllers/news
 */

const axios = require('axios');

/**
 * GET news page
 * Fetches news data from API and renders news page
 * @async
 */
module.exports.news = async function(req, res, next) {
    try {
        // Fetch news from API
        const apiUrl = process.env.API_URL || 'http://localhost:3000/api/v1';
        const response = await axios.get(`${apiUrl}/news`);
        
        res.render('news', { 
            title: 'Travlr Getaways - News',
            news: response.data 
        });
    } catch (error) {
        console.error('Error fetching news:', error.message);
        // Fallback to empty array or error page
        res.render('news', { 
            title: 'Travlr Getaways - News',
            news: [],
            error: 'Unable to load news at this time'
        });
    }
};
