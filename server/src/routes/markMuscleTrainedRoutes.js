const express = require('express');

const router = express.Router();

router.post('/markMuscleTrained', async (req, res) => {
    const { userId, muscleName } = req.body;
    const db = req.db;

    try {
        const muscleGroup = await db.collection('muscles').findOne({ name: muscleName });
        if (!muscleGroup) {
            return res.status(404).json({ message: 'Muscle group not found' });
        }
        const restPeriodHours = muscleGroup.restPeriod;
        const restPeriodMillis = restPeriodHours * 60 * 60 * 1000;
        const trainedUntil = new Date(Date.now() + restPeriodMillis);

        await db.collection('userMusclesTimer').updateOne(
            { userId: userId },
            { $set: { [`trainedMuscles.${muscleName}.trainedUntil`]: trainedUntil } },
            { upsert: true }
        );
        res.status(200).json({ message: 'Muscle marked as trained', trainedUntil });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
