const helpers = require("../helpers/part3");

const part3Controller = {
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
    }
}

module.exports = part3Controller;