const express = require('express');
var app = express();
const login = require('./login');
const user = require('./user');
const ticket = require('./ticket');
const views = require('./views');

app.use(login);
app.use(user);
app.use(ticket);
app.use(views);

module.exports = app;