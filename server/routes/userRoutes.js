const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Uppdatera sökvägen enligt din struktur
const bcrypt = require('bcrypt');


// POST /users - Skapa en ny användare
router.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /users - Hämta alla användare
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});


module.exports = router;
