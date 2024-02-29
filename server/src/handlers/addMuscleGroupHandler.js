// addMuscleGroupHandler.js

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

async function addMuscleGroupHandler(req, res) {
    await connectToDatabase();
    const muscleGroups = req.body.muscleGroups; // Antag att vi får en array av muskelgrupper

    try {
        // Skapa en operation för att kontrollera varje muskelgrupp och bara lägga till de som inte finns
        const addOperations = muscleGroups.map(group => ({
            updateOne: {
                filter: { name: group.name },
                update: { $setOnInsert: group },
                upsert: true // Om inget dokument matchar filteret, lägg till det nya dokumentet
            }
        }));

        const result = await req.db.collection('muscles').bulkWrite(addOperations);
        res.status(201).send({ message: 'Muscle groups added or updated successfully', result });
    } catch (error) {
        console.error('Failed to add muscle groups:', error);
        res.status(500).send({ message: 'Failed to add muscle groups' });
    }
}

module.exports = addMuscleGroupHandler;
