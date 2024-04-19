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
  },
  sendMessageStream: async (message, history, res) => {
    res.set({
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    }).flushHeaders();
  
    // Send some initial text
    const chat = history.length ?  model.startChat({history}) : model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  
    const msg = message;
    try {
      const result = await chat.sendMessageStream(msg);
      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        await res.write(chunkText)
        
      }
      res.end()
    } catch (error) {
      console.error('Error streaming message:', error);
      res.status(500).send('Error streaming message');
    }
  }
}
module.exports = helpers
