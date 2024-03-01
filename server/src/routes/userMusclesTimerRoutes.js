// userMusclesTimerRoutes.js
const express = require('express');
const router = express.Router();

// Get the trained muscles end times for a user
router.get('/userMusclesTimer/:userId', async (req, res) => {
    const userId = req.params.userId;
    const db = req.db; // Make sure to retrieve your db instance correctly

    try {
        const userMusclesTimer = await db.collection('userMusclesTimer').findOne({ userId: userId });
        if (!userMusclesTimer) {
            return res.status(404).json({ message: 'User training times not found' });
        }
        res.json(userMusclesTimer);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/resetMuscleTimer/:userId', async (req, res) => {
    const userId = req.params.userId;
    const db = req.db; // Make sure to retrieve your db instance correctly

    try {
        // Retrieve the user's muscle data to get all muscle names
        const userMuscles = await db.collection('userMusclesTimer').findOne({ userId: userId });

        // Check if userMuscles exists and has trainedMuscles
        if (!userMuscles || !userMuscles.trainedMuscles) {
            return res.status(404).json({ message: 'User training times not found' });
        }

        // Create the update object to reset all trainedUntil times
        const updateObject = {
            $set: {}
        };
        for (const muscle in userMuscles.trainedMuscles) {
            updateObject.$set[`trainedMuscles.${muscle}.trainedUntil`] = "";
        }

        // Perform the update
        const updateResult = await db.collection('userMusclesTimer').updateOne({ userId: userId }, updateObject);

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ message: 'User or muscle not found' });
        }

        res.json({ message: 'All muscle timers reset successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
