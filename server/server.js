// Importera nödvändiga moduler
require('dotenv').config(); // Ladda in .env-filen för att hämta miljövariabler
const express = require('express'); // Importera Express-modulen för att skapa en webbserver
const cors = require('cors'); // Importera Cors-modulen för att hantera korsdomänshantering
const { MongoClient } = require('mongodb'); // Importera MongoClient från MongoDB-modulen för att ansluta till databasen
const registerHandler = require('./register'); // Importera registerHandler-funktionen från register.js
const loginHandler = require('./login'); // Importera loginHandler-funktionen från login.js

const loginRoutes = require("./loginRoutes"); // Importera loginRoutes-modulen för att hantera inloggningsrutter
const userRoutes = require("./userRoutes"); // Importera userRoutes-modulen för att hantera användarrutter

const app = express(); // Skapa en Express-app
const PORT = process.env.PORT || 5000; // Ange porten för servern, antingen från miljövariabler eller standardvärdet 5000

let db; // Variabel för att lagra databasanslutningen

// Funktion för att ansluta till databasen
const connectToDatabase = async () => {
    if (db) return db; // Om databasanslutningen redan finns, returnera den direkt
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Anslut till databasen med hjälp av miljövariabler
    db = client.db(); // Spara databasreferensen i variabeln db
    return db; // Returnera databasreferensen
};

app.use(cors()); // Använd Cors för att hantera korsdomänshantering
app.use(express.json()); // Använd Express för att hantera JSON-data i anropet

// Ange rutter för registerHandler och loginHandler
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);

// Middleware för att ansluta till databasen innan varje anrop
app.use(async (req, res, next) => {
    req.db = await connectToDatabase(); // Anslut till databasen och lagra referensen i req-objektet
    next(); // Gå vidare till nästa middleware eller rutt
});

// Använd loginRoutes och userRoutes för att hantera inloggnings- och användarrutter
app.use(loginRoutes);
app.use(userRoutes);

// Starta servern och lyssna på angiven port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
