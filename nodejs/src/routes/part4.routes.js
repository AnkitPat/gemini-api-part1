const express = require('express');
const part4Controller = require('../controller/part4.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.post('/sendmessage', part4Controller.sendMessage)
router.post('/sendmessagestream', part4Controller.sendMessageStream)
router.post('/uploadfile', upload.single('image'), part4Controller.uploadFile)
router.get('/generatecontentwithimage', part4Controller.generateContentWithImage)
module.exports = router;