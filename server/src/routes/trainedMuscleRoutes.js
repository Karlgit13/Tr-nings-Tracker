const express = require('express');
const trainedMuscleHandler = require('../handlers/trainedMuscleHandler');

const router = express.Router();


router.post('/trainedMuscle', trainedMuscleHandler);

module.exports = router;
