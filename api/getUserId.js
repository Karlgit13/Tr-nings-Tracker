const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();
    const identifier = req.query.identifier;

    if (!identifier) {
        return res.status(400).json({ error: 'Identifier is required' });
    }

    try {
        const user = await db.collection('users').findOne({
            $or: [
                { email: identifier },
                { name: identifier }
            ]
        });

        if (user) {
            res.json({ userId: user._id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
};
