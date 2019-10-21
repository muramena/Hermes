const express = require('express')
var app = express()
const path = require('path')

/**
 * Esto deberia estar del lado del Cliente {Creo}
 * 
 * Redirects to corresponding view.
 * @param {String} path 
 */

/**
 * HOME
 */

app.get('/', function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/index'));
})

/**
 * USERS
 */

app.get('/usuarios', function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/user'), {
    title: "Usuario"
  });
})

/**
 * TICKETS
 */

app.get('/tickets', function (req, res) {
  res.render(path.resolve(__dirname, '../../public/views/ticket'))
})

module.exports = app;