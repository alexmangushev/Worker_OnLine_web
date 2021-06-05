const express = require('express')
const app =express()

app.get('/', function(rez, res) {
    res.send('Hello from express')
})

app.listen(3000, function() {
    console.log('Server started at http://localhost:3000');
})