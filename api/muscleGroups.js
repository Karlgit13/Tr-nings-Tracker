const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
let db = null;


async function connectToDatabase() {
    if (db) return db;
    const client = await MongoClient.connect(uri);
    db = client.db();
    return db;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    const muscleGroups = req.body.muscleGroups;

    try {
        const db = await connectToDatabase();
        const collection = db.collection('muscles');

        const addOperations = muscleGroups.map(group => ({
            updateOne: {
                filter: { name: group.name },
                update: { $setOnInsert: group },
                upsert: true
            }
        }));

        const result = await collection.bulkWrite(addOperations);
        return res.status(201).send({ message: 'Muscle groups added or updated successfully', result });
    } catch (error) {
        console.error('Failed to add muscle groups:', error);
        return res.status(500).send({ message: 'Failed to add muscle groups' });
    }
};
