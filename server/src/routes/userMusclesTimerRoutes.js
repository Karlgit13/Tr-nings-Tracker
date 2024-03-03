    const express = require('express');

    const router = express.Router();

    router.get('/userMusclesTimer/:userId', async (req, res) => {
        const userId = req.params.userId;
        const db = req.db;

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
        const db = req.db;

        try {
            const userMuscles = await db.collection('userMusclesTimer').findOne({ userId: userId });

            if (!userMuscles || !userMuscles.trainedMuscles) {
                return res.status(404).json({ message: 'User training times not found' });
            }

            const updateObject = {
                $set: {}
            };
            for (const muscle in userMuscles.trainedMuscles) {
                updateObject.$set[`trainedMuscles.${muscle}.trainedUntil`] = "";
            }

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
