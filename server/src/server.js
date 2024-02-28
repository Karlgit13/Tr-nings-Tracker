// ********** Environment Configurations **********
require('dotenv').config();

// ********** Module Imports **********
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// ********** Route Handlers Imports **********
const registerHandler = require('./handlers/registerHandler');
const loginHandler = require('./handlers/loginHandler');
const trainedMuscleHandler = require("./handlers/trainedMuscleHandler");

// ********** Routes Imports **********
const trainedMuscleRoutes = require('./routes/trainedMuscleRoutes');
const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/userRoutes");
const muscleGroupRoutes = require('./routes/muscleGroupRoutes');

// ********** Express App Setup **********
const app = express();
const PORT = process.env.PORT || 5000;

// ********** Middleware Setup **********
app.use(express.json()); // Parse JSON-payload från inkommande förfrågningar
app.use(cors()); // Allow CORS for all domains

// ********** Database Connection **********
let db;
const connectToDatabase = async () => {
    if (db) return db; // Return existing connection if it exists
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db();
    return db;
};

// Set up database connection in request object
app.use(async (req, res, next) => {
    req.db = await connectToDatabase();
    next();
});

// ********** Route Handlers Setup **********
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);
app.post('/api/trainedMuscle', trainedMuscleHandler);

// ********** Routes Setup **********
app.use(loginRoutes);
app.use(userRoutes);
app.use("/api", trainedMuscleRoutes);
app.use('/api', muscleGroupRoutes);

// ********** Custom Routes **********
// Route to fetch user ID by identifier
app.get('/api/getUserId', async (req, res) => {
    const identifier = req.query.identifier;
    if (!identifier) {
        return res.status(400).json({ error: 'Identifier is required' });
    }

    try {
        const user = await db.collection('users').findOne({ $or: [{ email: identifier }, { name: identifier }] });
        if (user) {
            res.json({ userId: user._id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch a user's trained muscles by user ID
app.get('/api/userTrainedMuscles/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userMuscles = await req.db.collection('userMuscles').findOne({ userId: userId });
        if (!userMuscles || !userMuscles.trainedMuscles || userMuscles.trainedMuscles.length === 0) {
            res.status(404).send('No trained muscles found for the user.');
        } else {
            res.json(userMuscles);
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// ********** Start Server **********
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
