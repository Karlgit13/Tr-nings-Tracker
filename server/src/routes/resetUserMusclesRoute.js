const express = require('express');
const router = express.Router();
const resetUserMusclesHandler = require('../handlers/resetUserMusclesHandler');

router.post('/', resetUserMusclesHandler);

module.exports = router;
