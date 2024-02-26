const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

let db;

const connectToDatabase = async () => {
    if (db) return;
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(); // database object
};

module.exports = async (req, res) => {
    await connectToDatabase();

    const { email, password } = req.body;

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(404).json({ message: 'Användare hittades inte' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Felaktigt lösenord' });

        res.status(200).json({ message: 'Inloggning lyckad', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Serverfel vid inloggning', error: error.message });
    }
};