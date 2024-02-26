// Importera MongoDB-klient för att kommunicera med din databas och bcryptjs för lösenordshashning
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Skapa en variabel för att lagra din databasanslutning, så att vi inte ansluter flera gånger
let db;

// Funktion för att ansluta till MongoDB
const connectToDatabase = async () => {
    // Om vi redan har en databasanslutning, använd den och returnera tidigt
    if (db) return;
    // Annars skapa en ny anslutning med hjälp av URI:n från miljövariablerna
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(); // Spara databasanslutningen i 'db' variabeln
};

// Huvudfunktion för ditt 'register' API endpoint
module.exports = async (req, res) => {
    // Logga att en förfrågan har tagits emot för felsökningsändamål
    console.log('Request received', req.method, req.body);

    // Kontrollera att förfrågan är av typen POST, annars svara med 405 Method Not Allowed
    if (req.method !== 'POST') {
        console.log('Method not allowed');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Anslut till databasen
        console.log('Connecting to MongoDB');
        await connectToDatabase();
        console.log('Connected to MongoDB');

        // Extrahera data från förfrågan
        const { name, email, password } = req.body;
        console.log('Received data', { name, email, password });

        // Hasha lösenordet med bcryptjs innan det sparas i databasen
        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10); // Andra argumentet är saltRounds
        console.log('Password hashed');

        // Skapa ett nytt användarobjekt för att spara i databasen
        console.log('Creating new user');
        const newUser = {
            name,
            email,
            password: hashedPassword, // Använd det hashade lösenordet
        };

        // Spara den nya användaren i databasen
        console.log('Saving new user');
        const result = await db.collection('users').insertOne(newUser);
        console.log('User saved', result.insertedId);

        // Skicka tillbaka ett framgångsrikt svar med användar-ID:t
        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (error) {
        // Om något går fel, logga felet och svara med 500 Internal Server Error
        console.error('An error occurred', error);
        res.status(500).json({ error: error.message });
    }
};
