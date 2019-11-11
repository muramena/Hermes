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
 * Creates specialist and saves it in the DB.
 * @module specialist
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, specialist.
 */
app.post('/specialist', specialist_controller.specialist_create);


/**
 * Update a specialist from the DB by ID.
 * @module specialist
 * @function
 * @param {String} path
 * @param {Function} callback 
 * @return {Object} - Status, specialist.
 */
app.put('/specialist/update/:id', specialist_controller.specialist_update_by_id);

/**
 * Update a specialist sector from the DB by ID
 * @module specialists
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} id - req.params.id specialist id
 * @return {Object} - Status, specialists.
 */
app.put('/specialist/updatesector', specialist_controller.specialist_assign_to_sector_by_id);

module.exports = app;