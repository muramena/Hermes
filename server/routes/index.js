const express = require('express')
var app = express()

app.use(require('./user'))

module.exports = app