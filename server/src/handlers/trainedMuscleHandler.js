const { MongoClient } = require('mongodb');

let db;

const connectToDatabase = async () => {
    if (db) return;
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db();
};

async function trainedMuscleHandler(req, res) {
    await connectToDatabase();
    const { userId, muscleName } = req.body;
    const db = req.db;
    console.log("request body????? ", req.body);

    try {
        const result = await db.collection("userMuscles").updateOne(
            { userId },
            { $addToSet: { trainedMuscles: muscleName } },
            { upsert: true }
        );
        console.log("userId???? ", userId);

        res.status(200).json({ success: true, message: "Muscle marked as trained", data: result });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: "Internal server error" });
    }
}

module.exports = trainedMuscleHandler;
