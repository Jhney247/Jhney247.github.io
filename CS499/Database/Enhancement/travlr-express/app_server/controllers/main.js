/**
 * Main Controller (Server-Side Rendering)
 * Handles rendering main pages
 * @module controllers/main
 */

/**
 * GET home page
 * Renders the home page
 */
const index = (req, res) => {
    res.render('index', { title: 'Travlr Getaways' });
};

module.exports = {
    index
};