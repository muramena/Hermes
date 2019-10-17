const express = require('express')
var app = express()
const path = require('path')

//Esto deberia estar del lado del Cliente {Creo}
app.get('/usuarios', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../../public/views/user/index.html'));
})

module.exports = app;