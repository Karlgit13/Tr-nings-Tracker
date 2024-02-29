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

module.exports = router;
