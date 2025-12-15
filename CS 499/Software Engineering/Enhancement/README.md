# Travlr - Travel Booking Application

A full-stack MEAN (MongoDB, Express, Angular, Node.js) travel booking application with comprehensive authentication, authorization, and admin management features.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

## ✨ Features

### User Features
- Browse travel packages, rooms, meals, and news
- View detailed information about destinations
- Responsive design for all devices
- Real-time data updates from API

### Admin Features
- Full CRUD operations for trips, rooms, meals, and news
- Secure admin authentication with JWT
- Role-based access control (RBAC)
- Protected admin routes and API endpoints

### Technical Features
- RESTful API with versioning (v1)
- JWT-based authentication with refresh tokens
- Bcrypt password hashing
- Input validation and sanitization
- Rate limiting for security
- Comprehensive error handling
- CORS configuration
- API documentation with Swagger
- MongoDB with Mongoose ODM
- Service layer architecture
- Comprehensive JSDoc documentation

## 🏗️ Architecture

### Backend Architecture (Express.js)

```
travlr-express/
├── app_api/                    # API Layer
│   ├── config/                 # Configuration files
│   │   ├── passport.js        # Passport authentication config
│   │   └── swagger.js         # Swagger API documentation config
│   ├── controllers/           # Request handlers
│   │   ├── authentication.js  # Auth controller
│   │   ├── trips.js          # Trip controller
│   │   ├── rooms.js          # Room controller
│   │   ├── meals.js          # Meal controller
│   │   └── news.js           # News controller
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # JWT authentication & authorization
│   │   ├── validation.js     # Input validation rules
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── errorHandler.js   # Error handling
│   ├── models/                # Mongoose models
│   │   ├── db.js             # Database connection
│   │   ├── user.js           # User model
│   │   ├── travlr.js         # Trip model
│   │   ├── room.js           # Room model
│   │   ├── meal.js           # Meal model
│   │   ├── news.js           # News model
│   │   └── seed.js           # Database seeder
│   ├── routes/                # API routes
│   │   ├── index.js          # Main router
│   │   └── v1/               # Version 1 routes
│   │       ├── index.js      # V1 main router
│   │       ├── auth.js       # Auth routes
│   │       ├── trips.js      # Trip routes
│   │       ├── rooms.js      # Room routes
│   │       ├── meals.js      # Meal routes
│   │       └── news.js       # News routes
│   └── services/              # Business logic layer
│       ├── authService.js    # Authentication service
│       ├── tripService.js    # Trip service
│       ├── roomService.js    # Room service
│       ├── mealService.js    # Meal service
│       └── newsService.js    # News service
├── app_server/                # Server-side rendering
│   ├── controllers/          # SSR controllers
│   ├── routes/               # SSR routes
│   └── views/                # Handlebars templates
├── public/                    # Static files
└── app.js                    # Express app entry point
```

### Frontend Architecture (Angular Admin)

```
app_admin/
├── src/
│   ├── app/
│   │   ├── services/         # Angular services
│   │   │   ├── trip-data.service.ts
│   │   │   └── authentication.service.ts
│   │   ├── models/           # TypeScript models
│   │   ├── login/            # Login component
│   │   ├── navbar/           # Navigation component
│   │   ├── trip-listing/     # Trip list component
│   │   ├── trip-card/        # Trip card component
│   │   ├── add-trip/         # Add trip component
│   │   ├── edit-trip/        # Edit trip component
│   │   ├── utils/            # Utilities (JWT interceptor)
│   │   ├── app.config.ts     # App configuration
│   │   └── app.routes.ts     # Routing configuration
│   └── assets/               # Static assets
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express.js 4.16.x
- **Database**: MongoDB 8.x
- **ODM**: Mongoose 8.18.x
- **Authentication**: 
  - JSON Web Tokens (jsonwebtoken 9.0.x)
  - Passport.js (passport 0.7.x)
  - Bcrypt (bcrypt 5.x)
- **Validation**: express-validator
- **Security**: 
  - Helmet.js
  - CORS
  - express-rate-limit
- **Documentation**: 
  - Swagger UI Express
  - swagger-jsdoc
  - JSDoc

### Frontend
- **Framework**: Angular 20.3.x
- **Language**: TypeScript 5.9.x
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular Forms

### Development Tools
- **Package Manager**: npm
- **Environment Variables**: dotenv
- **Containerization**: Docker & Docker Compose
- **Database UI**: Mongo Express

## 📦 Prerequisites

- Node.js (v22.x or higher)
- npm (v10.x or higher)
- MongoDB (v8.x or higher) or Docker
- Angular CLI (v20.x or higher)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd jason-eportfolio
```

