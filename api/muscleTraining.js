const { MongoClient } = require('mongodb');

async function connectToDatabase(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return client.db();
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { action, userId, muscleName } = req.body;
    const uri = process.env.MONGODB_URI;

    try {
        const db = await connectToDatabase(uri);

        if (action === 'mark') {
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

            await db.collection('userMuscles').updateOne(
                { userId: userId },
                { $addToSet: { trainedMuscles: muscleName } },
                { upsert: true }
            );

            res.status(200).json({ message: 'Muscle marked as trained', trainedUntil });
        } else if (action === 'unmark') {
            const timerResult = await db.collection('userMusclesTimer').updateOne(
                { userId: userId },
                { $unset: { [`trainedMuscles.${muscleName}`]: "" } }
            );

            const musclesResult = await db.collection('userMuscles').updateOne(
                { userId: userId },
                { $pull: { trainedMuscles: muscleName } }
            );

            if (timerResult.modifiedCount === 0 && musclesResult.modifiedCount === 0) {
                return res.status(404).json({ message: "Muscle or user not found" });
            }

            res.json({ message: "Muscle unmarked as trained successfully" });
        } else {
            res.status(400).json({ message: "Invalid action specified" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
