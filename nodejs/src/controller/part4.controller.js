const helpers = require("../helpers/part4");

const part4Controller = {
    generateContent: async (req, res) => {
       try {
        const {text} = req.query;
        const response = await helpers.generateContentFn(text)
        res.status(200).json({message: response})
       } catch (e) {
        console.log(e)
        res.status(500).send('Something went wrong')
       }
    },
    generateContentWithImage: async (req, res) => {
        try {
         const {text, imagePath, imageType} = req.query;
         const response = await helpers.generateContentWithImageFn(text, imagePath, imageType)
         res.status(200).json({message: response})
        } catch (e) {
         console.log(e)
         res.status(500).send('Something went wrong')
        }
     },
   
    sendMessage: async (req, res) => {
        try {
            const {message} = req.query;
            const {history} = req.body;
            const response = await helpers.sendMessage(message, history ?? []);
            console.log(response);
            res.status(200).json({message: response});
        } catch (e) {
            console.log(e)
            res.status(500).send('Something went wrong')
        }
    },
    sendMessageStream: async (req, res) => {
        try {
            const {message} = req.query;
            const {history} = req.body;
            helpers.sendMessageStream(message, history ?? [], res);
            
        } catch (e) {
            console.log(e)
            res.status(500).send('Something went wrong')
        }
    },
    uploadFile: async (req, res) => {
        try {
            console.log(req.file)
            const fileName = req.file.originalname;
            const filePath = req.file.path;
            const path = await helpers.uploadFile(filePath, fileName);
            res.status(200).json({success: true, path})
        } catch (e) {
            console.log(e);
            res.status(500).send('Something went wrong')
        }
    }
}

module.exports = part4Controller;