// userRoutes.js
// Importera nödvändiga moduler
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Definiera en POST-rutt för att skapa en ny användare
router.post('/users', async (req, res) => {
  try {
    // Kryptera lösenordet med bcryptjs
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Skapa ett nytt användarobjekt med namn, e-post och krypterat lösenord
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };

    // Antaget att req.db redan är inställd på din MongoDB-databasanslutning
    // Infoga det nya användarobjektet i "users" -samlingen och få tillbaka resultatet
    const result = await req.db.collection('users').insertOne(newUser);

    // Skicka en JSON-respons meddelande och den nya användarens ID
    res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
  } catch (error) {
    // Hantera eventuella fel och skicka en JSON-respons med felmeddelandet
    res.status(500).json({ error: error.message });
  }
});

// Definiera en GET-rutt för att hämta alla användare
router.get('/users', async (req, res) => {
  try {
    // Antaget att req.db redan är inställd på din MongoDB-databasanslutning
    // Hämta alla dokument från "users" -samlingen och konvertera till en array
    const users = await req.db.collection('users').find({}).toArray();

    // Skicka en JSON-respons med alla användare
    res.status(200).json(users);
  } catch (error) {
    // Hantera eventuella fel och skicka en JSON-respons med felmeddelandet
    res.status(500).json({ error: error.message });
  }
});

// Exportera router-modulen för användning i andra filer
module.exports = router;
