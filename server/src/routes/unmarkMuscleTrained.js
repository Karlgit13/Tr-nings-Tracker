// Assuming you have a router set up in your Express app
const express = require('express');
const router = express.Router();

router.post('/unmarkMuscleTrained', async (req, res) => {
    const { userId, muscleName } = req.body;
    const db = req.db; // Make sure you have a way to access your database instance

    try {
        // Assuming your database schema, update the document to unmark the muscle as trained
        const result = await db.collection('userMusclesTimer').updateOne(
            { userId: userId },
            { $unset: { [`trainedMuscles.${muscleName}`]: "" } } // This removes the muscle's trained status
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Muscle or user not found" });
        }

        res.json({ message: "Muscle unmarked as trained successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
