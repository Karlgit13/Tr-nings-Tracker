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
const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/userRoutes");

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
app.post('/api/trainedMuscle', async (req, res) => {
    const { muscleName } = req.body;
    // Här skulle du skriva logik för att uppdatera muskeln i din databas
    // Till exempel:
    // const result = await db.collection('muscles').updateOne({ name: muscleName }, { $set: { trained: true } });
    // res.json(result);
  });

// Rutt-moduler för inloggnings- och användarrelaterade endpoints
app.use(loginRoutes);
app.use(userRoutes);

// Starta servern och lyssna på definierad port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
