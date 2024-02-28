// api/addMuscleGroup.js

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
let db = null;

// Connect to the database
async function connectToDatabase() {
    if (db) return db; // Use existing database connection if available
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(); // Assuming your database name is stored in an environment variable
    return db;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        // Only allow POST requests
        return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    const muscleGroups = req.body.muscleGroups; // Assuming an array of muscle groups

    try {
        const db = await connectToDatabase();
        const collection = db.collection('muscles');

        // Create an operation to check each muscle group and only add those that do not exist
        const addOperations = muscleGroups.map(group => ({
            updateOne: {
                filter: { name: group.name },
                update: { $setOnInsert: group },
                upsert: true // If no document matches the filter, add the new document
            }
        }));

        const result = await collection.bulkWrite(addOperations);
        return res.status(201).send({ message: 'Muscle groups added or updated successfully', result });
    } catch (error) {
        console.error('Failed to add muscle groups:', error);
        return res.status(500).send({ message: 'Failed to add muscle groups' });
    }
};
