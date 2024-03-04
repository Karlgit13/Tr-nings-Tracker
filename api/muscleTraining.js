const { MongoClient } = require('mongodb');

// Unified database connection function
async function connectToDatabase(uri) {
    const client = new MongoClient(uri);
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

        // Handling marking a muscle as trained
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

            res.status(200).json({ message: 'Muscle marked as trained', trainedUntil });
        }
        // Handling unmarking a muscle as trained
        else if (action === 'unmark') {
            const result = await db.collection('userMusclesTimer').updateOne(
                { userId: userId },
                { $unset: { [`trainedMuscles.${muscleName}`]: "" } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "Muscle or user not found" });
            }

            res.json({ message: "Muscle unmarked as trained successfully" });
        }
        // Handling invalid action
        else {
            res.status(400).json({ message: "Invalid action specified" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
