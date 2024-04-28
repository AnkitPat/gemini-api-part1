const { GoogleGenerativeAI } = require('@google/generative-ai')
const AWS = require('aws-sdk');
const fs = require('fs');

const https = require('https');

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            const data = [];
            
            response.on('data', chunk => {
                data.push(chunk);
            });

            response.on('end', () => {
                if (response.statusCode === 200) {
                    const buffer = Buffer.concat(data).toString("base64");
                    resolve(buffer);
                } else {
                    reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
                }
            });

            response.on('error', error => {
                reject(error);
            });
        });
    });
}

const s3 = new AWS.S3();

const api = new GoogleGenerativeAI('AIzaSyA8ASC9PWCjwAQCvKBrMW0A3hZUyeXVLkc')
const model = api.getGenerativeModel({ model: 'gemini-pro' })

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}
const helpers = {
  generateContentFn: async text => {
    

    const prompt = text

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()
    return responseText;
  },

  generateContentWithImageFn: async (text, imagePath, imageType) => {
    const modelImage = api.getGenerativeModel({ model: "gemini-pro-vision" });

    const imageParts = [
      {
        inlineData: {
          data: await downloadFile(imagePath),
          mimeType: imageType
        },
      }
    ];
    const prompt = text

    const result = await modelImage.generateContent([prompt, ...imageParts])
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
  },
  uploadFile: async (filePath, fileName) => {
    AWS.config.update({
      region: 'us-east1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    try {
      const fileContent = fs.readFileSync(filePath);
      const params = {
        Bucket: 'gemini-part4',
        Key: fileName,
        Body: fileContent,
        ACL:'public-read'
      };
    
      // Upload the file to S3
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
              console.log('Error uploading file:', err);
              reject(err);
          } else {
              console.log('File uploaded successfully. File location:', data.Location);
              resolve(data.Location)
          }
        });
      });
    } catch (e) {
      console.error(e);
      return 'Error' + e.message;
    }
  }
}
module.exports = helpers
