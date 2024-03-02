// /api/generateWeeklyReport.js
const { MongoClient } = require('mongodb');

let db;

// Connect to the database if not already connected
const connectToDatabase = async () => {
    if (db) return db;
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(); // Assuming you have a default database set in your connection string
    return db;
};

module.exports = async (req, res) => {
    // Only allow this endpoint to be called with a POST request
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Check for a secret token to verify that the request is authorized
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const db = await connectToDatabase();
        // Call your logic function to create the weekly report
        await createWeeklyReport(db);

        res.status(200).send('Weekly report generated');
    } catch (error) {
        console.error('Error generating weekly report:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to be run every Sunday at 23:00
const createWeeklyReport = async (db) => {
    const users = await db.collection('userMuscles').find().toArray();

    for (const user of users) {
        const reportEntry = {
            userId: user.userId,
            trainedMuscles: user.trainedMuscles,
            weekOf: new Date() // Adjust as needed for the start of the week
        };

        await db.collection('userWeeklyReport').insertOne(reportEntry);
    }
};
