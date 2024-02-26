const express = require('express');
const router = express.Router(); // Skapar en ny router objekt som hanterar routes
const bcrypt = require('bcryptjs'); // Bibliotek för att hash och jämföra lösenord

// POST route för '/login' endpoint
router.post('/login', async (req, res) => {
    try {
        // Försök att hitta en användare med den angivna e-postadressen i databasen
        // 'req.db' bör vara en referens till din databasanslutning som är tillgänglig i request-objektet
        const user = await req.db.collection('users').findOne({ email: req.body.email });

        if (!user) {
            // Om ingen användare med den e-postadressen hittas, skicka ett felmeddelande
            return res.status(400).send({ message: "Fel e-postadress eller lösenord" });
        }

        // Jämför det angivna lösenordet med det hashade lösenordet i databasen
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            // Om lösenorden inte matchar, skicka ett felmeddelande
            return res.status(400).send({ message: "Fel e-postadress eller lösenord" });
        }

        // Om användaren finns och lösenordet stämmer överens, skapa en användarobjekt för svaret
        const userForResponse = {
            id: user._id,
            name: user.name,
            email: user.email
            // Det är viktigt att inte inkludera lösenordet även om det är hashat
        };

        // Skicka tillbaka ett framgångsrikt svar med användarobjektet
        res.send({
            message: "Inloggning lyckades",
            user: userForResponse
        });
    } catch (error) {
        // Logga felet till konsolen för felsökning
        console.error(error);
        // Skicka ett 500 Internal Server Error svar om något går fel
        res.status(500).send({ message: "Serverfel vid inloggning" });
    }
});

// Exportera routern för att användas av huvudserverfilen
module.exports = router;
