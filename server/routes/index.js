const express = require('express');
var app = express();
const user = require('./user');
const ticket = require('./ticket');
const views = require('./views');

app.use(views);
app.use(user);
app.use(ticket);

module.exports = app;