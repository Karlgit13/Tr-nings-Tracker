const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
}

module.exports = async (req, res) => {
    let client;

    try {
        client = await connectToDatabase();
        const db = client.db();

        if (req.method === 'GET') {
            const { userId } = req.query;

            const userMusclesTimer = await db.collection('userMusclesTimer').findOne({ userId: userId });
            if (!userMusclesTimer) {
                return res.status(200).json({ message: 'User training times not found' });
            }

            return res.status(200).json(userMusclesTimer);
        } else if (req.method === 'POST') {
            const { userId } = req.query;

            const userMuscles = await db.collection('userMusclesTimer').findOne({ userId: userId });

            if (!userMuscles || !userMuscles.trainedMuscles) {
                return res.status(404).json({ message: 'User training times not found' });
            }

            const updateObject = {
                $set: {}
            };
            for (const muscle in userMuscles.trainedMuscles) {
                updateObject.$set[`trainedMuscles.${muscle}.trainedUntil`] = "";
            }

            const updateResult = await db.collection('userMusclesTimer').updateOne({ userId: userId }, updateObject);

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ message: 'User or muscle not found' });
            }

            res.json({ message: 'All muscle timers reset successfully' });
        } else {
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            await client.close();
        }
    }
};
