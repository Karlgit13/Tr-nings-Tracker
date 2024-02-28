const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();
    const { userId } = req.query; // På Vercel tillgängliggörs dynamiska parametrar via req.query

    try {
        const userMuscles = await db.collection('userMuscles').findOne({ userId: userId });
        if (!userMuscles || !userMuscles.trainedMuscles || userMuscles.trainedMuscles.length === 0) {
            res.status(404).send('No trained muscles found for the user.');
        } else {
            res.json(userMuscles);
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
};
