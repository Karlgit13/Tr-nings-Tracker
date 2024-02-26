const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    try {
        // Antaget att req.db är din databasanslutning
        const user = await req.db.collection('users').findOne({ email: req.body.email });

        if (!user) {
            // Om ingen användare hittades med den e-postadressen
            return res.status(400).send({ message: "Fel e-postadress eller lösenord" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            // Om lösenordet inte stämmer
            return res.status(400).send({ message: "Fel e-postadress eller lösenord" });
        }

        // Om användaren finns och lösenordet stämmer, svara med en lyckad inloggning
        // Se till att endast skicka tillbaka säker information om användaren
        res.send({
            message: "Inloggning lyckades",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
                // Lägg inte till lösenord eller andra känsliga uppgifter här
            }
        });
    } catch (error) {
        console.error(error); // Logga gärna felet för debugging
        res.status(500).send({ message: "Serverfel vid inloggning" });
    }
});

module.exports = router;
