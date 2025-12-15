require('dotenv').config(); // ✅ Load environment variables

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var cors = require('cors'); // ✅ Added for CORS support

var passport = require('passport'); // ✅ Added for authentication
require('./app_api/config/passport'); // ✅ Load passport configuration

// ✅ Database connection
require('./app_api/models/db');

// ✅ Import routes
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');
var apiRouter = require('./app_api/routes/index'); // API Router

var app = express();

// ✅ Enable CORS for Angular frontend with Authorization header
app.use(cors({
  origin: 'http://localhost:4200', // Allow Angular app to connect
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'] // ✅ Added Authorization
}));

// ✅ View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// ✅ Register handlebars partials
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Serve static files and images
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(passport.initialize()); // ✅ Initialize passport

// ✅ Route configuration
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter); // API routes for Angular/Express link

// ✅ Catch unauthorized error and create 401
app.use((err, req, res, next) => {
  if(err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({"message": err.name + ": " + err.message});
  } else {
    next(err); // Pass to next error handler if not unauthorized
  }
});

// ✅ Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// ✅ Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;