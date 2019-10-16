const express = require('express');
var app = express()
const path = require('path')

//Esto estaba del lado del servidor
app.get('/usuarios', function (req, res) {
    res.sendFile(path.resolve(__dirname, './user/index.html'));
    console.log('res', res);
})