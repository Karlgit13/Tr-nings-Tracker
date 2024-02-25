const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User'); // Import the User model directly

module.exports = async (req, res) => {
    console.log('Request received', req.method, req.body);

    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        console.log('Connecting to MongoDB');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const { name, email, password } = req.body;
        console.log('Received data', { name, email, password });

        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');

        console.log('Creating new user');
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        console.log('Saving new user');
        await newUser.save();
        console.log('User saved', newUser._id);

        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        console.error('An error occurred', error);
        res.status(500).json({ error: error.message });
    } finally {
        console.log('Closing MongoDB connection');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};