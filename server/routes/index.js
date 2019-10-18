const express = require('express');
var app = express();
const user = require('./user');
const ticket = require('./ticket');

app.use(user);
app.use(ticket);

module.exports = app;