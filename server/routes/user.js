const express = require('express')
const db = require('mongoose');
const path = require('path')
const bcrypt = require('bcrypt');
const User = require('../models/users');

var app = express()

app.post('/user', function (req, res) {

  let body = req.body

  let user = new User({
    username: body.username,
    password: bcrypt.hashSync(body.password, 10),
    firstName: body.firstName,
    lastName: body.lastName,
    dni: body.dni,
    birthDate: body.birthDate,
    address: body.address,
    phone: body.phone,
    email: body.email,
  })

  user.save((err, usersDB) => {
    if (err) {
      
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: user.toJSON(),
    })
  })
})

app.get('/user/:id', function (req, res) {
  res.send('USER')
})

module.exports = app