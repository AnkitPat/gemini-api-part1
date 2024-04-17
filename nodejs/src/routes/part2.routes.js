const express = require('express');
const part2Controller = require('../controller/part2.controller');
const router = express.Router();

router.post('/sendmessage', part2Controller.sendMessage)

module.exports = router;