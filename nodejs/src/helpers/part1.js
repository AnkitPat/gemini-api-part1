const { GoogleGenerativeAI } = require('@google/generative-ai')
const api = new GoogleGenerativeAI('AIzaSyA8ASC9PWCjwAQCvKBrMW0A3hZUyeXVLkc')
    const model = api.getGenerativeModel({ model: 'gemini-pro' })
const helpers = {
  generateContentFn: async text => {
    

    const prompt = text

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()
    return responseText;
  },
  sendMessage: async (message, history) => {
    
    const chat = history.length ?  model.startChat({history}) : model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
  
    const msg = message;
  
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return text;
  }
}
module.exports = helpers
