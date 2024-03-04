// api/trainedMuscle.js
const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await MongoClient.connect(uri);
    const db = client.db();
    cachedDb = db;
    return db;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Only POST method is allowed');
    }

    const { userId, muscleName } = req.body;

    if (!userId || !muscleName) {
        return res.status(400).send('UserId and muscleName are required in the request body.');
    }

    try {
        const db = await connectToDatabase(process.env.MONGODB_URI);
        const result = await db.collection('userMuscles').updateOne(
            { userId: userId },
            { $addToSet: { trainedMuscles: muscleName } },
            { upsert: true }
        );

        if (result.modifiedCount === 0 && result.upsertedCount === 0) {
            return res.status(404).send('User not found or muscle already added.');
        } else {
            return res.status(200).send({ message: 'Trained muscle updated successfully' });
        }
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).send('Internal Server Error');
    }
};