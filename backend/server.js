const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Allow specific origin in production
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
const { tenantHandler } = require('./middleware/tenantMiddleware');
app.use(tenantHandler);

const { seedAllData } = require('./seed_data');

// Database Connection
const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';

        console.log("Attempting to connect to DB...");

        // Only use MongoMemoryServer if MONGO_URI is NOT specified in .env
        if (!process.env.MONGO_URI) {
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                console.log("No MONGO_URI found. Starting MongoMemoryServer setup...");
                const mongod = await MongoMemoryServer.create();
                uri = mongod.getUri();
                console.log(`Using In-Memory MongoDB: ${uri}`);
            } catch (msError) {
                console.log("MongoMemoryServer not available, using default local URI.");
            }
        }

        console.log(`Connecting to Mongoose URI: ${uri}`);
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Auto-seed data on startup if database is empty
        const userCount = await mongoose.model('User').countDocuments();
        if (userCount === 0) {
            await seedAllData();
        }
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api/tenants', require('./routes/tenantRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
