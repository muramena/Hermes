const express = require('express')
const db = require('mongoose');
const path = require('path')
const user_controller = require('../controllers/user_controller');

/**
 * express module
 */
var app = express()

/**
 * Gets all users from the DB.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, users.
 */
app.get('/user', user_controller.user_all);

/**
 * Creates user and saves it in the DB.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.post('/user', user_controller.user_create);

/**
 * Get a user from the DB.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.get('/user/:id', user_controller.user_details);

/**
 * Update a user from the DB by ID.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.put('/user/update/:id', user_controller.user_update_by_id);

/**
 * Delete a user from the DB by ID.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.put('/user/delete/:id', user_controller.user_delete_by_id);

/**
 * Get all tickets from a user.
 * @module user
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, user.
 */
app.get('/user/tickets/:id', user_controller.user_tickets);

module.exports = app;