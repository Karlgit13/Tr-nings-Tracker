// trainedMuscleRoutes.js

const express = require('express');
const router = express.Router();

// Importera trainedMuscleHandler-funktionen
const trainedMuscleHandler = require('../handlers/trainedMuscleHandler');

// Definiera POST-route för /api/trainedMuscle
router.post('/trainedMuscle', trainedMuscleHandler);

module.exports = router;
