const express = require('express');
const part1Controller = require('../controller/part1.controller');
const router = express.Router();

router.get('/generatecontent', part1Controller.generateContent)

module.exports = router;