const express = require('express')
var app = express()
const path = require('path')
const User = require('../models/users');
const bcrypt = require('bcrypt');

//Esto deberia estar del lado del Cliente {Creo}
app.get('/usuarios', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/user/index.html'));
})

app.post('/user', function (req, res) {

  let body = req.body
  console.log(body)

  res.json({
    ok: true
  });

})

app.get('/user/:id', function (req, res) {
  res.send('USER')
})

module.exports = app