const mongoose = require('mongoose');
const Trip = require('./travlr');
const fs = require('fs');

// Database connection
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

// Connect to MongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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

// Seed the database
async function seedDatabase() {
    try {
        // Remove existing data
        await Trip.deleteMany({});
        console.log('Existing trip data removed');

        // Read JSON data
        const tripsData = JSON.parse(fs.readFileSync('../../data/trips.json', 'utf8'));
        
        // Insert new data
        const result = await Trip.insertMany(tripsData);
        console.log(`${result.length} trips have been added to the database`);
        
        // Display seeded data
        console.log('Seeded trips:');
        result.forEach(trip => {
            console.log(`- ${trip.name} (${trip.code}) - ${trip.length} - $${trip.perPerson}`);
        });

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});