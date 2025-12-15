/**
 * Database Seeder
 * Populates the database with initial sample data
 * @module models/seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('./travlr');
const Room = require('./room');
const Meal = require('./meal');
const News = require('./news');
const User = require('./user');
const fs = require('fs');
const path = require('path');

// Database connection - use MONGODB_URI from .env or fallback
const dbURI = process.env.MONGODB_URI || `mongodb://root:root@127.0.0.1:27017/travlr?authSource=admin`;

// Connect to MongoDB
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
    seedDatabase();
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Sample data for new collections
const rooms = [
    {
        code: 'DLX01',
        name: 'Deluxe Ocean View',
        type: 'Deluxe',
        beds: 2,
        maxOccupancy: 4,
        pricePerNight: '299.00',
        image: 'images/room1.jpg',
        description: 'Spacious deluxe room with stunning ocean views, private balcony, and modern amenities.',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe', 'Balcony'],
        available: true
    },
    {
        code: 'STE01',
        name: 'Presidential Suite',
        type: 'Suite',
        beds: 3,
        maxOccupancy: 6,
        pricePerNight: '599.00',
        image: 'images/room2.jpg',
        description: 'Luxurious presidential suite with separate living area, panoramic ocean views, and premium amenities.',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe', 'Balcony', 'Jacuzzi', 'Butler Service'],
        available: true
    }
];

const meals = [
    {
        code: 'MLT01',
        name: 'Mediterranean Feast',
        cuisine: 'Mediterranean',
        mealType: 'Dinner',
        price: '45.00',
        image: 'images/meal1.jpg',
        description: 'Authentic Mediterranean cuisine featuring fresh seafood, grilled vegetables, and aromatic herbs.',
        ingredients: ['Fresh Fish', 'Olive Oil', 'Tomatoes', 'Herbs'],
        allergens: ['Fish', 'Gluten'],
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        available: true
    },
    {
        code: 'BRK01',
        name: 'Continental Breakfast',
        cuisine: 'International',
        mealType: 'Breakfast',
        price: '25.00',
        image: 'images/meal2.jpg',
        description: 'Start your day with a delicious continental breakfast featuring fresh pastries, fruits, and beverages.',
        ingredients: ['Pastries', 'Fresh Fruits', 'Coffee', 'Juice'],
        allergens: ['Gluten', 'Dairy'],
        vegetarian: true,
        vegan: false,
        glutenFree: false,
        available: true
    }
];

const news = [
    {
        code: 'NEWS01',
        title: 'New Destinations for Summer 2024',
        category: 'Company News',
        author: 'Travel Team',
        publishDate: new Date('2024-01-15'),
        image: 'images/news1.jpg',
        summary: 'Discover our exciting new destinations for the upcoming summer season. Book now for early bird discounts!',
        content: 'We are thrilled to announce our new destinations for Summer 2024. Explore pristine beaches, exotic cultures, and unforgettable experiences. Our carefully curated packages offer the best value for your money. Book now and save up to 30% with our early bird specials.',
        tags: ['Summer', 'Destinations', 'Special Offers'],
        featured: true,
        published: true
    },
    {
        code: 'NEWS02',
        title: 'Travel Safety Tips for 2024',
        category: 'Travel Tips',
        author: 'Safety Expert',
        publishDate: new Date('2024-02-01'),
        image: 'images/news2.jpg',
        summary: 'Essential travel safety tips to ensure a worry-free vacation experience.',
        content: 'Travel safety is our top priority. Here are essential tips for a safe journey: Keep copies of important documents, stay aware of your surroundings, use hotel safes, and purchase travel insurance. Follow local guidelines and emergency protocols.',
        tags: ['Safety', 'Tips', 'Travel Advice'],
        featured: false,
        published: true
    }
];

// Seed the database
async function seedDatabase() {
    try {
        console.log('\n🌱 Starting database seeding...\n');

        // Remove existing data
        await Trip.deleteMany({});
        await Room.deleteMany({});
        await Meal.deleteMany({});
        await News.deleteMany({});
        await User.deleteMany({});
        console.log('✓ Cleared existing data');

        // Read and insert trips from JSON file
        const dataFilePath = path.join(__dirname, '..', '..', 'data', 'trips.json');
        if (fs.existsSync(dataFilePath)) {
            const tripsData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
            await Trip.insertMany(tripsData);
            console.log(`✓ Inserted ${tripsData.length} trips`);
        } else {
            console.log('⚠ trips.json not found, skipping trip data');
        }

        // Insert rooms
        await Room.insertMany(rooms);
        console.log(`✓ Inserted ${rooms.length} rooms`);

        // Insert meals
        await Meal.insertMany(meals);
        console.log(`✓ Inserted ${meals.length} meals`);

        // Insert news
        await News.insertMany(news);
        console.log(`✓ Inserted ${news.length} news articles`);

        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@travlr.com',
            role: 'admin'
        });
        await adminUser.setPassword('Admin@123');
        await adminUser.save();
        console.log('✓ Created admin user');

        // Create regular user
        const regularUser = new User({
            name: 'Test User',
            email: 'user@travlr.com',
            role: 'user'
        });
        await regularUser.setPassword('User@123');
        await regularUser.save();
        console.log('✓ Created test user');

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('   Admin: admin@travlr.com / Admin@123');
        console.log('   User:  user@travlr.com / User@123\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        if (mongoose && mongoose.connection && mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('Database connection closed');
        }
    }
}

// Handle process termination
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});