// api/userTrainedMuscles.js
const { MongoClient } = require('mongodb');

// Reuse the database connection
let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await MongoClient.connect(uri);
    const db = client.db(); // Explicitly specify the database name
    cachedDb = db;
    return db;
}

module.exports = async (req, res) => {
    const { userId } = req.query; // Access the userId query parameter

    if (!userId) {
        return res.status(400).send('UserId is required as a query parameter.');
    }

    try {
        const db = await connectToDatabase(process.env.MONGODB_URI);
        const userMuscles = await db.collection('userMuscles').findOne({ userId: userId });

        if (!userMuscles || !userMuscles.trainedMuscles || userMuscles.trainedMuscles.length === 0) {
            return res.status(404).send('No trained muscles found for the user.');
        } else {
            return res.json(userMuscles);
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).send('Internal Server Error');
    }
    // No need to explicitly close the database connection, as it's managed by the serverless environment
};
