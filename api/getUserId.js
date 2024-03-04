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
    const identifier = req.query.identifier;
    if (!identifier) {
        return res.status(400).json({ error: 'Identifier is required' });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ $or: [{ email: identifier }, { name: identifier }] });

        if (user) {
            res.json({ userId: user._id.toString() });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
