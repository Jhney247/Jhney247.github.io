/**
 * Passport Authentication Configuration
 * Local strategy for email/password authentication
 * @module config/passport
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

/**
 * Configure Passport Local Strategy
 * Uses email as username field and validates against stored password hash
 */
passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username.toLowerCase() }).exec();
            
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            
            // Async password validation
            const isValid = await user.validPassword(password);
            
            if (!isValid) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));