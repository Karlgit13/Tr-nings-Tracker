// Importera nödvändiga moduler
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Skapa en variabel för att lagra databasanslutningen
let db;

// Funktion för att ansluta till databasen
const connectToDatabase = async () => {
    // Om databasanslutningen redan finns, returnera
    if (db) return;

    // Anslut till databasen med hjälp av MongoClient
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Spara databasreferensen i variabeln db
    db = client.db();
};

// Exportera en async-funktion som hanterar inloggning
module.exports = async (req, res) => {
    // Anslut till databasen
    await connectToDatabase();

    // Hämta email och lösenord från request body
    const { email, password } = req.body;

    try {
        // Hitta användaren i databasen baserat på email
        const user = await db.collection('users').findOne({ email });

        // Om användaren inte hittas, returnera felmeddelande
        if (!user) return res.status(404).json({ message: 'Användare hittades inte' });

        // Jämför det angivna lösenordet med det hashade lösenordet i databasen
        const isMatch = await bcrypt.compare(password, user.password);

        // Om lösenorden inte matchar, returnera felmeddelande
        if (!isMatch) return res.status(400).json({ message: 'Felaktigt lösenord' });

        // Om inloggningen lyckas, returnera meddelande och användarinformation
        res.status(200).json({ message: 'Inloggning lyckad', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        // Om det uppstår ett serverfel, returnera felmeddelande och felmeddelandet från servern
        res.status(500).json({ message: 'Serverfel vid inloggning', error: error.message });
    }
};