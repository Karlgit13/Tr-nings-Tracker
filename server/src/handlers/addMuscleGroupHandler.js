const { MongoClient } = require('mongodb');

let db;

const connectToDatabase = async () => {
    if (db) return;
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db();
};

async function addMuscleGroupHandler(req, res) {
    await connectToDatabase();
    const muscleGroups = req.body.muscleGroups;

    try {
        const addOperations = muscleGroups.map(group => ({
            updateOne: {
                filter: { name: group.name },
                update: { $setOnInsert: group },
                upsert: true
            }
        }));

        const result = await req.db.collection('muscles').bulkWrite(addOperations);
        res.status(201).send({ message: 'Muscle groups added or updated successfully', result });
    } catch (error) {
        console.error('Failed to add muscle groups:', error);
        res.status(500).send({ message: 'Failed to add muscle groups' });
    }
}

module.exports = addMuscleGroupHandler;
