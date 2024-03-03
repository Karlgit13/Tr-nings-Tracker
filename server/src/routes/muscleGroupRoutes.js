const express = require('express');
const addMuscleGroupHandler = require('../handlers/addMuscleGroupHandler');

const router = express.Router();


router.post('/muscleGroups', addMuscleGroupHandler);

module.exports = router;
