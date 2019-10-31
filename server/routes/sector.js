const express = require('express')
const sector_controller = require('../controllers/sector_controller')

/**
 * express module
 */

 var app = express();

/**
 * Gets all sector from the DB.
 * @module sector
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, sector.
 */
app.get('/sector', sector_controller.sector_all);

 /**
 * Creates sector and saves it in the DB.
 * @module sector
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, sector.
 */
app.post('/sector', sector_controller.sector_create);

 /**
 * Update a sector from the DB by ID
 * @module sectors
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - Status, sector.
 */
app.put('/sector/update/:id', sector_controller.sector_update_by_id);

module.exports = app;