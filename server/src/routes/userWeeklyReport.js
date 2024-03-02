// routes/userWeeklyReport.js
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// Connect to the database if not already connected
async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    return client.db();
}

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).send('Missing userId parameter');
    }

    const db = await connectToDatabase();

    try {
        const weeklyReports = await db.collection('userWeeklyReport').find({ userId }).toArray();

        if (!weeklyReports.length) {
            return res.status(404).send('No weekly reports found for the given userId');
        }

        return res.status(200).json(weeklyReports);
    } catch (error) {
        console.error('Failed to fetch user weekly reports:', error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
