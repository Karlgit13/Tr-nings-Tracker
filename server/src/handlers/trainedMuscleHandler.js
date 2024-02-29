// trainedMuscleHandler.js

// Importera MongoDB-klient för att kommunicera med din databas och bcryptjs för lösenordshashning
const { MongoClient } = require('mongodb');


// Skapa en variabel för att lagra din databasanslutning, så att vi inte ansluter flera gånger
let db;

// Funktion för att ansluta till MongoDB
const connectToDatabase = async () => {
    // Om vi redan har en databasanslutning, använd den och returnera tidigt
    if (db) return;
    // Annars skapa en ny anslutning med hjälp av URI:n från miljövariablerna
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(); // Spara databasanslutningen i 'db' variabeln
};

async function trainedMuscleHandler(req, res) {
    await connectToDatabase();
    // Extraherar userId från förfrågans kropp, inte från en autentiseringsmekanism
    const { userId, muscleName } = req.body;
    const db = req.db; // Se till att din databasanslutning är korrekt initialiserad
    console.log("request body????? ", req.body);

    try {
        // Uppdatera "userMuscles" med användarens tränade muskler baserat på userId
        const result = await db.collection("userMuscles").updateOne(
            { userId }, // Använd userId för att identifiera dokumentet
            { $addToSet: { trainedMuscles: muscleName } }, // Lägg till muskelnamnet utan att tillåta duplicering
            { upsert: true } // Skapa ett nytt dokument om det inte redan finns ett för den användaren
        );
        console.log("userId???? ", userId);

        // Skicka tillbaka ett framgångsrikt svar
        res.status(200).json({ success: true, message: "Muscle marked as trained", data: result });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: "Internal server error" });
    }
}


module.exports = trainedMuscleHandler;