// addMuscleGroupHandler.js

async function addMuscleGroupHandler(req, res) {
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
