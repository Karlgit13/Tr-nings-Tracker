const { MongoClient } = require("mongodb")

async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    return client.db()
}

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).send("method not allowed")
    }

    const userId = req.query.userId
    if (!userId) {
        return res.status(400).send("missing userId parameter")
    }

    const db = await connectToDatabase()

    try {
        const weeklyReports = await db.collection("userWeeklyReport").find({ userId: userId }).toArray()

        if (!weeklyReports.length) {
            return res.status(404).send("no weekly report for userId")
        }

        return res.status(200).json(weeklyReports)
    }
    catch (error) {
        console.error("failed to fetch", error)
        return res.status(500).send("internal server error")
    }
}