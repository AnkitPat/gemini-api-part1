const { GoogleGenerativeAI } = require('@google/generative-ai')
const helpers = {
  generateContentFn: async text => {
    const api = new GoogleGenerativeAI('AIzaSyA8ASC9PWCjwAQCvKBrMW0A3hZUyeXVLkc')
    const model = api.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = text

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()
    return responseText;
  }
}
module.exports = helpers
