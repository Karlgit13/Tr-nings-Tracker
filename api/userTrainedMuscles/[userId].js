// Importera MongoDB-klienten om du behöver ansluta till en databas
const { MongoClient } = require('mongodb');

// En funktion för att ansluta till databasen, återanvänd gärna en tidigare etablerad anslutning
let cachedDb = null;
async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }
    const client = new MongoClient(uri);
    await client.connect();
    cachedDb = client.db(); // Ange databasnamnet här
    return cachedDb;
}

module.exports = async (req, res) => {
    const { userId } = req.query; // Dynamiskt parameter 'userId' extraheras från URL:en

    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }

    try {
        const db = await connectToDatabase(process.env.MONGODB_URI);
        const userMuscles = await db.collection('userMuscles').findOne({ userId });

        if (!userMuscles) {
            return res.status(200).json({ message: 'inget att hämta, gå till gymmet' });
        }
        return res.status(200).json(userMuscles);
    } catch (error) {
        console.error('Failed to fetch trained muscles:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
