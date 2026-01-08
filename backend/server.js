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
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering to fail fast if not connected
        };

        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';
        console.log(`Connecting to Mongoose URI: ${uri}`);

        cached.promise = mongoose.connect(uri, opts).then(async (mongoose) => {
            console.log('MongoDB Connected');

            // Seed data only if we are connected and it's a fresh DB
            try {
                const userCount = await mongoose.model('User').countDocuments();
                if (userCount === 0) {
                    await seedAllData();
                }
            } catch (seedError) {
                console.error("Seeding error:", seedError);
            }

            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

// Ensure DB is connected for every request (Middleware)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failure:", error);
        res.status(500).json({ message: "Database Config Error" });
    }
});

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

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
