// trainedMuscleHandler.js

async function trainedMuscleHandler(req, res) {
    const { muscleName } = req.body;
    const db = req.db;

    try {
        const result = await db.collection("muscles").updateOne(
            { name: muscleName },
            { $set: { trained: true } }
        );

        res.json(result)
    } catch (error) {
        console.error("nått error: ", error);
        res.status(500).send({ error: "internal server error" });
    }
}

module.exports = trainedMuscleHandler;