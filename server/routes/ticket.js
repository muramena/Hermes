const express = require('express')
const db = require('mongoose');
const path = require('path')
const ticket_controller = require('../controllers/ticket_controller');

/**
 * express module
 */
var app = express()

/**
 * Gets all ticket from the DB.
 * @module ticket
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, ticket.
 */
app.get('/ticket', ticket_controller.ticket_all);

/**
 * Creates ticket and saves it in the DB.
 * @module ticket
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, ticket.
 */
app.post('/ticket', ticket_controller.ticket_create);


module.exports = app;