### 2. Backend Setup

```bash
cd travlr-express
npm install
```

### 3. Frontend Setup(Angular Admin)

```bash
cd ../app_admin
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `travlr-express` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://root:root@127.0.0.1:27017/travlr?authSource=admin
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=root

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_ACCESS_SECRET=access_secret_key_change_me
JWT_REFRESH_SECRET=refresh_secret_key_change_me
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Server Configuration
PORT=3000
NODE_ENV=development
```

**⚠️ Security Note**: Change all secret keys in production!

### Database Setup

#### Option 1: Using Docker (Recommended for Development)

The project includes a dev container with MongoDB. Simply start the container:

```bash
# MongoDB will be available at mongodb://root:root@127.0.0.1:27017
# Mongo Express UI available at http://localhost:8081
```

#### Option 2: Local MongoDB Installation

Install MongoDB locally and update the `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/travlr
```

### Seed Database

Populate the database with initial data:

```bash
cd travlr-express
npm run seed
```

This creates:
- 3 sample trips
- 2 sample rooms
- 2 sample meals
- 2 sample news articles
- Admin user: `admin@travlr.com` / `Admin@123`

## 🎯 Running the Application

### Development Mode

#### Backend Only
```bash
cd travlr-express
npm start
# Server runs on http://localhost:3000
```

#### Frontend Only(Angular Admin)
```bash
cd app_admin
npm start
# Angular app runs on http://localhost:4200
```

#### Both (Recommended)
```bash
cd travlr-express
npm run dev
# Runs both backend and frontend concurrently
```

### Production Mode

```bash
# Build Angular app
cd app_admin
npm run build

# The built files will be in dist/
# Serve them with your preferred web server or integrate with Express
```

## 📚 API Documentation

### Swagger UI

Once the backend is running, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

### API Endpoints Overview

#### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh access token
- `GET /profile` - Get current user profile (Protected)

#### Trips (`/api/v1/trips`)
- `GET /` - Get all trips (Public)
- `GET /:tripCode` - Get trip by code (Public)
- `POST /` - Create trip (Admin only)
- `PUT /:tripCode` - Update trip (Admin only)
- `DELETE /:tripCode` - Delete trip (Admin only)

#### Rooms (`/api/v1/rooms`)
- `GET /` - Get all rooms (Public)
- `GET /:roomCode` - Get room by code (Public)
- `POST /` - Create room (Admin only)
- `PUT /:roomCode` - Update room (Admin only)
- `DELETE /:roomCode` - Delete room (Admin only)

#### Meals (`/api/v1/meals`)
- `GET /` - Get all meals (Public)
- `GET /:mealCode` - Get meal by code (Public)
- `POST /` - Create meal (Admin only)
- `PUT /:mealCode` - Update meal (Admin only)
- `DELETE /:mealCode` - Delete meal (Admin only)

#### News (`/api/v1/news`)
- `GET /` - Get all news (Public)
- `GET /:newsCode` - Get news by code (Public)
- `POST /` - Create news (Admin only)
- `PUT /:newsCode` - Update news (Admin only)
- `DELETE /:newsCode` - Delete news (Admin only)

### Authentication

Protected endpoints require a JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/v1/trips
```

### Example API Calls

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@travlr.com",
    "password": "Admin@123"
  }'
```

#### Get Trips
```bash
curl http://localhost:3000/api/v1/trips
```

