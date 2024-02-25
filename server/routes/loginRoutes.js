const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        // Hitta användaren baserat på e-postadressen
        const user = await User.findOne({ email: req.body.email });
        if (user && (await bcrypt.compare(req.body.password, user.password))) {
            // Om användaren finns och lösenordet stämmer, svara med en lyckad inloggning
            res.send({ message: "Inloggning lyckades", user });
        } else {
            // Annars, e-postadressen eller lösenordet är fel
            res.status(400).send({ message: "Fel e-postadress eller lösenord" });
        }
    } catch (error) {
        res.status(500).send({ message: "Serverfel vid inloggning" });
    }
});

module.exports = router;
