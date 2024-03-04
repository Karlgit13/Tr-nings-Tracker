// api/unmarkMuscleTrained.js

const { MongoClient } = require("mongodb")

const connectToDatabase = async (uri) => {
    const client = new MongoClient(uri)
    await client.connect()
    return client.db()
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "only POST ples" });
    }

    const { userId, muscleName } = req.body
    const uri = process.env.MONGODB_URI

    try {
        const db = await connectToDatabase(uri)
        const result = await db.collection("userMusclesTimer").updateOne(
            { userId: userId },
            { $unset: { [`trainedMuscles.${muscleName}`]: "" } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "muscle or user not found" })
        }

        res.json({ message: "muscle unmarked success" })
    } catch (error) {
        console.error("DB error: ", error)
        res.status(500).json({ message: "internal server error", error: error.message })
    }
}