const express = require('express');
var app = express();
const login = require('./login');
const specialist = require('./specialist');
const ticket = require('./ticket');
const user = require('./user');
const sector = require('./sector');
const views = require('./views');

app.use(login);
app.use(specialist);
app.use(sector);
app.use(ticket);
app.use(user);
app.use(views);

module.exports = app;