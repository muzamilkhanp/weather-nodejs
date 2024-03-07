const express = require('express');
const app = express();

const port = 4000;

const weather = require('./routes/weather');

app.use('', weather);

app.listen(port, () => {
    console.log("server running on port", port);
})
