// muscleGroupRoutes.js

const express = require('express');
const router = express.Router();

const addMuscleGroupHandler = require('../handlers/addMuscleGroupHandler');
// Importera andra handlers om nödvändigt

router.post('/muscleGroups', addMuscleGroupHandler);
// Lägg till fler muskelgrupps-relaterade routes här

module.exports = router;
