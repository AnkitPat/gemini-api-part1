const { GoogleGenerativeAI } = require('@google/generative-ai')
const api = new GoogleGenerativeAI('***')
    const model = api.getGenerativeModel({ model: 'gemini-pro' })
const helpers = {
  generateContentFn: async text => {
    

    const prompt = text

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()
    return responseText;
  },
}
module.exports = helpers
