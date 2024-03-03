const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const user = await req.db.collection('users').findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send({ message: "Fel e-postadress eller lösenord" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Fel e-postadress eller lösenord" });
        }

        const userForResponse = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        res.send({
            message: "Inloggning lyckades",
            user: userForResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Serverfel vid inloggning" });
    }
});

module.exports = router;
