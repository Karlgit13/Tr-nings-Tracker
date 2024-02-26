const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };

    // Antaget att req.db redan är inställd på din MongoDB-databasanslutning
    const result = await req.db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    // Antaget att req.db redan är inställd på din MongoDB-databasanslutning
    const users = await req.db.collection('users').find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
