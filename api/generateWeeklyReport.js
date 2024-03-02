// /api/generateWeeklyReport.js
const { MongoClient } = require('mongodb');

let db;

// Connect to the database if not already connected
const connectToDatabase = async () => {
    if (db) return db;
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(); // Assuming you have a default database set in your connection string
    return db;
};

module.exports = async (req, res) => {
    // Check for a secret token to verify that the request is authorized
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const db = await connectToDatabase();

        // Accept GET requests by the cron job
        if (req.method === 'GET') {
            // Call your logic function to create the weekly report
            await createWeeklyReport(db);
            return res.status(200).send('Weekly report generated');
        } else {
            // If you want to handle other methods, you can add them here
            return res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Error generating weekly report:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the database connection if it was opened
        if (db) {
            await db.close();
        }
    }
};

const getWeekNumber = (date) => {
    const newDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    newDate.setUTCDate(newDate.getUTCDate() + 4 - (newDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((newDate - yearStart) / 86400000 + 1) / 7);
};

// Function to be run by the cron job
const createWeeklyReport = async (db) => {
    const today = new Date();
    const todaysWeekNumber = getWeekNumber(today);

    const users = await db.collection('userMuscles').find().toArray();
    for (const user of users) {
        const reportEntry = {
            userId: user.userId,
            trainedMuscles: user.trainedMuscles,
            weekOf: todaysWeekNumber
        };
        await db.collection('userWeeklyReport').insertOne(reportEntry);
    }
};