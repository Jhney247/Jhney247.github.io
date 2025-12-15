/**
 * Main Application Entry Point
 * Travlr Express - Travel Booking Application
 * @module app
 */

require('dotenv').config(); // ✅ Load environment variables

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var cors = require('cors');
var helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./app_api/config/swagger');

var passport = require('passport');
require('./app_api/config/passport');

// ✅ Database connection
require('./app_api/models/db');

// ✅ Import routes
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');
var roomsRouter = require('./app_server/routes/rooms');
var mealsRouter = require('./app_server/routes/meals');
var newsRouter = require('./app_server/routes/news');
var apiRouter = require('./app_api/routes/index');

// ✅ Import middleware
const { apiLimiter } = require('./app_api/middleware/rateLimiter');
const { errorHandler } = require('./app_api/middleware/errorHandler');

var app = express();

// ✅ Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, enable in production with proper config
}));

// ✅ Enable CORS for Angular frontend with Authorization header
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// ✅ View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// ✅ Register handlebars partials
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

// ✅ Logging and parsing middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Serve static files and images
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ✅ Serve Angular admin app at /admin
const adminPath = path.join(__dirname, '..', 'app_admin', 'dist', 'travlr-admin', 'browser');
app.use('/admin', express.static(adminPath));

// Handle Angular routing - redirect all /admin/* requests to index.html
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
});

// ✅ Initialize passport
app.use(passport.initialize());

// ✅ API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Travlr API Documentation'
}));

// ✅ Apply rate limiting to API routes
app.use('/api', apiLimiter);

// ✅ Route configuration - Order matters!
// API routes first
app.use('/api', apiRouter);

// Admin interface (must be before other routes)
app.use('/users', usersRouter);

// SSR routes
app.use('/travel', travelRouter);
app.use('/rooms', roomsRouter);
app.use('/meals', mealsRouter);
app.use('/news', newsRouter);

// Home route last (catches remaining requests)
app.use('/', indexRouter);

// ✅ Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// ✅ Global error handler - must be last
app.use(errorHandler);

module.exports = app;