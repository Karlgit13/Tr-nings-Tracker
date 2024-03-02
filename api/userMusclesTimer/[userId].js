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
    } else if (req.method === 'POST') {
        try {
            // Extract userId from URL parameters or body, depending on your API design
            const { userId } = req.body; // Or req.query, if you're passing userId in the query string

            // Ensure the client is connected to the database
            await client.connect();
            const db = client.db(); // Add your database name here

            // Attempt to retrieve the user's muscle data
            const userMuscles = await db.collection('userMusclesTimer').findOne({ userId: userId });

            // Check if userMuscles exists and has trainedMuscles
            if (!userMuscles || !userMuscles.trainedMuscles) {
                return res.status(404).json({ message: 'User training times not found' });
            }

            // Create the update object to reset all trainedUntil times
            const updateObject = {
                $set: {}
            };
            for (const muscle in userMuscles.trainedMuscles) {
                updateObject.$set[`trainedMuscles.${muscle}.trainedUntil`] = "";
            }

            // Perform the update
            const updateResult = await db.collection('userMusclesTimer').updateOne({ userId: userId }, updateObject);

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ message: 'User or muscle not found' });
            }

            res.json({ message: 'All muscle timers reset successfully' });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).send('Internal Server Error');
        } finally {
            // Close the database connection
            await client.close();
        }
    } else {
        // Handle other HTTP methods or return an error
        res.status(405).send('Method Not Allowed');
    }
};
