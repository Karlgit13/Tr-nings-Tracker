// Importera nödvändiga bibliotek
const { MongoClient } = require('mongodb'); // MongoDB-klient för att ansluta till databasen
const bcrypt = require('bcryptjs'); // bcryptjs för att jämföra hashade lösenord

// Variabel för att lagra databasanslutningen så att vi inte behöver ansluta igen för varje förfrågan
let db;

// Funktion för att ansluta till databasen
const connectToDatabase = async () => {
    // Om vi redan har en databasanslutning, returnera tidigt för att undvika att skapa en ny
    if (db) return;
    // Använd MongoDB-klienten för att ansluta till databasen med URI som lagras i miljövariablerna
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(); // Spara databasobjektet för senare användning
};

// Huvudfunktionen för din 'login' endpoint
module.exports = async (req, res) => {
    await connectToDatabase(); // Se till att vi är anslutna till databasen

    // Ta emot email och lösenord från klientens förfrågan
    const { email, password } = req.body;

    try {
        // Försök hitta användaren i databasen med den angivna e-postadressen
        const user = await db.collection('users').findOne({ email });
        // Om ingen användare hittas, svara med ett 404-fel
        if (!user) return res.status(404).json({ message: 'Användare hittades inte' });

        // Jämför det angivna lösenordet med det hashade lösenordet som lagras i databasen
        const isMatch = await bcrypt.compare(password, user.password);
        // Om lösenorden inte stämmer överens, svara med ett 400-fel
        if (!isMatch) return res.status(400).json({ message: 'Felaktigt lösenord' });

        // Om allt är korrekt, skicka tillbaka en framgångsrik inloggningssvar
        res.status(200).json({ message: 'Inloggning lyckad', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        // Vid något serverfel, svara med ett 500-fel och skicka med felmeddelandet
        res.status(500).json({ message: 'Serverfel vid inloggning', error: error.message });
    }
};
