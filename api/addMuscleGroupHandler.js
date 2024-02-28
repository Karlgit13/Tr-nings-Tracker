// addMuscleGroupHandler.js 
// Importera nödvändiga moduler
const { MongoClient } = require('mongodb');

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

async function addMuscleGroupHandler(req, res) {

    // Anslut till databasen
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
