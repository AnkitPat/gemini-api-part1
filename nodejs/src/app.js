const express = require('express')
const router = require('./routes/part3.routes')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/', router)
app.all('/stream', function (req, res, next) {
  res.set({
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked'
  }).flushHeaders();

  // Send some initial text
  res.write('Streaming text:\n')

  // Start streaming text at regular intervals
  const interval = setInterval(() => {
    res.write(new Date().toISOString() + '\n')
  }, 1000)

  // End the response after 10 seconds
  setTimeout(() => {
    clearInterval(interval) // Stop streaming
    res.end() // End the response
  }, 10000)
})

app.listen(3001, () => {
  console.log('Service started on 3001')
})
