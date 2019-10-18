const express = require('express');
var app = express();

app.use(require('./users'));

module.exports = app;