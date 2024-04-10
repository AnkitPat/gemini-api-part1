const helpers = require("../helpers/part1");

const part1Controller = {
    generateContent: async (req, res) => {
       try {
        const {text} = req.query;
        const response = await helpers.generateContentFn(text)
        res.status(200).json({message: response})
       } catch (e) {
        console.log(e)
        res.status(500).send('Something went wrong')
       }
    }
}

module.exports = part1Controller;