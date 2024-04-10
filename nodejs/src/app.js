const express = require('express');
const router = require('./routes/part1.routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(bodyParser.json())

app.use('/', router)

app.listen(3001, () => {
    console.log('Service started on 3001');
});