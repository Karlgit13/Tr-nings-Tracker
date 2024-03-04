const { MongoClient } = require('mongodb');

let client;

const connectToDatabase = async () => {
    if (client) return client.db();
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    return client.db();
};

module.exports = async (req, res) => {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const db = await connectToDatabase();

        if (req.method === 'GET') {
            await createWeeklyReport(db);
            return res.status(200).send('Weekly report generated');
        } else {
            return res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Error generating weekly report:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            await client.close();
        }
    }
};

const getWeekNumber = (date) => {
    const newDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    newDate.setUTCDate(newDate.getUTCDate() + 4 - (newDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((newDate - yearStart) / 86400000 + 1) / 7);
};

const createWeeklyReport = async (db) => {
    const today = new Date();
    const todaysWeekNumber = getWeekNumber(today);

    const users = await db.collection('userMuscles').find().toArray();
    for (const user of users) {
        const reportEntry = {
            userId: user.userId,
            trainedMuscles: user.trainedMuscles,
            weekOf: todaysWeekNumber
        };
        await db.collection('userWeeklyReport').insertOne(reportEntry);
    }
};
