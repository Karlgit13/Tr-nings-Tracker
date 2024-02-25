const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Anpassa sökvägen till din modell

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = async (req, res) => {
    await connectToDatabase();

    // Antag att vi tar emot `name`, `email`, `password` i `req.body`
    const { name, email, password } = req.body;

    try {
        // Hash:a lösenordet innan vi sparar användaren
        const hashedPassword = await bcrypt.hash(password, 10); // 10 är antalet runder av saltning

        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Använd det hashade lösenordet
        });

        await newUser.save();
        res.status(201).json({ message: 'Användare registrerad', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Serverfel', error: error.message });
    }
};
