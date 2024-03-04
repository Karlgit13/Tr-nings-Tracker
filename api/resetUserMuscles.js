// api/resetUserMuscles.js
const { MongoClient } = require('mongodb');

let cachedDb = null;


async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    cachedDb = client.db();
    return cachedDb;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST method is allowed' });
    }

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'UserId is required in the request body' });
    }

    try {
        const db = await connectToDatabase(process.env.MONGODB_URI);
        const result = await db.collection('userMuscles').updateOne(
            { userId: userId },
            { $set: { trainedMuscles: [] } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User muscles have been reset' });
    } catch (error) {
        console.error('Failed to reset user muscles:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
