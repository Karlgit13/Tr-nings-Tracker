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
const resetUserMusclesRoute = require('./routes/resetUserMusclesRoute');
const getUserIdRoute = require('./routes/getUserIdRoute');
const userTrainedMusclesRoute = require('./routes/userTrainedMusclesRoute');


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



// ********** Start Server **********
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