#### Create Trip (Admin)
```bash
curl -X POST http://localhost:3000/api/v1/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "NEWD",
    "name": "New Destination",
    "length": "5 days",
    "start": "2024-08-01",
    "resort": "Paradise Resort",
    "perPerson": "2999.00",
    "image": "images/new.jpg",
    "description": "Amazing new destination..."
  }'
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Long-lived tokens for seamless re-authentication
- **Password Hashing**: Bcrypt with salt rounds (10)
- **Role-Based Access Control**: User and Admin roles
- **Token Expiration**: 1-hour access tokens, 7-day refresh tokens

### API Security
- **Rate Limiting**: 
  - General API: 100 requests/15 minutes
  - Auth endpoints: 5 requests/15 minutes
  - Write operations: 20 requests/hour
- **CORS**: Configured for specific origins
- **Helmet.js**: Security headers
- **Input Validation**: express-validator on all inputs
- **Input Sanitization**: Trim and normalize all inputs
- **Error Handling**: No sensitive data in error responses

### Database Security
- **Mongoose Schema Validation**: Built-in validation
- **Unique Constraints**: Prevent duplicate records
- **Index Optimization**: Improved query performance

## 🧪 Testing

### Manual Testing

1. **Start the application**
```bash
npm run dev
```

2. **Test Login**
   - Navigate to http://localhost:4200
   - Login with `admin@travlr.com` / `Admin@123`

3. **Test CRUD Operations**
   - Add, edit, delete trips, rooms, meals, news
   - Verify authentication requirements

### API Testing with curl

See [Example API Calls](#example-api-calls) section

## 📁 Project Structure

```
jason-eportfolio/
├── .devcontainer/              # Dev container configuration
│   ├── Dockerfile
│   └── docker-compose.yml
├── app_admin/                  # Angular admin frontend
├── travlr-express/            # Express backend
│   ├── app_api/               # API layer
│   ├── app_server/            # SSR layer
│   ├── bin/                   # Executable scripts
│   ├── data/                  # Seed data
│   ├── public/                # Static files
│   ├── logs/                  # Log files
│   ├── app.js                 # Express app
│   ├── package.json
│   └── .env                   # Environment variables
└── README.md                  # This file
```

## 👨‍💻 Development

### Code Style
- **Backend**: Follow Node.js best practices
- **Frontend**: Follow Angular style guide
- **Documentation**: JSDoc for all functions

### Adding New Features

1. **Create Model** (if needed)
   ```javascript
   // app_api/models/newModel.js
   const mongoose = require('mongoose');
   const schema = new mongoose.Schema({ ... });
   module.exports = mongoose.model('modelName', schema);
   ```

2. **Create Service**
   ```javascript
   // app_api/services/newService.js
   const Model = require('../models/newModel');
   // Implement business logic
   ```

3. **Create Controller**
   ```javascript
   // app_api/controllers/newController.js
   const service = require('../services/newService');
   const { asyncHandler } = require('../middleware/errorHandler');
   // Implement handlers
   ```

4. **Create Routes**
   ```javascript
   // app_api/routes/v1/newRoutes.js
   const controller = require('../../controllers/newController');
   // Define routes
   ```

5. **Add to Main Router**
   ```javascript
   // app_api/routes/v1/index.js
   const newRoutes = require('./newRoutes');
   router.use('/newpath', newRoutes);
   ```

## 🚀 Deployment

### Backend Deployment

1. **Set Environment Variables**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=your_production_mongodb_uri
   export JWT_SECRET=your_production_secret
   ```

2. **Install Dependencies**
   ```bash
   npm install --production
   ```

3. **Start Application**
   ```bash
   npm start
   # Or use PM2 for production
   pm2 start bin/www --name travlr-api
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd app_admin
   npm run build
   ```

2. **Deploy dist/ folder** to your web server or CDN

### Docker Deployment

```bash
docker build -t travlr-app .
docker run -p 3000:3000 -p 4200:4200 travlr-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of an academic portfolio.

## 👤 Author

Created as part of Southern New Hampshire University Computer Science program.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Express.js community
- MongoDB team
- All open-source contributors
