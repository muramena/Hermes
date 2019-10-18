const express = require('express')
var app = express()
const path = require('path')
const User = require('../models/users')
const bcrypt = require('bcrypt')

app.get('/usuario', function (req, res) {
  res.render('user', {
    title: 'Usuario'
  });
})

app.post('/user', function (req, res) {
  let body = req.body
  console.log(body)

  res.json({
    ok: true
  });
})

module.exports = app