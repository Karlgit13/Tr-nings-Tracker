// api/userMusclesTimer.js
const { MongoClient } = require('mongodb');

// Anslutningssträngen till din MongoDB - se till att detta är säkert hanterat i din miljökonfiguration
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Hämta userId från URL-parametern
            const { userId } = req.query;

            // Se till att klienten är ansluten till databasen
            await client.connect();
            const db = client.db(); // Lägg till din databasnamn här

            // Försök att hämta användarens träningsdata
            const userMusclesTimer = await db.collection('userMusclesTimer').findOne({ userId: userId });
            if (!userMusclesTimer) {
                return res.status(200).json({ message: 'User training times not found' });
            }

            // Skicka tillbaka användarens träningsdata
            return res.status(200).json(userMusclesTimer);
        } catch (error) {
            console.error('Database error:', error);
            return res.status(500).send('Internal Server Error');
        } finally {
            // Stäng anslutningen till databasen
            await client.close();
        }
    } else {
        // Hantera andra HTTP-metoder eller returnera ett fel
        res.status(405).send('Method Not Allowed');
    }
};
