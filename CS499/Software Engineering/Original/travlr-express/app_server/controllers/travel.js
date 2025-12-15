var fs = require('fs');

/* GET travel page */
module.exports.travel = function(req, res, next) {
    // Read the trips data from JSON file
    var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));
    
    res.render('travel', { 
        title: 'Travlr Getaways',
        trips: trips 
    });
};