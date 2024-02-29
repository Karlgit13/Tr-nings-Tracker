const express = require('express');
const router = express.Router();

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userMuscles = await req.db.collection('userMuscles').findOne({ userId: userId });
        if (!userMuscles || !userMuscles.trainedMuscles || userMuscles.trainedMuscles.length === 0) {
            return res.status(200).json({ message: 'inget att hämta, gå till gymmet' });
        } else {
            res.json(userMuscles);
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
