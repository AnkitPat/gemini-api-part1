const express = require('express');
const part1Controller = require('../controller/part1.controller');
const router = express.Router();

router.get('/generatecontent', part1Controller.generateContent)
router.post('/sendmessage', part1Controller.sendMessage)

module.exports = router;