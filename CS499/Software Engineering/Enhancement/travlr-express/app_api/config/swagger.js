/**
 * Swagger API Documentation Configuration
 * @module config/swagger
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Travlr API Documentation',
            version: '1.0.0',
            description: 'Comprehensive API documentation for the Travlr travel booking application',
            contact: {
                name: 'Travlr Support',
                email: 'support@travlr.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Development server (v1)'
            },
            {
                url: 'http://localhost:3000/api',
                description: 'Base API endpoint'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT authorization token'
                }
            },
            schemas: {
                Trip: {
                    type: 'object',
                    required: ['code', 'name', 'length', 'start', 'resort', 'perPerson', 'image', 'description'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated MongoDB ID'
                        },
                        code: {
                            type: 'string',
                            description: 'Unique trip code (uppercase)',
                            example: 'GALR'
                        },
                        name: {
                            type: 'string',
                            description: 'Trip name',
                            example: 'Gale Reef'
                        },
                        length: {
                            type: 'string',
                            description: 'Trip duration',
                            example: '4 days'
                        },
                        start: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Trip start date',
                            example: '2024-06-01T00:00:00.000Z'
                        },
                        resort: {
                            type: 'string',
                            description: 'Resort/hotel name',
                            example: 'Gale Reef Resort & Spa'
                        },
                        perPerson: {
                            type: 'string',
                            description: 'Price per person',
                            example: '2199.00'
                        },
                        image: {
                            type: 'string',
                            description: 'Image URL/path',
                            example: 'images/reef1.jpg'
                        },
                        description: {
                            type: 'string',
                            description: 'Trip description'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Room: {
                    type: 'object',
                    required: ['code', 'name', 'type', 'beds', 'maxOccupancy', 'pricePerNight', 'image', 'description'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated MongoDB ID'
                        },
                        code: {
                            type: 'string',
                            description: 'Unique room code',
                            example: 'DLX01'
                        },
                        name: {
                            type: 'string',
                            description: 'Room name',
                            example: 'Deluxe Ocean View'
                        },
                        type: {
                            type: 'string',
                            enum: ['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Family'],
                            example: 'Deluxe'
                        },
                        beds: {
                            type: 'integer',
                            minimum: 1,
                            example: 2
                        },
                        maxOccupancy: {
                            type: 'integer',
                            minimum: 1,
                            example: 4
                        },
                        pricePerNight: {
                            type: 'string',
                            example: '299.00'
                        },
                        image: {
                            type: 'string',
                            example: 'images/room1.jpg'
                        },
                        description: {
                            type: 'string'
                        },
                        amenities: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            example: ['WiFi', 'AC', 'TV', 'Mini Bar']
                        },
                        available: {
                            type: 'boolean',
                            default: true
                        }
                    }
                },
                Meal: {
                    type: 'object',
                    required: ['code', 'name', 'cuisine', 'mealType', 'price', 'image', 'description'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        code: {
                            type: 'string',
                            example: 'MLT01'
                        },
                        name: {
                            type: 'string',
                            example: 'Mediterranean Feast'
                        },
                        cuisine: {
                            type: 'string',
                            example: 'Mediterranean'
                        },
                        mealType: {
                            type: 'string',
                            enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
                            example: 'Dinner'
                        },
                        price: {
                            type: 'string',
                            example: '45.00'
                        },
                        image: {
                            type: 'string',
                            example: 'images/meal1.jpg'
                        },
                        description: {
                            type: 'string'
                        },
                        ingredients: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        allergens: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        vegetarian: {
                            type: 'boolean',
                            default: false
                        },
                        vegan: {
                            type: 'boolean',
                            default: false
                        },
                        glutenFree: {
                            type: 'boolean',
                            default: false
                        }
                    }
                },
                News: {
                    type: 'object',
                    required: ['code', 'title', 'category', 'author', 'publishDate', 'image', 'summary', 'content'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        code: {
                            type: 'string',
                            example: 'NEWS01'
                        },
                        title: {
                            type: 'string',
                            example: 'New Destinations for Summer 2024'
                        },
                        category: {
                            type: 'string',
                            enum: ['Travel Tips', 'Destination Guide', 'Company News', 'Special Offers', 'Events', 'General'],
                            example: 'Company News'
                        },
                        author: {
                            type: 'string',
                            example: 'John Smith'
                        },
                        publishDate: {
                            type: 'string',
                            format: 'date-time'
                        },
                        image: {
                            type: 'string',
                            example: 'images/news1.jpg'
                        },
                        summary: {
                            type: 'string',
                            maxLength: 500
                        },
                        content: {
                            type: 'string'
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        featured: {
                            type: 'boolean',
                            default: false
                        },
                        published: {
                            type: 'boolean',
                            default: true
                        }
                    }
                },
                User: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            default: 'user'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        },
                        error: {
                            type: 'string'
                        },
                        details: {
                            type: 'object'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        },
                        token: {
                            type: 'string',
                            description: 'JWT access token'
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'JWT refresh token'
                        },
                        user: {
                            $ref: '#/components/schemas/User'
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication token is missing or invalid',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'User does not have permission to access this resource',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Validation failed',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints'
            },
            {
                name: 'Trips',
                description: 'Travel trip management endpoints'
            },
            {
                name: 'Rooms',
                description: 'Hotel room management endpoints'
            },
            {
                name: 'Meals',
                description: 'Dining/meal management endpoints'
            },
            {
                name: 'News',
                description: 'News article management endpoints'
            }
        ]
    },
    apis: ['./app_api/routes/v1/*.js', './app_api/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
