const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const identifier = req.query.identifier;
    if (!identifier) {
        return res.status(400).json({ error: 'Identifier is required' });
    }

    try {
        const user = await req.db.collection('users').findOne({ $or: [{ email: identifier }, { name: identifier }] });
        if (user) {
            res.json({ userId: user._id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
