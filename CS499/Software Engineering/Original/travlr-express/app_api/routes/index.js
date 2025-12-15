const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if(authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }
    
    let headers = authHeader.split(' ');
    if(headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }
    
    const token = authHeader.split(' ')[1];
    
    if(token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if(err) {
            return res.sendStatus(401).json('Token Validation Error!');
        }
        req.auth = verified; // Set the auth param to the decoded object
    });
    
    next(); // We need to continue or this will hang forever
}

// GET all trips
router.get('/trips', tripsController.tripsList);

// GET single trip by code
router.get('/trips/:tripCode', tripsController.tripsFindByCode);

// POST - Add new trip (PROTECTED)
router.post('/trips', authenticateJWT, tripsController.tripsAddTrip);

// PUT - Update trip by code (PROTECTED)
router.put('/trips/:tripCode', authenticateJWT, tripsController.tripsUpdateTrip);

// DELETE - Remove trip by code (optional for now)
router.delete('/trips/:tripCode', tripsController.tripsDeleteTrip);

// Authentication routes
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

module.exports = router;