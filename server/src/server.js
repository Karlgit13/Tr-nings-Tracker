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
const userMusclesTimerRoutes = require('./routes/userMusclesTimerRoutes');
const getUserWeeklyReportRoute = require('./routes/getUserWeeklyReport');
// Combined import for marking and unmarking muscles as trained
const muscleTrainingRoute = require('./routes/muscleTraining');




// ********** Express App Setup **********
const app = express();
const PORT = process.env.PORT || 5000;

// ********** Middleware Setup **********
app.use(express.json()); // Parse JSON-payload från inkommande förfrågningar
app.use(cors()); // Allow CORS for all domains

// ********** Database Connection **********
let db;
const connectToDatabase = async () => {
    if (db) return db;
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
app.use('/api', userMusclesTimerRoutes);
app.use('/api/getUserWeeklyReport', getUserWeeklyReportRoute);
app.use("/api", muscleTrainingRoute);


const createWeeklyReport = async () => {
    await connectToDatabase();

    const users = await db.collection('userMuscles').find().toArray();
    for (const user of users) {
        const reportEntry = {
            userId: user.userId,
            trainedMuscles: user.trainedMuscles,
            weekOf: new Date()
        };
        await db.collection('userWeeklyReport').insertOne(reportEntry);
    }
};

cron.schedule('0 23 * * 0', () => {
    createWeeklyReport();
});


// ********** Start Server **********
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


