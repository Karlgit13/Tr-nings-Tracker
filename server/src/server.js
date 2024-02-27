// Laddar konfigurationer från .env-filen in i process.env
require('dotenv').config();

// Importera moduler för att skapa en webbserver och hantera förfrågningar
const express = require('express');
const cors = require('cors');

// Importera databasmodul för att hantera databasförbindelser
const { MongoClient } = require('mongodb');

// Importera rutt-hanterare för olika endpoints
const registerHandler = require('./handlers/registerHandler');
const loginHandler = require('./handlers/loginHandler');
const trainedMuscleHandler = require("./handlers/trainedMuscleHandler")
const trainedMuscleRoutes = require('./routes/trainedMuscleRoutes');
const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/userRoutes");
const muscleGroupRoutes = require('./routes/muscleGroupRoutes');

// Skapa en instans av express-appen och definiera port
const app = express();
const PORT = process.env.PORT || 5000;

// Global databasanslutningsvariabel
let db;

// Funktion för att etablera en databasanslutning
const connectToDatabase = async () => {
    if (db) return db; // Returnera existerande förbindelse om en finns
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db();
    return db;
};

// Middleware för att hantera JSON-data och CORS
app.use(express.json()); // Parse JSON-payload från inkommande förfrågningar
app.use(cors()); // Tillåt CORS för alla domäner

// Middleware för att sätta upp databasanslutning i förfrågningsobjektet
app.use(async (req, res, next) => {
    req.db = await connectToDatabase();
    next();
});

// Rutt-hanterare för användarregistrering och inloggning
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);
app.post('/api/trainedMuscle', trainedMuscleHandler)


// Rutt-moduler för inloggnings- och användarrelaterade endpoints
app.use(loginRoutes);
app.use(userRoutes);
app.use("/api", trainedMuscleRoutes)
app.use('/api', muscleGroupRoutes);

// Starta servern och lyssna på definierad port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Inom din serverfil, t.ex., server.js eller en dedikerad routerfil.

app.get('/api/getUserId', async (req, res) => {
    const identifier = req.query.identifier; // Ta emot identifier som en query parameter
    if (!identifier) {
        return res.status(400).json({ error: 'Identifier is required' });
    }

    try {
        // Anta att användaren kan identifieras antingen via email eller användarnamn
        // Använd $or för att söka efter dokument där antingen email eller username matchar identifier
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
    }
});
