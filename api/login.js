const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI);
};

module.exports = async (req, res) => {
    await connectToDatabase();

    const User = mongoose.model('User'); // Antag att modellen redan är definierad globalt

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Användare hittades inte' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Felaktigt lösenord' });

        res.status(200).json({ message: 'Inloggning lyckad', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Serverfel vid inloggning', error: error.message });
    }
};
