// trainedMuscleHandler.js

async function trainedMuscleHandler(req, res) {
    // Extraherar userId från förfrågans kropp, inte från en autentiseringsmekanism
    const { userId, muscleName } = req.body;
    const db = req.db; // Se till att din databasanslutning är korrekt initialiserad

    try {
        // Uppdatera "userMuscles" med användarens tränade muskler baserat på userId
        const result = await db.collection("userMuscles").updateOne(
            { userId }, // Använd userId för att identifiera dokumentet
            { $addToSet: { trainedMuscles: muscleName } }, // Lägg till muskelnamnet utan att tillåta duplicering
            { upsert: true } // Skapa ett nytt dokument om det inte redan finns ett för den användaren
        );

        // Skicka tillbaka ett framgångsrikt svar
        res.status(200).json({ success: true, message: "Muscle marked as trained", data: result });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: "Internal server error" });
    }
}


module.exports = trainedMuscleHandler;