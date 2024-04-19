const express = require('express');
const part2Controller = require('../controller/part2.controller');
const part3Controller = require('../controller/part3.controller');
const router = express.Router();

router.post('/sendmessage', part3Controller.sendMessage)
router.post('/sendmessagestream', part3Controller.sendMessageStream)
module.exports = router;