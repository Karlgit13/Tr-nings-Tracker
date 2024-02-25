const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const User = mongoose.model('User'); // Antag att modellen redan är definierad globalt

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
