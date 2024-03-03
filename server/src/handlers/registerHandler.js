const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

let db;

const connectToDatabase = async () => {
    if (db) return;
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db();
};

module.exports = async (req, res) => {
    console.log('Request received', req.method, req.body);

    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        console.log('Connecting to MongoDB');
        await connectToDatabase();
        console.log('Connected to MongoDB');

        const { name, email, password } = req.body;
        console.log('Received data', { name, email, password });

        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');

        console.log('Creating new user');
        const newUser = {
            name,
            email,
            password: hashedPassword,
        };

        console.log('Saving new user');
        const result = await db.collection('users').insertOne(newUser);
        console.log('User saved', result.insertedId);

        const userId = result.insertedId;

        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ error: error.message });
    }
};
