// ********** Environment Configurations **********
require('dotenv').config();

// ********** Module Imports **********
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');

// ********** Route Handlers Imports **********
const registerHandler = require('./handlers/registerHandler');
const loginHandler = require('./handlers/loginHandler');
const trainedMuscleHandler = require("./handlers/trainedMuscleHandler");

// ********** Routes Imports **********
const trainedMuscleRoutes = require('./routes/trainedMuscleRoutes');
const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/userRoutes");
const muscleGroupRoutes = require('./routes/muscleGroupRoutes');
const resetUserMusclesRoute = require('./routes/resetUserMusclesRoute');
const getUserIdRoute = require('./routes/getUserIdRoute');
const userTrainedMusclesRoute = require('./routes/userTrainedMusclesRoute');
const markMuscleTrainedRoutes = require('./routes/markMuscleTrainedRoutes');
const userMusclesTimerRoutes = require('./routes/userMusclesTimerRoutes');
const userWeeklyReportRoutes = require('./routes/userWeeklyReport');


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
    const client = await MongoClient.connect(process.env.MONGODB_URI);
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
app.use('/api/resetUserMuscles', resetUserMusclesRoute);
app.use('/api/getUserId', getUserIdRoute);
app.use('/api/userTrainedMuscles', userTrainedMusclesRoute);
app.use("/api", markMuscleTrainedRoutes)
app.use('/api', userMusclesTimerRoutes);
app.use('/api/userWeeklyReport', userWeeklyReportRoutes);



// ********** Start Server **********
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Function to be run every Sunday at 23:00
const createWeeklyReport = async () => {
    // Connect to the database if not already connected
    await connectToDatabase();

    // Query all users' trained muscles data
    const users = await db.collection('userMuscles').find().toArray();

    // Iterate over each user and create a weekly report
    for (const user of users) {
        // Create a report entry for the current week
        const reportEntry = {
            userId: user.userId,
            trainedMuscles: user.trainedMuscles,
            weekOf: new Date() // This date can be adjusted to the beginning of the current week if necessary
        };

        // Insert the report entry into the userWeeklyReport collection
        await db.collection('userWeeklyReport').insertOne(reportEntry);
    }
};

// Schedule the function to run every Sunday at 23:00
cron.schedule('0 23 * * 0', () => {
    createWeeklyReport();
});