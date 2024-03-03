// api/userMusclesTimer.js
const { MongoClient } = require('mongodb');

// Connection string to your MongoDB - ensure this is securely handled in your environment configuration
const uri = process.env.MONGODB_URI;

// Function to connect to the database
async function connectToDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
}

module.exports = async (req, res) => {
    let client;

    try {
        // Connect to the database
        client = await connectToDatabase();
        const db = client.db(); // Add your database name here if needed

        if (req.method === 'GET') {
            // Hämta userId från URL-parametern
            const { userId } = req.query;

            // Försök att hämta användarens träningsdata
            const userMusclesTimer = await db.collection('userMusclesTimer').findOne({ userId: userId });
            if (!userMusclesTimer) {
                return res.status(200).json({ message: 'User training times not found' });
            }

            // Skicka tillbaka användarens träningsdata
            return res.status(200).json(userMusclesTimer);
        } else if (req.method === 'POST') {
            // Extract userId from URL parameters or body, depending on your API design
            const { userId } = req.query; // Or req.query, if you're passing userId in the query string

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
        } else {
            // Handle other HTTP methods or return an error
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the database connection if it was opened
        if (client) {
            await client.close();
        }
    }
};
