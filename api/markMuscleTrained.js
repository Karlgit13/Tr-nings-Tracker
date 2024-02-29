// api/markMuscleTrained.js
const { MongoClient } = require('mongodb');

// Anslutningssträngen till din MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { userId, muscleName } = req.body;

            await client.connect();
            const db = client.db(); // Ange din databasnamn här

            const muscleGroup = await db.collection('muscles').findOne({ name: muscleName });
            if (!muscleGroup) {
                return res.status(404).json({ message: 'Muscle group not found' });
            }

            const restPeriodHours = muscleGroup.restPeriod;
            const restPeriodMillis = restPeriodHours * 60 * 60 * 1000;
            const trainedUntil = new Date(Date.now() + restPeriodMillis);

            await db.collection('userMusclesTimer').updateOne(
                { userId: userId },
                { $set: { [`trainedMuscles.${muscleName}.trainedUntil`]: trainedUntil } },
                { upsert: true }
            );

            return res.status(200).json({ message: 'Muscle marked as trained', trainedUntil });
        } catch (error) {
            console.error('Database error:', error);
            return res.status(500).send('Internal Server Error');
        } finally {
            await client.close();
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
