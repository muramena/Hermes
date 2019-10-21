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
  res.sendFile(path.resolve(__dirname, '../../../public/views/home/index.html'));
})

/**
 * AUTENTICATION
 */

app.get('/login', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/signin/index.html'))
})

app.get('/registarse', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/signup/index.html'))
})

/**
 * USERS
 */

app.get('/usuarios', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/user/index.html'));
})

/**
 * TICKETS
 */

app.get('/tickets', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/ticket/index.html'))
})

app.get('/tickets/assignar', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/ticket/assign.html'))
})

app.get('/tickets/crear', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/ticket/create.html'))
})

app.get('/tickets/divide', function (req, res) {
  res.sendfile(path.resolve( __dirname, '../../public/views/ticket/divide.html'))
})

app.get('/tickets/seguimiento', function( requ, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/ticket/watch.html'))
})

/**
 * FACTOR CARGA
 */

app.get('/factorDeCarga', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/ticket/index.html'))
})

/**
* REPORTES
*/

app.get('/reportes', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/ticket/reportes.html'))
})

/**
 * ESPECIALISTAS
 */

app.get('/especialistas', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../../public/views/escpecialistas'))
})


module.exports = app;