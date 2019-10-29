const express = require('express')
const specialist_controller = require('../controllers/specialist_controller');

/**
 * express module
 */

 var app = express();

/**
 * Gets all specialist from the DB.
 * @module specialist
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, specialist.
 */
app.get('/specialist', specialist_controller.specialist_all);


/**
 * Update a specialist from the DB by ID.
 * @module specialist
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, specialist.
 */
app.put('/specialist/update/:id', specialist_controller.specialist_update_by_id);

module.exports = app;