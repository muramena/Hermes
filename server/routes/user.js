const express = require('express')
const db = require('mongoose');
const path = require('path')
const bcrypt = require('bcrypt');
const User = require('../models/users');

/**
 * express module
 */
var app = express()

/**
 * Creates user and saves it in the DB.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, user.
 */
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

/**
 * Gets a user by ID form the DB.
 * @module user
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, user.
 */
app.get('/user', (req, res) => {

  console.log(req)
  
})

module.exports = app